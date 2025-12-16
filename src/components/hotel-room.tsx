import { useState } from 'react'

import {
  Button,
  Image,
  Title,
  Drawer,
  AspectRatio,
  UnstyledButton,
  Tooltip,
} from '@mantine/core'

import type {
  HotelDetailResponseHotelInfo,
  HotelDetailRoom,
  HotelDetailRoomDetail,
  HotelDetailRoomItem,
} from '@/app/(frontend)/hotel/types'
import { formatCurrency } from '@/libs/util'
import { PriceNumberFlow } from '@/components/price-numberflow'
import dayjs from 'dayjs'
import { RiUserLine } from 'react-icons/ri'
import { PiAngle, PiBabyBold, PiCoffee } from 'react-icons/pi'
import { HiPercentBadge } from 'react-icons/hi2'
import { IoClose } from 'react-icons/io5'
import { PriceDiff } from '@/app/(frontend)/hotel/(detail)/[slug]/_components/priceDiff'
import { BiChevronRight } from 'react-icons/bi'
import { Refundable } from '@/app/(frontend)/hotel/(detail)/[slug]/_components/refundable'
import { MdLocalDining } from 'react-icons/md'

type IProps = {
  roomGroup: HotelDetailRoomItem
  roomDetails: { [key: string]: HotelDetailRoomDetail }
  onSelect: (room: HotelDetailRoom) => void
  onInstallmentClick?: (roomGroup: HotelDetailRoomItem) => void
  hotelInfo: HotelDetailResponseHotelInfo | undefined
}

