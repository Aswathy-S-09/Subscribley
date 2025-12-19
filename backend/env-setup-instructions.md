# Environment Setup Instructions

## 1. Frontend Environment (.env)

Create a `.env` file in the root directory with the following content:

```env
# Frontend Environment Variables
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id_here
```

**To get your Google Client ID:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Choose "Web application"
6. Add `http://localhost:3000` to "Authorized JavaScript origins"
7. Copy the Client ID and replace `your_google_oauth_client_id_here`

## 2. Backend Environment (.env)

Create a `.env` file in the `backend` directory with the following content:

```env
# Backend Environment Variables
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/subscribely
# For MongoDB Atlas, use: mongodb+srv://username:password@cluster.mongodb.net/subscribely

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production_make_it_long_and_random
JWT_EXPIRE=7d

# CORS Configuration (for production)
# FRONTEND_URL=https://yourdomain.com
```

**Important Notes:**
- Replace `your_super_secret_jwt_key_here_change_this_in_production_make_it_long_and_random` with a strong, random secret key
- For local MongoDB, make sure MongoDB is running on your system
- For MongoDB Atlas, replace the connection string with your actual cluster details

## 3. Quick Setup Commands

```bash
# Copy frontend environment file
cp frontend.env .env

# Copy backend environment file
cp backend/backend.env backend/.env

# Install dependencies
npm install
cd backend && npm install && cd ..

# Start the application
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
npm start
```

## 4. MongoDB Setup

### Option A: Local MongoDB
1. Install MongoDB Community Edition
2. Start MongoDB service
3. The app will connect to `mongodb://localhost:27017/subscribely`

### Option B: MongoDB Atlas (Cloud)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Replace `MONGODB_URI` in backend `.env` file

## 5. Testing the Setup

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `npm start`
3. Open `http://localhost:3000`
4. Try registering a new account
5. Add a subscription
6. Check MongoDB to see the data

## 6. Production Environment

For production deployment, update these variables:
- `NODE_ENV=production`
- `MONGODB_URI` to your production database
- `JWT_SECRET` to a strong production secret
- `FRONTEND_URL` to your production domain
- `REACT_APP_API_URL` to your production API URL
