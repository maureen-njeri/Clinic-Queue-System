import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Patient from '@/models/Patient'
import Appointment from '@/models/Appointment'

export async function GET(
  req: Request,
  context: { params: { phone: string } }
) {
  try {
    const { phone } = context.params
    await dbConnect()

    const patient = await Patient.findOne({ phone })
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found' }, { status: 404 })
    }

    const appointment = await Appointment.findOne({
      patient: patient._id,
      status: 'waiting',
    })

    if (!appointment) {
      return NextResponse.json(
        { error: 'No waiting appointment found' },
        { status: 404 }
      )
    }

    return NextResponse.json(appointment)
  } catch (error) {
    console.error('Error fetching appointment by phone:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
