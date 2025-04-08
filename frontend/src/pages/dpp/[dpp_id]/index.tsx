import { useEffect, useState } from 'react'
import { useCurrentAccount, useIotaClientQuery } from '@iota/dapp-kit'
import { useRouter } from 'next/router'

import DppDetails from '~/components/DppDetails'
import DppHistory from '~/components/DppHistory'
import ErrorComponent from '~/components/ErrorComponent'
import Loading from '~/components/Loading'
import { Federation, getRole } from '~/lib/federation'
import { useTranslation } from '~/lib/i18n'
import { Dpp, DppData, getDppData, getFederationAddress } from '~/lib/product'

const REFRESH_INTERVAL_MS = Number(process.env.NEXT_PUBLIC_REFRESH_INTERVAL_MS) || 5000

export default function DppPage() {
  const { t } = useTranslation('dppIndex')
  const router = useRouter()
  const account = useCurrentAccount()

  const { dpp_id } = router.query

  const [userRole, setUserRole] = useState<string | undefined>(undefined)
  const [dppDetails, setDppDetails] = useState<DppData | undefined>(undefined)
  const [federationAddr, setFederationAddr] = useState('')
  const [requestRoleLink, setRequestRoleLink] = useState('#')

  // Query: load the main DPP
  const dppData = useIotaClientQuery('getObject', {
    id: dpp_id?.toString() || '',
    options: { showContent: true },
  })

  // Query: load the federation object, if we have an address
  const federationData = useIotaClientQuery('getObject', {
    id: federationAddr,
    options: { showContent: true },
  })

  // Periodic re-fetch
  useEffect(() => {
    const interval = setInterval(() => {
      federationData.refetch()
      dppData.refetch()
    }, REFRESH_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [federationData, dppData])

  // Whenever dppData changes, parse the DPP object
  useEffect(() => {
    if (dppData.isFetched && dppData.data?.data?.content) {
      const dppContent = dppData.data.data.content as Dpp
      setDppDetails(getDppData(dppContent))
      setFederationAddr(getFederationAddress(dppContent) || '')

      sessionStorage.setItem('dppContent', JSON.stringify(dppContent))
    }
  }, [dppData.isFetched, dppData.data])

  // Whenever federation data or account changes, derive the user role
  useEffect(() => {
    if (federationData.isFetched && federationData.data?.data?.content && account?.address) {
      const federationContent = federationData.data.data.content as unknown as Federation
      setUserRole(getRole(federationContent, account.address) || undefined)

      sessionStorage.setItem('federationContent', JSON.stringify(federationContent))
    }
  }, [federationData.isFetched, federationData.data, account?.address])

  // Construct link for requesting a role if needed
  useEffect(() => {
    if (federationAddr && dpp_id) {
      setRequestRoleLink(`/roles?federation_addr=${federationAddr}&dpp_id=${dpp_id}`)
    }
  }, [federationAddr, dpp_id])

  const addDppLink = dpp_id ? `/dpp/${dpp_id}/add` : '#'

  // Show a spinner if DPP data is still loading
  if (!dppData.isFetched) {
    return <Loading />
  }

  // Handle if the DPP doesn't exist or fetch failed
  if (!dppData.data) {
    return <ErrorComponent message={t('errorMessage')} />
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 w-[80%] mx-auto">
      <main className="flex-1 w-full px-4 py-4 overflow-y-auto">
        {/* Mobile-only manager box */}
        {account?.address ? (
          <div className="block md:hidden w-full bg-white p-4 rounded shadow-sm">
            <div className="flex items-center justify-between min-w-[250px]">
              <h1 className="text-lg font-bold whitespace-normal break-words">{t('dppManager')}</h1>
              {userRole !== undefined ? (
                <a
                  href={addDppLink}
                  className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition-colors text-sm"
                >
                  {t('addButton')}
                </a>
              ) : (
                <a
                  href={requestRoleLink}
                  className="bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition-colors text-sm"
                >
                  {t('permissionButton')}
                </a>
              )}
            </div>
          </div>
        ) : (
          ''
        )}

        <div className="mt-4 space-y-6">
          <div className="bg-white p-4 rounded shadow-sm">
            <DppDetails dppData={dppDetails} />
          </div>
          <div className="bg-white p-4 rounded shadow-sm">
            <DppHistory dppId={String(dpp_id || '')} />
          </div>
        </div>
      </main>
    </div>
  )
}
