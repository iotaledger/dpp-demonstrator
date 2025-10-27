import React, { useEffect, useRef, useState } from 'react'
import { CheckmarkFilled, Warning } from '@iota/apps-ui-icons'
import Link from 'next/link'

import fromDidToExplorerLink from '~/helpers/fromDidToExplorerLink'
import truncateDid from '~/helpers/truncateDid'
import { useTranslation } from '~/lib/i18n'
import { VerifyDomainLinkageResponse } from '~/lib/identity'

interface DomainLinkageStatusProps {
  did: string
}

const DAPP_URL = process.env.NEXT_PUBLIC_DAPP_URL

const DomainLinkageStatus: React.FC<DomainLinkageStatusProps> = ({ did }) => {
  const [status, setStatus] = useState<VerifyDomainLinkageResponse | undefined>(undefined)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation('domainLinkageStatus')

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        setTooltipVisible(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (!did) return

    const verify = async () => {
      try {
        const response = await fetch('/api/verify-domain-linkage', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ did }),
        })

        if (response.ok) {
          const json = (await response.json()) as VerifyDomainLinkageResponse
          setStatus(json)
        } else {
          // eslint-disable-next-line no-console
          console.error('Verification failed')
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error verifying domain linkage:', err)
      }
    }

    verify()
  }, [did])

  if (!status) return null

  const isVerified = status.fromDidCheck && status.fromDomainCheck
  const wellKnownUrl = `${DAPP_URL}/.well-known/did-configuration.json`

  return (
    <div className="relative inline-block" ref={tooltipRef}>
      <button
        type="button"
        onClick={() => setTooltipVisible((prev) => !prev)}
        className={`flex items-center space-x-1 text-link hover:underline${
          isVerified ? '' : 'text-orange-500'
        } hover:underline focus:outline-none`}
      >
        <span>{truncateDid(did)}</span>
        {isVerified ? <CheckmarkFilled className="w-4 h-4" /> : <Warning className="w-4 h-4" />}
      </button>

      {tooltipVisible && (
        <div className="absolute z-10 bg-black text-white text-xs rounded px-3 py-2 w-72 top-full left-1/2 -translate-x-1/2 mt-2 shadow-lg">
          <div className="font-semibold mb-1">{t('tooltipTitle')}</div>
          <ul className="space-y-2">
            <li className="flex items-start space-x-1">
              {status.fromDidCheck ? (
                <CheckmarkFilled className="w-4 h-4 mt-0.5 text-green-400" />
              ) : (
                <Warning className="w-4 h-4 mt-0.5 text-orange-400" />
              )}
              <div>
                <strong>{t('fromDidCheckLabel')}:</strong>{' '}
                {status.fromDidCheck ? (
                  <Link href={fromDidToExplorerLink(did)} target="_blank" className="underline text-blue-300">
                    {t('fromDidCheckSuccess')}
                  </Link>
                ) : (
                  t('fromDidCheckFail')
                )}
              </div>
            </li>

            <li className="flex items-start space-x-1">
              {status.fromDomainCheck ? (
                <CheckmarkFilled className="w-4 h-4 mt-0.5 text-green-400" />
              ) : (
                <Warning className="w-4 h-4 mt-0.5 text-orange-400" />
              )}
              <div>
                <strong>{t('fromDomainCheckLabel')}:</strong>{' '}
                {status.fromDomainCheck ? (
                  <Link href={wellKnownUrl} target="_blank" className="underline text-blue-300">
                    {t('fromDomainCheckSuccess')}
                  </Link>
                ) : (
                  t('fromDomainCheckFail')
                )}
              </div>
            </li>
          </ul>
          <p className="mt-2 text-gray-300">{t('explanation')}</p>
        </div>
      )}
    </div>
  )
}

export default DomainLinkageStatus
