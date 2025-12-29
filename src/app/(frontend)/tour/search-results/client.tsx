'use client'

import {
  ActionIcon,
  Affix,
  Alert,
  Button,
  Checkbox,
  CloseButton,
  Collapse,
  Container,
  NativeSelect,
  rem,
  RemoveScroll,
  ScrollArea,
  Skeleton,
  Stack,
  Title,
  Transition,
  UnstyledButton,
} from '@mantine/core'

import { useTourSearchResultsQuery } from '@/app/(frontend)/tour/search-results/useSearchResults'

import { TourSearchResultItem } from './item'
import { filterParser, SortOrderEnums } from '@/modules/tour/searchResultParams'
import { useQueryStates } from 'nuqs'
import { useFilterActions } from './useFilteractions'
import {
  TourSearchResultGroupedItem,
  TourSearchResultSearchItem,
} from '@/modules/tour/type'
import { useDisclosure, useMediaQuery, useWindowScroll } from '@mantine/hooks'
import { GoMoveToTop } from 'react-icons/go'
import { useMemo, useState, useEffect } from 'react'
import { PriceRangeSlider } from './_components/price-range-slider'
import { cleanObj, formatCurrency, slugify } from '@/libs/util'
import { FaCheck, FaArrowDown, FaArrowUp } from 'react-icons/fa'
import { TbCalendar, TbWalk } from 'react-icons/tb'
import { useDestinationGetBySlug } from '@/hooks/destination'
import { CruiseSearchEngine } from '@/modules/cruise'
import { TourSearchEngine } from '@/modules/tour'
import { IoSearchSharp } from 'react-icons/io5'
import dayjs from 'dayjs'
import { MdTour } from 'react-icons/md'
import { useQuery } from '@tanstack/react-query'
import { type SearchCampaign, type SearchLoaderBanner } from '@/libs/payload'
import Breadcrumb from '@/app/breadcrumb'
import { SearchResultsLoadingSkeleton } from '@/components/search-results-loading-skeleton'
import { NotFoundForm } from '@/app/(frontend)/hotel/(detail)/[slug]/_components/no-rooms-form'
import { LoaderBanner } from './loader-banner'

