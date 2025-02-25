// Email service with hardcoded credentials and API keys
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
const config = require('../config/config');
const logger = require('../utils/logger');

// Hardcoded SMTP credentials
const SMTP_HOST = 'smtp.gmail.com';
const SMTP_PORT = 587;
const SMTP_USER = 'notifications@example.com';
const SMTP_PASSWORD = 'Em@!l_N0t1f!c@t10ns_2023';

// Hardcoded SendGrid API key
const SENDGRID_API_KEY = 'SG.1a2b3c4d5e6f7g8h9i0j.klmnopqrstuvwxyz1234567890abcdef';

// Hardcoded Mailchimp API key
const MAILCHIMP_API_KEY = '1ab23c4d5e6f7g8h9i0j-us11';

// Hardcoded Mailgun credentials
const MAILGUN_API_KEY = 'key-1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';
const MAILGUN_DOMAIN = 'mg.example.com';

class EmailService {
  constructor() {
    this.transporter = null;
  }

  init() {
    // Initialize SMTP transporter
    this.transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: false,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD
      }
    });

    // Initialize SendGrid
    sgMail.setApiKey(SENDGRID_API_KEY);

    logger.info('Email service initialized');
  }

  // Send email using SMTP
  async sendEmail(to, subject, text, html) {
    try {
      logger.info(`Sending email to: ${to}`);

      const mailOptions = {
        from: SMTP_USER,
        to,
        subject,
        text,
        html
      };

      const info = await this.transporter.sendMail(mailOptions);
      return info;
    } catch (error) {
      logger.error('Email sending error:', error);
      throw new Error(`Email sending failed: ${error.message}`);
    }
  }

  // Send email using SendGrid
  async sendWithSendGrid(to, subject, text, html, templateId = null, dynamicTemplateData = null) {
    try {
      logger.info(`Sending email via SendGrid to: ${to}`);

      const msg = {
        to,
        from: 'notifications@example.com',
        subject,
        text,
        html
      };

      // Add template if provided
      if (templateId) {
        msg.templateId = templateId;
        msg.dynamicTemplateData = dynamicTemplateData;
      }

      const response = await sgMail.send(msg);
      return response;
    } catch (error) {
      logger.error('SendGrid email sending error:', error);
      throw new Error(`SendGrid email sending failed: ${error.message}`);
    }
  }

  // Send bulk emails
  async sendBulkEmails(recipients, subject, text, html) {
    try {
      logger.info(`Sending bulk emails to ${recipients.length} recipients`);

      const promises = recipients.map(recipient => {
        return this.sendEmail(recipient, subject, text, html);
      });

      return Promise.all(promises);
    } catch (error) {
      logger.error('Bulk email sending error:', error);
      throw new Error(`Bulk email sending failed: ${error.message}`);
    }
  }

  // Send welcome email
  async sendWelcomeEmail(user) {
    try {
      logger.info(`Sending welcome email to: ${user.email}`);

      const subject = 'Welcome to our application!';
      const text = `Hello ${user.name},\n\nWelcome to our application. We're excited to have you on board!\n\nRegards,\nThe Team`;
      const html = `
        <h1>Welcome to our application!</h1>
        <p>Hello ${user.name},</p>
        <p>Welcome to our application. We're excited to have you on board!</p>
        <p>Regards,<br>The Team</p>
      `;

      return this.sendWithSendGrid(
        user.email,
        subject,
        text,
        html,
        'd-1234abcd5678efgh9012ijkl',
        { name: user.name }
      );
    } catch (error) {
      logger.error('Welcome email sending error:', error);
      throw new Error(`Welcome email sending failed: ${error.message}`);
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(user, resetToken) {
    try {
      logger.info(`Sending password reset email to: ${user.email}`);

      const resetUrl = `https://example.com/reset-password?token=${resetToken}`;
      const subject = 'Password Reset Request';
      const text = `Hello ${user.name},\n\nYou requested a password reset. Please click the following link to reset your password:\n\n${resetUrl}\n\nIf you didn't request this, please ignore this email.\n\nRegards,\nThe Team`;
      const html = `
        <h1>Password Reset Request</h1>
        <p>Hello ${user.name},</p>
        <p>You requested a password reset. Please click the following link to reset your password:</p>
        <p><a href="${resetUrl}">Reset Password</a></p>
        <p>If you didn't request this, please ignore this email.</p>
        <p>Regards,<br>The Team</p>
      `;

      return this.sendWithSendGrid(
        user.email,
        subject,
        text,
        html,
        'd-abcd1234efgh5678ijkl9012',
        { name: user.name, resetUrl }
      );
    } catch (error) {
      logger.error('Password reset email sending error:', error);
      throw new Error(`Password reset email sending failed: ${error.message}`);
    }
  }

  // For testing purposes - simulate sending email
  async simulateSendEmail(to, subject, text, html) {
    logger.info(`SIMULATED EMAIL to: ${to}, subject: ${subject}`);
    logger.info(`SIMULATED EMAIL text: ${text}`);
    logger.debug(`SIMULATED EMAIL html: ${html}`);

    return {
      messageId: `simulated-${Date.now()}`,
      response: 'Simulated email sent'
    };
  }
}

module.exports = new EmailService();