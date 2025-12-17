'use client'

import {
  Button,
  Modal,
  Group,
  Container,
  Image,
  Title,
  Collapse,
  Alert,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useEffect, useRef, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import NumberFlow from '@number-flow/react'
import { useTransitionRouter } from 'next-view-transitions'
import { createSerializer, useQueryStates } from 'nuqs'
import { useTourDetailQuery } from './useTourDetailQuery'
import { TourDetail } from './detail-view'
import { TourDetailPriceSection } from './price-section'
import { TourSearchEngine } from '@/modules/tour'
import { serviceRequest } from '@/network'
import { TourExtraServicesApiResponse } from '@/modules/tour/type'
import { ExtraServicePanel } from './extra-services'
import { reservationParsers } from '@/app/(frontend)/reservation/searchParams'
import { tourDetailPageParamParser } from '@/modules/tour/detailSearchParams'
import { CruiseSearchEngine } from '@/modules/cruise'
import { IoCalendarClearOutline } from 'react-icons/io5'
import { MdOutlineCameraAlt, MdOutlineLocalPhone } from 'react-icons/md'
import { TourMediaGallery } from '@/app/(frontend)/tour/_components/media-gallery/media-gallery'
import TourTableOfContents from '@/app/(frontend)/tour/_components/table-of-contents'

import dayjs from 'dayjs'
import { CiMail } from 'react-icons/ci'
import { validateUrl, formatCurrency } from '@/libs/util'
import { cdnSiteImageUrl } from '@/libs/cms-data'
import { Skeleton, Stack } from '@mantine/core'
import NotFound from '@/app/(frontend)/not-found'
import Breadcrumb from '@/app/breadcrumb'
import Link from 'next/link'
import { FaInfoCircle, FaBus } from 'react-icons/fa'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { TourGeneralInformation } from './tour-general-information'
import { RiPlaneFill, RiWhatsappFill } from 'react-icons/ri'
import { TbCalendarClock } from 'react-icons/tb'
const TourDetailClient = () => {
  const router = useTransitionRouter()
  const [
    isOpenExtraServicesModal,
    { open: openExtraServicesModal, close: closeExtraServicesModal },
  ] = useDisclosure(false)
  const [searchParams, setSearchParams] = useQueryStates(
    tourDetailPageParamParser
  )

  const lastKeys = useRef({
    packageKey: '',
    calculatedId: '',
  })

  useEffect(() => {
    return () => {
      lastKeys.current = {
        calculatedId: '',
        packageKey: '',
      }
    }
  }, [])

  const detailQuery = useTourDetailQuery()

  if (
    (!searchParams.searchToken || !searchParams.sessionToken) &&
    detailQuery.data
  ) {
    setSearchParams({
      productKey: detailQuery.data?.package.key,
      searchToken: detailQuery.data?.searchToken,
      sessionToken: detailQuery.data?.sessionToken,
    })
  }

  const [passengers, setPassengers] = useState<{
    adultCount: string
    childAge?: (string | undefined)[] | undefined
  }>({
    adultCount: '2:0',
  })

  const calculateTotalPriceQuery = useMutation({
    mutationKey: [searchParams?.searchToken, searchParams?.sessionToken],
    mutationFn: async () => {
      const response = await serviceRequest<{
        value: ServicePriceType
        packageKey: string
      }>({
        axiosOptions: {
          url: `api/tour/passengerUpdate`,
          method: 'post',
          data: {
            SearchToken: searchParams?.searchToken,
            SessionToken: searchParams?.sessionToken,
            Package: lastKeys.current.packageKey
              ? lastKeys.current.packageKey
              : searchParams?.productKey,

            AdultCount: passengers.adultCount,
            ChildAges: passengers.childAge,
            CampaignCode: null,
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
        },
      })

      return response
    },
    onSuccess: (query) => {
      lastKeys.current.packageKey = query?.data?.packageKey ?? ''
    },
  })
  if (
    detailQuery.data &&
    detailQuery.isSuccess &&
    !detailQuery.isLoading &&
    calculateTotalPriceQuery.isIdle
  ) {
    calculateTotalPriceQuery.mutate()
  }

  const extraServicesMutation = useMutation({
    mutationKey: ['tour-extra-services'],
    mutationFn: async () => {
      const response = await serviceRequest<TourExtraServicesApiResponse>({
        axiosOptions: {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          url: 'api/tour/extraServices',
          method: 'post',
          data: {
            AdultCount: passengers.adultCount,
            ChildAges: passengers.childAge,
            SearchToken: searchParams.searchToken,
            SessionToken: searchParams.sessionToken,
            Package: lastKeys.current.packageKey,
          },
        },
      })

      return response
    },
    onSuccess(query) {
      lastKeys.current = {
        calculatedId: query?.data?.calculatedId ?? '',
        packageKey: query?.data?.package.key ?? '',
      }

      if (
        query?.data?.extraServices &&
        query?.data?.extraServices?.filter(
          (item) => !(item.isMandatory && item.isPackage)
        ).length > 0
      ) {
        openExtraServicesModal()
      } else {
        tourReservationQuery.mutate()
      }
    },
  })

  const addOrRemoveExtraServicesMutation = useMutation({
    mutationKey: ['tour-extra-service-update'],
    mutationFn: async (servicesAndAmounts?: string[]) => {
      const response = await serviceRequest<{
        tlPrice: ServicePriceType
        calculatedId: string
        key: string
      }>({
        axiosOptions: {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          url: 'api/tour/addRemoveExtraServices',
          method: 'post',
          data: {
            CalculateId: lastKeys.current.calculatedId,
            AdultCount: passengers.adultCount,
            ChildAges: passengers.childAge,
            SearchToken: searchParams.searchToken,
            SessionToken: searchParams.sessionToken,
            Package: lastKeys.current.packageKey,
            ExtraServicesAndAmounts:
              servicesAndAmounts || extraServicesAndAmounts,
          },
        },
      })

      return response
    },
    onSuccess: (data) => {
      lastKeys.current = {
        calculatedId: data?.data?.calculatedId ?? '',
        packageKey: data?.data?.key ?? '',
      }
    },
  })

  const tourReservationQuery = useMutation({
    mutationKey: ['tour-reservation'],
    mutationFn: async () => {
      const response = await serviceRequest<{ package: { key: string } }>({
        axiosOptions: {
          url: 'api/tour/reservation',
          method: 'post',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
          },
          data: {
            AppName: process.env.NEXT_PUBLIC_APP_NAME,
            ScopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
            ScopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
            CalculateId: lastKeys.current.calculatedId,
            Package: lastKeys.current.packageKey,
            AdultCount: passengers.adultCount,
            ChildAges: passengers.childAge?.at(0),
            SearchToken: searchParams.searchToken,
            SessionToken: searchParams.sessionToken,
          },
        },
      })

      return response
    },
    onSuccess: (data) => {
      const resParams = createSerializer(reservationParsers)

      const url = resParams('/reservation', {
        productKey: data?.data?.package.key,
        searchToken: searchParams.searchToken,
        sessionToken: searchParams.sessionToken,
      })

      router.push(url)
    },
  })

  const extraServiceKeys = extraServicesMutation.data?.data?.extraServices
    .filter((extra) => !extra.isPackage && !extra.isMandatory)
    .map((ext) => {
      return {
        key: ext.key,
        count: 0,
      }
    })

  let extraServicesAndAmounts: string[]

  const handleExtraServiceActions = (actions: {
    key: string
    count: number
  }) => {
    if (extraServiceKeys) {
      const updatedServicesAndAmounts = extraServiceKeys?.map((item) => {
        if (item.key === actions.key) {
          item.count = actions.count
        }

        return `${item.key}:${item.count}`
      })

      extraServicesAndAmounts = updatedServicesAndAmounts

      // instantly post request
      if (lastKeys.current.calculatedId && lastKeys.current.packageKey) {
        addOrRemoveExtraServicesMutation.mutate(updatedServicesAndAmounts)
      }
    }
  }

  const extraServiceAdultCount = Number(
    extraServicesMutation.data?.data?.adultCount.split(':').at(0)
  )
  const extraServiceChildCount =
    extraServicesMutation.data?.data?.childAges?.filter((num) => num >= 0)
      ?.length ?? 0
  const extraMaxCount = extraServiceAdultCount + extraServiceChildCount
  const images = detailQuery.data?.detail.images.filter(
    (item) => !item.includes('youtube')
  )
  const [galleryOpened, setGalleryOpened] = useState(false)
  const startDate = detailQuery.data?.package.startDate
  const endDate = detailQuery.data?.package.endDate
  const dayjsStartDate = dayjs(startDate)
  const dayjsEndDate = dayjs(endDate)
  const totalNights = dayjsEndDate.diff(dayjsStartDate, 'day')
  const totalDays = totalNights + 1

  // Güzergah bilgisini formatla
  const formatItinerary = () => {
    if (
      detailQuery.data?.package.cities &&
      detailQuery.data.package.cities.length > 0
    ) {
      return detailQuery.data.package.cities
        .map((city) => city.title)
        .join(' – ')
    }
    return ''
  }
  const itineraryText = formatItinerary()

  // Fiyat bilgisi
  const euroPriceValue = !detailQuery.data?.package.isDomestic
    ? detailQuery.data?.package.priceInformations?.priceForDouble?.value
    : null
  const euroPriceFormatted = euroPriceValue
    ? new Intl.NumberFormat('tr-TR', {
        style: 'decimal',
        maximumFractionDigits: 0,
      }).format(euroPriceValue)
    : null

  const transportType = detailQuery.data?.package.transportType
  const transportTypeText =
    transportType === 1
      ? 'Uçaklı Tur'
      : transportType === 2
        ? 'Otobüslü Tur'
        : transportType === 3
          ? 'Trenli Tur'
          : ''
  return (
    <>
      <div className='border-b p-4'>
        <Container className='px-0'>
          {searchParams.isCruise ? (
            <CruiseSearchEngine />
          ) : (
            <TourSearchEngine />
          )}
        </Container>
      </div>
      <div className='px-0'>
        <Container className='mt-3 hidden md:block'>
          {detailQuery.data && (
            <Breadcrumb
              items={[
                { title: 'Tur', href: '/tur' },
                { title: `${detailQuery.data?.package.title}` },
              ]}
            />
          )}
        </Container>
        <div className='gap-4 py-4 lg:py-4'>
          {!detailQuery.isLoading && !detailQuery.data ? (
            <NotFound />
          ) : detailQuery.isLoading || !detailQuery.data ? (
            <Stack gap='md'>
              <Skeleton height={400} />
              <Skeleton height={200} />
              <Skeleton height={300} />
            </Stack>
          ) : detailQuery.data ? (
            <div className='relative'>
              <div className='relative flex flex-col gap-4 px-3 md:flex-row md:px-0'>
                {Array.isArray(images) && images?.at(0) && (
                  <div
                    onClick={() => setGalleryOpened(true)}
                    className='relative w-full cursor-pointer md:w-[40%]'
                  >
                    <figure className='h-full w-full'>
                      <Image
                        fallbackSrc=''
                        className='h-full w-full rounded object-cover shadow-lg'
                        src={
                          validateUrl(images?.at(0))
                            ? images?.at(0)
                            : cdnSiteImageUrl(images[0])
                        }
                        alt={detailQuery.data.package.title}
                      />
                    </figure>
                  </div>
                )}

                <div className='static hidden w-full flex-col gap-4 md:flex md:w-[60%]'>
                  <div className='grid grid-cols-2 gap-4'>
                    {images?.slice(1, 3).map((image, imageIndex) => (
                      <div
                        key={imageIndex}
                        onClick={() => setGalleryOpened(true)}
                        className='relative cursor-pointer'
                      >
                        <figure className='h-40 w-full'>
                          <Image
                            src={
                              validateUrl(image)
                                ? image
                                : cdnSiteImageUrl(image)
                            }
                            alt={detailQuery.data?.package.title}
                            className='h-full w-full rounded object-cover shadow-lg'
                          />
                        </figure>
                      </div>
                    ))}
                  </div>

                  <div className='grid grid-cols-3 gap-4'>
                    {images?.slice(3, 6).map((image, imageIndex) => (
                      <div
                        key={imageIndex + 2}
                        onClick={() => setGalleryOpened(true)}
                        className='relative cursor-pointer'
                      >
                        <figure className='h-full w-full'>
                          <Image
                            src={
                              validateUrl(image)
                                ? image
                                : cdnSiteImageUrl(image)
                            }
                            alt={detailQuery.data?.package.title}
                            className='h-full w-full rounded object-cover shadow-lg'
                          />
                        </figure>
                        {imageIndex === 2 && (
                          <div className='absolute right-2 bottom-2'>
                            <Button
                              color={'black'}
                              opacity={'.65'}
                              leftSection={<MdOutlineCameraAlt size={20} />}
                              radius={'md'}
                              size='sm'
                            >
                              Galeri ({images?.length})
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <Container className='relative z-10 mx-auto md:-mt-20 rounded-xl bg-white p-6 text-black shadow-[-10px_10px_20px_0px_rgba(0,0,0,0.25)] md:-mt-14'>
                <div className='mt-6 flex flex-col items-start justify-between gap-6 md:flex-row'>
                  <div className='flex flex-1 flex-col gap-4'>
                    <div className='flex items-start gap-3'>
                      <div className='h-full min-h-[60px] w-2 rounded bg-blue-500'></div>
                      <Title className='text-xl font-bold text-black md:text-2xl'>
                        {detailQuery.data.package.title}
                      </Title>
                    </div>

                    <div className='flex flex-col gap-6 pt-5'>
                      {itineraryText && (
                        <div className='flex gap-2'>
                          <HiOutlineLocationMarker
                            size={24}
                            className='shrink-0 text-blue-700'
                          />
                          <span className='text-sm md:text-base'>
                            {itineraryText}
                          </span>
                        </div>
                      )}

                      <div className='flex items-center gap-2'>
                        <TbCalendarClock
                          size={24}
                          className='shrink-0 text-blue-700'
                        />
                        <span className='text-sm md:text-base'>
                          {totalNights === 0
                            ? 'Günübirlik Tur'
                            : `${totalNights} Gece ${totalDays} Gün - ${totalNights} Gece Konaklamalı`}
                        </span>
                      </div>

                      {transportTypeText && (
                        <div className='flex items-center gap-2'>
                          {transportType === 1 ? (
                            <RiPlaneFill
                              size={24}
                              className='shrink-0 text-blue-700'
                            />
                          ) : (
                            <FaBus
                              size={22}
                              className='shrink-0 text-blue-700'
                            />
                          )}
                          <span className='text-sm text-orange-900 md:text-base'>
                            {transportTypeText}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className='mt-auto flex w-full flex-col items-center gap-4 md:w-auto md:items-end'>
                    {euroPriceFormatted && (
                      <div className='flex w-full flex-col items-center gap-2 md:w-auto md:items-end'>
                        <div className='text-xs text-gray-600 md:text-sm md:text-black'>
                          Çift Kişilik Oda Kişi Başı
                        </div>
                        <div className='w-full rounded-lg bg-orange-900 px-4 py-3 md:w-auto md:px-6 md:py-3'>
                          <div className='flex items-start justify-center gap-1 text-3xl font-bold text-white md:justify-start md:text-5xl'>
                            {euroPriceFormatted}
                            <span className='text-xl md:text-3xl'>€</span>
                          </div>
                        </div>
                        <div className='text-center text-xs font-medium text-gray-700 md:text-right md:text-sm md:text-black md:text-green-900'>
                          (
                          {formatCurrency(
                            detailQuery.data.package.tlPrice.value
                          )}
                          )
                        </div>
                        <div className='text-center text-xs text-gray-600 md:text-right md:text-sm md:text-black'>
                          &apos;den başlayan fiyatlar
                        </div>
                      </div>
                    )}

                    <div className='flex w-full flex-col gap-3 md:w-auto'>
                      {/* <Button
                        variant='outline'
                        color='black'
                        className='w-full md:w-auto border-black text-black hover:bg-gray-100 hover:text-blue-600'
                        leftSection={<MdOutlineCameraAlt size={18} />}
                        size='md'
                      >
                        <span className='text-sm md:text-base'>Tur Programını İndir</span>
                      </Button> */}
                      <div className='grid grid-cols-2 gap-2 rounded-lg p-2 shadow-lg md:flex md:flex-col md:p-2 md:shadow-2xl'>
                        <Link
                          href='https://wa.me/08508400151'
                          className='flex items-center justify-center gap-2 rounded-md bg-green-50 px-3 py-2 transition-colors hover:bg-green-100 md:bg-transparent md:py-2'
                        >
                          <span className='text-sm font-medium md:text-base'>
                            WhatsApp
                          </span>
                          <RiWhatsappFill
                            className='shrink-0 text-green-600 md:text-green-900'
                            size={20}
                          />
                        </Link>
                        <Link
                          href='tel:0850 840 01 51'
                          target='_blank'
                          className='flex items-center justify-center gap-2 rounded-md bg-orange-50 px-3 py-2 transition-colors hover:bg-orange-100 md:bg-transparent md:py-2'
                        >
                          <span className='text-sm font-medium md:text-base'>
                            Sizi Arayalım
                          </span>
                          <MdOutlineLocalPhone
                            className='shrink-0 text-orange-600 md:text-orange-900'
                            size={20}
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Container>

              <Container className='px-0'>
                <div className='sticky top-0 z-20 my-6 bg-orange-900 shadow-[-10px_20px_20px_0px_rgba(0,0,0,0.25)] md:rounded'>
                  <TourTableOfContents />
                </div>

                <div className='flex flex-col gap-4 py-4 md:grid md:grid-cols-12 md:grid-rows-[auto_auto] md:py-0'>
                  <div className='order-2 rounded-lg border md:order-0 md:col-span-8 md:row-span-2'>
                    <TourDetail data={detailQuery.data} />
                  </div>
                  <div className='order-1 md:col-span-4 md:col-start-9 md:row-start-1'>
                    <div className='relative flex flex-col gap-5 overflow-hidden rounded-lg border p-5 shadow-sm'>
                      <TourDetailPriceSection
                        calculatedTotalPrice={
                          addOrRemoveExtraServicesMutation.data?.data?.tlPrice
                            ?.value
                            ? addOrRemoveExtraServicesMutation.data.data.tlPrice
                                .value
                            : calculateTotalPriceQuery.data?.success &&
                                typeof calculateTotalPriceQuery.data?.data
                                  ?.value.value === 'number'
                              ? calculateTotalPriceQuery.data?.data?.value.value
                              : 0
                        }
                        data={detailQuery.data}
                        onPassengerChange={async (params) => {
                          setPassengers(params)
                          await calculateTotalPriceQuery.mutateAsync()
                        }}
                        loading={
                          calculateTotalPriceQuery.isPending ||
                          addOrRemoveExtraServicesMutation.isPending
                        }
                      />
                      <Collapse
                        in={
                          !!calculateTotalPriceQuery.data &&
                          !calculateTotalPriceQuery.data?.success &&
                          !(
                            extraServicesMutation.isPending ||
                            calculateTotalPriceQuery.isPending
                          )
                        }
                      >
                        <Alert>
                          <div className='flex flex-col gap-3 text-center text-sm font-bold text-red-800'>
                            <div className='col-span-12 flex items-center gap-2'>
                              <FaInfoCircle size={20} />
                              <span>
                                Kriterlerinize uygun müsaitlik bulunamadı.
                              </span>
                            </div>
                            <div>
                              <Link
                                className='grid grid-cols-14 text-blue-800 underline'
                                href='/iletisim'
                              >
                                {' '}
                                <CiMail
                                  className='col-span-1 justify-start'
                                  size={19}
                                />
                                <span className='col-span-12 justify-center text-center'>
                                  {' '}
                                  Çağrı merkezimizden bilgi alabilirsiniz.
                                </span>
                              </Link>
                            </div>
                            <div className=''>
                              <Link
                                className='grid grid-cols-13 items-center gap-1 text-blue-800 underline'
                                href='tel:08508780400'
                              >
                                <MdOutlineLocalPhone
                                  className='col-span-1 justify-start'
                                  size={19}
                                />
                                <span className='col-span-5'>
                                  0850 878 0 400
                                </span>
                              </Link>
                            </div>
                          </div>
                        </Alert>
                      </Collapse>
                      <Button
                        className='bg-orange-900 text-white'
                        type='button'
                        fullWidth
                        size={'lg'}
                        disabled={
                          !calculateTotalPriceQuery.data?.success ||
                          extraServicesMutation.isPending
                        }
                        loading={
                          extraServicesMutation.isPending ||
                          calculateTotalPriceQuery.isPending
                        }
                        onClick={() => {
                          extraServicesMutation.mutate()
                        }}
                      >
                        Rezervasyon Yap
                      </Button>
                    </div>
                  </div>
                  <div className='order-3 rounded-lg border p-5 shadow-sm md:col-span-4 md:col-start-9 md:row-start-2'>
                    <TourGeneralInformation
                      data={detailQuery.data}
                      transportTypeText={transportTypeText}
                    />
                  </div>
                </div>
              </Container>
            </div>
          ) : (
            <div>
              <NotFound />
            </div>
          )}
        </div>
      </div>
      <Modal
        opened={isOpenExtraServicesModal}
        onClose={closeExtraServicesModal}
        title={<Title order={3}>Ekstra Servisler</Title>}
        size='lg'
        radius='md'
        shadow='xl'
      >
        <div className='grid gap-5'>
          {extraServicesMutation.data?.data?.extraServices
            .filter((extra) => !extra.isPackage && !extra.isMandatory)
            .map((extra) => {
              return (
                <ExtraServicePanel
                  data={extra}
                  key={extra.key}
                  maxCount={extraMaxCount}
                  onChange={handleExtraServiceActions}
                />
              )
            })}
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              addOrRemoveExtraServicesMutation.isPending ||
              calculateTotalPriceQuery.isPending
                ? 'opacity-60 blur-sm'
                : 'blur-0 opacity-100'
            }`}
          >
            <div className='text-lg font-semibold'>Toplam:</div>
            <div className='text-lg font-semibold text-blue-800'>
              <NumberFlow
                format={{
                  style: 'currency',
                  currency: 'TRY',
                  currencyDisplay: 'narrowSymbol',
                }}
                value={
                  addOrRemoveExtraServicesMutation.data?.data
                    ? addOrRemoveExtraServicesMutation.data?.data.tlPrice.value
                    : (calculateTotalPriceQuery.data?.data?.value?.value ?? 0)
                }
              />
            </div>
          </div>
        </div>
        <div>
          <Group className='justify-between border-t' pt='md' mt={'md'}>
            <Button color='red' onClick={closeExtraServicesModal}>
              İptal
            </Button>
            <Button
              color='green'
              disabled={addOrRemoveExtraServicesMutation.isPending}
              onClick={() => {
                tourReservationQuery.mutate()
              }}
            >
              Rezervasyon Yap
            </Button>
          </Group>
        </div>
      </Modal>
      {images && (
        <TourMediaGallery
          images={images}
          title={detailQuery?.data?.package?.title}
          opened={galleryOpened}
          onClose={() => setGalleryOpened(false)}
        />
      )}
    </>
  )
}

export { TourDetailClient }
