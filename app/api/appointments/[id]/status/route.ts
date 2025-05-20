import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: NextRequest,
  context: Promise<{ params: { id: string } }>
) {
  try {
    const { params } = await context;
    const { id } = params;

    const body = await req.json();

    // Your update logic here...

    return NextResponse.json({ message: `Appointment ${id} status updated`, data: body });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update appointment status' }, { status: 500 });
  }
}
