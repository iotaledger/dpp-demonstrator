import { NextRequest, NextResponse } from 'next/server';

// TODO: Find a replacement to `toB64`, which is deprecated
import { fromB64, toB64 } from '@iota/bcs';

import { type TransactionEffects } from '@/types/api';
import { GAS_STATION_TOKEN, GAS_STATION_URL } from '@/utils/constants';

interface SendTxRequest {
  tx: string;
  signature: string;
  reservation_id: number;
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { tx, signature, reservation_id } = body as SendTxRequest;

  if (!tx || !signature || !reservation_id) {
    const validationPayload = { error: 'Missing tx, reservation_id or signature in body' };
    return NextResponse.json(validationPayload, { status: 400 });
  }

  try {
    const txBytes = fromB64(tx);
    const transactionEffects = await sponsorSignAndSubmit(reservation_id, txBytes, signature);

    const payload = { effects: transactionEffects };
    return NextResponse.json(payload);
  } catch (err: unknown) {
    return NextResponse.json(err, { status: 500 });
  }

  async function sponsorSignAndSubmit(
    reservationId: number,
    transaction: Uint8Array,
    senderSignature: string,
  ): Promise<TransactionEffects> {
    const data = {
      reservation_id: reservationId,
      tx_bytes: toB64(transaction),
      user_sig: senderSignature,
    };
    const response = await fetch(`${GAS_STATION_URL}/v1/execute_tx`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GAS_STATION_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Transaction submission failed: ${errorText}`);
    }

    const json = await response.json();
    return json.effects;
  }
}
