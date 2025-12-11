'use client'

import { Title, UnstyledButton, Collapse } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import dayjs from 'dayjs'
import Image from 'next/image'
import { useState } from 'react'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'
import {
  RiCalendarLine,
  RiUserLine,
  RiMoonLine,
  RiRestaurantLine,
  RiFlightTakeoffFill,
  RiFlightLandLine,
  RiTimeLine,
  RiCarLine,
} from 'react-icons/ri'
import { calculateFlightDuration } from '@/libs/cyprus-utils'
import { CyprusSummaryProps } from '@/app/cyprus/types'

type IProps = {
  data: CyprusSummaryProps
}

const CyprusSummaryCard: React.FC<IProps> = ({ data }) => {
  const [openedHotelDetails, { toggle: toggleHotelDetails }] =
    useDisclosure(true)
  const [openedFlightDetails, { toggle: toggleFlightDetails }] =
    useDisclosure(true)
  const [openedTransferDetails, { toggle: toggleTransferDetails }] =
    useDisclosure(true)
  const [isImageLoading, setIsImageLoading] = useState(true)

  const checkIn = dayjs(data.checkInDate)
  const checkOut = dayjs(data.checkOutDate)
  const nightStay = checkOut.diff(checkIn, 'day')

  const defaultTitle = `Rezervasyon Detayları${data.isFlight ? ' + Uçak' : ''}${data.isTransfer ? ' + Transfer' : ''}`

  return (
    <div className='overflow-hidden rounded-lg bg-white p-1 md:border md:p-3 md:shadow-md'>
      <div className='border-b border-gray-200 py-4'>
        <Title order={2} className='text-lg font-bold text-gray-900'>
          {data.title || defaultTitle}
        </Title>
      </div>

      <div>
        {data.hotel?.images?.[0]?.original && (
          <div className='relative mb-4 h-48 overflow-hidden rounded-lg bg-gray-100'>
            <Image
              src={data.hotel.images[0].original}
              alt={data.hotel?.name || 'Otel Görseli'}
              width={1200}
              height={500}
              className='h-full w-full object-cover'
              unoptimized
              onLoad={() => setIsImageLoading(false)}
            />
          </div>
        )}

        <div className='mb-4'>
          <Title order={3} className='mb-2 text-xl font-bold text-gray-900'>
            {data.hotel?.name}
          </Title>
          {data.hotel?.address && (
            <address className='text-sm text-gray-600 not-italic'>
              {data.hotel.address}
            </address>
          )}
        </div>

        <div className='border-t border-gray-200 pt-4'>
          <UnstyledButton onClick={toggleHotelDetails} className='w-full'>
            <div className='flex w-full items-center justify-between'>
              <Title
                order={4}
                className='text-base font-semibold text-gray-900'
              >
                Otel Bilgisi
              </Title>
              <span className='text-xl'>
                {openedHotelDetails ? (
                  <MdKeyboardArrowUp />
                ) : (
                  <MdKeyboardArrowDown />
                )}
              </span>
            </div>
          </UnstyledButton>
          <Collapse in={openedHotelDetails} transitionDuration={200}>
            <div className='space-y-3 pt-3'>
              <div className='flex items-center gap-3 text-sm'>
                <RiCalendarLine />
                <span className='text-gray-700'>
                  {checkIn.format('DD MMM YYYY')} -{' '}
                  {checkOut.format('DD MMM YYYY')}
                </span>
              </div>
              {(data.adults !== undefined || data.children !== undefined) && (
                <div className='flex items-center gap-3 text-sm'>
                  <RiUserLine />
                  <span className='text-gray-700'>
                    Yetişkinler: {data.adults || 2}, çocuklar:{' '}
                    {data.children || 0}
                  </span>
                </div>
              )}
              <div className='flex items-center gap-3 text-sm'>
                <RiMoonLine />
                <span className='text-gray-700'>Gece: {nightStay}</span>
              </div>
              <div className='flex items-center gap-3 text-sm'>
                <RiRestaurantLine />
                <span className='text-gray-700'>
                  {data.hotel?.meal_type || 'Her şey dahil'}
                </span>
              </div>
            </div>
          </Collapse>
        </div>

        {(data.departureFlight || data.returnFlight) && (
          <div className='mt-4 border-t border-gray-200 pt-4'>
            <UnstyledButton onClick={toggleFlightDetails} className='w-full'>
              <div className='flex w-full items-center justify-between'>
                <Title
                  order={4}
                  className='text-base font-semibold text-gray-900'
                >
                  Uçuş Bilgisi
                </Title>
                <span className='text-xl'>
                  {openedFlightDetails ? (
                    <MdKeyboardArrowUp />
                  ) : (
                    <MdKeyboardArrowDown />
                  )}
                </span>
              </div>
            </UnstyledButton>
            <Collapse in={openedFlightDetails} transitionDuration={200}>
              <div className='space-y-4 pt-3'>
                {data.departureFlight && (
                  <div>
                    <div className='mb-2 text-sm font-medium text-blue-600'>
                      Gidiş{' '}
                      {dayjs(data.departureFlight.departureTime).format(
                        'DD MMM YYYY'
                      )}
                    </div>
                    <div className='space-y-2 rounded-lg bg-gray-50 p-3'>
                      <div className='flex items-center gap-2 text-sm'>
                        <RiFlightTakeoffFill className='text-blue-600' />
                        <span className='font-medium'>
                          {data.departureFlight.airline}{' '}
                          {data.departureFlight.flightNumber ||
                            data.departureFlight.flightNo}{' '}
                          /{' '}
                          {data.departureFlight.cabinClass ||
                            data.departureFlight.classType}
                        </span>
                      </div>
                      <div className='flex items-center gap-2 text-sm'>
                        <div className='h-2 w-2 rounded-full bg-gray-400'></div>
                        <span>
                          {dayjs(data.departureFlight.departureTime).format(
                            'HH:mm'
                          )}{' '}
                          {data.departureFlight.origin}
                        </span>
                      </div>
                      {data.departureFlight.connectionCount &&
                        Number(data.departureFlight.connectionCount) > 0 && (
                          <div className='ml-6 text-xs text-orange-600'>
                            {data.departureFlight.connectionCount} Aktarma:{' '}
                            {data.departureFlight.connections?.join(', ')}
                          </div>
                        )}
                      <div className='flex items-center gap-2 text-sm'>
                        <div className='h-2 w-2 rounded-full bg-gray-400'></div>
                        <span>
                          {dayjs(data.departureFlight.arrivalTime).format(
                            'HH:mm'
                          )}{' '}
                          {data.departureFlight.destination}
                        </span>
                      </div>
                      <div className='flex items-center gap-2 text-sm'>
                        <RiTimeLine className='text-gray-500' />
                        <span>
                          Toplam Seyahat Süresi:{' '}
                          {calculateFlightDuration(
                            data.departureFlight.departureTime,
                            data.departureFlight.arrivalTime
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
                {data.returnFlight && (
                  <div>
                    <div className='mb-2 text-sm font-medium text-blue-600'>
                      Dönüş{' '}
                      {dayjs(data.returnFlight.departureTime).format(
                        'DD MMM YYYY'
                      )}
                    </div>
                    <div className='space-y-2 rounded-lg bg-gray-50 p-3'>
                      <div className='flex items-center gap-2 text-sm'>
                        <RiFlightLandLine className='text-blue-600' />
                        <span className='font-medium'>
                          {data.returnFlight.airline}{' '}
                          {data.returnFlight.flightNumber ||
                            data.returnFlight.flightNo}{' '}
                          /{' '}
                          {data.returnFlight.cabinClass ||
                            data.returnFlight.classType}
                        </span>
                      </div>
                      <div className='flex items-center gap-2 text-sm'>
                        <div className='h-2 w-2 rounded-full bg-gray-400'></div>
                        <span>
                          {dayjs(data.returnFlight.departureTime).format(
                            'HH:mm'
                          )}{' '}
                          {data.returnFlight.origin}
                        </span>
                      </div>
                      {data.returnFlight.connectionCount &&
                        Number(data.returnFlight.connectionCount) > 0 && (
                          <div className='ml-6 text-xs text-orange-600'>
                            {data.returnFlight.connectionCount} Aktarma:{' '}
                            {data.returnFlight.connections?.join(', ')}
                          </div>
                        )}
                      <div className='flex items-center gap-2 text-sm'>
                        <div className='h-2 w-2 rounded-full bg-gray-400'></div>
                        <span>
                          {dayjs(data.returnFlight.arrivalTime).format('HH:mm')}{' '}
                          {data.returnFlight.destination}
                        </span>
                      </div>
                      <div className='flex items-center gap-2 text-sm'>
                        <RiTimeLine className='text-gray-500' />
                        <span>
                          Toplam Seyahat Süresi:{' '}
                          {calculateFlightDuration(
                            data.returnFlight.departureTime,
                            data.returnFlight.arrivalTime
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Collapse>
          </div>
        )}

        {(data.departureTransfer || data.returnTransfer) && (
          <div className='mt-4 border-t border-gray-200 pt-4'>
            <UnstyledButton onClick={toggleTransferDetails} className='w-full'>
              <div className='flex w-full items-center justify-between'>
                <Title
                  order={4}
                  className='text-base font-semibold text-gray-900'
                >
                  Transfer Bilgisi
                </Title>
                <span className='text-xl'>
                  {openedTransferDetails ? (
                    <MdKeyboardArrowUp />
                  ) : (
                    <MdKeyboardArrowDown />
                  )}
                </span>
              </div>
            </UnstyledButton>
            <Collapse in={openedTransferDetails} transitionDuration={200}>
              <div className='mt-3 space-y-3 rounded-lg bg-gray-50 p-3'>
                <div className='flex items-center gap-2 text-sm'>
                  <RiCarLine className='text-blue-600' />
                  <span className='font-medium text-gray-800'>
                    {data.departureTransfer?.vehicleName ||
                      data.departureTransfer?.transferTitle ||
                      data.returnTransfer?.vehicleName ||
                      data.returnTransfer?.transferTitle ||
                      'Transfer'}
                  </span>
                </div>
                {data.departureTransfer && (
                  <div className='space-y-1 text-sm'>
                    <div className='flex items-center gap-2'>
                      <span>✓</span>
                      <span>
                        Gidiş:{' '}
                        {data.departureTransfer.pickupLocationName ||
                          'Havalimanı'}{' '}
                        →{' '}
                        {data.departureTransfer.dropLocationName ||
                          data.hotel?.name}
                      </span>
                    </div>
                  </div>
                )}
                {data.returnTransfer && (
                  <div className='space-y-1 text-sm'>
                    <div className='flex items-center gap-2'>
                      <span>✓</span>
                      <span>
                        Dönüş:{' '}
                        {data.returnTransfer.pickupLocationName ||
                          data.hotel?.name}{' '}
                        → {data.returnTransfer.dropLocationName || 'Havalimanı'}
                      </span>
                    </div>
                  </div>
                )}
                <div className='mt-2 ml-6 text-xs'>
                  Transfer, uçuş saatlerine göre hazır olacaktır.
                </div>
              </div>
            </Collapse>

            <div
              className={`my-4 rounded-md border p-3 text-sm font-bold shadow ${
                data.useCancelWarranty
                  ? 'bg-green-800 text-white'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              {data.useCancelWarranty ? 'Ücretsiz iptal' : 'İptal edilemez'}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { CyprusSummaryCard }
