import mongoose from 'mongoose';

const connectToDatabase = async () => {
  // Check if already connected or connecting
  if (mongoose.connection.readyState >= 1) {
    console.log('MongoDB already connected, readyState:', mongoose.connection.readyState);
    return;
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not set');
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      maxPoolSize: 10,
      minPoolSize: 5,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      serverSelectionTimeoutMS: 30000,
      heartbeatFrequencyMS: 10000,
      retryWrites: true,
      retryReads: true,
      bufferCommands: false, // Disable mongoose buffering
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      setTimeout(() => {
        console.log('Attempting to reconnect to MongoDB...');
        connectToDatabase();
      }, 5000);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Retrying connection...');
      setTimeout(() => {
        console.log('Attempting to reconnect to MongoDB...');
        connectToDatabase();
      }, 5000);
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
};

 let dbPromise: Promise<void> | null = null;

export default async function connectDB() {
  if (!dbPromise) {
    dbPromise = connectToDatabase();
  }
  return dbPromise;
}
