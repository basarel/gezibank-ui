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
import { FaCheck } from 'react-icons/fa'
import { useDestinationGetBySlug } from '@/hooks/destination'
import { CruiseSearchEngine } from '@/modules/cruise'
import { TourSearchEngine } from '@/modules/tour'
import { IoSearchSharp } from 'react-icons/io5'
import dayjs from 'dayjs'
import { MdTour } from 'react-icons/md'
import { getContent } from '@/libs/cms-data'
import { CmsContent, Params, Widgets } from '@/types/cms-types'
import { useQuery } from '@tanstack/react-query'
import Breadcrumb from '@/app/breadcrumb'
import { SearchResultsLoadingSkeleton } from '@/components/search-results-loading-skeleton'
import { NotFoundForm } from '@/app/(frontend)/hotel/(detail)/[slug]/_components/no-rooms-form'

const skeltonLoader = new Array(3).fill(true)

const TourSearchResultClient = () => {
  const { searchResultsQuery, searchParamsQuery, searchParams } =
    useTourSearchResultsQuery()
  const [scroll, scrollTo] = useWindowScroll()

  const [{ order, ...filterParams }, setFilterParams] =
    useQueryStates(filterParser)

  const { data: cmsData } = useQuery({
    queryKey: ['cms-data', 'tur-arama'],
    queryFn: () =>
      getContent<CmsContent<Widgets, Params>>('tur-arama').then(
        (response) => response?.data
      ),
  })
  const loaderBannerTour =
    cmsData?.widgets?.filter((x) => x.point === 'loader_banner_tour_react') ??
    []
  const tourCampaign =
    cmsData?.widgets?.filter((x) => x.point === 'tur-search-campaign-react') ??
    []

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
          <div className='sm:col-span-4 lg:col-span-3'>
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
                          <Title className='text-xl font-medium'>
                            Filtreler
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
                              <div className='mb-2 font-medium'>
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
                            <div className='mb-2 font-medium'>Bölgeler</div>
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
                              <div className='mb-2 font-medium'>
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
                              <div className='mb-2 font-medium'>
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
                              <div className='mb-2 font-medium'>Ulaşım </div>
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
            <div className='flex justify-between gap-3 md:px-0'>
              <Skeleton
                className='hidden md:flex'
                visible={searchRequestIsLoading || !filteredData}
              >
                <div className='hidden items-center gap-2 md:flex'>
                  <div>
                    <span className='text-lg font-bold'>{destination},</span>{' '}
                    {totalCount} Tur Bulundu
                  </div>
                </div>
              </Skeleton>

              {totalCount > 0 && (
                <div>
                  <Button
                    size='sm'
                    color='black'
                    className='mx-1 flex border-gray-400 px-8 font-medium md:hidden'
                    variant='outline'
                    onClick={() => setFilterSectionIsOpened((prev) => !prev)}
                  >
                    Filtreler
                  </Button>
                </div>
              )}
              {totalCount > 0 && (
                <div className='mx-2'>
                  <NativeSelect
                    leftSection={<FaCheck />}
                    className='font-medium md:hidden'
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
            </div>
            {totalCount > 0 && (
              <Skeleton
                className='hidden items-center justify-start gap-1 md:grid md:grid-cols-4'
                visible={
                  searchRequestIsLoading ||
                  (!searchParamsQuery.isLoading && searchData?.length === 0)
                }
              >
                {filterOptions.map((option) => (
                  <Button
                    size='sm'
                    className={
                      order === option.value
                        ? 'my-3 rounded-md border-0 bg-blue-100 font-medium text-blue-600'
                        : 'rounded-md border-gray-400 font-normal text-black hover:bg-blue-50 hover:text-blue-600'
                    }
                    key={option.value}
                    leftSection={order === option.value ? <FaCheck /> : ''}
                    color='blue'
                    variant={order === option.value ? 'filled' : 'outline'}
                    onClick={() =>
                      setFilterParams({
                        order: option.value,
                      })
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </Skeleton>
            )}
            {totalCount > 0 && (
              <Skeleton
                className='flex items-center gap-2 px-1 md:hidden'
                visible={
                  searchResultsQuery.isFetching ||
                  searchResultsQuery.isLoading ||
                  !searchResultsQuery.data
                }
              >
                <span className='text-sm'>
                  <span className='text-lg font-bold'>Toplam,</span>{' '}
                  {totalCount} Tur Bulundu
                </span>
              </Skeleton>
            )}
            <div className='grid gap-5'>
              {!searchRequestIsLoading &&
                searchResultsQuery.data &&
                filteredData?.length === 0 && <NotFoundForm moduleName='Tur' />}

              {searchRequestIsLoading && (
                <>
                  <Skeleton height={200} radius='md' />

                  <div className='space-y-4'>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className='mb-4 rounded-lg border-2 p-4'>
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
                    ))}
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
