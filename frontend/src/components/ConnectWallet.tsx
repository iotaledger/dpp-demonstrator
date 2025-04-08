import { useTranslation } from '~/lib/i18n'

export default function ConnectWallet() {
  const { t } = useTranslation('connectWallet')

  return (
    <>
      <div>
        <h2> {t('connectMessage')} </h2>
      </div>
    </>
  )
}
