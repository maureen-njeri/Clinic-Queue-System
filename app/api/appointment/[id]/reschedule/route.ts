export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Appointment from '@/models/Appointment'
import Patient from '@/models/Patient'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()

    const { reason, doctorType, appointmentDate } = await req.json()

    if (!reason || !doctorType) {
      return NextResponse.json(
        { error: 'Reason and doctorType are required' },
        { status: 400 }
      )
    }

    const appointment = await Appointment.findById(params.id)
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // ✅ Update PATIENT document
    await Patient.findByIdAndUpdate(appointment.patient, {
      reason,
      doctorType,
    })

    // ✅ Reset appointment back to waiting
    appointment.status = 'waiting'

    // ✅ Update appointment date/time (optional)
    if (appointmentDate) {
      appointment.appointmentDate = appointmentDate
    }

    // ✅ Assign new queue number (append)
    const lastWaiting = await Appointment.findOne({ status: 'waiting' }).sort({
      queueNumber: -1,
    })

    appointment.queueNumber = lastWaiting?.queueNumber
      ? lastWaiting.queueNumber + 1
      : 1

    await appointment.save()

    // ✅ Recalculate queue numbers safely
    const waiting = await Appointment.find({ status: 'waiting' }).sort({
      createdAt: 1,
    })

    for (let i = 0; i < waiting.length; i++) {
      waiting[i].queueNumber = i + 1
      await waiting[i].save()
    }

    return NextResponse.json({
      message: 'Appointment rescheduled successfully',
    })
  } catch (error) {
    console.error('RESCHEDULE error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
