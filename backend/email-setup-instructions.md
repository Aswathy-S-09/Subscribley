# Email Setup Instructions for Subscribely

## Current Issue
The SMTP connection to Gmail is timing out. This is likely due to one of the following:

## Solution 1: Fix Gmail App Password (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account:
   - Go to https://myaccount.google.com/security
   - Enable 2-Step Verification

2. **Generate an App Password**:
   - Go to https://myaccount.google.com/apppasswords
   - Select "Mail" and "Other (Custom name)"
   - Enter "Subscribely" as the name
   - Copy the 16-character password (like: abcd efgh ijkl mnop)

3. **Update your .env file**:
   ```
   SMTP_USER=saswathy912006@gmail.com
   SMTP_PASS=your_16_character_app_password_here
   FROM_EMAIL=saswathy912006@gmail.com
   ```

## Solution 2: Alternative Email Providers

If Gmail doesn't work, try these alternatives:

### Option A: Outlook/Hotmail
```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your-password
```

### Option B: Yahoo Mail
```
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your-app-password
```

## Solution 3: Use a Third-Party Service

### SendGrid (Free tier: 100 emails/day)
1. Sign up at https://sendgrid.com
2. Get API key
3. Update .env:
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key
```

### Mailgun (Free tier: 5,000 emails/month)
1. Sign up at https://mailgun.com
2. Get SMTP credentials
3. Update .env with provided credentials

## Testing Your Configuration

Run this command to test your email setup:
```bash
node test-email.js
```

## Current Status
- ✅ Backend has email functionality
- ✅ Welcome emails on registration/login
- ✅ Daily renewal reminders at 10:00 AM
- ❌ SMTP connection failing (needs fix)

## Next Steps
1. Choose one of the solutions above
2. Update your .env file
3. Restart the backend server
4. Test with: `node test-email.js`
5. Register a new account to test welcome emails
