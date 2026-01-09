import { ColorSchemeScript, mantineHtmlProps } from '@mantine/core'
import Script from 'next/script'
import '@/styles/global.css'
import type { Metadata, Viewport } from 'next'
import { headers } from 'next/headers'

export const metadata: Metadata = {
  title: process.env.APP_TITLE || 'Gezibank - Seyahatin En İyileri',
  description: `Seyahat planı yapmadan biraz ilham almaya ne dersiniz? Seyahatin En İyilerini sizin için topluyoruz.`,
  metadataBase: new URL('https://www.gezibank.com'),
  alternates: {
    canonical: './',
  },
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: 'only light',
  themeColor: '#fff',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const pathname =
    headersList.get('x-pathname') || headersList.get('referer') || ''
  const isPayloadRoute =
    pathname.includes('/admin') || pathname.includes('/api')

  const gtmId = process.env.NEXT_PUBLIC_GTM_ID
  if (isPayloadRoute) {
    return <>{children}</>
  }
  return (
    <html lang='tr' {...mantineHtmlProps} suppressHydrationWarning>
      <head>
        {process.env.NODE_ENV === 'production' && (
          <Script
            src='https://cdn.onesignal.com/sdks/OneSignalSDK.js'
            strategy='afterInteractive'
            async
          />
        )}
        {gtmId && (
          <Script id='gtm-script' strategy='afterInteractive'>
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');
            `}
          </Script>
        )}
        <ColorSchemeScript forceColorScheme='light' />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  )
}
