'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import { useTranslation } from '~/lib/i18n'

export default function DynamicRedirect() {
  const { t } = useTranslation('redirect')
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = searchParams.get('url')
    const net = searchParams.get('network') ?? 'iota'
    if (!url) return
    window.location.href = `nightly://v1?network=${net}&url=${url}`
  }, [searchParams])

  const manualRedirect = () => {
    const url = searchParams.get('url')
    const net = searchParams.get('network') ?? 'iota'
    if (!url) return
    window.location.href = `nightly://v1?network=${net}&url=${url}`
  }

  return (
    <div className="flex justify-center items-start w-full mb-[300px]">
      <div className="flex flex-col items-start p-6 gap-4 max-w-xl w-full bg-white rounded-2xl shadow-md mt-10">
        <h1 className="text-xl font-semibold text-gray-800">{t('redirecting')}</h1>
        <p className="text-gray-600 text-sm">{t('instructions')}</p>
        <button
          onClick={manualRedirect}
          className="mt-2 px-4 py-2 rounded-xl bg-[#37326e] text-white text-sm font-medium hover:opacity-90 transition duration-200"
        >
          {t('openButton')}
        </button>
        <Link
          href="https://nightly.app/download"
          className="text-[#37326e] text-sm underline mt-4 hover:opacity-90 transition duration-200"
          target="_blank"
        >
          {t('downloadLink')}
        </Link>
      </div>
    </div>
  )
}
