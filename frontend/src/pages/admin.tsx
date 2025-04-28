import { useEffect, useState } from 'react'
import { Button, ButtonType, Input, InputType, Snackbar, SnackbarType } from '@iota/apps-ui-kit'
import { useCurrentAccount, useSignTransaction } from '@iota/dapp-kit'
import { useRouter } from 'next/router'

import ErrorComponent from '~/components/ErrorComponent'
import { useTranslation } from '~/lib/i18n'
import { createRewardAuthTx } from '~/lib/transactions'
import { ReserveGasResultResponse } from '~/pages/api/sponsor-request'
import styles from '~/styles/Admin.module.css'

const AUDIT_TRAIL_PKG = process.env.NEXT_PUBLIC_AUDIT_TRAIL_PKG as string
const ADMIN_CAP = process.env.NEXT_PUBLIC_ADMIN_CAP_ID as string
const WHITELISTID = process.env.NEXT_PUBLIC_REWARD_WHITELIST_ID as string

export default function Admin() {
  const { query } = useRouter()
  const { mutateAsync: signTransaction } = useSignTransaction()
  const account = useCurrentAccount()
  const { t } = useTranslation('admin')

  const [addressValue, setAddressValue] = useState('')
  const [snackbar, setSnackbar] = useState<{ text: string; snackbarType: SnackbarType } | null>(null)

  useEffect(() => {
    if (typeof query.recipient === 'string') setAddressValue(query.recipient)
  }, [query.recipient])

  const showSnackbar = (text: string, snackbarType: SnackbarType) => {
    setSnackbar({ text, snackbarType })
    setTimeout(() => setSnackbar(null), 4000)
  }

  const onCloseSnackbar = () => setSnackbar(null)

  const handleAuthorize = async () => {
    if (!account?.address || !addressValue) {
      showSnackbar(t('missingDataError'), SnackbarType.Error)

      return
    }
    try {
      const tx = createRewardAuthTx(AUDIT_TRAIL_PKG, {
        adminCapId: ADMIN_CAP,
        whitelistId: WHITELISTID,
        recepient: addressValue,
      })
      const sponsorRes = await fetch('/api/sponsor-request')
      if (!sponsorRes.ok) throw new Error('Sponsor gas reservation failed')
      const reservedSponsorGasData: ReserveGasResultResponse = await sponsorRes.json()
      tx.setSender(account.address)
      tx.setGasOwner(reservedSponsorGasData.sponsor_address)
      tx.setGasPayment(reservedSponsorGasData.gas_coins)
      tx.setGasBudget(Number(reservedSponsorGasData.gasBudget))
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
          reservation_id: reservedSponsorGasData.reservation_id,
        }),
      })
      if (!sendRes.ok) {
        const errText = await sendRes.text()
        throw new Error(`Transaction execution failed: ${errText}`)
      }
      await sendRes.json()
      showSnackbar(t('successMessage'), SnackbarType.Default)
    } catch (error) {
      const message = error instanceof Error ? error.message : t('unknownError')
      showSnackbar(message, SnackbarType.Error)
    }
  }

  if (!account?.address) {
    return <ErrorComponent message={`${t('connectWallet')}`} />
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.card}>
        <Input
          label={t('addressLabel')}
          type={InputType.Text}
          value={addressValue}
          placeholder={t('addressPlaceholder')}
          onChange={(e) => setAddressValue(e.target.value)}
        />
        <Button text={t('authorizeButton')} type={ButtonType.Primary} onClick={handleAuthorize} />
        {snackbar && (
          <Snackbar text={snackbar.text} type={snackbar.snackbarType} onClose={onCloseSnackbar} duration={4000} />
        )}
      </div>
    </div>
  )
}
