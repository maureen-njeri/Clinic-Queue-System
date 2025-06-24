import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    await User.findByIdAndDelete(params.id)
    return NextResponse.json({ message: 'User deleted' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ message: 'Delete failed' }, { status: 500 })
  }
}
