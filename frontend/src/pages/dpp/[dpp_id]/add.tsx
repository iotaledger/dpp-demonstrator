/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react'
import { Button, ButtonType, Input, InputType, Select, Snackbar, SnackbarType, Title } from '@iota/apps-ui-kit'
import { useCurrentAccount, useCurrentWallet, useSignTransaction } from '@iota/dapp-kit'
import { useRouter } from 'next/router'

import ConnectWallet from '~/components/ConnectWallet'
import DppDetails from '~/components/DppDetails'
import ErrorComponent from '~/components/ErrorComponent'
import { Federation, getRole } from '~/lib/federation'
import { useTranslation } from '~/lib/i18n'
import { Dpp, DppData, getDppData } from '~/lib/product'
import { createDppTx } from '~/lib/transactions'
import { ReserveGasResultResponse } from '~/pages/api/sponsor-request'

const AUDIT_TRAIL_PKG = process.env.NEXT_PUBLIC_AUDIT_TRAIL_PKG as string

export default function DPPUpdateView() {
  const { t } = useTranslation('dppAdd')
  const router = useRouter()
  const { dpp_id } = router.query

  const { connectionStatus } = useCurrentWallet()
  const { mutateAsync: signTransaction } = useSignTransaction()
  const account = useCurrentAccount()

  const actions = [t('option1'), t('option2'), t('option3'), t('option4'), t('option5')]

  const [federationAddr, setFederationAddr] = useState('')
  const [userRole, setUserRole] = useState<string | null>(null)
  const [selectedAction, setSelectedAction] = useState(actions[0])
  const [valueAction, setValueAction] = useState('')
  const [entryDataKeys, setEntryDataKeys] = useState([actions[0]])
  const [entryDataValues, setEntryDataValues] = useState<string[]>([])
  const [dppDetailsData, setDppDetailsData] = useState<DppData | undefined>(undefined)

  const [snackbar, setSnackbar] = useState<{ text: string; snackbarType: SnackbarType } | null>(null)
  const [fatalError, setFatalError] = useState<string | null>(null)

  const [federation, setFederation] = useState<Federation | undefined>(undefined)
  const [dpp, setDpp] = useState<Dpp | undefined>(undefined)

  useEffect(() => {
    const federationContent = sessionStorage.getItem('federationContent')
    if (federationContent) {
      setFederation(JSON.parse(federationContent))
    }

    const dppContent = sessionStorage.getItem('dppContent')
    if (dppContent) {
      setDpp(JSON.parse(dppContent))
    }
  }, [])

  useEffect(() => {
    if (federation && dpp && account?.address) {
      setUserRole(getRole(federation, account.address))
      const dppDetails = getDppData(dpp)
      setDppDetailsData(dppDetails)
      setFederationAddr(dppDetails?.federationAddr || '')
      setFatalError(null)
    }
  }, [dpp, federation, account])

  useEffect(() => {
    if (!userRole) {
      setFatalError(t('notAuthorizedOrNotFound'))
    }
  }, [userRole])

  const handleSubmit = async () => {
    if (!account?.address || !federationAddr || !dpp_id || !userRole || !valueAction) {
      setSnackbar({ text: t('missingDataError'), snackbarType: SnackbarType.Error })

      return
    }
    try {
      setSnackbar({ text: t('sendingTransaction'), snackbarType: SnackbarType.Default })
      const tx = createDppTx(AUDIT_TRAIL_PKG, {
        dppId: dpp_id.toString(),
        federationAddr,
        issuerRole: userRole,
        entryDataKeys,
        entryDataValues,
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

      const executeResult = await sendRes.json()

      setSnackbar({
        text: `${t('successMessage')} TX Digest: ${executeResult?.effects?.transactionDigest}`,
        snackbarType: SnackbarType.Default,
      })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('unknownError')
      setSnackbar({ text: message, snackbarType: SnackbarType.Error })
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

  const onCloseSnackbar = () => setSnackbar(null)

  if (connectionStatus !== 'connected') {
    return (
      <div className="flex flex-col items-center justify-start min-h-screen p-6 min-w-[300px]">
        <ConnectWallet />
      </div>
    )
  }

  if (fatalError) {
    return (
      <div className="flex flex-col items-center justify-start min-h-screen p-6 min-w-[300px]">
        <ErrorComponent message={fatalError} />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-6 min-w-[300px]">
      <div className="mb-4 text-xs text-blue-600 underline cursor-pointer">
        <a href={`/dpp/${dpp_id}`}>{t('goBackLink')}</a>
      </div>
      <div className="w-full max-w-md flex flex-col gap-4">
        <Title title="DPP Update View" />

        <div className="bg-white rounded shadow p-4 flex flex-col gap-4">
          <h2 className="text-lg font-bold mb-4">{t('updateTitle')}</h2>
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

        <div className="bg-white rounded shadow p-4 flex flex-col gap-2">
          <DppDetails dppData={dppDetailsData} />
        </div>

        {snackbar && (
          <Snackbar text={snackbar.text} type={snackbar.snackbarType} onClose={onCloseSnackbar} duration={15000} />
        )}
      </div>
    </div>
  )
}
