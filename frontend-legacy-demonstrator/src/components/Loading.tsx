import React, { useEffect, useState } from 'react'

export default function Loading() {
  const [showSpinner, setShowSpinner] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  if (!showSpinner) return null

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-6 h-6 border-4 border-blue-500 border-t-transparent animate-spin rounded-full" />
    </div>
  )
}
