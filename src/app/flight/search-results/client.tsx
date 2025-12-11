'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  useDisclosure,
  useMediaQuery,
  useMounted,
  useScrollIntoView,
  useTimeout,
} from '@mantine/hooks'
import {
  Accordion,
  Alert,
  Box,
  Button,
  Checkbox,
  CloseButton,
  Collapse,
  Container,
  Drawer,
  Loader,
  Modal,
  rem,
  RemoveScroll,
  Skeleton,
  Stack,
  Title,
  Transition,
  UnstyledButton,
  Select,
  Spoiler,
} from '@mantine/core'
import { useQueryStates } from 'nuqs'

import dayjs from 'dayjs'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import duration from 'dayjs/plugin/duration'
import 'dayjs/locale/tr'
import { Virtuoso } from 'react-virtuoso'
import { MdOutlineAirplanemodeActive } from 'react-icons/md'
import { LuCircleCheck } from 'react-icons/lu'
import { FaArrowRightLong } from 'react-icons/fa6'
import { FaCheck, FaCheckCircle } from 'react-icons/fa'
import { IoSearchSharp } from 'react-icons/io5'
import { IoIosClose } from 'react-icons/io'
import { MdFlight } from 'react-icons/md'

import { useSearchResultsQueries } from '@/app/flight/search-queries'
import {
  AirlineCode,
  ClientDataType,
  FlightDetail,
  FlightDetailSegment,
  FlightFareInfo,
} from '@/app/flight/type'
import { MemoizedFlightSearchResultsDomestic } from '@/app/flight/search-results/domestic-flight'
import { MemoizedFlightSearchResultsInternational } from '@/app/flight/search-results/international-flight'
import { Flight as FlightSearchEngine } from '@/modules/flight'

import {
  filterParsers,
  flightSearchParams,
  SortOrderEnums,
} from '@/modules/flight/searchParams'
import { useFilterActions, extractBaggageOptions } from './filter-actions'
import { HourRangeSlider } from './components/hour-range'
import { PackageFlightDrawer } from './components/package-flight-drawer'
import { SearchPrevNextButtons } from './components/search-prev-next-buttons'
import { LoaderBanner } from '@/app/hotel/search-results/components/loader-banner'
import { getContent } from '@/libs/cms-data'
import { CmsContent, Widgets } from '@/types/cms-types'
import { useQuery } from '@tanstack/react-query'
import { Params } from '@/app/car/types'
import { AirlineLogo } from '@/components/airline-logo'
import { delayCodeExecution, formatCurrency } from '@/libs/util'
import { FlightDetailsSearch } from '../../flight/search-results/components/flight-detail'
import { NotFoundForm } from '@/app/hotel/(detail)/[slug]/_components/no-rooms-form'
import { SearchCopyCode } from '@/components/search-copy-code'
import { TbClockMinus } from 'react-icons/tb'
import Breadcrumb from '@/app/breadcrumb'
import Loading from './loading'
import { CabinClassTitle, CabinClassValue } from '@/modules/flight/types'
type SelectedPackageStateProps = {
  flightDetailSegment: FlightDetailSegment
  flightFareInfo: FlightFareInfo
  flightDetails: FlightDetail
}

dayjs.locale('tr')
dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)
dayjs.extend(duration)

const skeltonLoader = new Array(3).fill(true)

