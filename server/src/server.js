const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const seedData = require('./seeds/seedData');
const User = require('./models/User');

// Routes
const authRoutes = require('./routes/authRoutes');
const participantRoutes = require('./routes/participantRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const prizeRoutes = require('./routes/prizeRoutes');
const drawRoutes = require('./routes/drawRoutes');
const winnerRoutes = require('./routes/winnerRoutes');
const claimRoutes = require('./routes/claimRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const auditRoutes = require('./routes/auditRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// Security and utility middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Middleware to ensure DB connection is active before processing requests
app.use(async (req, res, next) => {
  if (req.path === '/api/health' || req.path === '/') return next();
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('[DB Middleware Error]', err.message);
    res.status(503).json({
      success: false,
      message: 'Database connection failed. Please verify MONGODB_URI credentials.',
      error: err.message
    });
  }
});

// API Routes Mounting
app.use('/api/auth', authRoutes);
app.use('/api/participants', participantRoutes);
app.use('/api/campaigns', campaignRoutes);
app.use('/api/prizes', prizeRoutes);
app.use('/api/draw', drawRoutes);
app.use('/api/winners', winnerRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/audit-logs', auditRoutes);
app.use('/api/reports', reportRoutes);

// Health check endpoint
app.get('/api/health', async (req, res) => {
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  let isConnected = mongoose.connection.readyState === 1;
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = mongoose.connection.readyState === 1;
    } catch (e) {
      // ignore in health check
    }
  }

  res.json({
    status: 'online',
    appName: 'Grand Lucky Draw Platform',
    developer: 'Independent Medias',
    database: {
      connected: isConnected,
      readyState: mongoose.connection.readyState,
      state: stateMap[mongoose.connection.readyState] || 'unknown',
      host: mongoose.connection.host || null,
      name: mongoose.connection.name || null,
      type: process.env.MONGODB_URI ? 'MongoDB Atlas / External' : 'In-Memory MongoDB Instance'
    },
    timestamp: new Date()
  });
});

// Serve frontend client if built dist exists, or fallback to API welcome page
const clientDist = path.join(__dirname, '../../client/dist');
const indexHtml = path.join(clientDist, 'index.html');
const hasClientDist = fs.existsSync(indexHtml);

if (hasClientDist) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    res.sendFile(indexHtml);
  });
} else {
  app.get('/', (req, res) => {
    res.status(200).send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Grand Lucky Draw — API Server</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body { margin:0; background:#070709; color:#D4AF37; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; display:flex; align-items:center; justify-content:center; min-height:100vh; padding:20px; box-sizing:border-box; }
            .card { max-width:480px; width:100%; background:#12131A; border:1px solid rgba(212,175,55,0.3); border-radius:24px; padding:36px 28px; text-align:center; box-shadow:0 20px 50px rgba(0,0,0,0.8); }
            .badge { display:inline-block; padding:6px 14px; border-radius:999px; background:rgba(16,185,129,0.15); border:1px solid rgba(16,185,129,0.4); color:#34D399; font-weight:bold; font-size:12px; letter-spacing:1px; text-transform:uppercase; margin-bottom:16px; }
            h1 { margin:0 0 8px; color:#FFF; font-size:24px; font-weight:800; }
            p { color:#9CA3AF; font-size:14px; line-height:1.6; margin:0 0 24px; }
            .btn { display:inline-block; padding:12px 24px; border-radius:12px; background:linear-gradient(135deg, #D4AF37, #AA7C11); color:#070709; font-weight:bold; font-size:14px; text-decoration:none; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="badge">&#9679; API System Online</div>
            <h1>Grand Lucky Draw Platform</h1>
            <p>Independent Medias backend API services and MongoDB Atlas database are connected and operational.</p>
            <a class="btn" href="/api/health">Check API Health Status</a>
          </div>
        </body>
      </html>
    `);
  });
}

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database has no users
    const usersCount = await User.countDocuments();
    if (usersCount === 0) {
      console.log('[Startup] Empty database detected. Running automatic initial seed...');
      await seedData();
    }

    if (!process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`\n======================================================`);
        console.log(`  GRAND LUCKY DRAW — INDEPENDENT MEDIAS PLATFORM`);
        console.log(`  Server running on http://localhost:${PORT}`);
        console.log(`  Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log(`======================================================\n`);
      });
    }
  } catch (error) {
    console.error('Failed to start server:', error);
    if (!process.env.VERCEL) process.exit(1);
  }
};

if (!process.env.VERCEL) {
  startServer();
}

module.exports = app;
