import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import AuditLog from '@/models/AuditLog'
import { getToken } from 'next-auth/jwt'

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = await getToken({ req })

  // 1. Only Admins can delete
  if (!token || token.role !== 'Admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await dbConnect()

    const user = await User.findByIdAndDelete(params.id)

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    // 2. Log deletion action
    await AuditLog.create({
      action: 'Deleted user',
      actorEmail: token.email,
      targetUserId: params.id,
      timestamp: new Date(),
    })

    return NextResponse.json({ message: 'User deleted successfully' })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ message: 'Delete failed' }, { status: 500 })
  }
}
