import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Appointment from '@/models/Appointment'
import { getToken } from 'next-auth/jwt'

export async function PUT(req: Request, context: { params: { id: string } }) {
  const { id } = context.params
  const body = await req.json()
  const { dispensed, pharmacistNote } = body

  await connectDB()
  const token = await getToken({ req })

  const pharmacistName = token?.name || 'Unknown'

  try {
    const updated = await Appointment.findByIdAndUpdate(
      id,
      {
        dispensed,
        pharmacistNote,
        dispensedBy: pharmacistName,
        dispensedAt: new Date(),
      },
      { new: true }
    )

    if (!updated) {
      return NextResponse.json(
        { error: 'Appointment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updated, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
