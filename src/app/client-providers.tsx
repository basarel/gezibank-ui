'use client'

import { SessionProvider } from 'next-auth/react'
import { ViewTransitions } from 'next-view-transitions'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitions>
      <SessionProvider>{children}</SessionProvider>
    </ViewTransitions>
  )
}
