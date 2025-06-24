import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

// GET /api/users
export async function GET() {
  try {
    await dbConnect()
    const users = await User.find().select('-password') // exclude hashed password
    return NextResponse.json(users)
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
