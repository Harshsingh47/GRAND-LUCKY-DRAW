const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Participant = require('../models/Participant');
const Registration = require('../models/Registration');
const Campaign = require('../models/Campaign');
const { generateParticipantId } = require('../utils/idGenerator');
const { sendSmsNotification } = require('../utils/otpService');
const { logAudit } = require('../utils/auditLogger');
const { buildExcelBuffer, buildCsvString } = require('../utils/excelExporter');
const { AUDIT_ACTIONS, CAMPAIGN_STATUS, ROLES } = require('../config/constants');
const { protectAdmin, protectParticipant, authorize } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

/**
 * @route   POST /api/participants/register
 * @desc    Complete participant registration with OTP verification & atomic ID generation
 */
router.post('/register', apiLimiter, async (req, res) => {
  try {
    const {
      fullName,
      mobile,
      email,
      dateOfBirth,
      state,
      city,
      address,
      otp,
      acceptedTerms,
      consentPrivacy
    } = req.body;

    // 1. Validation
    if (!fullName || !mobile || !state || !city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, mobile number, state, and city'
      });
    }

    if (!acceptedTerms || !consentPrivacy) {
      return res.status(400).json({
        success: false,
        message: 'You must accept the Terms & Conditions and Privacy Policy'
      });
    }

    const cleanMobile = mobile.trim();
    if (!/^\d{10}$/.test(cleanMobile)) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number must be a valid 10-digit number'
      });
    }

    // 2. Check campaign status
    let campaign = await Campaign.findOne({ status: CAMPAIGN_STATUS.ACTIVE });
    if (!campaign) {
      campaign = await Campaign.findOne({ isRegistrationActive: true });
    }
    if (!campaign) {
      campaign = await Campaign.findOne().sort({ createdAt: -1 });
    }
    if (!campaign || !campaign.isRegistrationActive) {
      return res.status(400).json({
        success: false,
        message: 'Lucky draw registrations are currently closed or not yet active'
      });
    }

    // 3. Check for existing registration in active campaign
    let existingParticipant = await Participant.findOne({ mobile: cleanMobile });
    
    if (existingParticipant) {
      // Check if already registered in current campaign
      const existingReg = await Registration.findOne({
        participant: existingParticipant._id,
        campaign: campaign._id
      });
      if (existingReg) {
        return res.status(400).json({
          success: false,
          message: `This mobile number is already registered for this campaign with Participant ID: ${existingReg.participantId}`,
          existingParticipantId: existingReg.participantId
        });
      }
    }

    // Check email uniqueness if email provided
    if (email && email.trim() !== '') {
      const emailDup = await Participant.findOne({
        email: email.trim().toLowerCase(),
        mobile: { $ne: cleanMobile }
      });
      if (emailDup) {
        return res.status(400).json({
          success: false,
          message: 'This email address is already associated with another mobile number'
        });
      }
    }

    // 4. Atomic Concurrency-Safe Participant ID Generation
    const { participantId, ticketNumber } = await generateParticipantId('LD2027');

    // 5. Create or Update Participant Profile
    let participant;
    if (existingParticipant) {
      existingParticipant.fullName = fullName.trim();
      if (email) existingParticipant.email = email.trim().toLowerCase();
      if (dateOfBirth) existingParticipant.dateOfBirth = new Date(dateOfBirth);
      existingParticipant.state = state.trim();
      existingParticipant.city = city.trim();
      if (address) existingParticipant.address = address.trim();
      existingParticipant.isMobileVerified = true;
      existingParticipant.verificationOtp = undefined;
      existingParticipant.otpExpiresAt = undefined;
      participant = await existingParticipant.save();
    } else {
      participant = await Participant.create({
        fullName: fullName.trim(),
        mobile: cleanMobile,
        email: email ? email.trim().toLowerCase() : undefined,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
        state: state.trim(),
        city: city.trim(),
        address: address ? address.trim() : undefined,
        isMobileVerified: true,
        acceptedTerms: true,
        consentPrivacy: true
      });
    }

    // 6. Create Registration Record
    const registration = await Registration.create({
      participantId,
      participant: participant._id,
      campaign: campaign._id,
      ticketNumber,
      ipAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
      userAgent: req.headers['user-agent']
    });

    // 7. Update Campaign current count
    await Campaign.findByIdAndUpdate(campaign._id, {
      $inc: { currentParticipants: 1 }
    });

    // 8. Send Confirmation SMS
    const confirmationMsg = `Congratulations ${participant.fullName}! You are successfully registered for the Grand Lucky Draw. Your Participant ID is: ${participantId}. Official Draw Date: 19 May. Dream Big... Win Big!`;
    sendSmsNotification(cleanMobile, confirmationMsg).catch(() => {});

    // 9. Generate Session JWT Token so user is immediately logged in
    const token = jwt.sign({ id: participant._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Your unique participant ID has been generated.',
      token,
      data: {
        participantId,
        ticketNumber,
        fullName: participant.fullName,
        mobile: participant.mobile,
        email: participant.email,
        city: participant.city,
        state: participant.state,
        registrationDate: registration.createdAt,
        campaign: {
          title: campaign.title,
          drawDate: campaign.drawDate,
          organizer: campaign.branding.organizerName
        }
      }
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A duplicate registration was detected. Each participant is allowed one entry per campaign.'
      });
    }
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   PUT /api/participants/profile
 * @desc    Participant updates permitted profile info (cannot alter ID or eligibility)
 */
