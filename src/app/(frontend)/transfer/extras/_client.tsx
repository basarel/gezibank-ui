'use client'

import { Fragment, Suspense, useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Alert,
  Button,
  Checkbox,
  Container,
  Divider,
  Skeleton,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createSerializer, useQueryStates } from 'nuqs'
import { Controller, useFieldArray, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Image } from '@mantine/core'

import { serviceRequest } from '@/network'
import {
  ExtraServicesType,
  TransferExtraApiResponseData,
} from '@/app/(frontend)/transfer/extras/types'
import { formatCurrency } from '@/libs/util'
import { TransferSearchEngineSchemaInfer } from '@/modules/transfer/searchParams.client'
import { transferExtraPageParams } from '@/modules/transfer/searchParams.extras'
import { reservationParsers } from '@/app/(frontend)/reservation/searchParams'
import { TransferExtraOptionsDetail } from '@/app/(frontend)/transfer/components/transfer-extraOptions-detail'
import { TransferVehicle } from '../types'
import { HiLocationMarker } from 'react-icons/hi'
import { IoChevronDown, IoChevronForwardSharp } from 'react-icons/io5'
import dayjs from 'dayjs'
import { MdDescription } from 'react-icons/md'
import { Route } from 'next'
import Breadcrumb from '@/app/breadcrumb'
import { StepBar } from '@/components/step-bar'

const transferExtraRequireFields = z.object({
  PickupInfo: z.string().nonempty(),
  PickupDescription: z.optional(z.string()),
  DropInfo: z.string().nonempty(),
  DropDescription: z.optional(z.string()),
  Extras: z.array(
    z
      .object({
        isSelected: z.boolean().default(false).optional(),
        id: z.string().or(z.number()).optional(),
      })
      .optional()
  ),
})

type TransferExtrasSchemaType = z.infer<typeof transferExtraRequireFields>

