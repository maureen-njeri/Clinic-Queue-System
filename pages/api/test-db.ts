import type { NextApiRequest, NextApiResponse } from 'next';
import dbConnect from '../../lib/mongodb';
import Appointment from '../../models/Appointment'; // Adjust the path to your model

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    await dbConnect();

    const appointments = await Appointment.find({}); // Fetch all appointments
    res.status(200).json({ success: true, appointments }); // 👈 Return actual data
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message });
    } else {
      res.status(500).json({ success: false, error: 'Unknown error occurred' });
    }
  }
}
