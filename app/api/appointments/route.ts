import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Appointment from '@/models/Appointment'
import Patient from '@/models/Patient'

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const { name, phone } = await req.json()

    const patient = await Patient.create({ name, phone })

    const lastAppointment = await Appointment.findOne().sort({
      queueNumber: -1,
    })
    const nextQueue = lastAppointment ? lastAppointment.queueNumber + 1 : 1

    const appointment = await Appointment.create({
      patient: patient._id,
      queueNumber: nextQueue,
    })

    return NextResponse.json({ queueNumber: nextQueue }, { status: 201 })
  } catch (error) {
    console.error('POST /api/appointments error:', error)
    return NextResponse.json(
      { error: 'Failed to create appointment' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    await dbConnect()
    const appointments = await Appointment.find()
      .populate('patient')
      .sort({ queueNumber: 1 })

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('GET /api/appointments error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch appointments' },
      { status: 500 }
    )
  }
}
