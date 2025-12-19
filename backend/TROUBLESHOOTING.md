# Troubleshooting Guide - Admin Dashboard Connection Issues

## Problem: "Unable to connect to server" Error

If you're seeing this error, follow these steps:

### Step 1: Verify Backend Server is Running

1. Open a **new terminal/command prompt**
2. Navigate to the backend directory:
   ```bash
   cd "C:\Users\smeha\OneDrive\Desktop\subscribley (2)\subscribley\fullstack\backend"
   ```
3. Start the backend server:
   ```bash
   npm start
   ```
   OR for development with auto-reload:
   ```bash
   npm run dev
   ```

4. You should see output like:
   ```
   🚀 Server running on port 5000
   📊 Environment: development
   🔗 Health check: http://localhost:5000/api/health
   MongoDB Connected: ...
   ```

### Step 2: Verify MongoDB is Connected

The backend should show a message like:
```
MongoDB Connected: localhost:27017
```

If you see a MongoDB connection error:
- Make sure MongoDB is running
- Check your MongoDB connection string in `.env` file
- Default connection: `mongodb://localhost:27017/subscribely`

### Step 3: Initialize Admin User (First Time Only)

Before logging in, you need to create the admin user:

1. In the backend terminal, run:
   ```bash
   npm run init-admin
   ```

2. You should see:
   ```
   ✅ Admin user created successfully
   Email: subscriblyinfo@gmail.com
   Password: achu0910
   ```

### Step 4: Test Backend Connection

1. Open your browser
2. Go to: `http://localhost:5000/api/health`
3. You should see:
   ```json
   {
     "success": true,
     "message": "Subscribely API is running",
     "timestamp": "...",
     "environment": "development"
   }
   ```

### Step 5: Check Frontend Configuration

1. Make sure the frontend is running:
   ```bash
   cd "C:\Users\smeha\OneDrive\Desktop\subscribley (2)\subscribley\fullstack"
   npm start
   ```

2. The frontend should be running on `http://localhost:3000`

3. Check the API URL in `src/services/api.js`:
   - Default: `http://localhost:5000/api`
   - If your backend is on a different port, update it

### Step 6: Check Browser Console

1. Open browser Developer Tools (F12)
2. Go to the Console tab
3. Look for any error messages
4. Check the Network tab to see if requests are being made

### Common Issues and Solutions

#### Issue 1: Port 5000 Already in Use
**Solution:** Change the port in `backend/.env`:
```
PORT=5001
```
Then update frontend `src/services/api.js`:
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';
```

#### Issue 2: CORS Error
**Solution:** The backend CORS is already configured for `localhost:3000`. If you're using a different port, update `backend/server.js` CORS configuration.

#### Issue 3: MongoDB Connection Failed
**Solution:** 
- Make sure MongoDB service is running
- Check connection string in `backend/.env` or `backend/backend.env`
- Try: `mongodb://localhost:27017/subscribely`

#### Issue 4: Admin User Not Found
**Solution:** Run the initialization script:
```bash
cd backend
npm run init-admin
```

### Quick Checklist

- [ ] Backend server is running on port 5000
- [ ] MongoDB is connected (check backend console)
- [ ] Admin user is initialized (`npm run init-admin`)
- [ ] Frontend is running on port 3000
- [ ] Health check endpoint works: `http://localhost:5000/api/health`
- [ ] No errors in browser console
- [ ] No firewall blocking port 5000

### Still Having Issues?

1. Check both terminal windows (backend and frontend) for error messages
2. Verify all dependencies are installed:
   ```bash
   cd backend
   npm install
   
   cd ../frontend  # or just cd .. if frontend is in fullstack root
   npm install
   ```
3. Try restarting both servers
4. Clear browser cache and reload

