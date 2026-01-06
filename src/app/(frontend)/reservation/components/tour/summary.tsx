import { CheckoutCard } from '@/components/card'
import { cdnSiteImageUrl } from '@/libs/cms-data'
import { formatCurrency, validateUrl } from '@/libs/util'
import {
  ProductPassengerApiResponseModel,
  TourSummaryViewData,
} from '@/types/passengerViewModel'
import { Image, Tooltip } from '@mantine/core'
import dayjs from 'dayjs'
import { IoChevronDown } from 'react-icons/io5'
import { MdDescription } from 'react-icons/md'

type IProps = {
  data: ProductPassengerApiResponseModel['viewBag']
}

const TourSummary: React.FC<IProps> = ({ data }) => {
  const tourData = data.SummaryViewDataResponser
    .summaryResponse as TourSummaryViewData
  const tourDay = tourData.package.tourTime + 1

  return (
    <CheckoutCard>
      <div className='hidden items-center gap-3 border-b pb-2 text-lg font-semibold md:flex'>
        <MdDescription size={22} className='text-blue-800' />
        <div>Seyahat Özeti</div>
        <IoChevronDown size={20} className='md:hidden' />
      </div>
      <div className='grid gap-3'>
        <div>
          <Image
            src={
              validateUrl(tourData.package.imageUrl)
                ? tourData.package.imageUrl
                : cdnSiteImageUrl(tourData.package.imageUrl)
            }
            alt={tourData.package.title}
            radius={'md'}
          />
        </div>
        <div className='text-lg font-semibold'>
          {tourData.package.region.title}
        </div>
        <div className='flex gap-3 text-sm'>
          <div className='font-normal'>
            {dayjs(tourData.package.startDate).format('DD MMMM YYYY dddd')}
          </div>
          {'-'}
          <div>
            {tourData.package.tourTime} Gece {tourDay} Gün
          </div>
        </div>
        <div className='my-3 flex justify-center gap-4 border p-3 text-center'>
          <div>
            <div className='text-sm'>Başlangıç Tarihi</div>
            <div className='font-semibold'>
              {dayjs(tourData.package.startDate).format('DD MMMM YYYY')}
            </div>
          </div>
          <div className='border' />
          <div>
            <div className='text-sm'>Bitiş Tarihi</div>
            <div className='font-semibold'>
              {dayjs(tourData.package.endDate).format('DD MMMM YYYY')}
            </div>
          </div>
        </div>
        <div className='flex items-center justify-between'>
          <div>Misafirler</div>
          <div className='font-bold'>
            {tourData.adultCount.split(':')[0]} Yetişkin
            {tourData.childs && <div>{tourData.childs.length} Çocuk</div>}
          </div>
        </div>
        {((tourData.package.hotelInformations !== undefined &&
          tourData.package.hotelInformations !== null &&
          tourData.package.hotelInformations.length > 0) ||
          (tourData.detail.flightInformation !== undefined &&
            tourData.detail.flightInformation !== null &&
            (Array.isArray(tourData.detail.flightInformation)
              ? tourData.detail.flightInformation.length > 0
              : String(tourData.detail.flightInformation).trim().length >
                0))) && (
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-1'>
              {tourData.package.hotelInformations !== undefined &&
                tourData.package.hotelInformations !== null &&
                tourData.package.hotelInformations.length > 0 && (
                  <div>Otel</div>
                )}
              {tourData.detail.flightInformation !== undefined &&
                tourData.detail.flightInformation !== null &&
                (Array.isArray(tourData.detail.flightInformation)
                  ? tourData.detail.flightInformation.length > 0
                  : String(tourData.detail.flightInformation).trim().length >
                    0) && (
                  <div>
                    {tourData.package.hotelInformations !== undefined &&
                    tourData.package.hotelInformations !== null &&
                    tourData.package.hotelInformations.length > 0
                      ? '- '
                      : ''}
                    Ulaşım Bilgisi
                  </div>
                )}
            </div>
            {
              <Tooltip
                openDelay={100}
                closeDelay={100}
                position='bottom'
                withArrow
                label={
                  <div className='grid gap-3'>
                    <div className='text-sm'>
                      <div className='mb-2 font-semibold'>Ulaşım Bilgisi:</div>
                      {Array.isArray(tourData.detail.flightInformation) ? (
                        <div className='space-y-1'>
                          {tourData.detail.flightInformation.map(
                            (item, index) => (
                              <div key={index}>• {item}</div>
                            )
                          )}
                        </div>
                      ) : (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: String(tourData.detail.flightInformation),
                          }}
                        />
                      )}
                    </div>

                    {tourData.package.hotelInformations &&
                      tourData.package.hotelInformations !== null &&
                      tourData.package.hotelInformations.length > 0 && (
                        <div className='text-sm'>
                          <div className='mb-2 font-semibold'>
                            Otel Bilgisi:
                          </div>
                          <div
                            dangerouslySetInnerHTML={{
                              __html:
                                tourData.package.hotelInformations[0].name,
                            }}
                          />
                          <div className='mt-2 text-xs text-gray-400'>
                            (Data:{' '}
                            {JSON.stringify(tourData.package.hotelInformations)}
                            )
                          </div>
                        </div>
                      )}
                  </div>
                }
              >
                <div className='cursor-pointer font-bold text-blue-800'>
                  Detaylı Bilgi
                </div>
              </Tooltip>
            }
          </div>
        )}
        <div className='flex items-center justify-between gap-2 border-t pt-3 font-semibold'>
          <div className='text-md font-semibold'>Toplam Tutar</div>
          <div className='text-xl font-semibold'>
            {formatCurrency(tourData.totalPrice)}
          </div>
        </div>
      </div>
    </CheckoutCard>
  )
}

export { TourSummary }
