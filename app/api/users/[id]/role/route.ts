import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import User from '@/models/User'
import AuditLog from '@/models/AuditLog'
import { getToken } from 'next-auth/jwt'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const token = await getToken({ req })

  // 1. Authorization check
  if (!token || token.role !== 'Admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { role } = await req.json()

  try {
    await dbConnect()

    const user = await User.findByIdAndUpdate(
      params.id,
      { role },
      { new: true }
    )

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // 2. Log the action
    await AuditLog.create({
      action: `Updated role to ${role}`,
      actorEmail: token.email,
      targetUserId: params.id,
      timestamp: new Date(),
    })

    return NextResponse.json(user)
  } catch (error) {
    console.error('Failed to update role:', error)
    return NextResponse.json(
      { message: 'Error updating role' },
      { status: 500 }
    )
  }
}
