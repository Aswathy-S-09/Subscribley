require('dotenv').config();
const EmailConfig = require('./email-config');

async function testEmail() {
  console.log('🧪 Testing SMTP Configuration...\n');
  
  const emailConfig = EmailConfig;
  
  // Wait a bit for configuration to complete
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  if (!emailConfig.isConfigured()) {
    console.log('❌ SMTP not properly configured. Trying manual test...\n');
    
    // Manual test with different configurations
    const nodemailer = require('nodemailer');
    
    const configs = [
      {
        name: 'Gmail TLS (Port 587)',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      {
        name: 'Gmail SSL (Port 465)',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      }
    ];

    for (const config of configs) {
      try {
        console.log(`🔄 Testing ${config.name}...`);
        const transporter = nodemailer.createTransport(config);
        
        await new Promise((resolve, reject) => {
          transporter.verify((error, success) => {
            if (error) {
              reject(error);
            } else {
              resolve(success);
            }
          });
        });

        console.log(`✅ ${config.name} works!`);
        
        // Test sending an email
        const mailOptions = {
          from: process.env.FROM_EMAIL || process.env.SMTP_USER,
          to: process.env.SMTP_USER,
          subject: 'Subscribely SMTP Test',
          html: '<h2>✅ SMTP Test Successful!</h2><p>Your email configuration is working correctly.</p>'
        };

        const result = await transporter.sendMail(mailOptions);
        console.log(`📧 Test email sent successfully! Message ID: ${result.messageId}`);
        return;
        
      } catch (error) {
        console.log(`❌ ${config.name} failed: ${error.message}`);
      }
    }
    
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('1. Verify your Gmail App Password:');
    console.log('   - Go to: https://myaccount.google.com/apppasswords');
    console.log('   - Generate a new app password for "Mail"');
    console.log('   - Use the 16-character password (no spaces)');
    console.log('\n2. Check your Gmail settings:');
    console.log('   - Enable 2-Factor Authentication');
    console.log('   - Allow "Less secure app access" if needed');
    console.log('\n3. Try alternative email providers:');
    console.log('   - Outlook: smtp-mail.outlook.com:587');
    console.log('   - Yahoo: smtp.mail.yahoo.com:587');
    
  } else {
    console.log('✅ SMTP is configured and working!');
    
    // Test sending an email
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: 'Subscribely SMTP Test',
      html: '<h2>✅ SMTP Test Successful!</h2><p>Your email configuration is working correctly.</p>'
    };

    const result = await emailConfig.sendEmail(mailOptions);
    if (result.success) {
      console.log('📧 Test email sent successfully!');
    } else {
      console.log('❌ Failed to send test email:', result.message);
    }
  }
}

testEmail().catch(console.error);
