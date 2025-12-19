require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');
const connectDB = require('../config/database');

const initAdmin = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'subscriblyinfo@gmail.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists');
      process.exit(0);
    }
    
    // Create admin user
    const admin = new Admin({
      email: 'subscriblyinfo@gmail.com',
      password: 'achu0910',
      role: 'admin',
      isActive: true
    });
    
    await admin.save();
    console.log('✅ Admin user created successfully');
    console.log('Email: subscriblyinfo@gmail.com');
    console.log('Password: achu0910');
    
    process.exit(0);
  } catch (error) {
    console.error('Error initializing admin:', error);
    process.exit(1);
  }
};

initAdmin();

