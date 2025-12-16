'use client'

import 'intl-tel-input/styles'

import { useMemo, useState } from 'react'
import { notFound, useRouter } from 'next/navigation'
import {
  useForm,
  useFieldArray,
  FormProvider,
  Controller,
} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Badge,
  Button,
  Checkbox,
  Collapse,
  Container,
  Input,
  LoadingOverlay,
  NativeSelect,
  Skeleton,
  TextInput,
  Title,
  UnstyledButton,
} from '@mantine/core'
import { notifications } from '@mantine/notifications'
import IntlTelInput from 'intl-tel-input/react'
import {
  dataTagErrorSymbol,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import clsx from 'clsx'
import { createSerializer, useQueryStates } from 'nuqs'
import dayjs from 'dayjs'
import { serviceRequest } from '@/network'

import { PassengerInformationForm } from '@/components/checkout/flight/passengers'
import { HotelPassengerInformationForm } from '@/components/checkout/hotel/passengers'

import {
  createCheckoutSchema,
  type CheckoutSchemaMergedFieldTypes,
} from '@/app/(frontend)/reservation/validations'
import {
  type FlightAdditionalDataSubGroup,
  type FlightReservationSummary,
  type InsuranceInfoApiResponse,
  type ProductPassengerApiResponseModel,
  type HotelSummaryResponse,
  GenderEnums,
  PassengerTypesEnum,
  PassengerTypesIndexEnum,
} from '@/types/passengerViewModel'
import { type FormErrors } from '@/types/form-errors'

const getFormErrors = (errors: FormErrors): { rootError?: string } => {
  const rootError =
    errors.passengers?.root?.message || errors.passengers?.message
  return { rootError }
}
import { useCheckoutMethods } from '@/app/(frontend)/reservation/checkout-query'

import { CheckoutCard } from '@/components/card'
import { reservationParsers } from '@/app/(frontend)/reservation/searchParams'

import { BillingForm } from '@/app/(frontend)/reservation/components/billing'

import NumberFlow from '@number-flow/react'

import { MdContactPhone } from 'react-icons/md'
import { RiAccountCircleFill } from 'react-icons/ri'
import { useCheckoutContext } from '@/app/(frontend)/reservation/store'
import { convertPassengerTitle } from '@/libs/passenger-title'
import { Route } from 'next'
import { useSession } from 'next-auth/react'
import { TourSummaryResponse } from '../../types'
import { useUserInfoQuery, useExternalLoginQuery } from '@/hooks/useUser'
import { TourExtraServices } from '../tour/extras'
import { EarlyReservationInsurance } from '../hotel/insurance-options'
import { FlightOptionalServices } from '../flight-optional-services'
import { TravelInsurancePackages } from '../travel-insurance'
import { useDisclosure } from '@mantine/hooks'
import { SocialLogin } from '@/app/(frontend)/auth/login/_components/social-login'
import { modals } from '@mantine/modals'
import {
  FaArrowRight,
  FaCheckCircle,
  FaRegUserCircle,
  FaUserCircle,
} from 'react-icons/fa'
import { LoginForm } from '@/app/(frontend)/auth/login/_components/login-form'
import {
  IoAddCircleOutline,
  IoClose,
  IoCloseCircle,
  IoCloseCircleOutline,
  IoLogInOutline,
} from 'react-icons/io5'
import { IoMdClose, IoMdLogIn } from 'react-icons/io'
import { BsArrowRight } from 'react-icons/bs'
import { motion, AnimatePresence } from 'framer-motion'

type IProps = {
  access_token?: string
  providerName?: string
}

export function CheckoutPassengerPage({ access_token, providerName }: IProps) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const [queryStrings] = useQueryStates(reservationParsers)
  const totalPriceStore = useCheckoutContext((s) => s.totalPrice)
  const updateTotalPrice = useCheckoutContext((s) => s.updateTotalPrice)
  const { checkoutDataQuery } = useCheckoutMethods()
  const session = useSession()

  const registeredPassengersQuery = useQuery({
    enabled: session.status === 'authenticated',
    queryKey: ['registered-passengers'],
    queryFn: async () => {
      const response = await serviceRequest<
        {
          _passengerId: number
          model_PassengerId: number
          declaredAge: number
          productType: number
          checkinDate: string
          calculationYearBased: boolean
          calculationYearType: number
          passengerId: number
          sequenceNo: number
          type: number
          gender: number
          firstName: string
          lastName: string
          middleName: null
          birthDate: string
          nationality: string
          nationality_Check: null
          citizenNo: string
          passportNo: string
          mobilePhoneNumber: string
          email: string
          isContact: boolean
          flightFrequencyNo: null
          notes: null
          passportValidityDate: string
          webUserId: number
          passportCountry: string
          groupOrderIndex: number
          passengerKey: null
          isRecord: boolean
          listFlightFrequencyAirline: []
          listFlightFrequencyNo: []
          registeredPassengerId: number
          isDontValidate: boolean
          hesCode: null
        }[]
      >({
        axiosOptions: {
          url: 'api/account/getSavedPassengers',
        },
      })

      return response
    },
  })
  const registerPassengersData = registeredPassengersQuery.data?.data
  const externalLoginQuery = useExternalLoginQuery({
    accessToken: access_token,
    providerName,
  })

  const authUserInfo = useUserInfoQuery({
    enabled:
      session.status === 'authenticated' && !externalLoginQuery.isLoading,
  })

  const registerPassengerSelect = ({
    index,
    passengerKey = '',
    checkinDate,
    model_PassengerId,
    type,
  }: {
    index: number
    passengerKey: string
    checkinDate: string
    model_PassengerId: ID
    type: number
  }) => {
    const passengers = registerPassengersData?.filter(
      (passenger) => passenger.type === type
    )

    return (
      passengers &&
      passengers.length > 0 && (
        <NativeSelect
          className='ms-auto mb-5 w-50'
          aria-label='Kayıtlı Yolcular'
          onChange={(event) => {
            const selectedPassenger = passengers.find(
              (passenger) =>
                passenger.registeredPassengerId === +event.currentTarget.value
            )

            if (selectedPassenger) {
              passengersFieldArray.update(index, {
                birthDate: dayjs(selectedPassenger.birthDate).toDate(),
                birthDate_day: dayjs(selectedPassenger.birthDate).format('DD'),
                birthDate_month: dayjs(selectedPassenger.birthDate).format(
                  'MM'
                ),
                birthDate_year: dayjs(selectedPassenger.birthDate).format(
                  'YYYY'
                ),
                calculationYearType: selectedPassenger.calculationYearType,
                checkinDate,
                declaredAge: selectedPassenger.declaredAge.toString(),
                firstName: selectedPassenger.firstName,
                gender: selectedPassenger.gender.toString(),
                hesCode: '',
                lastName: selectedPassenger.lastName,
                model_PassengerId,
                moduleName,
                passengerId: selectedPassenger.passengerId,
                passengerKey: passengerKey ?? '',
                registeredPassengerId: selectedPassenger.registeredPassengerId,
                type: selectedPassenger.type,
                citizenNo: selectedPassenger.citizenNo,
                nationality_Check: selectedPassenger.nationality_Check ?? false,
                passportCountry: selectedPassenger.passportCountry,
                passportNo: selectedPassenger.passportNo,
                passportValidityDate: selectedPassenger.passportValidityDate,
              })

              // @ts-expect-error we should improve our zod schema
              formMethods.trigger([`passengers.[${index}]`])
            }
          }}
          data={[
            { label: 'Kayıtlı Yolcu Seçiniz', value: '' },
            ...passengers.map((registerPassenger) => {
              return {
                label: `${registerPassenger.firstName} ${registerPassenger.lastName}`,
                value: registerPassenger.registeredPassengerId.toString(),
              }
            }),
          ]}
        />
      )
    )
  }

  const checkQueryData = useMemo(
    () => checkoutDataQuery?.data,
    [checkoutDataQuery?.data]
  )

  const moduleName = useMemo(
    () => checkoutDataQuery.data?.data?.viewBag.ModuleName,
    [checkoutDataQuery.data?.data?.viewBag.ModuleName]
  ) as ProductPassengerApiResponseModel['viewBag']['ModuleName']

  // Hotel modülünde isSingleMaleRestriction bilgisini al
  const isSingleMaleRestriction = useMemo(() => {
    if (moduleName?.toLowerCase() === 'hotel') {
      const summaryResponse = checkoutDataQuery.data?.data?.viewBag
        .SummaryViewDataResponser?.summaryResponse as HotelSummaryResponse
      return summaryResponse?.roomGroup?.isSingleMaleRestriction || false
    }
    return false
  }, [
    moduleName,
    checkoutDataQuery.data?.data?.viewBag.SummaryViewDataResponser
      ?.summaryResponse,
  ])
  const rooms = useMemo(() => {
    if (moduleName?.toLowerCase() === 'hotel') {
      const summaryResponse = checkoutDataQuery.data?.data?.viewBag
        .SummaryViewDataResponser?.summaryResponse as HotelSummaryResponse
      return summaryResponse?.roomGroup?.rooms || []
    }

    return []
  }, [
    moduleName,
    checkoutDataQuery.data?.data?.viewBag.SummaryViewDataResponser
      ?.summaryResponse,
  ])
  const childAge = useMemo(() => {
    if (moduleName?.toLowerCase() === 'tour') {
      const summaryResponse = checkoutDataQuery.data?.data?.viewBag
        .SummaryViewDataResponser?.summaryResponse as TourSummaryResponse
      return summaryResponse.childs?.[0] ?? 0
    }
    return undefined
  }, [
    moduleName,
    checkoutDataQuery.data?.data?.viewBag.SummaryViewDataResponser
      ?.summaryResponse,
  ])

  // Dinamik validasyon şeması oluştur
  const dynamicSchema = useMemo(() => {
    return createCheckoutSchema(isSingleMaleRestriction, rooms, childAge)
  }, [isSingleMaleRestriction, rooms, childAge])
  const formMethods = useForm({
    resolver: zodResolver(dynamicSchema),
  })

  const passengersFieldArray = useFieldArray({
    name: 'passengers',
    control: formMethods.control,
  })
  const initCheckoutMutation = useMutation({
    mutationFn: (data: CheckoutSchemaMergedFieldTypes) => {
      return serviceRequest<{
        status: 'error' | 'success'
        success: boolean
      }>({
        axiosOptions: {
          url: `/api/payment/checkoutAssets`,
          method: 'POST',
          data: {
            ...data,
            moduleName,
            searchToken: queryStrings.searchToken,
            sessionToken: queryStrings.sessionToken,
            productKey: queryStrings.productKey,
            reservable: checkQueryData?.data?.viewBag.Reservable,
          },
        },
      })
    },
    onSuccess: (response) => {
      if (!response?.success) {
        if (moduleName?.toLowerCase() === 'flight') {
          router.push('/bookerror?moduleName=Uçak')
        } else if (moduleName?.toLowerCase() === 'hotel') {
          router.push('/bookerror?moduleName=Otel')
        } else if (moduleName?.toLowerCase() === 'bus') {
          router.push('/bookerror?moduleName=Otobüs')
        } else if (moduleName?.toLowerCase() === 'transfer') {
          router.push('/bookerror?moduleName=Transfer')
        } else if (moduleName?.toLowerCase() === 'tour') {
          router.push('/bookerror?moduleName=Tur')
        } else {
          router.push('/bookerror?moduleName=Genel')
        }
      }
    },
  })
  const insuranceInfoQuery = useQuery({
    enabled: false,
    queryKey: [
      'insurance-info',
      checkQueryData?.data?.viewBag.Insurances?.logSearchToken,
      checkQueryData?.data?.viewBag.Insurances?.logSessionToken,
      checkQueryData?.data?.viewBag.Insurances?.sessionToken,
      checkQueryData?.data?.viewBag.Insurances?.traceId,
      moduleName,
    ],
    queryFn: async () => {
      const response = await serviceRequest<InsuranceInfoApiResponse>({
        axiosOptions: {
          url: 'api/product/getInsuranceInfo',
          method: 'get',
          params: {
            searchToken:
              checkQueryData?.data?.viewBag.Insurances?.logSearchToken,
            sessionToken:
              checkQueryData?.data?.viewBag.Insurances?.logSessionToken,
            productSessionToken:
              checkQueryData?.data?.viewBag.Insurances?.sessionToken,
            productSearchToken:
              checkQueryData?.data?.viewBag.Insurances?.traceId,
            modulName: moduleName,
            scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
            scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
            appName: process.env.NEXT_PUBLIC_APP_NAME,
          },
        },
      })

      return response
    },
  })

  const [insuranceSelected, setInsuranceSelected] = useState(false)
  const setInsuranceMutation = useMutation({
    mutationFn: async (isInsuranceActive: boolean) => {
      const response = await serviceRequest<number>({
        axiosOptions: {
          url: 'api/product/handleInsurance',
          method: 'post',
          data: {
            ...queryStrings,
            sessionToken: insuranceInfoQuery.data?.data?.sessionToken,
            scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
            scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
            appName: process.env.NEXT_PUBLIC_APP_NAME,
            totalPrice: totalPriceStore,
            insuranceId: insuranceInfoQuery.data?.data?.insurance.at(0)?.id,
            insuranceProductKey:
              insuranceInfoQuery.data?.data?.insurance.at(0)?.productKey,
            insurancePrice: isInsuranceActive
              ? insuranceInfoQuery.data?.data?.insurance.at(0)?.price.value
              : -(
                  insuranceInfoQuery?.data?.data?.insurance.at(0)?.price
                    ?.value ?? 0
                ),
            productSessionToken: queryStrings.sessionToken,
            productSearchToken: insuranceInfoQuery.data?.data?.logSearchToken,
            modulName: moduleName,
            isInsuranceActive,
          },
        },
      })
      return response
    },
    onSuccess(query, state) {
      if (
        query?.success &&
        query?.data &&
        insuranceInfoQuery.data?.data?.insurance[0]
      ) {
        setInsuranceSelected(state)
        updateTotalPrice(query?.data)
      } else {
        setInsuranceSelected(false)
      }
    },
    onError() {
      setInsuranceSelected(false)
    },
  })

  const passengerData = useMemo(
    () => checkQueryData?.data?.treeContainer.childNodes,
    [checkQueryData?.data?.treeContainer.childNodes]
  )

  if (
    checkoutDataQuery.isLoading ||
    authUserInfo.isLoading ||
    externalLoginQuery.isLoading
  ) {
    return null
  }

  if (!checkQueryData?.data || !checkoutDataQuery.data?.success) {
    notFound()
  }

  return (
    <div className='relative'>
      <FormProvider {...formMethods}>
        <form
          onSubmit={formMethods.handleSubmit(
            async (data) => {
              const requestCheckout =
                await initCheckoutMutation.mutateAsync(data)

              if (requestCheckout?.success) {
                const serialize = createSerializer(reservationParsers)
                const url = serialize('/reservation/payment', {
                  productKey: queryStrings.productKey,
                  searchToken: queryStrings.searchToken,
                  sessionToken: queryStrings.sessionToken,
                }) as Route

                queryClient.clear()
                router.push(url)
              }
            },
            (errors) => {
              const { rootError } = getFormErrors(errors as FormErrors)
              const errorMessage = rootError

              if (errorMessage) {
                notifications.show({
                  title: 'Otel Kısıtlaması',
                  message: (
                    <div dangerouslySetInnerHTML={{ __html: errorMessage }} />
                  ),
                  autoClose: 15000,
                  withCloseButton: true,
                  position: 'top-right',
                  classNames: {
                    root: 'bg-red-600',
                    title: 'text-white',
                    description: 'text-white',
                    closeButton: 'text-white',
                  },
                })
              }
            }
          )}
          className='relative grid gap-3 md:gap-5'
        >
          <CheckoutCard>
            <div className='flex items-center gap-3'>
              <div>
                <MdContactPhone size={20} className='text-blue-800' />
              </div>
              <span className='text-xl font-bold'>İletişim Bilgileri</span>
            </div>
            <div>
              <div className='grid gap-4 md:grid-cols-2'>
                <div>
                  <Controller
                    control={formMethods.control}
                    name='contactEmail'
                    defaultValue={
                      session.data?.user.email ??
                      authUserInfo.data?.data?.email ??
                      ''
                    }
                    render={({ field, fieldState }) => (
                      <TextInput
                        size='md'
                        label='E-posta'
                        type='email'
                        {...field}
                        error={fieldState.error?.message}
                      />
                    )}
                  />
                </div>
                <div>
                  <Input.Wrapper>
                    <Input.Label
                      htmlFor='contactGSM'
                      size='md'
                      className='text-md'
                    >
                      Telefon Numarası
                    </Input.Label>
                    <div
                      className='m_6c018570 mantine-Input-wrapper'
                      data-variant='default'
                    >
                      <Controller
                        control={formMethods.control}
                        defaultValue={
                          authUserInfo.data?.data?.mobilePhone ?? ''
                        }
                        name='contactGSM'
                        render={({ field }) => (
                          <IntlTelInput
                            {...field}
                            usePreciseValidation
                            ref={(ref) => field.ref(ref?.getInput())}
                            onChangeNumber={field.onChange}
                            inputProps={{
                              className: clsx(
                                'm_8fb7ebe7 mantine-Input-input py-5',
                                {
                                  'border-rose-500':
                                    !!formMethods.formState?.errors?.contactGSM,
                                }
                              ),
                              name: field.name,
                              id: 'contactGSM',
                              defaultValue:
                                authUserInfo.data?.data?.mobilePhone,
                            }}
                            initOptions={{
                              strictMode: true,
                              containerClass: 'w-full',
                              separateDialCode: true,
                              initialCountry: 'auto',
                              i18n: {
                                tr: 'Türkiye',
                                searchPlaceholder: 'Ülke adı giriniz',
                              },
                              geoIpLookup: (callback) => {
                                fetch('https://ipapi.co/json')
                                  .then((res) => res.json())
                                  .then((data) => callback(data.country_code))
                                  .catch(() => callback('tr'))
                              },
                            }}
                          />
                        )}
                      />
                    </div>
                    <Input.Error className={'pt-1'}>
                      {!!formMethods.formState?.errors?.contactGSM
                        ? formMethods.formState?.errors?.contactGSM?.message
                        : null}
                    </Input.Error>
                  </Input.Wrapper>
                </div>
              </div>
              <div className='col-span-2 pt-2'>
                <Checkbox
                  label='Fırsat ve kampanyalardan haberdar olmak istiyorum.'
                  {...formMethods.register('isInPromoList', {
                    value: !!checkQueryData?.data?.isInPromoList,
                  })}
                />
              </div>
            </div>
          </CheckoutCard>
          <AnimatePresence>
            {session.status !== 'authenticated' && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className='grid justify-between gap-4 overflow-hidden rounded-md border bg-orange-100 p-2 px-3 pr-8 text-center text-sm shadow md:flex md:flex-row md:items-center md:gap-0 md:gap-2 md:p-1 md:pr-8'
              >
                <div className='flex items-center gap-1 px-1 text-sm font-medium text-orange-800 md:text-sm'>
                  <span>
                    <IoMdLogIn
                      className='hidden text-orange-800 md:block'
                      size={21}
                    />
                  </span>
                  Giriş yaparak hızlı rezervasyon ve seyahat bilgilerinize kolay
                  erişim sağlayın.
                </div>
                <Button
                  variant='outline'
                  size='sm'
                  className='m-0 mx-auto flex w-50 items-center justify-center border-orange-800 bg-white text-center font-medium text-orange-800 transition-all md:mx-5 md:ms-auto md:w-auto md:justify-end'
                  onClick={() => {
                    modals.open({
                      title: 'Hızlı Giriş Yap',
                      children: <LoginForm />,
                    })
                  }}
                >
                  <span className='text-orange-800'>Giriş Yap</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
          <CheckoutCard>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}
            >
              <RiAccountCircleFill size={22} className='text-blue-800' />
              <span className='text-xl font-bold'>Yolcu Bilgileri</span>
            </div>
            <div className='grid gap-3'>
              {(() => {
                switch (moduleName.toLowerCase()) {
                  case 'hotel':
                    return (
                      <div>
                        {passengerData?.map((childNode, childNodeIndex) => {
                          return (
                            <div key={childNode.orderId}>
                              <Title order={3} size={'md'} pb={10}>
                                {childNodeIndex + 1}. Oda
                              </Title>
                              {childNode.childNodes.map(
                                (innerChildNode, innerChildNodeIndex, arr) => {
                                  const fields =
                                    innerChildNode.items.at(0)?.value
                                  const nodeIndex = fields?.model_PassengerId
                                    ? +fields?.model_PassengerId - 1
                                    : 0

                                  const passengerType =
                                    fields?.type || PassengerTypesEnum.Adult
                                  let fieldErrors
                                  if (formMethods.formState.errors.passengers) {
                                    fieldErrors =
                                      formMethods.formState?.errors?.passengers[
                                        nodeIndex
                                      ]
                                  }

                                  if (!fields) return null

                                  return (
                                    <div key={innerChildNode.orderId}>
                                      <div>
                                        <div className='flex justify-between gap-2 md:flex-row'>
                                          <Title
                                            order={5}
                                            pb={10}
                                            className='font-semibold'
                                          >
                                            {Number(innerChildNodeIndex) + 1}.{' '}
                                            {convertPassengerTitle(
                                              passengerType
                                            )}
                                          </Title>
                                          {registerPassengerSelect({
                                            index: nodeIndex,
                                            passengerKey: fields?.passengerKey,
                                            checkinDate: fields.checkinDate,
                                            model_PassengerId:
                                              fields?.model_PassengerId,
                                            type: passengerType,
                                          })}
                                        </div>
                                        <HotelPassengerInformationForm
                                          moduleName={moduleName}
                                          fieldProps={{
                                            isRecord: false,
                                            declaredAge:
                                              '' + fields.declaredAge,
                                            checkinDate: fields.checkinDate,
                                            moduleName,
                                            birthDate: new Date(
                                              fields?.birthDate
                                            ),
                                            calculationYearType:
                                              fields.calculationYearType,
                                            birthDate_day: '',
                                            birthDate_month: '',
                                            birthDate_year: '',
                                            citizenNo: '',
                                            firstName: fields.firstName,
                                            gender: '' + fields.gender,
                                            lastName: fields.lastName,
                                            hesCode: fields.hesCode || '',
                                            id:
                                              typeof fields?._passengerId ===
                                              'string'
                                                ? fields._passengerId
                                                : '' + nodeIndex,
                                            model_PassengerId:
                                              fields.model_PassengerId,
                                            passengerId:
                                              fields.model_PassengerId,
                                            passengerKey: fields.passengerKey,
                                            registeredPassengerId:
                                              fields.registeredPassengerId,
                                            type: passengerType,
                                            nationality_Check:
                                              fields.nationality_Check,
                                            passportCountry:
                                              fields.passportCountry
                                                ? fields.passportCountry
                                                : 'NL',
                                            passportNo: 'U412421521521',
                                            passportValidity_1: '',
                                            passportValidity_2: '',
                                            passportValidity_3: '',
                                            passportValidityDate: dayjs()
                                              .add(20, 'y')
                                              .toISOString(),
                                          }}
                                          error={fieldErrors}
                                          index={nodeIndex}
                                        />
                                      </div>
                                      {session.status === 'authenticated' && (
                                        <div className='my-4 md:my-2'>
                                          <Controller
                                            control={formMethods.control}
                                            // @ts-expect-error we should improved this sections
                                            name={`passengers.[${nodeIndex}].isRecord`}
                                            render={({ field }) => (
                                              <Checkbox
                                                label='Yolcu bilgilerini daha sonra kullanmak için kaydet.'
                                                onChange={(event) => {
                                                  field.onChange(event)
                                                }}
                                              />
                                            )}
                                          />
                                        </div>
                                      )}
                                      {innerChildNodeIndex < arr.length - 1 && (
                                        <hr className='m-5'></hr>
                                      )}
                                    </div>
                                  )
                                }
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )

                  default:
                    return checkQueryData?.data &&
                      passengerData?.length &&
                      checkQueryData.data?.treeContainer.childNodes?.[0]
                        .childNodes.length > 0 // transfer and flight passengers data have different values
                      ? passengerData?.[0].childNodes.map((item, index) => {
                          const field = item.items[0].value
                          const passengerType =
                            field?.type || PassengerTypesEnum.Adult
                          let fieldErrors
                          if (formMethods.formState.errors.passengers?.length) {
                            fieldErrors =
                              formMethods.formState?.errors?.passengers[index]
                          }

                          return (
                            <div key={index}>
                              {index > 0 && <hr className='m-5' />}
                              <div className='flex flex-col justify-between gap-2 md:flex-row'>
                                <Title order={2} size={'xl'} pb={15}>
                                  {(() => {
                                    switch (passengerType) {
                                      case 0:
                                        return 'Yetişkin'
                                      case 1:
                                        return 'Çocuk'
                                      case 2:
                                        return 'Bebek'
                                      case 3:
                                        return 'Yaşlı'
                                      case 4:
                                        return 'Asker'

                                      default:
                                        return PassengerTypesIndexEnum[
                                          passengerType
                                        ]
                                    }
                                  })()}
                                </Title>
                                {registerPassengerSelect({
                                  index,
                                  passengerKey: field?.passengerKey,
                                  checkinDate: field.checkinDate,
                                  model_PassengerId: field?.model_PassengerId,
                                  type: passengerType,
                                })}
                              </div>

                              <PassengerInformationForm
                                moduleName={moduleName}
                                fieldProps={{
                                  isRecord: false,
                                  declaredAge: '' + field.declaredAge,
                                  moduleName,
                                  checkinDate: field.checkinDate,
                                  calculationYearType:
                                    field.calculationYearType,
                                  firstName: field?.firstName || '',
                                  birthDate: new Date(field?.birthDate || ''),
                                  birthDate_day: '',
                                  birthDate_month: '',
                                  birthDate_year: '',
                                  gender:
                                    '' + (field?.gender ?? GenderEnums.Female),
                                  lastName: field?.lastName || '',
                                  id:
                                    typeof field?._passengerId === 'string'
                                      ? field._passengerId
                                      : '',
                                  passengerId: field?.passengerId ?? 0,
                                  model_PassengerId:
                                    field?.model_PassengerId ?? 0,
                                  nationality_Check: !!field?.nationality_Check,
                                  passengerKey: field?.passengerKey ?? '',
                                  registeredPassengerId:
                                    field?.registeredPassengerId ?? 0,
                                  type: passengerType,
                                  citizenNo: '',
                                  passportCountry:
                                    field?.passportCountry ?? 'tr',
                                  passportNo: field?.passportNo || '',
                                  passportValidity_1: '',
                                  passportValidity_2: '',
                                  passportValidity_3: '',
                                  passportValidityDate:
                                    field?.passportValidityDate,
                                  hesCode: field?.hesCode || '',
                                }}
                                index={index}
                                error={fieldErrors}
                              />
                              {session.status === 'authenticated' && (
                                <div className='my-4 md:my-2'>
                                  <Controller
                                    control={formMethods.control}
                                    // @ts-expect-error we should improved this sections
                                    name={`passengers.[${index}].isRecord`}
                                    render={({ field }) => (
                                      <Checkbox
                                        label='Yolcu bilgilerini daha sonra kullanmak için kaydet.'
                                        onChange={(event) =>
                                          field.onChange(event)
                                        }
                                      />
                                    )}
                                  />
                                </div>
                              )}
                            </div>
                          )
                        })
                      : passengerData?.map((item, index) => {
                          const field = item.items[0].value
                          const passengerType =
                            field?.type || PassengerTypesEnum.Adult
                          let fieldErrors
                          if (formMethods.formState.errors.passengers?.length) {
                            fieldErrors =
                              formMethods.formState?.errors?.passengers[index]
                          }

                          return (
                            <div key={index}>
                              <div className='flex flex-col justify-between gap-2 md:flex-row'>
                                <div className='mb-3 flex items-center gap-1 font-semibold'>
                                  <div className='font-bold'>{index + 1}.</div>
                                  <div>
                                    {moduleName.toLowerCase() === 'bus'
                                      ? field?.gender.toString() === '1'
                                        ? 'Kadın'
                                        : 'Erkek'
                                      : convertPassengerTitle(passengerType)}
                                  </div>
                                </div>
                                {registerPassengerSelect({
                                  index,
                                  passengerKey: field?.passengerKey,
                                  checkinDate: field.checkinDate,
                                  model_PassengerId: field?.model_PassengerId,
                                  type: passengerType,
                                })}
                              </div>
                              <PassengerInformationForm
                                moduleName={moduleName}
                                fieldProps={{
                                  isRecord: false,
                                  declaredAge: '' + field.declaredAge,
                                  checkinDate: field.checkinDate,
                                  moduleName,
                                  calculationYearType:
                                    field.calculationYearType,
                                  firstName: field?.firstName || '',
                                  birthDate: new Date(field?.birthDate || ''),
                                  birthDate_day: '',
                                  birthDate_month: '',
                                  birthDate_year: '',
                                  gender: '' + field?.gender,
                                  lastName: field?.lastName || '',
                                  id:
                                    typeof field?._passengerId === 'string'
                                      ? field._passengerId
                                      : '',
                                  passengerId: field?.passengerId ?? 0,
                                  model_PassengerId:
                                    field?.model_PassengerId ?? 0,
                                  nationality_Check: !!field?.nationality_Check,
                                  passengerKey: field?.passengerKey ?? '',
                                  registeredPassengerId:
                                    field?.registeredPassengerId ?? 0,
                                  type: passengerType,
                                  citizenNo: '',
                                  passportCountry:
                                    field?.passportCountry ?? 'tr',
                                  passportNo: field?.passportNo || '',
                                  passportValidity_1: '',
                                  passportValidity_2: '',
                                  passportValidity_3: '',
                                  passportValidityDate:
                                    field?.passportValidityDate,
                                  hesCode: field?.hesCode || '',
                                }}
                                index={index}
                                error={fieldErrors}
                              />
                              {session.status === 'authenticated' && (
                                <div className='my-4 md:my-2'>
                                  <Controller
                                    control={formMethods.control}
                                    // @ts-expect-error we should improved this sections
                                    name={`passengers.[${index}].isRecord`}
                                    render={({ field }) => (
                                      <Checkbox
                                        label='Yolcu bilgilerini daha sonra kullanmak için kaydet.'
                                        onChange={(event) =>
                                          field.onChange(event)
                                        }
                                      />
                                    )}
                                  />
                                </div>
                              )}
                              {index < passengerData.length - 1 && (
                                <hr className='m-4'></hr>
                              )}
                            </div>
                          )
                        })
                }
              })()}
            </div>
          </CheckoutCard>

          {/* Tour extra and optional services */}
          {/*  */}
          {moduleName === 'TOUR' &&
            checkQueryData.data.viewBag.AdditionalData &&
            checkQueryData.data.viewBag.AdditionalData.additionalData &&
            checkQueryData.data.viewBag.AdditionalData.additionalData.subGroups.filter(
              (firstSubGroup) =>
                firstSubGroup.subGroups.filter(
                  (secondSubGroup) => secondSubGroup.items.length > 0
                ).length > 0
            ).length > 0 && <TourExtraServices data={checkQueryData.data} />}
          {/*  */}
          {/* Tour extra and optional services */}

          {moduleName.toLowerCase() === 'hotel' &&
            checkQueryData?.data?.viewBag.HotelCancelWarrantyPriceStatusModel &&
            checkQueryData?.data?.viewBag.HotelCancelWarrantyPriceStatusModel
              .cancelWarrantyPrice > 0 && (
              <EarlyReservationInsurance
                data={
                  checkQueryData?.data?.viewBag
                    .HotelCancelWarrantyPriceStatusModel
                }
              />
            )}
          {moduleName === 'Flight' &&
            passengerData &&
            checkQueryData?.data?.viewBag?.AdditionalData &&
            checkQueryData?.data?.viewBag?.AdditionalData.additionalData &&
            checkQueryData?.data?.viewBag?.AdditionalData?.additionalData?.subGroups?.filter(
              (item) =>
                item.subGroups.find((item2) =>
                  item2.items.find(
                    (item3) =>
                      item3.code === 'XBAG' || item3.code === 'FrequentFlyer'
                  )
                )
            ).length > 0 && (
              <FlightOptionalServices
                flightInfos={
                  checkQueryData.data?.viewBag.SummaryViewDataResponser
                    .summaryResponse as FlightReservationSummary
                }
                data={
                  checkQueryData.data?.viewBag.AdditionalData.additionalData
                    .subGroups as FlightAdditionalDataSubGroup[]
                }
                passengers={passengerData}
                isLoading={
                  checkoutDataQuery.isLoading || checkoutDataQuery.isRefetching
                }
              />
            )}

          {insuranceInfoQuery.data?.data &&
            moduleName !== 'TRANSFER' &&
            moduleName !== 'TOUR' && (
              <TravelInsurancePackages
                insurance={insuranceInfoQuery.data?.data}
                onChange={(state) => {
                  setInsuranceMutation.mutate(state)
                }}
                isInsuranceSelected={insuranceSelected}
                isPending={setInsuranceMutation.isPending}
              />
            )}
          <CheckoutCard>
            <BillingForm />
          </CheckoutCard>
          <CheckoutCard>
            <div className='flex flex-col gap-2 pt-3 text-center text-sm'>
              <p>
                Tarihlerin ve saatlerin doğru olduğundan emin olmak için seyahat
                bilgilerinizi inceleyin.
              </p>
              {moduleName === 'Flight' && (
                <p>
                  Yazımınızı kontrol edin. Uçuş yolcularının isimleri, devlet
                  tarafından verilen fotoğraflı kimlikle tam olarak
                  eşleşmelidir.
                </p>
              )}
            </div>
            <div className='flex justify-center'>
              {checkQueryData.data ? (
                <div>
                  <div className='relative'>
                    <LoadingOverlay
                      overlayProps={{ radius: 'sm', blur: 2 }}
                      loaderProps={{ children: ' ' }}
                      visible={
                        checkoutDataQuery.isLoading ||
                        checkoutDataQuery.isRefetching
                      }
                    />
                    <div className='flex items-center justify-center gap-3'>
                      <div className='text-center text-sm'>Ödenecek Tutar:</div>
                      <div className='text-center'>
                        <NumberFlow
                          className='pt-1 text-center text-xl font-bold'
                          format={{
                            style: 'currency',
                            currency: 'TRY',
                            currencyDisplay: 'narrowSymbol',
                          }}
                          value={totalPriceStore}
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    className='my-4 min-w-[200px]'
                    size='md'
                    radius='md'
                    type='submit'
                    disabled={
                      checkoutDataQuery.isLoading ||
                      checkoutDataQuery.isRefetching
                    }
                  >
                    Ödemeye İlerle
                  </Button>
                </div>
              ) : null}
            </div>
          </CheckoutCard>
        </form>
      </FormProvider>
      <LoadingOverlay visible={initCheckoutMutation.isPending} />
    </div>
  )
}
