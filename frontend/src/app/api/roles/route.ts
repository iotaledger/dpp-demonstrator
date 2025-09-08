import dotenv from 'dotenv'
import { NextRequest, NextResponse } from 'next/server'

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

export async function POST(req: NextRequest) {
  const body = await req.json()
  try {
    const { user_addr, user_role, federation_addr }: RequestBody = body;

    if (!user_addr || !user_role || !federation_addr) {
      const validationPayload = { error: 'Missing required fields' };
      return NextResponse.json(validationPayload, { status: 400 });
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
      const errPayload = JSON.stringify({ error: errorBody });
      return NextResponse.json(errPayload, { status: response.status });
    }

    const payload = await response.json()
    return NextResponse.json(payload);
  } catch (error) {
    const errPayload = { error: 'Internal Server Error' };
    return NextResponse.json(errPayload, { status: 500 });
  }
}
