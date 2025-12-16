import { useState } from 'react'
import {
  Anchor,
  Box,
  Button,
  Image,
  List,
  Rating,
  Skeleton,
  Title,
  Tooltip,
  Transition,
  UnstyledButton,
} from '@mantine/core'
import { Link } from 'next-view-transitions'
import { createSerializer, useQueryStates } from 'nuqs'
import { FaCheck, FaCheckCircle } from 'react-icons/fa'

import { IoChevronForward, IoStarSharp } from 'react-icons/io5'

import {
  HotelCampaignsResponse,
  HotelSearchResultHotelInfo,
  HotelSearchResultItemType,
  RoomDetailType,
} from '@/app/(frontend)/hotel/types'
import { formatCurrency } from '@/libs/util'
import {
  hotelDetailSearchParams,
  hotelSearchParamParser,
} from '@/modules/hotel/searchParams'
import dayjs from 'dayjs'
import { Carousel } from '@mantine/carousel'
import { FaFaceSmile } from 'react-icons/fa6'
import { Route } from 'next'
import {
  PiBabyBold,
  PiBabyFill,
  PiBabyLight,
  PiHandCoins,
} from 'react-icons/pi'
import { BiInfoCircle } from 'react-icons/bi'
import { IoMdInformationCircleOutline } from 'react-icons/io'

type IProps = {
  hotelInfo: HotelSearchResultHotelInfo | undefined
  resultItem?: HotelSearchResultItemType
  roomDetail?: RoomDetailType | undefined
  searchToken: string
  sessionToken: string
  campaignContents?: HotelCampaignsResponse[] | null
  onMapClick: () => void
  onDateSelect?: () => void
}
const detailUrlSerializer = createSerializer(hotelDetailSearchParams)

const NightCountText: React.FC<{ count: number }> = ({ count }) => (
  <div className='text-dark-200 my-1 text-sm'>{count} gece fiyatı</div>
)

