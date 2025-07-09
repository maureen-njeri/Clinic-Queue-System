export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Appointment from '@/models/Appointment'
import Patient from '@/models/Patient'

// ✅ Optional: Define a lean interface for queueNumber
interface AppointmentLean {
  queueNumber?: number
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect()
    const { fullName, phone, email, reason, doctorType } = await req.json()

    if (!fullName || !phone || !reason || !doctorType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // ✅ Save patient
    const patient = await Patient.create({
      fullName,
      phone,
      email,
      reason,
      doctorType,
    })

    // ✅ Fix TypeScript error with typed lean()
    const last = await Appointment.findOne()
      .sort({ queueNumber: -1 })
      .lean<AppointmentLean>()
    const nextQueue = last?.queueNumber ? last.queueNumber + 1 : 1

    // ✅ Create appointment
    await Appointment.create({
      patient: patient._id,
      queueNumber: nextQueue,
    })

    // ✅ Optional email notification
    if (email) {
      try {
        await fetch(`${process.env.NEXTAUTH_URL}/api/appointment/notifyEmail`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: email,
            subject: 'Appointment Confirmation',
            text: `Hello ${fullName}, your appointment is confirmed.\nQueue No: ${nextQueue}\nDoctor: ${doctorType}\nReason: ${reason}`,
          }),
        })
      } catch (emailErr) {
        console.error('❌ Email send error:', emailErr)
      }
    }

    // ✅ Optional SMS notification
    if (phone) {
      try {
        await fetch(`${process.env.NEXTAUTH_URL}/api/appointment/notifySms`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: phone,
            body: `Hi ${fullName}, your clinic appointment is confirmed.\nQueue No: ${nextQueue}.`,
          }),
        })
      } catch (smsErr) {
        console.error('❌ SMS send error:', smsErr)
      }
    }

    return NextResponse.json({ queueNumber: nextQueue }, { status: 201 })
  } catch (error) {
    console.error('POST /api/appointment error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
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
    console.error('GET /api/appointment error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
