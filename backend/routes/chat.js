const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const jwt = require('jsonwebtoken');
const Subscription = require('../models/Subscription');
const User = require('../models/User');

const router = express.Router();

// Initialize genAI inside the route to ensure env vars are loaded

// Public endpoint (no auth) so the chatbot can answer even before login
router.post('/', async (req, res) => {
  try {
    // Check if AI is available
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: 'AI not configured on server' });
    }

    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, message: 'message is required' });
    }

    // Optional: extract user id from Authorization header if present
    let tokenUserId = undefined;
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        tokenUserId = decoded.userId;
      } catch (_) {}
    }

    // 1) Domain knowledge: intent matcher & canned answers
    const q = message.toLowerCase();
    const includes = (arr) => arr.some((k) => q.includes(k));

    // Static FAQ intents
    const faqIntents = [
      {
        keys: ['add subscription', 'create subscription', 'new subscription'],
        answer:
          'Add a subscription in the Add tab: choose service, pick a plan and duration, set renewal date, then click Add Subscription.'
      },
      {
        keys: ['edit subscription', 'delete subscription', 'update subscription'],
        answer:
          'Open the List tab. Use Edit to modify fields, Save to confirm, or Delete to remove a subscription.'
      },
      {
        keys: ['email alerts', 'renewal reminder', 'automatic email', 'daily email'],
        answer:
          'Renewal reminders are sent automatically every day at 10:00 AM to the user’s email for any active subscriptions expiring within 7 days (and expired).'
      },
      {
        keys: ['zee5', 'sunnxt', 'plans'],
        answer:
          'Zee5 plans: Mobile, Premium, Premium 4K, Annual Premium. SunNXT plans: Mobile, Standard, Premium, Annual Premium. Netflix: Basic, Standard, Premium.'
      }
    ];

    const hit = faqIntents.find((i) => includes(i.keys));
    if (hit) {
      return res.json({ success: true, reply: hit.answer, source: 'faq' });
    }

    // 2) User-specific domain answers when a user id is provided (optional)
    // tokenUserId can be provided by the frontend if available from JWT; this route remains public.
    if (tokenUserId) {
      const user = await User.findById(tokenUserId).select('firstName email isActive');
      if (user) {
        // Common user-specific intents
        if (includes(['how many subscriptions', 'count subscriptions', 'total subscriptions'])) {
          const total = await Subscription.countDocuments({ user: user._id, isActive: true });
          return res.json({ success: true, reply: `You have ${total} active subscription(s).`, source: 'db' });
        }
        if (includes(['monthly spend', 'total monthly', 'per month', 'monthy spend', 'month ly', 'monhtly'])) {
          const subs = await Subscription.find({ user: user._id, isActive: true }, 'price');
          const totalMonthly = subs.reduce((s, r) => s + Number(r.price || 0), 0);
          return res.json({ success: true, reply: `Your total monthly spend is ₹${totalMonthly.toFixed(2)}.`, source: 'db' });
        }
        if (includes(['expiring', 'renewal', 'due in', 'overdue'])) {
          const now = new Date();
          const inSeven = new Date();
          inSeven.setDate(now.getDate() + 7);
          const expiring = await Subscription.find({
            user: user._id,
            isActive: true,
            renewalDate: { $gte: now, $lte: inSeven }
          }, 'serviceName renewalDate');
          const expired = await Subscription.find({
            user: user._id,
            isActive: true,
            renewalDate: { $lt: now }
          }, 'serviceName renewalDate');

          const lines = [];
          if (expired.length) lines.push(`${expired.length} expired`);
          if (expiring.length) lines.push(`${expiring.length} expiring within 7 days`);
          const summary = lines.length ? lines.join(' and ') : 'No subscriptions are expiring within 7 days.';
          return res.json({ success: true, reply: summary, source: 'db' });
        }
      }
    }

    // 3) Fallback to AI with brief context
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const system = `You are Subscribely Assistant. Keep answers concise (<= 120 words) and specific to subscription tracking, renewals, alerts, and the app UI. If unsure, provide best guidance and next steps.`;
    const prompt = `${system}\n\nUser question: ${message}`;
    const result = await model.generateContent(prompt);
    const text = result?.response?.text?.() || 'Sorry, I could not generate a response right now.';

    res.json({ success: true, reply: text, source: 'ai' });
  } catch (err) {
    console.error('Chat route error:', err);
    res.status(500).json({ success: false, message: 'Failed to get response' });
  }
});

module.exports = router;


