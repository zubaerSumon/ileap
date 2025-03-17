import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ileap';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env');
}

let cached: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } = ((global as unknown) as { mongoose: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } }).mongoose || { conn: null, promise: null };

if (!cached) {
  cached = { conn: null, promise: null };
(global as unknown as { mongoose: typeof cached }).mongoose = cached;
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;