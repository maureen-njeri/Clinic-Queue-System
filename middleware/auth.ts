import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next'
import { verifyToken } from '../utils/jwt'

export interface AuthenticatedRequest extends NextApiRequest {
  adminId?: string
}

export function withAuth(handler: NextApiHandler) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]
    try {
      const decoded = verifyToken(token) as { adminId: string }
      req.adminId = decoded.adminId
      return handler(req, res)
    } catch (error) {
      return res.status(401).json({ message: 'Invalid or expired token' })
    }
  }
}
