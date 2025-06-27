// app/api/appointment/[id]/dispense/route.ts

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Appointment from '@/models/Appointment'
import type { RouteContext } from 'next' // ✅ Import RouteContext

export async function PUT(
  request: NextRequest,
  context: RouteContext<{ id: string }> // ✅ Properly typed context param
) {
  await dbConnect()

  const { id } = context.params

  try {
    const body = await request.json()

    const updatedAppointment = await Appointment.findByIdAndUpdate(id, body, {
      new: true,
    })

    if (!updatedAppointment) {
      return NextResponse.json(
        { message: 'Appointment not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedAppointment, { status: 200 })
  } catch (error) {
    console.error('Error updating appointment:', error)
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
