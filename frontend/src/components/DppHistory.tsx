import React, { useEffect, useState } from 'react'
import { ArrowDown, ArrowUp, Link as LinkIcon } from '@iota/apps-ui-icons'
import { useIotaClientQuery } from '@iota/dapp-kit'
import Link from 'next/link'

import fromPosixMsToUtcString from '~/helpers/fromPosixMsToUtcString'
import truncateAddress from '~/helpers/truncateAddress'
import { DppEntry, ProductEntriesParser, Result } from '~/lib/dppHistory'
import { useTranslation } from '~/lib/i18n'
import styles from '~/styles/DppHistory.module.css'

const NEXT_PUBLIC_EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL
const NEXT_PUBLIC_NETWORK = process.env.NEXT_PUBLIC_NETWORK
const REFRESH_INTERVAL_MS = 5000
const LIMIT = 20

interface DppHistoryProps {
  dppId: string
}

export default function DppHistory({ dppId }: DppHistoryProps) {
  const { t } = useTranslation('dppHistory')
  const [historyList, setHistoryList] = useState<DppEntry[]>([])
  const [isOpen, setIsOpen] = useState(true)
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
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between bg-transparent border-none cursor-pointer"
      >
        <div className="flex flex-col items-start">
          <p className="text-title-lg">{t('title')}</p>
          <p className="text-body-md-grey">{t('updates')}</p>
        </div>
        {isOpen ? <ArrowUp /> : <ArrowDown />}
      </button>

      {isOpen && (
        <div>
          {historyList.map((entry) => (
            <div key={entry.objectId} className={styles.detailsBox}>
              {Object.entries(entry.entryData).map(([k, v]) => (
                <div key={k} className="grid grid-cols-[190px_1fr] items-center gap-2 mb-2 w-full">
                  <p className="text-title-xs break-words">{v as string}</p>
                  <p className={`text-label-md ${styles.dppTypeBox}`}>{k}</p>
                </div>
              ))}

              <div className="md:grid md:grid-cols-[200px_1fr] items-center gap-2 mt-2">
                <p className="text-body-md-grey">{t('objectId')}</p>
                <Link
                  href={`${NEXT_PUBLIC_EXPLORER_URL}/object/${entry.objectId}?network=${NEXT_PUBLIC_NETWORK}`}
                  target="_blank"
                  className="inline-flex items-center text-link hover:underline"
                >
                  {truncateAddress(entry.objectId)}
                  <LinkIcon />
                </Link>
              </div>

              <div className="md:grid md:grid-cols-[200px_1fr] items-center gap-2 mt-2">
                <p className="text-body-md-grey">{t('issuer')}</p>
                <Link
                  href={`${NEXT_PUBLIC_EXPLORER_URL}/address/${entry.issuerAddr}?network=${NEXT_PUBLIC_NETWORK}`}
                  target="_blank"
                  className="inline-flex items-center text-link hover:underline"
                >
                  {truncateAddress(entry.issuerAddr)}
                  <LinkIcon />
                </Link>
              </div>

              <div className="md:grid md:grid-cols-[200px_1fr] items-center gap-2 mt-2">
                <p className="text-body-md-grey">{t('timestamp')}</p>
                <p className="text-body-md-dark">{fromPosixMsToUtcString(entry.timestamp)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