const FlightSearchView = () => {
  const [detailsOpened, { toggle: toggleDetails }] = useDisclosure(false)
  const timeoutHasEnded = useRef(false)
  const {
    start: startFlightSearchQueryTimeout,
    clear: clearFlightSearchQueryTimeout,
  } = useTimeout(
    () => {
      timeoutHasEnded.current = true
    },
    30000,
    {
      autoInvoke: true,
    }
  )
  const [searchParams, setSearchParamsFlight] =
    useQueryStates(flightSearchParams)

  const { data: cmsData } = useQuery({
    queryKey: ['cms-data', 'ucak-bilet-arama'],
    queryFn: () =>
      getContent<CmsContent<Widgets, Params>>('ucak-bilet-arama').then(
        (response) => response?.data
      ),
  })
  const loaderBannerFlight =
    cmsData?.widgets?.filter((x) => x.point === 'loader_banner_flight_react') ??
    []
  const searchCopyCode =
    cmsData?.widgets?.filter((x) => x.point === 'flight_camp_banner_react') ??
    []

  const {
    searchResultsQuery,
    searchSessionTokenQuery,
    submitFlightData,
    getAirlineByCodeList,
    getAirportsByCodeList,
    airPortFlatList,
  } = useSearchResultsQueries()

  if (
    !searchResultsQuery.isFetchingNextPage &&
    searchResultsQuery.hasNextPage &&
    !timeoutHasEnded.current
  ) {
    searchResultsQuery.fetchNextPage()
  }

  useEffect(() => {
    timeoutHasEnded.current = false
    startFlightSearchQueryTimeout()
    return () => {
      timeoutHasEnded.current = false
      clearFlightSearchQueryTimeout()
    }
  }, [
    searchParams,
    startFlightSearchQueryTimeout,
    clearFlightSearchQueryTimeout,
    searchSessionTokenQuery.data?.searchToken,
    searchSessionTokenQuery.data?.sessionToken,
  ])

  const searchQueryData = useMemo(
    () => searchResultsQuery?.data,
    [searchResultsQuery?.data]
  )

  const handlePrevDay = () => {
    // default go and return dates on searchParams
    const { departureDate, returnDate } = searchParams

    const today = dayjs().startOf('day') // compare with today

    if (isReturnFlightVisible && returnDate) {
      //  only returnDate can changable
      const currentReturnDateDayjs = dayjs(returnDate)
      const potantielPrevReturnDateDayjs = currentReturnDateDayjs.subtract(
        1,
        'day'
      )

      if (potantielPrevReturnDateDayjs.isBefore(today)) {
        return
      }

      // return date cannot be same or before from go date
      if (
        departureDate &&
        potantielPrevReturnDateDayjs.isSameOrBefore(dayjs(departureDate), 'day')
      ) {
        return
      }

      // all of everything is okey... just return date can update.
      setSearchParamsFlight({
        returnDate: potantielPrevReturnDateDayjs.toDate(),
      })
    } else if (departureDate) {
      const currentDepartureDateDayjs = dayjs(departureDate)
      const potentialPrevDepartureDateDayjs =
        currentDepartureDateDayjs.subtract(1, 'day')

      // go date before then today ?
      if (potentialPrevDepartureDateDayjs.isBefore(today)) {
        return
      }
      const DepartureDate = potentialPrevDepartureDateDayjs.toDate()
      const updates: { departureDate: Date; returnDate?: Date } = {
        departureDate: DepartureDate,
      }

      // if go flight and return flight are after or before the return date ,
      // return date will be updated to one day after go date
      if (
        returnDate &&
        potentialPrevDepartureDateDayjs.isSameOrAfter(dayjs(returnDate), 'day')
      ) {
        updates.returnDate = potentialPrevDepartureDateDayjs
          .add(1, 'day')
          .toDate()
      }
      setSearchParamsFlight(updates)
    }
  }
  const handlePrevReturnDay = () => {
    const { departureDate, returnDate } = searchParams
    if (!returnDate) return
    const today = dayjs().startOf('day')
    const newReturnDate = dayjs(returnDate).subtract(1, 'day')
    // Yeni dönüş tarihi bugünün öncesi olsmaz
    if (newReturnDate.isBefore(today)) return
    // Yeni dönüş tarihi, gidiş tarihinden önce olamaz!!!
    if (
      departureDate &&
      newReturnDate.isSameOrBefore(dayjs(departureDate), 'day')
    ) {
      return
    }
    setSearchParamsFlight({ returnDate: newReturnDate.toDate() })
  }

  const handleNextDay = () => {
    const { departureDate, returnDate } = searchParams

    if (isReturnFlightVisible && returnDate) {
      const nextReturnDate = dayjs(returnDate).add(1, 'day').toDate()
      setSearchParamsFlight({ returnDate: nextReturnDate })
    } else if (departureDate) {
      const nextDepartureDateAsDayjs = dayjs(departureDate).add(1, 'day')

      const DepartureDate = nextDepartureDateAsDayjs.toDate()
      const updates: { departureDate: Date; returnDate?: Date } = {
        departureDate: DepartureDate,
      }

      // if go flight and return flight are after or before the return date ,
      // return date will be updated to one day after go date
      if (
        returnDate &&
        nextDepartureDateAsDayjs.isSameOrAfter(dayjs(returnDate), 'day')
      ) {
        updates.returnDate = nextDepartureDateAsDayjs.add(1, 'day').toDate()
      }
      setSearchParamsFlight(updates)
    }
  }

  const handleNextReturnDay = () => {
    const { returnDate } = searchParams
    if (!returnDate) return
    const newReturnDate = dayjs(returnDate).add(1, 'day')
    setSearchParamsFlight({ returnDate: newReturnDate.toDate() })
  }

  const [{ order, ...filterParams }, setFilterParams] =
    useQueryStates(filterParsers)
  const airlineDataObj = useMemo(
    () => getAirlineByCodeList.data,
    [getAirlineByCodeList.data]
  )

  // Memoize sorted airline data to prevent sorting on every render
  const sortedAirlineData = useMemo(() => {
    return (
      airlineDataObj?.sort((a, b) =>
        a.Value[0].Value.localeCompare(b.Value[0].Value)
      ) ?? []
    )
  }, [airlineDataObj])

  // Memoize baggage options to prevent repeated extraction
  const baggageOptions = useMemo(() => {
    return (
      extractBaggageOptions(searchQueryData)?.sort((a, b) =>
        a.localeCompare(b)
      ) ?? []
    )
  }, [searchQueryData])

  // Memoize sorted airport data
  const sortedAirportData = useMemo(() => {
    return (
      getAirportsByCodeList.data?.sort((a, b) =>
        a.Value[0].Value.localeCompare(b.Value[0].Value)
      ) ?? []
    )
  }, [getAirportsByCodeList.data])

  // Memoize checkbox values to prevent expensive calculations on every render
  const numOfStopsCheckboxValue = useMemo(() => {
    return filterParams.numOfStops?.map(String) ?? []
  }, [filterParams.numOfStops])

  const airlinesCheckboxValue = useMemo(() => {
    return filterParams?.airlines?.length
      ? filterParams.airlines?.map(String)
      : []
  }, [filterParams?.airlines])

  const airportsCheckboxValue = useMemo(() => {
    return filterParams?.airports?.length
      ? filterParams.airports?.map(String)
      : []
  }, [filterParams?.airports])

  const { filteredData } = useFilterActions(searchQueryData)

  const isLoading =
    searchResultsQuery.isLoading ||
    searchResultsQuery.isFetching ||
    searchResultsQuery.isFetchingNextPage ||
    searchSessionTokenQuery.isLoading

  const [isReturnFlightVisible, setIsReturnFlightVisible] = useState(false)
  const { departureDate, returnDate } = searchParams
  const isSameDay = dayjs(departureDate).isSame(returnDate, 'd')

  const [selectedFlightItemPackages, setSelectedFlightItemPackages] = useState<{
    packages: SelectedPackageStateProps[] | undefined | null
    flights: ClientDataType[]
    providerName?: string
  } | null>()
  const [
    packageDrawerOpened,
    { open: openPackageDrawer, close: closePackageDrawer },
  ] = useDisclosure(false)
  const departure = dayjs(
    selectedFlightItemPackages?.flights.at(0)?.segments[0]?.departureTime
  )

  const arrival = dayjs(
    selectedFlightItemPackages?.flights.at(0)?.segments.at(-1)?.arrivalTime
  )

  const duration = dayjs.duration(arrival.diff(departure))

  const hours = duration.hours()
  const minutes = duration.minutes()

  const isDomestic = useMemo(
    () =>
      searchParams.origin?.isDomestic && searchParams.destination?.isDomestic,
    [searchParams.origin?.isDomestic, searchParams.destination?.isDomestic]
  )

  // Memoize baggage checkbox value (depends on isDomestic)
  const baggageCheckboxValue = useMemo(() => {
    if (filterParams?.baggage?.length) {
      return filterParams.baggage?.map(String)
    }
    return []
  }, [filterParams?.baggage])

  // Memoize numOfStops checkbox options to prevent expensive search operations
  const numOfStopsOptions = useMemo(() => {
    if (!searchQueryData) return []

    const options = []

    // Check for direct flights (0 stops)
    if (
      searchQueryData.find((result) =>
        isDomestic
          ? result.segments.length === 1
          : result.segments.filter((segment) => segment.groupId === 0)
              .length === 1 ||
            result.segments.filter((segment) => segment.groupId === 1)
              .length === 1
      )
    ) {
      options.push({ value: '0', label: 'Aktarmasız' })
    }

    // Check for 1 stop flights
    if (
      searchQueryData.find((result) =>
        isDomestic
          ? result.segments.length === 2
          : result.segments.filter((segment) => segment.groupId === 0)
              .length === 2 ||
            result.segments.filter((segment) => segment.groupId === 1)
              .length === 2
      )
    ) {
      options.push({ value: '1', label: '1 Aktarma' })
    }

    // Check for 2+ stops flights
    if (
      searchQueryData.find((result) =>
        isDomestic
          ? result.segments.length > 2
          : result.segments.filter((segment) => segment.groupId === 0).length >
              2 ||
            result.segments.filter((segment) => segment.groupId === 1).length >
              2
      )
    ) {
      options.push({ value: '2', label: '2+ Aktarma' })
    }

    return options
  }, [searchQueryData, isDomestic])

  // if true this means Round trip, otherwise international or one way flight
  const tripKind = useMemo(
    () =>
      isDomestic &&
      !!searchQueryData?.filter((results) => results.fareInfo.groupId > 0)
        .length,
    [isDomestic, searchQueryData]
  )

  // this is for flight select. first this should be called, then `handlePackageSelect`
  const handleFlightSelect = (flight: ClientDataType) => {
    const packages = flight.package.map((pack) => ({
      flightDetailSegment: pack.segments.at(0),
      flightFareInfo: pack.fareInfo,
      flightDetails: pack.details.at(0),
    })) as SelectedPackageStateProps[]
    // setSelectedFlightItem(flight)
    setSelectedFlightItemPackages((prevValues) => ({
      packages,
      flights:
        prevValues?.flights.length && flight.fareInfo.groupId !== 0
          ? [prevValues.flights[0], flight]
          : [flight],
      providerName: flight.providerName,
    }))

    if (flight.package.length <= 1) {
      handlePackageSelect(packages[0])
      return
    }

    openPackageDrawer()
  }

  // this, `handlePackageSelect`, should called after package is selected. handle domestic and roundtrip,
  // in  round trip and domestic case return flight section must be visible. otherwise redirect to reservation page
  // and handle scroll if user must select return flight
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>({
    duration: 700,
  })
  const handlePackageSelect = async (data: SelectedPackageStateProps) => {
    selectedFlightKeys.current.push(data.flightFareInfo.key)

    closePackageDrawer()

    if (!tripKind) {
      await submitFlightData.mutateAsync(selectedFlightKeys.current.toString())
    } else {
      if (tripKind && !isReturnFlightVisible) {
        scrollIntoView()
        setIsReturnFlightVisible(true)
      } else {
        await submitFlightData.mutateAsync(
          selectedFlightKeys.current.toString()
        )
        selectedFlightKeys.current = []
      }
    }
    setFilterParams(null)
  }

  const [filterSectionIsOpened, setFilterSectionIsOpened] = useState(false)
  const isBreakPointMatchesMd = useMediaQuery('(min-width: 62em)')
  const [
    isSearchEngineOpened,
    { toggle: toggleSearchEngineVisibility, close: closeSearchEngine },
  ] = useDisclosure(false)

  const resetSelectedFlights = useCallback(() => {
    setIsReturnFlightVisible(false)
    setSelectedFlightItemPackages(null)
    selectedFlightKeys.current = []
  }, [])

  useEffect(() => {
    return () => {
      resetSelectedFlights()
      closeSearchEngine()
    }
  }, [
    closeSearchEngine,
    resetSelectedFlights,
    searchParams.origin, //when changes this conditions resetSelectedFlights gonna work !!! by.
    searchParams.destination,
    searchParams.departureDate,
    searchParams.returnDate,
    searchSessionTokenQuery.data?.searchToken,
    searchSessionTokenQuery.data?.sessionToken,
  ])

  const selectedFlightKeys = useRef<string[]>([])
  const isFlightSubmitting = submitFlightData.isPending

  const totalPassengerCount = useMemo(() => {
    let total = 0

    if (searchParams.passengerCounts?.Adult) {
      total = searchParams.passengerCounts?.Adult
    }
    if (searchParams?.passengerCounts?.Child) {
      total += searchParams?.passengerCounts?.Child
    }
    if (searchParams?.passengerCounts?.Infant) {
      total += searchParams?.passengerCounts?.Infant
    }

    return total
  }, [searchParams.passengerCounts])

  // Memoize expensive filtering operations for domestic flights
  const domesticFilteredData = useMemo(() => {
    if (!isDomestic || !filteredData) return []

    const groupId = isReturnFlightVisible ? 1 : 0
    let groupFiltered = filteredData.filter(
      (item) => item.fareInfo.groupId === groupId
    )

    if (groupId === 1 && isSameDay) {
      const selectedFlightArrivalTime = dayjs(
        selectedFlightItemPackages?.flights.at(0)?.segments.at(-1)?.arrivalTime
      )

      groupFiltered = groupFiltered.filter((item) => {
        return (
          dayjs(item.segments.at(0)?.departureTime).diff(
            selectedFlightArrivalTime,
            'hour'
          ) > 1
        )
      })
    }

    return groupFiltered
  }, [
    isDomestic,
    filteredData,
    isReturnFlightVisible,
    isSameDay,
    selectedFlightItemPackages,
  ])

  const activeTripKind = searchParams.activeTripKind
  const mounted = useMounted()
  const originAirportCityName = airPortFlatList?.find(
    (airPort) =>
      airPort.Code === searchParams.origin?.code ||
      searchParams.origin?.iata.includes(airPort.Code)
  )?.City
  const departureAirportCityName = airPortFlatList?.find(
    (airPort) =>
      airPort.Code === searchParams.destination?.code ||
      searchParams.destination?.iata.includes(airPort.Code)
  )?.City

  if (!mounted) {
    return <Loading />
  }

  return (
    <>
      <div className='relative z-50 border-b py-2'>
        <Container>
          <Skeleton visible={isLoading} mih={40}>
            {!isBreakPointMatchesMd && (
              <div className='relative flex items-center gap-2 text-sm'>
                <button
                  className='absolute start-0 end-0 top-0 bottom-0 z-10'
                  onClick={toggleSearchEngineVisibility}
                />
                <div className='grid items-center'>
                  <div className='flex items-center gap-2 font-medium'>
                    <div>{originAirportCityName}</div>
                    <div>
                      <FaArrowRightLong className='text-blue-800' />
                    </div>
                    <div>{departureAirportCityName}</div>
                  </div>
                  <div className='flex items-center gap-1'>
                    <div>{totalPassengerCount} Yolcu</div>
                    <div>-</div>
                    <div className='font-normal'>
                      {searchParams.cabinClass?.title}
                    </div>
                  </div>
                </div>
                <div className='z-0 ms-auto rounded-md bg-blue-200 p-2'>
                  <IoSearchSharp size={24} className='text-blue-800' />
                </div>
              </div>
            )}

            {!isLoading && (
              <Collapse in={isSearchEngineOpened || isBreakPointMatchesMd}>
                <div className='pt-4 md:pt-0'>
                  <FlightSearchEngine
                    ActiveTripKind={searchParams.activeTripKind}
                    CabinClass={
                      searchParams.cabinClass ?? {
                        value: CabinClassValue.Economy,
                        title: CabinClassTitle.Economy,
                      }
                    }
                    DepartureDate={searchParams.departureDate}
                    Destination={{
                      Name: departureAirportCityName ?? '',
                      Code: searchParams.destination?.code ?? '',
                      CountryCode: '',
                      ExtentionData: {},
                      Iata: searchParams.destination?.iata ?? [''],
                      Id: searchParams.destination?.id ?? 0,
                      IsDomestic: !!searchParams.destination?.isDomestic,
                      Location: [],
                      Northeast: [],
                      ParentIds: [],
                      Select: true,
                      Slug: '',
                      Southwest: [],
                      SubDestinations: [],
                      Type: searchParams.destination?.type ?? 0,
                    }}
                    Origin={{
                      Name: originAirportCityName ?? '',
                      Code: searchParams.origin?.code ?? '',
                      CountryCode: '',
                      ExtentionData: {},
                      Iata: searchParams.origin?.iata ?? [''],
                      Id: searchParams.origin?.id ?? 0,
                      IsDomestic: !!searchParams.origin?.isDomestic,
                      Location: [],
                      Northeast: [],
                      ParentIds: [],
                      Select: true,
                      Slug: '',
                      Southwest: [],
                      SubDestinations: [],
                      Type: searchParams.origin?.type ?? 0,
                    }}
                    PassengerCounts={searchParams.passengerCounts}
                    ReturnDate={searchParams.returnDate}
                  />
                </div>
              </Collapse>
            )}
          </Skeleton>
        </Container>
      </div>
      {isLoading ? (
        <div className='relative'>
          <div className='absolute start-0 end-0 top-0 bottom-0 h-[8px]'>
            <Skeleton h={6} />
          </div>
        </div>
      ) : null}

      <Container ref={targetRef} className='pt-5 pb-17'>
        <div className='mb-3 hidden md:block'>
          {isLoading ? (
            <div className='flex items-center gap-2'>
              <Skeleton h={20} w={80} />
              <Skeleton h={20} w={80} />
              <Skeleton h={20} w={80} />
            </div>
          ) : airPortFlatList.length > 0 ? (
            <Breadcrumb
              items={[
                { title: 'Uçak', href: '/ucak-bileti' },
                {
                  title: `${
                    airPortFlatList?.find(
                      (airPort) =>
                        airPort.Code === searchParams.origin?.code ||
                        searchParams.origin?.iata.includes(airPort.Code)
                    )?.City ?? ''
                  } - ${
                    airPortFlatList?.find(
                      (airPort) =>
                        airPort.Code === searchParams.destination?.code ||
                        searchParams.destination?.iata.includes(airPort.Code)
                    )?.City ?? ''
                  }`,
                },
              ]}
            />
          ) : null}
        </div>
        <div className='grid md:grid-cols-8 md:gap-5'>
          <div className='md:col-span-2'>
            <Transition
              transition={'slide-right'}
              mounted={filterSectionIsOpened || !!isBreakPointMatchesMd}
            >
              {(styles) => (
                <RemoveScroll
                  enabled={filterSectionIsOpened && !isBreakPointMatchesMd}
                >
                  <div
                    className='fixed start-0 end-0 top-0 bottom-0 z-50 overflow-y-auto bg-white md:static'
                    style={styles}
                  >
                    <div className='flex justify-end md:hidden'>
                      <CloseButton
                        onClick={() => setFilterSectionIsOpened(false)}
                      />
                    </div>
                    {isLoading ? (
                      <div className='rounded-lg bg-white p-2'>
                        <Skeleton h={24} w='50%' className='mb-4' />

                        <div className='mt-3 mb-6'>
                          <Skeleton h={20} w='40%' className='mb-3' />
                          <Skeleton h={40} w='80%' />
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
                        <div className='flex justify-between gap-2 px-3 md:px-0'>
                          <Title className='text-xl font-medium' mb={rem(10)}>
                            Filtreler
                          </Title>
                          <div>
                            <UnstyledButton
                              className='px-4 font-semibold text-blue-500'
                              fz='xs'
                              hidden={
                                !Object.values(filterParams).find(Boolean)
                              }
                              onClick={() => {
                                setFilterParams(null)
                              }}
                            >
                              Temizle
                            </UnstyledButton>
                          </div>
                        </div>
                        <Accordion
                          defaultValue={[
                            'numOfStops',
                            'airlines',
                            'airports',
                            'departureHours',
                            'baggage',
                          ]}
                          multiple
                          classNames={{
                            root: 'filter-accordion',
                            control: 'text-md font-medium',
                          }}
                        >
                          <Skeleton
                            className='flex md:hidden'
                            visible={isLoading}
                          >
                            <div className='mx-3 justify-self-end font-medium'>
                              <Select
                                checkIconPosition='left'
                                leftSection={<FaCheck />}
                                size='sm'
                                value={order}
                                onChange={(value) =>
                                  setFilterParams({
                                    order: value as SortOrderEnums,
                                  })
                                }
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
                                    label: 'En Erken Saat',
                                    value: SortOrderEnums.hourAsc,
                                  },
                                  {
                                    label: 'En Geç Saat',
                                    value: SortOrderEnums.hourDesc,
                                  },
                                  {
                                    label: 'En Hızlı Süre',
                                    value: SortOrderEnums.durationAsc,
                                  },
                                  {
                                    label: 'En Uzun Süre',
                                    value: SortOrderEnums.durationDesc,
                                  },
                                  // { label: 'Varış Saati (Artan)', value: '' },
                                  // { label: 'Varış Saati (Azalan)', value: '' },
                                ]}
                              />
                            </div>
                          </Skeleton>
                          <Accordion.Item value='numOfStops'>
                            <Accordion.Control>Aktarma</Accordion.Control>
                            <Accordion.Panel>
                              <Checkbox.Group
                                onChange={(value) => {
                                  setFilterParams({
                                    numOfStops: value.length
                                      ? value.map(Number)
                                      : null,
                                  })
                                }}
                                value={numOfStopsCheckboxValue}
                              >
                                <Stack gap={6} className='text-lg'>
                                  {numOfStopsOptions.map((option) => (
                                    <Checkbox
                                      key={option.value}
                                      name='numOfStops'
                                      label={option.label}
                                      value={option.value}
                                    />
                                  ))}
                                </Stack>
                              </Checkbox.Group>
                            </Accordion.Panel>
                          </Accordion.Item>
                          <Accordion.Item value='departureHours'>
                            <Accordion.Control>
                              Kalkış saatleri
                            </Accordion.Control>
                            <Accordion.Panel className='px-3'>
                              <Stack gap='md'>
                                <div>
                                  {searchQueryData?.some((flight) =>
                                    flight.segments.some(
                                      (segment) => segment.groupId === 1
                                    )
                                  ) &&
                                    !isDomestic && (
                                      <Title order={6} mb='xs'>
                                        Gidiş uçuşu
                                      </Title>
                                    )}
                                  <HourRangeSlider
                                    filterParams={filterParams.departureHours}
                                    onChange={(hourRange) => {
                                      setFilterParams({
                                        departureHours: [
                                          hourRange.at(0)?.hourValue ?? 0,
                                          hourRange.at(-1)?.hourValue ?? 1440,
                                        ],
                                      })
                                    }}
                                  />
                                  <div className='pt-2 text-center'>
                                    <Button
                                      size='compact-sm'
                                      leftSection={<TbClockMinus />}
                                      variant='outline'
                                      disabled={!filterParams.departureHours}
                                      onClick={() => {
                                        setFilterParams({
                                          departureHours: null,
                                        })
                                      }}
                                    >
                                      Temizle
                                    </Button>
                                  </div>
                                </div>
                                {searchQueryData?.some((flight) =>
                                  flight.segments.some(
                                    (segment) => segment.groupId === 1
                                  )
                                ) &&
                                  !isDomestic && (
                                    <div>
                                      <Title order={6} mb='xs'>
                                        Dönüş uçuşu
                                      </Title>
                                      <HourRangeSlider
                                        filterParams={filterParams.returnHours}
                                        onChange={(hourRange) => {
                                          setFilterParams({
                                            returnHours: [
                                              hourRange.at(0)?.hourValue ?? 0,
                                              hourRange.at(-1)?.hourValue ??
                                                1440,
                                            ],
                                          })
                                        }}
                                      />
                                      <div className='pt-2 text-center'>
                                        <Button
                                          size='compact-sm'
                                          leftSection={<TbClockMinus />}
                                          variant='outline'
                                          disabled={!filterParams.returnHours}
                                          onClick={() => {
                                            setFilterParams({
                                              returnHours: null,
                                            })
                                          }}
                                        >
                                          Temizle
                                        </Button>
                                      </div>
                                    </div>
                                  )}
                              </Stack>
                            </Accordion.Panel>
                          </Accordion.Item>
                          <Accordion.Item value='airlines'>
                            <Accordion.Control>HavaYolları</Accordion.Control>
                            <Accordion.Panel>
                              <Checkbox.Group
                                onChange={(value) => {
                                  setFilterParams({
                                    airlines: value.length ? value : null,
                                  })
                                }}
                                value={airlinesCheckboxValue}
                              >
                                <Spoiler
                                  maxHeight={205}
                                  showLabel='Daha fazla göster'
                                  hideLabel='Daha az göster'
                                  className='w-full'
                                >
                                  <Stack gap={6}>
                                    {sortedAirlineData.map((airline) => {
                                      return (
                                        <div key={airline.Code}>
                                          <Checkbox
                                            name='airlines'
                                            label={
                                              airline.Value.find(
                                                (airlineValue) =>
                                                  airlineValue.LangCode ===
                                                  'tr_TR'
                                              )?.Value
                                            }
                                            value={airline.Code}
                                          />
                                        </div>
                                      )
                                    })}
                                  </Stack>
                                </Spoiler>
                              </Checkbox.Group>
                            </Accordion.Panel>
                          </Accordion.Item>
                          <Accordion.Item value='baggage'>
                            <Accordion.Control>Bagaj</Accordion.Control>
                            <Accordion.Panel>
                              <Checkbox.Group
                                onChange={(value) => {
                                  setFilterParams({
                                    baggage: value.length ? value : null,
                                  })
                                }}
                                value={baggageCheckboxValue}
                              >
                                <Spoiler
                                  maxHeight={220}
                                  showLabel='Daha fazla göster'
                                  hideLabel='Daha az göster'
                                  className='w-full'
                                >
                                  <Stack gap={6}>
                                    {baggageOptions.map(
                                      (baggageOption, index) => {
                                        const [pieces, weight] =
                                          baggageOption.split('x')

                                        return (
                                          <div key={baggageOption}>
                                            <Checkbox
                                              name='baggage'
                                              label={`${pieces} parça x ${weight} Kg Bagaj`}
                                              value={baggageOption}
                                            />
                                          </div>
                                        )
                                      }
                                    )}
                                  </Stack>
                                </Spoiler>
                              </Checkbox.Group>
                            </Accordion.Panel>
                          </Accordion.Item>
                          <Accordion.Item value='airports'>
                            <Accordion.Control>Havaalanları</Accordion.Control>
                            <Accordion.Panel>
                              <Checkbox.Group
                                onChange={(value) => {
                                  setFilterParams({
                                    airports: value.length ? value : null,
                                  })
                                }}
                                value={airportsCheckboxValue}
                              >
                                <Spoiler
                                  maxHeight={225}
                                  showLabel='Daha fazla göster'
                                  hideLabel='Daha az göster'
                                  className='w-full'
                                >
                                  <Stack gap={6}>
                                    {sortedAirportData.map((airports) => {
                                      return (
                                        <div key={airports.Code}>
                                          <Checkbox
                                            name='airports'
                                            label={
                                              airports.Value.find(
                                                (airportValue) =>
                                                  airportValue.LangCode ===
                                                  'tr_TR'
                                              )?.Value
                                            }
                                            value={airports.Code}
                                          />
                                        </div>
                                      )
                                    })}
                                  </Stack>
                                </Spoiler>
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

          <div className='md:col-span-6'>
            <SearchCopyCode data={searchCopyCode} />

            <div>
              <>
                {filteredData?.length ? (
                  isReturnFlightVisible ? (
                    <div>
                      <div className='not-only: @container mb-4 grid items-center rounded-lg border-2 border-blue-600 bg-blue-50 shadow'>
                        <div className='flex items-center justify-start rounded-t-lg px-4 py-3 md:justify-between md:p-2'>
                          <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                              <div className='text-md flex items-center font-bold'>
                                <FaCheckCircle
                                  size={24}
                                  className='text-blue-800'
                                />
                                <span className='ps-2 text-sm md:text-sm'>
                                  Gidiş Uçuşu
                                </span>
                                <FaArrowRightLong className='ml-2' /> {''}
                              </div>

                              <div className='md:text-md flex items-center gap-1 ps-2 text-xs md:justify-end'>
                                <div>
                                  {
                                    selectedFlightItemPackages?.flights.at(0)
                                      ?.segments[0].origin.code
                                  }
                                </div>{' '}
                                <div>-</div>
                                <div>
                                  {
                                    selectedFlightItemPackages?.flights
                                      .at(0)
                                      ?.segments.at(-1)?.destination.code
                                  }
                                </div>
                                <div>
                                  (
                                  {dayjs(
                                    selectedFlightItemPackages?.flights
                                      .at(0)
                                      ?.segments.at(0)?.departureTime
                                  ).format(' DD MMM, ddd')}{' '}
                                  )
                                </div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <Button
                              className='text-blue hidden border border-gray-500 bg-white px-7 py-2 text-sm font-normal md:flex'
                              size='md'
                              radius='md'
                              variant='default'
                              type='button'
                              onClick={resetSelectedFlights}
                            >
                              Değiştir
                            </Button>
                          </div>
                        </div>
                        <div className='rounded-lg bg-blue-50'>
                          <div className='grid items-center gap-6 md:grid-cols-6'>
                            <div className='relative col-span-5 grid'>
                              <div className='start-0-0 absolute top-1/2 mt-5 h-8 w-1 -translate-y-1/2 rounded-tr-md rounded-br-md bg-blue-600 md:mt-0' />
                              <div className='grid md:grid-cols-3'>
                                <div className='col-span-1 mt-2 flex items-center gap-1 px-3 text-sm md:mt-0'>
                                  <div>
                                    <AirlineLogo
                                      airlineCode={
                                        selectedFlightItemPackages?.flights
                                          .at(0)
                                          ?.segments[0]?.marketingAirline.code?.toLowerCase() ??
                                        ''
                                      }
                                    />
                                  </div>
                                  <div className='flex items-center justify-between gap-2 md:grid'>
                                    <div className='text-sm'>
                                      {
                                        airlineDataObj
                                          ?.find(
                                            (airline) =>
                                              airline.Code ===
                                              selectedFlightItemPackages?.flights.at(
                                                0
                                              )?.segments[0]?.marketingAirline
                                                .code
                                          )
                                          ?.Value.find(
                                            (val) => val.LangCode === 'tr_TR'
                                          )?.Value
                                      }
                                    </div>
                                  </div>
                                </div>
                                <div className='relative col-span-2 mt-5 grid'>
                                  <div className='flex items-center justify-between px-3 text-sm'>
                                    <div className='text-center'>
                                      <div className='text-lg font-medium'>
                                        {dayjs(
                                          selectedFlightItemPackages?.flights.at(
                                            0
                                          )?.segments[0]?.departureTime
                                        ).format('HH:mm')}
                                      </div>
                                      <div className='text-sm'>
                                        {
                                          selectedFlightItemPackages?.flights.at(
                                            0
                                          )?.segments[0].origin.code
                                        }
                                      </div>
                                    </div>

                                    <div className='relative mx-4 grow'>
                                      <Box
                                        bg='blue'
                                        h={2}
                                        className='rounded'
                                      />
                                      <div className='absolute end-0 top-px -translate-y-1/2 rotate-90 pb-px text-blue-800'>
                                        <MdOutlineAirplanemodeActive
                                          size={18}
                                        />
                                      </div>
                                    </div>

                                    <div className='text-center'>
                                      <div className='text-lg'>
                                        {dayjs(
                                          selectedFlightItemPackages?.flights
                                            .at(0)
                                            ?.segments.at(-1)?.arrivalTime
                                        ).format('HH:mm')}
                                      </div>
                                      <div className='text-sm'>
                                        {
                                          selectedFlightItemPackages?.flights
                                            .at(0)
                                            ?.segments.at(-1)?.destination.code
                                        }
                                      </div>
                                    </div>
                                  </div>

                                  <div className='md:text-md absolute start-0 end-0 top-0 flex items-center justify-center gap-1 text-xs text-black'>
                                    <div>
                                      {hours}s {minutes}d
                                    </div>
                                    <div>
                                      {(() => {
                                        const numSegments =
                                          selectedFlightItemPackages?.flights.at(
                                            0
                                          )?.segments.length ?? 0
                                        const hasTransferStop = numSegments > 1
                                        return hasTransferStop ? (
                                          <span className='text-red-600'>
                                            {numSegments - 1} Aktarma
                                          </span>
                                        ) : (
                                          <span className='md:text-md text-sm font-medium text-green-800'>
                                            Aktarmasız
                                          </span>
                                        )
                                      })()}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className='col-span-1 hidden items-center justify-center text-center md:grid md:pt-6'>
                              <div className='text-xl font-semibold'>
                                {(() => {
                                  const packagePrice =
                                    selectedFlightItemPackages?.flights?.[0]?.package.find(
                                      (pckK) =>
                                        pckK.fareInfo.key ===
                                        selectedFlightKeys.current?.[0]
                                    )?.fareInfo.totalPrice.value
                                  return packagePrice !== undefined
                                    ? formatCurrency(packagePrice)
                                    : ''
                                })()}
                              </div>
                              <div className='mx-auto'>
                                <UnstyledButton
                                  className='flex items-center border-0 bg-blue-50 px-0 text-center text-sm font-bold text-blue-500'
                                  onClick={toggleDetails}
                                >
                                  {detailsOpened ? (
                                    <>
                                      Kapat <IoIosClose size={25} />
                                    </>
                                  ) : (
                                    'Detay'
                                  )}
                                </UnstyledButton>
                              </div>
                            </div>
                          </div>
                          <hr className='mt-2 flex md:hidden' />
                          <div>
                            <div className='col-span-1 my-2 flex items-center justify-between gap-3 bg-blue-50 px-3 text-center md:hidden'>
                              <div className='text-md font-semibold'>
                                {(() => {
                                  const packagePrice =
                                    selectedFlightItemPackages?.flights?.[0]?.package.find(
                                      (pckK) =>
                                        pckK.fareInfo.key ===
                                        selectedFlightKeys.current?.[0]
                                    )?.fareInfo.totalPrice.value
                                  return packagePrice !== undefined
                                    ? formatCurrency(packagePrice)
                                    : ''
                                })()}
                              </div>
                              <div className='bg-blue-50'>
                                <UnstyledButton
                                  className='flex items-center justify-center border-0 bg-blue-50 px-0 text-sm font-semibold text-blue-500'
                                  onClick={toggleDetails}
                                >
                                  {detailsOpened ? (
                                    <>
                                      Kapat <IoIosClose size={25} />
                                    </>
                                  ) : (
                                    'Detay'
                                  )}
                                </UnstyledButton>
                              </div>
                              <div>
                                <Button
                                  className='text-blue border border-gray-500 bg-white px-5 py-2 text-sm font-normal'
                                  size='xs'
                                  radius='md'
                                  variant='default'
                                  type='button'
                                  onClick={resetSelectedFlights}
                                >
                                  Değiştir
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className='bg-gray-80 rounded-lg text-start md:mr-5 md:mb-5 md:ml-5'>
                          {selectedFlightItemPackages?.flights[0].details &&
                            selectedFlightItemPackages?.flights[0].segments && (
                              <FlightDetailsSearch
                                details={
                                  selectedFlightItemPackages?.flights[0].details
                                }
                                detailSegments={
                                  selectedFlightItemPackages?.flights[0]
                                    .segments
                                }
                                airlineValues={airlineDataObj}
                                airportValues={getAirportsByCodeList.data}
                                opened={detailsOpened}
                                isDomestic={true}
                              />
                            )}
                        </div>
                      </div>
                      <div className='flex items-center justify-between pb-3'>
                        <div className='text-xl font-medium md:text-2xl'>
                          Dönüş Uçuşunuzu Seçiniz
                        </div>
                        <div>
                          <div className='flex md:mb-5 md:hidden md:justify-between'>
                            <div className='ms-auto flex items-center gap-1'>
                              <Skeleton visible={isLoading}>
                                <Box className='justify-self-start'>
                                  <Button
                                    onClick={() =>
                                      setFilterSectionIsOpened((prev) => !prev)
                                    }
                                    size='sm'
                                    color='black'
                                    className='flex border-gray-400 px-3 font-medium text-black md:mx-1 md:hidden'
                                    variant='outline'
                                  >
                                    Filtrele
                                  </Button>
                                </Box>
                              </Skeleton>
                            </div>
                          </div>

                          <Skeleton
                            className='hidden md:flex'
                            visible={isLoading}
                          >
                            <div className='justify-self-end'>
                              <Select
                                checkIconPosition='left'
                                leftSection={<FaCheck />}
                                size='sm'
                                classNames={{
                                  label: 'hidden',
                                }}
                                label='Sırala'
                                value={order}
                                onChange={(value) => {
                                  setFilterParams({
                                    order: value as SortOrderEnums,
                                  })
                                }}
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
                                    label: 'En Erken Saat',
                                    value: SortOrderEnums.hourAsc,
                                  },
                                  {
                                    label: 'En Geç Saat',
                                    value: SortOrderEnums.hourDesc,
                                  },
                                  {
                                    label: 'En Hızlı Süre',
                                    value: SortOrderEnums.durationAsc,
                                  },
                                  {
                                    label: 'En Uzun Süre',
                                    value: SortOrderEnums.durationDesc,
                                  },
                                ]}
                              />
                            </div>
                          </Skeleton>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Skeleton
                      className='flex items-center justify-between pb-3'
                      visible={isLoading}
                    >
                      <span className='text-xl font-medium md:text-2xl'>
                        {!isReturnFlightVisible && filteredData?.length
                          ? 'Gidiş uçuşunuzu seçiniz'
                          : isReturnFlightVisible && filteredData?.length
                            ? 'Dönüş uçuşunuzu seçiniz.'
                            : ''}
                      </span>
                      <div>
                        <Skeleton
                          className='flex md:hidden'
                          visible={isLoading}
                        >
                          <Box className='justify-self-start'>
                            <Button
                              onClick={() =>
                                setFilterSectionIsOpened((prev) => !prev)
                              }
                              size='sm'
                              color='black'
                              className='flex border-gray-400 px-3 font-medium text-black md:mx-1 md:hidden'
                              variant='outline'
                            >
                              Filtrele
                            </Button>
                          </Box>
                        </Skeleton>
                        <Skeleton
                          className='hidden md:flex'
                          visible={isLoading}
                        >
                          <div className=''>
                            <Select
                              leftSection={<FaCheck />}
                              size='sm'
                              radius='md'
                              checkIconPosition='left'
                              value={order}
                              onChange={(value) =>
                                setFilterParams({
                                  order: value as SortOrderEnums,
                                })
                              }
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
                                  label: 'En Erken Saat',
                                  value: SortOrderEnums.hourAsc,
                                },
                                {
                                  label: 'En Geç Saat',
                                  value: SortOrderEnums.hourDesc,
                                },
                                {
                                  label: 'En Hızlı Süre',
                                  value: SortOrderEnums.durationAsc,
                                },
                                {
                                  label: 'En Uzun Süre',
                                  value: SortOrderEnums.durationDesc,
                                },
                              ]}
                            />
                          </div>
                        </Skeleton>
                      </div>
                    </Skeleton>
                  )
                ) : null}
              </>
            </div>
            <SearchPrevNextButtons
              searchSessionTokenQuery={searchSessionTokenQuery}
              searchResultsQuery={searchResultsQuery}
              onPrevDay={handlePrevDay}
              onNextDay={handleNextDay}
              onPrevReturnDay={handlePrevReturnDay}
              onNextReturnDay={handleNextReturnDay}
              departureDate={searchParams.departureDate ?? ''}
              returnDate={searchParams.returnDate ?? ''}
              isDomestic={isDomestic ?? false}
              isReturnFlightVisible={isReturnFlightVisible}
              activeTripKind={activeTripKind || ''}
            />
            <div className='grid gap-3 pt-3 md:gap-5'>
              {searchResultsQuery.data &&
                !searchResultsQuery.isFetchingNextPage &&
                isDomestic &&
                filteredData?.filter((item) => {
                  const groupId = isReturnFlightVisible ? 1 : 0

                  return item.fareInfo.groupId === groupId
                })?.length === 0 && (
                  <div>
                    <div className='text-center text-lg'>
                      <NotFoundForm moduleName='Uçak' />
                    </div>
                    <div className='hidden justify-center pt-3'>
                      <Button
                        onClick={() => {
                          setFilterParams(null)
                        }}
                      >
                        Tüm Sonuçları göster
                      </Button>
                    </div>
                  </div>
                )}

              {searchResultsQuery.data &&
                !searchResultsQuery.isFetching &&
                !searchResultsQuery.isLoading &&
                !searchResultsQuery.isFetchingNextPage &&
                !isDomestic &&
                filteredData?.length === 0 && (
                  <>
                    <NotFoundForm moduleName='Uçak' />
                    {/* <div className='flex justify-center pt-3'>
                      <Button
                        onClick={() => {
                          setFilterParams(null)
                        }}
                      >
                        Tüm Sonuçları göster
                      </Button>
                    </div> */}
                  </>
                )}

              {isDomestic &&
                !searchResultsQuery.isFetchingNextPage &&
                filteredData &&
                filteredData?.filter((item) => {
                  const groupId = isReturnFlightVisible ? 1 : 0
                  return item.fareInfo.groupId === groupId
                })?.length > 0 &&
                domesticFilteredData.length === 0 && (
                  <Alert>
                    <div>
                      Seçilen uçuş saatleri uygun değil. Gidiş uçuşunuzu
                      değiştirin.
                    </div>
                    <div className='pt-2'>
                      <Button type='button' onClick={resetSelectedFlights}>
                        Gidiş değiştir
                      </Button>
                    </div>
                  </Alert>
                )}

              {isLoading && (
                <>
                  <React.Fragment>
                    <LoaderBanner
                      data={loaderBannerFlight}
                      moduleName='Uçuşlar'
                      Icon={MdFlight}
                    />
                  </React.Fragment>
                  <div className='space-y-4'>
                    {Array.from({ length: 10 }).map((_, index) => (
                      <div key={index} className='mb-4 rounded-lg border-2 p-4'>
                        <div className='flex gap-4'>
                          <Skeleton height={120} width={80} radius='md' />
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
                              <Skeleton height={32} width={80} />
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {!isLoading ? (
                isDomestic ? (
                  domesticFilteredData.map((result) => {
                    const segmentAirlines = result?.segments?.map((item) =>
                      item.marketingAirline.code === item.operatingAirline.code
                        ? item.marketingAirline.code
                        : item.operatingAirline.code
                    )

                    const airlineValues: AirlineCode[] | undefined =
                      airlineDataObj?.filter((airlineObj) =>
                        segmentAirlines.find(
                          (segment) => segment === airlineObj.Code
                        )
                      )

                    return (
                      <MemoizedFlightSearchResultsDomestic
                        airlineValues={airlineValues}
                        airportValues={getAirportsByCodeList.data}
                        detailSegments={result?.segments}
                        details={result?.details}
                        fareInfo={result?.fareInfo}
                        onSelect={() => {
                          handleFlightSelect(result)
                        }}
                        key={result.fareInfo.key}
                      />
                    )
                  })
                ) : (
                  <Virtuoso
                    useWindowScroll
                    data={filteredData}
                    totalCount={filteredData?.length}
                    itemContent={(_, result) => {
                      const segmentAirlines = result?.segments?.map((item) =>
                        item.marketingAirline.code ===
                        item.operatingAirline.code
                          ? item.marketingAirline.code
                          : item.operatingAirline.code
                      )
                      const airlineValues: AirlineCode[] | undefined =
                        airlineDataObj?.filter((airlineObj) =>
                          segmentAirlines.find(
                            (segment) => segment === airlineObj.Code
                          )
                        )
                      return (
                        <div className='pb-3 md:pb-5'>
                          <MemoizedFlightSearchResultsInternational
                            airlineValues={airlineValues}
                            airportValues={getAirportsByCodeList.data}
                            detailSegments={result?.segments}
                            details={result?.details}
                            fareInfo={result?.fareInfo}
                            onSelect={() => {
                              handleFlightSelect(result)
                            }}
                          />
                        </div>
                      )
                    }}
                  />
                )
              ) : null}
            </div>
          </div>
        </div>
      </Container>
      <Drawer
        size={isBreakPointMatchesMd ? 'lg' : '100%'}
        opened={packageDrawerOpened}
        onClose={closePackageDrawer}
        position='bottom'
        classNames={{
          title: 'flex-1 text-center font-normal',
          close:
            'bg-blue-800 text-white absolute top-3 right-0 flex -translate-y-3 rounded-bl-md w-12 h-12 items-center justify-center',
        }}
        title={
          <div className='flex flex-col items-center justify-center gap-2'>
            <div className='hidden text-xl font-medium md:flex md:text-2xl'>
              Uçuş Paketi Seçerek Daha Konforlu Seyahat Edin
            </div>
            <div className='flex text-lg font-medium md:hidden md:text-xl'>
              Uçuş Paketinizi Seçiniz
            </div>

            <div className='flex items-center justify-center gap-3'>
              <div className='text-md flex items-center justify-center gap-1 font-semibold md:text-lg'>
                {
                  airPortFlatList?.find(
                    (airPort) =>
                      searchParams[
                        isReturnFlightVisible ? 'origin' : 'destination'
                      ]?.code === airPort.Code ||
                      searchParams[
                        isReturnFlightVisible ? 'origin' : 'destination'
                      ]?.iata.includes(airPort.Code)
                  )?.City
                }
                {''} - {''}
                {
                  airPortFlatList.find(
                    (airPort) =>
                      searchParams[
                        isReturnFlightVisible ? 'destination' : 'origin'
                      ]?.code === airPort.Code ||
                      searchParams[
                        isReturnFlightVisible ? 'destination' : 'origin'
                      ]?.iata.includes(airPort.Code)
                  )?.City
                }
              </div>
              <div className='flex items-center justify-center gap-1'>
                <AirlineLogo
                  airlineCode={
                    selectedFlightItemPackages?.flights
                      ?.at(-1)
                      ?.segments?.at(0)
                      ?.marketingAirline.code.toLowerCase() ?? ''
                  }
                />
                <span className='md:text-md text-xs font-semibold'>
                  {
                    airlineDataObj
                      ?.find(
                        (airline) =>
                          airline.Code ==
                          selectedFlightItemPackages?.flights
                            .at(-1)
                            ?.segments.at(0)?.marketingAirline.code
                      )
                      ?.Value.at(0)?.Value
                  }
                </span>
              </div>
            </div>
          </div>
        }
      >
        <Container>
          {selectedFlightItemPackages && (
            <PackageFlightDrawer
              data={selectedFlightItemPackages}
              onSelect={(selectedPackage) => {
                handlePackageSelect(selectedPackage)
              }}
            />
          )}
        </Container>
      </Drawer>
      <Modal
        opened={isFlightSubmitting}
        onClose={() => {}}
        withCloseButton={false}
        centered
        radius={'xl'}
      >
        <div className='flex items-center justify-center gap-4 p-7'>
          <div>
            <Loader />
          </div>
          <div className='text-lg'>Lütfen bekleyiniz</div>
        </div>
      </Modal>
    </>
  )
}

export { FlightSearchView }
