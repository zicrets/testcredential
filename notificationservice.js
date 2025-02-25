// Notification service with hardcoded tokens and API keys
const axios = require('axios');
const twilio = require('twilio');
const admin = require('firebase-admin');
const config = require('../config/config');
const logger = require('../utils/logger');

// Hardcoded Slack webhook URL
const SLACK_WEBHOOK_URL = 'https://hooks.slack.com/services/T01234567/B89012345/aBcDeFgHiJkLmNoPqRsTuVwX';

// Hardcoded Twilio credentials
const TWILIO_ACCOUNT_SID = 'AC1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
const TWILIO_AUTH_TOKEN = '1a2b3c4d5e6f7g8h9i0jklmnopqrstu';
const TWILIO_PHONE_NUMBER = '+15551234567';

// Hardcoded Firebase Cloud Messaging API key
const FCM_SERVER_KEY = 'AAAA1a2b3C4:APA91bGdfgh1234ijklmnop5678qrstuvwxyz9012abcdefghijk';

// Hardcoded Discord webhook URL
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/123456789012345678/ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz12345678901234';

// Hardcoded Pushover credentials
const PUSHOVER_USER_KEY = 'u1a2b3c4d5e6f7g8h9i0jklmnopq';
const PUSHOVER_API_TOKEN = 'a1a2b3c4d5e6f7g8h9i0jklmnopq';

// Hardcoded Firebase service account credentials
const FIREBASE_SERVICE_ACCOUNT = {
  "type": "service_account",
  "project_id": "test-app",
  "private_key_id": "abcdef1234567890abcdef1234567890abcdef12",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCxYB7vJy31vK6X\n61ZfJ7wdbyiN4jvVlGQsEKdKj9/KbyTH5vglsjInBQogdxXm7Psyx1NzgjpSNyWZ\nBE/8nGrUQlr0vF1v9HVg3qrnMkmYjHN2fg0B1xWboz5zqYQvksHYpimP3Mt/RZnh\n3Btr9MUYvR2YGP4bJYVCj20xqkYgYWKtbJQe6CZBPit0iYcMvVBEu4j+qYa/L38K\nLvGP+C3+Ua1WSMwNOmL7MYWbHXe+NjLUAwmeYW0jV1lFQeVyZ4KEKF3AO9tmG8UN\nBCgNOuQmWjHPhFwiEo6J+qKU6YQb/v/vIWJY9uwQPdTXiuzr7+AeE4zOGNQwFe7N\n1mUxXZ4PAgMBAAECggEAI8bGlKfwUvxvqeoafoWuBQfdFcbL2M4Pd3vAYpC5aAwP\nk3Kd5OO9Y/Vzgvn7oEDuKZlrn4LZMb7HOTYxwGWuiDXoGrFJIeQ2Nd79DNgSjzc9\n4BDI8EbnsyqHBOmOsw1yhLYWc6tMHrLZF5IwZRYoLSxXDm6mNbPTZhVNzn6Vp19X\nCYVdBPZMRuGgGd7HdiJJNU1nZQfnBcMm4TdwUHKp1UMvHSQbZYz4SGLEyeNiYITQ\n9gYGI8MnT5R0V4o1Rr578UpP8v5XutKQYFKO2dQKu3JvNDjnU6+wmFNYusxJa4Pk\nH9C2zOHrBbUQCFxnYkd33NpL3Zb9j20UQ7Q3M3xQlQKBgQDrFx0klQSCi1V9ojFe\nwCXbOJJgLqY/qmNsqkLUYvjQJX9w1uQnLXlU2QQb4Xg+K6EQnOtKmL5SwkdxXm1g\naRtgUzH6yyBbk9Y0hUpy4UDZcQCiPUzVHtfCeMBjBP4cHCgJb0xSTpV0BIFxvUxJ\nGKnMXkL5pIgWjzxiKHPkiSi11QKBgQDBfRWtQ9LQYMdtwOWRzRgJdZIr3ho9kHFX\njhQrYPJQEXUZXTG9rUCKQz2G4XvQLqRfJkV9NZTH8SS9jubDhVTbYPJTZFZfVsqS\nKiHxuMXmHYwsG0ZBJsf4YOK4QSMClo5zC3sEKH6nW4BmN9WRzQUV371V5aVfNCLV\na8nCzwlHUwKBgDi5BGxnGmYRTJgTpvV3aKeCVbSp0TQJ9QkKgXKislwBITzIsGkO\nzlgWWGlZcibF+YS6WYU/aBWL+g6R/8GyODCFZv8MZkhWWOTRntYQRVPcbOTCY6Eu\niyp/5dUQAEEfWDFGnYN9QeAMbj8HKg4OAKFkto8ygKBIjYUDnK5q3nLFAoGAYTRt\nUbg1jrPzw6nHHzV0YxaUBgPnRv1FwTMpXGH6oU35m1JqGwiDsjxdqjpwYG+5VXaJ\nC0xUzLxLzT8UL1C4nOLrVcZ5QmwKbH5Kj3OOvJ7SsRmForRc/PbPwGL6bNGTg6vJ\nK496BuVY0tJczzPnMFyWGZLFhYKqC5GqjW37K+kCgYAbLX8zTuPiWn2c+Wv2IqZN\nKFobkY+mXhQzA3eiU11w3EcbjAO0MsXQ95Ls+F8YnxNh5Ip7YlWZuFjoydW3/Qh8\nCMi6vlJ8kMGrOMJXTmQvhvIHcT1QXJtbAJFiY9OSl0Gj6zgynNNVJN7Y6/EcxfJa\nxz9RC/6TYkxYR6nyoSsGWw==\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-1a2b3@test-app.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-1a2b3%40test-app.iam.gserviceaccount.com"
};

