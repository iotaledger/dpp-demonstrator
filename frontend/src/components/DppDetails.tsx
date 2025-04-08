import React from 'react'
import { Link as LinkIcon } from '@iota/apps-ui-icons'
import Link from 'next/link'

import { truncateAddress } from '~/helpers'
import fromPosixMsToUtcString from '~/helpers/fromPosixMsToUtcString'
import { useTranslation } from '~/lib/i18n'
import { DppData } from '~/lib/product'

interface DppDetailsProps {
  dppData: DppData | undefined
}

const NEXT_PUBLIC_EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL

const DppDetails: React.FC<DppDetailsProps> = ({ dppData }) => {
  const { t } = useTranslation('dppDetails')

  if (!dppData) {
    return <div>Loading...</div>
  }

  const { objectId, imageUrl, manufacturer, serialNumber, federationAddr, timestamp, billOfMaterial } = dppData

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">{t('title')}</h2>

      {/* Layout immagine + dettagli */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Se imageUrl è definito, mostriamo l'immagine */}
        {imageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="DPP Image" className="h-auto max-w-[200px] object-contain rounded shadow" />
        )}

        {/* Dettagli principali */}
        <div className="flex-1 flex flex-col gap-2">
          <p className="text-sm">
            <span className="font-semibold">{t('objectId')}</span>{' '}
            <Link
              href={`${NEXT_PUBLIC_EXPLORER_URL}/object/${objectId}`}
              target="_blank"
              className="inline-flex items-center text-blue-600 hover:underline"
            >
              {truncateAddress(objectId)}
              <LinkIcon className="ml-1 w-4 h-4" />
            </Link>
          </p>
          <p className="text-sm">
            <span className="font-semibold">{t('manufacturer')}</span>{' '}
            <Link
              href={`${NEXT_PUBLIC_EXPLORER_URL}/address/${manufacturer}`}
              target="_blank"
              className="inline-flex items-center text-blue-600 hover:underline"
            >
              {truncateAddress(manufacturer)}
              <LinkIcon className="ml-1 w-4 h-4" />
            </Link>
          </p>
          <p className="text-sm">
            <span className="font-semibold">{t('federationAddr')}</span>{' '}
            <Link
              href={`${NEXT_PUBLIC_EXPLORER_URL}/object/${federationAddr}`}
              target="_blank"
              className="inline-flex items-center text-blue-600 hover:underline"
            >
              {truncateAddress(federationAddr)}
              <LinkIcon className="ml-1 w-4 h-4" />
            </Link>
          </p>
          <p className="text-sm">
            <span className="font-semibold">{t('serialNumber')}</span> {serialNumber}
          </p>
          <p className="text-sm">
            <span className="font-semibold">{t('timestamp')}</span> {fromPosixMsToUtcString(timestamp)}
          </p>
        </div>
      </div>

      {/* Bill of Material */}
      {Object.keys(billOfMaterial).length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-semibold mb-2">{t('billOfMaterials')}</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {Object.entries(billOfMaterial).map(([key, value]) => (
              <li key={key}>
                <span className="font-semibold">{key}:</span> {value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default DppDetails
