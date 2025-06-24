// File: app/api/status/route.ts

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

    const patient = await Patient.findOne({ fullName: name, phone })
    if (!patient) {
      return NextResponse.json({ error: 'Patient not found.' }, { status: 404 })
    }

    const appointment = await Appointment.findOne({ patient: patient._id })
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found.' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      data: {
        queueNumber: appointment.queueNumber,
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
