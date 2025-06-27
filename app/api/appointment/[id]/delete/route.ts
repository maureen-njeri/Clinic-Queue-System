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

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params

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

    const waiting = await Appointment.find({ status: 'waiting' }).sort({
      createdAt: 1,
    })
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
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
