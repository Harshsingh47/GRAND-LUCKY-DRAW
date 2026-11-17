const express = require('express');
const router = express.Router();
const Winner = require('../models/Winner');
const WinnerApproval = require('../models/WinnerApproval');
const Prize = require('../models/Prize');
const Campaign = require('../models/Campaign');
const Participant = require('../models/Participant');
const Registration = require('../models/Registration');
const ParticipantSnapshot = require('../models/ParticipantSnapshot');
const DrawEvent = require('../models/DrawEvent');
const { logAudit } = require('../utils/auditLogger');
const { AUDIT_ACTIONS, APPROVAL_STATUS, CAMPAIGN_STATUS, ROLES } = require('../config/constants');
const { protectAdmin, authorize } = require('../middleware/auth');

/**
 * @route   GET /api/winners/search-eligible
 * @desc    Search eligible participants in the current frozen snapshot for quick lookup
 */
router.get('/search-eligible', protectAdmin, async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim().length < 2) {
      return res.json({ success: true, data: [] });
    }

    const term = q.trim();
    const snapshot = await ParticipantSnapshot.findOne({ isCurrent: true });
    if (!snapshot) {
      return res.status(400).json({ success: false, message: 'No frozen participant snapshot active' });
    }

    // Find registrations matching term and within eligible snapshot IDs
    const registrations = await Registration.find({
      participantId: {
        $in: snapshot.eligibleParticipantIds,
        $regex: term,
        $options: 'i'
      }
    })
    .populate('participant', 'fullName mobile city state isEligible isDisqualified')
    .limit(10);

    // Also check if any are already winners
    const existingWinners = await Winner.find({
      participantId: { $in: registrations.map(r => r.participantId) }
    });
    const winnerIdMap = new Set(existingWinners.map(w => w.participantId));

    const results = registrations.map(reg => ({
      participantId: reg.participantId,
      fullName: reg.participant?.fullName,
      mobilePartial: reg.participant?.mobile ? `${reg.participant.mobile.substring(0, 4)}XXXX${reg.participant.mobile.substring(8)}` : '',
      city: reg.participant?.city,
      state: reg.participant?.state,
      alreadyWon: winnerIdMap.has(reg.participantId)
    }));

    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/winners/enter
 * @desc    Step 4 & 5: Enter Winners with Comprehensive Backend Validation
 */
