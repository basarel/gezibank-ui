'use client'

import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useTransitionRouter } from 'next-view-transitions'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
dayjs.extend(isSameOrAfter)
dayjs.extend(utc)

import { z } from '@/libs/zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { useLocalStorage, useMounted } from '@mantine/hooks'
import { Radio, Group, Skeleton, Button, Grid } from '@mantine/core'

import { request } from '@/network'

import { Locations } from '@/components/search-engine/locations'
import { FlightCalendar } from '@/components/search-engine/calendar/flight'
import { PassengerDropdown } from '@/components/search-engine/passengers/flight'
import type { LocationResults } from '@/components/search-engine/locations/type'
import { serializeFlightSearchParams } from './searchParams'
import { SearchEngineButton } from '@/components/search-engine/search-button'
import { RiCalendarEventLine, RiMapPin2Line, RiUserLine } from 'react-icons/ri'
import { TbArrowsRightLeft } from 'react-icons/tb'
import { useGetWidgetsByCollectionSlug } from '@/hooks/useCsmQuery'
import { CabinClassTitle, CabinClassValue } from './types'

const locationSchema = z.object({
  Code: z.string().nonempty(),
  CountryCode: z.string(),
  ExtentionData: z.object({}),
  Iata: z.array(z.string()),
  Id: z.string().or(z.number()),
  IsDomestic: z.boolean(),
  Location: z.array(z.number()),
  Name: z.string().nonempty(),
  Northeast: z.array(z.number()),
  ParentIds: z.array(z.number()),
  Select: z.boolean(),
  Slug: z.string(),
  Southwest: z.array(z.number()),
  SubDestinations: z.array(z.object({})),
  Type: z.number(),
})

const formSchema = z.object({
  DepartureDate: z.coerce.date(),
  ReturnDate: z.coerce.date(),
  Destination: locationSchema,
  Origin: locationSchema,
  ActiveTripKind: z.union([z.literal('1'), z.literal('2')]),
  CabinClass: z.object({
    value: z.nativeEnum(CabinClassValue),
    title: z.nativeEnum(CabinClassTitle),
  }),
  PassengerCounts: z.object({
    Adult: z.number(),
    Child: z.number(),
    Infant: z.number(),
  }),
})

type FlightRequestType = z.infer<typeof formSchema>

type IProps = Partial<FlightRequestType>

