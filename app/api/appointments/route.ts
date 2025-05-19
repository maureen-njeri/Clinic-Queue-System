import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Appointment from '@/models/Appointment'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect()
  const { id } = params
  const body = await request.json()

  // Example: update appointment status using id and body info
  const updatedAppointment = await Appointment.findByIdAndUpdate(
    id,
    { status: body.status },
    { new: true }
  )

  if (!updatedAppointment) {
    return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
  }

  return NextResponse.json(updatedAppointment)
}
