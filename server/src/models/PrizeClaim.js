const mongoose = require('mongoose');
const { CLAIM_STATUS } = require('../config/constants');

const prizeClaimSchema = new mongoose.Schema({
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Winner',
    required: true,
    unique: true,
    index: true
  },
  participantId: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
    index: true
  },
  participant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant',
    required: true
  },
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true
  },
  prize: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Prize',
    required: true
  },
  claimStatus: {
    type: String,
    enum: Object.values(CLAIM_STATUS),
    default: CLAIM_STATUS.PENDING_VERIFICATION,
    index: true
  },
  // Claimant submitted details
  claimantName: {
    type: String,
    trim: true
  },
  contactMobile: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true
  },
  deliveryAddress: {
    type: String,
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  state: {
    type: String,
    trim: true
  },
  pinCode: {
    type: String,
    trim: true
  },
  idProofType: {
    type: String,
    enum: ['AADHAAR', 'PAN', 'PASSPORT', 'DRIVING_LICENSE', 'VOTER_ID', 'OTHER'],
    default: 'AADHAAR'
  },
  idProofNumber: {
    type: String,
    trim: true
  },
  idProofDocumentUrl: {
    type: String
  },
  addressProofDocumentUrl: {
    type: String
  },
  // Admin processing details
  adminNotes: {
    type: String,
    trim: true
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  awardedDate: {
    type: Date
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PrizeClaim', prizeClaimSchema);
