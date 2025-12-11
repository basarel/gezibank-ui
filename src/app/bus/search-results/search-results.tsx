'use client'

import React from 'react'
import { BusSearchItem } from './components/search-item'
import {
  Accordion,
  Alert,
  Button,
  Checkbox,
  CloseButton,
  Collapse,
  Container,
  Drawer,
  NativeSelect,
  rem,
  RemoveScroll,
  Skeleton,
  Spoiler,
  Stack,
  Title,
  Transition,
  UnstyledButton,
} from '@mantine/core'
import { useState, useEffect } from 'react'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { useTransitionRouter } from 'next-view-transitions'
import { createSerializer, useQueryStates } from 'nuqs'

import { useSearchRequest } from '@/app/bus/useSearchResults'
import {
  BusGender,
  BusSearchResultItem,
  Seat,
  SeatColors,
} from '@/app/bus/types'
import { BusFrame } from '@/app/bus/search-results/components/bus-frame'
import { reservationParsers } from '@/app/reservation/searchParams'
import {
  busSearchParams,
  filterParsers,
  serializeBusSearchParams,
  SortOrderEnums,
} from '@/modules/bus/searchParams'
import { useFilterActions } from './filter-actions'
import { cleanObj } from '@/libs/util'
import { PriceNumberFlow } from '@/components/price-numberflow'
import { FaCheck } from 'react-icons/fa'
import { TripDetail } from '@/app/bus/search-results/components/trip-detail'
import { BusSearchPrevNextButtons } from './components/bus-change-days'
import dayjs from 'dayjs'
import { BusSearchEngine } from '@/modules/bus'
import { IoSearchSharp } from 'react-icons/io5'
import { FaArrowRightLong } from 'react-icons/fa6'
import { MdDirectionsBus } from 'react-icons/md'
import { useDestinationGetBySlug } from '@/hooks/destination'
import { LoaderBanner } from '@/app/hotel/search-results/components/loader-banner'
import { getContent } from '@/libs/cms-data'
import { CmsContent, Widgets } from '@/types/cms-types'
import { useQuery } from '@tanstack/react-query'
import { Params } from '@/app/car/types'
import { NotFoundForm } from '@/app/hotel/(detail)/[slug]/_components/no-rooms-form'
import { SearchCopyCode } from '@/components/search-copy-code'
import Breadcrumb from '@/app/breadcrumb'

