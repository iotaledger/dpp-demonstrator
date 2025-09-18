import { VerifyDomainLinkageRequest } from '@/types/identity'
import { NextRequest, NextResponse } from 'next/server';
import { DAPP_URL, IOTA_IDENTITY_PKG_ID } from '@/utils/constants';
import { startingFromDid, startingFromDomain } from '@/helpers/verifyDomainLinkage';

export async function POST(req: NextRequest) {
  // Run the middleware
  if (!IOTA_IDENTITY_PKG_ID || !DAPP_URL) {
    const configErrPayload = { error: 'Internal server configuration error' };
    return NextResponse.json(configErrPayload, { status: 500 });
  }

  const body = await req.json();
  const { did }: VerifyDomainLinkageRequest = body;
  if (!did) {
    const validationPayload = { error: 'Missing required fields' };
    return NextResponse.json(validationPayload, { status: 400 });
  }

  const payload = {
    fromDidCheck: await startingFromDid(did),
    fromDomainCheck: await startingFromDomain()
  };
  return NextResponse.json(payload);
}
