import { NextRequest, NextResponse } from 'next/server';

import { RouteRequestBody } from '@/types/api';
import { BACKEND_API_KEY, BACKEND_ENDPOINT } from '@/utils/constants';

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    const { user_addr, user_role, federation_addr }: RouteRequestBody = body;

    if (!user_addr || !user_role || !federation_addr) {
      const validationPayload = { error: 'Missing required fields' };
      return NextResponse.json(validationPayload, { status: 400 });
    }

    const rolesUrl = `${BACKEND_ENDPOINT!}/roles`;
    const headers = new Headers([
      ['Content-Type', 'application/json'],
      ['x-api-key', BACKEND_API_KEY || ''],
    ]);
    const response = await fetch(rolesUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ user_addr, user_role, federation_addr }),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      const errPayload = JSON.stringify({ error: errorBody });
      return NextResponse.json(errPayload, { status: response.status });
    }

    const payload = await response.json();
    return NextResponse.json(payload);
  } catch (error) {
    const errPayload = { error: 'Internal Server Error' };
    console.error('Error while retrieving roles from federation', error);
    return NextResponse.json(errPayload, { status: 500 });
  }
}
