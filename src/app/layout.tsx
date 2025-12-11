import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from '@mantine/core'
import Script from 'next/script'
import '@/styles/global.css'

import type { Metadata, Viewport } from 'next'
import { SessionProvider } from 'next-auth/react'

import { ViewTransitions } from 'next-view-transitions'

import dayjs from 'dayjs'
import 'dayjs/locale/tr'
import { Providers } from '@/app/providers'
import { mantineTheme } from '@/styles/mantine'

import Header from '@/components/header'
import { Footer } from '@/components/footer'
import { Suspense } from 'react'
import { Notifications } from '@mantine/notifications'
import { GTMListener } from '@/components/gtm-listener'
import { OneSignalProvider } from '@/components/onesignal-provider'
dayjs.locale('tr')

export const metadata: Metadata = {
  title: process.env.APP_TITLE,
  description: `Seyahat planı yapmadan biraz ilham almaya ne dersiniz? Seyahatin En İyilerini sizin için topluyoruz.`,
  metadataBase: new URL('https://www.gezibank.com'),
  alternates: {
    canonical: './',
  },
  icons: [{ rel: 'icon', url: '/favicon.png' }],
}
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  colorScheme: 'only light',
  themeColor: '#fff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ViewTransitions>
      <SessionProvider>
        <html lang='tr' {...mantineHtmlProps}>
          <head>
            <Script
              src='https://cdn.onesignal.com/sdks/OneSignalSDK.js'
              strategy='afterInteractive'
              async
            />
            <Script id='gtm-script' strategy='afterInteractive'>
              {`
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
              `}
            </Script>
            <ColorSchemeScript forceColorScheme='light' />
          </head>

          <body className='flex flex-col'>
            <Suspense>
              <GTMListener />
            </Suspense>
            {process.env.NODE_ENV === 'production' && (
              <Suspense>
                <OneSignalProvider />
              </Suspense>
            )}
            <noscript>
              <iframe
                src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
                height='0'
                width='0'
                style={{ display: 'none', visibility: 'hidden' }}
              ></iframe>
            </noscript>
            <MantineProvider theme={mantineTheme} forceColorScheme='light'>
              <Providers>
                <Notifications />

                <div className='shrink-0 grow-0'>
                  <Header />
                </div>
                <main className='grow'>{children}</main>
                <Suspense>
                  <div className='shrink-0 grow-0 pt-4 md:pt-10'>
                    <Footer />
                  </div>
                </Suspense>
              </Providers>
            </MantineProvider>
          </body>
        </html>
      </SessionProvider>
    </ViewTransitions>
  )
}
