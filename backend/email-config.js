require('dotenv').config();
const nodemailer = require('nodemailer');

class EmailConfig {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    const hasSmtpCreds = Boolean(process.env.SMTP_USER && process.env.SMTP_PASS);
    
    if (!hasSmtpCreds) {
      console.log('⚠️ No SMTP credentials found. Emails will not be sent.');
      return;
    }

    // Try multiple SMTP configurations
    const configs = [
      // Gmail with TLS
      {
        name: 'Gmail TLS',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      // Gmail with SSL
      {
        name: 'Gmail SSL',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      },
      // Outlook/Hotmail
      {
        name: 'Outlook',
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      }
    ];

    this.tryConfigurations(configs);
  }

  async tryConfigurations(configs) {
    for (const config of configs) {
      try {
        console.log(`🔄 Trying ${config.name}...`);
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

        console.log(`✅ ${config.name} connection successful!`);
        this.transporter = transporter;
        return;
      } catch (error) {
        console.log(`❌ ${config.name} failed: ${error.message}`);
      }
    }

    console.log('❌ All SMTP configurations failed. Using fallback mode.');
    this.transporter = nodemailer.createTransport({ jsonTransport: true });
  }

  async sendEmail(mailOptions) {
    if (!this.transporter) {
      console.log('📧 Email transporter not available, skipping email');
      return { success: false, message: 'Email not configured' };
    }

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('📧 Email sent successfully:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('📧 Failed to send email:', error.message);
      return { success: false, message: error.message };
    }
  }

  isConfigured() {
    return this.transporter && !this.transporter.transporter.options.jsonTransport;
  }
}

module.exports = new EmailConfig();
