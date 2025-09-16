import { BACKEND_API_KEY, BACKEND_ENDPOINT } from '@/utils/constants'
import { NextRequest, NextResponse } from 'next/server'

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

    const rolesUrl = `${BACKEND_ENDPOINT!}/roles`;
    const headers = new Headers([
      ['Content-Type', 'application/json'],
      ['x-api-key', BACKEND_API_KEY || '']
    ]);
    const response = await fetch(rolesUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ user_addr, user_role, federation_addr }),
    });

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
