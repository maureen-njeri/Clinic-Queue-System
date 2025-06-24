import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Appointment from '@/models/Appointment'
import Pusher from 'pusher'

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
  contextPromise: Promise<{ params: { id: string } }>
) {
  const { params } = await contextPromise
  const { id } = params

  try {
    await dbConnect()
    const data = await req.json()

    const allowedStatus = ['waiting', 'in-progress', 'done']
    const updateFields: any = {}

    // Only allow valid status updates
    if (data.status && allowedStatus.includes(data.status)) {
      updateFields.status = data.status
    }

    // Support optional updates
    if ('labTest' in data) updateFields.labTest = data.labTest
    if ('prescription' in data) updateFields.prescription = data.prescription
    if ('diagnosis' in data) updateFields.diagnosis = data.diagnosis
    if ('doctorNote' in data) updateFields.doctorNote = data.doctorNote
    if ('reason' in data) updateFields['patient.reason'] = data.reason
    if ('doctorType' in data)
      updateFields['patient.doctorType'] = data.doctorType

    // Get current appointment to preserve queueNumber
    const current = await Appointment.findById(id).populate('patient')
    if (!current) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // Handle queueNumber logic
    if (updateFields.status && updateFields.status !== 'waiting') {
      updateFields.queueNumber = null
    } else {
      updateFields.queueNumber = current.queueNumber
    }

    // Apply update
    const updated = await Appointment.findByIdAndUpdate(id, updateFields, {
      new: true,
      runValidators: true,
    }).populate('patient')

    // Recalculate queue numbers if someone left "waiting"
    if (updateFields.status && updateFields.status !== 'waiting') {
      const waiting = await Appointment.find({ status: 'waiting' }).sort({
        createdAt: 1,
      })
      for (let i = 0; i < waiting.length; i++) {
        waiting[i].queueNumber = i + 1
        await waiting[i].save()
      }
    }

    // Real-time update
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
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

// DELETE = Cancel Appointment
export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params
  try {
    await dbConnect()

    const appointment = await Appointment.findById(id)
    if (!appointment) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    await appointment.deleteOne()

    // Update queue numbers
    const waiting = await Appointment.find({ status: 'waiting' }).sort({
      createdAt: 1,
    })
    for (let i = 0; i < waiting.length; i++) {
      waiting[i].queueNumber = i + 1
      await waiting[i].save()
    }

    await pusher.trigger('appointments', 'deleted', {
      _id: id,
    })

    return NextResponse.json({
      message: 'Appointment deleted and queue updated',
    })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
