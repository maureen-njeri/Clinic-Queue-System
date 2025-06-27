import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Appointment from '@/models/Appointment'
import Pusher from 'pusher'
import type { RouteContext } from 'next' // ✅ Import RouteContext

// Pusher Setup
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
})

// PATCH = Update appointment (status, diagnosis, doctorNote, etc.)
export async function PATCH(
  req: NextRequest,
  context: RouteContext // ✅ Correct typing
) {
  const { id } = context.params as { id: string }

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
    if ('reason' in data) updateFields['patient.reason'] = data.reason
    if ('doctorType' in data) updateFields['patient.doctorType'] = data.doctorType

    const current = await Appointment.findById(id).populate('patient')
    if (!current) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    updateFields.queueNumber =
      updateFields.status !== 'waiting' ? null : current.queueNumber

    const updated = await Appointment.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    }).populate('patient')

    if (updateFields.status && updateFields.status !== 'waiting') {
      const waiting = await Appointment.find({ status: 'waiting' }).sort({ createdAt: 1 })
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
      message: 'Updated and queue reordered',
      appointment: updated,
    })
  } catch (error) {
    console.error('PATCH error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

// DELETE = Cancel Appointment
export async function DELETE(
  req: NextRequest,
  context: RouteContext // ✅ Correct typing
) {
  const { id } = context.params as { id: string }

  try {
    await dbConnect()

    const appointment = await Appointment.findById(id)
    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
    }

    await appointment.deleteOne()

    const waiting = await Appointment.find({ status: 'waiting' }).sort({ createdAt: 1 })
    for (let i = 0; i < waiting.length; i++) {
      waiting[i].queueNumber = i + 1
      await waiting[i].save()
    }

    await pusher.trigger('appointments', 'deleted', { _id: id })

    return NextResponse.json({
      message: 'Appointment deleted and queue updated',
    })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
