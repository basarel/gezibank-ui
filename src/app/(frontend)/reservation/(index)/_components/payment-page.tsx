'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useQueryStates } from 'nuqs'
import dayjs from 'dayjs'
import { notifications } from '@mantine/notifications'
import cardValidation from 'card-validator'

import NextImage from 'next/image'
import { GrAmex } from 'react-icons/gr'

import { useForm, Controller, useWatch } from 'react-hook-form'
import {
  Anchor,
  Box,
  Button,
  Center,
  Group,
  LoadingOverlay,
  Modal,
  NativeSelect,
  SegmentedControl,
  Text,
  TextInput,
  UnstyledButton,
} from '@mantine/core'
import { useMutation } from '@tanstack/react-query'
import { range, upperFirst, useDisclosure, useMediaQuery } from '@mantine/hooks'
import clsx from 'clsx'
import { zodResolver } from '@hookform/resolvers/zod'

import { formatCreditCard } from 'cleave-zen'
import NumberFlow from '@number-flow/react'
import { RiCheckboxCircleFill, RiVisaLine } from 'react-icons/ri'

import { formatCurrency, yearList } from '@/libs/util'
import { useCheckoutMethods } from '@/app/(frontend)/reservation/checkout-query'
import { serviceRequest } from '@/network'
import {
  ParafParaPaymentResponse,
  PaymentResponseType,
} from '@/app/(frontend)/reservation/types'
import { reservationParsers } from '@/app/(frontend)/reservation/searchParams'

import { InstallmentTableModal, InstallmentSelect } from './instalment-table'
import { CheckoutCard } from '@/components/card'

import { MasterCardLogo, TroyCardLogo } from '@/components/logo/credit-cards'
import { Coupon } from '../../components/coupon'
import { useCouponQuery } from '../useCouponQuery'
import {
  HotelSummaryResponse,
  ProductPassengerApiResponseModel,
} from '@/types/passengerViewModel'
import { ParafParaView } from '../../components/paraf'

import paymentSegmentClasses from '@/styles/PaymentMethodSegment.module.css'
import {
  PaymentValidationSchemaTypes,
  paymentValidationSchema,
} from '@/libs/credit-card-utils'

import { MdCreditCard } from 'react-icons/md'
import { FlightAgreementContent } from '@/components/contracts/flightAgreement'
import { HotelAgreementContent } from '@/components/contracts/hotelAgreement'
import { BusAgreementContent } from '@/components/contracts/busAgreement'
import { TourAgreementContent } from '@/components/contracts/tourAgreement'
import { PrivacyAgreementContent } from '@/components/contracts/privacy'
import { useCheckoutContext } from '@/app/(frontend)/reservation/store'
import NotFound from '@/app/(frontend)/not-found'
import Loading from './loading'

enum PaymentMethodEnums {
  CreditCard,
}

const cardExpiredYearList = () =>
  yearList(dayjs().get('year'), dayjs().get('year') + 20).map((year) => ({
    label: '' + year,
    value: '' + year,
  }))

const cardMonths = () =>
  range(1, 12).map((month) => {
    return {
      label: '' + (month < 10 ? `0${month}` : month),
      value: '' + (month < 10 ? `0${month}` : month),
    }
  })

