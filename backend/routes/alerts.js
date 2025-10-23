const express = require('express');
const { body, validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const auth = require('../middleware/auth');

const router = express.Router();

const hasSmtpCreds = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);

// Create transporter: SMTP when creds exist, otherwise JSON (no network)
const transporter = hasSmtpCreds
  ? nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  : nodemailer.createTransport({ jsonTransport: true });

// Verify only when SMTP is configured
if (hasSmtpCreds) {
  transporter.verify((error) => {
    if (error) {
      console.warn('Email transporter not ready:', error.message);
    } else {
      console.log('Email transporter is ready to send messages');
    }
  });
} else {
  console.log('Email transporter in dry-run mode (no SMTP credentials set).');
}

// @route   POST /api/alerts/email
// @desc    Send important alerts to user's email
// @access  Private
router.post('/email', [
  auth,
  body('subject').trim().notEmpty().withMessage('Subject is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const toEmail = req.user.email;
    const { subject, message } = req.body;

    if (!hasSmtpCreds) {
      return res.status(500).json({
        success: false,
        message: 'Email is not configured on the server. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS.'
      });
    }

    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: toEmail,
      subject,
      text: message,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Alert email sent successfully' });
  } catch (error) {
    console.error('Send alert email error:', error);
    res.status(500).json({ success: false, message: 'Failed to send alert email' });
  }
});

module.exports = router;
