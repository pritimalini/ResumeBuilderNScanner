const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Database connection
const { connectDB } = require('./config/db');

// Import routes
const userRoutes = require('./routes/userRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const authRoutes = require('./routes/authRoutes');
const analysisRoutes = require('./routes/analysisRoutes');

// Express app
const app = express();

// Connect to database
connectDB();

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // Get allowed origins from environment variable
    const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'];
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    // In development, or if request has no origin (like mobile apps), allow
    if (isDevelopment || !origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set static folder
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/analysis', analysisRoutes);

// Base route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
}); 