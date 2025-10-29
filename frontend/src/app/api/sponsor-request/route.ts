import { NextResponse } from 'next/server';

import { ObjectRef } from '@iota/iota-sdk/transactions';

import { GAS_STATION_TOKEN, GAS_STATION_URL, RESERVE_DURATION_SEC } from '@/utils/constants';

interface ReserveGasResult {
  sponsor_address: string;
  reservation_id: number;
  gas_coins: ObjectRef[];
}

export interface ReserveGasResultResponse extends ReserveGasResult {
  gasBudget: number;
}

export async function GET() {
  try {
    const gasBudget = 100_000_000;
    const reservedSponsorGasData = await getSponsorGas(gasBudget);
    const payload = { ...reservedSponsorGasData, gasBudget };

    return NextResponse.json(payload);
  } catch (err: unknown) {
    const errPayload = { error: JSON.stringify(err) };
    return NextResponse.json(errPayload, { status: 500 });
  }
}

async function getSponsorGas(gasBudget: number): Promise<ReserveGasResult> {
  const requestData = {
    gas_budget: gasBudget,
    reserve_duration_secs: RESERVE_DURATION_SEC,
  };

  const response = await fetch(`${GAS_STATION_URL}/v1/reserve_gas`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${GAS_STATION_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gas reservation failed: ${errorText}`);
  }

  const json = await response.json();

  return json.result;
}
