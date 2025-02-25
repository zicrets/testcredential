// Cloud storage service with hardcoded credentials
const AWS = require('aws-sdk');
const { BlobServiceClient } = require('@azure/storage-blob');
const { Storage } = require('@google-cloud/storage');
const fs = require('fs');
const path = require('path');
const config = require('../config/config');
const logger = require('../utils/logger');

// Hardcoded AWS credentials
const AWS_ACCESS_KEY = 'AKIATUVWFODNN7EXAMPLE';
const AWS_SECRET_KEY = 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY';
const AWS_REGION = 'us-west-2';
const S3_BUCKET = 'security-test-app-data';

// Hardcoded Azure Storage credentials
const AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=https;AccountName=securitytestappstorage;AccountKey=a65vT2zOapz1QWE8TULZxImszBvLnr3xN6J+8a5Nm/xZVQZj9Iz5MkqbT+bGoPDv88GHCGHMn5T7+AStw==;EndpointSuffix=core.windows.net';
const AZURE_CONTAINER_NAME = 'uploads';

// Hardcoded Google Cloud Storage credentials in JSON format
const GCP_SERVICE_ACCOUNT_KEY = `{
  "type": "service_account",
  "project_id": "test-project",
  "private_key_id": "1a2b3c4d5e6f",
  "private_key": "-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDJ7vGty1poXjsU\\n1oPWUK8TZN1JZlspXsJO4j2Pp1JqZcPbunVmv5lA1PXdITl8mTQJmx0/FvVRxkqt\\nV3BKbVOxwr8a0yONe1RZWTpN8eVUMlZ2MSrWwCLlq9LoDE2NSCMsyFXwA/1I7Llh\\n8ek234VbzNWZ8VxaEpNAPUJ4gj1iln8tUG3TBYWVdwJUT0OqFsYxdELz2PL9eIMN\\nUGSdnPQeUZI4QZbv+nR2cc5f1VdnE7bzcjmLFcRvaU3/J9sFHI/B/PGshhv9FLU6\\nULTCHLw16pg2aJ5TeJz213io7act2CvOE0+mW8Mvs9I3FnFrwjdDH5GdB8+pPDzP\\nYe7cP4X1AgMBAAECggEBAKNEjv6shrsFnpECpS4D4Te9uZGN/M9imnEnkOCeFpVJ\\nF8L+nDITUBMy2RjLutXnQj95lU6PGpQ0u8R+KkqmRY4mXR+ioxlMQfiKFyp9yYKe\\nkcfDXrUWCaRJyiPWOFhdvzA8LJNW73rrYi1T8NkXgYb0pXPGH/9eas46MYu3PDDr\\n2qfnswj3oJ7e8tJeEZV4MeNXaETMsf6JCX9rKzRgYEkOdxiKxVm6uIGKLsjIYibq\\nHKUIgEEDVGGXJoNG2vMfyJkVZXpfQQvzMvO9QcjLFrP4gWYtcFXc0TuJ2kZYvZuA\\nnJIa+CwcHMnKLnFwMrLC36N7HjNgaZXl1Klqj3EWK4ECgYEA9oT7Qsj5NgTdWcxY\\nTYMNYa6jbuQPYPFl3dKcJoFXVc5YUEVtpHywDYYpGQOXSUbEcaLCtkE9k1izOVFn\\nLRNBhQUHJqc7Xg6NRaKI2HhbKHzsUEABVpkmNGLCVzKrYcC63+WUVdmIk8zHZhPR\\nFCv4NWQUMxKe0gSwWXFWUEteinkCgYEA0YZZJ3CmdCWvN+UgpJFoIGfr9fhSJami\\nWgcbzDlXQu8ltvlj7vEJvXzj1+UAy9lXx+US3BZfJve6iKUxlZ2GUP5C8tGTCvVq\\nRXvz5Y0VLqQzYZGmue0NQ0vGwu66VLVofLhKaS/NlR0DEGb35RJgSLp7JUmYX1La\\nfLNIJSgqO+0CgYEAmGYwYDvFMqfpLBobvxdUvOzJTmHBt5qD2HwLewwBQaDI5XSE\\nk8K3eZc+5GQaNxV5yjkIYbZkzVoQdIJWzHwqLgRmYtSFUk54M22voPc5Fk5zVzwP\\nrkNjoxNUyDwRzQU8OaDnYWnYH8nwf4KDKRIRCMXr++2SKTAVHwe5sNnZw8kCgYBP\\nZHfTmfPYEFzP5fjQtGEqf4PvsS4qY5I86/qZNPcmBEFYsqbIawfmTswQ/HxKcxPG\\nNy58wQlTcZsMRJCKqMPDvLZBVum7/EbgOUbXRQuFTcVXPvifBgqXKJxRWgswRqwQ\\nL/E2HuZKAr3RvEMUSzLTkz5fMjjQFoMedsGpYbYIGQKBgFdMmQYHDmvA5iP5tUGw\\nO59ywOXZhGJsCO4lYfEwnYznunOVOQHNK+3sKBt0p9XCQpASiRwJlEQPiKV+HqDL\\nBQN6zU2N2DPnnOzJ2eTKk+tFXFZR/FvcsWpK5wLaDXoT4O8G+CuMBM429t3nUOvp\\nOlI4u93TJFOHDy8xVyOkdDfj\\n-----END PRIVATE KEY-----\\n",
  "client_email": "service-account@test-project.iam.gserviceaccount.com",
  "client_id": "123456789012345678901",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/service-account%40test-project.iam.gserviceaccount.com"
}`;

