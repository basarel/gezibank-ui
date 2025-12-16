'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'
import { useDisclosure } from '@mantine/hooks'
import { Drawer, ScrollArea } from '@mantine/core'
import { MdDescription, MdTimer } from 'react-icons/md'

import { ReservationSummarySection } from '@/app/(frontend)/reservation/(index)/summary-section'
import { CheckoutProvider } from '../../store'
import { useCheckoutMethods } from '../../checkout-query'

import Loading from '../loading'
import { notFound } from 'next/navigation'
import { StepBar } from '@/components/step-bar'
import { IoChevronDown } from 'react-icons/io5'

export const ReservationLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false)
  const { checkoutDataQuery } = useCheckoutMethods()
  const pathname = usePathname()
  const moduleName = checkoutDataQuery.data?.data?.viewBag.ModuleName

  const stepConfig = useMemo(() => {
    const configs: Record<string, { labels: string[]; hasExtras: boolean }> = {
      CARRENTAL: {
        labels: [
          'Araç Seçimi',
          'Ekstra Ürünler ve Güvenceler',
          'Yolcu Bilgileri',
          'Ödeme',
        ],
        hasExtras: true,
      },
      TRANSFER: {
        labels: [
          'Transfer Seçimi',
          'Transfer Detayı',
          'Yolcu Bilgileri',
          'Ödeme',
        ],
        hasExtras: true,
      },
      Flight: {
        labels: ['Uçuş Seçimi', 'Yolcu Bilgileri', 'Ödeme'],
        hasExtras: false,
      },
      BUS: {
        labels: ['Otobüs Seçimi', 'Yolcu Bilgileri', 'Ödeme'],
        hasExtras: false,
      },
      HOTEL: {
        labels: ['Otel Seçimi', 'Yolcu Bilgileri', 'Ödeme'],
        hasExtras: false,
      },
      TOUR: {
        labels: ['Tur Seçimi', 'Yolcu Bilgileri', 'Ödeme'],
        hasExtras: false,
      },
      CyprusPackage: {
        labels: [
          'Kıbrıs Paketi Seçimi',
          'Ulaşım Seçenekleri',
          'Yolcu Bilgileri',
          'Ödeme',
        ],
        hasExtras: true,
      },
    }

    return (
      configs[moduleName || ''] || {
        labels: [`${moduleName} Seçimi`, 'Yolcu Bilgileri', 'Ödeme'],
        hasExtras: false,
      }
    )
  }, [moduleName])

  const stepLabelsData = useMemo(
    () => stepConfig.labels.map((label) => ({ label })),
    [stepConfig]
  )

  const activeStep = useMemo(() => {
    if (!pathname) return 1

    if (pathname.includes('/payment')) {
      return stepConfig.hasExtras ? 3 : 2
    }

    if (pathname.includes('/reservation')) {
      return stepConfig.hasExtras ? 2 : 1
    }
    return 1
  }, [pathname, stepConfig.hasExtras])

  const showLoading =
    checkoutDataQuery.isLoading ||
    checkoutDataQuery.isPending ||
    checkoutDataQuery.fetchStatus === 'fetching' ||
    !checkoutDataQuery.data ||
    !checkoutDataQuery.data.data

  if (showLoading) {
    return <Loading />
  }

  if (!checkoutDataQuery.data || checkoutDataQuery.data?.errors) {
    notFound()
  }

  const totalPrice =
    checkoutDataQuery.data?.data?.viewBag.SummaryViewDataResponser
      .summaryResponse.totalPrice

  return (
    <>
      <StepBar active={activeStep} stepLabels={stepLabelsData} />

      <CheckoutProvider totalPrice={totalPrice ?? 0}>
        <div className='grid gap-3 md:grid-cols-3 md:gap-4'>
          <div className='order-1 md:col-span-2'>{children}</div>
          <div className='sticky top-0 z-10 order-2 flex h-fit flex-col gap-3 md:order-1'>
            <div className='grid gap-5'>
              <div
                className='mb-3 flex items-center gap-5 rounded-md border bg-white p-5 text-lg font-semibold shadow-xs md:hidden md:p-4'
                role='button'
                onClick={openDrawer}
              >
                <MdDescription size={22} className='text-blue-800' />
                <div>Seyahat Özeti</div>
                <IoChevronDown size={20} className='md:hidden' />
              </div>
              <Drawer
                offset={8}
                radius='md'
                opened={drawerOpened}
                onClose={closeDrawer}
                title={
                  <div className='flex items-center gap-2'>
                    <MdDescription size={22} className='text-blue-800' />
                    <span className='text-xl font-semibold'>Seyahat Özeti</span>
                  </div>
                }
                scrollAreaComponent={ScrollArea.Autosize}
              >
                <ReservationSummarySection />
              </Drawer>
              <div className='hidden rounded-md border border-amber-400 bg-orange-50 p-2 shadow-xs md:p-4'>
                <span className='flex items-start gap-2'>
                  <MdTimer size={22} className='text-orange-800' />
                  <span>
                    Oturumun aktif kalması için ödemenizi <br />
                    <span className='px-1 font-bold text-orange-500'>
                      20 dakika
                    </span>
                    içinde tamamlayın!
                  </span>
                </span>
              </div>
              <div className='hidden md:block'>
                <ReservationSummarySection />
              </div>
            </div>
          </div>
        </div>
      </CheckoutProvider>
    </>
  )
}
