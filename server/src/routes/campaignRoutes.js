const express = require('express');
const router = express.Router();
const Campaign = require('../models/Campaign');
const Participant = require('../models/Participant');
const Registration = require('../models/Registration');
const Prize = require('../models/Prize');
const Winner = require('../models/Winner');
const { logAudit } = require('../utils/auditLogger');
const { AUDIT_ACTIONS, ROLES, CAMPAIGN_STATUS } = require('../config/constants');
const { protectAdmin, authorize } = require('../middleware/auth');

/**
 * @route   GET /api/campaigns/active
 * @desc    Public get current active campaign with dates, target, and dynamic stats
 */
router.get('/active', async (req, res) => {
  try {
    let campaign = await Campaign.findOne({ status: { $ne: CAMPAIGN_STATUS.COMPLETED } })
      .populate('currentSnapshotRef', 'snapshotVersion totalEligible hashSHA256 frozenAt');

    if (!campaign) {
      campaign = await Campaign.findOne().sort({ createdAt: -1 });
    }

    if (!campaign) {
      return res.status(404).json({ success: false, message: 'No campaign configured yet' });
    }

    // Dynamic real-time participant counts from database
    const totalRegistrations = await Registration.countDocuments({ campaign: campaign._id });
    const eligibleCount = await Participant.countDocuments({
      isMobileVerified: true,
      isEligible: true,
      isDisqualified: false
    });

    res.json({
      success: true,
      data: {
        id: campaign._id,
        title: campaign.title,
        tagline: campaign.tagline,
        slug: campaign.slug,
        joiningStartDate: campaign.joiningStartDate,
        registrationClosingDate: campaign.registrationClosingDate,
        drawDate: campaign.drawDate,
        targetParticipants: campaign.targetParticipants,
        currentParticipants: totalRegistrations,
        eligibleParticipants: eligibleCount,
        status: campaign.status,
        isRegistrationActive: campaign.isRegistrationActive,
        participationFeeEnabled: campaign.participationFeeEnabled,
        branding: campaign.branding,
        rules: campaign.rules,
        currentSnapshot: campaign.currentSnapshotRef
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/campaigns/stats
 * @desc    Admin get comprehensive campaign statistics & chart analytics
 */
router.get('/stats', protectAdmin, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({ status: { $ne: CAMPAIGN_STATUS.COMPLETED } });
    const campaignId = campaign ? campaign._id : null;

    const [
      totalRegistered,
      verifiedParticipants,
      eligibleParticipants,
      disqualifiedParticipants,
      totalPrizesDocs,
      totalWinnersAssigned,
      publishedWinnersCount
    ] = await Promise.all([
      Registration.countDocuments(campaignId ? { campaign: campaignId } : {}),
      Participant.countDocuments({ isMobileVerified: true }),
      Participant.countDocuments({ isMobileVerified: true, isEligible: true, isDisqualified: false }),
      Participant.countDocuments({ isDisqualified: true }),
      Prize.aggregate([
        { $group: { _id: null, totalPrizes: { $sum: '$quantity' }, distinctCategories: { $sum: 1 } } }
      ]),
      Winner.countDocuments(campaignId ? { campaign: campaignId } : {}),
      Winner.countDocuments(campaignId ? { campaign: campaignId, isPublished: true } : { isPublished: true })
    ]);

    const totalPrizesCount = totalPrizesDocs[0]?.totalPrizes || 0;
    const pendingRegistrations = Math.max(0, totalRegistered - verifiedParticipants);

    // Registration trend by day (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyTrends = await Registration.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Breakdown by state
    const stateBreakdown = await Participant.aggregate([
      { $group: { _id: '$state', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);

    res.json({
      success: true,
      stats: {
        totalRegistered,
        verifiedParticipants,
        pendingRegistrations,
        eligibleParticipants,
        disqualifiedParticipants,
        targetParticipants: campaign?.targetParticipants || 10000,
        totalPrizes: totalPrizesCount,
        totalWinners: totalWinnersAssigned,
        publishedWinners: publishedWinnersCount,
        campaignStatus: campaign?.status || 'ACTIVE',
        isRegistrationActive: campaign?.isRegistrationActive || false,
        drawDate: campaign?.drawDate
      },
      charts: {
        dailyTrends,
        stateBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/campaigns
 * @desc    Admin get all campaigns
 */
router.get('/', protectAdmin, async (req, res) => {
  try {
    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json({ success: true, data: campaigns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   PUT /api/campaigns/:id
 * @desc    Admin update campaign configuration (dates, target, rules, legal toggles)
 */
router.put('/:id', protectAdmin, authorize(ROLES.SUPERADMIN, ROLES.ADMIN), async (req, res) => {
  try {
    const {
      title,
      tagline,
      joiningStartDate,
      registrationClosingDate,
      drawDate,
      targetParticipants,
      rules,
      isRegistrationActive,
      participationFeeEnabled,
      branding
    } = req.body;

    const campaign = await Campaign.findById(req.params.id);
    if (!campaign) {
      return res.status(404).json({ success: false, message: 'Campaign not found' });
    }

    if (title) campaign.title = title;
    if (tagline) campaign.tagline = tagline;
    if (joiningStartDate) campaign.joiningStartDate = new Date(joiningStartDate);
    if (registrationClosingDate) campaign.registrationClosingDate = new Date(registrationClosingDate);
    if (drawDate) campaign.drawDate = new Date(drawDate);
    if (targetParticipants) campaign.targetParticipants = Number(targetParticipants);
    if (rules) campaign.rules = rules;
    if (isRegistrationActive !== undefined) campaign.isRegistrationActive = isRegistrationActive;
    if (participationFeeEnabled !== undefined) campaign.participationFeeEnabled = participationFeeEnabled;
    if (branding) campaign.branding = { ...campaign.branding, ...branding };

    await campaign.save();

    await logAudit(req, {
      action: AUDIT_ACTIONS.CAMPAIGN_UPDATE,
      entityType: 'Campaign',
      entityId: campaign._id,
      description: `Campaign "${campaign.title}" configuration updated by ${req.user.name}`,
      details: req.body
    });

    res.json({
      success: true,
      message: 'Campaign updated successfully',
      data: campaign
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
