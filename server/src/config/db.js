const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');
dotenv.config();

// Ensure reliable SRV DNS resolution for MongoDB Atlas on Windows environments
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (dnsErr) {
  // Ignore if custom dns servers cannot be set
}

let mongodInstance = null;

const connectDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return mongoose.connection;
    }

    const uri = process.env.MONGODB_URI;

    if (uri && uri.trim() !== '') {
      console.log(`[Database] Connecting to MongoDB via URI: ${uri.replace(/:([^:@]{3})[^:@]*@/, ':***@')}`);
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 8000,
      });
      console.log(`[Database] MongoDB Connected to host: ${conn.connection.host}`);
      return conn;
    }

    console.log('[Database] No MONGODB_URI provided in .env. Initializing in-memory MongoDB replica set / instance...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongodInstance = await MongoMemoryServer.create();
    const memoryUri = mongodInstance.getUri();
    
    console.log(`[Database] In-memory MongoDB initialized at: ${memoryUri}`);
    const conn = await mongoose.connect(memoryUri);
    console.log(`[Database] In-memory MongoDB Connected successfully.`);
    return conn;
  } catch (error) {
    console.error(`[Database Error] Connection failed: ${error.message}`);
    
    // Fallback to in-memory if remote failed
    if (!mongodInstance) {
      try {
        console.log('[Database] Attempting fallback to in-memory MongoMemoryServer...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongodInstance = await MongoMemoryServer.create();
        const fallbackUri = mongodInstance.getUri();
        const conn = await mongoose.connect(fallbackUri);
        console.log(`[Database] Fallback In-memory MongoDB Connected at: ${fallbackUri}`);
        return conn;
      } catch (innerErr) {
        console.error(`[Database Error] Fallback also failed: ${innerErr.message}`);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, disconnectDB };
