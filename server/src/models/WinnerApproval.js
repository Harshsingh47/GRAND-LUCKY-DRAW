const mongoose = require('mongoose');
const { APPROVAL_STATUS } = require('../config/constants');

const winnerApprovalSchema = new mongoose.Schema({
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
    index: true
  },
  prize: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prize',
    required: true,
    index: true
  },
  enteredBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  enteredAt: {
    type: Date,
    default: Date.now
  },
  submittedParticipantIds: [{
    type: String,
    required: true
  }],
  winnerRecords: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Winner'
  }],
  status: {
    type: String,
    enum: Object.values(APPROVAL_STATUS),
    default: APPROVAL_STATUS.PENDING_REVIEW,
    index: true
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  comments: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('WinnerApproval', winnerApprovalSchema);
