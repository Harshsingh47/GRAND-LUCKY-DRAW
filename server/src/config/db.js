const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');
dotenv.config();

// Only set custom DNS servers on Windows local environment (where ISP DNS blocks SRV)
// NEVER run on Linux / Vercel / AWS Lambda where outbound port 53 is restricted
if (process.platform === 'win32') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (dnsErr) {
    // Ignore if custom dns servers cannot be set
  }
}

let mongodInstance = null;
let cachedPromise = null;

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    if (cachedPromise) {
      return cachedPromise;
    }

    const uri = process.env.MONGODB_URI;

    if (uri && uri.trim() !== '') {
      console.log(`[Database] Connecting to MongoDB Atlas...`);
      cachedPromise = mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
      }).then(conn => {
        console.log(`[Database] MongoDB Connected to host: ${conn.connection.host}`);
        return conn;
      }).catch(err => {
        cachedPromise = null;
        console.error(`[Database Error] Connection failed: ${err.message}`);
        throw err;
      });

      return cachedPromise;
    }

    // Fallback for local development when no MONGODB_URI is provided
    if (!process.env.VERCEL) {
      console.log('[Database] No MONGODB_URI provided in .env. Initializing in-memory MongoDB replica set / instance...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memoryUri = mongodInstance.getUri();
      
      console.log(`[Database] In-memory MongoDB initialized at: ${memoryUri}`);
      const conn = await mongoose.connect(memoryUri);
      console.log(`[Database] In-memory MongoDB Connected successfully.`);
      return conn;
    }

    throw new Error('MONGODB_URI is required in Vercel environment');
  } catch (error) {
    console.error(`[Database Error] ${error.message}`);
    // Never call process.exit(1) on Vercel as it crashes the entire serverless container
    if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
    throw error;
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, disconnectDB };
