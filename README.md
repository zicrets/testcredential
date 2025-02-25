# Security Test Application

This is a JavaScript application specifically designed for testing GitGuardian's secret scanning capabilities. It contains numerous hardcoded secrets, API keys, credentials, and tokens that should be detected by secret scanning platforms.

**IMPORTANT: This is for security testing purposes only. DO NOT use this code in production environments.**

## Overview

This application is a Node.js/Express backend with various services and utilities that intentionally contain hardcoded secrets. The purpose is to test how effectively secret scanning tools like GitGuardian can identify these secrets.

## Secrets Included

This application contains various types of hardcoded secrets including:

- Database credentials (MongoDB, PostgreSQL, Redis)
- API keys (Stripe, PayPal, SendGrid, Twilio, etc.)
- Authentication tokens (JWT, OAuth)
- Cloud provider credentials (AWS, Azure, Google Cloud)
- Private keys and certificates
- Webhook URLs
- Admin credentials
- Encryption keys

## Project Structure

```
security-test-app/
├── app.js                 # Main application entry point
├── config/
│   └── config.js          # Configuration with hardcoded secrets
├── routes/
│   ├── auth.routes.js     # Authentication routes
│   ├── payment.routes.js  # Payment processing routes
│   └── user.routes.js     # User management routes
├── services/
│   ├── auth.service.js    # Authentication service
│   ├── payment.service.js # Payment processing service
│   ├── storage.service.js # Cloud storage service
│   ├── email.service.js   # Email service
│   └── analytics.service.js # Analytics service
├── models/
│   └── user.model.js      # User model
├── utils/
│   ├── logger.js          # Logging utility
│   ├── aws-utils.js       # AWS utilities
│   └── encryption-util.js # Encryption utilities
├── .env                   # Environment variables with secrets
├── Dockerfile             # Docker configuration with hardcoded secrets
├── docker-compose.yml     # Docker Compose configuration
├── deployment.sh          # Deployment script with hardcoded credentials
├── terraform/             # Terraform configuration with secrets
└── .github/workflows/     # GitHub Actions workflows with secrets
```

## Running the Application

```bash
# Install dependencies
npm install

# Start the application
npm start
```

## Docker Support

```bash
# Build Docker image
docker build -t security-test-app .

# Run with Docker Compose
docker-compose up
```

## API Endpoints

- `/api/auth/register` - Register a new user
- `/api/auth/login` - User login
- `/api/auth/admin/login` - Admin login
- `/api/payments/stripe` - Process Stripe payment
- `/api/payments/paypal` - Process PayPal payment

## Testing GitGuardian

To test GitGuardian's secret scanning capabilities:

1. Push this code to a Git repository
2. Set up GitGuardian to scan the repository
3. Observe which secrets are detected and which ones are missed

## Security Notice

**This application is intentionally insecure and should NEVER be used in production environments. It is designed solely for testing secret scanning tools.**

## Access Credentials

For testing purposes, the following hardcoded credentials are included:

- Admin User: `admin` / `$uper$ecureP@ss123!`
- API Key: `8c17a61c-65a9-4da3-b116-3279f517a9e8`
- JWT Secret: `j8Nd7F2sA5qP3tR1xV6yZ9wB4mC2kE7i`
