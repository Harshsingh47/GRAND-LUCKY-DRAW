const mongoose = require('mongoose');

const participantSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    trim: true,
    unique: true,
    index: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    sparse: true
  },
  dateOfBirth: {
    type: Date
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  address: {
    type: String,
    trim: true
  },
  isMobileVerified: {
    type: Boolean,
    default: false,
    index: true
  },
  verificationOtp: {
    type: String,
    select: false
  },
  otpExpiresAt: {
    type: Date,
    select: false
  },
  otpRequestCount: {
    type: Number,
    default: 0
  },
  lastOtpRequestAt: {
    type: Date
  },
  isEligible: {
    type: Boolean,
    default: true,
    index: true
  },
  isDisqualified: {
    type: Boolean,
    default: false,
    index: true
  },
  disqualificationReason: {
    type: String,
    trim: true
  },
  disqualifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  disqualifiedAt: {
    type: Date
  },
  acceptedTerms: {
    type: Boolean,
    required: true,
    default: true
  },
  consentPrivacy: {
    type: Boolean,
    required: true,
    default: true
  },
  lastLoginAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Participant', participantSchema);
