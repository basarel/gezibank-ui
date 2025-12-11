'use client'

import { useQuery } from '@tanstack/react-query'
import { CyprusHotelDetailSearchParamTypes } from '../searchParams'
import { olRequest } from '@/network'
import {
  Button,
  CheckIcon,
  Grid,
  LoadingOverlay,
  Radio,
  ScrollArea,
  Skeleton,
  Stack,
  TextInput,
  Title,
  UnstyledButton,
  Collapse,
} from '@mantine/core'
import { CyprusTransferApiResponse } from '../types'
import { notFound } from 'next/navigation'
import { CyprusFlightSelect } from './_flight-select'
import { CyprusSummaryCard } from './_summary-card'
import { CyprusPriceCard } from '@/components/cyprus/cyprus-price-card'
import { useState } from 'react'
import { Drawer } from '@mantine/core'
import { MdDescription } from 'react-icons/md'
import { useDisclosure } from '@mantine/hooks'

import { useTransitionRouter } from 'next-view-transitions'
import { createSerializer } from 'nuqs'
import { reservationParsers } from '@/app/reservation/searchParams'
import { Route } from 'next'
import {
  useSelectedRoomDetailMutation,
  useSelectedRoomDetailQuery,
} from '../useSelectedRoomDetailQuery'
import { DatePickerInput, TimeInput } from '@mantine/dates'
import { Controller, useForm } from 'react-hook-form'

import { z } from '@/libs/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import 'dayjs/locale/tr'
import { formatCurrency } from '@/libs/util'
import { RiFlightTakeoffFill, RiFlightLandLine } from 'react-icons/ri'
import { CyprusLoading } from './_cyprusLoading'
import { StepBar } from '@/components/step-bar'
import { IoChevronDown } from 'react-icons/io5'
dayjs.extend(utc)
dayjs.locale('tr')
type IProps = {
  queryParams: CyprusHotelDetailSearchParamTypes
}

const transferInfoSchema = z.object({
  airline: z.string().min(1),
  airport: z.string().min(1),
  arravialHour: z.string().min(1),
  arravialMin: z.string().min(1),
  departureHour: z.string().min(1),
  departureMin: z.string().min(1),
  flightCode: z.string().min(1),
  flightDate: z.date(),
})

const transportFormSchema = z.object({
  departureTransferInformation: transferInfoSchema,
  arrivalTransferInformation: transferInfoSchema,
})
type TransformFormSchemaType = z.infer<typeof transportFormSchema>

