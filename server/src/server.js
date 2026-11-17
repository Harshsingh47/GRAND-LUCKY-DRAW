const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
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
  crossOriginResourcePolicy: false, // allow loading local uploaded images in browser
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
app.get('/api/health', (req, res) => {
  const stateMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };
  const isConnected = mongoose.connection.readyState === 1;

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

// Serve frontend client in production
const clientDist = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDist));
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
    return next();
  }
  const indexHtml = path.join(clientDist, 'index.html');
  res.sendFile(indexHtml, (err) => {
    if (err) {
      res.status(200).send(`
        <!DOCTYPE html>
        <html>
          <head><title>Grand Lucky Draw API Server</title></head>
          <body style="background:#070709; color:#D4AF37; font-family:sans-serif; text-align:center; padding:50px;">
            <h1>Grand Lucky Draw — Independent Medias</h1>
            <p>API Server is running on port ${process.env.PORT || 5001}.</p>
            <p>Start the Vite frontend on port 3000 by running <code>npm run client</code> or <code>npm run dev</code>.</p>
          </body>
        </html>
      `);
    }
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack })
  });
});

// Middleware to ensure DB connection is ready for serverless invocations
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
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

startServer();

module.exports = app;
