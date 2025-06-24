import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { role } = await req.json()
  try {
    await dbConnect()
    const user = await User.findByIdAndUpdate(
      params.id,
      { role },
      { new: true }
    )
    return NextResponse.json(user)
  } catch (error) {
    console.error('Failed to update role:', error)
    return NextResponse.json(
      { message: 'Error updating role' },
      { status: 500 }
    )
  }
}
