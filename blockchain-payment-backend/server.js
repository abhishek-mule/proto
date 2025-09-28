require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const winston = require('winston');
const mongoSanitize = require('express-mongo-sanitize');
const hpp = require('hpp');

const app = express();

// Minimal health check registered early to satisfy platform probes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Serve static files from the public directory
app.use(express.static('public'));

// Security Logger
const securityLogger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'security.log', level: 'info' }),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Enhanced Helmet Configuration
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// Enhanced CORS Configuration (allow env origins and *.vercel.app)
const staticAllowed = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean);
const vercelDomainRegex = /\.vercel\.app$/;

const corsOptions = {
  origin: (origin, cb) => {
    // Allow same-origin or non-browser requests
    if (!origin) return cb(null, true);
    try {
      const { hostname } = new URL(origin);
      const allowed =
        staticAllowed.includes(origin) ||
        vercelDomainRegex.test(hostname) ||
        staticAllowed.includes('*');
      if (allowed) return cb(null, true);
      securityLogger.warn('CORS blocked request from origin', { origin });
      return cb(new Error('Not allowed by CORS'));
    } catch {
      return cb(new Error('Invalid Origin'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Body parsing with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Skip mongo-sanitize for health check endpoint
app.use((req, res, next) => {
  if (req.path === '/health') {
    return next();
  }
  return mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
      console.warn(`This request[${key}] was sanitized`, req[key]);
    }
  })(req, res, next);
});

// Data sanitization against XSS
// NOTE: xss-clean is incompatible with Express 5 (req.query is a getter).
// It was causing health check failures on Render. Disable for now.

// Prevent parameter pollution
app.use(hpp({
  whitelist: ['price', 'rating', 'duration'] // Allow certain parameters to be duplicated
}));

// Rate limiting with different limits for different routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: 15 * 60 // seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    securityLogger.warn('Rate limit exceeded', {
      ip: req.ip,
      url: req.url,
      userAgent: req.get('User-Agent')
    });
    res.status(429).json({
      error: 'Too many requests from this IP, please try again later.',
      retryAfter: 15 * 60
    });
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth attempts per windowMs
  message: {
    error: 'Too many authentication attempts, please try again later.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    securityLogger.warn('Auth rate limit exceeded', {
      ip: req.ip,
      url: req.url,
      userAgent: req.get('User-Agent')
    });
    res.status(429).json({
      error: 'Too many authentication attempts, please try again later.',
      retryAfter: 15 * 60
    });
  }
});

const blockchainLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 blockchain operations per windowMs
  message: {
    error: 'Too many blockchain operations, please try again later.',
    retryAfter: 15 * 60
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply general rate limiting
app.use('/api/', generalLimiter);

// Apply specific rate limiting to auth routes
app.use('/api/auth/', authLimiter);

// Apply specific rate limiting to blockchain routes
app.use('/api/blockchain/', blockchainLimiter);

// Security middleware: Request logging
app.use((req, res, next) => {
  const start = Date.now();

  // Log security-relevant requests
  if (req.path.includes('/auth') || req.path.includes('/payment') || req.path.includes('/blockchain')) {
    securityLogger.info('Security request', {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      timestamp: new Date().toISOString()
    });
  }

  // Log response
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };

    if (res.statusCode >= 400) {
      securityLogger.warn('Request error', logData);
    } else if (req.path.includes('/auth') || req.path.includes('/payment')) {
      securityLogger.info('Request completed', logData);
    }
  });

  next();
});

// Connect to MongoDB first
const connectDB = async () => {
  try {
    // Validate required env before attempting to connect
    if (!process.env.MONGODB_URI || !String(process.env.MONGODB_URI).trim()) {
      console.error('Missing required env var MONGODB_URI. Set it in Render (Environment tab) or your .env file.');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
      retryWrites: true,
      w: 'majority'
    });
    console.log('MongoDB connected successfully');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    // Retry the connection after 5 seconds
    console.log('Retrying connection in 5 seconds...');
    await new Promise(resolve => setTimeout(resolve, 5000));
    return connectDB();
  }
};

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Blockchain Payment Backend API' });
});

