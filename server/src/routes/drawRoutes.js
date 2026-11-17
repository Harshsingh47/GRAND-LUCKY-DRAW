const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const Participant = require('../models/Participant');
const Registration = require('../models/Registration');
const ParticipantSnapshot = require('../models/ParticipantSnapshot');
const DrawEvent = require('../models/DrawEvent');
const { generateSnapshotHash, verifySnapshotHash } = require('../utils/hashUtil');
const { buildExcelBuffer, buildCsvString } = require('../utils/excelExporter');
const { logAudit } = require('../utils/auditLogger');
const { AUDIT_ACTIONS, CAMPAIGN_STATUS, ROLES } = require('../config/constants');
const { protectAdmin, authorize } = require('../middleware/auth');

/**
 * @route   POST /api/draw/close-registration
 * @desc    Step 1: Close Registration
 */
router.post('/close-registration', protectAdmin, authorize(ROLES.SUPERADMIN, ROLES.ADMIN), async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ status: { $ne: CAMPAIGN_STATUS.COMPLETED } });
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Active campaign not found' });
    }

    if (!campaign.isRegistrationActive && campaign.status === CAMPAIGN_STATUS.REGISTRATION_CLOSED) {
      return res.status(400).json({ success: false, message: 'Registration is already closed' });
    }

    // Stop registrations
    campaign.isRegistrationActive = false;
    campaign.status = CAMPAIGN_STATUS.REGISTRATION_CLOSED;
    campaign.closedAt = new Date();
    await campaign.save();

    // Calculate final counts
    const totalRegistered = await Registration.countDocuments({ campaign: campaign._id });
    const eligibleCount = await Participant.countDocuments({
      isMobileVerified: true,
      isEligible: true,
      isDisqualified: false
    });
    const disqualifiedCount = await Participant.countDocuments({ isDisqualified: true });

    // Record DrawEvent
    await DrawEvent.create({
      campaign: campaign._id,
      stage: 'REGISTRATION_CLOSED',
      title: 'Registration Formally Closed',
      description: `Registration closed by ${req.user.name}. Final eligible count: ${eligibleCount}`,
      executedBy: req.user._id,
      metadata: { totalRegistered, eligibleCount, disqualifiedCount, closedAt: campaign.closedAt }
    });

    // Record Audit Log
    await logAudit(req, {
      action: AUDIT_ACTIONS.REGISTRATION_CLOSE,
      entityType: 'Campaign',
      entityId: campaign._id,
      description: `Registration closed by Admin ${req.user.name}. Final eligible count: ${eligibleCount}`,
      details: { totalRegistered, eligibleCount, disqualifiedCount }
    });

    res.json({
      success: true,
      message: 'Registration successfully closed. No new registrations or modifications can occur.',
      data: {
        campaignId: campaign._id,
        status: campaign.status,
        closedAt: campaign.closedAt,
        stats: {
          totalRegistered,
          eligibleCount,
          disqualifiedCount
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/draw/freeze-participants
 * @desc    Step 2: Freeze Participant List & Compute SHA-256 Cryptographic Hash
 */
router.post('/freeze-participants', protectAdmin, authorize(ROLES.SUPERADMIN, ROLES.ADMIN), async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ status: { $ne: CAMPAIGN_STATUS.COMPLETED } });
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Active campaign not found' });
    }

    // Ensure registration is closed before freezing
    if (campaign.isRegistrationActive) {
      campaign.isRegistrationActive = false;
      campaign.status = CAMPAIGN_STATUS.REGISTRATION_CLOSED;
      campaign.closedAt = new Date();
      await campaign.save();
    }

    // Find all registrations for verified and eligible participants
    const eligibleRegistrations = await Registration.find({
      campaign: campaign._id,
      status: 'ACTIVE'
    }).populate('participant');

    // Filter strictly for verified, eligible, non-disqualified
    const strictlyEligible = eligibleRegistrations.filter(r => 
      r.participant && 
      r.participant.isMobileVerified && 
      r.participant.isEligible && 
      !r.participant.isDisqualified
    );

    if (strictlyEligible.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot freeze participant list: Zero eligible verified participants found'
      });
    }

    const participantIds = strictlyEligible.map(r => r.participantId);

    // Compute cryptographic SHA-256 hash over canonically sorted list
    const { hash, count } = generateSnapshotHash(participantIds);

    // Mark previous snapshots as superceded
    await ParticipantSnapshot.updateMany(
      { campaign: campaign._id },
      { $set: { isCurrent: false } }
    );

    // Determine snapshot version
    const prevCount = await ParticipantSnapshot.countDocuments({ campaign: campaign._id });
    const snapshotVersion = prevCount + 1;

    // Create immutable snapshot
    const snapshot = await ParticipantSnapshot.create({
      campaign: campaign._id,
      snapshotVersion,
      totalEligible: count,
      eligibleParticipantIds: participantIds.sort(),
      hashSHA256: hash,
      frozenBy: req.user._id,
      frozenAt: new Date(),
      fileName: `GrandLuckyDraw_FrozenList_v${snapshotVersion}_${hash.substring(0, 8)}.xlsx`,
      notes: req.body.notes || 'Official frozen participant list for manual offline draw',
      isCurrent: true
    });

    // Update campaign
    campaign.status = CAMPAIGN_STATUS.DRAW_IN_PROGRESS;
    campaign.frozenAt = new Date();
    campaign.currentSnapshotRef = snapshot._id;
    await campaign.save();

    // Record DrawEvent
    await DrawEvent.create({
      campaign: campaign._id,
      stage: 'PARTICIPANTS_FROZEN',
      title: `Participant List Frozen (Snapshot v${snapshotVersion})`,
      description: `Cryptographic SHA-256 Hash generated: ${hash}. Total eligible entries: ${count}`,
      executedBy: req.user._id,
      metadata: { snapshotId: snapshot._id, snapshotVersion, hashSHA256: hash, totalEligible: count }
    });

    // Record AuditLog
    await logAudit(req, {
      action: AUDIT_ACTIONS.PARTICIPANTS_FROZEN,
      entityType: 'ParticipantSnapshot',
      entityId: snapshot._id,
      description: `Frozen snapshot v${snapshotVersion} created with ${count} participants. SHA-256: ${hash}`,
      details: { snapshotVersion, hashSHA256: hash, totalEligible: count }
    });

    res.json({
      success: true,
      message: 'Participant list frozen successfully. SHA-256 cryptographic hash generated and locked.',
      data: {
        snapshotId: snapshot._id,
        snapshotVersion: snapshot.snapshotVersion,
        totalEligible: snapshot.totalEligible,
        hashSHA256: snapshot.hashSHA256,
        frozenAt: snapshot.frozenAt,
        frozenBy: req.user.name,
        campaignStatus: campaign.status
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/draw/latest-snapshot
 * @desc    Get latest frozen snapshot metadata
 */
router.get('/latest-snapshot', protectAdmin, async (req, res) => {
  try {
    const snapshot = await ParticipantSnapshot.findOne({ isCurrent: true })
      .populate('frozenBy', 'name email')
      .populate('campaign', 'title');

    if (!snapshot) {
      return res.status(404).json({ success: false, message: 'No frozen participant snapshot found' });
    }

    res.json({
      success: true,
      data: snapshot
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/draw/snapshots
 * @desc    Get all snapshots history
 */
router.get('/snapshots', protectAdmin, async (req, res) => {
  try {
    const snapshots = await ParticipantSnapshot.find()
      .populate('frozenBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: snapshots });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/draw/snapshot/:id/export
 * @desc    Export frozen snapshot to Excel / CSV with SHA-256 Header for offline manual draw
 */
router.get('/snapshot/:id/export', protectAdmin, async (req, res) => {
  try {
    const snapshot = await ParticipantSnapshot.findById(req.params.id)
      .populate('campaign', 'title drawDate');

    if (!snapshot) {
      return res.status(404).json({ success: false, message: 'Snapshot not found' });
    }

    const format = req.query.format === 'csv' ? 'csv' : 'xlsx';

    // Retrieve full participant details for the frozen IDs
    const registrations = await Registration.find({
      participantId: { $in: snapshot.eligibleParticipantIds }
    }).populate('participant').sort({ participantId: 1 });

    const exportRows = registrations.map((reg, idx) => ({
      'S.No': idx + 1,
      'Participant ID': reg.participantId,
      'Full Name': reg.participant?.fullName || '',
      'Mobile (Partial)': reg.participant?.mobile ? `${reg.participant.mobile.substring(0, 4)}XXXX${reg.participant.mobile.substring(8)}` : '',
      'State': reg.participant?.state || '',
      'City': reg.participant?.city || '',
      'Ticket Number': reg.ticketNumber,
      'Snapshot Version': snapshot.snapshotVersion,
      'Snapshot SHA256 Hash': snapshot.hashSHA256
    }));

    if (format === 'csv') {
      const csvData = buildCsvString(exportRows);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="Frozen_Participants_v${snapshot.snapshotVersion}.csv"`);
      return res.send(csvData);
    } else {
      const buffer = buildExcelBuffer(exportRows, `Frozen_v${snapshot.snapshotVersion}`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="Frozen_Participants_v${snapshot.snapshotVersion}.xlsx"`);
      return res.send(buffer);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/draw/verify-snapshot
 * @desc    Cryptographically verify the integrity of the frozen snapshot
 */
router.post('/verify-snapshot', protectAdmin, async (req, res) => {
  try {
    const { snapshotId } = req.body;
    const snapshot = await ParticipantSnapshot.findById(snapshotId);

    if (!snapshot) {
      return res.status(404).json({ success: false, message: 'Snapshot not found' });
    }

    const { hash } = generateSnapshotHash(snapshot.eligibleParticipantIds);
    const isTamperFree = hash.toLowerCase() === snapshot.hashSHA256.toLowerCase();

    res.json({
      success: true,
      verified: isTamperFree,
      computedHash: hash,
      storedHash: snapshot.hashSHA256,
      totalEntries: snapshot.eligibleParticipantIds.length,
      status: isTamperFree ? 'INTEGRITY_VERIFIED_TAMPER_FREE' : 'TAMPERING_DETECTED'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
