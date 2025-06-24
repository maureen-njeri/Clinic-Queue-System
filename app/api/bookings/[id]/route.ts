import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
import dbConnect from '@/lib/mongodb'
import Appointment from '@/models/Appointment'
import { pusherServer } from '@/lib/pusher-server'

export async function PATCH(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: 'Invalid appointment ID' },
      { status: 400 }
    )
  }

  try {
    const { status } = await request.json()
    if (!['waiting', 'in-progress', 'done'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    await dbConnect()

    const updated = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).populate('patient')

    if (!updated) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // 🔔 Trigger real-time update
    await pusherServer.trigger('bookings', 'status-updated', {
      appointmentId: updated._id,
      status: updated.status,
    })

    return NextResponse.json({ message: 'Status updated', data: updated })
  } catch (error) {
    console.error('PATCH error:', error)
    return NextResponse.json(
      { error: 'Failed to update status' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = context.params

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return NextResponse.json(
      { error: 'Invalid appointment ID' },
      { status: 400 }
    )
  }

  try {
    await dbConnect()
    const deleted = await Appointment.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    // 🔔 Trigger real-time delete update
    await pusherServer.trigger('bookings', 'appointment-deleted', {
      appointmentId: id,
    })

    return NextResponse.json({ message: 'Appointment deleted successfully' })
  } catch (error) {
    console.error('DELETE error:', error)
    return NextResponse.json(
      { error: 'Failed to delete appointment' },
      { status: 500 }
    )
  }
}
