// Email Logger - Temporary solution while SMTP is being fixed
// This logs emails to console and saves them to a file

const fs = require('fs');
const path = require('path');

class EmailLogger {
  constructor() {
    this.logFile = path.join(__dirname, 'email-log.txt');
  }

  logEmail(type, to, subject, content) {
    const timestamp = new Date().toISOString();
    const logEntry = `
========================================
Email Type: ${type}
To: ${to}
Subject: ${subject}
Timestamp: ${timestamp}
========================================
${content}
========================================

`;

    // Log to console
    console.log(`📧 [${type}] Email would be sent to: ${to}`);
    console.log(`📧 Subject: ${subject}`);
    console.log(`📧 Content: ${content.substring(0, 100)}...`);

    // Save to file
    fs.appendFileSync(this.logFile, logEntry);
    console.log(`📧 Email logged to: ${this.logFile}`);
  }

  sendWelcomeEmail(user, isLogin = false) {
    const subject = isLogin ? 'Welcome back to Subscribely! 👋' : 'Welcome to Subscribely! 🎉';
    const content = `
      <h2>${isLogin ? 'Welcome back' : 'Welcome'} to Subscribely!</h2>
      <p>Hi ${user.firstName},</p>
      <p>${isLogin ? 'Great to see you back!' : 'Thank you for joining Subscribely!'}</p>
      <p>Start managing your subscriptions now!</p>
    `;
    
    this.logEmail('Welcome Email', user.email, subject, content);
  }

  sendRenewalReminder(user, subscriptions, urgencyLevel) {
    const subject = `📅 Renewal Reminder - ${urgencyLevel.toUpperCase()}`;
    const content = `
      <h2>Subscription Renewal Reminder</h2>
      <p>Hi ${user.firstName},</p>
      <p>You have ${subscriptions.length} subscription(s) ${urgencyLevel === 'expired' ? 'expired' : 'expiring soon'}.</p>
      <ul>
        ${subscriptions.map(sub => `<li>${sub.serviceName} - ${sub.plan} (₹${sub.price}/month)</li>`).join('')}
      </ul>
    `;
    
    this.logEmail('Renewal Reminder', user.email, subject, content);
  }
}

module.exports = new EmailLogger();
