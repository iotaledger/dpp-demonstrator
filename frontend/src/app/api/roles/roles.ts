// TODO: remove page implementation
import dotenv from 'dotenv'
import type { NextApiRequest, NextApiResponse } from 'next'

dotenv.config()

const BACKEND_ENDPOINT = process.env.BACKEND_ENDPOINT
const BACKEND_API_KEY = process.env.BACKEND_API_KEY as string

if (!BACKEND_ENDPOINT || !BACKEND_API_KEY) {
  throw new Error('BACKEND_ENDPOINT or BACKEND_API_KEY is not defined in environment variables.')
}

type UserRole = 'Repairer'

interface RequestBody {
  user_addr: string
  user_role: UserRole
  federation_addr: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  try {
    const { user_addr, user_role, federation_addr }: RequestBody = req.body

    if (!user_addr || !user_role || !federation_addr) {
      return res.status(400).json({ error: 'Missing required fields' })
    }

    const response = await fetch(`${BACKEND_ENDPOINT}/roles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': BACKEND_API_KEY,
      },
      body: JSON.stringify({ user_addr, user_role, federation_addr }),
    })

    if (!response.ok) {
      const errorBody = await response.text()

      return res.status(response.status).json({ error: errorBody })
    }

    const data = await response.json()

    return res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({ error: 'Internal Server Error' })
  }
}
