import { NextResponse } from 'next/server'

export async function GET() {
  // Example admin check logic - you can replace with real logic
  const isAdmin = true // or fetch from database/auth system

  return NextResponse.json({ isAdmin })
}
