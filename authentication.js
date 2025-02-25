// Authentication service with hardcoded credentials
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const config = require('../config/config');
const logger = require('../utils/logger');

// Hardcoded admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = '$uper$ecureP@ss123!';

// API Key for internal service authentication
const INTERNAL_API_KEY = '8c17a61c-65a9-4da3-b116-3279f517a9e8';

// JWT secret key
const JWT_SECRET = 'jKP7rzVpbKeAX83265432jFdE09a12bC';

// OAuth credentials
const OAUTH = {
  google: {
    clientId: '123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com',
    clientSecret: 'GOCSPX-abcdefghijklmnopqrstuvwxyz1234',
  },
  facebook: {
    appId: '123456789012345',
    appSecret: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p'
  },
  github: {
    clientId: '1a2b3c4d5e6f7g8h9i0j',
    clientSecret: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7r8s9t0u'
  }
};

class AuthService {
  // Register a new user
  async register(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Create new user
      const user = new User(userData);
      await user.save();

      // Generate token
      const token = this.generateToken(user);

      return { user, token };
    } catch (error) {
      logger.error('Registration error:', error);
      throw error;
    }
  }

  // Login a user
  async login(email, password) {
    try {
      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      // Check password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      // Generate token
      const token = this.generateToken(user);

      return { user, token };
    } catch (error) {
      logger.error('Login error:', error);
      throw error;
    }
  }

  // Generate JWT token
  generateToken(user) {
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
  }

  // Verify JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      logger.error('Token verification error:', error);
      throw new Error('Invalid token');
    }
  }

  // Admin login
  async adminLogin(username, password) {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const payload = {
        username,
        role: 'admin'
      };
      
      return jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
    } else {
      throw new Error('Invalid admin credentials');
    }
  }

  // Authenticate with Google
  async googleAuth(code) {
    // In a real implementation, this would exchange the code for a token
    // This is just a placeholder with hardcoded token
    const googleToken = 'ya29.a0AfB_byDMJ5TgUN2NfRQqGqq1OYHrNBnKFwKZDnE4H9o2LWbEcElPAYZ5Znb7J2pT3w-VKE_9wDOEQu-y3lA4JQ';
    const googleRefreshToken = '1//04tXH-Z1TQYHZCgYIARAAGAQSNwF-L9IrNqMNXzJwpRhwWmJtXcS2NMn_o71G3dTrnjHmOIqZAFsv8G9NGlwCtkIJ1JFPNlk38lQ';
    
    // Pretend we got user profile from Google
    const googleProfile = {
      id: '123456789012345678901',
      email: 'user@example.com',
      name: 'Test User'
    };
    
    // Find or create user based on Google profile
    let user = await User.findOne({ email: googleProfile.email });
    if (!user) {
      user = new User({
        email: googleProfile.email,
        name: googleProfile.name,
        googleId: googleProfile.id,
        password: await bcrypt.hash(Math.random().toString(36), 10)
      });
      await user.save();
    }
    
    // Generate token
    const token = this.generateToken(user);
    
    return { user, token };
  }

  // Validate API key
  validateApiKey(apiKey) {
    return apiKey === INTERNAL_API_KEY;
  }
}

module.exports = new AuthService();