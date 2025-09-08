import { useEffect, useState } from 'react'
import { Close } from '@iota/apps-ui-icons'
import { Button, ButtonType, Input, InputType, Select } from '@iota/apps-ui-kit'
import { useCurrentAccount, useSignTransaction } from '@iota/dapp-kit'

import { Federation, getRole } from '~/lib/federation'
import { useTranslation } from '~/lib/i18n'
import { Dpp, getDppData } from '~/lib/product'
import { createDppTx } from '~/lib/transactions'
import { ReserveGasResultResponse } from '~/pages/api/sponsor-request'
import styles from '~/styles/Dpp.module.css'

type DPPUpdatePopupProps = {
  onClose: () => void
  setSnackbar: (message: string) => void
  dppId: string
}

const AUDIT_TRAIL_PKG = process.env.NEXT_PUBLIC_AUDIT_TRAIL_PKG as string
const WHITELIST_ID = process.env.NEXT_PUBLIC_REWARD_WHITELIST_ID as string
const VAULT_ID = process.env.NEXT_PUBLIC_REWARD_VAULT_ID as string

export default function DPPUpdatePopup({ onClose, dppId, setSnackbar }: DPPUpdatePopupProps) {
  const { t } = useTranslation('dppAdd')
  const { mutateAsync: signTransaction } = useSignTransaction()
  const account = useCurrentAccount()
  const actions = [t('option1'), t('option2'), t('option3'), t('option4'), t('option5')]
  const [federationAddr, setFederationAddr] = useState('')
  const [userRole, setUserRole] = useState<string | null>(null)
  const [selectedAction, setSelectedAction] = useState(actions[0])
  const [valueAction, setValueAction] = useState('')
  const [entryDataKeys, setEntryDataKeys] = useState([actions[0]])
  const [entryDataValues, setEntryDataValues] = useState<string[]>([])
  const [federation, setFederation] = useState<Federation | undefined>(undefined)
  const [dpp, setDpp] = useState<Dpp | undefined>(undefined)

  useEffect(() => {
    const federationContent = sessionStorage.getItem('federationContent')
    if (federationContent) setFederation(JSON.parse(federationContent))
    const dppContent = sessionStorage.getItem('dppContent')
    if (dppContent) setDpp(JSON.parse(dppContent))
  }, [])

  useEffect(() => {
    if (federation && dpp && account?.address) {
      setUserRole(getRole(federation, account.address))
      const dppDetails = getDppData(dpp)
      setFederationAddr(dppDetails?.federationAddr || '')
    }
  }, [dpp, federation, account])

  const handleSubmit = async () => {
    if (!account?.address || !federationAddr || !dppId || !userRole || !valueAction) {
      setSnackbar(t('missingDataError'))

      return
    }
    try {
      const tx = createDppTx(AUDIT_TRAIL_PKG, {
        dppId,
        federationAddr,
        issuerRole: userRole,
        entryDataKeys,
        entryDataValues,
        whitelistId: WHITELIST_ID,
        vaultId: VAULT_ID,
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
      setSnackbar(t('successMessage'))
      onClose()
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('unknownError')
      setSnackbar(message)
    }
  }

  const onSelectEntryDataKeyChange = (id: string) => {
    setSelectedAction(id)
    setEntryDataKeys([id])
  }

  const handleEntryDataValueChange = (value: string) => {
    setValueAction(value)
    setEntryDataValues([value])
  }

  return (
    <div className={styles.card}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-title-lg">{t('updateTitle')}</h2>
        <button onClick={onClose} className="hover:opacity-80">
          <Close />
        </button>
      </div>
      <div className="flex flex-col gap-6">
        <Select
          label={t('actionSelectLabel')}
          options={actions}
          onValueChange={onSelectEntryDataKeyChange}
          value={selectedAction}
        />
        <Input
          label="Value"
          type={InputType.Text}
          value={valueAction}
          placeholder={t('dppUpdatePlaceholder')}
          onChange={(e) => handleEntryDataValueChange(e.target.value)}
        />
        <Button onClick={handleSubmit} type={ButtonType.Primary} text="Submit" />
      </div>
    </div>
  )
}
