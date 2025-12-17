'use client'
import {
  TourSearchResultGroupedItem,
  TourSearchResultSearchItem,
} from '@/modules/tour/type'
import {
  AspectRatio,
  Badge,
  Box,
  Button,
  Image,
  Skeleton,
  Text,
  Title,
  Transition,
} from '@mantine/core'
import { Link } from 'next-view-transitions'

import { formatCurrency } from '@/libs/util'
import { serializeTourDetailPageParams } from '@/modules/tour/detailSearchParams'
import { useTourSearchResultsQuery } from '@/app/(frontend)/tour/search-results/useSearchResults'
import dayjs from 'dayjs'
import { useState, useEffect } from 'react'
import { TourDropdown } from './_components/dropdown'
import { useQueryStates } from 'nuqs'
import {
  tourSearchResultParamParser,
  filterParser,
} from '@/modules/tour/searchResultParams'
import { CiSun } from 'react-icons/ci'
import { Route } from 'next'
import { RiPlaneFill, RiTrainFill } from 'react-icons/ri'
import { FaBus } from 'react-icons/fa'
import { Widgets } from '@/types/cms-types'
import { BsMoonStars } from 'react-icons/bs'
import { HiOutlineLocationMarker } from 'react-icons/hi'
import { useMediaQuery } from '@mantine/hooks'
import { TbCalendarClock } from 'react-icons/tb'
type Props = {
  // data: TourSearchResultSearchItem
  data: TourSearchResultGroupedItem
  campaignContents: Widgets
}

