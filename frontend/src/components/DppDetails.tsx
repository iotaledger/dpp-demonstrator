import React, { useState } from 'react'
import { ArrowDown, ArrowUp, Link as LinkIcon } from '@iota/apps-ui-icons'
import Link from 'next/link'

import { truncateAddress } from '~/helpers'
import fromPosixMsToUtcString from '~/helpers/fromPosixMsToUtcString'
import { useTranslation } from '~/lib/i18n'
import { DppData } from '~/lib/product'
import styles from '~/styles/DppDetails.module.css'
import Loading from './Loading'

interface DppDetailsProps {
  dppData: DppData | undefined
}

const NEXT_PUBLIC_EXPLORER_URL = process.env.NEXT_PUBLIC_EXPLORER_URL

const DppDetails: React.FC<DppDetailsProps> = ({ dppData }) => {
  const { t } = useTranslation('dppDetails')

  const [isOpen, setIsOpen] = useState(true)

  if (!dppData) {
    return <Loading />
  }

  const { objectId, imageUrl, manufacturer, serialNumber, federationAddr, timestamp, billOfMaterial, name } = dppData

  const hasBOM = Object.keys(billOfMaterial).length > 0

  return (
    <div>
      {/* 1) Image Card */}
      <div className={styles.imageCard}>
        <div className={styles.imageCardContent}>
          {imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="DPP Image" className={styles.imageCardImage} />
          )}

          <div className={styles.imageCardText}>
            <span className="flex items-center space-x-2 mb-2">
              <p className="text-body-md-grey">{t('objectId')}</p>
              <Link
                href={`${NEXT_PUBLIC_EXPLORER_URL}/object/${objectId}`}
                target="_blank"
                className="inline-flex items-center text-link hover:underline"
              >
                {truncateAddress(objectId)}
                <LinkIcon className="ml-1 w-4 h-4" />
              </Link>
            </span>
            <p className="text-title-lg">{name}</p>
          </div>
        </div>
      </div>

      {/* 2) Details Card */}
      <div className={styles.detailsCard}>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between bg-transparent border-none cursor-pointer"
        >
          <p className="text-title-lg">{t('productDetails')}</p>
          {isOpen ? <ArrowUp /> : <ArrowDown />}
        </button>

        {isOpen && (
          <>
            <div className={styles.detailsBox}>
              <p className="text-title-md">{t('details')}</p>

              <div className="mt-2">
                <div className="md:grid md:grid-cols-[200px_1fr] items-center gap-2 mb-2">
                  <p className="text-body-md-grey">{t('objectId')}</p>
                  <Link
                    href={`${NEXT_PUBLIC_EXPLORER_URL}/object/${objectId}`}
                    target="_blank"
                    className="inline-flex items-center text-link hover:underline"
                  >
                    {truncateAddress(objectId)}
                    <LinkIcon className="ml-1 w-4 h-4" />
                  </Link>
                </div>

                <div className="md:grid md:grid-cols-[200px_1fr] items-center gap-2 mb-2">
                  <p className="text-body-md-grey">{t('manufacturer')}</p>
                  <Link
                    href={`${NEXT_PUBLIC_EXPLORER_URL}/address/${manufacturer}`}
                    target="_blank"
                    className="inline-flex items-center text-link hover:underline"
                  >
                    {truncateAddress(manufacturer)}
                    <LinkIcon className="ml-1 w-4 h-4" />
                  </Link>
                </div>

                <div className="md:grid md:grid-cols-[200px_1fr] items-center gap-2 mb-2">
                  <p className="text-body-md-grey">{t('federationAddr')}</p>
                  <Link
                    href={`${NEXT_PUBLIC_EXPLORER_URL}/object/${federationAddr}`}
                    target="_blank"
                    className="inline-flex items-center text-link hover:underline"
                  >
                    {truncateAddress(federationAddr)}
                    <LinkIcon className="ml-1 w-4 h-4" />
                  </Link>
                </div>

                <div className="md:grid md:grid-cols-[200px_1fr] items-center gap-2 mb-2">
                  <p className="text-body-md-grey">{t('serialNumber')}</p>
                  <p className="text-body-md-dark">{serialNumber}</p>
                </div>

                <div className="md:grid md:grid-cols-[200px_1fr] items-center gap-2">
                  <p className="text-body-md-grey">{t('timestamp')}</p>
                  <p className="text-body-md-dark">{fromPosixMsToUtcString(timestamp)}</p>
                </div>
              </div>
            </div>
            {/* Bill of Material */}
            <div className={styles.detailsBox}>
              <p className="text-title-md">{t('billOfMaterials')}</p>
              {hasBOM ? (
                <div className="mt-2">
                  {Object.entries(billOfMaterial).map(([key, value]) => (
                    <div key={key} className="mb-2">
                      <p className="text-body-md-grey">{key}</p>
                      <p className="text-body-md-dark">{value}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-body-md-grey">{t('noBom')}</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default DppDetails
