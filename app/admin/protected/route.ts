// app/admin/protected/route.ts
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/authOptions'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json({ message: 'Welcome admin!' })
}