export const TourSearchResultItem: React.FC<Props> = ({
  data,
  campaignContents,
}) => {
  const [searchParams] = useQueryStates(tourSearchResultParamParser)
  const [filterParams] = useQueryStates(filterParser)

  const sortedRelatedItems = data.relatedItems.sort((a, b) =>
    dayjs(a.startDate).diff(b.startDate)
  )

  const filteredRelatedItems = sortedRelatedItems.filter((item) => {
    if (filterParams.tourCities && filterParams.tourCities.length > 0) {
      const hasTourCity = item?.cities?.some((tourCity) =>
        filterParams.tourCities?.includes(tourCity.code ?? '')
      )
      if (!hasTourCity) return false
    }

    if (
      filterParams.departurePoints &&
      filterParams.departurePoints.length > 0
    ) {
      const hasDeparturePoint = item?.departurePoints?.some((departurePoint) =>
        filterParams.departurePoints?.includes(departurePoint.code ?? '')
      )
      if (!hasDeparturePoint) return false
    }

    // Ulaşım tipi filtresi
    if (filterParams.transportType && filterParams.transportType.length > 0) {
      const transportTypeSlug = item?.transportType?.toString() ?? ''
      const hasTransportType =
        filterParams.transportType.includes(transportTypeSlug)
      if (!hasTransportType) return false
    }

    return true
  })
  const { searchParamsQuery } = useTourSearchResultsQuery()
  const [isImageLoading, setImageLoading] = useState(true)

  // Filtrelenmiş veriden ilk item'ı seç, yoksa tüm veriden seç
  const availableItems =
    filteredRelatedItems.length > 0 ? filteredRelatedItems : sortedRelatedItems
  const [selectedTour, setSelectedTour] = useState<TourSearchResultSearchItem>(
    availableItems[0]
  )

  // Filtre değiştiğinde selectedTour'u güncelle
  useEffect(() => {
    if (availableItems.length > 0) {
      // Eğer mevcut selectedTour filtrelenmiş listede yoksa, ilk item'ı seç
      const isCurrentTourAvailable = availableItems.some(
        (item) => item.key === selectedTour.key
      )
      if (!isCurrentTourAvailable) {
        setSelectedTour(availableItems[0])
      }
    }
  }, [
    filterParams.tourCities,
    filterParams.departurePoints,
    filterParams.transportType,
    selectedTour.key,
    availableItems,
  ])
  const transportType = selectedTour.transportType
  const transportTypeText =
    transportType === 1
      ? 'Uçak'
      : transportType === 2
        ? 'Otobüs'
        : transportType === 3
          ? 'Tren'
          : ''
  const detailUrl = serializeTourDetailPageParams('/tour/detail', {
    productKey: selectedTour.key,
    slug: selectedTour.slug,
    searchToken: searchParamsQuery.data?.data?.params.searchToken,
    sessionToken: searchParamsQuery.data?.data?.sessionToken,
    isCruise: searchParams.isCruise,
  }) as Route
  const startDate = selectedTour.startDate
  const endDate = selectedTour.endDate
  const dayjsStartDate = dayjs(startDate)
  const dayjsEndDate = dayjs(endDate)
  const totalNights = dayjsEndDate.diff(dayjsStartDate, 'day')
  const totalDays = totalNights + 1

  // Format cities for itinerary display
  const formatItinerary = () => {
    if (selectedTour.cities.length === 0) return ''
    const uniqueCities = Array.from(
      new Set(selectedTour.cities.map((item) => item.title))
    )
    return uniqueCities.join(' - ')
  }

  const itineraryText = formatItinerary()
  const euroPriceValue = selectedTour.totalPrice.value

  const euroPriceFormatted = euroPriceValue
    ? new Intl.NumberFormat('tr-TR', {
        style: 'decimal',
        maximumFractionDigits: 0,
      }).format(euroPriceValue)
    : null

  const isMobile = useMediaQuery('(max-width: 62em)')
  return (
    <div className='grid grid-cols-1 rounded-lg bg-white p-3 shadow-md hover:shadow-2xl md:grid-cols-4'>
      <div className='col-span-1 flex flex-col gap-4 md:col-span-3'>
        <div className='grid grid-cols-1 gap-5 md:grid-cols-2'>
          <Box className='relative w-full' component={Link} href={detailUrl}>
            <AspectRatio ratio={4 / 3}>
              <Transition
                mounted={isImageLoading}
                transition='fade'
                duration={400}
                timingFunction='ease'
              >
                {(styles) => (
                  <div
                    style={styles}
                    className='absolute start-0 end-0 top-0 bottom-0 rounded-lg bg-white transition-opacity duration-300'
                  >
                    <Skeleton className='size-full' radius={'md'} />
                  </div>
                )}
              </Transition>
              <Image
                h='100%'
                w='100%'
                loading='lazy'
                src={selectedTour.imageUrl}
                alt={selectedTour.title}
                radius={'md'}
                fit='cover'
                className='rounded-lg'
                onLoad={() => {
                  setImageLoading(false)
                }}
              />
              {selectedTour.quota > 0 && (
                <div className='absolute start-3 top-3'>
                  <Badge className='bg-orange-900 px-4 py-3 text-white opacity-90 shadow-lg'>
                    Son {selectedTour.quota >= 7 ? '7' : selectedTour.quota}{' '}
                    kişi
                  </Badge>
                </div>
              )}
            </AspectRatio>
          </Box>

          <div className='flex flex-col gap-3'>
            <div className='relative'>
              <Title order={1} className='text-xl font-bold text-black'>
                {selectedTour.title.split('|')[0]}
              </Title>
              {selectedTour.departurePoints &&
                selectedTour.departurePoints.length > 0 && (
                  <div className='my-2 text-base font-medium text-black'>
                    {selectedTour.departurePoints
                      .map((departurePoint) => departurePoint.title)
                      .join(', ')}{' '}
                    Çıkışlı
                  </div>
                )}
            </div>
            <div className='my-3 items-center gap-2 md:hidden'>
              <TourDropdown
                data={availableItems}
                onSelect={setSelectedTour}
                defaultItem={selectedTour}
              />
            </div>
            {itineraryText && (
              <div className='flex items-start gap-1 text-sm'>
                <HiOutlineLocationMarker
                  size={23}
                  className='shrink-0 text-blue-700'
                />
                <Text className='text-sm'>{itineraryText}</Text>
              </div>
            )}

            {totalNights > 0 ? (
              <div className='flex items-center gap-1 text-sm'>
                <TbCalendarClock size={20} className='shrink-0 text-blue-700' />
                <span>
                  {totalNights} Gece {totalDays} Gün - {totalNights} Gece
                  Konaklamalı
                </span>
              </div>
            ) : (
              <div className='flex items-center gap-1 text-sm'>
                <CiSun size={25} className='shrink-0 text-blue-700' />
                <Text className='text-sm'>Günübirlik Tur</Text>
              </div>
            )}

            {campaignContents?.filter(
              (campaign) =>
                campaign.params.view_country.value ===
                String(selectedTour.isDomestic)
            ).length > 0 && (
              <div className='flex flex-wrap gap-2'>
                {campaignContents
                  ?.filter(
                    (campaign) =>
                      campaign.params.view_country.value ===
                      String(selectedTour.isDomestic)
                  )
                  .slice(0, 2)
                  .map((campaign) => (
                    <Link
                      key={campaign.id}
                      href={campaign.params.link?.value as Route}
                    >
                      <div className='rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700'>
                        {campaign.title}
                      </div>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>

        <div className='flex items-center gap-5 pt-4 text-sm'>
          {transportTypeText && (
            <div className='flex items-center gap-2'>
              {transportType === 1 && (
                <RiPlaneFill size={20} className='text-orange-700' />
              )}
              {transportType === 2 && (
                <FaBus size={18} className='text-orange-700' />
              )}
              {transportType === 3 && (
                <RiTrainFill size={18} className='text-orange-700' />
              )}
              <span>Gidiş-Dönüş: {transportTypeText} ile</span>
            </div>
          )}
          <div className='hidden items-center gap-2 md:flex'>
            <TourDropdown
              data={availableItems}
              onSelect={setSelectedTour}
              defaultItem={selectedTour}
            />
          </div>
        </div>
      </div>

      <div className='col-span-1 flex flex-col justify-between rounded-t-xl border p-3 shadow-xl'>
        <div className='mb-4 flex flex-col items-center justify-center'>
          <div className='w-full text-center'>
            <div className='mb-2 text-sm font-medium text-black'>
              Çift Kişilik Oda Kişi Başı
            </div>
            {euroPriceFormatted && (
              <div className='mb-1 flex items-center justify-center'>
                <div className='rounded-t-lg rounded-tr-lg rounded-br-lg rounded-bl-none bg-orange-900 p-3'>
                  <div className='flex items-start justify-center gap-2 text-3xl font-bold text-white md:text-5xl'>
                    {euroPriceFormatted}
                    {selectedTour.isDomestic && (
                      <span className='text-3xl'>TL</span>
                    )}
                    {!selectedTour.isDomestic && (
                      <span className='text-3xl'>€</span>
                    )}
                  </div>
                </div>
              </div>
            )}
            {!selectedTour.isDomestic && (
              <>
                <div className='text-center text-lg font-semibold text-green-800'>
                  ({formatCurrency(selectedTour.tlPrice.value)})
                </div>
              </>
            )}
            <div className='text-sm font-bold text-black md:mb-4'>
              &apos;den başlayan fiyatlar
            </div>
          </div>
        </div>
        <Button
          className='w-full rounded-tl-lg rounded-tr-lg rounded-b-lg rounded-bl-none bg-blue-600 px-0 text-lg font-extrabold hover:bg-blue-800 md:text-3xl'
          size={isMobile ? 'md' : 'lg'}
          radius={'lg'}
          component={Link}
          href={detailUrl}
          fullWidth
        >
          Turu İncele
        </Button>
      </div>
    </div>
  )
}
