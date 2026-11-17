const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  participantId: {
    type: String,
    required: true,
    unique: true,
    index: true,
    uppercase: true,
    trim: true
  },
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant',
    required: true,
    index: true
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
    index: true
  },
  ticketNumber: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'DISQUALIFIED', 'CANCELLED'],
    default: 'ACTIVE',
    index: true
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
}, {
  timestamps: true
});

// Compound index to guarantee a participant registers only once per campaign
registrationSchema.index({ participant: 1, campaign: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