const HotelRoom: React.FC<IProps> = ({
  roomGroup,
  roomDetails,
  onSelect = () => null,
  onInstallmentClick = () => null,
  hotelInfo,
}) => {
  const rooms = roomGroup.rooms
  const diffPriceGaranty = hotelInfo?.themes.find((item) => item.id === 385)
  const roomKeys = rooms?.map((x) => x.key) || [roomGroup.key]
  const totalPrice = roomGroup.totalPrice.value
  const discountRate =
    roomGroup.discount.value > 0
      ? Math.round(
          100 - (totalPrice / (roomGroup.discount.value + totalPrice)) * 100
        )
      : 0
  const discountPrice = roomGroup.discount.value + totalPrice
  const details = roomDetails
    ? Object.values(roomDetails).filter((roomDetail) =>
        roomKeys.includes(roomDetail.roomKey)
      )
    : null

  const [drawerOpened, setDrawerOpened] = useState(false)

  if (details && !details?.length) return null

  const timeDiff = dayjs(roomGroup.checkOutDate).diff(
    dayjs(roomGroup.checkInDate),
    'day'
  )

  return (
    <div className='rounded-lg border shadow-sm'>
      {rooms?.map((room, roomIndex, roomsArray) => {
        const detail = details?.find((x) => x.roomKey === room.key)
        const images = detail?.images.map((image) => {
          return image.url ? image.url?.trim() : image.thumbnailUrl?.trim()
        })
        const isLastItem = roomsArray.length - 1 === roomIndex
        const themesPriceDiff =
          roomGroup.provider == 'JollyHotel' && diffPriceGaranty
        const freeChildAges = room.freeChildAges ?? []

        if (!detail) return null
        return (
          <div
            className='gap-7 p-3 md:grid md:grid-cols-14 md:gap-6'
            key={room.key}
          >
            <div className='relative md:col-span-5'>
              <AspectRatio ratio={16 / 11}>
                <Image
                  loading='lazy'
                  fallbackSrc='/default-room.jpg'
                  src={images?.at(0)}
                  alt={detail.roomType}
                  className={`h-40 w-full md:h-full ${detail.description ? 'cursor-pointer' : ''} rounded-md object-cover`}
                  onClick={() => detail.description && setDrawerOpened(true)}
                />
              </AspectRatio>
              {detail.quantity > 0 && (
                <div>
                  {' '}
                  <div className='absolute top-0 right-0 m-2 flex items-center rounded-md bg-black/50 p-1 text-white'>
                    <RiUserLine size={16} className='mr-2' />
                    <div>Max {detail.quantity} Kişilik</div>
                  </div>
                </div>
              )}
              {detail.size > 0 && (
                <div className='absolute top-10 right-0 m-2 flex items-center rounded-md bg-black/50 p-1 text-white'>
                  <PiAngle size={16} className='mr-2' />
                  {detail.size} m²
                </div>
              )}
            </div>
            <div className='flex h-full flex-col md:col-span-6'>
              <Title order={5} className='mt-3 text-xl'>
                {detail.roomType}
              </Title>

              <Drawer
                opened={drawerOpened}
                onClose={() => setDrawerOpened(false)}
                title={
                  <div className='flex items-center gap-3'>
                    <button
                      onClick={() => setDrawerOpened(false)}
                      className='rounded-r-xl bg-red-800 p-2 px-5 text-white'
                    >
                      <IoClose color='white' />
                    </button>
                    <div className='text-lg font-bold'>{detail.roomType}</div>
                  </div>
                }
                position='right'
                size='xl'
                radius='sm'
                closeButtonProps={{
                  style: { display: 'none' },
                }}
                classNames={{
                  header: 'p-0',
                }}
              >
                {
                  <div>
                    <Image
                      loading='lazy'
                      fallbackSrc='/default-room.jpg'
                      src={images?.at(0)}
                      alt={detail.roomType}
                      className='mb-6 h-full max-h-52 rounded'
                    />

                    {detail.size > 0 && (
                      <div>
                        {' '}
                        <div className='mb-4 w-15 rounded bg-gray-300 p-2 text-center text-xs font-bold'>
                          {detail.size} m²{' '}
                        </div>
                      </div>
                    )}

                    <div
                      dangerouslySetInnerHTML={{ __html: detail.description }}
                    />
                  </div>
                }
              </Drawer>
              <div className='my-3 grid gap-2'>
                <div className='flex items-center'>
                  <MdLocalDining size={18} className='mr-2' />

                  {detail.pensionType}
                </div>
              </div>
              <PriceDiff themesPriceDiff={themesPriceDiff ? true : false} />
              <Refundable roomGroup={roomGroup} />
              {freeChildAges.length > 0 && (
                <div className='mt-2'>
                  <Tooltip
                    multiline
                    w={260}
                    withArrow
                    label={
                      <div className='text-sm whitespace-pre-wrap text-white'>
                        {freeChildAges
                          .map((child) => {
                            return `${child.whichChild}. Çocuk: ${child.ageFrom} - ${Math.round(child.ageTo)} Yaş ücretsiz`
                          })
                          .join('\n')}
                      </div>
                    }
                  >
                    <div className='flex w-fit cursor-pointer items-center gap-2 rounded-md text-sm font-medium transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl'>
                      <PiBabyBold size={18} />
                      {freeChildAges.length} Çocuk Ücretsiz
                    </div>
                  </Tooltip>
                </div>
              )}
              {roomGroup.isSingleMaleRestriction && (
                <div className='my-3 w-45 rounded-md bg-red-700 p-2 px-5 text-xs text-white md:mt-3'>
                  Tek Erkek kabul edilmez
                </div>
              )}

              <div className='mt-5 mt-auto flex items-center gap-1 pt-5 transition-all duration-300 hover:translate-x-1 hover:gap-3'>
                <UnstyledButton
                  className='text-blue-700 hover:text-blue-800'
                  onClick={() => setDrawerOpened(true)}
                >
                  Oda Özellikleri ve Fotoğrafları
                </UnstyledButton>
                <BiChevronRight
                  size={20}
                  className='text-blue-700 hover:text-blue-800'
                />
              </div>
            </div>
            {isLastItem && (
              <div className='item-center mt-4 justify-center self-end border-t md:col-span-3 md:mt-0 md:justify-self-end md:border-t-0'>
                <div className='my-2 grid justify-end md:border-t-0'>
                  <div className='text-md mb-1 text-end text-gray-600'>
                    {timeDiff} Gece
                  </div>
                  <div>
                    {discountRate > 0 && (
                      <div className='mt-5 grid items-center md:mt-0 md:justify-end'>
                        <div className='text-md hidden items-center rounded bg-orange-700 p-1 text-end leading-none font-semibold text-white md:flex'>
                          <HiPercentBadge size={18} />%{discountRate} indirim
                        </div>

                        <div className='text-md pt-1 text-end line-through'>
                          {formatCurrency(discountPrice)}
                        </div>
                      </div>
                    )}

                    <div className='flex items-center gap-1'>
                      {discountRate > 0 && (
                        <div className='text-md items-center justify-center rounded-md bg-orange-700 p-1 px-2 font-medium text-white md:hidden'>
                          %{discountRate}
                        </div>
                      )}
                      <div className='text-center text-2xl font-bold md:text-end'>
                        <PriceNumberFlow value={roomGroup.totalPrice.value} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='flex items-center justify-end gap-3 md:grid'>
                  <div className='ms-auto md:hidden'>
                    <UnstyledButton
                      className='w-33 bg-transparent py-1 text-sm text-blue-700'
                      type='button'
                      onClick={() => onInstallmentClick(roomGroup)}
                    >
                      Taksit Seçenekleri
                    </UnstyledButton>
                  </div>
                  <Button
                    className='py-2'
                    size='lg'
                    type='button'
                    fullWidth
                    radius={'md'}
                    onClick={() => onSelect(room)}
                  >
                    Rezervasyon Yap
                  </Button>
                  <div className='ms-auto hidden md:flex'>
                    <Button
                      className='font-medium'
                      fullWidth
                      type='button'
                      size='xs'
                      variant='white'
                      onClick={() => onInstallmentClick(roomGroup)}
                    >
                      Taksit Seçenekleri
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export { HotelRoom }
