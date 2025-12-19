# Admin Dashboard Setup Guide

## Overview
The Admin Dashboard provides comprehensive management features for the Subscribely application, including user management, subscription management, and analytics.

## Admin Credentials
- **Email**: subscriblyinfo@gmail.com
- **Password**: achu0910

## Initial Setup

### 1. Initialize Admin User
Before using the admin dashboard, you need to create the admin user in the database:

```bash
cd subscribley/fullstack/backend
npm run init-admin
```

This script will:
- Connect to your MongoDB database
- Create an admin user with the credentials above
- Hash the password securely using bcrypt

### 2. Start the Backend Server
```bash
cd subscribley/fullstack/backend
npm start
# or for development
npm run dev
```

### 3. Start the Frontend
```bash
cd subscribley/fullstack
npm start
```

## Accessing the Admin Dashboard

1. Open the application in your browser (usually http://localhost:3000)
2. Click the "Admin Login" button (visible on the landing page)
3. Enter the admin credentials:
   - Email: subscriblyinfo@gmail.com
   - Password: achu0910

## Admin Dashboard Features

### Dashboard Statistics
- **Total Users**: Number of registered users
- **Active Subscriptions**: Currently active subscriptions
- **Expired Subscriptions**: Subscriptions that have expired
- **Renewal Reminders**: Count of renewal reminder emails sent
- **Email Alerts**: Total email alerts triggered
- **Trends Graphs**: Visual representation of subscription trends (daily, weekly, monthly)

### User Management
- View all registered users with pagination
- Search users by name or email
- Sort users by various fields (name, email, registration date)
- Filter users by status (active/inactive)
- Activate/Deactivate users
- Send direct email notifications to specific users

### Subscription Management
- View all subscriptions added by all users
- Search subscriptions by service name or plan
- Filter subscriptions by status (active, expired, cancelled)
- Add new subscriptions for any user
- Update subscription details (pricing, renewal duration, description)
- Delete subscriptions
- View subscription plans overview showing:
  - Number of subscribers per plan
  - Number of users subscribed to each plan
  - Average price and total revenue per plan

## API Endpoints

### Admin Authentication
- `POST /api/admin/login` - Admin login

### Dashboard
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

### User Management
- `GET /api/admin/users` - Get all users (with pagination, search, sort, filter)
- `PUT /api/admin/users/:id/status` - Activate/Deactivate user
- `POST /api/admin/users/:id/notify` - Send email notification to user

### Subscription Management
- `GET /api/admin/subscriptions` - Get all subscriptions (with filters)
- `POST /api/admin/subscriptions` - Create new subscription
- `PUT /api/admin/subscriptions/:id` - Update subscription
- `DELETE /api/admin/subscriptions/:id` - Delete subscription
- `GET /api/admin/subscriptions/plans` - Get subscription plans overview

## Security Features

- **JWT Token Authentication**: Admin routes are protected with JWT tokens
- **Password Hashing**: Admin passwords are hashed using bcrypt
- **Role-based Access**: Only users with admin role can access admin routes
- **Secure Middleware**: Admin authentication middleware verifies admin status

## Email Logging

All emails sent through the system (renewal reminders, alerts, notifications) are logged in the `EmailLog` collection for tracking and analytics purposes.

## Notes

- The admin user is created only once. Running `init-admin` multiple times will not create duplicate users.
- Admin tokens expire after 7 days (configurable via JWT_EXPIRE environment variable)
- All admin actions are logged for audit purposes
- The admin dashboard is fully responsive and works on mobile devices

