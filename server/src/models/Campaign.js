const mongoose = require('mongoose');
const { CAMPAIGN_STATUS } = require('../config/constants');

const campaignSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Campaign title is required'],
    trim: true,
    default: 'Grand Lucky Draw'
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    default: 'grand-lucky-draw-2027'
  },
  tagline: {
    type: String,
    default: 'Dream Big... Win Big...'
  },
  joiningStartDate: {
    type: Date,
    required: true,
    default: () => new Date('2026-12-01T00:00:00.000Z')
  },
  registrationClosingDate: {
    type: Date,
    required: true,
    default: () => new Date('2027-05-15T23:59:59.000Z')
  },
  drawDate: {
    type: Date,
    required: true,
    default: () => new Date('2027-05-19T10:00:00.000Z')
  },
  targetParticipants: {
    type: Number,
    required: true,
    default: 10000
  },
  currentParticipants: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: Object.values(CAMPAIGN_STATUS),
    default: CAMPAIGN_STATUS.ACTIVE
  },
  isRegistrationActive: {
    type: Boolean,
    default: true
  },
  participationFeeEnabled: {
    type: Boolean,
    default: false // Strictly configurable & disabled by default as per legal requirements
  },
  branding: {
    organizerName: {
      type: String,
      default: 'Grand Lucky Draw'
    },
    posterUrl: {
      type: String,
      default: '/uploads/prizes/grand-poster.jpg'
    }
  },
  rules: [{
    type: String
  }],
  currentSnapshotRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParticipantSnapshot'
  },
  closedAt: {
    type: Date
  },
  frozenAt: {
    type: Date
  },
  resultsPublishedAt: {
    type: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Campaign', campaignSchema);
