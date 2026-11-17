const mongoose = require('mongoose');

const prizeSchema = new mongoose.Schema({
  campaign: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Campaign',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Prize name is required'],
    trim: true
  },
  category: {
    type: String,
    enum: ['SUV', 'CAR', 'TWO_WHEELER', 'REAL_ESTATE', 'ELECTRONICS', 'OTHER'],
    default: 'OTHER'
  },
  quantity: {
    type: Number,
    required: [true, 'Prize quantity is required'],
    min: [1, 'Quantity must be at least 1']
  },
  winnersCount: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    default: '/uploads/prizes/default-prize.png'
  },
  displayOrder: {
    type: Number,
    default: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  features: [{
    type: String
  }],
  isResultsPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Prize', prizeSchema);