const BusSearchResults: React.FC = () => {
  const [{ order, ...filterParams }, setFilterParams] =
    useQueryStates(filterParsers)
  const [filterSectionIsOpened, setFilterSectionIsOpened] = useState(false)
  const isBreakPointMatchesMd = useMediaQuery('(min-width: 62em)')
  const [
    isSearchEngineOpened,
    { toggle: toggleSearchEngineVisibility, close: closeSearchEngine },
  ] = useDisclosure(false)

  const { data: cmsData } = useQuery({
    queryKey: ['cms-data', 'otobus-arama'],
    queryFn: () =>
      getContent<CmsContent<Widgets, Params>>('otobus-arama').then(
        (response) => response?.data
      ),
  })
  const loaderBannerBus =
    cmsData?.widgets?.filter((x) => x.point === 'loader_banner_bus_react') ?? []
  const searchCopyCode =
    cmsData?.widgets?.filter((x) => x.point === 'bus_camp_banner_react') ?? []

  const {
    searchRequestQuery,
    useSeatControlMutation,
    useBusSeatMutation,
    useBusSearchInitPaymentProcess,
    searchToken,
    sessionToken,
  } = useSearchRequest()

  const seatRequestMutation = useBusSeatMutation()
  const seatControlMutation = useSeatControlMutation()
  const initBusPaymentProcess = useBusSearchInitPaymentProcess()

  const seatData = seatRequestMutation.data
  const routeInfos = seatRequestMutation.data?.routeInfos
  const router = useTransitionRouter()
  const [seatSelectIsOpened, { open: openSeatSelect, close: closeSeatSelect }] =
    useDisclosure(false)
  const [selectedBus, setSelectedBus] = useState<BusSearchResultItem | null>()
  const [selectedSeats, setSelectedSeatsData] = useState<Seat[]>([])

  if (
    searchRequestQuery.hasNextPage &&
    !searchRequestQuery.isFetchingNextPage
  ) {
    searchRequestQuery.fetchNextPage()
  }

  const handleBusSeatSelect = (bus: BusSearchResultItem) => {
    setSelectedBus(bus)
    openSeatSelect()

    seatRequestMutation.mutate(bus.key)
  }

  const handleCheckSeatStatus = async () => {
    const productKey = selectedBus?.key

    if (productKey) {
      const response = await seatControlMutation.mutateAsync({
        selectedSeats: selectedSeats.map((seat, paxId) => ({
          ...seat,
          paxId: paxId + 1,
        })),
        productKey,
      })

      if (response) {
        const resParams = createSerializer(reservationParsers)

        const paymentResponse =
          await initBusPaymentProcess.mutateAsync(productKey)

        if (paymentResponse?.busJourney && paymentResponse.busJourney.key) {
          const url = resParams('/reservation', {
            productKey: paymentResponse?.busJourney.key,
            searchToken,
            sessionToken,
          })

          router.push(url)
        }
      }

      setSelectedSeatsData([])
    }
  }
  const searchResultPages = searchRequestQuery.data?.pages
  const hasSearchResult = !(
    !searchRequestQuery.isLoading &&
    !searchRequestQuery.hasNextPage &&
    searchResultPages?.some((item) =>
      item?.searchResults.some((results) => results.items.length === 0)
    )
  )

  const busSearchResults = searchResultPages?.flatMap((bus) => {
    return bus?.searchResults.flatMap((result) => result.items)
  }) as BusSearchResultItem[] | null
  const busSearchResultsForFilter = searchResultPages?.flatMap((bus) => {
    return bus?.searchResults.flatMap((result) => result.items)
  }) as BusSearchResultItem[] | null

  const filteredSearchResults = useFilterActions(
    busSearchResultsForFilter ?? []
  )

  const busTypeChecks = [
    ...new Set(busSearchResults?.map((bus) => bus.busType)),
  ]
  const destinationChecks =
    busSearchResults?.map((bus) => ({
      id: bus.destinationId,
      label: bus.destination,
    })) ?? []

  const originChecks =
    busSearchResults?.map((bus) => ({
      id: bus.originId,
      label: bus.origin,
    })) ?? []

  const companyIdChecks =
    busSearchResults?.map((bus) => ({
      id: bus.companyId,
      label: bus.company,
    })) ?? []
  const totalCount = busSearchResults?.length ?? 0
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
      label: 'Kalkış Saati Erkenden Geçe',
      value: SortOrderEnums.hourAsc,
    },
  ]
  const [searchParamsBus] = useQueryStates(busSearchParams)
  useEffect(() => {
    return () => closeSearchEngine()
  }, [closeSearchEngine, searchToken])
  const destinationInfoQuery = useDestinationGetBySlug({
    slugs: [
      searchParamsBus?.originSlug as string,
      searchParamsBus?.destinationSlug as string,
    ],
    moduleName: 'Bus',
  })

  const handlePrevDay = () => {
    const currentDate = searchParamsBus.date
    if (currentDate) {
      const prevDate = dayjs(currentDate).subtract(1, 'day')
      const today = dayjs().startOf('day')
      if (prevDate.isBefore(today)) {
        return
      }
      const url = serializeBusSearchParams('/bus/search-results', {
        ...searchParamsBus,
        date: prevDate.toDate(),
      })
      router.push(url)
    }
  }
  const handleNextDay = () => {
    const currentDate = searchParamsBus.date
    if (currentDate) {
      const nextDate = dayjs(currentDate).add(1, 'day')
      const url = serializeBusSearchParams('/bus/search-results/', {
        ...searchParamsBus,
        date: nextDate.toDate(),
      })
      router.push(url)
    }
  }
  const busDates = dayjs(searchParamsBus.date).format('DD MMM YYYY')
  const destination = destinationInfoQuery.data.find(
    (destination) =>
      destination?.Result.Slug === searchParamsBus.destinationSlug
  )?.Result.Name
  return (
    <>
      <div className='border-b py-0 md:py-4'>
        <Container>
          <div className='relative flex items-center gap-2 py-2 text-xs md:hidden'>
            <button
              className='absolute start-0 end-0 top-0 bottom-0 z-10'
              onClick={toggleSearchEngineVisibility}
            />
            <Skeleton
              h={17}
              w={'65%'}
              pos={'absolute'}
              visible={destinationInfoQuery.pending}
            />
            <div className='grid items-center'>
              <div className='flex items-center gap-2 font-medium'>
                <div>
                  {
                    destinationInfoQuery.data.find(
                      (destination) =>
                        destination?.Result.Slug === searchParamsBus.originSlug
                    )?.Result.Name
                  }
                </div>
                <div>
                  <FaArrowRightLong className='text-blue-800' />
                </div>
                <div>
                  {
                    destinationInfoQuery.data.find(
                      (destination) =>
                        destination?.Result.Slug ===
                        searchParamsBus.destinationSlug
                    )?.Result.Name
                  }
                </div>
              </div>
              <div>{dayjs(searchParamsBus.date).format('DD MMMM')}</div>
            </div>
            <div className='z-0 ms-auto rounded-md bg-blue-100 p-2'>
              <IoSearchSharp size={24} className='text-blue-800' />
            </div>
          </div>
          <Collapse in={isBreakPointMatchesMd || isSearchEngineOpened}>
            <div className='py-3 md:py-0'>
              <BusSearchEngine />
            </div>
          </Collapse>
        </Container>
      </div>

      <div className='relative'>
        {searchRequestQuery.isLoading ||
          (searchRequestQuery.isFetching && (
            <div className='absolute start-0 end-0 top-0'>
              <Skeleton h={5} title='Seferler sorgulanıyor' />
            </div>
          ))}
        <div className='@container pt-5'>
          <Container>
            {totalCount === 0 ||
            searchRequestQuery.isLoading ||
            searchRequestQuery.isFetching ? (
              <div className='mb-3 hidden items-center gap-2 md:flex'>
                <Skeleton h={20} w={100} />
                <Skeleton h={20} w={100} />
                <Skeleton h={20} w={150} />
              </div>
            ) : (
              <div className='mb-4 hidden md:block'>
                <Breadcrumb
                  items={[
                    { title: 'Otobüs', href: '/otobus' },
                    {
                      title: `${
                        destinationInfoQuery.data.find(
                          (destination) =>
                            destination?.Result.Slug ===
                            searchParamsBus.originSlug
                        )?.Result.Name
                      } - ${
                        destinationInfoQuery.data.find(
                          (destination) =>
                            destination?.Result.Slug ===
                            searchParamsBus.destinationSlug
                        )?.Result.Name
                      } Seferleri`,
                    },
                  ]}
                />
              </div>
            )}
            <div className='grid items-start gap-0 pb-10 md:grid-cols-4 md:gap-6 md:pb-20'>
              <div className='md:col-span-1'>
                <div>
                  <Transition
                    transition={'slide-right'}
                    mounted={filterSectionIsOpened || !!isBreakPointMatchesMd}
                  >
                    {(styles) => (
                      <RemoveScroll
                        enabled={
                          filterSectionIsOpened && !isBreakPointMatchesMd
                        }
                      >
                        <div
                          className='fixed start-0 end-0 top-0 bottom-0 z-10 overflow-y-auto bg-white p-3 md:static md:p-0'
                          style={styles}
                        >
                          <div className='flex justify-end md:hidden'>
                            <CloseButton
                              onClick={() => setFilterSectionIsOpened(false)}
                            />
                          </div>
                          {totalCount === 0 ||
                          searchRequestQuery.isLoading ||
                          searchRequestQuery.isFetching ? (
                            <div className='rounded-lg bg-white p-2'>
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
                            <>
                              <div className='flex justify-between px-3 md:px-0'>
                                <Title
                                  className='text-xl font-medium'
                                  mb={rem(20)}
                                >
                                  Filtreler
                                </Title>

                                <div
                                  hidden={
                                    Object.keys(cleanObj(filterParams))
                                      .length === 0
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
                              <Accordion
                                multiple
                                defaultValue={[
                                  'busType',
                                  'origin',
                                  'destination',
                                  'companies',
                                ]}
                                classNames={{
                                  root: 'filter-accordion',
                                  control: 'text-md font-medium',
                                }}
                              >
                                <Accordion.Item value='busType'>
                                  <Accordion.Control>
                                    Oturma Düzeni{' '}
                                  </Accordion.Control>
                                  <Accordion.Panel>
                                    <Checkbox.Group
                                      onChange={(values) => {
                                        setFilterParams({
                                          type: values.length ? values : null,
                                        })
                                      }}
                                      value={
                                        filterParams.type
                                          ? filterParams.type
                                          : []
                                      }
                                    >
                                      <Stack gap={rem(6)}>
                                        {busTypeChecks.map(
                                          (item, itemIndex) => {
                                            return (
                                              <Checkbox
                                                key={itemIndex}
                                                label={item}
                                                value={item}
                                              />
                                            )
                                          }
                                        )}
                                      </Stack>
                                    </Checkbox.Group>
                                  </Accordion.Panel>
                                </Accordion.Item>
                                <Accordion.Item value='origin'>
                                  <Accordion.Control>
                                    Kalkış Noktası
                                  </Accordion.Control>
                                  <Accordion.Panel>
                                    <Checkbox.Group
                                      onChange={(values) => {
                                        setFilterParams({
                                          origin: values.length ? values : null,
                                        })
                                      }}
                                      value={
                                        filterParams.origin
                                          ? filterParams.origin
                                          : []
                                      }
                                    >
                                      <Stack gap={rem(6)}>
                                        {originChecks
                                          .filter(
                                            (item, itemIndex, itemArr) =>
                                              itemArr.findIndex(
                                                (item2) => item.id === item2.id
                                              ) === itemIndex
                                          )
                                          .sort((a, b) =>
                                            a.label.localeCompare(b.label)
                                          )
                                          .map((item, itemIndex) => {
                                            return (
                                              <Checkbox
                                                key={itemIndex}
                                                label={item.label}
                                                value={item.id.toString()}
                                              />
                                            )
                                          })}
                                      </Stack>
                                    </Checkbox.Group>
                                  </Accordion.Panel>
                                </Accordion.Item>
                                <Accordion.Item value='destination'>
                                  <Accordion.Control>
                                    Varış Noktası
                                  </Accordion.Control>
                                  <Accordion.Panel>
                                    <Checkbox.Group
                                      onChange={(values) => {
                                        setFilterParams({
                                          destination: values.length
                                            ? values
                                            : null,
                                        })
                                      }}
                                      value={
                                        filterParams.destination
                                          ? filterParams.destination
                                          : []
                                      }
                                    >
                                      <Stack gap={rem(6)}>
                                        {destinationChecks
                                          .filter(
                                            (item, itemIndex, itemArr) =>
                                              itemArr.findIndex(
                                                (item2) => item.id === item2.id
                                              ) === itemIndex
                                          )
                                          .map((item, itemIndex) => {
                                            return (
                                              <Checkbox
                                                key={itemIndex}
                                                label={item.label}
                                                value={item.id.toString()}
                                              />
                                            )
                                          })}
                                      </Stack>
                                    </Checkbox.Group>
                                  </Accordion.Panel>
                                </Accordion.Item>
                                <Accordion.Item value='companies'>
                                  <Accordion.Control>
                                    Firmalar
                                  </Accordion.Control>
                                  <Accordion.Panel>
                                    <Checkbox.Group
                                      onChange={(values) => {
                                        setFilterParams({
                                          company: values.length
                                            ? values
                                            : null,
                                        })
                                      }}
                                      value={
                                        filterParams.company
                                          ? filterParams.company
                                          : []
                                      }
                                    >
                                      <Stack gap={rem(6)}>
                                        <Spoiler
                                          maxHeight={220}
                                          showLabel={'Daha Fazla Göster'}
                                          hideLabel={'Daha Az Göster'}
                                        >
                                          {companyIdChecks
                                            ?.filter(
                                              (item, itemIndex, itemArr) =>
                                                itemArr.findIndex(
                                                  (item2) =>
                                                    item.id === item2.id
                                                ) === itemIndex
                                            )
                                            .sort((a, b) =>
                                              a.label.localeCompare(b.label)
                                            )
                                            .map((item, itemIndex) => {
                                              return (
                                                <Checkbox
                                                  className='my-1'
                                                  key={itemIndex}
                                                  label={item.label}
                                                  value={item.id.toString()}
                                                />
                                              )
                                            })}
                                        </Spoiler>
                                      </Stack>
                                    </Checkbox.Group>
                                  </Accordion.Panel>
                                </Accordion.Item>
                              </Accordion>
                            </>
                          )}
                        </div>
                      </RemoveScroll>
                    )}
                  </Transition>
                </div>
              </div>
              <div className='md:col-span-3'>
                <SearchCopyCode data={searchCopyCode} />
                <Skeleton
                  className='my-2'
                  visible={searchRequestQuery.isFetching}
                >
                  <div className='my-2 flex items-center justify-between'>
                    <Button
                      size='sm'
                      radius={'md'}
                      color='black'
                      className='border-gray-400 px-8 font-medium md:hidden'
                      variant='outline'
                      onClick={() => setFilterSectionIsOpened((prev) => !prev)}
                    >
                      Filtreler
                    </Button>
                    <Skeleton
                      className='md:hidden'
                      visible={searchRequestQuery.isFetching}
                    >
                      <div>
                        <NativeSelect
                          leftSection={<FaCheck />}
                          radius={'md'}
                          className='ms-auto w-50 font-medium md:w-auto'
                          size='sm'
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
                              label: 'Kalkış Saatine Erkenden Geçe',
                              value: SortOrderEnums.hourAsc,
                            },
                          ]}
                          value={order}
                          onChange={({ currentTarget: { value } }) => {
                            setFilterParams({
                              order: value as SortOrderEnums,
                            })
                          }}
                        />
                      </div>
                    </Skeleton>
                    {totalCount > 1 && (
                      <div className='my-2 hidden items-center gap-1 md:flex'>
                        <div className='text-lg font-bold'>{destination}</div>
                        için, {totalCount} Sefer Bulundu
                      </div>
                    )}
                  </div>
                </Skeleton>
                <div className='flex items-center gap-2'>
                  {totalCount > 0 && (
                    <Skeleton
                      className='hidden items-center gap-1 md:grid md:grid-cols-3'
                      visible={searchRequestQuery.isFetching}
                    >
                      {filterOptions.map((option) => (
                        <Button
                          size='sm'
                          className={
                            order === option.value
                              ? 'rounded-md border-0 bg-blue-200 font-normal text-blue-700'
                              : 'rounded-md border-gray-400 font-normal text-black hover:bg-blue-50 hover:text-blue-700'
                          }
                          key={option.value}
                          leftSection={
                            order === option.value ? <FaCheck /> : ''
                          }
                          color='blue'
                          variant={
                            order === option.value ? 'filled' : 'outline'
                          }
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
                </div>
                <Skeleton
                  className='my-3 flex items-center gap-2'
                  visible={
                    totalCount === 0 ||
                    searchRequestQuery.isLoading ||
                    searchRequestQuery.isFetching
                  }
                >
                  <div className='flex items-center gap-2 md:hidden'>
                    <span className='text-sm'>
                      Toplam,{' '}
                      <span className='text-lg font-bold'>{totalCount}</span>{' '}
                      Otobüs Seferi Bulundu
                    </span>{' '}
                  </div>
                </Skeleton>
                {totalCount > 0 && (
                  <Skeleton visible={searchRequestQuery.isFetching}>
                    <BusSearchPrevNextButtons
                      busDates={busDates}
                      handlePrevDay={handlePrevDay}
                      handleNextDay={handleNextDay}
                    />
                  </Skeleton>
                )}
                <div className='grid gap-4 pt-4'>
                  {!hasSearchResult && !searchRequestQuery.isFetching ? (
                    <NotFoundForm moduleName='Otobüs' />
                  ) : (
                    <>
                      {searchToken &&
                        sessionToken &&
                        !searchRequestQuery.isFetching &&
                        filteredSearchResults.length === 0 && (
                          <NotFoundForm moduleName='Otobüs' />
                        )}
                      {totalCount === 0 ||
                      searchRequestQuery.isLoading ||
                      searchRequestQuery.isFetching ? (
                        <>
                          <React.Fragment>
                            <LoaderBanner
                              data={loaderBannerBus}
                              moduleName='Otobüsler'
                              Icon={MdDirectionsBus}
                            />
                          </React.Fragment>
                          <div className='space-y-4'>
                            {Array.from({ length: 6 }).map((_, index) => (
                              <div
                                key={index}
                                className='mb-4 rounded-lg border-2 p-4'
                              >
                                <div className='flex gap-4'>
                                  <Skeleton
                                    height={120}
                                    width={120}
                                    radius='md'
                                  />
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
                      ) : (
                        <div className='grid gap-4'>
                          {filteredSearchResults?.map((searchItem) => (
                            <BusSearchItem
                              key={searchItem.key}
                              searchItem={searchItem}
                              onSelect={handleBusSeatSelect}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>
      <Drawer
        position='right'
        opened={seatSelectIsOpened}
        onClose={() => {
          if (seatControlMutation.isPending || initBusPaymentProcess.isPending)
            return
          setSelectedSeatsData([])
          setSelectedBus(null)

          closeSeatSelect()
        }}
        title={
          <div className='text-lg font-semibold'> {selectedBus?.company}</div>
        }
        radius={'lg'}
        overlayProps={{ backgroundOpacity: 0.5, blur: 4 }}
      >
        <div className='flex justify-evenly gap-4 pb-3 text-xs leading-none'>
          <div className='flex items-center gap-2'>
            <div>
              <div
                className='inline-block size-[20px] items-center justify-center rounded-t-lg border-t border-r border-b-4 border-l border-gray-600 border-b-gray-600 pt-1'
                style={{ backgroundColor: `var(${SeatColors.MALE})` }}
              ></div>
            </div>
            <span>Erkek (Dolu)</span>
          </div>
          <div className='flex items-center gap-2'>
            <div>
              <div
                className='inline-block size-[20px] items-center justify-center rounded-t-lg border-t border-r border-b-4 border-l border-gray-600 border-b-gray-600 pt-1'
                style={{ backgroundColor: `var(${SeatColors.WOMAN})` }}
              ></div>
            </div>
            <span>Kadın (Dolu)</span>
          </div>
          <div className='flex items-center gap-2'>
            <div>
              <div
                className='inline-block size-[20px] items-center justify-center rounded-t-lg border-t border-r border-b-4 border-l border-gray-600 border-b-gray-600 pt-1'
                style={{ backgroundColor: `var(${SeatColors.AVAILABLE})` }}
              ></div>
            </div>
            <span>Boş Koltuk</span>
          </div>
          <div className='flex items-center gap-2'>
            <div>
              <div
                className='inline-block size-[20px] items-center justify-center rounded-t-lg border-t border-r border-b-4 border-l border-gray-600 border-b-gray-600 pt-1'
                style={{ backgroundColor: `var(${SeatColors.SELECTED})` }}
              ></div>
            </div>
            <span>Seçilen Koltuk</span>
          </div>
        </div>
        <div className='font-nromal flex justify-center text-center text-blue-800'>
          <TripDetail routeInfos={routeInfos} />
        </div>

        {seatRequestMutation.isPending ? (
          <Skeleton h={600} w={'75%'} radius={'xl'} mx='auto' />
        ) : null}
        {seatData?.seats.length ? (
          <>
            <div className='relative h-[calc(100vh-180px)] overflow-hidden'>
              <div className='h-full overflow-auto px-4 pb-[100px]'>
                <BusFrame
                  seats={seatData.seats}
                  maxSelectCountReached={selectedSeats.length === 4}
                  onSeatSelect={(gender, selectedSeatsData) => {
                    setSelectedSeatsData((prev) => {
                      const nextState =
                        gender === BusGender.EMPTY
                          ? [
                              ...prev.filter(
                                (item) => item.no !== selectedSeatsData.no
                              ),
                            ]
                          : [...prev, { ...selectedSeatsData, gender: gender }]

                      return nextState
                    })
                  }}
                />
              </div>
              <div className='fixed right-0 bottom-0 left-0 z-10 bg-white px-4 py-1 shadow-lg md:py-3'>
                <div className='flex items-center gap-3 overflow-x-auto pb-2'>
                  {selectedSeats.length === 0 ? (
                    <div>Koltuk Seçiniz</div>
                  ) : null}
                  {selectedSeats.map((seat, seatIndex) => {
                    const gender = seat.gender
                    const isMale = gender === BusGender.MALE
                    const isWoman = gender === BusGender.WOMAN

                    const backgroundColor = isMale
                      ? `var(${SeatColors.MALE})`
                      : isWoman
                        ? `var(${SeatColors.WOMAN})`
                        : ''

                    return (
                      <div
                        key={seatIndex}
                        className='flex size-[36px] items-center justify-center rounded-t-lg border-b-4 border-b-gray-600 pt-1 text-sm text-black'
                        style={{
                          backgroundColor,
                        }}
                      >
                        <div className='relative'>{seat.no}</div>
                      </div>
                    )
                  })}
                </div>
                <small className='text-dark-200'>
                  (Tek seferde en fazla 4 koltuk seçebilirsiniz)
                </small>
                <div className='flex items-center py-4'>
                  {selectedSeats.length > 0 && (
                    <div className='text-2xl font-semibold'>
                      <PriceNumberFlow
                        value={selectedSeats.reduce((a, b) => {
                          return b.totalPrice.value + a
                        }, 0)}
                      />
                    </div>
                  )}
                  <div className='ms-auto'>
                    <Button
                      disabled={!selectedSeats.length}
                      onClick={handleCheckSeatStatus}
                      loading={
                        seatControlMutation.isPending ||
                        initBusPaymentProcess.isPending
                      }
                    >
                      Onayla ve Devam Et
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          seatData?.seats.length === 0 &&
          seatRequestMutation.isSuccess && <div>No seat data</div>
        )}
      </Drawer>
    </>
  )
}

export { BusSearchResults }
