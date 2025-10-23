// Quick SendGrid Setup for Subscribely
// This script helps you set up SendGrid for email sending

console.log('🚀 SendGrid Setup for Subscribely\n');

console.log('Step 1: Create SendGrid Account');
console.log('1. Go to: https://sendgrid.com');
console.log('2. Click "Start for Free"');
console.log('3. Sign up with your email');
console.log('4. Verify your email address\n');

console.log('Step 2: Get API Key');
console.log('1. Go to Settings > API Keys');
console.log('2. Click "Create API Key"');
console.log('3. Choose "Restricted Access"');
console.log('4. Under "Mail Send", select "Full Access"');
console.log('5. Click "Create & View"');
console.log('6. Copy the API key (starts with SG.)\n');

console.log('Step 3: Update Your .env File');
console.log('Replace your current SMTP settings with:');
console.log('');
console.log('SMTP_HOST=smtp.sendgrid.net');
console.log('SMTP_PORT=587');
console.log('SMTP_USER=apikey');
console.log('SMTP_PASS=your_sendgrid_api_key_here');
console.log('FROM_EMAIL=your-verified-email@domain.com');
console.log('');

console.log('Step 4: Test Configuration');
console.log('Run: node test-smtp-fix.js');
console.log('');

console.log('Benefits of SendGrid:');
console.log('✅ Free tier: 100 emails/day');
console.log('✅ Works from any network');
console.log('✅ No app passwords needed');
console.log('✅ Reliable delivery');
console.log('✅ Built for developers');