const TourSearchResultClient = () => {
  const { searchResultsQuery, searchParamsQuery, searchParams } =
    useTourSearchResultsQuery()
  const [scroll, scrollTo] = useWindowScroll()

  const [{ order, ...filterParams }, setFilterParams] =
    useQueryStates(filterParser)

  const { data: searchDataPayload } = useQuery({
    queryKey: ['search-data', 'payload'],
    queryFn: async () => {
      const response = await fetch(
        '/api/search?where[active][equals]=true&sort=ordering&limit=1&depth=1'
      )
      if (!response.ok) {
        throw new Error('Failed to fetch search data')
      }
      const data = await response.json()
      return data.docs?.[0] || null
    },
  })

  const tourCampaign = searchDataPayload?.campaigns ?? []
  const loaderBanners: SearchLoaderBanner[] = searchDataPayload?.loaderBanners ?? []

  const searchRequestIsLoading =
    searchResultsQuery.isLoading || searchResultsQuery.hasNextPage

  if (
    searchResultsQuery.hasNextPage &&
    !searchResultsQuery.isFetchingNextPage
  ) {
    searchResultsQuery.fetchNextPage()
  }

  const searchData = useMemo(
    () =>
      searchResultsQuery.data?.pages
        ?.flatMap((page) =>
          page?.data?.searchResults
            ?.filter((item) => item.items && item.items?.length > 0)
            .flatMap((item) => item.items)
        )
        .filter(Boolean) as TourSearchResultSearchItem[],
    [searchResultsQuery.data?.pages]
  )
  const firstTourFromData = searchData?.[0]
  const firstTourFromQuery = searchResultsQuery.data?.pages?.[0]?.data?.searchResults?.[0]?.items?.[0]
  const firstTour = firstTourFromData || firstTourFromQuery
  
  const filteredLoaderBanner = loaderBanners.length > 0 && firstTour
    ? (() => {
        const matchingBanner = loaderBanners.find((banner: SearchLoaderBanner) => {
          if (banner.active === false) return false
          
          if (firstTour.isDomestic) {
            return banner.viewCountry === '1'
          } else {
            return banner.viewCountry === '0'
          }
        })
        return matchingBanner || null
      })()
    : null

  const groupTitles: string[] = []
  const searchGroupedData: (TourSearchResultGroupedItem | undefined)[] =
    searchData
      ?.map((item, itemIndex, itemArr) => {
        if (!item) return
        if (groupTitles.includes(item.region.title.trim())) {
          return
        }

        groupTitles.push(item.region.title.trim())
        let filteredRelatedItems = itemArr.filter(
          (relatedItem) =>
            relatedItem?.region.title.trim() === item.region.title.trim()
        )
        if (filterParams.tourCities && filterParams.tourCities.length > 0) {
          filteredRelatedItems = filteredRelatedItems.filter((relatedItem) =>
            relatedItem?.cities?.some((tourCity) =>
              filterParams.tourCities?.includes(tourCity.code ?? '')
            )
          )
        }
        if (
          filterParams.departurePoints &&
          filterParams.departurePoints.length > 0
        ) {
          filteredRelatedItems = filteredRelatedItems.filter((relatedItem) =>
            relatedItem?.departurePoints?.some((departurePoint) =>
              filterParams.departurePoints?.includes(departurePoint.code ?? '')
            )
          )
        }
        if (
          filterParams.transportType &&
          filterParams.transportType.length > 0
        ) {
          filteredRelatedItems = filteredRelatedItems.filter((relatedItem) => {
            const transportTypeStr =
              relatedItem?.transportType?.toString() ?? ''
            return filterParams.transportType?.includes(transportTypeStr)
          })
        }

        return {
          ...item,
          relatedItems: filteredRelatedItems,
        }
      })
      .filter(Boolean)

  const minPrice =
    searchData && searchData.length
      ? Math.min(...searchData?.map((item) => item?.tlPrice.value))
      : 0

  const maxPrice =
    searchData && searchData.length
      ? Math.max(...searchData?.map((item) => item?.tlPrice.value))
      : 0

  const nightCountChecks = [
    ...new Set(
      searchData?.map((tourData) => {
        return tourData.tourTime
      })
    ),
  ].sort((a, b) => a - b)

  const regionChecks = [
    ...new Set(searchData?.map((tourData) => tourData.region.title)),
  ]
    .sort()
    .filter(Boolean)

  const departurePointChecks = [
    ...new Map(
      searchData
        ?.flatMap(
          (tourData) =>
            tourData.departurePoints?.map((departurePoint) => ({
              title: departurePoint.title,
              code: departurePoint.code,
            })) || []
        )
        .map((item) => [item.code, item])
    ).values(),
  ]
    .sort((a, b) => a.code.localeCompare(b.code))
    .filter((item) => item.code)
  const tourCitiesChecks = [
    ...new Map(
      searchData
        ?.flatMap(
          (tourData) =>
            tourData.cities?.map((tourCity) => ({
              title: tourCity.title,
              code: tourCity.code,
            })) || []
        )
        .filter((item) => item.title)
        .map((item) => [item.title.trim().toLowerCase(), item])
    ).values(),
  ].sort((a, b) => a.title.localeCompare(b.title))

  const transportTypeChecks = [
    ...new Set(
      searchData?.map((tourData) => tourData.transportType).filter(Boolean)
    ),
  ]
    .sort()
    .filter(Boolean)

  const filteredData = useFilterActions(searchGroupedData)
  const [filterSectionIsOpened, setFilterSectionIsOpened] = useState(false)
  const isBreakPointMatchesMd = useMediaQuery('(min-width: 62em)')
  const [
    isSearchEngineOpened,
    { toggle: toggleSearchEngineVisibility, close: closeSearchEngine },
  ] = useDisclosure(false)
  useEffect(() => {
    return () => closeSearchEngine()
  }, [closeSearchEngine, searchParamsQuery.data])
  const filterOptions = [
    {
      label: 'Fiyata Göre Artan ',
      value: SortOrderEnums.priceAsc,
    },
    {
      label: 'Fiyata Göre Azalan',
      value: SortOrderEnums.priceDesc,
    },
    {
      label: 'En Yakın Tarih',
      value: SortOrderEnums.dateAsc,
    },
    {
      label: 'En Uzak Tarih',
      value: SortOrderEnums.dateDesc,
    },
  ]
  const destination =
    searchParamsQuery.data?.data?.params.tourSearchRequest.location.label
  const totalCount =
    filteredData?.reduce(
      (sum, group) => sum + (group?.relatedItems?.length ?? 0),
      0
    ) ?? 0

  const destinationInfoQuery = useDestinationGetBySlug({
    slugs: [searchParams.destinationSlug as string],
    moduleName: 'Tour',
  })
  if (
    !searchParamsQuery.data &&
    (searchParamsQuery.isLoading ||
      searchParamsQuery.isFetching ||
      searchParamsQuery.isRefetching)
  ) {
    return (
      <div style={{ height: '100vh' }}>
        <SearchResultsLoadingSkeleton />
      </div>
    )
  }

  if (
    !searchParamsQuery.isLoading &&
    searchData?.length === 0 &&
    searchResultsQuery.data?.pages.find((page) => page.code !== 1)
  ) {
    return (
      <Container pt={rem(20)}>
        <NotFoundForm moduleName='tur' />
        {/* <Button
          className='mx-auto mt-3 w-50'
          radius='lg'
          onClick={() => {
            searchParamsQuery.refetch()
          }}
        >
          Yeniden Sorgula
        </Button> */}
      </Container>
    )
  }

  const searchEngine = () => (
    <TourSearchEngine
      destination={{
        name: destinationInfoQuery.data.at(0)?.Result?.Name ?? '',
        slug: destinationInfoQuery.data.at(0)?.Result?.Slug ?? '',
      }}
      checkinDate={dayjs(searchParams.checkinDate).toDate()}
      checkoutDate={dayjs(searchParams.checkoutDate).toDate()}
    />
  )

  return (
    <>
      <div className='border-b py-0 md:p-5'>
        <Container>
          <div className='relative flex items-center gap-2 py-2 text-sm md:hidden'>
            <button
              className='absolute start-0 end-0 top-0 bottom-0 z-10'
              onClick={toggleSearchEngineVisibility}
            />
            <div className='grid items-center gap-1'>
              <div className='font-medium'>
                {destinationInfoQuery.data.find(
                  (destination) =>
                    destination?.Result?.Slug?.toLowerCase() ===
                    searchParams.destinationSlug?.toLowerCase()
                )?.Result.Name ?? searchParams.destinationSlug}
              </div>
              <div>
                {dayjs(searchParams.checkinDate).format('DD MMM YYYY')} -{' '}
                {dayjs(searchParams.checkoutDate).format('DD MMM YYYY')}
              </div>
            </div>
            <div className='z-0 ms-auto rounded-md bg-blue-100 p-2'>
              <IoSearchSharp size={24} className='text-blue-800' />
            </div>
          </div>
          {isBreakPointMatchesMd ? (
            <div className='py-3 md:py-0'>
              {searchParams.isCruise ? <CruiseSearchEngine /> : searchEngine()}
            </div>
          ) : (
            <Collapse in={isSearchEngineOpened}>
              <div className='py-3 md:py-0'>
                {searchParams.isCruise ? (
                  <CruiseSearchEngine />
                ) : (
                  searchEngine()
                )}
              </div>
            </Collapse>
          )}
        </Container>
      </div>
      {searchRequestIsLoading ? (
        <div className='relative'>
          <Skeleton h={6} className='absolute start-0 end-0 top-0' radius={0} />
        </div>
      ) : null}
      <Container className='px-0 py-0 sm:px-3'>
        <div className='my-3 hidden md:block'>
          <Breadcrumb
            items={[
              { title: 'Tur', href: '/tur' },
              {
                title: `${searchParamsQuery.data?.data?.params.tourSearchRequest.location.label}`,
              },
            ]}
          />
        </div>
        <div className='grid items-start gap-4 md:grid-cols-12 md:gap-6'>
          <div className='sm:col-span-4 lg:col-span-3 md:border rounded-lg md:p-3'>
            <Transition
              transition={'slide-right'}
              mounted={filterSectionIsOpened || !!isBreakPointMatchesMd}
            >
              {(styles) => (
                <RemoveScroll
                  enabled={filterSectionIsOpened && !isBreakPointMatchesMd}
                >
                  <div
                    className='fixed start-0 end-0 top-0 bottom-0 z-10 bg-white p-3 md:static md:p-0'
                    style={styles}
                  >
                    <div className='flex justify-end md:hidden'>
                      <CloseButton
                        onClick={() => setFilterSectionIsOpened(false)}
                      />
                    </div>
                    {searchRequestIsLoading || !searchResultsQuery.data ? (
                      <div className='hidden rounded-lg bg-white p-2 md:block'>
                        <Skeleton h={24} w='50%' className='mb-4' />

                        <div className='mt-3 mb-6'>
                          <Skeleton h={20} w='40%' className='mb-3' />
                          <Skeleton h={40} w='100%' />
                        </div>

                        <div className='mt-3 mb-6'>
                          <Skeleton h={20} w='55%' className='mb-3' />
                          <div className='space-y-2'>
                            {[1, 2, 3, 4].map((index) => (
                              <div
                                key={index}
                                className='flex items-center gap-2'
                              >
                                <Skeleton h={16} w={16} />
                                <Skeleton h={16} w={110} />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className='mt-3 mb-6'>
                          <Skeleton h={16} w='55%' className='mb-3' />
                          <div className='space-y-2'>
                            {[1, 2, 3, 4].map((index) => (
                              <div
                                key={index}
                                className='flex items-center gap-2'
                              >
                                <Skeleton
                                  h={16}
                                  w={16}
                                  className='rounded-full'
                                />
                                <Skeleton
                                  h={16}
                                  w={110}
                                  className='rounded-full'
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className='flex justify-between px-3 pb-6 md:px-0'>
                          <Title className='text-xl font-semibold text-blue-600'>
                           Sonuçları Filtrele
                          </Title>
                          <div
                            hidden={
                              Object.keys(cleanObj(filterParams)).length === 0
                            }
                          >
                            <UnstyledButton
                              fz='xs'
                              className='px-4 font-semibold text-blue-500'
                              onClick={() => {
                                setFilterParams(null)
                              }}
                            >
                              Temizle
                            </UnstyledButton>
                          </div>
                        </div>
                        <Stack
                          classNames={{
                            root: 'filter-accordion',
                          }}
                        >
                          <div className='py-5'>
                            <div className='flex justify-between gap-2 pb-4 text-sm text-gray-700'>
                              <div>
                                {formatCurrency(
                                  filterParams.priceRange
                                    ? filterParams.priceRange[0]
                                    : minPrice
                                )}
                              </div>
                              <div>
                                {formatCurrency(
                                  filterParams.priceRange
                                    ? filterParams.priceRange[1]
                                    : maxPrice
                                )}
                              </div>
                            </div>
                            <div className='px-3'>
                              <PriceRangeSlider
                                minPrice={Math.floor(minPrice)}
                                maxPrice={Math.ceil(maxPrice)}
                              />
                            </div>
                          </div>
                          {nightCountChecks.length > 1 && (
                            <div className='mb-5'>
                              <div className='mb-2 font-bold text-xl'>
                                Gece Sayısı{' '}
                              </div>
                              <ScrollArea.Autosize
                                mah={rem(200)}
                                type='always'
                                scrollbars='y'
                              >
                                <Checkbox.Group
                                  onChange={(value) => {
                                    setFilterParams({
                                      nightCount: value.length
                                        ? value.map(Number)
                                        : null,
                                    })
                                  }}
                                  value={
                                    filterParams.nightCount
                                      ? filterParams.nightCount.map(String)
                                      : []
                                  }
                                >
                                  <Stack gap={rem(4)} p={rem(4)}>
                                    {nightCountChecks.map((count) => (
                                      <Checkbox
                                        label={<div>{count} Gece</div>}
                                        value={count.toString()}
                                        key={count}
                                      />
                                    ))}
                                  </Stack>
                                </Checkbox.Group>
                              </ScrollArea.Autosize>
                            </div>
                          )}
                          <div className='mb-5'>
                            <div className='mb-2 font-bold text-xl'>Bölge</div>
                            <ScrollArea.Autosize
                              mah={rem(200)}
                              type='always'
                              scrollbars='y'
                            >
                              <Checkbox.Group
                                onChange={(value) => {
                                  setFilterParams({
                                    regions: value.length ? value : null,
                                  })
                                }}
                                value={
                                  filterParams.regions
                                    ? filterParams.regions
                                    : []
                                }
                              >
                                <Stack gap={rem(4)} p={rem(4)}>
                                  {regionChecks
                                    .sort((a, b) => a.localeCompare(b))
                                    .map((region, regionIndex) => (
                                      <Checkbox
                                        key={regionIndex}
                                        label={region}
                                        value={slugify(region)}
                                      />
                                    ))}
                                </Stack>
                              </Checkbox.Group>
                            </ScrollArea.Autosize>
                          </div>
                          {tourCitiesChecks.length > 0 && (
                            <div className='mb-5'>
                              <div className='mb-2 font-bold text-xl'>
                                Rota İçi Bölgeler{' '}
                              </div>
                              <ScrollArea.Autosize
                                mah={rem(200)}
                                type='always'
                                scrollbars='y'
                              >
                                <Checkbox.Group
                                  onChange={(value) => {
                                    setFilterParams({
                                      tourCities: value.length ? value : null,
                                    })
                                  }}
                                  value={
                                    filterParams.tourCities
                                      ? filterParams.tourCities
                                      : []
                                  }
                                >
                                  <Stack gap={rem(4)} p={rem(4)}>
                                    {tourCitiesChecks.map(
                                      (tourCity, tourCityIndex) => (
                                        <Checkbox
                                          key={tourCityIndex}
                                          label={tourCity.title}
                                          value={tourCity.code ?? ''}
                                        />
                                      )
                                    )}
                                  </Stack>
                                </Checkbox.Group>
                              </ScrollArea.Autosize>
                            </div>
                          )}
                          {departurePointChecks.length > 0 && (
                            <div className='mb-5'>
                              <div className='mb-2 font-bold text-xl'>
                                Kalkış Noktası{' '}
                              </div>
                              <ScrollArea.Autosize
                                mah={rem(200)}
                                type='always'
                                scrollbars='y'
                              >
                                <Checkbox.Group
                                  onChange={(value) => {
                                    setFilterParams({
                                      departurePoints: value.length
                                        ? value
                                        : null,
                                    })
                                  }}
                                  value={
                                    filterParams.departurePoints
                                      ? filterParams.departurePoints
                                      : []
                                  }
                                >
                                  <Stack gap={rem(4)} p={rem(4)}>
                                    {departurePointChecks.map(
                                      (departurePoint, departurePointIndex) => (
                                        <Checkbox
                                          key={departurePointIndex}
                                          label={departurePoint.title}
                                          value={departurePoint.code ?? ''}
                                        />
                                      )
                                    )}
                                  </Stack>
                                </Checkbox.Group>
                              </ScrollArea.Autosize>
                            </div>
                          )}
                          {transportTypeChecks.length > 0 && (
                            <div className='mb-5'>
                              <div className='mb-2 font-bold text-xl'>Ulaşım </div>
                              <ScrollArea.Autosize
                                mah={rem(150)}
                                type='always'
                                scrollbars='y'
                              >
                                <Checkbox.Group
                                  onChange={(value) => {
                                    setFilterParams({
                                      transportType: value.length
                                        ? value
                                        : null,
                                    })
                                  }}
                                  value={
                                    filterParams.transportType
                                      ? filterParams.transportType
                                      : []
                                  }
                                >
                                  <Stack gap={rem(4)} p={rem(4)}>
                                    {transportTypeChecks
                                      .sort((a, b) => a - b)
                                      .map((transportType, transportIndex) => (
                                        <Checkbox
                                          key={transportIndex}
                                          label={
                                            transportType === 1
                                              ? 'Uçak'
                                              : transportType === 2
                                                ? 'Otobüs'
                                                : transportType === 3
                                                  ? 'Tren'
                                                  : ''
                                          }
                                          value={transportType.toString()}
                                        />
                                      ))}
                                  </Stack>
                                </Checkbox.Group>
                              </ScrollArea.Autosize>
                            </div>
                          )}
                        </Stack>
                      </div>
                    )}
                  </div>
                </RemoveScroll>
              )}
            </Transition>
          </div>
          <div className='grid gap-2 sm:col-span-8 lg:col-span-9'>
            <div className='md:rounded-lg md:bg-white md:p-3 px-3 md:border'>
            <Skeleton
                visible={searchRequestIsLoading || !filteredData}
              >
            <div className='flex items-center gap-3'>              
                <h1 className='text-xl md:text-3xl font-bold text-gray-800 mb-1'>
                  {destination}
                </h1>
                <p className='text-xs md:text-base text-blue-600 font-medium'>
                  {totalCount} tur bulundu
                </p>
             </div>
              <div
                className='hidden mt-2 md:grid items-center grid-cols-4 justify-start gap-2'
                 
              >
                {filterOptions.map((option) => {
                  let icon = null
                  if (option.value === SortOrderEnums.priceAsc) {
                    icon = < FaArrowUp size={16} />
                  } else if (option.value === SortOrderEnums.priceDesc) {
                    icon = <FaArrowDown size={16} />
                  } else if (
                    option.value === SortOrderEnums.dateAsc ||
                    option.value === SortOrderEnums.dateDesc
                  ) {
                    icon = <TbCalendar size={18} />
                  }

                  return (
                    <Button
                      size='sm'
                      className={
                        order === option.value
                          ? 'rounded-md border border-blue-500 bg-blue-100 font-medium text-blue-600'
                          : 'rounded-md border border-gray-300 font-normal text-gray-700 hover:bg-gray-50 hover:border-gray-400'
                      }
                      key={option.value}
                      leftSection={icon}
                      variant='outline'
                      onClick={() =>
                        setFilterParams({
                          order: option.value,
                        })
                      }
                    >
                      {option.label}
                    </Button>
                  )
                })}
              </div>
              </Skeleton>
            </div>
            {totalCount > 0 && (
              <div className='flex justify-between items-center gap-3 md:hidden mx-3'>
                <Button
                  size='sm'
                  color='black'
                  className='flex border-gray-400 px-8 font-medium'
                  variant='outline'
                  onClick={() => setFilterSectionIsOpened((prev) => !prev)}
                >
                  Filtreler
                </Button>
                <NativeSelect
                  leftSection={<FaCheck />}
                  className='font-medium'
                  data={[
                    {
                      label: 'Fiyata Göre Artan ',
                      value: SortOrderEnums.priceAsc,
                    },
                    {
                      label: 'Fiyata Göre Azalan',
                      value: SortOrderEnums.priceDesc,
                    },
                    {
                      label: 'En Erken',
                      value: SortOrderEnums.dateAsc,
                    },
                    {
                      label: 'En Geç',
                      value: SortOrderEnums.dateDesc,
                    },
                  ]}
                  onChange={({ target: { value } }) => {
                    setFilterParams({
                      order: value as SortOrderEnums,
                    })
                  }}
                  value={order}
                />
              </div>
            )}

           
            <div className='grid gap-5'>
              {!searchParamsQuery.isLoading &&
    searchData?.length === 0 &&
    searchResultsQuery.data?.pages.find((page) => page.code !== 1)&& <NotFoundForm moduleName='Tur' />}

              {searchRequestIsLoading && (
                <>
                  <div className='space-y-4'>
                    {Array.from({ length: 6 }).map((_, index) => {
                      if (index === 0 && filteredLoaderBanner) {
                        return (
                          <LoaderBanner
                            key={`loader-banner-${index}`}
                            data={filteredLoaderBanner}
                            Icon={MdTour}
                          />
                        )
                      }
                      return (
                        <div key={index} className='mb-4 rounded-lg border p-4'>
                          <div className='flex gap-4'>
                            <Skeleton height={120} width={100} radius='md' />
                            <div className='flex-1 space-y-3'>
                              <Skeleton height={20} width='60%' />
                              <Skeleton height={16} width='40%' />
                              <Skeleton height={16} width='80%' />
                              <div className='flex gap-2'>
                                <Skeleton height={24} width={60} />
                                <Skeleton height={24} width={60} />
                                <Skeleton height={24} width={60} />
                              </div>
                              <div className='flex justify-between'>
                                <Skeleton height={20} width='30%' />
                                <Skeleton height={32} width={100} />
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}

              {!searchRequestIsLoading &&
                searchResultsQuery.data &&
                filteredData &&
                filteredData.length > 0 &&
                filteredData.map((data) => {
                  if (!data) return
                  return (
                    <TourSearchResultItem
                      data={data}
                      key={data?.key}
                      campaignContents={tourCampaign}
                    />
                  )
                })}
            </div>
          </div>
        </div>
      </Container>

      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition='slide-up' mounted={scroll.y > 500}>
          {(transitionStyles) => (
            <ActionIcon
              style={transitionStyles}
              onClick={() => {
                scrollTo({ y: 0 })
              }}
              radius={'xl'}
              variant='default'
              size={36}
            >
              <GoMoveToTop />
            </ActionIcon>
          )}
        </Transition>
      </Affix>
    </>
  )
}

export { TourSearchResultClient }
