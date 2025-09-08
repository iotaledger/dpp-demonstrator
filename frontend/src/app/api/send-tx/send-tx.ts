// TODO: remove page implementation
import { fromB64, toB64 } from '@iota/bcs'
import { TransactionEffects } from '@iota/iota-sdk/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const gasStationUrl = process.env.GAS_STATION_URL as string
const gasStationToken = process.env.GAS_STATION_AUTH as string

// eslint-disable-next-line no-console
console.log(`${gasStationUrl} ${gasStationToken}`)

interface SendTxRequest {
  tx: string
  signature: string
  reservation_id: number
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { tx, signature, reservation_id } = req.body as SendTxRequest

  if (!tx || !signature || !reservation_id) {
    return res.status(400).json({ error: 'Missing tx, reservation_id or signature in body' })
  }

  try {
    const txBytes = fromB64(tx)

    const transactionEffects = await sponsorSignAndSubmit(reservation_id, txBytes, signature)

    return res.status(200).json({ effects: transactionEffects })
  } catch (err: unknown) {
    return res.status(500).json(err)
  }

  async function sponsorSignAndSubmit(
    reservationId: number,
    transaction: Uint8Array,
    senderSignature: string
  ): Promise<TransactionEffects> {
    const data = {
      reservation_id: reservationId,
      tx_bytes: toB64(transaction),
      user_sig: senderSignature,
    }

    const response = await fetch(`${gasStationUrl}/v1/execute_tx`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${gasStationToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Transaction submission failed: ${errorText}`)
    }

    const json = await response.json()

    return json.effects
  }
}
