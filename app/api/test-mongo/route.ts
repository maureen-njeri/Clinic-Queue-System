// app/api/test-mongo/route.ts
import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import mongoose from 'mongoose'

export async function GET() {
  try {
    await dbConnect()

    if (!mongoose.connection.db) {
      throw new Error('Database connection not established.')
    }

    const collections = await mongoose.connection.db.listCollections().toArray()

    return NextResponse.json({ collections })
  } catch (error: any) {
    console.error('[MongoDB Error]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
