// pages/api/test-db.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import dbConnect from '@/lib/mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect()
    res.status(200).json({ message: 'MongoDB connected successfully!' })
  } catch (error) {
    console.error('DB connection error:', error)
    res.status(500).json({ message: 'Database connection failed', error })
  }
}
