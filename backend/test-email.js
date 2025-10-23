require('dotenv').config();
const nodemailer = require('nodemailer');

console.log('Testing email configuration...');
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS length:', process.env.SMTP_PASS ? process.env.SMTP_PASS.length : 'NOT SET');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ SMTP verification failed:', error.message);
    console.log('Common issues:');
    console.log('1. Make sure you\'re using an App Password, not your regular Gmail password');
    console.log('2. Enable 2-factor authentication on your Gmail account');
    console.log('3. Generate an App Password: https://myaccount.google.com/apppasswords');
  } else {
    console.log('✅ SMTP transporter is ready to send emails');
    
    // Test sending an email
    const mailOptions = {
      from: process.env.FROM_EMAIL || process.env.SMTP_USER,
      to: process.env.SMTP_USER, // Send to yourself for testing
      subject: 'Subscribely Email Test',
      html: '<h2>Email Test Successful!</h2><p>If you received this email, your SMTP configuration is working correctly.</p>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Failed to send test email:', error.message);
      } else {
        console.log('✅ Test email sent successfully!');
        console.log('Message ID:', info.messageId);
      }
    });
  }
});
