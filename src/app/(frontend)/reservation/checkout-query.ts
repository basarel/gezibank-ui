'use client'

import type { ProductPassengerApiResponseModel } from '@/types/passengerViewModel'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useQueryStates } from 'nuqs'

import { serviceRequest } from '@/network'
import { reservationParsers } from '@/app/(frontend)/reservation/searchParams'

const promotionText = 'LXMZ2HB66SGAES'

export interface BaggageRequestDataModel {
  uniqueIdentifier: string
  code: string
  data: string
  releatedObjectId: string
}

export const useCheckoutMethods = () => {
  const [{ searchToken, sessionToken, productKey }] =
    useQueryStates(reservationParsers)

  const checkoutDataQuery = useQuery({
    queryKey: ['checkout', [searchToken, sessionToken, productKey]],
    queryFn: async ({ signal }) => {
      const response = await serviceRequest<ProductPassengerApiResponseModel>({
        axiosOptions: {
          signal,
          url: `api/product/reservationData`,
          method: 'get',
          params: {
            searchToken,
            sessionToken,
            productKey,
          },
        },
      })

      return response
    },
  })

  const baggageMutation = useMutation({
    mutationKey: ['baggage-selection'],
    mutationFn: async (optionalServices: BaggageRequestDataModel[]) => {
      /* {
        summaryResponse: FlightReservationSummary | HotelSummaryResponse
      }*/
      const response = await serviceRequest<
        ProductPassengerApiResponseModel['viewBag']['SummaryViewDataResponser']
      >({
        axiosOptions: {
          url: 'api/product/baggageUpdate',
          method: 'post',
          data: {
            searchToken,
            sessionToken,
            productKey,
            priceCurrency: 'TRY',
            totalPrice:
              checkoutDataQuery?.data?.data?.viewBag.SummaryViewDataResponser
                .summaryResponse.totalPrice,
            optionalServices,
          },
        },
      })

      return response
    },
    onSuccess(query) {
      if (query?.success && query?.data?.summaryResponse) {
        checkoutDataQuery.refetch()
      }
    },
  })

  const earlyReservationInsuranceMutation = useMutation({
    mutationKey: ['early-reservation-mutation'],
    mutationFn: async (isChecked: boolean) => {
      const response = await serviceRequest({
        axiosOptions: {
          url: `api/product/${isChecked ? 'addHotelWarranty' : 'removeHotelWarranty'}`,
          method: 'post',
          data: {
            promationText: promotionText,
            searchToken,
            sessionToken,
            productKey,
            scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
            scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
            moduleName: 'HOTEL',
            appName: process.env.NEXT_PUBLIC_APP_NAME,
            totalPrice:
              checkoutDataQuery.data?.data?.viewBag.SummaryViewDataResponser
                .summaryResponse.totalPrice,
          },
        },
      })

      return response
    },
    onSuccess(query) {
      if (query?.success) {
        checkoutDataQuery.refetch()
      }
    },
  })

  const partialPaymentMutation = useMutation({
    mutationKey: ['partial-payment-mutation'],
    mutationFn: async (isChecked: boolean) => {
      const response = await serviceRequest({
        axiosOptions: {
          url: `api/promotion/${isChecked ? 'addHotelPartialPayment' : 'removeHotelPartialPayment'}`,
          method: 'post',
          data: {
            promationText: promotionText,
            searchToken,
            sessionToken,
            productKey,
            scopeName: process.env.NEXT_PUBLIC_SCOPE_NAME,
            scopeCode: process.env.NEXT_PUBLIC_SCOPE_CODE,
            moduleName: 'HOTEL',
            appName: process.env.NEXT_PUBLIC_APP_NAME,
            totalPrice:
              checkoutDataQuery.data?.data?.viewBag.SummaryViewDataResponser
                .summaryResponse.totalPrice,
          },
        },
      })

      return response
    },
    onSuccess(query) {
      if (query?.success) {
        checkoutDataQuery.refetch()
      }
    },
  })

  const applyCouponPercentageMutation = useMutation({
    mutationKey: ['discount-coupon'],
    mutationFn: async ({
      promotionText,
      moduleName,
    }: {
      promotionText: string
      moduleName: string
    }) => {
      const response = await serviceRequest<{
        index: number
        discountPrice: ServicePriceType
        discountInfo: {
          index: number
          type: number
        }
        isPartial: boolean
      }>({
        axiosOptions: {
          url: 'api/promotion/applyCouponPercentageMutation',
          method: 'post',
          data: {
            searchToken,
            sessionToken,
            productKey,
            passengerModelId: 1,
            infoIndex: 1,
            infoType: 0,
            moduleName,
            promationText: promotionText,
          },
        },
      })

      return response
    },
    onSuccess(query) {
      if (query?.success) {
        checkoutDataQuery.refetch()
      }
    },
  })

  const revokeCouponPercentageMutation = useMutation({
    mutationKey: ['discount-revoke'],
    mutationFn: async ({ moduleName }: { moduleName: string }) => {
      const response = await serviceRequest({
        axiosOptions: {
          method: 'post',
          url: 'api/promotion/revokeCouponPercentageMutation',
          data: {
            searchToken,
            sessionToken,
            productKey,
            passengerModelId: 1,
            moduleName,
          },
        },
      })

      return response
    },
    onSuccess(query) {
      if (query?.success) {
        checkoutDataQuery.refetch()
      }
    },
  })
  return {
    checkoutDataQuery,
    baggageMutation,
    checkoutData: checkoutDataQuery.data?.data,
    earlyReservationInsuranceMutation,
    partialPaymentMutation,
    applyCouponPercentageMutation,
    revokeCouponPercentageMutation,
  }
}
