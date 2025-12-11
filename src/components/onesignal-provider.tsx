'use client'

import { useEffect } from 'react'
import OneSignal from 'react-onesignal'

export function OneSignalProvider() {
  useEffect(() => {
    const isPreprod = process.env.NEXT_PUBLIC_ENVIRONMENT === 'preprod'

    const appId = isPreprod
      ? process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID_PREPROD
      : process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID_PROD

    const initConfig: Parameters<typeof OneSignal.init>[0] = {
      appId: appId,
      allowLocalhostAsSecureOrigin: process.env.NODE_ENV !== 'production',
      autoRegister: true,
      autoResubscribe: true,
    }

    if (isPreprod) {
      initConfig.welcomeNotification = {
        title: 'GeziBank',
        message: 'İzin Verdiğiniz İçin Teşekkür Ederiz!',
      }
    } else {
      initConfig.welcomeNotification = {
        disable: true,
        message: '',
        title: '',
      }
    }

    OneSignal.init(initConfig).catch(() => {})

    if (typeof window !== 'undefined') {
      ;(window as Window & { OneSignal: typeof OneSignal }).OneSignal =
        OneSignal
    }
  }, [])

  return null
}
