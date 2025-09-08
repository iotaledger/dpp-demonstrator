import { ConnectButton } from '@iota/dapp-kit'
import Image from 'next/image'

import { useTranslation } from '~/lib/i18n'
import styles from '~/styles/Layout.module.css'

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { t } = useTranslation('meta')

  return (
    <div className={styles.background}>
      <header className={styles.header}>
        <Image src="/logo_header.png" alt="Header Logo" width={248} height={36} />
        <ConnectButton />
      </header>

      <main className={styles.content}>{children}</main>

      <div className={styles.footer}>
        <Image src="/logo_footer.png" alt="Footer Logo" width={137} height={36} />
        <p className="text-footer">{t('footer')}</p>
      </div>
    </div>
  )
}

export default Layout
