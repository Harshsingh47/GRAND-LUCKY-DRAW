const mongoose = require('mongoose');
const { NOTIFICATION_TYPE } = require('../config/constants');

const notificationSchema = new mongoose.Schema({
  channel: {
    type: String,
    enum: ['SMS', 'EMAIL', 'SYSTEM'],
    required: true
  },
  recipient: {
    type: String,
    required: true,
    index: true
  },
  type: {
    type: String,
    enum: Object.values(NOTIFICATION_TYPE),
    required: true,
    index: true
  },
  title: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['SENT', 'DELIVERED', 'FAILED', 'PENDING'],
    default: 'SENT',
    index: true
  },
  meta: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
