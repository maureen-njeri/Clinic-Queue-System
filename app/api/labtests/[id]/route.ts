import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/mongodb'
import LabTest from '@/models/LabTest'

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect()
    const body = await req.json()
    const updated = await LabTest.findByIdAndUpdate(params.id, body, {
      new: true,
    })

    // Optional: Notify doctor when result is added
    if (body.result) {
      await fetch(`${process.env.NEXTAUTH_URL}/api/notify-doctor`, {
        method: 'POST',
        body: JSON.stringify({
          message: `Result ready for ${updated.patientName}`,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update test' },
      { status: 500 }
    )
  }
}
