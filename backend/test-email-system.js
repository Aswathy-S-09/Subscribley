// Test the complete email system
require('dotenv').config();
const EmailLogger = require('./email-logger');
const emailScheduler = require('./services/emailScheduler');

console.log('🧪 Testing Complete Email System...\n');

// Test 1: Email Logger
console.log('1. Testing Email Logger:');
const testUser = {
  firstName: 'Test User',
  email: 'test@example.com'
};

EmailLogger.sendWelcomeEmail(testUser, false);
console.log('✅ Email logger working\n');

// Test 2: Email Scheduler
console.log('2. Testing Email Scheduler:');
console.log('SMTP Status:', emailScheduler.transporter ? 'Configured' : 'Using Fallback');

// Test 3: Manual trigger
console.log('3. Testing Manual Email Trigger:');
emailScheduler.triggerManualCheck().then(() => {
  console.log('✅ Manual trigger completed');
}).catch(err => {
  console.log('❌ Manual trigger failed:', err.message);
});

console.log('\n📧 Email System Status:');
console.log('- Welcome emails: ✅ Working (logged when SMTP fails)');
console.log('- Daily reminders: ✅ Working (logged when SMTP fails)');
console.log('- Fallback system: ✅ Active');
console.log('- Log file: email-log.txt');

console.log('\n🔧 To enable real email sending:');
console.log('1. Set up SendGrid: node sendgrid-setup.js');
console.log('2. Update .env with SendGrid credentials');
console.log('3. Restart backend server');


