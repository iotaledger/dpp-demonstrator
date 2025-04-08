import { useEffect, useState } from 'react'
import { Copy, RecognizedBadge } from '@iota/apps-ui-icons'
import { Button, ButtonType, Input, InputType, Select, Snackbar, SnackbarType, Title } from '@iota/apps-ui-kit'
import { useCurrentAccount, useCurrentWallet, useIotaClientQuery } from '@iota/dapp-kit'
import { useSearchParams } from 'next/navigation'

import ConnectWallet from '~/components/ConnectWallet'
import { truncateAddress } from '~/helpers'
import { copyToClipboard } from '~/helpers/copyToClipboard'
import { Federation, getRole } from '~/lib/federation'
import { useTranslation } from '~/lib/i18n'

export default function Role() {
  const { t } = useTranslation('roles')
  const account = useCurrentAccount()
  const { connectionStatus } = useCurrentWallet()
  const searchParams = useSearchParams()

  const [selectedRole, setSelectedRole] = useState('Repairer')
  const [snackbar, setSnackbar] = useState<{ text: string; snackbarType: SnackbarType } | null>(null)
  const [userRole, setUserRole] = useState<JSX.Element | null>(null)

  const federationAddr = searchParams.get('federation_addr')
  const dppId = searchParams.get('dpp_id')
  const urlRole = searchParams.get('role')

  const roles = [{ name: t('repairer'), disabled: false }]

  const { data, refetch } = useIotaClientQuery('getObject', {
    id: federationAddr || '',
    options: { showContent: true },
  })

  useEffect(() => {
    if (urlRole && roles.some((role) => role.name === urlRole && !role.disabled)) {
      setSelectedRole(urlRole)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (account?.address) {
      void refetch()
    }
  }, [account?.address, refetch])

  useEffect(() => {
    if (!data || !account?.address) {
      setUserRole(null)

      return
    }
    const federationData = data.data?.content as unknown as Federation
    const role = getRole(federationData, account.address)
    setUserRole(
      role ? (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
          <RecognizedBadge />
          {t('certified')} {role}
        </div>
      ) : null
    )
  }, [data, account?.address, t])

  useEffect(() => {
    void refetch()
  }, [snackbar, refetch])

  const handleSubmit = async () => {
    if (!account?.address || !federationAddr) {
      setSnackbar({ text: t('missingDataError'), snackbarType: SnackbarType.Error })

      return
    }
    try {
      setSnackbar({ text: t('sendingTransaction'), snackbarType: SnackbarType.Default })

      const response = await fetch('/api/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_addr: account.address,
          user_role: selectedRole,
          federation_addr: federationAddr,
        }),
      })

      const result = await response.json()
      if (!response.ok) {
        throw new Error(result.error || t('unknownError'))
      }

      setSnackbar({ text: t('successMessage'), snackbarType: SnackbarType.Default })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t('unknownError')
      setSnackbar({ text: message, snackbarType: SnackbarType.Error })
    }
  }

  const onCloseSnackbar = () => {
    setSnackbar(null)
  }

  const onOptionValueChange = (value: string) => {
    setSelectedRole(value)
  }

  const handleCopy = (text: string) => {
    copyToClipboard({
      text,
      onResult: setSnackbar,
      t,
    })
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
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        {dppId ? (
          <div className="mb-4 text-xs text-blue-600 underline cursor-pointer">
            <a href={`/dpp/${dppId}`}>{t('goBackLink')}</a>
          </div>
        ) : null}

        <Title title={t('title')} />

        <div className="w-full p-6 flex flex-col gap-7 items-stretch">
          <Input
            label={t('federationAddressLabel')}
            type={InputType.Text}
            value={federationAddr ? truncateAddress(federationAddr) : ''}
            trailingElement={
              <div onClick={() => handleCopy(federationAddr || '')} className="cursor-pointer hover:opacity-80">
                <Copy />
              </div>
            }
            readOnly
          />

          <Select
            label={t('roleSelectLabel')}
            options={roles.map((role) => role.name)}
            onValueChange={onOptionValueChange}
            value={selectedRole}
          />

          {!userRole ? (
            <Button onClick={handleSubmit} type={ButtonType.Primary} text={t('submitButton')} />
          ) : (
            <>
              <Button onClick={handleSubmit} type={ButtonType.Primary} text={t('submitButton')} disabled />
              <div className="text-center">{userRole}</div>
            </>
          )}
        </div>

        {snackbar && (
          <Snackbar text={snackbar.text} type={snackbar.snackbarType} onClose={onCloseSnackbar} duration={15000} />
        )}
      </div>
    </div>
  )
}
