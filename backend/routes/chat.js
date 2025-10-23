const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const jwt = require('jsonwebtoken');
const Subscription = require('../models/Subscription');
const User = require('../models/User');

const router = express.Router();

// Lightweight offline knowledge base
const path = require('path');
const fs = require('fs');
const KB_PATH = path.join(__dirname, '..', 'knowledge', 'faq.json');
let OFFLINE_KB = [];
try {
  if (fs.existsSync(KB_PATH)) {
    OFFLINE_KB = JSON.parse(fs.readFileSync(KB_PATH, 'utf8')) || [];
  }
} catch (e) {
  console.warn('Failed to load offline KB:', e?.message || e);
}

function normalizeText(t) {
  return String(t || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenSet(text) {
  return new Set(normalizeText(text).split(' ').filter(Boolean));
}

function jaccardSim(a, b) {
  const as = tokenSet(a);
  const bs = tokenSet(b);
  const inter = new Set([...as].filter((x) => bs.has(x)));
  const union = new Set([...as, ...bs]);
  return union.size === 0 ? 0 : inter.size / union.size;
}

// Initialize genAI inside the route to ensure env vars are loaded

// Public endpoint (no auth) so the chatbot can answer even before login
router.post('/', async (req, res) => {
  try {
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

    // 3) Offline KB semantic match as a strong fallback
    if (Array.isArray(OFFLINE_KB) && OFFLINE_KB.length) {
      let best = { score: 0, answer: undefined };
      for (const item of OFFLINE_KB) {
        const score = jaccardSim(message, [item.q, ...(item.aliases || [])].join(' '));
        if (score > best.score) best = { score, answer: item.a };
      }
      if (best.answer && best.score >= 0.2) {
        return res.json({ success: true, reply: best.answer, source: 'kb', score: Number(best.score.toFixed(3)) });
      }
    }

    // 4) Fallback to AI with brief context (if configured)
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      // Graceful degradation when AI is not configured
      const fallback = 'Here is what I can help with: add/edit/delete subscriptions, view dashboard insights, see expiring items, monthly spend, and email alerts setup. Ask things like "How do I add a subscription?", "What is my monthly spend?", or "Which subscriptions are expiring soon?"';
      return res.json({ success: true, reply: fallback, source: 'degraded' });
    }

    // Guardrail: limit prompt size
    const trimmedMessage = String(message).slice(0, 2000);

    // Timeout helper (prevents hanging requests)
    const withTimeout = (p, ms) => {
      return Promise.race([
        p,
        new Promise((_, reject) => setTimeout(() => reject(new Error('AI timeout')), ms))
      ]);
    };

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const system = `You are Subscribely Assistant. Keep answers concise (<= 120 words) and specific to subscription tracking, renewals, alerts, and the app UI. If unsure, provide best guidance and next steps.`;
    const prompt = `${system}\n\nUser question: ${trimmedMessage}`;

    try {
      const result = await withTimeout(model.generateContent(prompt), 8000);
      const text = result?.response?.text?.() || 'Sorry, I could not generate a response right now.';
      return res.json({ success: true, reply: text, source: 'ai' });
    } catch (aiErr) {
      console.error('AI fallback error:', aiErr?.message || aiErr);
      // As a final fallback, provide helpful guidance rather than an error
      const finalReply = 'I can still help with Subscribely features even if AI is down. Try asking: add/edit/delete a subscription, view expiring within 7 days, see monthly spend, or how email alerts work.';
      return res.json({ success: true, reply: finalReply, source: 'timeout' });
    }
  } catch (err) {
    console.error('Chat route error:', err);
    res.status(500).json({ success: false, message: 'Failed to get response' });
  }
});

module.exports = router;