export const PaymentPageSection = () => {
  const [
    isOpenInstallmentTable,
    { open: openInstallmentTableModal, close: closeInstallmentTableModal },
  ] = useDisclosure(false)
  const [
    isAgreementModalOpened,
    { open: openAgreementModal, close: closeAgreementModal },
  ] = useDisclosure(false)
  const [
    isPrivacyAgreementModalOpen,
    { open: openPrivacyAgreementModal, close: closePrivacyAgreementModal },
  ] = useDisclosure(false)
  const isMobile = useMediaQuery('(max-width: 50em)')

  const [queryStrings] = useQueryStates(reservationParsers)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodEnums>(
    PaymentMethodEnums.CreditCard
  )
  const totalPriceStore = useCheckoutContext((s) => s.totalPrice)
  const updateTotalPrice = useCheckoutContext((s) => s.updateTotalPrice)

  const [paymentButtonSectionIsVisible, setPaymentButtonSectionIsVisible] =
    useState(true)

  const formMethods = useForm({
    resolver: zodResolver(paymentValidationSchema),
    defaultValues: {
      installment: 1,
    },
  })

  const {
    checkoutDataQuery: checkoutQuery,
    applyCouponPercentageMutation,
    revokeCouponPercentageMutation,
  } = useCheckoutMethods()

  const threeDformRef = useRef<HTMLFormElement>(null)

  const checkoutQueryMemoData = useMemo(
    () => checkoutQuery.data?.data,
    [checkoutQuery.data?.data]
  )

  const moduleName = useMemo(
    () => checkoutQueryMemoData?.viewBag.ModuleName,
    [checkoutQueryMemoData?.viewBag.ModuleName]
  ) as ProductPassengerApiResponseModel['viewBag']['ModuleName']

  const paymentMutation = useMutation<
    PaymentResponseType | null | undefined,
    null,
    PaymentValidationSchemaTypes
  >({
    mutationKey: ['payment-mutation'],
    mutationFn: async (data) => {
      const threedCallbackURL = `${window.location.origin}/reservation/callback/api`

      const paymentResponse = await serviceRequest<PaymentResponseType>({
        axiosOptions: {
          url: `api/payment/initProcess`,
          method: 'post',
          data: {
            ...data,
            cardNumber: data.cardNumber?.replaceAll(' ', ''),
            billingInfo: checkoutQueryMemoData?.paymentIndexModel.billingInfo,
            threeDCallbackUrl: threedCallbackURL,
            threeDSuccessURL: threedCallbackURL,
            threeDFailureURL: `${window.location.origin}/reservation/error/api`,
            searchToken: queryStrings.searchToken,
            sessionToken: queryStrings.sessionToken,
            productKey: queryStrings.productKey,
            reservable: checkoutQueryMemoData?.viewBag.Reservable ?? 0,
            installment: formMethods.getValues('installment'),
            moduleName,
          },
        },
      })

      return paymentResponse?.data
    },
  })
  const handlePrivilegedCardMutation = useMutation({
    mutationFn: async (data: PaymentValidationSchemaTypes) => {
      const paymentResponse = await serviceRequest<ParafParaPaymentResponse>({
        axiosOptions: {
          url: 'api/payment/privilegeCardHandler',
          method: 'post',
          data: {
            ...data,
            cardNumber: data.cardNumber?.replaceAll(' ', ''),
            billingInfo: checkoutQueryMemoData?.paymentIndexModel.billingInfo,
            threeDFailureURL: `${window.location.origin}/reservation/error/api`,
            searchToken: queryStrings.searchToken,
            sessionToken: queryStrings.sessionToken,
            productKey: queryStrings.productKey,
            reservable: checkoutQueryMemoData?.viewBag.Reservable ?? 0,
            installment: formMethods.getValues('installment'),
            useBonus: true,
            moduleName,
          },
        },
      })

      return paymentResponse
      // return parafParaResponseDummyData
    },
    onSuccess(query) {
      formMethods.setValue('installment', 1)
      formMethods.trigger('installment')
      if (!query?.success) {
        notifications.show({
          title: 'Sonuç Bulunamadı!',
          message: <div>Kart bilgilierinizi kontrol ediniz.</div>,
          withCloseButton: true,
          autoClose: 5000,
          position: 'top-center',
          color: 'red',
          classNames: {
            root: 'bg-red-200',
            description: 'text-black',
          },
        })
      }
      if (query?.success && query.data) {
        const cardNumber =
          formMethods.getValues('cardNumber')?.replaceAll(' ', '') ?? ''

        installmentTableSelectOptions.current = query.data
          ?.calculatedInstalmentList.installmentInfoList.length
          ? query.data.calculatedInstalmentList.installmentInfoList.filter(
              (item) => item.binList.includes(cardNumber.substring(0, 6))
            )
          : null

        setPaymentButtonSectionIsVisible(true)

        updateTotalPrice(
          (query?.data?.calculatedBonus &&
          query?.data?.calculatedBonus.remaining > 0
            ? query?.data?.calculatedBonus.remaining
            : query?.data?.total) ?? 0
        )
      }
    },
  })

  const installmentTableSelectOptions = useRef<
    | {
        amountPerInstallment: number
        bankName: string
        binList: string
        cardProgramName: string
        installmentCount: number
        totalAmount: number
        interestRate: number | null | undefined
      }[]
    | undefined
  >(null)
  const { applyCouponMutation, revokeCouponMutation } = useCouponQuery()
  const cardNumber = useWatch({
    control: formMethods.control,
    name: 'cardNumber',
  })
  const handleCardNumberChange = () => {
    const cardNumber = formMethods.getValues('cardNumber')?.replaceAll(' ', '')

    if (!cardNumber || cardNumber.length < 6 || !checkoutQueryMemoData) {
      installmentTableSelectOptions.current = null
      formMethods.setValue('installment', 1)
      return
    }

    installmentTableSelectOptions.current =
      checkoutQueryMemoData?.paymentIndexModel.installment.installmentInfoList.filter(
        (item) => item.binList.includes(cardNumber.substring(0, 6))
      )
  }

  useEffect(() => {
    if (paymentMutation.isSuccess && paymentMutation.data) {
      threeDformRef.current?.submit()
    }
  }, [paymentMutation.data, paymentMutation.isSuccess])
  useEffect(() => {
    if (
      checkoutQueryMemoData?.viewBag.SummaryViewDataResponser.summaryResponse
        .totalPrice
    ) {
      updateTotalPrice(
        checkoutQueryMemoData.viewBag.SummaryViewDataResponser.summaryResponse
          .totalPrice
      )
    }
  }, [
    checkoutQueryMemoData?.viewBag.SummaryViewDataResponser.summaryResponse
      .totalPrice,
    updateTotalPrice,
  ])

  const isCouponUsed = useMemo(
    () =>
      Array.isArray(
        checkoutQueryMemoData?.viewBag.SummaryViewDataResponser.summaryResponse
          .couponDiscountList
      ) &&
      checkoutQueryMemoData?.viewBag.SummaryViewDataResponser.summaryResponse
        .couponDiscountList.length > 0,
    [
      checkoutQueryMemoData?.viewBag.SummaryViewDataResponser.summaryResponse
        .couponDiscountList,
    ]
  )

  const reservationData = checkoutQueryMemoData
  const passengerData = reservationData?.treeContainer
  const firstPassengerFullName = passengerData?.childNodes[0].items[0].value
    ? `${upperFirst(passengerData?.childNodes[0].items[0].value.firstName.toLocaleLowerCase())} ${upperFirst(passengerData?.childNodes[0].items[0].value.lastName.toLocaleLowerCase())}`
    : `${upperFirst(passengerData?.childNodes[0]?.childNodes?.at(0)?.items.at(0)?.value?.firstName?.toLowerCase() ?? '')} ${upperFirst(passengerData?.childNodes[0].childNodes.at(0)?.items.at(0)?.value.lastName.toLocaleLowerCase() ?? '')}`

  const isDomestic = checkoutQuery.data?.data?.paymentIndexModel.isDomestic

  const hotelSummary =
    moduleName === 'HOTEL'
      ? (checkoutQuery.data?.data?.viewBag.SummaryViewDataResponser
          .summaryResponse as HotelSummaryResponse)
      : null

  const isHotelHighPrice =
    hotelSummary?.totalPrice && hotelSummary.totalPrice > 45000
  const isApril =
    dayjs(hotelSummary?.roomGroup.checkInDate).year() === 2026 &&
    dayjs(hotelSummary?.roomGroup.checkInDate).month() >= 3
  const showHotelDiscountOptions =
    moduleName === 'HOTEL' && isDomestic && isHotelHighPrice && isApril
  const handleCouponActions = async (promotionText?: string) => {
    if (promotionText && !isCouponUsed) {
      const applyResponse = await applyCouponMutation.mutateAsync({
        promotionText,
        moduleName,
      })

      if (applyResponse?.success) {
        handlePrivilegedCardMutation.reset()
        setPaymentMethod(PaymentMethodEnums.CreditCard)
        notifications.show({
          title: 'Tebrikler!',
          message: (
            <div>
              <span className='font-semibold underline'>
                {applyResponse?.data?.discountPrice.value
                  ? formatCurrency(applyResponse?.data?.discountPrice.value)
                  : null}
              </span>{' '}
              indirim uygulandı.
            </div>
          ),
          withCloseButton: true,
          autoClose: 5000,
          position: 'top-center',
          color: 'green',
          classNames: {
            root: 'bg-green-600',
            description: 'text-white',
            title: 'text-white',
            closeButton: 'text-white hover:bg-green-700/50',
          },
        })
      } else {
        notifications.show({
          title: 'Hata!',
          message: 'Kupon kodu geçersiz veya zaten kullanılmış.',
          withCloseButton: true,
          autoClose: 5000,
          position: 'top-center',
          color: 'red',
          classNames: {
            root: 'bg-red-400',
            description: 'text-white',
            title: 'text-white',
            closeButton: 'text-white hover:bg-red-500/50',
          },
        })
      }
    } else if (isCouponUsed) {
      const revokeResponse = await revokeCouponMutation.mutateAsync({
        moduleName,
      })

      if (revokeResponse?.success) {
        setPaymentMethod(PaymentMethodEnums.CreditCard)
        handlePrivilegedCardMutation.reset()
      }
    }

    const checkoutData = await checkoutQuery.refetch()

    updateTotalPrice(
      checkoutData.data?.data?.viewBag.SummaryViewDataResponser.summaryResponse
        .totalPrice ?? 0
    )
  }

  if (!reservationData || !queryStrings.productKey)
    return (
      <div className='flex w-full items-center justify-center'>
        <NotFound />
      </div>
    )

  return (
    <>
      <form
        onSubmit={formMethods.handleSubmit((data) => {
          paymentMutation.mutate(data)
        })}
        className='relative grid gap-3 md:gap-5'
      >
        <LoadingOverlay
          visible={
            paymentMutation.isPending || handlePrivilegedCardMutation.isPending
          }
        />

        {!checkoutQueryMemoData.viewBag.HotelCancelWarrantyPriceStatusModel
          .hotelWarrantyDiscountSelected && (
          <CheckoutCard>
            <Coupon
              loading={
                revokeCouponMutation.isPending || applyCouponMutation.isPending
              }
              isDomestic={isDomestic ?? false}
              isCouponUsed={isCouponUsed}
              onRevoke={handleCouponActions}
              onCouponSubmit={handleCouponActions}
              onDiscountApply={async (paymentMethod: string) => {
                if (moduleName === 'HOTEL') {
                  const response =
                    await applyCouponPercentageMutation.mutateAsync({
                      promotionText: paymentMethod,
                      moduleName,
                    })

                  if (response?.success) {
                    const checkoutData = await checkoutQuery.refetch()
                    updateTotalPrice(
                      checkoutData.data?.data?.viewBag.SummaryViewDataResponser
                        .summaryResponse.totalPrice ?? 0
                    )
                  }
                }
              }}
              onDiscountRevoke={async () => {
                if (moduleName === 'HOTEL') {
                  const response =
                    await revokeCouponPercentageMutation.mutateAsync({
                      moduleName,
                    })
                  if (response?.success) {
                    const checkoutData = await checkoutQuery.refetch()
                    updateTotalPrice(
                      checkoutData.data?.data?.viewBag.SummaryViewDataResponser
                        .summaryResponse.totalPrice ?? 0
                    )
                  }
                }
              }}
            />
          </CheckoutCard>
        )}

        <CheckoutCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <MdCreditCard size={22} className='text-blue-800' />
            <span className='text-xl font-bold'>Ödeme Bilgileri</span>
          </div>
          <div className='flex flex-col gap-3 md:gap-5'>
            <div className='grid items-center gap-3 sm:grid-cols-2'>
              <div>
                {/* <CreditCardForm form={formMethods} /> */}

                <div className='grid w-full gap-3'>
                  <Controller
                    control={formMethods.control}
                    name='cardOwner'
                    defaultValue={firstPassengerFullName}
                    render={({ field }) => {
                      return (
                        <TextInput
                          className='grid gap-1 text-sm'
                          {...field}
                          autoComplete='cc-name'
                          size='md'
                          label={
                            <div className='text-sm font-medium'>
                              Kart üzerindeki isim
                            </div>
                          }
                          placeholder='Kart Üzerindeki İsim'
                          error={
                            !!formMethods.formState.errors.cardOwner
                              ? formMethods.formState.errors.cardOwner.message
                              : null
                          }
                        />
                      )
                    }}
                  />
                  <Controller
                    control={formMethods.control}
                    name='cardNumber'
                    defaultValue=''
                    render={({ field }) => (
                      <TextInput
                        className='grid gap-1 text-sm font-medium'
                        {...field}
                        autoComplete='cc-number'
                        label={
                          <div className='text-sm font-medium'>
                            Kart Numarası
                          </div>
                        }
                        type='tel'
                        size='md'
                        error={
                          !!formMethods.formState.errors.cardNumber
                            ? formMethods.formState.errors.cardNumber.message
                            : null
                        }
                        // value={creditCardNumber}
                        onChange={({ currentTarget: { value } }) => {
                          const formattedValue = formatCreditCard(value).trim()
                          field.onChange(formattedValue)
                          handleCardNumberChange()
                        }}
                      />
                    )}
                  />
                  <div className='grid grid-cols-3 items-center gap-3'>
                    <div className='col-span-2'>
                      <div className='grid gap-1 text-sm'>
                        <div className='text-sm font-medium'>
                          Son kullanma tarihi
                        </div>
                        <div className='flex gap-3'>
                          <div className='w-full'>
                            <Controller
                              control={formMethods.control}
                              name='cardExpiredMonth'
                              render={({ field }) => (
                                <NativeSelect
                                  className='w-full'
                                  {...field}
                                  size='md'
                                  autoComplete='cc-exp-month'
                                  data={[
                                    { label: 'Ay', value: '' },
                                    ...cardMonths(),
                                  ]}
                                  error={
                                    !!formMethods.formState.errors
                                      .cardExpiredMonth
                                      ? formMethods.formState.errors
                                          .cardExpiredMonth.message
                                      : null
                                  }
                                />
                              )}
                            />
                          </div>
                          <div className='w-full'>
                            <Controller
                              control={formMethods.control}
                              name='cardExpiredYear'
                              render={({ field }) => (
                                <NativeSelect
                                  className='w-full'
                                  {...field}
                                  size='md'
                                  autoComplete='cc-exp-year'
                                  data={[
                                    { label: 'Yıl', value: '' },
                                    ...cardExpiredYearList(),
                                  ]}
                                  error={
                                    !!formMethods.formState.errors
                                      .cardExpiredYear
                                      ? formMethods.formState.errors
                                          .cardExpiredYear.message
                                      : null
                                  }
                                />
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-span-1'>
                      <Controller
                        control={formMethods.control}
                        name='cardCvv'
                        defaultValue=''
                        render={({ field }) => (
                          <TextInput
                            className='w-full text-sm font-medium'
                            {...field}
                            maxLength={
                              cardValidation.number(cardNumber).card?.code
                                .size || 3
                            }
                            label={
                              <div className='text-sm font-medium'>CVV</div>
                            }
                            placeholder='CVV'
                            size='md'
                            error={
                              !!formMethods.formState.errors.cardCvv
                                ? formMethods.formState.errors.cardCvv.message
                                : null
                            }
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>
                <div className='pt-5'>
                  <Text fz={'sm'} mb={0} className='text-gray-600'>
                    Taksit seçenekleri için kartınızın ilk 6 hanesini giriniz
                  </Text>
                  <UnstyledButton
                    type='button'
                    onClick={openInstallmentTableModal}
                    className='text-sm font-bold text-blue-800'
                  >
                    Taksit Tablosu
                  </UnstyledButton>
                </div>
              </div>
              <div className='hidden ps-10 sm:block'>
                <div className='flex items-center gap-5'>
                  <div>
                    <NextImage
                      src={'/threed-info.png'}
                      width={63}
                      height={29}
                      alt='3D Güvenli Ödeme Sistemi'
                    />
                  </div>
                  <div className='leading-none'>
                    <div className='text-xs text-gray-600'>
                      3D Güvenli Ödeme Sistemi
                    </div>
                    <strong>GÜVENLİ ALIŞVERİŞ</strong>
                  </div>
                </div>
                <div className='py-5 text-xs text-gray-600'>
                  GeziBank.com üzerinden yapılan işlemler, Google Trust Services
                  koruması altındadır.
                </div>
                <div>
                  <Group>
                    <div className='flex h-[30px] w-[50px] items-center justify-center rounded border'>
                      <RiVisaLine size={24} color='#1434CB' />
                    </div>
                    <div className='flex h-[30px] w-[50px] items-center justify-center rounded border'>
                      <MasterCardLogo size={20} />
                    </div>
                    <div className='flex h-[30px] w-[50px] items-center justify-center rounded border'>
                      <GrAmex size={24} color='#1174CB' />
                    </div>
                    <div className='flex h-[30px] w-[50px] items-center justify-center rounded border'>
                      <TroyCardLogo />
                    </div>
                  </Group>
                </div>
              </div>
            </div>
            {checkoutQueryMemoData.paymentIndexModel &&
              installmentTableSelectOptions?.current &&
              installmentTableSelectOptions?.current.length > 0 &&
              checkoutQueryMemoData?.paymentIndexModel?.installment &&
              cardNumber && (
                <InstallmentSelect
                  value={formMethods.getValues('installment') ?? 1}
                  data={
                    paymentMethod === PaymentMethodEnums.CreditCard
                      ? handlePrivilegedCardMutation.data?.data
                          ?.calculatedInstalmentList.installmentInfoList.length
                        ? handlePrivilegedCardMutation.data?.data?.calculatedInstalmentList.installmentInfoList.filter(
                            (item) =>
                              item.binList.includes(
                                cardNumber
                                  .trim()
                                  .replaceAll(' ', '')
                                  .substring(0, 6)
                              )
                          )
                        : []
                      : checkoutQueryMemoData?.paymentIndexModel.installment.installmentInfoList.filter(
                          (item) =>
                            item.binList.includes(
                              cardNumber
                                .trim()
                                .replaceAll(' ', '')
                                .substring(0, 6)
                            )
                        )
                  }
                  onChange={(value) => {
                    formMethods.setValue('installment', value.installmentCount)
                    formMethods.trigger('installment')
                    updateTotalPrice(value.totalAmount)
                  }}
                />
              )}
          </div>
        </CheckoutCard>

        {paymentButtonSectionIsVisible && (
          <CheckoutCard>
            <Text className='pt-5 text-center md:px-10' fz={'sm'}>
              Ödemeyi tamamla butonuna tıkladığımda{' '}
              {moduleName !== 'TRANSFER' && (
                <>
                  <Anchor onClick={openAgreementModal} fz={'inherit'}>
                    Mesafeli Satış Sözleşmesini
                  </Anchor>
                   ve{' '}
                </>
              )}
              <Anchor fz='inherit' onClick={openPrivacyAgreementModal}>
                Gizlilik Sözleşmesini
              </Anchor>
               okuduğumu ve kabul ettiğimi onaylıyorum.
            </Text>
            <div className='flex justify-center'>
              {checkoutQueryMemoData ? (
                <div className='flex flex-col gap-3'>
                  <div className='flex items-center gap-3'>
                    <div className='text-sm'>Ödenecek Tutar:</div>
                    <div className='text-xl font-semibold'>
                      <NumberFlow
                        format={{
                          style: 'currency',
                          currency: 'TRY',
                          currencyDisplay: 'narrowSymbol',
                        }}
                        value={totalPriceStore}
                      />
                    </div>
                  </div>
                  <Button className='my-3' size='lg' radius='md' type='submit'>
                    Ödemeyi Tamamla
                  </Button>
                </div>
              ) : null}
            </div>
          </CheckoutCard>
        )}
      </form>

      <form
        ref={threeDformRef}
        action={paymentMutation.data?.action}
        method='POST'
        hidden
      >
        {paymentMutation.data && paymentMutation.isSuccess
          ? Object.keys(paymentMutation.data).map((input, index) => {
              const value = input as keyof PaymentResponseType

              return value !== 'action' ? (
                <input
                  key={index}
                  name={input}
                  defaultValue={
                    paymentMutation?.data ? paymentMutation?.data[value] : ''
                  }
                  readOnly
                />
              ) : null
            })
          : null}
      </form>
      {checkoutQueryMemoData?.paymentIndexModel.installment
        .installmentInfoList && (
        <Modal
          opened={isOpenInstallmentTable}
          onClose={closeInstallmentTableModal}
          title='Kartlara Göre Taksit Tablosu'
          size={'auto'}
          classNames={{
            body: 'md:px-3 px-1',
          }}
        >
          <InstallmentTableModal
            data={
              checkoutQueryMemoData?.paymentIndexModel.installment
                .installmentInfoList
            }
          />
        </Modal>
      )}
      <Modal
        opened={isAgreementModalOpened}
        onClose={closeAgreementModal}
        size={isMobile ? '100%' : '80%'}
        title='Mesafeli Satış Sözleşmesi'
      >
        {(() => {
          switch (moduleName) {
            case 'Flight':
              return (
                <FlightAgreementContent
                  customerFullName={firstPassengerFullName}
                />
              )

            case 'HOTEL':
              return (
                <HotelAgreementContent
                  customerFullName={firstPassengerFullName}
                />
              )

            case 'BUS':
              return (
                <BusAgreementContent
                  customerFullName={firstPassengerFullName}
                />
              )

            case 'TOUR':
              return <TourAgreementContent />

            case 'CARRENTAL':
              return (
                <>
                  <Box
                    visibleFrom='sm'
                    mih={800}
                    className='size-full'
                    component='iframe'
                    src='/car-rent-terms.pdf#toolbar=0&navpanes=0&scrollbar=0'
                  />
                  <Anchor
                    hiddenFrom='sm'
                    href='/car-rent-terms.pdf'
                    target='_blank'
                  >
                    PDF&apos;yi Yeni Sekmede Aç
                  </Anchor>
                </>
              )
            default:
              return null
          }
        })()}
      </Modal>
      <Modal
        opened={isPrivacyAgreementModalOpen}
        onClose={closePrivacyAgreementModal}
        size={isMobile ? '100%' : '80%'}
        title='Gizlilik Sözleşmesi'
      >
        <PrivacyAgreementContent />
      </Modal>
    </>
  )
}
