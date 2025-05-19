import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable");
}

let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    console.log("🔁 Using cached MongoDB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then(m => {
      console.log("✅ MongoDB connected successfully");
      return m.connection;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;
