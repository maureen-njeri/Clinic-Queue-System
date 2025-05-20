import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/utils/db';
import Appointment from '@/models/Appointment';
import Pusher from 'pusher';

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await connectToDatabase();

    const { status } = await req.json();

    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Trigger real-time update via Pusher
    await pusher.trigger('appointments', 'status-updated', {
      _id: appointment._id,
      status: appointment.status,
    });

    return NextResponse.json({ message: 'Status updated successfully', appointment });
  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
