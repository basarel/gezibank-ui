'use client'

import {
  CyprusTransferApiResponse,
  CyprusFlight,
  CyprusTransfer,
} from '../types'
import { CyprusSummaryCard as BaseCyprusSummaryCard } from '@/components/cyprus/cyprus-summary-card'
import dayjs from 'dayjs'

type QueryParamsType = {
  checkInDate: Date | string | null
  checkOutDate: Date | string | null
  adults?: number
  children?: number
  isFlight?: boolean
  isTransfer?: boolean
}

type IProps = {
  transportData: CyprusTransferApiResponse | undefined
  selectedDepartureFlight?: CyprusFlight['flightSegmentList'][0]['flightList'][0]
  selectedReturnFlight?: CyprusFlight['flightSegmentList'][0]['flightList'][0]
  selectedTransfer?: CyprusTransfer['transferSegmentList'][0]
  queryParams: QueryParamsType
}

const CyprusSummaryCard: React.FC<IProps> = ({
  transportData,
  selectedDepartureFlight,
  selectedReturnFlight,
  selectedTransfer,
  queryParams,
}) => {
  if (!transportData) {
    return null
  }

  const hotel = transportData?.hotelInfo?.hotelInfo?.hotel

  const departureFlightFirstDetail =
    selectedDepartureFlight?.flightDetails?.at(0)
  const departureFlightLastDetail =
    selectedDepartureFlight?.flightDetails?.at(-1)
  const returnFlightFirstDetail = selectedReturnFlight?.flightDetails?.at(0)
  const returnFlightLastDetail = selectedReturnFlight?.flightDetails?.at(-1)
  const departureConnectionCount =
    (selectedDepartureFlight?.flightDetails?.length ?? 0) - 1
  const returnConnectionCount =
    (selectedReturnFlight?.flightDetails?.length ?? 0) - 1
  const departureConnections =
    selectedDepartureFlight?.flightDetails
      ?.slice(0, -1)
      .map((f) => f.destination) ?? []
  const returnConnections =
    selectedReturnFlight?.flightDetails
      ?.slice(0, -1)
      .map((f) => f.destination) ?? []
  const getDepartureDateTime = (detail: typeof departureFlightFirstDetail) => {
    if (!detail?.departureDate || !detail?.departureTime) return undefined
    return dayjs(
      `${detail.departureDate} ${detail.departureTime}`
    ).toISOString()
  }

  const getArrivalDateTime = (detail: typeof departureFlightFirstDetail) => {
    if (!detail?.arrivalDate || !detail?.arrivalTime) return undefined
    return dayjs(`${detail.arrivalDate} ${detail.arrivalTime}`).toISOString()
  }

  return (
    <BaseCyprusSummaryCard
      data={{
        hotel: {
          name: hotel?.name,
          address: hotel?.address,
          images: hotel?.images,
          meal_type: hotel?.meal_type,
        },
        checkInDate: queryParams.checkInDate || new Date(),
        checkOutDate: queryParams.checkOutDate || new Date(),
        adults: queryParams.adults,
        children: queryParams.children,
        departureFlight:
          departureFlightFirstDetail && departureFlightLastDetail
            ? {
                airline: departureFlightFirstDetail.airline,
                flightNo: departureFlightFirstDetail.flightNo,
                classType: departureFlightFirstDetail.classType,
                departureTime:
                  getDepartureDateTime(departureFlightFirstDetail) || '',
                arrivalTime:
                  getArrivalDateTime(departureFlightLastDetail) || '',
                origin: departureFlightFirstDetail.origin || '',
                destination: departureFlightLastDetail.destination || '',
                connectionCount:
                  departureConnectionCount > 0
                    ? departureConnectionCount
                    : undefined,
                connections: departureConnections,
              }
            : undefined,
        returnFlight:
          returnFlightFirstDetail && returnFlightLastDetail
            ? {
                airline: returnFlightFirstDetail.airline,
                flightNo: returnFlightFirstDetail.flightNo,
                classType: returnFlightFirstDetail.classType,
                departureTime:
                  getDepartureDateTime(returnFlightFirstDetail) || '',
                arrivalTime: getArrivalDateTime(returnFlightLastDetail) || '',
                origin: returnFlightFirstDetail.origin || '',
                destination: returnFlightLastDetail.destination || '',
                connectionCount:
                  returnConnectionCount > 0 ? returnConnectionCount : undefined,
                connections: returnConnections,
              }
            : undefined,
        departureTransfer: selectedTransfer
          ? {
              transferTitle: selectedTransfer.transferTitle,
            }
          : undefined,
        returnTransfer: selectedTransfer
          ? {
              transferTitle: selectedTransfer.transferTitle,
            }
          : undefined,
        title: `Detaylar (Otel${queryParams.isFlight ? ' + Uçak' : ''}${queryParams.isTransfer ? ' + Transfer' : ''})`,
        isFlight: queryParams.isFlight,
        isTransfer: queryParams.isTransfer,
      }}
    />
  )
}

export { CyprusSummaryCard }
