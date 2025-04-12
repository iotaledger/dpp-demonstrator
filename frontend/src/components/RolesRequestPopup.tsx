import { useEffect, useState } from 'react'
import { Close, Copy, RecognizedBadge } from '@iota/apps-ui-icons'
import { Button, ButtonType, Input, InputType, Select, Snackbar, SnackbarType } from '@iota/apps-ui-kit'
import { useCurrentAccount, useCurrentWallet, useIotaClientQuery } from '@iota/dapp-kit'

import ConnectWallet from '~/components/ConnectWallet'
import { truncateAddress } from '~/helpers'
import { copyToClipboard } from '~/helpers/copyToClipboard'
import { Federation, getRole } from '~/lib/federation'
import { useTranslation } from '~/lib/i18n'

type RolesRequestPopupProps = {
  federationAddr: string
  urlRole: string | undefined
  onClose: () => void
}

const SLEEP_TIME = 5000

export default function RolesRequestPopup({ federationAddr, urlRole, onClose }: RolesRequestPopupProps) {
  const { t } = useTranslation('roles')
  const account = useCurrentAccount()
  const { connectionStatus } = useCurrentWallet()
  const [selectedRole, setSelectedRole] = useState('Repairer')
  const [snackbar, setSnackbar] = useState<{ text: string; snackbarType: SnackbarType } | null>(null)
  const [userRole, setUserRole] = useState<JSX.Element | null>(null)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const roles = [{ name: t('repairer'), disabled: false }]
  const { data, refetch } = useIotaClientQuery('getObject', {
    id: federationAddr || '',
    options: { showContent: true },
  })

  useEffect(() => {
    if (urlRole && roles.some((role) => role.name === urlRole && !role.disabled)) {
      setSelectedRole(urlRole)
    }
  }, [urlRole, roles])

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
  }, [data, account?.address, t, refetch])

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
      await new Promise((resolve) => setTimeout(resolve, SLEEP_TIME))
      setSnackbar({ text: t('manufacturerAuthorization'), snackbarType: SnackbarType.Default })
      await new Promise((resolve) => setTimeout(resolve, SLEEP_TIME))
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
    <div className="popup-card gap-8">
      <div className="flex w-full items-center justify-between">
        <p className="text-title-lg">{t('title')}</p>
        <button onClick={onClose} className="hover:opacity-80">
          <Close />
        </button>
      </div>

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
        <Button onClick={handleSubmit} type={ButtonType.Primary} text={t('submitButton')} fullWidth />
      ) : (
        <>
          <Button onClick={handleSubmit} type={ButtonType.Primary} text={t('submitButton')} disabled fullWidth />
          <div className="text-center">{userRole}</div>
        </>
      )}

      {snackbar && (
        <Snackbar text={snackbar.text} type={snackbar.snackbarType} onClose={onCloseSnackbar} duration={15000} />
      )}
    </div>
  )
}