export const Flight: React.FC<IProps> = ({
  ActiveTripKind,
  CabinClass,
  DepartureDate,
  ReturnDate,
  Destination,
  Origin,
  PassengerCounts,
}) => {
  const queryClient = useQueryClient()
  const mounted = useMounted()
  const router = useTransitionRouter()
  const widgets = useGetWidgetsByCollectionSlug()
  const popularDestinations = widgets.data?.find(
    (widget) => widget.point === 'popular_destinations'
  )?.params.flight.destinations

  const [flightLocalObj, setFlightLocalObj] =
    useLocalStorage<FlightRequestType>({
      key: 'flight-search-engine',
      getInitialValueInEffect: false,
      defaultValue: {
        CabinClass: {
          title: CabinClassTitle.Economy,
          value: CabinClassValue.Economy,
        },
        ActiveTripKind: '1',
        DepartureDate: dayjs().utc().add(3, 'day').toDate(),
        ReturnDate: dayjs().utc().add(5, 'day').toDate(),
        Destination: {
          Name: '',
          Code: '',
          CountryCode: '',
          ExtentionData: {},
          Iata: [''],
          Id: 0,
          IsDomestic: false,
          Location: [0],
          Northeast: [],
          ParentIds: [0],
          Select: false,
          Slug: '',
          Southwest: [],
          SubDestinations: [],
          Type: 0,
        },
        Origin: {
          Name: '',
          Code: '',
          CountryCode: '',
          ExtentionData: {},
          Iata: [''],
          Id: 0,
          IsDomestic: false,
          Location: [0],
          Northeast: [],
          ParentIds: [0],
          Select: false,
          Slug: '',
          Southwest: [],
          SubDestinations: [],
          Type: 0,
        },
        PassengerCounts: {
          Adult: 1,
          Child: 0,
          Infant: 0,
        },
      },
    })

  const departureDate =
    flightLocalObj &&
    dayjs(flightLocalObj.DepartureDate).isValid() &&
    dayjs(flightLocalObj.DepartureDate).isSameOrAfter(dayjs(), 'dates')
      ? flightLocalObj.DepartureDate
      : dayjs.utc().add(2, 'd').startOf('days').toDate()

  const returnDate =
    flightLocalObj &&
    dayjs(flightLocalObj.ReturnDate).isValid() &&
    dayjs(flightLocalObj.ReturnDate).isSameOrAfter(dayjs(), 'dates')
      ? flightLocalObj.ReturnDate
      : dayjs.utc().add(4, 'd').startOf('days').toDate()

  const form = useForm<FlightRequestType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ActiveTripKind: ActiveTripKind ?? flightLocalObj?.ActiveTripKind ?? '1',
      CabinClass: CabinClass ?? flightLocalObj.CabinClass,
      Destination: Destination ?? flightLocalObj?.Destination,
      Origin: Origin ?? flightLocalObj?.Origin,
      PassengerCounts: PassengerCounts ?? {
        Adult: flightLocalObj?.PassengerCounts?.Adult ?? 1,
        Child: flightLocalObj?.PassengerCounts?.Child ?? 0,
        Infant: flightLocalObj?.PassengerCounts?.Infant ?? 0,
      },
      DepartureDate: DepartureDate ?? departureDate,
      ReturnDate: ReturnDate ?? returnDate,
    },
  })

  const {
    data: originLocations,
    isLoading: originLocationsIsLoading,
    refetch: refetchOriginDestinations,
  } = useQuery<LocationResults>({
    queryKey: ['flight-origin-locations'],
    enabled: false,
    queryFn: async () => {
      const getLocations = await request({
        url: `${process.env.NEXT_PUBLIC_API_DESTINATION_ROUTE}/v1.1/api/flight/search`,
        params: {
          s: form.getValues('Origin.Slug'),
          id: null,
          scope: process.env.NEXT_PUBLIC_SCOPE_CODE,
        },
      })

      return getLocations
    },
  })
  const {
    data: destinationLocation,
    isLoading: destinationLocationLoading,
    refetch: refetchTargetDestinations,
  } = useQuery<LocationResults>({
    queryKey: ['flight-destination-locations'],
    enabled: false,
    queryFn: async () => {
      const getLocations = await request({
        url: `${process.env.NEXT_PUBLIC_API_DESTINATION_ROUTE}/v1.1/api/flight/search`,
        params: {
          s: form.getValues('Destination.Slug'),
          id: null,
          scope: process.env.NEXT_PUBLIC_SCOPE_CODE,
        },
      })

      return getLocations
    },
  })

  const handleFormSubmit = async (data: FlightRequestType) => {
    const departureDate = data.DepartureDate
    const returnDate =
      dayjs(data.ReturnDate).diff(data.DepartureDate, 'd') < 0
        ? dayjs(departureDate).add(2, 'd').toDate()
        : data.ReturnDate

    const searchUrl = serializeFlightSearchParams('/flight/search-results', {
      activeTripKind: data.ActiveTripKind,
      cabinClass: data.CabinClass,
      departureDate: departureDate,
      destination: {
        code: data.Destination.Code,
        iata: data.Destination.Iata,
        id: data.Destination.Id,
        isDomestic: data.Destination.IsDomestic,
        type: data.Destination.Type,
      },
      origin: {
        code: data.Origin.Code,
        iata: data.Origin.Iata,
        id: data.Origin.Id,
        isDomestic: data.Origin.IsDomestic,
        type: data.Origin.Type,
      },
      passengerCounts: data.PassengerCounts,
      // returnDate: data.ActiveTripKind === '2' ? returnDate : null,
      ...(data.ActiveTripKind === '2' && { returnDate: returnDate }),
    })

    setFlightLocalObj(() => ({
      Origin: data.Origin,
      Destination: data.Destination,
      ReturnDate: returnDate,
      DepartureDate: departureDate,
      ActiveTripKind: data.ActiveTripKind,
      CabinClass: data.CabinClass,
      PassengerCounts: data.PassengerCounts,
    }))

    // router.push(`/flight-search?searchId=${generateUUID()}`)
    queryClient.invalidateQueries({
      queryKey: ['flight-search-token'],
    })

    router.push(searchUrl)
  }
  const switchWay = () => {
    const origin = form.getValues('Origin')
    const destination = form.getValues('Destination')
    form.setValue('Origin', destination)
    form.setValue('Destination', origin)
    form.trigger(['Origin', 'Destination'])
  }
  if (!mounted) {
    return <Skeleton height={80} />
  }

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
      <div className='flex items-center gap-4 pb-4 md:gap-3'>
        <div>
          <Radio.Group
            defaultValue={form.formState.defaultValues?.ActiveTripKind}
            name='ActiveTripKind'
            onChange={(value) => {
              if (value === '1' || value === '2') {
                form.setValue('ActiveTripKind', value)
                form.trigger('ActiveTripKind')
              }
            }}
          >
            <Group gap={'md'}>
              <Radio
                className='font-medium'
                variant='outline'
                value={'2'}
                label='Gidiş-Dönüş'
              />
              <Radio
                className='font-medium'
                variant='outline'
                value={'1'}
                label='Tek Yön'
              />
            </Group>
          </Radio.Group>
        </div>
      </div>
      <Grid gutter={6}>
        <Grid.Col span={{ base: 12, md: 5 }} pos={'relative'}>
          <Grid gutter={6}>
            <Grid.Col span={{ sm: 6 }}>
              <div className='relative'>
                <>
                  <RiMapPin2Line
                    size={20}
                    className='absolute top-1/2 left-0 z-10 mx-2 -translate-y-1/2'
                  />
                  <Locations
                    popularDestinations={popularDestinations}
                    label='Nereden'
                    inputProps={{ error: !!form.formState.errors.Origin }}
                    data={originLocations?.Result}
                    isLoading={originLocationsIsLoading}
                    defaultValue={form.getValues('Origin')?.Name}
                    onChange={(value) => {
                      if (value.length > 2) {
                        form.setValue('Origin.Slug', value)
                        form.trigger('Origin.Slug').then((value) => {
                          if (value) {
                            refetchOriginDestinations()
                          }
                        })
                      }
                    }}
                    onSelect={(value) => {
                      form.setValue('Origin', value)
                    }}
                  />
                </>
              </div>
            </Grid.Col>
            <Button
              onClick={switchWay}
              className='absolute top-1/2 right-0 z-20 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-gray-500 bg-white sm:top-1/2 sm:left-1/2'
            >
              <TbArrowsRightLeft
                size={20}
                className='rotate-90 text-blue-800 transition-transform sm:rotate-0'
              />
            </Button>
            <Grid.Col span={{ sm: 6 }}>
              <div className='relative'>
                <RiMapPin2Line
                  size={20}
                  className='absolute top-1/2 left-0 z-10 mx-4 -translate-y-1/2'
                />

                <Locations
                  label='Nereye?'
                  popularDestinations={popularDestinations}
                  inputProps={{
                    error: !!form.formState.errors.Destination,
                  }}
                  defaultValue={form.getValues('Destination')?.Name}
                  data={destinationLocation?.Result}
                  isLoading={destinationLocationLoading}
                  onChange={(value) => {
                    if (value.length > 2) {
                      form.setValue('Destination.Slug', value)
                      form.trigger('Destination.Slug').then((value) => {
                        if (value) {
                          refetchTargetDestinations()
                        }
                      })
                    }
                  }}
                  onSelect={(value) => {
                    form.setValue('Destination', value)
                  }}
                />
              </div>
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col span={{ sm: 6, md: 3 }}>
          <div className='relative'>
            <RiCalendarEventLine
              size={20}
              className='absolute top-1/2 left-0 z-10 mx-2 -translate-y-1/2'
            />
            <FlightCalendar
              onDateSelect={(dates) => {
                const departureDate = dayjs.utc(dates[0]).startOf('day')
                const returnDate = dayjs.utc(dates[1]).startOf('days')

                form.setValue('DepartureDate', departureDate.toDate())

                if (returnDate.isValid()) {
                  form.setValue('ReturnDate', returnDate.toDate())
                } else {
                  form.setValue(
                    'ReturnDate',
                    departureDate.add(2, 'days').toDate()
                  )
                }

                form.trigger(['DepartureDate', 'ReturnDate'])
              }}
              tripKind={
                form.getValues().ActiveTripKind === '1'
                  ? 'one-way'
                  : 'round-trip'
              }
              defaultDates={[
                form.getValues('DepartureDate'),
                form.getValues('ReturnDate'),
              ]}
            />
          </div>
        </Grid.Col>
        <Grid.Col span={{ sm: 6, md: 2 }}>
          <div className='relative'>
            <RiUserLine
              size={20}
              className='absolute top-1/2 left-0 z-10 mx-2 -translate-y-1/2'
            />
            <PassengerDropdown
              initialValues={{
                ...form.getValues('PassengerCounts'),
              }}
              onCabinClassChange={(values) => {
                form.setValue('CabinClass', values)
                form.trigger('CabinClass')
              }}
              cabinClassValue={form.getValues('CabinClass').value}
              onChange={({ Adult, Child, Infant }) => {
                form.setValue('PassengerCounts', {
                  Adult: Adult || 1,
                  Child: Child || 0,
                  Infant: Infant || 0,
                })
              }}
            />
          </div>
        </Grid.Col>
        <Grid.Col span={{ md: 2 }}>
          <div>
            <SearchEngineButton title='Uçuş Ara' />
          </div>
        </Grid.Col>
      </Grid>
    </form>
  )
}
