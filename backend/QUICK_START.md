# Quick Start Guide - Admin Dashboard

## ⚡ Quick Fix for Connection Error

If you're seeing "Unable to connect to server", follow these steps:

### 1. Start Backend Server

Open a **NEW terminal window** and run:

```bash
cd "C:\Users\smeha\OneDrive\Desktop\subscribley (2)\subscribley\fullstack\backend"
npm start
```

**Wait for this message:**
```
🚀 Server running on port 5000
MongoDB Connected: ...
```

### 2. Initialize Admin User (First Time Only)

In the **same backend terminal**, run:

```bash
npm run init-admin
```

You should see:
```
✅ Admin user created successfully
Email: subscriblyinfo@gmail.com
Password: achu0910
```

### 3. Keep Backend Running

**IMPORTANT:** Keep the backend terminal window open and running. Don't close it!

### 4. Start Frontend (If Not Already Running)

Open a **DIFFERENT terminal window** and run:

```bash
cd "C:\Users\smeha\OneDrive\Desktop\subscribley (2)\subscribley\fullstack"
npm start
```

### 5. Test Connection

1. Open browser: `http://localhost:5000/api/health`
2. You should see: `{"success":true,"message":"Subscribely API is running",...}`

### 6. Login to Admin Dashboard

1. Go to: `http://localhost:3000`
2. Click "Admin Login" button
3. Enter:
   - Email: `subscriblyinfo@gmail.com`
   - Password: `achu0910`

---

## 🔧 If Still Not Working

### Check MongoDB Connection

Make sure MongoDB is running. The backend should show:
```
MongoDB Connected: localhost:27017
```

If you see MongoDB errors:
1. Start MongoDB service
2. Or update `backend/.env` with your MongoDB connection string

### Check Port 5000

If port 5000 is busy:
1. Find what's using it: `netstat -ano | findstr :5000`
2. Or change port in `backend/.env`: `PORT=5001`
3. Update frontend `src/services/api.js`: Change `localhost:5000` to `localhost:5001`

### Verify .env File

Make sure `backend/.env` exists (not just `backend.env`). Copy from `backend.env` if needed:

```bash
cd backend
copy backend.env .env
```

---

## ✅ Success Indicators

You'll know it's working when:
- ✅ Backend shows: "Server running on port 5000"
- ✅ Backend shows: "MongoDB Connected"
- ✅ Health check works: `http://localhost:5000/api/health`
- ✅ Admin login page shows: "✅ Backend connected" (green message)
- ✅ Login works without errors

---

## 📞 Still Need Help?

1. Check both terminal windows for error messages
2. Open browser console (F12) and check for errors
3. Verify all files are saved
4. Try restarting both servers