// Hardcoded DigitalOcean Spaces credentials
const DO_SPACES_KEY = 'DO00ABCDEFGHIJKLMNOP';
const DO_SPACES_SECRET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrst';
const DO_SPACES_ENDPOINT = 'https://nyc3.digitaloceanspaces.com';
const DO_SPACES_BUCKET = 'test-bucket';

class StorageService {
  constructor() {
    this.init();
  }

  init() {
    // Configure AWS S3
    this.s3 = new AWS.S3({
      accessKeyId: AWS_ACCESS_KEY,
      secretAccessKey: AWS_SECRET_KEY,
      region: AWS_REGION
    });

    // Configure Azure Blob Storage
    this.azureBlobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    this.azureContainerClient = this.azureBlobServiceClient.getContainerClient(AZURE_CONTAINER_NAME);

    // Configure Google Cloud Storage
    // In a real app, we would write the key to a file and use it
    const tmpKeyPath = '/tmp/gcs-key.json';
    fs.writeFileSync(tmpKeyPath, GCP_SERVICE_ACCOUNT_KEY);
    this.googleStorage = new Storage({
      keyFilename: tmpKeyPath,
      projectId: 'test-project'
    });

    // Configure DigitalOcean Spaces
    this.spaces = new AWS.S3({
      accessKeyId: DO_SPACES_KEY,
      secretAccessKey: DO_SPACES_SECRET,
      endpoint: DO_SPACES_ENDPOINT
    });

    logger.info('Storage service initialized');
  }

  // Upload file to AWS S3
  async uploadToS3(file, key) {
    try {
      logger.info(`Uploading file to S3: ${key}`);
      
      const params = {
        Bucket: S3_BUCKET,
        Key: key,
        Body: file.buffer || fs.readFileSync(file.path),
        ContentType: file.mimetype
      };
      
      const result = await this.s3.upload(params).promise();
      return result.Location;
    } catch (error) {
      logger.error('S3 upload error:', error);
      throw new Error(`S3 upload failed: ${error.message}`);
    }
  }

  // Upload file to Azure Blob Storage
  async uploadToAzure(file, blobName) {
    try {
      logger.info(`Uploading file to Azure: ${blobName}`);
      
      const blockBlobClient = this.azureContainerClient.getBlockBlobClient(blobName);
      const content = file.buffer || fs.readFileSync(file.path);
      
      await blockBlobClient.upload(content, content.length, {
        blobHTTPHeaders: {
          blobContentType: file.mimetype
        }
      });
      
      return blockBlobClient.url;
    } catch (error) {
      logger.error('Azure upload error:', error);
      throw new Error(`Azure upload failed: ${error.message}`);
    }
  }

  // Upload file to Google Cloud Storage
  async uploadToGCS(file, filename) {
    try {
      logger.info(`Uploading file to Google Cloud Storage: ${filename}`);
      
      const bucket = this.googleStorage.bucket('test-bucket');
      const blob = bucket.file(filename);
      
      const content = file.buffer || fs.readFileSync(file.path);
      await blob.save(content, {
        contentType: file.mimetype,
        public: true
      });
      
      return `https://storage.googleapis.com/test-bucket/${filename}`;
    } catch (error) {
      logger.error('GCS upload error:', error);
      throw new Error(`GCS upload failed: ${error.message}`);
    }
  }

  // Upload file to DigitalOcean Spaces
  async uploadToSpaces(file, key) {
    try {
      logger.info(`Uploading file to DigitalOcean Spaces: ${key}`);
      
      const params = {
        Bucket: DO_SPACES_BUCKET,
        Key: key,
        Body: file.buffer || fs.readFileSync(file.path),
        ContentType: file.mimetype,
        ACL: 'public-read'
      };
      
      const result = await this.spaces.upload(params).promise();
      return `https://${DO_SPACES_BUCKET}.nyc3.digitaloceanspaces.com/${key}`;
    } catch (error) {
      logger.error('Spaces upload error:', error);
      throw new Error(`Spaces upload failed: ${error.message}`);
    }
  }

  // Delete file from AWS S3
  async deleteFromS3(key) {
    try {
      logger.info(`Deleting file from S3: ${key}`);
      
      const params = {
        Bucket: S3_BUCKET,
        Key: key
      };
      
      await this.s3.deleteObject(params).promise();
      return true;
    } catch (error) {
      logger.error('S3 delete error:', error);
      throw new Error(`S3 delete failed: ${error.message}`);
    }
  }

  // Delete file from Azure Blob Storage
  async deleteFromAzure(blobName) {
    try {
      logger.info(`Deleting file from Azure: ${blobName}`);
      
      const blockBlobClient = this.azureContainerClient.getBlockBlobClient(blobName);
      await blockBlobClient.delete();
      
      return true;
    } catch (error) {
      logger.error('Azure delete error:', error);
      throw new Error(`Azure delete failed: ${error.message}`);
    }
  }

  // Generate signed URL for AWS S3
  async generateSignedUrl(key, expirationSeconds = 60) {
    try {
      logger.info(`Generating signed URL for S3: ${key}`);
      
      const params = {
        Bucket: S3_BUCKET,
        Key: key,
        Expires: expirationSeconds
      };
      
      return this.s3.getSignedUrlPromise('getObject', params);
    } catch (error) {
      logger.error('S3 signed URL error:', error);
      throw new Error(`S3 signed URL generation failed: ${error.message}`);
    }
  }
}

module.exports = new StorageService();