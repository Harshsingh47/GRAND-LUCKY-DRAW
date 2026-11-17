const mongoose = require('mongoose');

const participantSnapshotSchema = new mongoose.Schema({
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
    index: true
  },
  snapshotVersion: {
    type: Number,
    required: true,
    default: 1
  },
  totalEligible: {
    type: Number,
    required: true
  },
  eligibleParticipantIds: [{
    type: String,
    required: true
  }],
  hashSHA256: {
    type: String,
    required: true,
    trim: true
  },
  frozenBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  frozenAt: {
    type: Date,
    default: Date.now
  },
  filePath: {
    type: String
  },
  fileName: {
    type: String
  },
  notes: {
    type: String,
    trim: true
  },
  isCurrent: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ParticipantSnapshot', participantSnapshotSchema);
