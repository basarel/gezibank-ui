namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    NEXT_PUBLIC_SERVICE_PATH: string
    NEXT_PUBLIC_APP_NAME: string
    NEXT_PUBLIC_SCOPE_CODE: string
    NEXT_PUBLIC_OL_ROUTE: string
    NEXT_PUBLIC_SECURITY_ROUTE: string
    NEXT_PUBLIC_SECURE_STRING: string
    NEXT_PUBLIC_DEVICE_ID: string
    NEXT_PUBLIC_GET_SESSION_TOKEN: string
    NEXT_PUBLIC_SCOPE_NAME: string
    NEXT_PUBLIC_API_GW_ROUTE: string
    NEXT_PUBLIC_API_DESTINATION_ROUTE: string
    NEXT_PUBLIC_API_GW_KEY: string
    NEXT_PUBLIC_HOTEL_SOCKET_URL: string
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string
    NEXT_PUBLIC_CMS_CDN: string
    NEXT_PUBLIC_CMS_SITE_CDN: string
    NEXT_PUBLIC_GTM_ID: string
    NEXT_PUBLIC_ONESIGNAL_APP_ID: string
    NEXT_PUBLIC_ONESIGNAL_APP_ID_PREPROD: string
    NEXT_PUBLIC_ONESIGNAL_APP_ID_PROD: string
    NEXT_PUBLIC_ENVIRONMENT: string
    // server envs
    CMS_CDN: string
    API_GW_ROUTE: string
    API_DESTINATION_ROUTE: string
    SERVICE_PATH: string
    APP_NAME: string
    SCOPE_CODE: string
    OL_ROUTE: string
    SECURITY_ROUTE: string
    SECURE_STRING: string
    DEVICE_ID: string
    GET_SESSION_TOKEN: string
    SCOPE_NAME: string
    API_GW_KEY: string
    APP_TITLE: string
    RESEND_API_KEY: string
    CMS_SITE_CDN: string
    EMAIL_FROM: string
    SITE_URL: string
    GTM_ID: string
    AUTH_GOOGLE_SECRET: string
    AUTH_GOOGLE_ID: string
    AUTH_FACEBOOK_APPID: string
    AUTH_FACEBOOK_SECRET: string
  }
}

declare module '@next/third-parties/google' {
  import type { JSX } from 'react'

  export interface GoogleTagManagerProps {
    gtmId: string
    gtmScriptUrl?: string
    dataLayer?: unknown
    dataLayerName?: string
    auth?: string
    preview?: string
  }

  export const GoogleTagManager: (props: GoogleTagManagerProps) => JSX.Element

  export function sendGTMEvent<T extends Record<string, unknown>>(
    event: T
  ): void
}