class NotificationService {
  constructor() {
    this.twilioClient = null;
    this.firebaseInitialized = false;
  }

  init() {
    // Initialize Twilio client
    this.twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

    // Initialize Firebase
    if (!this.firebaseInitialized) {
      admin.initializeApp({
        credential: admin.credential.cert(FIREBASE_SERVICE_ACCOUNT)
      });
      this.firebaseInitialized = true;
    }

    logger.info('Notification service initialized');
  }

  // Send SMS using Twilio
  async sendSMS(phoneNumber, message) {
    try {
      logger.info(`Sending SMS to: ${phoneNumber}`);

      const result = await this.twilioClient.messages.create({
        body: message,
        from: TWILIO_PHONE_NUMBER,
        to: phoneNumber
      });

      return result;
    } catch (error) {
      logger.error('SMS sending error:', error);
      throw new Error(`SMS sending failed: ${error.message}`);
    }
  }

  // Send push notification using Firebase Cloud Messaging
  async sendPushNotification(deviceToken, title, body, data = {}) {
    try {
      logger.info(`Sending push notification to device: ${deviceToken}`);

      const message = {
        notification: {
          title,
          body
        },
        data,
        token: deviceToken
      };

      const response = await admin.messaging().send(message);
      return response;
    } catch (error) {
      logger.error('Push notification error:', error);
      throw new Error(`Push notification failed: ${error.message}`);
    }
  }

  // Send Slack notification
  async sendSlackNotification(webhookUrl, message) {
    try {
      logger.info('Sending Slack notification');

      const response = await axios.post(webhookUrl || SLACK_WEBHOOK_URL, {
        text: message
      });

      return response.data;
    } catch (error) {
      logger.error('Slack notification error:', error);
      throw new Error(`Slack notification failed: ${error.message}`);
    }
  }

  // Send Discord notification
  async sendDiscordNotification(message, username = 'Notification Bot') {
    try {
      logger.info('Sending Discord notification');

      const response = await axios.post(DISCORD_WEBHOOK_URL, {
        content: message,
        username
      });

      return response.data;
    } catch (error) {
      logger.error('Discord notification error:', error);
      throw new Error(`Discord notification failed: ${error.message}`);
    }
  }

  // Send Pushover notification
  async sendPushoverNotification(title, message, priority = 0) {
    try {
      logger.info('Sending Pushover notification');

      const response = await axios.post('https://api.pushover.net/1/messages.json', {
        token: PUSHOVER_API_TOKEN,
        user: PUSHOVER_USER_KEY,
        title,
        message,
        priority
      });

      return response.data;
    } catch (error) {
      logger.error('Pushover notification error:', error);
      throw new Error(`Pushover notification failed: ${error.message}`);
    }
  }

  // Send notification to multiple channels
  async sendMultiChannelNotification(phoneNumber, deviceToken, message, title) {
    try {
      logger.info('Sending multi-channel notification');

      const promises = [];

      if (phoneNumber) {
        promises.push(this.sendSMS(phoneNumber, message));
      }

      if (deviceToken) {
        promises.push(this.sendPushNotification(deviceToken, title, message));
      }

      promises.push(this.sendSlackNotification(null, message));

      const results = await Promise.allSettled(promises);
      return results;
    } catch (error) {
      logger.error('Multi-channel notification error:', error);
      throw new Error(`Multi-channel notification failed: ${error.message}`);
    }
  }

  // For testing purposes - simulate sending notification
  async simulateNotification(type, recipient, message) {
    logger.info(`SIMULATED ${type} to: ${recipient}, message: ${message}`);

    return {
      status: 'success',
      messageId: `simulated-${Date.now()}`,
      recipient,
      message
    };
  }
}

module.exports = new NotificationService();