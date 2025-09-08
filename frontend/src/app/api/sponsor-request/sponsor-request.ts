import { ObjectRef } from '@iota/iota-sdk/transactions'
import type { NextApiRequest, NextApiResponse } from 'next'

interface ReserveGasResult {
  sponsor_address: string
  reservation_id: number
  gas_coins: ObjectRef[]
}

export interface ReserveGasResultResponse extends ReserveGasResult {
  gasBudget: number
}

const RESERVE_DURATION_SEC = 180

const gasStationUrl = process.env.GAS_STATION_URL as string
const gasStationToken = process.env.GAS_STATION_AUTH as string

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReserveGasResultResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const gasBudget = 100_000_000
    const reservedSponsorGasData = await getSponsorGas(gasBudget)
    const response = { ...reservedSponsorGasData, gasBudget }

    return res.status(200).json(response)
  } catch (err: unknown) {
    return res.status(500).json({ error: JSON.stringify(err) })
  }
}

async function getSponsorGas(gasBudget: number): Promise<ReserveGasResult> {
  const requestData = {
    gas_budget: gasBudget,
    reserve_duration_secs: RESERVE_DURATION_SEC,
  }

  const response = await fetch(`${gasStationUrl}/v1/reserve_gas`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${gasStationToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestData),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Gas reservation failed: ${errorText}`)
  }

  const json = await response.json()

  return json.result
}
