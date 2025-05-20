import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Appointment from '@/models/Appointment'

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect()
  const { status } = await req.json()

  await Appointment.findByIdAndUpdate(params.id, { status })
  return NextResponse.json({ message: 'Status updated' })
}
