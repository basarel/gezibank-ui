'use client'

import { useMemo } from 'react'

import { useCheckoutMethods } from '@/app/(frontend)/reservation/checkout-query'
import { ProductPassengerApiResponseModel } from '@/types/passengerViewModel'

import { TourSummary } from '@/app/(frontend)/reservation/components/tour/summary'

const ReservationSummarySection = () => {
  const { checkoutData } = useCheckoutMethods()

  const checkoutDataMemo = useMemo(
    () => checkoutData,
    [checkoutData]
  ) as ProductPassengerApiResponseModel

  const moduleName = useMemo(
    () => checkoutDataMemo?.viewBag.ModuleName,
    [checkoutDataMemo?.viewBag.ModuleName]
  )

  if (!checkoutDataMemo) return <div></div>

  const { viewBag } = checkoutDataMemo

  return (
    <div className='relative'>
      {(() => {
        switch (moduleName?.toLowerCase()) {
          case 'tour':
            return <TourSummary data={viewBag} />
          default:
            return null // TODO: implement an error view
        }
      })()}
    </div>
  )
}

export { ReservationSummarySection }
