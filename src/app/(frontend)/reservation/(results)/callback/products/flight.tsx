import dayjs from 'dayjs'
import { AspectRatio, Image } from '@mantine/core'
import NextImage from 'next/image'

import { CabinTypes } from '@/types/flight'
import { CheckoutCard } from '@/components/card'
import { FlightSummaryResponse } from '@/app/(frontend)/reservation/types'
import { Img, Link } from '@react-email/components'

type IProps = {
  data: FlightSummaryResponse
}

const isCabinTypeKey = (
  value: string | number
): value is keyof typeof CabinTypes =>
  Object.prototype.hasOwnProperty.call(CabinTypes, value)

export const FlightSummary: React.FC<IProps> = ({ data }) => {
  const formatDuration = (time?: string | null) => {
    if (!time) return ''
    const [hours = '0', minutes = '0'] = time.split(':')
    const hourNum = Number(hours)
    const minuteNum = Number(minutes)
    const hourLabel = hourNum > 0 ? `${hourNum} sa` : ''
    const minuteLabel = minuteNum > 0 ? `${minuteNum} dk` : ''
    return [hourLabel, minuteLabel].filter(Boolean).join(', ')
  }

  return (
    <>
      <Link href={`${process.env.SITE_URL}/kampanyalar?categoryId=158`}>
        <Img
          width={800}
          height={200}
          className='my-3'
          src='https://paraflystatic.mncdn.com/7/Content/transaction/arac.png'
        />
      </Link>
      <div className='grid gap-3'>
        {data.flightList.map((flight) => {
          const segments = flight.flightSegments
          const firstSegment = segments.at(0)
          const lastSegment = segments.at(-1)

          if (!firstSegment || !lastSegment) {
            return null
          }

          const marketingCode =
            firstSegment.marketingAirline?.code ||
            firstSegment.operatingAirline.code
          const originAirport = data.airportList[firstSegment.origin.code]
          const destinationAirport =
            data.airportList[lastSegment.destination.code]
          const travelDuration = formatDuration(flight.flightDetail.travelTime)
          const connectionCount = segments.length - 1
          const firstCountry = originAirport?.countryCode ?? null
          const isDomesticFlight =
            Boolean(firstCountry) &&
            segments.every((segment) => {
              const segmentOrigin =
                data.airportList[segment.origin.code]?.countryCode ?? null
              const segmentDestination =
                data.airportList[segment.destination.code]?.countryCode ?? null
              return (
                segmentOrigin === firstCountry &&
                segmentDestination === firstCountry
              )
            })

          const getCabinLabel = (value?: string | number | null) => {
            if (value == null) return ''

            if (isCabinTypeKey(value)) {
              const mapped = CabinTypes[value]
              if (mapped) {
                return String(mapped)
              }
            }

            if (typeof value === 'number') {
              const mapped = CabinTypes[value]
              if (mapped) {
                return String(mapped)
              }
            }

            return String(value)
          }

          return (
            <div key={flight.flightDetail.key}>
              <CheckoutCard
                title={
                  flight.flightDetail.groupId === 0
                    ? 'Gidiş Uçuşu'
                    : 'Dönüş Uçuşu'
                }
              >
                <div className='overflow-hidden rounded-2xl border border-slate-200 bg-white'>
                  <div className='flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-5 py-4'>
                    <div className='text-base font-semibold text-gray-900'>
                      {originAirport?.city ?? firstSegment.origin.code} (
                      {firstSegment.origin.code}) →{' '}
                      {destinationAirport?.city ?? lastSegment.destination.code}{' '}
                      ({lastSegment.destination.code})
                    </div>
                    <div className='flex items-center gap-3 text-sm text-gray-600'>
                      <span>{travelDuration || '-'}</span>
                      {connectionCount > 0 && (
                        <span className='rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-sm'>
                          {connectionCount} aktarma
                        </span>
                      )}
                    </div>
                  </div>
                  <div className='divide-y divide-slate-200'>
                    {segments.map((segment, index) => {
                      const segmentMarketingCode =
                        segment.marketingAirline?.code ??
                        segment.operatingAirline?.code ??
                        marketingCode
                      const segmentOperatingCode =
                        segment.operatingAirline?.code ?? ''
                      const segmentAirlineName =
                        data.airlineList[segmentMarketingCode] ||
                        data.airlineList[segmentOperatingCode] ||
                        segment.marketingAirline?.value ||
                        segment.operatingAirline?.value ||
                        segmentMarketingCode
                      const segmentOrigin =
                        data.airportList[segment.origin.code]
                      const segmentDestination =
                        data.airportList[segment.destination.code]
                      const segmentDepartureTime = dayjs(segment.departureTime)
                      const segmentArrivalTime = dayjs(segment.arrivalTime)
                      const segmentCabinLabel = getCabinLabel(
                        segment.cabinClass
                      )

                      return (
                        <div
                          key={`${segment.flightNumber}-${segment.origin.code}`}
                        >
                          <div className='flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between'>
                            <div className='flex items-start gap-3'>
                              <div className='relative h-10 w-10'>
                                <AspectRatio>
                                  <Image
                                    component={NextImage}
                                    alt={segmentAirlineName}
                                    src={`https://fulltripstatic.mncdn.com/a/airlines/${segmentMarketingCode}.png?width=auto`}
                                    fill
                                  />
                                </AspectRatio>
                              </div>
                              <div>
                                <div className='text-sm font-semibold text-gray-900'>
                                  {segmentAirlineName}
                                </div>
                                <div className='text-xs text-gray-600 uppercase'>
                                  {segmentOperatingCode}
                                  {segment.flightNumber}
                                  {segmentCabinLabel
                                    ? ` • ${segmentCabinLabel}`
                                    : ''}
                                </div>
                              </div>
                            </div>
                            <div className='flex flex-1 flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                              <div>
                                <div className='text-xs font-semibold text-gray-600 uppercase'>
                                  Kalkış ({segment.origin.code})
                                </div>
                                <div className='text-sm font-semibold text-gray-900'>
                                  {segmentOrigin?.city ?? segment.origin.code},{' '}
                                  {segmentOrigin?.country ?? ''}
                                </div>
                                <div className='text-xs text-gray-600'>
                                  {segmentDepartureTime.format(
                                    'DD.MM.YYYY HH:mm'
                                  )}
                                </div>
                              </div>
                              <div className='hidden h-px flex-1 bg-slate-200 md:block' />
                              <div className='text-left md:text-right'>
                                <div className='text-xs font-semibold text-gray-600 uppercase'>
                                  Varış ({segment.destination.code})
                                </div>
                                <div className='text-sm font-semibold text-gray-900'>
                                  {segmentDestination?.city ??
                                    segment.destination.code}
                                  {segmentDestination?.country
                                    ? `, ${segmentDestination.country}`
                                    : ''}
                                </div>
                                <div className='text-xs text-gray-600'>
                                  {segmentArrivalTime.format(
                                    'DD.MM.YYYY HH:mm'
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          {index < connectionCount && (
                            <div className='bg-slate-100 px-5 py-3 text-sm font-semibold text-gray-700'>
                              {index + 1}. Aktarma {segment.destination.code}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CheckoutCard>
            </div>
          )
        })}
      </div>
    </>
  )
}
