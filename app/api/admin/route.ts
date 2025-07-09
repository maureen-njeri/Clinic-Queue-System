export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import Booking from '@/models/Booking'

export async function GET(req: NextRequest) {
  try {
    await dbConnect()

    // Optionally filter by phone or name if you want (query params)
    const phone = req.nextUrl.searchParams.get('phone')
    const fullName = req.nextUrl.searchParams.get('name')

    const filter: any = {}
    if (phone) filter.phone = phone
    if (fullName) filter.fullName = fullName

    // Fetch bookings, sorted by creation date ascending
    const bookings = await Booking.find(filter).sort({ createdAt: 1 })

    // ✅ Rename "bookings" to "patients" in the response
    return NextResponse.json({ patients: bookings })
  } catch (error) {
    console.error('Failed to fetch bookings:', error)
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    )
  }
}
