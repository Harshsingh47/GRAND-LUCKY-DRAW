const mongoose = require('mongoose');

const winnerSchema = new mongoose.Schema({
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
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant',
    required: true,
    index: true
  },
  participantId: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true
  },
  snapshot: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ParticipantSnapshot',
    required: true
  },
  rank: {
    type: Number,
    default: 1
  },
  status: {
    type: String,
    enum: ['PENDING_APPROVAL', 'APPROVED', 'REJECTED'],
    default: 'PENDING_APPROVAL',
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
  isPublished: {
    type: Boolean,
    default: false,
    index: true
  },
  publishedAt: {
    type: Date
  },
  publishedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// A participant can only win once in a campaign if rules prohibit multiple wins
winnerSchema.index({ campaign: 1, participantId: 1 }, { unique: true });

module.exports = mongoose.model('Winner', winnerSchema);
