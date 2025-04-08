import React, { useEffect, useState } from 'react'
import { Link as LinkIcon } from '@iota/apps-ui-icons'
import { useIotaClientQuery } from '@iota/dapp-kit'
import Link from 'next/link'

import { truncateAddress } from '~/helpers'
import fromPosixMsToUtcString from '~/helpers/fromPosixMsToUtcString'
import roleToEntryType from '~/helpers/roleToEntryType'
import { DppEntry, ProductEntriesParser, Result } from '~/lib/dppHistory'
import { useTranslation } from '~/lib/i18n'

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
    <div>
      <h2 className="text-lg font-bold mb-2">{t('title')}</h2>

      <ul className="space-y-2">
        {historyList.map((entry) => (
          <li key={entry.objectId} className="border rounded p-2">
            <p className="text-sm font-semibold">{`${t('entryType')} ${roleToEntryType(entry.issuerRole, t)}`}</p>
            {Object.entries(entry.entryData).map(([k, v]) => (
              <div key={k} className="text-sm ">
                {k}: {v as string}
              </div>
            ))}
            <p className="text-sm text-gray-600">
              {`${t('objectId')} `}
              <Link
                href={`${NEXT_PUBLIC_EXPLORER_URL}/object/${entry.objectId}`}
                target="_blank"
                className="inline-flex items-center text-blue-600 hover:underline"
              >
                {truncateAddress(entry.objectId)} <LinkIcon />
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              {`${t('issuer')} `}
              <Link
                href={`${NEXT_PUBLIC_EXPLORER_URL}/address/${entry.objectId}`}
                target="_blank"
                className="inline-flex items-center text-blue-600 hover:underline"
              >
                {truncateAddress(entry.issuerAddr)} <LinkIcon />
              </Link>
            </p>
            <p className="text-sm text-gray-600">{`${t('timestamp')} ${fromPosixMsToUtcString(entry.timestamp)}`}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
