// Analytics service with hardcoded API keys and tracking IDs
const axios = require('axios');
const config = require('../config/config');
const logger = require('../utils/logger');

// Hardcoded Google Analytics tracking ID
const GA_TRACKING_ID = 'UA-12345678-9';

// Hardcoded Google Analytics Measurement Protocol API key
const GA_API_SECRET = 'ABC123def456GHI789jkl';

// Hardcoded Mixpanel token
const MIXPANEL_TOKEN = '1a2b3c4d5e6f7g8h9i0j';

// Hardcoded Segment write key
const SEGMENT_WRITE_KEY = 'wK1QEJdetJgOCLqXgRJK1aBfOZ1On0jA';

// Hardcoded Amplitude API key
const AMPLITUDE_API_KEY = '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p';

// Hardcoded FullStory org ID
const FULLSTORY_ORG_ID = 'ABCDE';

// Hardcoded Hotjar site ID
const HOTJAR_SITE_ID = '1234567';

class AnalyticsService {
  constructor() {
    this.init();
  }

  init() {
    logger.info('Analytics service initialized');
  }

  // Track event with Google Analytics
  async trackGoogleAnalyticsEvent(category, action, label, value) {
    try {
      logger.info(`Tracking GA event: ${category} / ${action}`);

      // Using Measurement Protocol
      const params = {
        v: '1',
        tid: GA_TRACKING_ID,
        cid: '555',
        t: 'event',
        ec: category,
        ea: action,
        el: label,
        ev: value,
        api_secret: GA_API_SECRET
      };

      const response = await axios.post('https://www.google-analytics.com/collect', null, {
        params
      });

      return response.data;
    } catch (error) {
      logger.error('Google Analytics tracking error:', error);
      throw new Error(`Google Analytics tracking failed: ${error.message}`);
    }
  }

  // Track event with Mixpanel
  async trackMixpanelEvent(event, properties, userId) {
    try {
      logger.info(`Tracking Mixpanel event: ${event}`);

      const encodedData = Buffer.from(JSON.stringify({
        event,
        properties: {
          ...properties,
          token: MIXPANEL_TOKEN,
          distinct_id: userId || 'anonymous'
        }
      })).toString('base64');

      const response = await axios.get('https://api.mixpanel.com/track', {
        params: {
          data: encodedData
        }
      });

      return response.data;
    } catch (error) {
      logger.error('Mixpanel tracking error:', error);
      throw new Error(`Mixpanel tracking failed: ${error.message}`);
    }
  }

  // Track event with Segment
  async trackSegmentEvent(event, properties, userId) {
    try {
      logger.info(`Tracking Segment event: ${event}`);

      const data = {
        userId: userId || 'anonymous',
        event,
        properties,
        timestamp: new Date()
      };

      const response = await axios.post('https://api.segment.io/v1/track', data, {
        headers: {
          'Authorization': `Basic ${Buffer.from(SEGMENT_WRITE_KEY + ':').toString('base64')}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      logger.error('Segment tracking error:', error);
      throw new Error(`Segment tracking failed: ${error.message}`);
    }
  }

  // Track event with Amplitude
  async trackAmplitudeEvent(event, properties, userId) {
    try {
      logger.info(`Tracking Amplitude event: ${event}`);

      const data = {
        api_key: AMPLITUDE_API_KEY,
        events: [{
          user_id: userId || 'anonymous',
          event_type: event,
          event_properties: properties,
          time: Date.now()
        }]
      };

      const response = await axios.post('https://api.amplitude.com/2/httpapi', data, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      logger.error('Amplitude tracking error:', error);
      throw new Error(`Amplitude tracking failed: ${error.message}`);
    }
  }

  // Track page view
  async trackPageView(page, userId, metadata = {}) {
    try {
      logger.info(`Tracking page view: ${page}`);

      // Track with multiple services
      const gaPromise = this.trackGoogleAnalyticsEvent('page_view', page, 'page_view', 1);
      const mixpanelPromise = this.trackMixpanelEvent('page_view', { page, ...metadata }, userId);
      const segmentPromise = this.trackSegmentEvent('page_view', { page, ...metadata }, userId);
      const amplitudePromise = this.trackAmplitudeEvent('page_view', { page, ...metadata }, userId);

      return Promise.all([gaPromise, mixpanelPromise, segmentPromise, amplitudePromise]);
    } catch (error) {
      logger.error('Page view tracking error:', error);
      throw new Error(`Page view tracking failed: ${error.message}`);
    }
  }

  // Track user sign up
  async trackSignUp(userId, userProperties) {
    try {
      logger.info(`Tracking user sign up: ${userId}`);

      // Track with multiple services
      const gaPromise = this.trackGoogleAnalyticsEvent('user', 'sign_up', userId, 1);
      const mixpanelPromise = this.trackMixpanelEvent('sign_up', userProperties, userId);
      const segmentPromise = this.trackSegmentEvent('sign_up', userProperties, userId);
      const amplitudePromise = this.trackAmplitudeEvent('sign_up', userProperties, userId);

      return Promise.all([gaPromise, mixpanelPromise, segmentPromise, amplitudePromise]);
    } catch (error) {
      logger.error('Sign up tracking error:', error);
      throw new Error(`Sign up tracking failed: ${error.message}`);
    }
  }

  // Track purchase
  async trackPurchase(userId, purchaseData) {
    try {
      logger.info(`Tracking purchase: ${userId}, amount: ${purchaseData.amount}`);

      // Track with multiple services
      const gaPromise = this.trackGoogleAnalyticsEvent('ecommerce', 'purchase', userId, purchaseData.amount);
      const mixpanelPromise = this.trackMixpanelEvent('purchase', purchaseData, userId);
      const segmentPromise = this.trackSegmentEvent('purchase', purchaseData, userId);
      const amplitudePromise = this.trackAmplitudeEvent('purchase', purchaseData, userId);

      return Promise.all([gaPromise, mixpanelPromise, segmentPromise, amplitudePromise]);
    } catch (error) {
      logger.error('Purchase tracking error:', error);
      throw new Error(`Purchase tracking failed: ${error.message}`);
    }
  }

  // For testing purposes - simulate tracking
  async simulateTracking(eventType, data) {
    logger.info(`SIMULATED TRACKING - Type: ${eventType}, Data:`, data);

    return {
      status: 'success',
      eventType,
      data
    };
  }
}

module.exports = new AnalyticsService();