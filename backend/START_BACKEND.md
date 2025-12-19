# How to Start the Backend Server

## Quick Start

### Step 1: Open a New Terminal
Open a **new terminal/command prompt** window.

### Step 2: Navigate to Backend Directory
```bash
cd "C:\Users\smeha\OneDrive\Desktop\subscribley (2)\subscribley\fullstack\backend"
```

### Step 3: Start the Server
```bash
npm start
```

### Step 4: Wait for Success Messages
You should see:
```
🚀 Server running on port 5000
📊 Environment: development
🔗 Health check: http://localhost:5000/api/health
MongoDB Connected: localhost:27017
```

## First Time Setup

### Initialize Admin User (First Time Only)
After starting the server, in the **same terminal**, run:
```bash
npm run init-admin
```

You should see:
```
✅ Admin user created successfully
Email: subscriblyinfo@gmail.com
Password: achu0910
```

## Keep Backend Running

**IMPORTANT:** Keep the backend terminal window open and running. Don't close it!

The backend must be running for:
- User login/signup
- Admin login
- All API requests
- Database operations

## Troubleshooting

### Port 5000 Already in Use
If you see "Port 5000 is already in use":
1. Find what's using it: `netstat -ano | findstr :5000`
2. Or change port in `backend/.env`: `PORT=5001`
3. Update frontend `src/services/api.js` to use port 5001

### MongoDB Connection Error
If you see MongoDB errors:
1. Make sure MongoDB is running
2. Check connection string in `backend/.env`
3. Default: `mongodb://localhost:27017/subscribely`

### Still Having Issues?
1. Make sure all dependencies are installed: `npm install`
2. Check for error messages in the terminal
3. Verify `.env` file exists in backend directory

