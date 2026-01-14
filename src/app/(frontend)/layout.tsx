import { ColorSchemeScript, mantineHtmlProps, MantineProvider } from '@mantine/core'
import Script from 'next/script'
import '@/app/(frontend)/styles/global.css'
import type { Metadata, Viewport } from 'next'
 import dayjs from 'dayjs'
import 'dayjs/locale/tr'
 import Header from '@/components/header'
import { Footer } from '@/components/footer'
import { Suspense } from 'react'
import { Notifications } from '@mantine/notifications'
import { GTMListener } from '@/components/gtm-listener'
import { getGlobalHeader } from '@/libs/payload'
import { ClientProviders } from '@/client-providers'
import { Providers } from '@/providers'
import { mantineTheme } from './styles/mantine'

dayjs.locale('tr')

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
  let globalHeader = null
  try {
    globalHeader = await getGlobalHeader()
  } catch (error) {
    console.error('Failed to fetch global header:', error)
  }

  const gtmId = process.env.NEXT_PUBLIC_GTM_ID

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
      <body suppressHydrationWarning>
        <div className='frontend-app flex flex-col' suppressHydrationWarning>
          <ClientProviders>
            <Suspense fallback={null}>
              <GTMListener />
            </Suspense>
            <MantineProvider theme={mantineTheme} forceColorScheme='light'>
              <Providers>
                <Notifications />

                <div className='shrink-0 grow-0'>
                  <Header headerContent={globalHeader} />
                </div>
                <main className='grow'>{children}</main>

                <div className='shrink-0 grow-0 pt-4 md:pt-10'>
                  <Footer />
                </div>
              </Providers>
            </MantineProvider>
          </ClientProviders>
        </div>
      </body>
    </html>
  )
}
