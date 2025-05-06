'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

export default function Redirect() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const network = searchParams.get('network')
    const url = searchParams.get('url')

    if (!network || !url) return

    const encodedUrl = encodeURIComponent(url)
    const deeplink = `nightly://v1?network=iota&url=${encodedUrl}`

    window.location.href = deeplink
  }, [searchParams])

  const handleManualRedirect = () => {
    const network = searchParams.get('network')
    const url = searchParams.get('url')
    if (!network || !url) return
    const encodedUrl = encodeURIComponent(url)
    const deeplink = `nightly://v1?network=iota&url=${encodedUrl}`
    window.location.href = deeplink
  }

  return (
    <div className="flex justify-center items-start w-full mb-[300px]">
      <div className="flex flex-col items-start p-6 gap-4 max-w-xl w-full bg-white rounded-2xl shadow-md mt-10">
        <h1 className="text-xl font-semibold text-gray-800">Redirecting to Nightly Wallet...</h1>
        <p className="text-gray-600 text-sm">
          If nothing happens, please make sure you have the Nightly Wallet app installed.
        </p>
        <button
          onClick={handleManualRedirect}
          className="mt-2 px-4 py-2 rounded-xl bg-[#37326e] text-white text-sm font-medium hover:opacity-90 transition duration-200"
        >
          Open in Nightly Wallet
        </button>
      </div>
    </div>
  )
}
