import { CheckIcon, Title, Alert } from '@mantine/core'
import { CgDanger } from 'react-icons/cg'
import dayjs from 'dayjs'

import { HotelSummaryResponse } from '@/app/(frontend)/reservation/types'
import { EmailCard } from '@/components/order-components/email-card'
import { CheckoutCard } from '@/components/card'
import { formatCurrency } from '@/libs/util'
import { SummaryPassengerData } from '@/app/(frontend)/account/reservations/types'
import { Img, Link } from '@react-email/components'

type IProps = {
  data: HotelSummaryResponse
  passengerCount?: number
  passengerData?: SummaryPassengerData
}

const HotelSummary: React.FC<IProps> = ({
  data,
  passengerCount,
  passengerData,
}) => {
  const { roomGroup } = data

  return (
    <>
      <Link href={`${process.env.SITE_URL}/kampanyalar?categoryId=156`}>
        <Img
          width={800}
          height={200}
          className='my-3'
          src='https://paraflystatic.mncdn.com/7/Content/transaction/ucak.png'
        />
      </Link>
      <CheckoutCard title='Otel Bilgisi'>
        <div className='grid gap-3 md:grid-cols-8 md:gap-5'>
          <div className='md:col-span-4'>
            <Img
              width={300}
              height={600}
              src={roomGroup.hotel.images.at(0)?.original || ''}
              alt={roomGroup.hotel.name}
              className='w-full rounded-lg'
            />
          </div>
          <div className='md:col-span-4'>
            <strong className='text-lg'>{roomGroup.hotel.name}</strong>
            <div className='mt-1 text-xs text-gray-600'>
              {roomGroup.hotel.address}
            </div>

            <div className='mt-2 space-y-1'>
              <div className='flex items-center gap-2'>
                <div className='w-24 text-sm font-medium'>Giriş Tarihi</div>
                <div>:</div>
                <div className='text-sm'>
                  {dayjs(roomGroup.checkInDate).format('DD MMMM YYYY dddd')}
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-24 text-sm font-medium'>Çıkış Tarihi</div>
                <div>:</div>
                <div className='text-xs'>
                  {dayjs(roomGroup.checkOutDate).format('DD MMMM YYYY dddd')}
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <div className='w-24 text-sm font-medium'>Konaklama</div>
                <div>:</div>
                <div className='text-sm'>
                  {dayjs(roomGroup.checkOutDate).diff(
                    roomGroup.checkInDate,
                    'day'
                  )}{' '}
                  Gece
                </div>
              </div>
              {passengerCount && (
                <div className='flex items-center gap-2'>
                  <div className='w-24 text-sm font-medium'>Misafirler</div>
                  <div>:</div>
                  <div className='text-sm'>{passengerCount} Kişi</div>
                </div>
              )}
              {roomGroup.earlyBooking && (
                <div className='flex items-center gap-2'>
                  <div className='w-24 text-sm font-medium'>Rezervasyon</div>
                  <div>:</div>
                  <div className='text-xs font-medium text-green-600'>
                    <CheckIcon size={12} className='mr-1 inline' />
                    Erken Rezervasyon
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </CheckoutCard>
      <div className='my-3'>
        {roomGroup.earlyBooking && (
          <CheckoutCard title='Ön Ödeme Bilgilendirmesi'>
            <Alert
              icon={<CgDanger size={20} />}
              color='red'
              variant='light'
              className='mb-4'
            >
              <div className='space-y-2 text-sm'>
                <p>
                  Rezervasyonunuzun <strong>%25</strong>&apos;i olan{' '}
                  <strong>
                    {formatCurrency(
                      passengerData?.paymentInformation?.collectingTotal || 0
                    )}
                  </strong>{' '}
                  ve güvence paketi ücreti tahsil edilmiştir. Kalan{' '}
                  <strong>
                    {formatCurrency(
                      (passengerData?.paymentInformation?.basketTotal || 0) -
                        (passengerData?.paymentInformation?.collectingTotal ||
                          0)
                    )}
                  </strong>{' '}
                  tutarını <strong>rezervasyonlarım</strong> sayfasından, otel
                  giriş tarihinden <strong>4 gün öncesine kadar</strong>{' '}
                  tamamlayabilirsiniz.
                  <strong>
                    {dayjs(roomGroup.checkInDate)
                      .subtract(4, 'days')
                      .format('DD MMMM YYYY')}
                  </strong>{' '}
                  tarihine kadar ödeme yapabilirsiniz.
                </p>
                <p>
                  Kalan tutar sabit kalacak olup, kampanya veya fiyat
                  değişikliklerinde değişmeyecektir.
                </p>
                <p>
                  Kalan tutarı taksitli ödemek isterseniz, ödeme günündeki
                  taksit ödeme koşulları uygulanacaktır.
                </p>
              </div>
            </Alert>
          </CheckoutCard>
        )}
      </div>
      <div className='my-3'>
        <CheckoutCard title='İptal Politikası'>
          {data.hotelCancelWarranty?.selectingCancelWarranty ? (
            <div className='text-sm'>
              <div className='flex items-center gap-2'>
                <div className='text-md font-medium'>İptal Koşulları : </div>
                <span className='font-medium text-green-800'>
                  Rezervasyonunuzu İptal Güvence Paketi ile son 72 saate kadar
                  iptal ettirebilirsiniz.{' '}
                </span>
              </div>
            </div>
          ) : (
            <div className='text-sm'>
              <div className='flex items-center gap-2'>
                <div className='text-md font-medium'>İptal Koşulları : </div>
                {roomGroup.nonRefundable ? (
                  ' İptal Edilemez'
                ) : (
                  <span className='font-medium text-green-800'>
                    Ücretsiz İptal
                  </span>
                )}
              </div>

              {roomGroup.cancellationPolicies &&
                roomGroup.cancellationPolicies.map((cancelWarranty, index) => (
                  <div className='pt-3 font-medium text-green-800' key={index}>
                    {cancelWarranty.description}
                  </div>
                ))}
            </div>
          )}
        </CheckoutCard>
      </div>
      <div className=''>
        <CheckoutCard title='Oda Bilgileri'>
          <div>
            {roomGroup.priceDifferenceBackGuarantee && (
              <div className='mb-3 grid items-center gap-2'>
                <div className='font-medium'>Fiyat Farkı İade Garantisi :</div>
                <div className='text-sm'>
                  Otelde, konaklama yapacağınız tarihten önce satın aldığınız
                  tutarı olumsuz yönde etkileyecek şekilde, Paraflytravel.com
                  sitesi üzerinde bir fiyat farkı oluşur ise, aradaki fiyat
                  farkı iade edilir.{' '}
                </div>
              </div>
            )}
            {roomGroup.roomDetails &&
              Object.keys(roomGroup.roomDetails).map((roomKey) => {
                return (
                  <div className='grid gap-3' key={roomKey}>
                    {roomGroup.roomDetails[roomKey].roomType && (
                      <div className='flex items-center gap-2'>
                        <div className='font-medium'>Oda Detayı :</div>
                        <div>{roomGroup.roomDetails[roomKey].roomType}</div>
                      </div>
                    )}
                    {roomGroup.roomDetails[roomKey].pensionType && (
                      <div className='flex items-center gap-2'>
                        <div className='font-medium'>Konsept :</div>
                        <div>{roomGroup.roomDetails[roomKey].pensionType}</div>
                      </div>
                    )}
                    {roomGroup.roomDetails[roomKey].bedType != null &&
                      roomGroup.roomDetails[roomKey].bedType !== '' && (
                        <div className='flex items-center gap-2'>
                          <div className='font-medium'>Yatak Tipi :</div>
                          <div>{roomGroup.roomDetails[roomKey].bedType}</div>
                        </div>
                      )}
                    {roomGroup.roomDetails[roomKey].size != null &&
                      roomGroup.roomDetails[roomKey].size !== 0 && (
                        <div className='flex items-center gap-2'>
                          <div className='font-medium'>Boyut :</div>
                          <div>
                            {roomGroup.roomDetails[roomKey].size + ` m²`}
                          </div>
                        </div>
                      )}
                    {roomGroup.roomDetails[roomKey].quantity && (
                      <div className='flex items-center gap-2'>
                        <div className='font-medium'>Kişi Sayısı :</div>
                        <div>
                          {roomGroup.roomDetails[roomKey].quantity + ` Kişi`}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        </CheckoutCard>
      </div>
    </>
  )
}

export { HotelSummary }
