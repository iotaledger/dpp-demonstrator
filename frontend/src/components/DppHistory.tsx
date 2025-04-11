import React, { useEffect, useState } from 'react'
import { Link as LinkIcon } from '@iota/apps-ui-icons'
import { useIotaClientQuery } from '@iota/dapp-kit'
import Link from 'next/link'

import { truncateAddress } from '~/helpers'
import fromPosixMsToUtcString from '~/helpers/fromPosixMsToUtcString'
import { DppEntry, ProductEntriesParser, Result } from '~/lib/dppHistory'
import { useTranslation } from '~/lib/i18n'
import styles from '~/styles/DppHistory.module.css'

const NEXT_PUBLIC_EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL
const REFRESH_INTERVAL_MS = 5000
const LIMIT = 20

interface DppHistoryProps {
  dppId: string
}

export default function DppHistory({ dppId }: DppHistoryProps) {
  const { t } = useTranslation('dppHistory')
  const [historyList, setHistoryList] = useState<DppEntry[]>([])

  const parser = new ProductEntriesParser()

  const dppHistoryData = useIotaClientQuery('getOwnedObjects', {
    owner: dppId,
    filter: {
      MatchNone: [{ StructType: '0x2::coin::Coin' }],
    },
    cursor: undefined,
    limit: LIMIT,
    options: {
      showContent: true,
    },
  })

  useEffect(() => {
    if (!dppHistoryData.data) return
    parser.parseResponse(dppHistoryData.data as unknown as Result)

    setHistoryList(parser.entries)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dppHistoryData.data])

  useEffect(() => {
    const interval = setInterval(() => {
      dppHistoryData.refetch()
    }, REFRESH_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [dppHistoryData])

  return (
    <div className={styles.detailsCard}>
      <p className="text-title-lg">{t('title')}</p>
      <p className="text-body-md-grey">{t('updates')}</p>

      {historyList.map((entry) => (
        <div key={entry.objectId} className={`${styles.detailsBox}`}>
          {Object.entries(entry.entryData).map(([k, v]) => (
            <div key={k} className="flex items-center gap-2 mb-2">
              <p className="text-title-xs shrink-0"> {v as string} </p>
              <p className={`text-label-md ${styles.dppTypeBox}`}> {k} </p>
            </div>
          ))}
          <p className="text-body-md-grey">{`${t('objectId')} `} </p>
          <Link
            href={`${NEXT_PUBLIC_EXPLORER_URL}/object/${entry.objectId}`}
            target="_blank"
            className="inline-flex items-center text-link hover:underline"
          >
            {truncateAddress(entry.objectId)} <LinkIcon />
          </Link>

          <p className="text-body-md-grey">{`${t('issuer')} `}</p>
          <Link
            href={`${NEXT_PUBLIC_EXPLORER_URL}/address/${entry.objectId}`}
            target="_blank"
            className="inline-flex items-center text-link hover:underline"
          >
            {truncateAddress(entry.issuerAddr)} <LinkIcon />
          </Link>

          <p className="text-body-md-grey">{t('timestamp')}</p>
          <p className="text-body-md-dark">{fromPosixMsToUtcString(entry.timestamp)}</p>
        </div>
      ))}
    </div>
  )
}
