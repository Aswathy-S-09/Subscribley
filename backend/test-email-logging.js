// Test email logging functionality
const EmailLogger = require('./email-logger');

console.log('🧪 Testing Email Logging System...\n');

// Test welcome email
const testUser = {
  firstName: 'John',
  email: 'john@example.com'
};

console.log('1. Testing Welcome Email:');
EmailLogger.sendWelcomeEmail(testUser, false);

console.log('\n2. Testing Welcome Back Email:');
EmailLogger.sendWelcomeEmail(testUser, true);

console.log('\n3. Testing Renewal Reminder:');
const testSubscriptions = [
  { serviceName: 'Netflix', plan: 'Premium', price: 649 },
  { serviceName: 'Amazon Prime', plan: 'Standard', price: 299 }
];

EmailLogger.sendRenewalReminder(testUser, testSubscriptions, 'warning');

console.log('\n✅ Email logging test completed!');
console.log('📁 Check email-log.txt for logged emails');
console.log('\n📧 This system will:');
console.log('   - Log welcome emails on registration/login');
console.log('   - Log renewal reminders daily at 10:00 AM');
console.log('   - Save all emails to email-log.txt file');
console.log('\n🔧 To enable real email sending:');
console.log('   1. Set up SendGrid (see sendgrid-setup.js)');
console.log('   2. Update your .env file with SendGrid credentials');
console.log('   3. Restart the backend server');
