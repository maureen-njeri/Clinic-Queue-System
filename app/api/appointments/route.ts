import { NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Appointment from '@/models/Appointment'
import Patient from '@/models/Patient'

export async function POST(req: Request) {
  await dbConnect()
  const { name, phone } = await req.json()

  const patient = await Patient.create({ name, phone })
  const lastAppointment = await Appointment.findOne().sort({ queueNumber: -1 })
  const nextQueue = lastAppointment ? lastAppointment.queueNumber + 1 : 1

  await Appointment.create({
    patient: patient._id,
    queueNumber: nextQueue,
  })

  return NextResponse.json({ queueNumber: nextQueue }, { status: 201 })
}

export async function GET() {
  await dbConnect()
  const appointments = await Appointment.find()
    .populate('patient')
    .sort({ queueNumber: 1 })

  return NextResponse.json(appointments)
}
