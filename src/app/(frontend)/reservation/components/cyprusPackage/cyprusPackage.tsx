'use client'

import {
  CyprusPackageInfoApiResponse,
  ProductPassengerApiResponseModel,
} from '@/types/passengerViewModel'
import { CyprusSummaryCard } from '@/components/cyprus/cyprus-summary-card'
import { CyprusPriceCard } from '@/components/cyprus/cyprus-price-card'
import { useCheckoutContext } from '../../store'

type IProps = {
  data: ProductPassengerApiResponseModel['viewBag']
}

export const CyprusPackageSummarySection: React.FC<IProps> = ({ data }) => {
  const summaryResponse = data.SummaryViewDataResponser
    .summaryResponse as CyprusPackageInfoApiResponse

  const hotel = summaryResponse.roomGroup.hotel

  const segments = summaryResponse.segmentData ?? []
  let returnStartIndex = -1
  for (let i = 0; i < segments.length - 1; i++) {
    if (segments[i].destination !== segments[i + 1].origin) {
      returnStartIndex = i + 1
      break
    }
  }
  const finalDepartureSegments =
    returnStartIndex > 0
      ? segments.slice(0, returnStartIndex)
      : segments.slice(0, Math.ceil(segments.length / 2))
  const finalReturnSegments =
    returnStartIndex > 0
      ? segments.slice(returnStartIndex)
      : segments.slice(Math.ceil(segments.length / 2))
  const departureFlight =
    finalDepartureSegments.length > 0
      ? {
          ...finalDepartureSegments[0],
          arrivalTime:
            finalDepartureSegments[finalDepartureSegments.length - 1]
              ?.arrivalTime,
          destination:
            finalDepartureSegments[finalDepartureSegments.length - 1]
              ?.destination,
          connectionCount: finalDepartureSegments.length - 1,
          connections: finalDepartureSegments
            .slice(0, -1)
            .map((s) => s.destination),
        }
      : undefined
  const returnFlight =
    finalReturnSegments.length > 0
      ? {
          ...finalReturnSegments[0],
          arrivalTime:
            finalReturnSegments[finalReturnSegments.length - 1]?.arrivalTime,
          destination:
            finalReturnSegments[finalReturnSegments.length - 1]?.destination,
          connectionCount: finalReturnSegments.length - 1,
          connections: finalReturnSegments
            .slice(0, -1)
            .map((s) => s.destination),
        }
      : undefined

  const departureTransfer = summaryResponse.selectResponse?.[0]
  const returnTransfer = summaryResponse.selectResponse?.[1]
  const totalPrice =
    useCheckoutContext((s) => s.totalPrice) || summaryResponse.totalPrice || 0
  const hotelPrice = summaryResponse.roomGroup.totalPrice?.value ?? 0
  // console.log('summaryResponse',summaryResponse)
  return (
    <>
      <CyprusPriceCard
        hotelPrice={hotelPrice}
        totalPrice={totalPrice}
        departureFlightPrice={departureFlight?.diffPrice?.value}
        returnFlightPrice={returnFlight?.diffPrice?.value}
        transferPrice={
          departureTransfer?.diffPrice?.value ??
          returnTransfer?.diffPrice?.value
        }
        showButton={false}
      />
      <CyprusSummaryCard
        data={{
          hotel: {
            name: hotel?.name,
            address: hotel?.address,
            images: hotel?.images,
            meal_type: hotel?.meal_type || 'Konaklama',
          },
          checkInDate: summaryResponse.roomGroup.checkInDate,
          checkOutDate: summaryResponse.roomGroup.checkOutDate,
          departureFlight: departureFlight
            ? {
                airline: departureFlight.marketingAirline?.name,
                flightNumber: departureFlight.flightNumber,
                cabinClass: departureFlight.cabinClass,
                departureTime: departureFlight.departureTime,
                arrivalTime: departureFlight.arrivalTime,
                origin: departureFlight.origin,
                destination: departureFlight.destination,
              }
            : undefined,
          returnFlight: returnFlight
            ? {
                airline: returnFlight.marketingAirline?.name,
                flightNumber: returnFlight.flightNumber,
                cabinClass: returnFlight.cabinClass,
                departureTime: returnFlight.departureTime,
                arrivalTime: returnFlight.arrivalTime,
                origin: returnFlight.origin,
                destination: returnFlight.destination,
              }
            : undefined,
          departureTransfer: departureTransfer
            ? {
                vehicleName: departureTransfer.transferVehicle?.vehicleName,
                pickupLocationName: departureTransfer.pickupLocationName,
                dropLocationName: departureTransfer.dropLocationName,
              }
            : undefined,
          returnTransfer: returnTransfer
            ? {
                vehicleName: returnTransfer.transferVehicle?.vehicleName,
                pickupLocationName: returnTransfer.pickupLocationName,
                dropLocationName: returnTransfer.dropLocationName,
              }
            : undefined,
          showCancelWarranty: true,
          useCancelWarranty: summaryResponse.roomGroup.useCancelWarranty,
          title: 'Rezervasyon Detayları',
        }}
      />
    </>
  )
}
