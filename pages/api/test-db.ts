import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' })
  }

  try {
    console.log('Connecting to MongoDB...')
    await dbConnect()
    console.log('Connected!')

    res.status(200).json({ success: true, message: 'MongoDB connected successfully' })
  } catch (error) {
    console.error('MongoDB connection error:', error)

    if (error instanceof Error) {
      res.status(500).json({ success: false, error: error.message })
    } else {
      res.status(500).json({ success: false, error: 'Unknown error occurred' })
    }
  }
}
