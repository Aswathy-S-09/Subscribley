# SMTP Connection Solutions

## Current Issue
All SMTP connections are timing out, likely due to network restrictions or ISP blocking.

## Quick Solutions

### Option 1: Use SendGrid (Recommended - Free)
1. Sign up at https://sendgrid.com
2. Verify your email
3. Go to Settings > API Keys
4. Create API Key with "Mail Send" permissions
5. Update your `.env`:
```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=your_sendgrid_api_key_here
FROM_EMAIL=your-verified-email@domain.com
```

### Option 2: Use Mailgun (Free - 5,000 emails/month)
1. Sign up at https://mailgun.com
2. Verify your domain or use sandbox
3. Get SMTP credentials from Settings
4. Update your `.env`:
```
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASS=your_mailgun_password
FROM_EMAIL=your-email@domain.com
```

### Option 3: Use Outlook/Hotmail
1. Use your Outlook/Hotmail account
2. Enable 2FA and generate app password
3. Update your `.env`:
```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your-email@outlook.com
SMTP_PASS=your_app_password
FROM_EMAIL=your-email@outlook.com
```

### Option 4: Use Yahoo Mail
1. Use your Yahoo account
2. Enable 2FA and generate app password
3. Update your `.env`:
```
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_USER=your-email@yahoo.com
SMTP_PASS=your_app_password
FROM_EMAIL=your-email@yahoo.com
```

## Network Troubleshooting
If all SMTP connections fail:

1. **Check firewall/antivirus**: Temporarily disable to test
2. **Try different network**: Mobile hotspot, different WiFi
3. **Check ISP restrictions**: Some ISPs block SMTP ports
4. **Corporate network**: Ask IT to whitelist SMTP ports

## Testing Your Configuration
After updating `.env`, run:
```bash
node test-smtp-fix.js
```

## Current Status
- ❌ Gmail SMTP blocked (network timeout)
- ❌ Outlook SMTP blocked (network timeout)
- ✅ Backend email code ready
- ✅ Fallback to console logging when SMTP fails

## Recommended Next Step
Use **SendGrid** (Option 1) - it's free, reliable, and works from any network.
