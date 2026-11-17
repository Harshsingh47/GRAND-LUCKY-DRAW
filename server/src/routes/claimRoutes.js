const express = require('express');
const router = express.Router();
const Winner = require('../models/Winner');
const PrizeClaim = require('../models/PrizeClaim');
const Participant = require('../models/Participant');
const Prize = require('../models/Prize');
const { uploadClaimDocument } = require('../middleware/upload');
const { generateOtp, sendOtp, sendSmsNotification } = require('../utils/otpService');
const { logAudit } = require('../utils/auditLogger');
const { CLAIM_STATUS, AUDIT_ACTIONS, ROLES } = require('../config/constants');
const { protectAdmin, authorize } = require('../middleware/auth');
const { otpLimiter } = require('../middleware/rateLimiter');

/**
 * @route   POST /api/claims/verify-initiate
 * @desc    Winner enters Participant ID + Mobile to initiate verification with OTP
 */
router.post('/verify-initiate', otpLimiter, async (req, res) => {
  try {
    const { participantId, mobile } = req.body;

    if (!participantId || !mobile) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both Participant ID and registered mobile number'
      });
    }

    const cleanId = participantId.trim().toUpperCase();
    const cleanMobile = mobile.trim();

    // 1. Check if participant exists with this mobile
    const participant = await Participant.findOne({ mobile: cleanMobile }).select('+verificationOtp +otpExpiresAt');
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'No participant registered with this mobile number'
      });
    }

    // 2. Check if this participant is an officially published winner
    const winner = await Winner.findOne({
      participantId: cleanId,
      participant: participant._id,
      isPublished: true
    }).populate('prize');

    if (!winner) {
      return res.status(404).json({
        success: false,
        message: 'This participant ID is either not an officially published winner or the mobile number does not match registration records.'
      });
    }

    // 3. Generate & send verification OTP
    const otp = generateOtp();
    participant.verificationOtp = otp;
    participant.otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await participant.save();

    const sendRes = await sendOtp(cleanMobile, otp, 'Winner Claim Verification');

    res.json({
      success: true,
      message: 'Verification OTP sent to your registered mobile number',
      debugOtp: sendRes.debugOtp
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/claims/verify-direct
 * @desc    Direct winner verification with Participant ID + Mobile (No OTP required)
 */
router.post('/verify-direct', async (req, res) => {
  try {
    const { participantId, mobile } = req.body;

    if (!participantId || !mobile) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both Participant ID and registered mobile number'
      });
    }

    const cleanId = participantId.trim().toUpperCase();
    const cleanMobile = mobile.trim();

    const participant = await Participant.findOne({ mobile: cleanMobile });
    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'No participant registered with this mobile number'
      });
    }

    const winner = await Winner.findOne({
      participantId: cleanId,
      participant: participant._id,
      isPublished: true
    }).populate('prize').populate('campaign', 'title drawDate branding');

    if (!winner) {
      return res.status(404).json({
        success: false,
        message: 'This participant ID is either not an officially published winner or the mobile number does not match registration records.'
      });
    }

    // Retrieve or create initial PrizeClaim record
    let claim = await PrizeClaim.findOne({ winner: winner._id });
    if (!claim) {
      claim = await PrizeClaim.create({
        winner: winner._id,
        participantId: cleanId,
        participant: participant._id,
        campaign: winner.campaign._id,
        prize: winner.prize._id,
        claimantName: participant.fullName,
        contactMobile: participant.mobile,
        contactEmail: participant.email,
        city: participant.city,
        state: participant.state,
        claimStatus: CLAIM_STATUS.VERIFIED
      });
    }

    res.json({
      success: true,
      message: 'Identity verified successfully! You are an official winner.',
      data: {
        winnerId: winner._id,
        participantId: cleanId,
        claimId: claim._id,
        claimStatus: claim.claimStatus,
        participant: {
          fullName: participant.fullName,
          mobile: participant.mobile,
          email: participant.email,
          city: participant.city,
          state: participant.state,
          address: participant.address
        },
        prize: {
          id: winner.prize._id,
          name: winner.prize.name,
          category: winner.prize.category,
          imageUrl: winner.prize.imageUrl,
          description: winner.prize.description
        },
        campaign: winner.campaign
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/claims/verify-confirm
 * @desc    Verify and return official winner prize details (OTP optional)
 */
router.post('/verify-confirm', async (req, res) => {
  try {
    const { participantId, mobile, otp } = req.body;

    if (!participantId || !mobile) {
      return res.status(400).json({
        success: false,
        message: 'Participant ID and mobile number are required'
      });
    }

    const cleanId = participantId.trim().toUpperCase();
    const cleanMobile = mobile.trim();

    const participant = await Participant.findOne({ mobile: cleanMobile }).select('+verificationOtp +otpExpiresAt');
    if (!participant) {
      return res.status(404).json({ success: false, message: 'Participant record not found' });
    }

    // If OTP is provided, check it, but allow bypass since number verification is disabled
    if (otp && otp.trim() !== '' && otp.trim() !== '123456') {
      if (participant.verificationOtp && participant.verificationOtp !== otp.trim()) {
        // If wrong OTP explicitly sent
        return res.status(400).json({ success: false, message: 'Invalid OTP. Please check and try again.' });
      }
    }

    const winner = await Winner.findOne({
      participantId: cleanId,
      participant: participant._id,
      isPublished: true
    }).populate('prize').populate('campaign', 'title drawDate branding');

    if (!winner) {
      return res.status(404).json({ success: false, message: 'Winning record not found' });
    }

    // Retrieve or create initial PrizeClaim record
    let claim = await PrizeClaim.findOne({ winner: winner._id });
    if (!claim) {
      claim = await PrizeClaim.create({
        winner: winner._id,
        participantId: cleanId,
        participant: participant._id,
        campaign: winner.campaign._id,
        prize: winner.prize._id,
        claimantName: participant.fullName,
        contactMobile: participant.mobile,
        contactEmail: participant.email,
        city: participant.city,
        state: participant.state,
        claimStatus: CLAIM_STATUS.VERIFIED
      });
    }

    res.json({
      success: true,
      message: 'Identity verified successfully! You are an official winner.',
      data: {
        winnerId: winner._id,
        participantId: cleanId,
        claimId: claim._id,
        claimStatus: claim.claimStatus,
        participant: {
          fullName: participant.fullName,
          mobile: participant.mobile,
          email: participant.email,
          city: participant.city,
          state: participant.state,
          address: participant.address
        },
        prize: {
          id: winner.prize._id,
          name: winner.prize.name,
          category: winner.prize.category,
          imageUrl: winner.prize.imageUrl,
          description: winner.prize.description
        },
        campaign: {
          title: winner.campaign?.title,
          drawDate: winner.campaign?.drawDate,
          organizer: winner.campaign?.branding?.organizerName
        },
        claimDetails: {
          deliveryAddress: claim.deliveryAddress,
          idProofType: claim.idProofType,
          idProofNumber: claim.idProofNumber,
          hasUploadedId: !!claim.idProofDocumentUrl,
          adminNotes: claim.adminNotes,
          rejectionReason: claim.rejectionReason,
          awardedDate: claim.awardedDate
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/claims/submit
 * @desc    Winner submits prize claim information & uploads proof document
 */
router.post('/submit', uploadClaimDocument.single('idDocument'), async (req, res) => {
  try {
    const {
      claimId,
      participantId,
      deliveryAddress,
      city,
      state,
      pinCode,
      idProofType,
      idProofNumber
    } = req.body;

    if (!claimId || !deliveryAddress || !idProofNumber) {
      return res.status(400).json({
        success: false,
        message: 'Delivery address, ID proof number, and Claim ID are required'
      });
    }

    const claim = await PrizeClaim.findById(claimId).populate('prize').populate('participant');
    if (!claim) {
      return res.status(404).json({ success: false, message: 'Prize claim record not found' });
    }

    claim.deliveryAddress = deliveryAddress.trim();
    if (city) claim.city = city.trim();
    if (state) claim.state = state.trim();
    if (pinCode) claim.pinCode = pinCode.trim();
    if (idProofType) claim.idProofType = idProofType;
    claim.idProofNumber = idProofNumber.trim();

    if (req.file) {
      claim.idProofDocumentUrl = `/uploads/claims/${req.file.filename}`;
      claim.claimStatus = CLAIM_STATUS.DOCUMENTS_PENDING;
    } else if (claim.claimStatus === CLAIM_STATUS.PENDING_VERIFICATION) {
      claim.claimStatus = CLAIM_STATUS.VERIFIED;
    }

    await claim.save();

    res.json({
      success: true,
      message: 'Claim details submitted successfully! Our legal and distribution team will verify your submission.',
      data: claim
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/claims/admin
 * @desc    Admin view all prize claims with status filter & search
 */
router.get('/admin', protectAdmin, async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'ALL') {
      query.claimStatus = status;
    }

    if (search && search.trim() !== '') {
      const term = search.trim();
      query.$or = [
        { participantId: { $regex: term, $options: 'i' } },
        { claimantName: { $regex: term, $options: 'i' } },
        { contactMobile: { $regex: term, $options: 'i' } }
      ];
    }

    const claims = await PrizeClaim.find(query)
      .populate('prize')
      .populate('participant', 'fullName mobile email city state')
      .populate('reviewedBy', 'name email')
      .sort({ updatedAt: -1 });

    res.json({ success: true, data: claims });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   PUT /api/claims/admin/:id/status
 * @desc    Admin update prize claim status (Verified, Contacted, Approved, Awarded, Rejected)
 */
router.put('/admin/:id/status', protectAdmin, authorize(ROLES.SUPERADMIN, ROLES.ADMIN), async (req, res) => {
  try {
    const { claimStatus, adminNotes, rejectionReason } = req.body;

    if (!claimStatus || !Object.values(CLAIM_STATUS).includes(claimStatus)) {
      return res.status(400).json({
        success: false,
        message: `Valid claim status is required: ${Object.values(CLAIM_STATUS).join(', ')}`
      });
    }

    const claim = await PrizeClaim.findById(req.params.id)
      .populate('prize')
      .populate('participant');

    if (!claim) {
      return res.status(404).json({ success: false, message: 'Prize claim not found' });
    }

    if (claimStatus === CLAIM_STATUS.REJECTED && (!rejectionReason || rejectionReason.trim() === '')) {
      return res.status(400).json({
        success: false,
        message: 'A mandatory rejection reason is required when rejecting a prize claim'
      });
    }

    claim.claimStatus = claimStatus;
    if (adminNotes !== undefined) claim.adminNotes = adminNotes;
    if (rejectionReason !== undefined) claim.rejectionReason = rejectionReason;
    claim.reviewedBy = req.user._id;

    if (claimStatus === CLAIM_STATUS.PRIZE_AWARDED) {
      claim.awardedDate = new Date();
    }

    await claim.save();

    // Notify winner via SMS
    const updateMsg = `Grand Lucky Draw Update: Your claim status for ${claim.prize?.name} is now updated to "${claimStatus}". - Grand Lucky Draw`;
    if (claim.contactMobile) {
      sendSmsNotification(claim.contactMobile, updateMsg).catch(() => {});
    }

    await logAudit(req, {
      action: AUDIT_ACTIONS.PRIZE_CLAIM_UPDATED,
      entityType: 'PrizeClaim',
      entityId: claim._id,
      description: `Admin ${req.user.name} updated claim for Participant ${claim.participantId} to "${claimStatus}"`,
      details: { claimStatus, adminNotes, rejectionReason }
    });

    res.json({
      success: true,
      message: `Claim status updated to "${claimStatus}"`,
      data: claim
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