// Public endpoint to expose deployed contract addresses for the frontend
app.get('/contracts', (req, res) => {
  try {
    const network = process.env.BLOCKCHAIN_NETWORK || 'polygon-amoy';

    // Prefer env vars
    let cropNft = process.env.CROP_NFT_CONTRACT_ADDRESS || process.env.CROP_NFT_CONTRACT || null;
    let payment = process.env.CONTRACT_ADDRESS || process.env.PAYMENT_CONTRACT || null;
    let source = 'env';

    // Fallback to deployments file if missing
    if (!cropNft || !payment) {
      const file = path.join(__dirname, 'deployments', `deployments-${network}.json`);
      if (fs.existsSync(file)) {
        try {
          const data = JSON.parse(fs.readFileSync(file, 'utf8'));
          cropNft = cropNft || data.cropNFT;
          payment = payment || data.paymentContract;
          source = cropNft && payment ? 'deployments-file' : source;
        } catch (_) {
          // ignore parse errors, keep env values
        }
      }
    }

    res.json({
      network,
      addresses: {
        cropNft,
        payment
      },
      source,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read contract addresses' });
  }
});

// Health check endpoint - no middleware applied before this
app.get('/health', async (req, res) => {
  const startTime = process.hrtime();
  const healthcheck = {
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks: {
      memoryUsage: process.memoryUsage(),
      database: {
        status: 'unknown',
        message: 'Checking...'
      },
      system: {
        cpu: process.cpuUsage(),
        platform: process.platform,
        nodeVersion: process.version,
        pid: process.pid,
        cwd: process.cwd()
      }
    }
  };

  try {
    // Check MongoDB connection
    if (mongoose.connection.readyState === 1) {
      try {
        await mongoose.connection.db.admin().ping();
        healthcheck.checks.database = {
          status: 'connected',
          message: 'MongoDB connection is healthy',
          dbName: mongoose.connection.name,
          dbHost: mongoose.connection.host,
          dbPort: mongoose.connection.port
        };
      } catch (dbError) {
        healthcheck.status = 'PARTIAL';
        healthcheck.checks.database = {
          status: 'error',
          message: `MongoDB ping failed: ${dbError.message}`
        };
      }
    } else {
      healthcheck.status = 'PARTIAL';
      healthcheck.checks.database = {
        status: 'disconnected',
        message: 'MongoDB is not connected',
        readyState: mongoose.connection.readyState
      };
    }
  } catch (error) {
    healthcheck.status = 'DOWN';
    healthcheck.checks.database = {
      status: 'error',
      message: `Health check failed: ${error.message}`
    };
  }

  // Calculate response time
  const diff = process.hrtime(startTime);
  const responseTime = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(3);
  
  // Add response time to health check
  healthcheck.checks.responseTime = `${responseTime}ms`;
  
  // Set appropriate status code
  const statusCode = healthcheck.status === 'UP' ? 200 : 503;
  
  // Add response time header
  res.set('X-Response-Time', `${responseTime}ms`);
  
  // Return the health check response
  res.status(statusCode).json(healthcheck);
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/blockchain', require('./routes/blockchain'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/ipfs', require('./routes/ipfs'));
app.use('/api/fiat-crypto', require('./routes/fiatCrypto'));
app.use('/api/price-oracle', require('./routes/priceOracle'));
app.use('/api/narrative', require('./routes/narrative'));
app.use('/api/geo-location', require('./routes/geoLocation'));

// 404 handler - must be after all other routes
app.use((req, res) => {
  securityLogger.warn('404 Not Found', {
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Global error handler - must be after all other middleware
app.use((err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log security errors
  securityLogger.error('Application error', {
    error: error.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString()
  });

  // Handle specific error types
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  } else if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  } else if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = { message, statusCode: 400 };
  } else if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token';
    error = { message, statusCode: 401 };
  } else if (err.name === 'TokenExpiredError') {
    const message = 'Token expired';
    error = { message, statusCode: 401 };
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Serve static files from public directory (must be after API routes)
app.use(express.static(path.join(__dirname, 'public')));

// Handle client-side routing - must be the last route
app.get(/^(?!\/api\/).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const startServer = async () => {
  try {
    await connectDB();
    
    const PORT = process.env.PORT || 5000;
    const HOST = process.env.HOST || '0.0.0.0';
const server = app.listen(PORT, HOST, () => {
      console.log(`Server running on port ${PORT}`);
    });
    // Increase timeouts to reduce gateway timeout issues on cold starts
    server.keepAliveTimeout = 120000; // 120s
    server.headersTimeout = 120000; // 120s

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error(`Unhandled Rejection: ${err.message}`);
      server.close(() => process.exit(1));
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

module.exports = app;