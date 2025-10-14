import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import AuditLog from '@/models/AuditLog'

export async function GET() {
  await connectDB()
  const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(20)
  return NextResponse.json(logs)
}
