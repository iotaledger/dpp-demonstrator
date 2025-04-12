import { useEffect, useState } from 'react'
import { useCurrentAccount, useIotaClientQuery } from '@iota/dapp-kit'
import { useRouter } from 'next/router'

import DppDetails from '~/components/DppDetails'
import DppHistory from '~/components/DppHistory'
import DPPUpdatePopup from '~/components/DppUpdatePopup'
import ErrorComponent from '~/components/ErrorComponent'
import Loading from '~/components/Loading'
import RolesRequestPopup from '~/components/RolesRequestPopup'
import { Federation, getRole } from '~/lib/federation'
import { useTranslation } from '~/lib/i18n'
import { Dpp, DppData, getDppData, getFederationAddress } from '~/lib/product'
import styles from '~/styles/Dpp.module.css'

const REFRESH_INTERVAL_MS = Number(process.env.NEXT_PUBLIC_REFRESH_INTERVAL_MS) || 5000

export default function DppPage() {
  const { t } = useTranslation('dppIndex')
  const router = useRouter()
  const account = useCurrentAccount()
  const { dpp_id } = router.query
  const [userRole, setUserRole] = useState<string | undefined>(undefined)
  const [dppDetails, setDppDetails] = useState<DppData | undefined>(undefined)
  const [federationAddr, setFederationAddr] = useState('')
  const [showAddPopup, setShowAddPopup] = useState(false)
  const [showRequestPopup, setShowRequestPopup] = useState(false)
  const dppData = useIotaClientQuery('getObject', {
    id: dpp_id?.toString() || '',
    options: { showContent: true },
  })
  const federationData = useIotaClientQuery('getObject', {
    id: federationAddr,
    options: { showContent: true },
  })

  useEffect(() => {
    const interval = setInterval(() => {
      federationData.refetch()
      dppData.refetch()
    }, REFRESH_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [federationData, dppData])

  useEffect(() => {
    if (dppData.isFetched && dppData.data?.data?.content) {
      const dppContent = dppData.data.data.content as Dpp
      setDppDetails(getDppData(dppContent))
      setFederationAddr(getFederationAddress(dppContent) || '')
      sessionStorage.setItem('dppContent', JSON.stringify(dppContent))
    }
  }, [dppData.isFetched, dppData.data])

  useEffect(() => {
    if (federationData.isFetched && federationData.data?.data?.content && account?.address) {
      const federationContent = federationData.data.data.content as unknown as Federation
      setUserRole(getRole(federationContent, account.address) || undefined)
      sessionStorage.setItem('federationContent', JSON.stringify(federationContent))
    }
  }, [federationData.isFetched, federationData.data, account?.address])

  if (!dppData.isFetched) {
    return <Loading />
  }

  if (!dppData.data) {
    return <ErrorComponent message={t('errorMessage')} />
  }

  function ManagerBox() {
    if (!account?.address) return null
    if (userRole !== undefined) {
      return (
        <div className={styles.addDppCard}>
          <p className="text-title-md">{`${t('certified')} ${userRole}`}</p>
          <p className="text-body-md-dark">{t('certifiedDescription')}</p>
          <button className={styles.addButton} onClick={() => setShowAddPopup(true)}>
            <p className={styles.addButtonText}>{t('addButton')}</p>
          </button>
        </div>
      )
    }

    return (
      <div className={styles.requestPermissionCard}>
        <p className="text-title-md">{t('dppManager')}</p>
        <p className="text-body-md-dark">{t('permissionDescription')}</p>
        <button className={styles.requestButton} onClick={() => setShowRequestPopup(true)}>
          <p className="text-label-md">{t('permissionButton')}</p>
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen w-full mx-auto">
      <main className="flex-1 w-full px-4 py-4 overflow-y-auto">
        <div className="flex items-center justify-between min-w-[250px]">
          <ManagerBox />
        </div>
        <div>
          <div>
            <DppDetails dppData={dppDetails} />
          </div>
          <div>
            <DppHistory dppId={String(dpp_id || '')} />
          </div>
        </div>
      </main>
      {showAddPopup && <DPPUpdatePopup onClose={() => setShowAddPopup(false)} />}
      {showRequestPopup && (
        <RolesRequestPopup
          federationAddr={federationAddr}
          urlRole="/role-request"
          onClose={() => setShowRequestPopup(false)}
        />
      )}
    </div>
  )
}
