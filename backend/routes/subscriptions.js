const express = require('express');
const { body, validationResult } = require('express-validator');
const Subscription = require('../models/Subscription');
const auth = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/subscriptions
// @desc    Get all subscriptions for authenticated user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ 
      user: req.user._id,
      isActive: true 
    }).sort({ renewalDate: 1 });

    res.json({
      success: true,
      count: subscriptions.length,
      data: subscriptions
    });
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting subscriptions'
    });
  }
});

// @route   POST /api/subscriptions
// @desc    Create a new subscription
// @access  Private
router.post('/', [
  auth,
  body('serviceName').trim().notEmpty().withMessage('Service name is required'),
  body('plan').trim().notEmpty().withMessage('Plan is required'),
  body('planDuration').isInt({ min: 1, max: 24 }).withMessage('Plan duration must be between 1 and 24 months'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('totalAmount').isFloat({ min: 0 }).withMessage('Total amount must be a positive number'),
  body('renewalDate').isISO8601().withMessage('Valid renewal date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const subscriptionData = {
      ...req.body,
      user: req.user._id
    };

    const subscription = new Subscription(subscriptionData);
    await subscription.save();

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: subscription
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating subscription'
    });
  }
});

// @route   PUT /api/subscriptions/:id
// @desc    Update a subscription
// @access  Private
router.put('/:id', [
  auth,
  body('serviceName').optional().trim().notEmpty().withMessage('Service name cannot be empty'),
  body('plan').optional().trim().notEmpty().withMessage('Plan cannot be empty'),
  body('planDuration').optional().isInt({ min: 1, max: 24 }).withMessage('Plan duration must be between 1 and 24 months'),
  body('price').optional().isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('totalAmount').optional().isFloat({ min: 0 }).withMessage('Total amount must be a positive number'),
  body('renewalDate').optional().isISO8601().withMessage('Valid renewal date is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const subscription = await Subscription.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    // Update subscription
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        subscription[key] = req.body[key];
      }
    });

    await subscription.save();

    res.json({
      success: true,
      message: 'Subscription updated successfully',
      data: subscription
    });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating subscription'
    });
  }
});

// @route   DELETE /api/subscriptions/:id
// @desc    Delete a subscription (soft delete)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      _id: req.params.id,
      user: req.user._id,
      isActive: true
    });

    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    // Soft delete
    subscription.isActive = false;
    subscription.status = 'cancelled';
    await subscription.save();

    res.json({
      success: true,
      message: 'Subscription deleted successfully'
    });
  } catch (error) {
    console.error('Delete subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting subscription'
    });
  }
});

// @route   GET /api/subscriptions/stats
// @desc    Get subscription statistics for user
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ 
      user: req.user._id,
      isActive: true 
    });

    const totalMonthly = subscriptions.reduce((sum, sub) => sum + sub.price, 0);
    const totalYearly = totalMonthly * 12;
    
    const expiringSoon = subscriptions.filter(sub => {
      const daysUntilRenewal = Math.ceil((new Date(sub.renewalDate) - new Date()) / (1000 * 60 * 60 * 24));
      return daysUntilRenewal <= 7 && daysUntilRenewal >= 0;
    });

    res.json({
      success: true,
      data: {
        totalSubscriptions: subscriptions.length,
        totalMonthlySpend: totalMonthly,
        totalYearlySpend: totalYearly,
        expiringSoon: expiringSoon.length,
        expiringSubscriptions: expiringSoon
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error getting statistics'
    });
  }
});

module.exports = router;
