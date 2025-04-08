/* pages/Manufacturer.tsx */
import { useState } from 'react'
import { useCurrentAccount, useCurrentWallet, useSignTransaction } from '@iota/dapp-kit'

import ConnectWallet from '~/components/ConnectWallet'
import { createNewProductTx } from '~/lib/transactions'

const NEXT_PUBLIC_AUDIT_TRAIL_PKG = process.env.NEXT_PUBLIC_AUDIT_TRAIL_PKG as string
const FEDERATION_ID = process.env.NEXT_PUBLIC_FEDERATION_ID as string

export default function Manufacturer() {
  const [digest, setDigest] = useState<string | null>(null)
  const { connectionStatus } = useCurrentWallet()
  const { mutateAsync: signTransaction } = useSignTransaction()
  const account = useCurrentAccount()

  const handleCreateProduct = async () => {
    if (!account?.address) return

    try {
      const tx = createNewProductTx(NEXT_PUBLIC_AUDIT_TRAIL_PKG, FEDERATION_ID)

      const sponsorRes = await fetch('/api/sponsor-request')
      if (!sponsorRes.ok) throw new Error('Sponsor gas reservation failed')
      const sponsorData = await sponsorRes.json()

      tx.setSender(account.address)
      tx.setGasOwner(sponsorData.sponsor_address)
      tx.setGasPayment(sponsorData.gas_coins)
      tx.setGasBudget(Number(sponsorData.gasBudget))

      const { bytes, signature } = await signTransaction({
        transaction: tx,
        chain: 'iota:testnet',
      })

      const sendRes = await fetch('/api/send-tx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tx: bytes,
          signature,
          reservation_id: sponsorData.reservation_id,
        }),
      })
      if (!sendRes.ok) {
        const errText = await sendRes.text()
        throw new Error(`Transaction execution failed: ${errText}`)
      }

      const executeResult = await sendRes.json()
      setDigest(executeResult?.effects?.transactionDigest || 'No digest returned')
    } catch (err: unknown) {
      setDigest('Error sending transaction')
    }
  }

  if (connectionStatus !== 'connected') {
    return (
      <div className="flex flex-col items-center justify-start min-h-screen p-6 min-w-[300px]">
        <ConnectWallet />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-6 min-w-[300px]">
      <button onClick={handleCreateProduct}>Create Product</button>
      {digest && <div>TX Digest: {digest}</div>}
    </div>
  )
}
