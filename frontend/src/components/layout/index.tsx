import { ConnectButton } from '@iota/dapp-kit'

import { useTranslation } from '~/lib/i18n'
import styles from '~/styles/Layout.module.css'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation('meta')

  return (
    <>
      <header className={styles.header}>
        <span className={styles.title}>{t('title')}</span>
        <ConnectButton />
      </header>

      <main className={styles.content}>{children}</main>
    </>
  )
}

export default Layout
