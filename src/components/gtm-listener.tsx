'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
  }
}

export function GTMListener() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = location.pathname + location.search
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'pageview', page: url })
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = pathname + (searchParams?.toString() ? `?${searchParams}` : '')
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({ event: 'pageview', page: url })
  }, [pathname, searchParams])

  return null
}
