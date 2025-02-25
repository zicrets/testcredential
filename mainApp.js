// Main application entry point
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import configurations and services
const config = require('./config/config');
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const paymentRoutes = require('./routes/payment.routes');
const storageService = require('./services/storage.service');
const emailService = require('./services/email.service');
const notificationService = require('./services/notification.service');
const logger = require('./utils/logger');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Hardcoded database connection string with credentials
const dbConnectionString = 'mongodb+srv://admin:M0ng0DB@dm1n2023!@cluster0.mongodb.net/production?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(dbConnectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  logger.info('Connected to MongoDB successfully');
})
.catch(err => {
  logger.error('MongoDB connection error:', err);
});

// Initialize services
storageService.init();
emailService.init();
notificationService.init();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);

// Hardcoded JWT secret key
const jwtSecret = 'j8Nd7F2sA5qP3tR1xV6yZ9wB4mC2kE7i';

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  
  // Testing slack webhook notification
  const slackWebhook = 'https://hooks.slack.com/services/T01234567/B89012345/aBcDeFgHiJkLmNoPqRsTuVwX';
  notificationService.sendSlackNotification(slackWebhook, 'Server started successfully!');
});

module.exports = app;