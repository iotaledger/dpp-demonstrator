import { createNetworkConfig, IotaClientProvider, WalletProvider } from '@iota/dapp-kit'
import { getFullnodeUrl } from '@iota/iota-sdk/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { AppProps } from 'next/app'
import Head from 'next/head'

import Layout from '~/components/layout'
import { useTranslation } from '~/lib/i18n'

import '@iota/dapp-kit/dist/index.css'
import '@fontsource-variable/inter'
import '~/styles/globals.css'

const queryClient = new QueryClient()

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
  localnet: { url: getFullnodeUrl('localnet') },
  testnet: { url: getFullnodeUrl('testnet') },
})

function App({ Component, pageProps }: AppProps) {
  const { t } = useTranslation('meta')

  return (
    <QueryClientProvider client={queryClient}>
      <IotaClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <Head>
            <title>{t('title')}</title>
            <meta name="description" content={t('description')} />

            <meta property="og:type" content="website" key="ogType" />
            <meta property="og:title" content={t('title')} key="ogTitle" />
            <meta property="og:description" content={t('description')} key="ogDescription" />

            <meta property="twitter:card" content="summary_large_image" key="twitterCardSummary" />
            <meta property="twitter:title" content={t('title')} key="twitterCardTitle" />
            <meta property="twitter:description" content={t('description')} key="twitterCardDescription" />
            <link rel="icon" href="/favicon.png" />
          </Head>

          <Layout>
            <Component {...pageProps} />
          </Layout>
        </WalletProvider>
      </IotaClientProvider>
    </QueryClientProvider>
  )
}

export default App
