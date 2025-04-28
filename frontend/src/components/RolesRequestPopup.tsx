import { useEffect, useState } from 'react'
import { Close, Copy } from '@iota/apps-ui-icons'
import { Button, ButtonType, Input, InputType, Select, Snackbar, SnackbarType } from '@iota/apps-ui-kit'
import { useCurrentAccount, useCurrentWallet, useIotaClientQuery } from '@iota/dapp-kit'
import QRcode from 'qrcode'

import ConnectWallet from '~/components/ConnectWallet'
import { truncateAddress } from '~/helpers'
import { copyToClipboard } from '~/helpers/copyToClipboard'
import { useTranslation } from '~/lib/i18n'
import { isAddressInWhitelist } from '~/lib/whitelist'

type RolesRequestPopupProps = {
  federationAddr: string
  urlRole: string | undefined
  onClose: () => void
}

const DAPP_URL = process.env.NEXT_PUBLIC_DAPP_URL as string
const WHITELIST_ID = process.env.NEXT_PUBLIC_REWARD_WHITELIST_ID as string
const REFRESH_INTERVAL_MS = Number(process.env.NEXT_PUBLIC_REFRESH_INTERVAL_MS)
const HAS_REWARD = Boolean(process.env.NEXT_PUBLIC_HAS_REWARD)

export default function RolesRequestPopup({ federationAddr, urlRole, onClose }: RolesRequestPopupProps) {
  const { t } = useTranslation('roles')
  const account = useCurrentAccount()
  const { connectionStatus } = useCurrentWallet()
  const [selectedRole, setSelectedRole] = useState('Repairer')
  const [snackbar, setSnackbar] = useState<{ text: string; snackbarType: SnackbarType } | null>(null)
  const [showQrCode, setShowQrCode] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [qrCodeImage, setQrCodeImage] = useState('')
  const [canContinue, setCanContinue] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const roles = [{ name: t('repairer'), disabled: false }]

  const whitelistData = useIotaClientQuery('getObject', { id: WHITELIST_ID, options: { showContent: true } })

  useEffect(() => {
    if (!HAS_REWARD) return undefined

    const interval = setInterval(whitelistData.refetch, REFRESH_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [whitelistData])

  useEffect(() => {
    if (!HAS_REWARD) return
    const content = whitelistData.data?.data?.content
    if (whitelistData.isFetched && content && account?.address) {
      setCanContinue(isAddressInWhitelist(content, account.address))
    }
  }, [account?.address, whitelistData.data, whitelistData.isFetched])

  useEffect(() => {
    if (urlRole && roles.some((role) => role.name === urlRole && !role.disabled)) {
      setSelectedRole(urlRole)
    }
  }, [urlRole, roles])

  useEffect(() => {
    if (showQrCode && qrCodeUrl) {
      QRcode.toDataURL(qrCodeUrl)
        .then(setQrCodeImage)
        .catch(() => setSnackbar({ text: t('unknownError'), snackbarType: SnackbarType.Error }))
    }
  }, [showQrCode, qrCodeUrl, t])

  const sendRoleRequest = async () => {
    try {
      if (!account?.address || !federationAddr) throw new Error(t('missingDataError'))
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
      if (!response.ok) throw new Error(result.error || t('unknownError'))
      onClose()
    } catch (error) {
      const message = error instanceof Error ? error.message : t('unknownError')
      setSnackbar({ text: message, snackbarType: SnackbarType.Error })
    }
  }

  const handleSubmit = () => {
    if (!account?.address || !federationAddr) {
      setSnackbar({ text: t('missingDataError'), snackbarType: SnackbarType.Error })

      return
    }
    if (HAS_REWARD) {
      setQrCodeUrl(`nightly://v1?network=iota&url=${DAPP_URL}/admin?recipient=${account.address}`)
      setShowQrCode(true)

      return
    }
    void sendRoleRequest()
  }

  const onCloseSnackbar = () => setSnackbar(null)
  const onOptionValueChange = (value: string) => setSelectedRole(value)
  const handleCopy = (text: string) => copyToClipboard({ text, onResult: setSnackbar, t })

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
        <p className="text-title-lg">{HAS_REWARD && showQrCode ? t('beAuthorized') : t('title')}</p>
        <button onClick={onClose} className="hover:opacity-80">
          <Close />
        </button>
      </div>

      {!HAS_REWARD || !showQrCode ? (
        <>
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
          <Button onClick={handleSubmit} type={ButtonType.Primary} text={t('submitButton')} fullWidth />
        </>
      ) : (
        <>
          {qrCodeImage && <img src={qrCodeImage} alt="QR code" className="w-full" />}
          <Button
            onClick={sendRoleRequest}
            type={ButtonType.Primary}
            text={t('continue')}
            fullWidth
            disabled={!canContinue}
          />
        </>
      )}

      {snackbar && (
        <Snackbar text={snackbar.text} type={snackbar.snackbarType} onClose={onCloseSnackbar} duration={15000} />
      )}
    </div>
  )
}
