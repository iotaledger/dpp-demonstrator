import { useCurrentAccount, useCurrentWallet, useDisconnectWallet, useWallets } from '@iota/dapp-kit'
import Image from 'next/image'

import { truncateAddress } from '~/helpers'
import { useTranslation } from '~/lib/i18n'
import styles from '~/styles/Home.module.css'

export default function Home() {
  const { t } = useTranslation('home')
  const wallets = useWallets()
  const account = useCurrentAccount()
  const { currentWallet, connectionStatus } = useCurrentWallet()
  const { mutate: disconnect } = useDisconnectWallet()

  return (
    <div className={styles.container}>
      {connectionStatus === 'connected' ? (
        <>
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{t('accountDetails')}</h2>
            <p className={styles.cardText}>
              <strong>{t('address')}:</strong> {account ? truncateAddress(account.address) : '-'}
            </p>
            <p className={styles.cardText}>
              <strong>{t('label')}:</strong> {account ? account.label || '-' : '-'}
            </p>
            <p className={styles.cardText}>
              <strong>{t('chains')}:</strong> {account ? account.chains.join(', ') : '-'}
            </p>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{t('walletDetails')}</h2>
            <p className={styles.cardText}>
              <strong>{t('name')}:</strong> {currentWallet ? currentWallet.name : '-'}
            </p>
            <p className={styles.cardText}>
              <strong>{t('version')}:</strong> {currentWallet ? currentWallet.version : '-'}
            </p>
            <p className={styles.cardText}>
              <strong>{t('chains')}:</strong> {currentWallet ? currentWallet.chains.join(', ') : '-'}
            </p>
          </div>

          <div className={styles.card}>
            <h2 className={styles.cardTitle}>{t('installedWallets')}</h2>
            {wallets.length === 0 ? (
              <p className={styles.cardText}>{t('noWalletsInstalled')}</p>
            ) : (
              <ul className={styles.walletList}>
                {wallets.map((wallet) => (
                  <li key={wallet.name} className={styles.walletItem}>
                    <Image src={wallet.icon} alt={`${wallet.name} Icon`} width={24} height={24} />
                    {wallet.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <button onClick={() => disconnect()} className={styles.disconnectButton}>
            {t('disconnect')}
          </button>
        </>
      ) : (
        <p className={styles.connectMessage}>{t('connectMessage')}</p>
      )}
    </div>
  )
}