const CyprusTransferSelect: React.FC<IProps> = ({ queryParams }) => {
  const form = useForm({
    resolver: zodResolver(transportFormSchema),
  })
  const [selectedDepartureFlightValue, setSelectedDepartureFlightValue] =
    useState<null | string>()
  const [selectedReturnFlightValue, setSelectedReturnFlightValue] = useState<
    null | string
  >()
  const [selectedTransferValue, setSelectedValueTransfer] = useState<
    string | null
  >()

  const [drawerOpened, { open: openDrawer, close: closeDrawer }] =
    useDisclosure(false)
  const [priceDetailsOpened, { toggle: togglePriceDetails }] =
    useDisclosure(false)
  const router = useTransitionRouter()

  const cyprusTransportDataQuery = useQuery({
    queryKey: ['cyprus-transfer-query', queryParams],
    queryFn: async () => {
      const response = await olRequest<CyprusTransferApiResponse>({
        apiAction: 'api/CyprusPackage/GetTransport',
        apiRoute: 'CyprusPackageService',
        data: {
          params: {
            ...queryParams,
            page: 1,
          },
          requestType:
            'Business.Models.CyprusPackage.TransportApiRequest, Business.Models.CyprusPackage, Version=1.0.8.0, Culture=neutral, PublicKeyToken=null',
          returnType:
            'Core.Models.ResultModels.RestResult`1[[Business.Models.CyprusPackage.View.TransportViewModel, Business.Models.CyprusPackage, Version=1.0.8.0, Culture=neutral, PublicKeyToken=null]], Core.Models, Version=1.1.78.0, Culture=neutral, PublicKeyToken=null',
        },
      })

      return response
    },
    select: (query) => {
      return query?.data
    },
  })
  const transportData = cyprusTransportDataQuery.data
  const isTransfer = transportData?.hotelInfo?.isTransfer
  const isFlight = transportData?.hotelInfo?.isFlight
  const isTransferOnly = !isFlight && isTransfer
  const hotel = transportData?.hotelInfo?.hotelInfo?.hotel
  const hotelPrice =
    transportData?.hotelInfo?.items?.find(
      (item) => item.key === queryParams.roomGroupKey
    )?.totalPrice.value ?? 0
  const departureFlight = transportData?.flights?.flightSegmentList[0]
  const returnFlight = transportData?.flights?.flightSegmentList[1]
  const transferList = transportData?.transfers?.transferSegmentList
  const selectedDepartureFlight = isFlight
    ? (departureFlight?.flightList.find((flightList) =>
        flightList.flightDetails.find(
          (detail) => detail.priceCode === selectedDepartureFlightValue
        )
      ) ?? departureFlight?.flightList.at(0))
    : undefined

  const selectedReturnFlight = isFlight
    ? (returnFlight?.flightList.find((flightList) =>
        flightList.flightDetails.find(
          (detail) => detail.priceCode === selectedReturnFlightValue
        )
      ) ?? returnFlight?.flightList.at(0))
    : undefined

  const selectedTransfer = isTransfer
    ? (transferList?.find(
        (transfer) => transfer.priceCode === selectedTransferValue
      ) ?? transferList?.at(0))
    : undefined

  const cyprusAddRemoveTransportQuery = useSelectedRoomDetailQuery({
    queryParams,
    selectedDepartureFlight,
    selectedReturnFlight,
    selectedTransfer,
    transportData,
    roomKey: queryParams.roomGroupKey,
  })

  const addRemoveMutation = useSelectedRoomDetailMutation()

  if (cyprusTransportDataQuery.isLoading) return <CyprusLoading />

  if (!cyprusTransportDataQuery.data) {
    // TODO: we may redirect homepage, or hotel search results
    notFound()
  }

  const handleReservation = async (data?: TransformFormSchemaType | null) => {
    const resParams = createSerializer(reservationParsers)

    const url = resParams('/reservation', {
      productKey: queryParams.roomGroupKey,
      searchToken: queryParams.searchToken,
      sessionToken: queryParams.sessionToken,
    }) as Route

    if (isTransferOnly) {
      await form.trigger()

      if (form.formState.isValid) {
        addRemoveMutation.mutate(
          {
            queryParams,
            roomKey: queryParams.roomGroupKey,
            selectedTransfer,
            transportData,
            arrivalTransferInformation: form.getValues(
              'arrivalTransferInformation'
            ),
            departureTransferInformation: form.getValues(
              'departureTransferInformation'
            ),
          },
          {
            onSuccess: (query) => {
              if (!!query?.data) {
                //router.push(url)
              }
            },
          }
        )
      }

      return
    }

    router.push(url)
  }
  const activeStep = 1
  const stepLabelsData = [
    { label: 'Otel Seçimi' },
    { label: 'Ulaşım Seçenekleri' },
    { label: 'Yolcu Bilgileri' },
    { label: 'Ödeme' },
  ]
  return (
    <>
      <div className='mt-1 md:mb-10'>
        <StepBar active={activeStep} stepLabels={stepLabelsData} />
      </div>

      <div className='grid grid-cols-3 gap-3 md:grid-cols-12'>
        <form
          onSubmit={form.handleSubmit(handleReservation)}
          className='col-span-12 md:col-span-8'
        >
          <div className='relative'>
            <LoadingOverlay
              visible={
                cyprusAddRemoveTransportQuery.isLoading ||
                cyprusAddRemoveTransportQuery.isFetching ||
                addRemoveMutation.isPending
              }
            />
            <div className='mb-3 md:mb-8'>
              <Title className='mb-2 text-xl font-bold text-gray-800 md:text-3xl'>
                Ulaşım Seçenekleri ( {queryParams.isFlight ? 'Uçak +' : ''}{' '}
                {queryParams.isTransfer ? 'Transfer' : ''} )
              </Title>
              <p className='text-sm text-gray-600'>
                Seyahat tarihlerinizdeki uçuş ve transfer seçeneklerini
                görüntüleyin ve rezervasyonunuza ekleyin.
              </p>
            </div>

            <Stack gap={'xl'}>
              {departureFlight && isFlight && (
                <div className='rounded-lg border border-gray-200 bg-white p-3 shadow-sm md:p-6'>
                  <div className='mb-4'>
                    <Title order={3} className='mb-2 font-bold text-gray-800'>
                      Gidiş Uçuşları
                    </Title>
                    <div className='flex items-center justify-between text-sm'>
                      <div className='flex items-center gap-2'>
                        <span>{departureFlight.origin}</span>
                        <RiFlightTakeoffFill />
                        <span>{departureFlight.destination}</span>
                      </div>
                      <span>
                        {dayjs(
                          departureFlight.flightList.at(0)?.departureDate ||
                            new Date()
                        ).format('DD MMMM YYYY dddd')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <CyprusFlightSelect
                      selectedValue={
                        selectedDepartureFlight?.flightDetails.at(0)
                          ?.priceCode ?? ''
                      }
                      onChange={setSelectedDepartureFlightValue}
                      flightData={departureFlight}
                    />
                  </div>
                </div>
              )}
              {returnFlight && isFlight && (
                <div className='rounded-lg border border-gray-200 bg-white p-3 shadow-sm md:p-6'>
                  <div className='mb-4'>
                    <Title order={3} className='mb-2 font-bold text-gray-800'>
                      Dönüş Uçuşları
                    </Title>
                    <div className='flex items-center justify-between text-sm'>
                      <div className='flex items-center gap-2'>
                        <span>{returnFlight.origin}</span>
                        <RiFlightLandLine />

                        <span>{returnFlight.destination}</span>
                      </div>
                      <span>
                        {dayjs(
                          returnFlight.flightList.at(0)?.departureDate ||
                            new Date()
                        ).format('DD MMMM YYYY dddd')}
                      </span>
                    </div>
                  </div>
                  <div>
                    <CyprusFlightSelect
                      selectedValue={
                        selectedReturnFlight?.flightDetails.at(0)?.priceCode ??
                        ''
                      }
                      onChange={setSelectedReturnFlightValue}
                      flightData={returnFlight}
                    />
                  </div>
                </div>
              )}

              {isTransfer && transferList && (
                <div>
                  <div className='rounded-lg border border-gray-200 bg-white p-3 shadow-sm md:p-6'>
                    <div className='mb-4'>
                      <Title order={3} className='mb-2 font-bold text-gray-800'>
                        Transfer Seçenekleri
                      </Title>
                      <p className='text-sm text-gray-600'>
                        Transfer seçenekleri gidiş ve dönüş transferini kapsar.
                        Otel-Havalimanı arası ulaşım için uygun seçeneği seçin.
                      </p>
                    </div>
                    <div className='pt-2'>
                      <ScrollArea.Autosize mah={400}>
                        <Radio.Group
                          name='transfer'
                          value={
                            selectedTransferValue ?? selectedTransfer?.priceCode
                          }
                          onChange={setSelectedValueTransfer}
                        >
                          <Stack gap='md'>
                            {transferList
                              ?.sort(
                                (a, b) =>
                                  (a.diffPrice?.value ?? 0) -
                                  (b.diffPrice?.value ?? 0)
                              )
                              .map((transfer) => {
                                const isSelected =
                                  (selectedTransferValue ??
                                    selectedTransfer?.priceCode) ===
                                  transfer.priceCode
                                return (
                                  <div
                                    key={transfer.priceCode}
                                    className={`rounded-lg border p-3 transition-all ${
                                      isSelected
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 bg-white hover:border-blue-300'
                                    }`}
                                  >
                                    <Radio.Card
                                      value={transfer.priceCode}
                                      className='border-0 bg-transparent p-0'
                                    >
                                      <div className='grid items-center justify-between gap-4 md:flex'>
                                        <div className='flex flex-1 items-center gap-3'>
                                          <Radio.Indicator icon={CheckIcon} />
                                          <div className='flex-1'>
                                            <div className='mb-1 font-semibold'>
                                              {transfer.transferTitle ||
                                                'Ekonomik Transfer'}
                                            </div>
                                            <div className='space-y-1 text-sm'>
                                              <div className='flex items-center gap-2'>
                                                <span>✓</span>
                                                <span>
                                                  Gidiş: Havalimanı →{' '}
                                                  {hotel?.name}
                                                </span>
                                              </div>
                                              <div className='flex items-center gap-2'>
                                                <span>✓</span>
                                                <span>
                                                  Dönüş: {hotel?.name} →
                                                  Havalimanı
                                                </span>
                                              </div>
                                              <div className='mt-2 text-xs'>
                                                Transfer, uçuş saatlerine göre
                                                hazır olacaktır.
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                        <div className='text-center'>
                                          <div className='text-xl font-bold text-gray-900'>
                                            {formatCurrency(
                                              transfer.diffPrice?.value ?? 0
                                            )}
                                          </div>
                                          <div className='mt-1 text-xs'>
                                            Gidiş + Dönüş
                                          </div>
                                        </div>
                                      </div>
                                    </Radio.Card>
                                  </div>
                                )
                              })}
                          </Stack>
                        </Radio.Group>
                      </ScrollArea.Autosize>
                    </div>
                  </div>
                  {isTransferOnly && (
                    <div className='mt-6 rounded-lg border border-gray-200 bg-white p-3 shadow-sm md:p-6'>
                      <Title order={3} className='mb-2 font-bold text-gray-800'>
                        Transfer İçin Uçuş Bilgilerinizi Girin
                      </Title>
                      <Stack gap={'lg'}>
                        <div>
                          <h4 className='mb-3 text-lg font-semibold text-gray-700'>
                            Gidiş Uçuş Bilgileri
                          </h4>
                          <Grid>
                            <Grid.Col span={{ base: 6, sm: 4 }}>
                              <Controller
                                control={form.control}
                                name='departureTransferInformation.flightDate'
                                render={({ field, fieldState }) => {
                                  return (
                                    <DatePickerInput
                                      valueFormat='DD MMMM YYYY'
                                      minDate={new Date()}
                                      error={fieldState.error?.message}
                                      label='Gidiş Uçuş Tarihi'
                                      size='sm'
                                      classNames={{
                                        input: 'shadow-sm',
                                        label:
                                          'text-sm font-medium text-gray-700',
                                      }}
                                      {...field}
                                      onChange={(dateValue) => {
                                        field.onChange(
                                          dayjs.utc(dateValue).toDate()
                                        )
                                        form.trigger(field.name)
                                      }}
                                    />
                                  )
                                }}
                              />
                            </Grid.Col>
                            <Grid.Col span={{ base: 6, sm: 4 }}>
                              <Controller
                                control={form.control}
                                name='departureTransferInformation.airport'
                                defaultValue=''
                                render={({ field, fieldState }) => {
                                  return (
                                    <TextInput
                                      label='Kalkış Havalimanı'
                                      error={fieldState.error?.message}
                                      classNames={{
                                        input: 'shadow-sm',
                                        label:
                                          'text-sm font-medium text-gray-700',
                                      }}
                                      size='sm'
                                      {...field}
                                      onChange={({
                                        currentTarget: { value },
                                      }) => {
                                        field.onChange(value)
                                        form.trigger(field.name)
                                      }}
                                    />
                                  )
                                }}
                              />
                            </Grid.Col>
                            <Grid.Col span={{ base: 6, sm: 4 }}>
                              <Controller
                                defaultValue=''
                                control={form.control}
                                name='departureTransferInformation.airline'
                                render={({ field, fieldState }) => {
                                  return (
                                    <TextInput
                                      label='Havayolu Firması'
                                      error={fieldState.error?.message}
                                      classNames={{
                                        input: 'shadow-sm',
                                        label:
                                          'text-sm font-medium text-gray-700',
                                      }}
                                      size='sm'
                                      {...field}
                                      onChangeCapture={({
                                        currentTarget: { value },
                                      }) => {
                                        field.onChange(value)
                                        form.trigger(field.name)
                                      }}
                                    />
                                  )
                                }}
                              />
                            </Grid.Col>
                            <Grid.Col span={{ base: 6, sm: 4 }}>
                              <Controller
                                control={form.control}
                                defaultValue=''
                                name='departureTransferInformation.flightCode'
                                render={({ field, fieldState }) => {
                                  return (
                                    <TextInput
                                      label='Uçuş Kodu'
                                      error={fieldState.error?.message}
                                      classNames={{
                                        input: 'shadow-sm',
                                        label:
                                          'text-sm font-medium text-gray-700',
                                      }}
                                      size='sm'
                                      {...field}
                                      onChange={({
                                        currentTarget: { value },
                                      }) => {
                                        field.onChange(value)
                                        form.trigger(field.name)
                                      }}
                                    />
                                  )
                                }}
                              />
                            </Grid.Col>
                            <Grid.Col span={{ base: 6, sm: 4 }}>
                              <TimeInput
                                error={
                                  form.formState.errors
                                    .departureTransferInformation?.departureHour
                                    ?.message ||
                                  form.formState.errors
                                    .departureTransferInformation?.departureMin
                                    ?.message
                                }
                                label='Uçuş Saati'
                                classNames={{
                                  input: 'shadow-sm',
                                  label: 'text-sm font-medium text-gray-700',
                                }}
                                onChange={(event) => {
                                  const currentValue = event.currentTarget.value
                                  const hour = currentValue.split(':')[0]
                                  const minute = currentValue.split(':')[1]

                                  form.setValue(
                                    'departureTransferInformation.departureHour',
                                    hour
                                  )
                                  form.setValue(
                                    'departureTransferInformation.departureMin',
                                    minute
                                  )

                                  form.trigger([
                                    'departureTransferInformation.departureHour',
                                    'departureTransferInformation.departureMin',
                                  ])
                                }}
                              />
                            </Grid.Col>
                            <Grid.Col span={{ base: 6, sm: 4 }}>
                              <TimeInput
                                label='Varış Saati'
                                error={
                                  form.formState.errors
                                    .departureTransferInformation?.arravialHour
                                    ?.message ||
                                  form.formState.errors
                                    .departureTransferInformation?.arravialMin
                                    ?.message
                                }
                                classNames={{
                                  input: 'shadow-sm',
                                  label: 'text-sm font-medium text-gray-700',
                                }}
                                onChange={(event) => {
                                  const currentValue = event.currentTarget.value
                                  const hour = currentValue.split(':')[0]
                                  const minute = currentValue.split(':')[1]

                                  form.setValue(
                                    'departureTransferInformation.arravialHour',
                                    hour
                                  )
                                  form.setValue(
                                    'departureTransferInformation.arravialMin',
                                    minute
                                  )
                                  form.trigger([
                                    'departureTransferInformation.arravialHour',
                                    'departureTransferInformation.arravialMin',
                                  ])
                                }}
                              />
                            </Grid.Col>
                          </Grid>
                        </div>
                        <div>
                          <h4 className='mb-3 text-lg font-semibold text-gray-700'>
                            Dönüş Uçuş Bilgileri
                          </h4>

                          <Grid>
                            <Grid.Col span={{ base: 6, sm: 4 }}>
                              <Controller
                                control={form.control}
                                name='arrivalTransferInformation.flightDate'
                                render={({ field, fieldState }) => {
                                  return (
                                    <DatePickerInput
                                      valueFormat='DD MMMM YYYY'
                                      minDate={new Date()}
                                      error={fieldState.error?.message}
                                      label='Dönüş Uçuş Tarihi'
                                      size='sm'
                                      classNames={{
                                        input: 'shadow-sm',
                                        label:
                                          'text-sm font-medium text-gray-700',
                                      }}
                                      {...field}
                                      onChange={(dateValue) => {
                                        field.onChange(
                                          dayjs.utc(dateValue).toDate()
                                        )
                                        form.trigger(field.name)
                                      }}
                                    />
                                  )
                                }}
                              />
                            </Grid.Col>
                            <Grid.Col span={{ base: 6, sm: 4 }}>
                              <Controller
                                control={form.control}
                                name='arrivalTransferInformation.airport'
                                defaultValue=''
                                render={({ field, fieldState }) => {
                                  return (
                                    <TextInput
                                      label='Kalkış Havalimanı'
                                      error={fieldState.error?.message}
                                      size='sm'
                                      classNames={{
                                        input: 'shadow-sm',
                                        label:
                                          'text-sm font-medium text-gray-700',
                                      }}
                                      {...field}
                                      onChange={({
                                        currentTarget: { value },
                                      }) => {
                                        field.onChange(value)
                                        form.trigger(field.name)
                                      }}
                                    />
                                  )
                                }}
                              />
                            </Grid.Col>
                            <Grid.Col span={{ base: 6, sm: 4 }}>
                              <Controller
                                control={form.control}
                                name='arrivalTransferInformation.airline'
                                defaultValue=''
                                render={({ field, fieldState }) => {
                                  return (
                                    <TextInput
                                      label='Havayolu Firması'
                                      classNames={{
                                        input: 'shadow-sm',
                                        label:
                                          'text-sm font-medium text-gray-700',
                                      }}
                                      size='sm'
                                      {...field}
                                      error={fieldState.error?.message}
                                      onChange={({
                                        currentTarget: { value },
                                      }) => {
                                        field.onChange(value)
                                        form.trigger(field.name)
                                      }}
                                    />
                                  )
                                }}
                              />
                            </Grid.Col>
                            <Grid.Col span={{ base: 6, sm: 4 }}>
                              <Controller
                                control={form.control}
                                name='arrivalTransferInformation.flightCode'
                                defaultValue=''
                                render={({ field, fieldState }) => {
                                  return (
                                    <TextInput
                                      label='Uçuş Kodu'
                                      classNames={{
                                        input: 'shadow-sm',
                                        label:
                                          'text-sm font-medium text-gray-700',
                                      }}
                                      size='sm'
                                      {...field}
                                      error={fieldState.error?.message}
                                      onChange={({
                                        currentTarget: { value },
                                      }) => {
                                        field.onChange(value)
                                        form.trigger(field.name)
                                      }}
                                    />
                                  )
                                }}
                              />
                            </Grid.Col>
                            <Grid.Col span={{ base: 6, sm: 4 }}>
                              <TimeInput
                                label='Uçuş Saati'
                                error={
                                  form.formState.errors
                                    .arrivalTransferInformation?.departureHour
                                    ?.message ||
                                  form.formState.errors
                                    .arrivalTransferInformation?.departureMin
                                    ?.message
                                }
                                classNames={{
                                  input: 'shadow-sm',
                                  label: 'text-sm font-medium text-gray-700',
                                }}
                                onChange={(event) => {
                                  const currentValue = event.currentTarget.value
                                  const hour = currentValue.split(':')[0]
                                  const minute = currentValue.split(':')[1]

                                  form.setValue(
                                    'arrivalTransferInformation.departureHour',
                                    hour
                                  )
                                  form.setValue(
                                    'arrivalTransferInformation.departureMin',
                                    minute
                                  )

                                  form.trigger([
                                    'arrivalTransferInformation.departureHour',
                                    'arrivalTransferInformation.departureMin',
                                  ])
                                }}
                              />
                            </Grid.Col>
                            <Grid.Col span={{ base: 6, sm: 4 }}>
                              <TimeInput
                                label='Varış Saati'
                                error={
                                  form.formState.errors
                                    .arrivalTransferInformation?.arravialHour
                                    ?.message ||
                                  form.formState.errors
                                    .arrivalTransferInformation?.arravialMin
                                    ?.message
                                }
                                classNames={{
                                  input: 'shadow-sm',
                                  label: 'text-sm font-medium text-gray-700',
                                }}
                                onChange={(event) => {
                                  const currentValue = event.currentTarget.value
                                  const hour = currentValue.split(':')[0]
                                  const minute = currentValue.split(':')[1]

                                  form.setValue(
                                    'arrivalTransferInformation.arravialHour',
                                    hour
                                  )
                                  form.setValue(
                                    'arrivalTransferInformation.arravialMin',
                                    minute
                                  )

                                  form.trigger([
                                    'arrivalTransferInformation.arravialHour',
                                    'arrivalTransferInformation.arravialMin',
                                  ])
                                }}
                              />
                            </Grid.Col>
                          </Grid>
                        </div>
                      </Stack>
                    </div>
                  )}
                </div>
              )}
            </Stack>
          </div>
        </form>
        <div className='col-span-12 md:col-span-4'>
          <div className='sticky top-4 grid gap-3'>
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
              <CyprusSummaryCard
                transportData={transportData}
                selectedDepartureFlight={selectedDepartureFlight}
                selectedReturnFlight={selectedReturnFlight}
                selectedTransfer={selectedTransfer}
                queryParams={queryParams}
              />
            </Drawer>
            <div className='hidden md:block'>
              <CyprusPriceCard
                hotelPrice={hotelPrice}
                departureFlightPrice={
                  selectedDepartureFlight?.flightDetails.at(0)?.diffPrice?.value
                }
                returnFlightPrice={
                  selectedReturnFlight?.flightDetails.at(0)?.diffPrice?.value
                }
                transferPrice={selectedTransfer?.diffPrice?.value}
                onCheckout={() => handleReservation()}
                loading={addRemoveMutation.isPending}
                isLoading={
                  cyprusAddRemoveTransportQuery.isLoading ||
                  cyprusAddRemoveTransportQuery.isFetching
                }
              />
            </div>
            <div className='hidden md:block'>
              <CyprusSummaryCard
                transportData={transportData}
                selectedDepartureFlight={selectedDepartureFlight}
                selectedReturnFlight={selectedReturnFlight}
                selectedTransfer={selectedTransfer}
                queryParams={queryParams}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='fixed right-0 bottom-0 left-0 z-20 md:hidden'>
        <Collapse in={priceDetailsOpened}>
          <div className='border-t bg-white px-4 py-3'>
            <div className='grid gap-2 text-sm'>
              <div className='flex items-center justify-between py-1'>
                <div className='text-gray-700'>Otel Fiyatı</div>
                <div className='font-semibold'>
                  {formatCurrency(hotelPrice)}
                </div>
              </div>

              {isFlight && selectedDepartureFlight && (
                <div className='flex items-center justify-between py-1'>
                  <div className='text-gray-700'>Gidiş Uçak Fiyatı</div>
                  <div className='font-semibold'>
                    {formatCurrency(
                      selectedDepartureFlight.flightDetails.at(0)?.diffPrice
                        ?.value ?? 0
                    )}
                  </div>
                </div>
              )}

              {isFlight && selectedReturnFlight && (
                <div className='flex items-center justify-between py-1'>
                  <div className='text-gray-700'>Dönüş Uçak Fiyatı</div>
                  <div className='font-semibold'>
                    {formatCurrency(
                      selectedReturnFlight.flightDetails.at(0)?.diffPrice
                        ?.value ?? 0
                    )}
                  </div>
                </div>
              )}

              {isTransfer && selectedTransfer && (
                <div className='flex items-center justify-between py-1'>
                  <div className='text-gray-700'>Transfer Fiyatı</div>
                  <div className='font-semibold'>
                    {formatCurrency(selectedTransfer.diffPrice?.value ?? 0)}
                  </div>
                </div>
              )}

              <div className='mt-3 border-t pt-3'>
                <div className='flex items-center justify-between text-lg font-semibold'>
                  <div className='text-gray-900'>Toplam</div>
                  <div className='text-primary'>
                    {formatCurrency(
                      hotelPrice +
                        (selectedDepartureFlight?.flightDetails.at(0)?.diffPrice
                          ?.value ?? 0) +
                        (selectedReturnFlight?.flightDetails.at(0)?.diffPrice
                          ?.value ?? 0) +
                        (selectedTransfer?.diffPrice?.value ?? 0)
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Collapse>

        <div className='flex items-center justify-between rounded-t-lg bg-white px-4 py-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3),0_-2px_4px_-2px_rgba(0,0,0,0.06)]'>
          <UnstyledButton
            onClick={togglePriceDetails}
            className='flex flex-col'
          >
            <div className='text-lg font-semibold'>
              {formatCurrency(
                hotelPrice +
                  (selectedDepartureFlight?.flightDetails.at(0)?.diffPrice
                    ?.value ?? 0) +
                  (selectedReturnFlight?.flightDetails.at(0)?.diffPrice
                    ?.value ?? 0) +
                  (selectedTransfer?.diffPrice?.value ?? 0)
              )}
            </div>
            <div className='text-xs text-blue-600 underline'>
              Fiyat Detayları
            </div>
          </UnstyledButton>
          <Button
            onClick={() => handleReservation(form.getValues())}
            loading={addRemoveMutation.isPending}
            variant='default'
            className='bg-primary border-none text-white'
            radius={'md'}
          >
            Ödemeye İlerle
          </Button>
        </div>
      </div>
    </>
  )
}

export { CyprusTransferSelect }
