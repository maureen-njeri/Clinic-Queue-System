import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Appointment from '@/models/Appointment';

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();

  const { status } = await req.json();

  const appointment = await Appointment.findByIdAndUpdate(
    params.id,
    { status },
    { new: true }
  ).populate("patient");

  if (!appointment) {
    return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
  }

  return NextResponse.json({ success: true, appointment });
}