const ExtraPage = () => {
  const router = useRouter()
  const formActions = useForm({
    resolver: zodResolver(transferExtraRequireFields),
  })

  useFieldArray({
    control: formActions.control,
    name: 'Extras',
  })

  const [searchParams] = useQueryStates(transferExtraPageParams)
  const [transferSearchLocalStorage] =
    useLocalStorage<TransferSearchEngineSchemaInfer>({
      key: 'transfer-search-engine',
    })

  const extraDataQuery = useQuery({
    enabled: !!(searchParams && transferSearchLocalStorage),
    // enabled: false,
    queryKey: ['extraData', searchParams, transferSearchLocalStorage],
    queryFn: async () => {
      const response = await serviceRequest<TransferExtraApiResponseData>({
        axiosOptions: {
          url: 'api/transfer/extras',
          method: 'post',
          // headers: {
          //   'Content-Type': 'application/x-www-form-urlencoded',
          // },
          params: {
            PickupPointName: transferSearchLocalStorage.origin.PointName,
            PickupLocationName: transferSearchLocalStorage.origin.LocationName,
            PickupPointType: transferSearchLocalStorage.origin.Type,
            DropPointName: transferSearchLocalStorage.destination.PointName,
            DropLocationName:
              transferSearchLocalStorage.destination.LocationName,
            DropPointType: transferSearchLocalStorage.destination.Type,
            AppName: process.env.NEXT_PUBLIC_APP_NAME,
            ScopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
            ScopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
            ProductKey: searchParams.productKey,
            SessionToken: searchParams.sessionToken,
            SearchToken: searchParams.searchToken,
          },
        },
      })

      return response
    },
  })

  const reservationPageMutation = useMutation({
    mutationKey: ['transfer-reservation'],
    mutationFn: async (data: TransferExtrasSchemaType) => {
      const params = {
        PickupPointName: transferSearchLocalStorage.origin.PointName,
        PickupLocationName: transferSearchLocalStorage.origin.LocationName,
        PickupPointType: transferSearchLocalStorage.origin.Type,
        DropPointName: transferSearchLocalStorage.destination.PointName,
        DropLocationName: transferSearchLocalStorage.destination.LocationName,
        DropPointType: transferSearchLocalStorage.destination.Type,
        AppName: process.env.NEXT_PUBLIC_APP_NAME,
        ScopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
        ScopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
        ProductKey: transferData?.selectResponse.transferVehicle.productKey,
        SessionToken: searchParams.sessionToken,
        SearchToken: searchParams.searchToken,
        PickupInfo: data.DropInfo,
        PickupDescription: data.PickupDescription,
        DropInfo: data.DropInfo,
        DropDescription: data.DropDescription,
        ExtraServiceIds: data.Extras.filter((extra) => {
          return extra?.isSelected
        }).map((extra) => extra?.id),
        ExtraServiceInfo: data.Extras.filter((extra) => {
          return extra?.isSelected
        }).map((extra) => {
          return extra && extra.id ? { [extra?.id]: '' } : null
        }),
      }

      const response = await serviceRequest<TransferExtraApiResponseData>({
        axiosOptions: {
          url: 'api/transfer/reservation',
          method: 'post',
          params,
        },
      })

      return response
    },
    onSuccess: (query) => {
      const resParams = createSerializer(reservationParsers)

      const url = resParams('/reservation', {
        productKey: query?.data?.selectResponse.transferVehicle.productKey,
        sessionToken: searchParams.sessionToken,
        searchToken: searchParams.searchToken,
      }) as Route
      router.push(url)
    },
  })

  const transferData = extraDataQuery.data?.data
  const [totalPriceState, setTotalPrice] = useState<number>(0)

  const handleExtraSelect = (extra: ExtraServicesType, fieldState: boolean) => {
    const nextState = totalPriceState
    if (fieldState) {
      setTotalPrice(nextState + extra.priceWithMarkup.amount)
    } else {
      setTotalPrice(nextState - extra.priceWithMarkup.amount)
    }
  }

  const handleSubmit = (data: TransferExtrasSchemaType) => {
    reservationPageMutation.mutateAsync(data)
  }
  const extraOptionsDatas = transferData?.selectResponse.transferVehicle
  useEffect(() => {
    if (
      extraDataQuery.data?.data?.selectResponse.transferVehicle.transferData
        .bookDetail.priceWithMarkup.amount
    ) {
      setTotalPrice(
        extraDataQuery.data?.data?.selectResponse.transferVehicle.transferData
          .bookDetail.priceWithMarkup.amount
      )
    }
  }, [
    extraDataQuery.data?.data?.selectResponse.transferVehicle.transferData
      .bookDetail.priceWithMarkup.amount,
  ])

  if (extraDataQuery.isLoading || !extraDataQuery.data)
    return (
      <Container className='my-3 flex flex-col items-start gap-5 md:grid md:grid-cols-6'>
        <div className='col-span-4 grid gap-4'>
          <div className='grid gap-5 rounded-md border p-3 md:p-5'>
            <div className='md:col-span-2'>
              <Skeleton radius={'md'} h={200} />
            </div>
            <div className='flex flex-col gap-3 md:col-span-3'>
              <Skeleton radius={'md'} h={32} w='70%' />
              <Skeleton radius={'md'} h={20} w='50%' />
              <div className='flex gap-4'>
                <Skeleton radius={'md'} h={20} w={100} />
                <Skeleton radius={'md'} h={20} w={100} />
                <Skeleton radius={'md'} h={20} w={100} />
              </div>
              <Skeleton radius={'md'} h={20} w='40%' />
            </div>
            <div className='md:col-span-5'>
              <div className='grid gap-3 rounded-md bg-gray-50 p-3 md:grid-cols-2'>
                <div className='space-y-2'>
                  <Skeleton radius={'md'} h={16} w='30%' />
                  <Skeleton radius={'md'} h={24} w='80%' />
                </div>
                <div className='space-y-2'>
                  <Skeleton radius={'md'} h={16} w='30%' />
                  <Skeleton radius={'md'} h={24} w='80%' />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='hidden md:sticky md:top-1 md:col-span-2 md:grid md:w-full'>
          <div className='flex flex-col gap-3 rounded-md border bg-white p-4'>
            <Skeleton radius={'md'} h={28} w='60%' />
            <Skeleton radius={'md'} h={20} w='40%' className='ms-auto' />
            <Skeleton radius={'md'} h={1} />
            <Skeleton radius={'md'} h={60} />
          </div>
        </div>
      </Container>
    )

  if (
    !extraDataQuery.isLoading &&
    !(extraDataQuery?.data.data || extraDataQuery.data.success)
  )
    return (
      <div className='container max-w-2xl md:py-5'>
        <Alert variant='light' color='red' title='Data Alınmadı'>
          Ekstra verisi alınırkan bir hata oluştu.
        </Alert>
      </div>
    )

  const activeStep = 1
  const stepLabelsData = [
    { label: 'Transfer Seçimi' },
    { label: 'Transfer Detayı' },
    { label: 'Yolcu Bilgileri' },
    { label: 'Ödeme' },
  ]

  return (
    <Suspense>
      <form onSubmit={formActions.handleSubmit(handleSubmit)}>
        <div className='@container p-0'>
          <Container className='py-5'>
            <StepBar active={activeStep} stepLabels={stepLabelsData} />
            <div className='mb-5'>
              <Breadcrumb
                items={[
                  { title: 'Transfer', href: '/transfer' },
                  { title: `${extraOptionsDatas?.vehicleTitle}` },
                ]}
              />
            </div>
            <div className='grid grid-cols-12 items-start gap-3'>
              <div className='col-span-12 grid gap-3 md:col-span-8'>
                <div className='rounded-md border p-3'>
                  {extraOptionsDatas && (
                    <TransferExtraOptionsDetail
                      data={extraOptionsDatas as TransferVehicle}
                    />
                  )}
                </div>
                <div className='rounded-md border p-3'>
                  <div>
                    <Title
                      className='text-md flex items-center gap-2 @lg:text-xl'
                      order={3}
                    >
                      <HiLocationMarker className='text-blue-700' size={20} />

                      <span>
                        Alınış Yeri -{' '}
                        {transferData?.selectResponse.pickupPointName}
                      </span>
                    </Title>
                    <div className='grid gap-4 py-4'>
                      <div>
                        <Controller
                          control={formActions.control}
                          name='PickupInfo'
                          defaultValue=''
                          render={({ field, fieldState }) => {
                            return (
                              <TextInput
                                {...field}
                                size='md'
                                label={
                                  <div className='text-md'>Uçuş Numarası *</div>
                                }
                                error={fieldState.error?.message}
                                description={
                                  '*Sürücünüz uçuşunuzun durumunu inceleyecektir'
                                }
                                inputWrapperOrder={[
                                  'label',
                                  'input',
                                  'error',
                                  'description',
                                ]}
                              />
                            )
                          }}
                        />
                      </div>
                      <div>
                        <Controller
                          control={formActions.control}
                          name='PickupDescription'
                          defaultValue=''
                          render={({ field, fieldState }) => {
                            return (
                              <Textarea
                                {...field}
                                size='md'
                                error={fieldState.error?.message}
                                label='Açıklama'
                                description='İletmek istediğiniz notlar var ise bu alana girebilirsiniz.'
                                inputWrapperOrder={[
                                  'label',
                                  'input',
                                  'error',
                                  'description',
                                ]}
                              />
                            )
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Title
                      className='text-md flex items-center gap-2 @lg:text-xl'
                      order={3}
                    >
                      <HiLocationMarker className='text-blue-700' size={20} />
                      <span>
                        Bırakılış Yeri -{' '}
                        {transferData?.selectResponse.dropPointName}
                      </span>
                    </Title>
                    <div className='grid gap-4 py-4'>
                      <div>
                        <Controller
                          control={formActions.control}
                          name='DropInfo'
                          defaultValue=''
                          render={({ field, fieldState }) => (
                            <TextInput
                              {...field}
                              size='md'
                              label={
                                <div className='text-md'>
                                  Alınış Yeri Bilgisi *
                                </div>
                              }
                              error={fieldState.error?.message}
                              description={'Adres Bilgisi'}
                              inputWrapperOrder={[
                                'label',
                                'error',
                                'input',
                                'description',
                              ]}
                            />
                          )}
                        />
                      </div>
                      <div>
                        <Controller
                          control={formActions.control}
                          name='DropDescription'
                          defaultValue=''
                          render={({ field }) => (
                            <Textarea
                              {...field}
                              size='md'
                              label='Açıklama'
                              description='İletmek istediğiniz notlar var ise bu alana girebilirsiniz.'
                              inputWrapperOrder={[
                                'label',
                                'error',
                                'input',
                                'description',
                              ]}
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {transferData?.selectResponse.transferVehicle.transferData
                  .bookDetail.extraServices &&
                  transferData?.selectResponse.transferVehicle.transferData
                    .bookDetail.extraServices.length > 0 && (
                    <div className='rounded-md border p-3'>
                      <Title order={5}>
                        Aşağıda istediğiniz ek hizmeti seçebilirsiniz.
                      </Title>

                      <div className='my-2 rounded border p-3'>
                        {transferData?.selectResponse.transferVehicle.transferData.bookDetail.extraServices.map(
                          (extra, extraIndex, extraData) => {
                            const lastItem = extraData.length - 1 === extraIndex
                            return (
                              <Fragment key={extra.id}>
                                <div>
                                  <div className='flex justify-between'>
                                    <div>
                                      <Controller
                                        control={formActions.control}
                                        name={`Extras.${extraIndex}.isSelected`}
                                        disabled={
                                          extra.priceWithMarkup.amount === 0
                                        }
                                        render={({
                                          field: { onChange },
                                          fieldState,
                                        }) => (
                                          <Checkbox
                                            onChange={(event) => {
                                              handleExtraSelect(
                                                extra,
                                                event.target.checked
                                              )
                                              onChange(event)
                                            }}
                                            label={extra.title}
                                            value={'' + extra.id}
                                          />
                                        )}
                                      />
                                      <input
                                        type='hidden'
                                        {...formActions.register(
                                          `Extras.${extraIndex}.id`
                                        )}
                                        value={extra.id}
                                      />
                                    </div>
                                    <div>
                                      {formatCurrency(
                                        extra.priceWithMarkup.amount
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {!lastItem ? <Divider my={'md'} /> : null}
                              </Fragment>
                            )
                          }
                        )}
                      </div>
                    </div>
                  )}
              </div>
              <div className='sticky col-span-12 hidden w-full rounded-md border p-3 md:top-1 md:col-span-4 md:grid'>
                <div className='grid gap-3'>
                  <div className='hidden items-center gap-3 border-b pb-2 text-lg font-semibold md:flex'>
                    <MdDescription size={22} className='text-blue-800' />
                    <div>Seyahat Özeti</div>
                    <IoChevronDown size={20} className='md:hidden' />
                  </div>

                  <div className='grid items-center justify-center'>
                    <div className='w-[250px]'>
                      <Image
                        alt={extraOptionsDatas?.vehicleTitle}
                        src={extraOptionsDatas?.transferInfo.vehiclePhotoUrl}
                        className='h-auto w-full rounded-md object-contain'
                      />
                    </div>
                  </div>
                  <Title order={3}>
                    {transferData?.selectResponse.transferVehicle.vehicleName}
                  </Title>
                  <div>
                    Maks.{' '}
                    {
                      transferData?.selectResponse.transferVehicle.transferInfo
                        .transferMax.pax
                    }
                    , Maks.{' '}
                    {
                      transferData?.selectResponse.transferVehicle.transferInfo
                        .transferMax.suitcase
                    }
                  </div>
                  <div className='grid grid-cols-2 items-baseline rounded-md border p-2 py-4 text-sm text-gray-700'>
                    <div className='flex flex-col items-center text-center'>
                      <div className='font-bold'>Alış Bilgileri</div>
                      <div className='grid text-sm'>
                        <div className='font-medium'>
                          {dayjs(
                            transferData?.selectResponse.pickupDate
                          ).format('DD MMMM YYYY HH:mm')}
                        </div>
                        <div>
                          {' '}
                          {transferData?.selectResponse.pickupPointName}
                        </div>
                      </div>
                    </div>

                    <div className='relative flex flex-col items-center text-center'>
                      <div className='absolute top-1/2 left-0 h-16 -translate-y-1/2 border-l border-gray-300'></div>

                      <div className='font-bold'>Bırakış Bilgileri</div>
                      <div className='grid text-sm'>
                        <div>{transferData?.selectResponse.dropPointName}</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='my-3 flex items-center justify-between font-semibold'>
                  <div className='text-md font-semibold'>Toplam Tutar</div>
                  <div className='text-end text-lg font-bold'>
                    {formatCurrency(totalPriceState)}
                  </div>
                </div>
                <div className='pt-2'>
                  <Button
                    size='md'
                    radius={'md'}
                    type='submit'
                    fullWidth
                    loading={reservationPageMutation.isPending}
                  >
                    Devam et
                  </Button>
                </div>
              </div>
            </div>
          </Container>
        </div>
        <div className='fixed right-0 bottom-0 left-0 z-50 md:hidden'>
          <div className='flex items-center justify-between rounded-t-lg bg-white p-5 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3),0_-2px_4px_-2px_rgba(0,0,0,0.06)]'>
            <Title order={3}>{formatCurrency(totalPriceState)}</Title>
            <Button
              size='md'
              type='submit'
              radius={'md'}
              loading={reservationPageMutation.isPending}
              rightSection={<IoChevronForwardSharp />}
            >
              Devam et{' '}
            </Button>{' '}
          </div>
        </div>
      </form>
    </Suspense>
  )
}

export { ExtraPage }
