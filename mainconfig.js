// Configuration file with hardcoded secrets and API keys
const config = {
    app: {
      name: 'Secret Test App',
      env: process.env.NODE_ENV || 'development',
      port: process.env.PORT || 3000,
      jwtSecret: 'j8Nd7F2sA5qP3tR1xV6yZ9wB4mC2kE7i',
      jwtExpiresIn: '24h'
    },
    
    database: {
      mongodb: {
        uri: process.env.MONGO_URI || 'mongodb+srv://admin:M0ng0DB@dm1n2023!@cluster0.mongodb.net/production?retryWrites=true&w=majority',
        options: {
          useNewUrlParser: true,
          useUnifiedTopology: true
        }
      },
      postgres: {
        host: 'postgres.example.com',
        port: 5432,
        database: 'secretsdb',
        username: 'postgres_admin',
        password: 'P0stgr3sAdm!n2023#',
        ssl: true
      },
      redis: {
        host: 'redis.example.com',
        port: 6379,
        password: 'R3d!s@Cl0udPr0d123!'
      }
    },
    
    aws: {
      accessKey: 'AKIATUVWFODNN7EXAMPLE',
      secretKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
      region: 'us-west-2',
      s3: {
        bucket: 'security-test-app-data'
      }
    },
    
    azure: {
      storageAccount: 'securitytestappstorage',
      storageKey: 'bG95eCt6wNDR3ZGJlM2RkOGE0MzI4MTIzNDU2Nzg5MGFiY2RlZg==',
      containerName: 'uploads'
    },
    
    stripe: {
      publishableKey: 'pk_test_51AbcdEFGhIjklMNop1234567890qrstuvwxyzABCDEFGH',
      secretKey: 'sk_test_51AbcdEFGhIjklMNop1234567890qrstuvwxyzABCDEFGH',
      webhookSecret: 'whsec_1234567890abcdefghijklmnopqrstuvwxyz1234567890abcdef'
    },
    
    paypal: {
      clientId: 'AYnRE0_2D-CcHgT-tAaYHDkH0GWefGhIJk',
      clientSecret: 'EBVCdeF123GhIJklMnOpQrStUvWXYz12345678901234',
      environment: 'sandbox'
    },
    
    sendgrid: {
      apiKey: 'SG.1a2b3c4d5e6f7g8h9i0j.klmnopqrstuvwxyz1234567890abcdef',
      fromEmail: 'notifications@example.com',
      templateIds: {
        welcome: 'd-1234abcd5678efgh9012ijkl',
        passwordReset: 'd-abcd1234efgh5678ijkl9012'
      }
    },
    
    twilio: {
      accountSid: 'AC1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p',
      authToken: '1a2b3c4d5e6f7g8h9i0jklmnopqrstu',
      phoneNumber: '+15551234567'
    },
    
    github: {
      clientId: '1a2b3c4d5e6f7g8h9i0j',
      clientSecret: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7r8s9t0u',
      personalAccessToken: 'github_pat_11ABCDEFG0hijklMNOPQ_1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    },
    
    google: {
      clientId: '123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com',
      clientSecret: 'GOCSPX-abcdefghijklmnopqrstuvwxyz1234',
      apiKey: 'AIzaSyCabc123DEF456ghiJKLmno789PQRstuvWXYZ'
    },
    
    firebase: {
      apiKey: 'AIzaSyCabc123DEF456ghiJKLmno789PQRstuvWXYZ',
      authDomain: 'test-app.firebaseapp.com',
      projectId: 'test-app',
      storageBucket: 'test-app.appspot.com',
      messagingSenderId: '123456789012',
      appId: '1:123456789012:web:1a2b3c4d5e6f7g8h9i0j',
      measurementId: 'G-ABCDEF1234'
    },
    
    slack: {
      webhookUrl: 'https://hooks.slack.com/services/T01234567/B89012345/aBcDeFgHiJkLmNoPqRsTuVwX',
      botToken: 'xoxb-123456789012-1234567890123-ABCDEFGHIJKLMNOPQRSTUVWx'
    },
    
    algolia: {
      appId: 'ABC123DEF4',
      apiKey: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p',
      searchKey: '7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f'
    },
    
    cloudflare: {
      apiKey: '1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7r8s9t0u',
      email: 'admin@example.com',
      zoneId: '1a2b3c4d5e6f7g8h9i0j'
    },
    
    digitalOcean: {
      token: 'dop_v1_1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7r8s9t0u'
    },
    
    jira: {
      url: 'https://company.atlassian.net',
      username: 'jira_admin@example.com',
      token: 'ATATT3xFfGF0123456789abcdefghijklmnopqrstuvwxyz1234567890AB'
    },
    
    openai: {
      apiKey: 'sk-1234567890abcdefghijklmnopqrstuvwxyzABCDEF'
    }
  };
  
  module.exports = config;