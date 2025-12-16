import { MantineProvider, Skeleton } from '@mantine/core'
import { ClientProviders } from '@/app/client-providers'
import dayjs from 'dayjs'
import 'dayjs/locale/tr'
import { Providers } from '@/app/providers'
import { mantineTheme } from '@/styles/mantine'
import Header from '@/components/header'
import { Footer } from '@/components/footer'
import { Suspense } from 'react'
import { Notifications } from '@mantine/notifications'
import { GTMListener } from '@/components/gtm-listener'
import { getGlobalHeader } from '@/libs/payload'

dayjs.locale('tr')

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

  return (
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
            <Suspense fallback={null}>
              <div className='shrink-0 grow-0 pt-4 md:pt-10'>
                <Footer />
              </div>
            </Suspense>
          </Providers>
        </MantineProvider>
      </ClientProviders>
    </div>
  )
}
