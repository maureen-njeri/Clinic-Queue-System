import mongoose, { Mongoose } from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

// 👇 Extend NodeJS Global type to include our custom mongoose cache
declare global {
  // allow global `mongoose` to be reused in dev
  var mongoose: {
    conn: Mongoose | null
    promise: Promise<Mongoose> | null
  }
}

// 👇 Initialize global.mongoose if it doesn't exist
global.mongoose = global.mongoose || { conn: null, promise: null }

const cached = global.mongoose

async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log('✅ MongoDB connected')
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect
export {}
