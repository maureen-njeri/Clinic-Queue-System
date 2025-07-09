export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Appointment from '@/models/Appointment'

export async function GET() {
  await connectDB()

  const userCount = await User.countDocuments()
  const appointmentCount = await Appointment.countDocuments()
  const prescriptionsCount = await Appointment.countDocuments({
    prescription: { $exists: true },
  })
  const today = new Date().toISOString().split('T')[0]
  const todayAppointments = await Appointment.countDocuments({
    createdAt: { $gte: new Date(today) },
  })

  return NextResponse.json({
    users: userCount,
    appointments: appointmentCount,
    prescriptions: prescriptionsCount,
    todayAppointments,
  })
}
