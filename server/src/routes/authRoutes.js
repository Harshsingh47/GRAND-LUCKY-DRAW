const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Participant = require('../models/Participant');
const Registration = require('../models/Registration');
const Campaign = require('../models/Campaign');
const { generateOtp, sendOtp } = require('../utils/otpService');
const { logAudit } = require('../utils/auditLogger');
const { AUDIT_ACTIONS } = require('../config/constants');
const { protectAdmin, protectParticipant } = require('../middleware/auth');
const { authLimiter, otpLimiter } = require('../middleware/rateLimiter');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  });
};

/**
 * @route   POST /api/auth/admin/login
 * @desc    Authenticate admin user & get token
 */
router.post('/admin/login', authLimiter, async (req, res) => {
  try {
    const { email, password, twoFactorCode } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    let user = await User.findOne({ email }).select('+password +twoFactorSecret');
    if (!user && email.endsWith('@grandluckydraw.com')) {
      const legacyEmail = email.replace('@grandluckydraw.com', '@independentmedias.com');
      user = await User.findOne({ email: legacyEmail }).select('+password +twoFactorSecret');
    }
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Account is deactivated. Contact administrator.'
      });
    }

    // 2FA check if enabled
    if (user.twoFactorEnabled) {
      if (!twoFactorCode) {
        return res.status(200).json({
          success: true,
          requires2FA: true,
          message: 'Please enter 2FA verification code'
        });
      }
      // Demo 2FA accepts 6-digit code '123456' or matching secret
      if (twoFactorCode !== '123456' && twoFactorCode !== user.twoFactorSecret) {
        return res.status(401).json({
          success: false,
          message: 'Invalid 2FA code'
        });
      }
    }

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user._id);

    await logAudit(req, {
      action: AUDIT_ACTIONS.USER_LOGIN,
      entityType: 'User',
      entityId: user._id,
      description: `Admin ${user.name} (${user.role}) logged in`
    });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/auth/admin/me
 * @desc    Get currently logged in admin user
 */
router.get('/admin/me', protectAdmin, async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      twoFactorEnabled: req.user.twoFactorEnabled
    }
  });
});

/**
 * @route   POST /api/auth/participant/request-otp
 * @desc    Request OTP for registration verification or participant login
 */
