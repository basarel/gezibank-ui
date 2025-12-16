import { Box, CheckIcon, Group, Radio, ScrollArea, Stack } from '@mantine/core'
import { CyprusFlight } from '../types'
import { formatCurrency } from '@/libs/util'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import { AirlineLogo } from '@/components/airline-logo'
import { MdOutlineAirplanemodeActive } from 'react-icons/md'

dayjs.extend(duration)

type IProps = {
  flightData: CyprusFlight['flightSegmentList'][0]
  onChange: (value: string) => void
  selectedValue: string
}

const CyprusFlightSelect: React.FC<IProps> = ({
  flightData,
  onChange,
  selectedValue,
}) => {
  const sortedFlights = flightData.flightList.sort((a, b) => {
    const priceA = a.flightDetails?.[0]?.totalPrice?.value ?? 0
    const priceB = b.flightDetails?.[0]?.totalPrice?.value ?? 0
    return priceA - priceB
  })
  // console.log('flightData',flightData)
  return (
    <ScrollArea.Autosize mah={300}>
      <Radio.Group value={selectedValue} onChange={onChange}>
        <Stack>
          {sortedFlights.map((flight, flightIndex) => {
            const firstFlight = flight.flightDetails[0]
            const lastFlight =
              flight.flightDetails[flight.flightDetails.length - 1]
            const hasTransfer = flight.flightDetails.length > 1
            const transferFlight = hasTransfer ? flight.flightDetails[1] : null
            const uniqueKey = `${firstFlight.priceCode}-${firstFlight.departureDate}-${firstFlight.departureTime}-${flightIndex}`
            if (!firstFlight || !lastFlight) return null
            const priceDifference = flight.flightDetails[0].diffPrice?.value
            return (
              <Radio.Card
                className='rounded-lg hover:border-blue-600 hover:bg-blue-50 hover:shadow-xl'
                key={uniqueKey}
                value={firstFlight.priceCode}
                p={'md'}
              >
                <div className='grid items-center gap-2 md:grid-cols-4'>
                  <div className='col-span-1 flex items-center gap-2'>
                    <AirlineLogo
                      airlineCode={firstFlight.airline}
                      alt={firstFlight.airline}
                    />
                    <div>{firstFlight.airline}</div>
                    <div>{firstFlight.flightNo}</div>
                  </div>
                  <div className='col-span-2'>
                    <div className='flex gap-2'>
                      <div>
                        <div className='text-xl leading-none font-semibold'>
                          {firstFlight.departureTime}
                        </div>
                        <div className='mt-1 text-center text-sm'>
                          {firstFlight.origin}
                        </div>
                      </div>
                      <div className='mt-2 grow'>
                        <div className='relative'>
                          {hasTransfer && (
                            <div className='absolute -top-5 right-0 left-0 flex items-center justify-center gap-1 text-xs'>
                              <div className='flex items-center gap-2 text-gray-600'>
                                {(() => {
                                  const departure = dayjs(
                                    `${firstFlight.departureDate} ${firstFlight.departureTime}`
                                  )
                                  const arrival = dayjs(
                                    `${lastFlight.arrivalDate} ${lastFlight.arrivalTime}`
                                  )
                                  const duration = dayjs.duration(
                                    arrival.diff(departure)
                                  )
                                  const days = duration.days()
                                  const hours = duration.hours()
                                  const minutes = duration.minutes()

                                  return (
                                    <div className='flex gap-1'>
                                      {days > 0 && <div>{days} gün</div>}
                                      {hours > 0 && <div>{hours}sa</div>}
                                      {minutes > 0 && <div>{minutes}dk</div>}
                                    </div>
                                  )
                                })()}
                              </div>
                              -
                              <div className='font-medium text-red-600'>
                                1 aktarma
                              </div>
                            </div>
                          )}
                          <Box bg={'blue'} h={2} className='rounded' />
                          <div className='absolute end-0 -translate-y-1/2 rotate-90 bg-white text-blue-800'>
                            <MdOutlineAirplanemodeActive size={18} />
                          </div>
                        </div>
                        {!hasTransfer && (
                          <div className='pt-3'>
                            <div className='flex items-center justify-center gap-2 text-sm text-gray-700'>
                              {(() => {
                                const departure = dayjs(
                                  `${firstFlight.departureDate} ${firstFlight.departureTime}`
                                )
                                const arrival = dayjs(
                                  `${lastFlight.arrivalDate} ${lastFlight.arrivalTime}`
                                )
                                const duration = dayjs.duration(
                                  arrival.diff(departure)
                                )
                                const days = duration.days()
                                const hours = duration.hours()
                                const minutes = duration.minutes()

                                return (
                                  <div className='flex gap-1'>
                                    {days > 0 && <div>{days} gün</div>}
                                    {hours > 0 && <div>{hours}sa</div>}
                                    {minutes > 0 && <div>{minutes}dk</div>}
                                  </div>
                                )
                              })()}
                            </div>
                          </div>
                        )}
                        {hasTransfer && transferFlight && (
                          <div className='pt-3'>
                            <div className='flex items-center justify-center gap-2 text-xs text-gray-600'>
                              Bekleme: {transferFlight.origin}-{' '}
                              {(() => {
                                const diff = dayjs(
                                  `${transferFlight.departureDate} ${transferFlight.departureTime}`
                                ).diff(
                                  dayjs(
                                    `${firstFlight.arrivalDate} ${firstFlight.arrivalTime}`
                                  ),
                                  'minute'
                                )
                                const h = Math.floor(diff / 60)
                                const m = diff % 60
                                return h > 0 ? `${h}sa ${m}dk` : `${m}dk`
                              })()}
                            </div>
                          </div>
                        )}
                      </div>
                      <div>
                        <div className='relative text-xl leading-none font-semibold'>
                          {lastFlight.arrivalTime}
                          {lastFlight.arrivalDate !==
                            firstFlight.departureDate && (
                            <sup className='absolute -end-1 -top-2 text-xs leading-none font-normal text-red-700'>
                              +1
                            </sup>
                          )}
                        </div>
                        <div className='mt-1 text-center text-sm'>
                          {lastFlight.destination}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='col-span-1 ms-auto mt-4 flex items-center gap-3'>
                    <div className='flex items-center gap-3 md:mt-0 md:grid md:gap-0'>
                      <div className='text-lowercase text-sm'>
                        {firstFlight.classType}
                      </div>
                      <div className='text-lg font-semibold md:text-center'>
                        {priceDifference === 0
                          ? '+0'
                          : `+${formatCurrency(priceDifference ?? 0)}`}
                      </div>
                    </div>
                    <Radio.Indicator
                      icon={CheckIcon}
                      size='18'
                      style={{
                        width: 31,
                        height: 31,
                        minWidth: 31,
                        minHeight: 31,
                      }}
                    />
                  </div>
                </div>
              </Radio.Card>
            )
          })}
        </Stack>
      </Radio.Group>
    </ScrollArea.Autosize>
  )
}

export { CyprusFlightSelect }
