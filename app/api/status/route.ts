// File: app/api/status/route.ts
export const dynamic = 'force-dynamic'

import { NextResponse, NextRequest } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Patient from '@/models/Patient'
import Appointment from '@/models/Appointment'

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams
    const name = searchParams.get('name')
    const phone = searchParams.get('phone')

    if (!name || !phone) {
      return NextResponse.json(
        { error: 'Full name and phone number are required.' },
        { status: 400 }
      )
    }

    await dbConnect()

    // 🔹 Find the patient
    const patient = await Patient.findOne({
      fullName: name.trim(),
      phone: phone.trim(),
    })
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found.' }, { status: 404 })
    }

    // 🔹 Get their appointment
    const appointment = await Appointment.findOne({ patient: patient._id })
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found.' },
        { status: 404 }
      )
    }

    // 🔹 Recalculate queue dynamically for the same doctor type
    const allAppointments = await Appointment.find({
      doctorType: appointment.doctorType,
      status: { $in: ['waiting', 'in-progress'] },
    }).sort({ createdAt: 1 })

    // 🔹 Find the patient’s live queue position
    const queueIndex = allAppointments.findIndex((a) =>
      a._id.equals(appointment._id)
    )
    const queuePosition = queueIndex >= 0 ? queueIndex + 1 : 1

    return NextResponse.json({
      data: {
        queueNumber: queuePosition,
        status: appointment.status,
      },
    })
  } catch (error) {
    console.error('GET /api/status error:', error)
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500 }
    )
  }
}
