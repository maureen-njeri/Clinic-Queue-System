export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Appointment from '@/models/Appointment'
import Pusher from 'pusher'

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
})

// PATCH = STATUS / MEDICAL UPDATES ONLY
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const data = await req.json()

    const allowedStatus = ['waiting', 'in-progress', 'done']
    const updateFields: any = {}

    if (data.status && allowedStatus.includes(data.status)) {
      updateFields.status = data.status
    }

    if ('labTest' in data) updateFields.labTest = data.labTest
    if ('prescription' in data) updateFields.prescription = data.prescription
    if ('diagnosis' in data) updateFields.diagnosis = data.diagnosis
    if ('doctorNote' in data) updateFields.doctorNote = data.doctorNote

    const current = await Appointment.findById(params.id)
    if (!current) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Queue handling
    if (updateFields.status && updateFields.status !== 'waiting') {
      updateFields.queueNumber = null
    }

    const updated = await Appointment.findByIdAndUpdate(
      params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('patient')

    if (updateFields.status && updateFields.status !== 'waiting') {
      const waiting = await Appointment.find({ status: 'waiting' }).sort({
        createdAt: 1,
      })

      for (let i = 0; i < waiting.length; i++) {
        waiting[i].queueNumber = i + 1
        await waiting[i].save()
      }
    }

    await pusher.trigger('appointments', 'status-updated', {
      _id: updated._id,
      status: updated.status,
    })

    return NextResponse.json({
      message: 'Status updated successfully',
      appointment: updated,
    })
  } catch (error) {
    console.error('PATCH error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