router.post('/participant/request-otp', otpLimiter, async (req, res) => {
  try {
    const { mobile, purpose = 'login' } = req.body;

    if (!mobile || !/^\d{10}$/.test(mobile.trim())) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit mobile number'
      });
    }

    const cleanMobile = mobile.trim();
    let participant = await Participant.findOne({ mobile: cleanMobile });

    if (purpose === 'login' && !participant) {
      return res.status(404).json({
        success: false,
        message: 'Mobile number is not registered. Please register first.'
      });
    }

    const otp = generateOtp();
    const otpExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    if (participant) {
      // Throttle OTP spam: limit to 1 per 30 seconds
      if (participant.lastOtpRequestAt && (Date.now() - new Date(participant.lastOtpRequestAt).getTime() < 30000)) {
        return res.status(429).json({
          success: false,
          message: 'Please wait 30 seconds before requesting another OTP'
        });
      }
      participant.verificationOtp = otp;
      participant.otpExpiresAt = otpExpiresAt;
      participant.otpRequestCount = (participant.otpRequestCount || 0) + 1;
      participant.lastOtpRequestAt = new Date();
      await participant.save();
    }

    const sendResult = await sendOtp(cleanMobile, otp, purpose === 'login' ? 'Login' : 'Registration');

    res.json({
      success: true,
      message: 'OTP sent to your registered mobile number',
      debugOtp: sendResult.debugOtp
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/auth/participant/login
 * @desc    Direct login with registered mobile number (No OTP verification required)
 */
router.post('/participant/login', authLimiter, async (req, res) => {
  try {
    let { mobile, participantId, identifier } = req.body;

    if (identifier && identifier.trim() !== '') {
      const cleanIdent = identifier.trim();
      if (/^\d{10}$/.test(cleanIdent)) {
        mobile = cleanIdent;
      } else {
        participantId = cleanIdent;
      }
    }

    if (!mobile && !participantId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide your registered mobile number or participant ID'
      });
    }

    let participant = null;
    let registration = null;

    if (mobile && mobile.trim() !== '') {
      const cleanMobile = mobile.trim();
      participant = await Participant.findOne({ mobile: cleanMobile });
      if (participant) {
        registration = await Registration.findOne({ participant: participant._id }).populate('campaign');
      }
    }

    if (!participant && participantId && participantId.trim() !== '') {
      registration = await Registration.findOne({
        participantId: participantId.trim().toUpperCase()
      }).populate('participant').populate('campaign');
      if (registration) {
        participant = registration.participant;
      }
    }

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'No registered participant found with this mobile number or participant ID. Please register first.'
      });
    }

    participant.isMobileVerified = true;
    participant.lastLoginAt = new Date();
    await participant.save();

    const token = generateToken(participant._id);

    res.json({
      success: true,
      token,
      participant: {
        id: participant._id,
        fullName: participant.fullName,
        mobile: participant.mobile,
        email: participant.email,
        state: participant.state,
        city: participant.city,
        isEligible: participant.isEligible,
        isDisqualified: participant.isDisqualified,
        participantId: registration?.participantId || null,
        ticketNumber: registration?.ticketNumber || null,
        registrationDate: registration?.createdAt || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   POST /api/auth/participant/verify-otp
 * @desc    Legacy / fallback OTP route (Accepts direct login without OTP as well)
 */
router.post('/participant/verify-otp', authLimiter, async (req, res) => {
  try {
    const { mobile, otp } = req.body;

    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: 'Mobile number is required'
      });
    }

    const cleanMobile = mobile.trim();
    const participant = await Participant.findOne({ mobile: cleanMobile });

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: 'Participant not found'
      });
    }

    // Number verification bypassed: accept directly or match OTP if provided
    if (otp && otp.trim() !== '123456' && participant.verificationOtp && participant.verificationOtp !== otp.trim()) {
      // If explicit OTP provided and doesn't match
      if (participant.otpExpiresAt && new Date() > new Date(participant.otpExpiresAt)) {
        return res.status(400).json({
          success: false,
          message: 'OTP has expired'
        });
      }
    }

    participant.isMobileVerified = true;
    participant.verificationOtp = undefined;
    participant.otpExpiresAt = undefined;
    participant.lastLoginAt = new Date();
    await participant.save();

    const registration = await Registration.findOne({ participant: participant._id }).populate('campaign');

    const token = generateToken(participant._id);

    res.json({
      success: true,
      token,
      participant: {
        id: participant._id,
        fullName: participant.fullName,
        mobile: participant.mobile,
        email: participant.email,
        state: participant.state,
        city: participant.city,
        isEligible: participant.isEligible,
        isDisqualified: participant.isDisqualified,
        participantId: registration?.participantId || null,
        ticketNumber: registration?.ticketNumber || null,
        registrationDate: registration?.createdAt || null
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

/**
 * @route   GET /api/auth/participant/me
 * @desc    Get current participant session profile
 */
router.get('/participant/me', protectParticipant, async (req, res) => {
  res.json({
    success: true,
    participant: {
      id: req.participant._id,
      fullName: req.participant.fullName,
      mobile: req.participant.mobile,
      email: req.participant.email,
      dateOfBirth: req.participant.dateOfBirth,
      state: req.participant.state,
      city: req.participant.city,
      address: req.participant.address,
      isMobileVerified: req.participant.isMobileVerified,
      isEligible: req.participant.isEligible,
      isDisqualified: req.participant.isDisqualified,
      disqualificationReason: req.participant.disqualificationReason,
      participantId: req.registration?.participantId,
      ticketNumber: req.registration?.ticketNumber,
      registrationDate: req.registration?.createdAt,
      campaign: req.registration?.campaign
    }
  });
});

module.exports = router;
