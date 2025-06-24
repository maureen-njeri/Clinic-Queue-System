import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/pages/api/auth/route'

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Authorized admin logic here
  return NextResponse.json({ message: 'Welcome admin!' })
}
