const mongoose = require('mongoose');

const drawEventSchema = new mongoose.Schema({
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
    index: true
  },
  stage: {
    type: String,
    enum: ['REGISTRATION_CLOSED', 'PARTICIPANTS_FROZEN', 'DRAW_IN_PROGRESS', 'WINNERS_SUBMITTED', 'WINNERS_APPROVED', 'WINNERS_PUBLISHED'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  executedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('DrawEvent', drawEventSchema);