router.post('/enter', protectAdmin, authorize(ROLES.SUPERADMIN, ROLES.ADMIN), async (req, res) => {
  try {
    const { prizeId, participantIds, notes } = req.body;

    if (!prizeId || !Array.isArray(participantIds) || participantIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Prize ID and a non-empty array of participant IDs are required'
      });
    }

    // 1. Get Campaign and Frozen Snapshot
    const campaign = await Campaign.findOne({ status: { $ne: CAMPAIGN_STATUS.COMPLETED } });
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Active campaign not found' });
    }

    const snapshot = await ParticipantSnapshot.findOne({ campaign: campaign._id, isCurrent: true });
    if (!snapshot) {
      return res.status(400).json({
        success: false,
        message: 'Cannot enter winners: The participant list has not been frozen yet! Freeze list in Step 2 first.'
      });
    }

    // 2. Get Prize and verify quota
    const prize = await Prize.findById(prizeId);
    if (!prize) {
      return res.status(404).json({ success: false, message: 'Selected prize not found' });
    }

    // Check for duplicates in submitted list
    const cleanIds = participantIds.map(id => id.trim().toUpperCase());
    const uniqueSubmitted = new Set(cleanIds);
    if (uniqueSubmitted.size !== cleanIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate participant IDs detected within your submitted list'
      });
    }

    // Check if prize quota would be exceeded
    const existingPrizeWinnersCount = await Winner.countDocuments({
      campaign: campaign._id,
      prize: prize._id,
      status: { $in: ['PENDING_APPROVAL', 'APPROVED'] }
    });

    if (existingPrizeWinnersCount + cleanIds.length > prize.quantity) {
      return res.status(400).json({
        success: false,
        message: `Winner quota exceeded for "${prize.name}". Maximum allowed: ${prize.quantity}, already assigned/pending: ${existingPrizeWinnersCount}, attempted to add: ${cleanIds.length}.`
      });
    }

    // 3. Step 5 Validations: Check each participant ID against frozen list & database
    const frozenSet = new Set(snapshot.eligibleParticipantIds);
    const validationErrors = [];
    const validRegistrations = [];

    for (const pId of cleanIds) {
      // Must be in frozen snapshot
      if (!frozenSet.has(pId)) {
        validationErrors.push(`Participant ID "${pId}" is NOT in the frozen eligible list snapshot.`);
        continue;
      }

      // Check Registration and Participant existence
      const reg = await Registration.findOne({ participantId: pId, campaign: campaign._id })
        .populate('participant');

      if (!reg || !reg.participant) {
        validationErrors.push(`Participant ID "${pId}" does not exist in campaign.`);
        continue;
      }

      if (reg.participant.isDisqualified) {
        validationErrors.push(`Participant "${pId}" is disqualified (${reg.participant.disqualificationReason || 'No reason specified'}).`);
        continue;
      }

      if (!reg.participant.isMobileVerified) {
        validationErrors.push(`Participant "${pId}" is not mobile-verified.`);
        continue;
      }

      // Check if participant already won another prize in this campaign
      const existingWin = await Winner.findOne({
        campaign: campaign._id,
        participantId: pId,
        status: { $in: ['PENDING_APPROVAL', 'APPROVED'] }
      }).populate('prize', 'name');

      if (existingWin) {
        validationErrors.push(`Participant "${pId}" has already won a prize: "${existingWin.prize?.name}". Multiple wins are prohibited.`);
        continue;
      }

      validRegistrations.push(reg);
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed for one or more participant IDs',
        errors: validationErrors
      });
    }

    // 4. Create Winner records with status 'PENDING_APPROVAL'
    const winnerRecords = [];
    let startRank = existingPrizeWinnersCount + 1;

    for (const reg of validRegistrations) {
      const winner = await Winner.create({
        campaign: campaign._id,
        prize: prize._id,
        participant: reg.participant._id,
        participantId: reg.participantId,
        snapshot: snapshot._id,
        rank: startRank++,
        status: 'PENDING_APPROVAL',
        enteredBy: req.user._id,
        enteredAt: new Date(),
        isPublished: false
      });
      winnerRecords.push(winner);
    }

    // 5. Create WinnerApproval record for 2-step verification workflow
    const approval = await WinnerApproval.create({
      campaign: campaign._id,
      prize: prize._id,
      enteredBy: req.user._id,
      enteredAt: new Date(),
      submittedParticipantIds: cleanIds,
      winnerRecords: winnerRecords.map(w => w._id),
      status: APPROVAL_STATUS.PENDING_REVIEW,
      comments: notes || `Entered ${cleanIds.length} manual winner(s) for ${prize.name}`
    });

    // 6. Record AuditLog
    await logAudit(req, {
      action: AUDIT_ACTIONS.WINNER_ENTERED,
      entityType: 'WinnerApproval',
      entityId: approval._id,
      description: `Admin ${req.user.name} entered ${cleanIds.length} winner(s) for "${prize.name}". Awaiting secondary admin review.`,
      details: { prize: prize.name, participantIds: cleanIds, approvalId: approval._id }
    });

    res.status(201).json({
      success: true,
      message: `Successfully entered ${cleanIds.length} winner(s) for "${prize.name}". Submitted to dual-admin approval queue.`,
      data: {
        approvalId: approval._id,
        prize: prize.name,
        winnersEntered: cleanIds,
        status: approval.status,
        enteredBy: req.user.name
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/winners/approvals
 * @desc    Step 6: List pending and completed winner approvals
 */
router.get('/approvals', protectAdmin, async (req, res) => {
  try {
    const approvals = await WinnerApproval.find()
      .populate('campaign', 'title')
      .populate('prize', 'name quantity imageUrl')
      .populate('enteredBy', 'name email role')
      .populate('reviewedBy', 'name email role')
      .sort({ createdAt: -1 });

    res.json({ success: true, data: approvals });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/winners/approvals/:id/review
 * @desc    Step 6: Two-Person Review & Approval Workflow (Self-Approval Prohibited!)
 */
router.post('/approvals/:id/review', protectAdmin, authorize(ROLES.SUPERADMIN, ROLES.ADMIN), async (req, res) => {
  try {
    const { action, comments, rejectionReason } = req.body; // action: 'APPROVE' or 'REJECT'

    if (!['APPROVE', 'REJECT'].includes(action)) {
      return res.status(400).json({ success: false, message: 'Action must be either APPROVE or REJECT' });
    }

    const approval = await WinnerApproval.findById(req.params.id)
      .populate('prize')
      .populate('enteredBy', 'name email');

    if (!approval) {
      return res.status(404).json({ success: false, message: 'Approval submission not found' });
    }

    if (approval.status !== APPROVAL_STATUS.PENDING_REVIEW) {
      return res.status(400).json({
        success: false,
        message: `This submission has already been reviewed with status: ${approval.status}`
      });
    }

    // MANDATORY SECURITY CONSTRAINT:
    // A single admin must NOT be able to approve their own entries!
    if (approval.enteredBy._id.toString() === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Security Violation: Two-person integrity rule strictly enforced. You cannot review or approve your own winner entries. Another authorized administrator must review this.'
      });
    }

    if (action === 'REJECT') {
      if (!rejectionReason || rejectionReason.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'A mandatory rejection reason is required when rejecting winner submissions'
        });
      }

      approval.status = APPROVAL_STATUS.REJECTED;
      approval.reviewedBy = req.user._id;
      approval.reviewedAt = new Date();
      approval.rejectionReason = rejectionReason.trim();
      approval.comments = comments || '';
      await approval.save();

      // Update associated Winner records to REJECTED
      await Winner.updateMany(
        { _id: { $in: approval.winnerRecords } },
        { $set: { status: 'REJECTED' } }
      );

      await logAudit(req, {
        action: AUDIT_ACTIONS.WINNER_REJECTED,
        entityType: 'WinnerApproval',
        entityId: approval._id,
        description: `Admin ${req.user.name} REJECTED winner submission for "${approval.prize?.name}". Reason: ${rejectionReason}`,
        details: { rejectionReason, submittedBy: approval.enteredBy?.name }
      });

      return res.json({
        success: true,
        message: 'Winner submission was rejected. Rejection reason and audit log recorded.',
        data: approval
      });
    }

    // APPROVE
    approval.status = APPROVAL_STATUS.APPROVED;
    approval.reviewedBy = req.user._id;
    approval.reviewedAt = new Date();
    approval.comments = comments || 'Approved after manual verification';
    await approval.save();

    // Update associated Winner records to APPROVED
    await Winner.updateMany(
      { _id: { $in: approval.winnerRecords } },
      { $set: { status: 'APPROVED' } }
    );

    // Update Prize winnersCount
    await Prize.findByIdAndUpdate(approval.prize._id, {
      $inc: { winnersCount: approval.submittedParticipantIds.length }
    });

    await logAudit(req, {
      action: AUDIT_ACTIONS.WINNER_APPROVED,
      entityType: 'WinnerApproval',
      entityId: approval._id,
      description: `Admin ${req.user.name} APPROVED winner submission for "${approval.prize?.name}" entered by ${approval.enteredBy?.name}`,
      details: { prize: approval.prize?.name, winnerIds: approval.submittedParticipantIds }
    });

    res.json({
      success: true,
      message: 'Winner submission successfully approved! Ready for publication.',
      data: approval
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/winners/admin
 * @desc    Admin list all winners with filter by prize, approval status, publication status
 */
router.get('/admin', protectAdmin, async (req, res) => {
  try {
    const { prizeId, status, published } = req.query;
    let query = {};

    if (prizeId) query.prize = prizeId;
    if (status) query.status = status;
    if (published !== undefined) query.isPublished = published === 'true';

    const winners = await Winner.find(query)
      .populate('prize')
      .populate('participant', 'fullName mobile email city state')
      .populate('enteredBy', 'name email')
      .populate('publishedBy', 'name email')
      .sort({ rank: 1, createdAt: 1 });

    res.json({ success: true, data: winners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/winners/publish
 * @desc    Step 7: Publish Results to Public Website (Prize-wise or All at Once)
 */
router.post('/publish', protectAdmin, authorize(ROLES.SUPERADMIN, ROLES.ADMIN), async (req, res) => {
  try {
    const { prizeId, publishAll = false } = req.body;

    let filter = { status: 'APPROVED', isPublished: false };
    if (!publishAll && prizeId) {
      filter.prize = prizeId;
    }

    const winnersToPublish = await Winner.find(filter);

    if (winnersToPublish.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No approved unpublished winners found matching your selection'
      });
    }

    const now = new Date();

    // Mark winners as published
    await Winner.updateMany(
      { _id: { $in: winnersToPublish.map(w => w._id) } },
      {
        $set: {
          isPublished: true,
          publishedAt: now,
          publishedBy: req.user._id
        }
      }
    );

    // Update Prize status
    if (prizeId) {
      await Prize.findByIdAndUpdate(prizeId, { isResultsPublished: true });
    } else {
      const distinctPrizes = [...new Set(winnersToPublish.map(w => w.prize.toString()))];
      await Prize.updateMany({ _id: { $in: distinctPrizes } }, { isResultsPublished: true });
    }

    // Update Campaign status
    const campaign = await Campaign.findOne({ status: { $ne: CAMPAIGN_STATUS.COMPLETED } });
    if (campaign) {
      campaign.status = CAMPAIGN_STATUS.RESULTS_PUBLISHED;
      campaign.resultsPublishedAt = now;
      await campaign.save();
    }

    // Record DrawEvent
    await DrawEvent.create({
      campaign: campaign?._id,
      stage: 'WINNERS_PUBLISHED',
      title: 'Official Winners Published',
      description: `Published ${winnersToPublish.length} winner(s) on the public website by ${req.user.name}`,
      executedBy: req.user._id,
      metadata: { publishedCount: winnersToPublish.length, prizeId, publishAll }
    });

    // Record AuditLog
    await logAudit(req, {
      action: AUDIT_ACTIONS.WINNERS_PUBLISHED,
      entityType: 'Winner',
      description: `Admin ${req.user.name} published ${winnersToPublish.length} winners to public website`,
      details: { count: winnersToPublish.length, prizeId, publishAll }
    });

    res.json({
      success: true,
      message: `Successfully published ${winnersToPublish.length} official winners to the website.`,
      publishedCount: winnersToPublish.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/winners/unpublish
 * @desc    Unpublish results with mandatory reason (Super Admin only)
 */
router.post('/unpublish', protectAdmin, authorize(ROLES.SUPERADMIN), async (req, res) => {
  try {
    const { prizeId, reason } = req.body;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'A mandatory documented correction reason is required to unpublish results'
      });
    }

    let filter = { isPublished: true };
    if (prizeId) filter.prize = prizeId;

    const count = await Winner.countDocuments(filter);
    if (count === 0) {
      return res.status(400).json({ success: false, message: 'No published winners found to unpublish' });
    }

    await Winner.updateMany(filter, {
      $set: { isPublished: false, publishedAt: null, publishedBy: null }
    });

    if (prizeId) {
      await Prize.findByIdAndUpdate(prizeId, { isResultsPublished: false });
    }

    await logAudit(req, {
      action: AUDIT_ACTIONS.WINNERS_UNPUBLISHED,
      entityType: 'Winner',
      description: `Super Admin ${req.user.name} unpublished ${count} winner results. Reason: ${reason}`,
      details: { reason, prizeId, count }
    });

    res.json({
      success: true,
      message: `Unpublished ${count} winner records.`,
      count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/winners/public
 * @desc    Public official winners page (Masked info, categorized by prize)
 */
router.get('/public', async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ status: { $ne: CAMPAIGN_STATUS.COMPLETED } });

    // Fetch published winners populated with prize & participant
    const publishedWinners = await Winner.find({ isPublished: true })
      .populate('prize')
      .populate('participant', 'fullName city state')
      .sort({ rank: 1 });

    // Group winners by prize
    const groupedMap = {};
    for (const win of publishedWinners) {
      const prizeId = win.prize._id.toString();
      if (!groupedMap[prizeId]) {
        groupedMap[prizeId] = {
          prize: {
            id: win.prize._id,
            name: win.prize.name,
            category: win.prize.category,
            quantity: win.prize.quantity,
            imageUrl: win.prize.imageUrl,
            description: win.prize.description
          },
          winners: []
        };
      }

      // Privacy Masking: "Rahul Sharma" -> "Rahul S*****"
      const fullName = win.participant?.fullName || 'Participant';
      const nameParts = fullName.split(' ');
      let maskedName = nameParts[0];
      if (nameParts.length > 1) {
        maskedName += ' ' + nameParts[1].substring(0, 1) + '*****';
      } else if (maskedName.length > 3) {
        maskedName = maskedName.substring(0, 3) + '*****';
      }

      groupedMap[prizeId].winners.push({
        rank: win.rank,
        participantId: win.participantId,
        maskedName,
        city: win.participant?.city || '',
        state: win.participant?.state || '',
        publishedAt: win.publishedAt
      });
    }

    res.json({
      success: true,
      campaign: {
        title: campaign?.title || 'Grand Lucky Draw',
        drawDate: campaign?.drawDate,
        organizer: campaign?.branding?.organizerName || 'Grand Lucky Draw'
      },
      totalPublishedWinners: publishedWinners.length,
      categories: Object.values(groupedMap)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/winners/check/:participantId
 * @desc    Public search endpoint to verify if a participant ID won
 */
router.get('/check/:participantId', async (req, res) => {
  try {
    const pId = req.params.participantId.trim().toUpperCase();

    const winner = await Winner.findOne({ participantId: pId, isPublished: true })
      .populate('prize', 'name category imageUrl description')
      .populate('participant', 'fullName city state');

    if (!winner) {
      return res.json({
        success: true,
        isWinner: false,
        participantId: pId,
        message: 'No winning record found for this participant ID in published results.'
      });
    }

    // Mask name for privacy in public lookup
    const fullName = winner.participant?.fullName || 'Participant';
    const nameParts = fullName.split(' ');
    const maskedName = nameParts[0] + (nameParts[1] ? ' ' + nameParts[1][0] + '*****' : '');

    res.json({
      success: true,
      isWinner: true,
      participantId: pId,
      maskedName,
      city: winner.participant?.city,
      state: winner.participant?.state,
      prize: {
        name: winner.prize.name,
        category: winner.prize.category,
        imageUrl: winner.prize.imageUrl
      },
      publishedAt: winner.publishedAt,
      claimInstructions: 'To claim your prize, please proceed to the Winner Verification and Claim portal with your registered mobile number.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