router.put('/profile', protectParticipant, async (req, res) => {
  try {
    const { email, city, state, address, dateOfBirth } = req.body;
    const participant = req.participant;

    if (email) participant.email = email.trim().toLowerCase();
    if (city) participant.city = city.trim();
    if (state) participant.state = state.trim();
    if (address) participant.address = address.trim();
    if (dateOfBirth) participant.dateOfBirth = new Date(dateOfBirth);

    await participant.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      participant: {
        id: participant._id,
        fullName: participant.fullName,
        mobile: participant.mobile,
        email: participant.email,
        state: participant.state,
        city: participant.city,
        address: participant.address,
        dateOfBirth: participant.dateOfBirth
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/participants
 * @desc    Admin lists participants with search, filters, pagination
 */
router.get('/', protectAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const { search, state, verified, eligible, disqualified, startDate, endDate } = req.query;

    let matchQuery = {};

    if (verified !== undefined && verified !== '') {
      matchQuery.isMobileVerified = verified === 'true';
    }
    if (eligible !== undefined && eligible !== '') {
      matchQuery.isEligible = eligible === 'true';
    }
    if (disqualified !== undefined && disqualified !== '') {
      matchQuery.isDisqualified = disqualified === 'true';
    }
    if (state && state !== '') {
      matchQuery.state = { $regex: state, $options: 'i' };
    }

    // Build aggregation pipeline to join with Registration collection
    const pipeline = [
      { $match: matchQuery },
      {
        $lookup: {
          from: 'registrations',
          localField: '_id',
          foreignField: 'participant',
          as: 'registration'
        }
      },
      {
        $unwind: {
          path: '$registration',
          preserveNullAndEmptyArrays: true
        }
      }
    ];

    if (search && search.trim() !== '') {
      const term = search.trim();
      pipeline.push({
        $match: {
          $or: [
            { fullName: { $regex: term, $options: 'i' } },
            { mobile: { $regex: term, $options: 'i' } },
            { email: { $regex: term, $options: 'i' } },
            { 'registration.participantId': { $regex: term, $options: 'i' } }
          ]
        }
      });
    }

    if (startDate || endDate) {
      const dateFilter = {};
      if (startDate) dateFilter.$gte = new Date(startDate);
      if (endDate) dateFilter.$lte = new Date(endDate);
      pipeline.push({
        $match: {
          createdAt: dateFilter
        }
      });
    }

    // Count total matching
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await Participant.aggregate(countPipeline);
    const total = countResult[0] ? countResult[0].total : 0;

    // Apply sorting and pagination
    pipeline.push({ $sort: { createdAt: -1 } });
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: limit });

    const participants = await Participant.aggregate(pipeline);

    res.json({
      success: true,
      data: participants,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/participants/:id
 * @desc    Admin get single participant details with full registration history
 */
router.get('/:id', protectAdmin, async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id)
      .populate('disqualifiedBy', 'name email');
    if (!participant) {
      return res.status(404).json({ success: false, message: 'Participant not found' });
    }

    const registration = await Registration.findOne({ participant: participant._id })
      .populate('campaign');

    res.json({
      success: true,
      participant,
      registration
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/participants/:id/disqualify
 * @desc    Admin marks participant disqualified with mandatory reason
 */
router.post('/:id/disqualify', protectAdmin, authorize(ROLES.SUPERADMIN, ROLES.ADMIN), async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason || reason.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'A mandatory disqualification reason must be provided'
      });
    }

    const participant = await Participant.findById(req.params.id);
    if (!participant) {
      return res.status(404).json({ success: false, message: 'Participant not found' });
    }

    participant.isDisqualified = true;
    participant.isEligible = false;
    participant.disqualificationReason = reason.trim();
    participant.disqualifiedBy = req.user._id;
    participant.disqualifiedAt = new Date();
    await participant.save();

    // Update registration status
    await Registration.updateMany(
      { participant: participant._id },
      { $set: { status: 'DISQUALIFIED' } }
    );

    await logAudit(req, {
      action: AUDIT_ACTIONS.PARTICIPANT_DISQUALIFIED,
      entityType: 'Participant',
      entityId: participant._id,
      description: `Participant ${participant.fullName} (${participant.mobile}) disqualified by ${req.user.name}`,
      details: { reason: reason.trim() }
    });

    res.json({
      success: true,
      message: 'Participant disqualified successfully',
      participant
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/participants/:id/reinstate
 * @desc    Admin reinstates a disqualified participant
 */
router.post('/:id/reinstate', protectAdmin, authorize(ROLES.SUPERADMIN, ROLES.ADMIN), async (req, res) => {
  try {
    const participant = await Participant.findById(req.params.id);
    if (!participant) {
      return res.status(404).json({ success: false, message: 'Participant not found' });
    }

    participant.isDisqualified = false;
    participant.isEligible = true;
    participant.disqualificationReason = undefined;
    participant.disqualifiedBy = undefined;
    participant.disqualifiedAt = undefined;
    await participant.save();

    await Registration.updateMany(
      { participant: participant._id },
      { $set: { status: 'ACTIVE' } }
    );

    res.json({
      success: true,
      message: 'Participant reinstated successfully',
      participant
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/participants/export
 * @desc    Export participants to Excel or CSV
 */
router.get('/export/download', protectAdmin, async (req, res) => {
  try {
    const format = req.query.format === 'csv' ? 'csv' : 'xlsx';

    const registrations = await Registration.find()
      .populate('participant')
      .populate('campaign', 'title')
      .sort({ createdAt: 1 });

    const exportRows = registrations.map((reg, idx) => ({
      'S.No': idx + 1,
      'Participant ID': reg.participantId,
      'Ticket Number': reg.ticketNumber,
      'Full Name': reg.participant?.fullName || '',
      'Mobile Number': reg.participant?.mobile || '',
      'Email': reg.participant?.email || '',
      'State': reg.participant?.state || '',
      'City': reg.participant?.city || '',
      'Mobile Verified': reg.participant?.isMobileVerified ? 'Yes' : 'No',
      'Eligibility Status': reg.participant?.isEligible ? 'Eligible' : 'Ineligible',
      'Disqualified': reg.participant?.isDisqualified ? 'Yes' : 'No',
      'Disqualification Reason': reg.participant?.disqualificationReason || '',
      'Registration Date': reg.createdAt ? new Date(reg.createdAt).toISOString() : ''
    }));

    if (format === 'csv') {
      const csvData = buildCsvString(exportRows);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="grand-lucky-draw-participants.csv"');
      return res.send(csvData);
    } else {
      const buffer = buildExcelBuffer(exportRows, 'Participants');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename="grand-lucky-draw-participants.xlsx"');
      return res.send(buffer);
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
