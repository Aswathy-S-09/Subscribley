const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  serviceName: {
    type: String,
    required: [true, 'Service name is required'],
    trim: true,
    maxlength: [100, 'Service name cannot exceed 100 characters']
  },
  plan: {
    type: String,
    required: [true, 'Plan is required'],
    trim: true,
    maxlength: [50, 'Plan name cannot exceed 50 characters']
  },
  planDuration: {
    type: Number,
    required: [true, 'Plan duration is required'],
    min: [1, 'Plan duration must be at least 1 month'],
    max: [24, 'Plan duration cannot exceed 24 months']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  renewalDate: {
    type: Date,
    required: [true, 'Renewal date is required']
  },
  serviceLogo: {
    type: String,
    trim: true,
    default: ''
  },
  serviceColor: {
    type: String,
    trim: true,
    default: '#667eea'
  },
  serviceUrl: {
    type: String,
    trim: true,
    default: ''
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for efficient queries
subscriptionSchema.index({ user: 1, renewalDate: 1 });
subscriptionSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