const HotelSearchResultItem: React.FC<IProps> = ({
  hotelInfo,
  resultItem,
  roomDetail,
  searchToken,
  sessionToken,
  onMapClick,
  campaignContents,
  onDateSelect = () => {},
}) => {
  const [isImageLoading, setImageLoading] = useState(true)

  const hotelImageUrl =
    hotelInfo?.images.at(0)?.mid ?? hotelInfo?.images.at(0)?.large

  const nightCount = dayjs(resultItem?.checkOutDate).diff(
    resultItem?.checkInDate,
    'day'
  )

  const freeChildAges = resultItem?.rooms.find(
    (item) => item.freeChildAges
  )?.freeChildAges

  const totalPrice = resultItem?.totalPrice.value ?? 0
  const discountValue = resultItem?.discount.value ?? 0
  const totalPriceWithDiscount = totalPrice + discountValue
  const hasDiscount = discountValue > 0 && totalPrice >= discountValue
  const discountRate = Math.round(
    ((totalPriceWithDiscount - totalPrice) / totalPriceWithDiscount) * 100
  )

  const [searchParams] = useQueryStates(hotelSearchParamParser)

  const detailUrl = detailUrlSerializer(`/hotel/${hotelInfo?.slug}`, {
    slug: hotelInfo?.slug,
    productKey: resultItem?.key,
    searchToken,
    sessionToken,
    propertyName: hotelInfo?.name,
    hotelSlug: hotelInfo?.slug,
    type: searchParams.type,
    checkInDate: searchParams.checkinDate,
    checkOutDate: searchParams.checkoutDate,
    rooms: searchParams.rooms,
  }) as Route
  return (
    <div className='rounded-lg border border-gray-300 shadow hover:shadow-xl'>
      <div className='grid md:grid-cols-13'>
        <div className='md:col-span-10'>
          <div className='grid gap-3 p-3 md:grid-cols-9'>
            <div className='md:col-span-4'>
              <Box h={200} className='relative'>
                <Transition
                  mounted={isImageLoading}
                  transition='fade'
                  duration={400}
                  timingFunction='ease'
                >
                  {(styles) => (
                    <div
                      style={styles}
                      className='absolute start-0 end-0 top-0 bottom-0 rounded-md border bg-white p-2 transition-opacity duration-300'
                    >
                      <Skeleton className='size-full' radius={'md'} />
                    </div>
                  )}
                </Transition>
                <Image
                  loading='lazy'
                  fallbackSrc='/default-room.jpg'
                  onLoad={() => {
                    setImageLoading(false)
                  }}
                  h={'100%'}
                  w={'100%'}
                  src={hotelImageUrl}
                  alt={hotelInfo?.name}
                  radius={'md'}
                />
                <Link href={detailUrl} className='absolute inset-0 z-10' />
                {resultItem?.earlyBooking && (
                  <div className='absolute start-0 top-0 z-20 m-1 flex items-center gap-2 rounded-lg bg-red-800 px-2 py-1 text-sm text-white'>
                    <div>Erken Rezervasyon</div>
                  </div>
                )}
                {hotelInfo?.comment_info && (
                  <div className='absolute end-0 top-0 z-20 m-1 flex items-center gap-2 rounded-lg bg-green-800 px-1 py-1 text-sm text-white md:hidden'>
                    <div>
                      <FaFaceSmile />
                    </div>
                    <div>{hotelInfo?.comment_info?.averageScore}</div>
                    <div className='text-white'>
                      {hotelInfo?.comment_info?.totalComments} Yorum
                    </div>
                  </div>
                )}
              </Box>
            </div>
            <div className='flex flex-col gap-2 pt-2 md:col-span-5'>
              <Title className='pb-1 @lg:text-lg' order={2} fz={'xl'}>
                {hotelInfo?.name}
              </Title>
              <div className='flex items-center gap-2 text-sm'>
                {hotelInfo?.stars ? (
                  <Rating
                    value={hotelInfo?.stars}
                    count={hotelInfo?.stars}
                    readOnly
                    fullSymbol={<IoStarSharp />}
                  />
                ) : null}
                <div className='flex items-center gap-1 text-xs'>
                  <span className='text-dark-700'>
                    {hotelInfo?.destination}
                  </span>

                  {onMapClick && (
                    <UnstyledButton
                      fz='inherit'
                      className='text-blue-800 transition-colors hover:text-blue-600'
                      onClick={onMapClick}
                    >
                      Haritada Göster
                    </UnstyledButton>
                  )}
                </div>
              </div>
              <div>
                <div className='flex items-center gap-2'>
                  {roomDetail?.pensionType && (
                    <div className='flex items-center gap-2'>
                      <FaCheck color='black' size={'14'} />
                      {roomDetail.pensionType}
                    </div>
                  )}
                </div>
                {resultItem?.priceDifferenceBackGuarantee && (
                  <Tooltip
                    multiline
                    w={260}
                    label='Parafly Travel “Fiyat Farkı İade Garantisi” ibaresi ile satışa sunduğu seçili otellerde, misafirlerin konaklama yapacağı tarihten önce misafirin satın aldığı tutarı olumsuz yönde etkileyecek şekilde, Paraflytravel.com sitesi üzerinde bir fiyat farkı oluşur ise, aradaki fiyat farkını iade eder.'
                    position='top'
                    arrowOffset={44}
                    arrowSize={8}
                    withArrow
                  >
                    <div className='mt-2 flex cursor-pointer items-center gap-2 rounded-md text-sm'>
                      <PiHandCoins size={16} />
                      <span>Seçili Odalarda Fiyat Farkı İade Garantisi</span>
                      <IoMdInformationCircleOutline size={17} />
                    </div>
                  </Tooltip>
                )}
                {!resultItem?.nonRefundable && (
                  <div className='mt-2 flex w-50 items-center gap-2 rounded-md border border-gray-300 bg-gray-200 p-1 text-sm font-medium text-teal-800'>
                    <FaCheckCircle size={'16'} />
                    <span>Ücretsiz İptal Seçeneği</span>
                  </div>
                )}
              </div>
              {freeChildAges && freeChildAges[0] && (
                <div>
                  <Tooltip
                    label={freeChildAges.map((child, childIndex) => (
                      <div key={childIndex}>
                        <div>{child.whichChild}. Çocuk</div>
                        <div>
                          {child.ageFrom} - {Math.round(child.ageTo)} Yaş
                          ücretsiz
                        </div>
                      </div>
                    ))}
                  >
                    <div className='flex w-50 cursor-pointer items-center gap-2 rounded-md border border-gray-300 bg-gray-200 p-1 text-sm transition-all duration-300 hover:translate-y-[-2px] hover:shadow-xl'>
                      <PiBabyBold size={'16'} />2 Çocuk Ücretsiz
                    </div>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
          {campaignContents && campaignContents[0] ? (
            <div className='hidden border-t md:block'>
              <div className='p-3 text-sm'>
                <Carousel
                  slideSize={'auto'}
                  withControls={false}
                  emblaOptions={{ dragFree: true, align: 'start' }}
                  slideGap={'md'}
                >
                  {campaignContents?.map((campaign) => (
                    <Carousel.Slide key={campaign.id}>
                      <Link href={campaign.params.link.value as Route}>
                        <div className='cursor-pointer rounded-md border p-3 font-medium text-blue-800 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl'>
                          {campaign.title}
                        </div>
                      </Link>
                    </Carousel.Slide>
                  ))}
                </Carousel>
              </div>
            </div>
          ) : null}
        </div>
        <div className='flex md:col-span-3 md:border-s'>
          <div className='flex flex-1 flex-col gap-3 py-2 md:px-6 md:py-5 md:ps-8'>
            {hotelInfo?.comment_info && (
              <div className='hidden items-center gap-3 self-end text-blue-800 md:flex'>
                <div className='text-lg font-semibold'>Çok İyi</div>
                <div className='rounded-t-lg rounded-br-lg bg-blue-100 p-2 text-xl leading-none font-bold'>
                  {hotelInfo?.comment_info?.averageScore}
                </div>
              </div>
            )}
            <div className='mt-auto flex items-center px-5 text-start md:grid md:px-0 md:text-end'>
              {resultItem && totalPrice > 0 ? (
                <>
                  <div>
                    <NightCountText count={nightCount} />
                    {hasDiscount && (
                      <div>
                        <div className='inline-block items-center rounded-full bg-orange-800 p-2 text-sm leading-none font-semibold text-white'>
                          %{discountRate} İndirim
                        </div>

                        <div className='text-sm line-through'>
                          {formatCurrency(totalPriceWithDiscount)}
                        </div>
                      </div>
                    )}
                    <div className='pb-1 text-2xl font-bold'>
                      {formatCurrency(totalPrice)}
                    </div>
                  </div>

                  <div className='align-items-self-end ms-auto grid justify-self-end md:w-full'>
                    <Button
                      component={Link}
                      href={detailUrl}
                      fullWidth
                      rightSection={<IoChevronForward size={16} />}
                      size='md'
                      radius={'md'}
                      target={
                        process.env.NODE_ENV === 'production'
                          ? '_blank'
                          : '_self'
                      }
                    >
                      Oda Seç
                    </Button>
                  </div>
                </>
              ) : (
                <div className='mx-auto flex flex-col gap-2 text-center text-sm'>
                  <div>
                    <Anchor
                      component={Link}
                      href={detailUrl}
                      fw={500}
                      fz='inherit'
                      target={
                        process.env.NODE_ENV === 'production'
                          ? '_blank'
                          : '_self'
                      }
                    >
                      Oteli incele
                    </Anchor>{' '}
                    veya fiyatları görmek için
                  </div>

                  <Button fullWidth onClick={onDateSelect}>
                    Tarih Seç
                  </Button>
                </div>
              )}
            </div>
            {campaignContents && campaignContents[0] ? (
              <div className='border-t md:hidden'>
                <div className='p-3 text-sm'>
                  <Carousel
                    slideSize={'auto'}
                    withControls={false}
                    emblaOptions={{ dragFree: true, align: 'start' }}
                    slideGap={'md'}
                  >
                    {campaignContents?.map((campaign) => (
                      <Carousel.Slide key={campaign.id}>
                        <div className='cursor-pointer rounded-md border p-3 font-medium text-blue-800 transition-all duration-300 hover:translate-y-[-5px] hover:shadow-xl'>
                          {campaign.title}
                        </div>
                      </Carousel.Slide>
                    ))}
                  </Carousel>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export { HotelSearchResultItem }
