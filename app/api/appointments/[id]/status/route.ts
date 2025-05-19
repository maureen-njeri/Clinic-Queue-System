import { NextRequest, NextResponse } from 'next/server'
import type { RequestEvent } from 'next/server'  // import the correct type here
import dbConnect from '@/lib/mongodb'
import Appointment from '@/models/Appointment'

export async function PUT(
  req: NextRequest,
  event: RequestEvent  // use the official type here for the second argument
) {
  await dbConnect()
  
  const { status } = await req.json()
  const { id } = event.params

  const appointment = await Appointment.findByIdAndUpdate(
    id,
    { status },
    { new: true }
  ).populate('patient')

  if (!appointment) {
    return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
  }

  return NextResponse.json({ success: true, appointment })
}
