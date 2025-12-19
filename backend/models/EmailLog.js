const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  emailType: {
    type: String,
    enum: ['renewal_reminder', 'expiration_alert', 'welcome', 'custom'],
    required: true
  },
  urgencyLevel: {
    type: String,
    enum: ['expired', 'critical', 'urgent', 'warning', 'normal'],
    default: 'normal'
  },
  subject: {
    type: String,
    required: true
  },
  recipientEmail: {
    type: String,
    required: true
  },
  subscriptionCount: {
    type: Number,
    default: 0
  },
  sentAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['sent', 'failed'],
    default: 'sent'
  },
  errorMessage: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Index for efficient queries
emailLogSchema.index({ user: 1, sentAt: -1 });
emailLogSchema.index({ emailType: 1, sentAt: -1 });
emailLogSchema.index({ sentAt: -1 });

module.exports = mongoose.model('EmailLog', emailLogSchema);

