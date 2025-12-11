import {
  HotelSummaryResponse,
  OperationResultType,
} from '@/app/reservation/types'
import { Column, Img, Row } from '@react-email/components'

import { hotelDummyOrderResultResponse } from '../_dummy-response/hotel'
import { EmailBody } from '../../_components/body'
import { EmailCard } from '../../../components/order-components/email-card'
import dayjs from 'dayjs'
import { formatCurrency } from '@/libs/util'
import { SuccessCard } from '@/components/order-components/success-card'
import { BillingCard } from '@/components/order-components/billing-card'
import { Link } from '@react-email/components'

type IProps = {
  data: OperationResultType
}

export default function EmailHotelOrderResult({ data }: IProps) {
  const { roomGroup } = data.product.summaryResponse as HotelSummaryResponse
  const { passenger, hotelCancelWarranty } = data
  const passengerInfo = data.passenger.passengers[0]
  return (
    <EmailBody>
      <SuccessCard name={data.passenger.passengers[0].fullName} />
      <Link
        href={`${process.env.SITE_URL}/kampanyalar?categoryId=156`}
        className='block'
      >
        <Img
          width={'100%'}
          src='https://paraflystatic.mncdn.com/7/Content/transaction/ucak.png'
        />
      </Link>

      {hotelCancelWarranty.couponActive && (
        <>
          <div className='h-[16px]'>&nbsp;</div>
          <EmailCard
            title={
              <div className='text-md flex items-center text-red-800'>
                <Img
                  className='mr-3'
                  src='https://ykmturizm.mncdn.com/11/Files/email/img/red-info.png'
                />
                %25&#39;ini Şimdi, %75&#39;ini Tatilden Önce Öde Kampanya
                Bilgilendirme
              </div>
            }
          >
            <div>
              {hotelCancelWarranty.couponActive && (
                <div>
                  Rezervasyonunuzun %25 olan:{' '}
                  <strong>
                    {formatCurrency(
                      passenger.paymentInformation.basketTotal -
                        passenger.paymentInformation.basketDiscountTotal
                    )}
                  </strong>{' '}
                  ve güvence paketi tahsil edilmiştir. Kalan{' '}
                  <strong>
                    {formatCurrency(
                      passenger.paymentInformation.basketDiscountTotal
                    )}
                  </strong>{' '}
                  lik tutarı, otele giriş gününüze 4 gün kalaya (
                  {dayjs(roomGroup.checkInDate)
                    .subtract(4, 'days')
                    .format('DD MMMM YYYY')}
                  ) kadar, rezervasyonlarım sayfasına giderek
                  tamamlayabilirsiniz. Kampanya veya fiyat değişikliği olması
                  halinde kalan tutar sabit kalacak ve değişmeyecektir. Kalan
                  tutarı taksitli ödemek isterseniz, ödeme yaptığınız günkü
                  taksitli ödeme koşulları baz alınacaktır.
                </div>
              )}
            </div>
          </EmailCard>
        </>
      )}

      <EmailCard title='Otel Bilgisi'>
        <Row>
          <Column width='330'>
            <Img
              width={300}
              height={200}
              src={roomGroup.hotel.images.at(0)?.original}
              alt={roomGroup.hotel.name}
              style={{ borderRadius: '10px' }}
            />
          </Column>

          <Column valign='top'>
            <strong>{roomGroup.hotel.name}</strong>
            <div className='text-sm'>{roomGroup.hotel.address}</div>

            <table className='mt-2 text-sm' cellPadding={6}>
              <tbody>
                <tr>
                  <td>
                    <div>Giriş Tarihi</div>
                  </td>
                  <td>:</td>
                  <td>
                    {dayjs(roomGroup.checkInDate).format('DD MMMM YYYY dddd')}
                  </td>
                </tr>
                <tr>
                  <td>
                    <div>Çıkış Tarihi</div>
                  </td>
                  <td>:</td>
                  <td>
                    {dayjs(roomGroup.checkOutDate).format('DD MMMM YYYY dddd')}
                  </td>
                </tr>
                <tr>
                  <td>
                    <div>Konaklama</div>
                  </td>
                  <td>:</td>
                  <td>
                    {dayjs(roomGroup.checkOutDate).diff(
                      roomGroup.checkInDate,
                      'day'
                    )}{' '}
                    Gece
                  </td>
                </tr>
                <tr>
                  <td>
                    <div>Misafirler</div>
                  </td>
                  <td>:</td>
                  <td>{data.passenger.passengers.length} Kişi</td>
                </tr>
                {roomGroup.earlyBooking && (
                  <tr>
                    <td>Rezervasyon</td>
                    <td>:</td>
                    <td>Erken Rezervasyon</td>
                  </tr>
                )}
              </tbody>
            </table>
          </Column>
        </Row>
      </EmailCard>
      <EmailCard title='Misafir Bilgileri'>
        <Row className='w-full' cellPadding={6}>
          <thead>
            <tr className='text-sm font-bold'>
              <Column>Ünvan</Column>
              <Column>Adı Soyadı</Column>
              <Column>Doğum Tarihi</Column>
              <Column>TC No</Column>
              <Column>Rezervasyon No</Column>
            </tr>
          </thead>
          <tbody>
            {data.passenger.passengers.map(
              ({ fullName, gender, identityNumber, birthday, bookingCode }) => {
                return (
                  <tr key={identityNumber}>
                    <Column>{gender == 0 ? 'Bay' : 'Bayan'}</Column>
                    <Column>{fullName}</Column>
                    <Column>{dayjs(birthday).format('DD.MM.YYYY')}</Column>
                    <Column>{identityNumber}</Column>
                    <Column>{bookingCode}</Column>
                  </tr>
                )
              }
            )}
          </tbody>
        </Row>
      </EmailCard>
      <EmailCard title='Oda Bilgileri'>
        <div className='my-3'>
          {roomGroup.priceDifferenceBackGuarantee && (
            <div>
              <span className='text-md font-medium'>
                {' '}
                Fiyat Farkı İade Garantisi:
              </span>{' '}
              <br />
              <span>
                {' '}
                Otelde, konaklama yapacağınız tarihten önce satın aldığınız
                tutarı olumsuz yönde etkileyecek şekilde, Gezibank.com sitesi
                üzerinde bir fiyat farkı oluşur ise, aradaki fiyat farkı iade
                edilir.{' '}
              </span>
            </div>
          )}
        </div>
        <div>
          {roomGroup.roomDetails &&
            Object.keys(roomGroup.roomDetails).map((roomKey) => {
              return (
                <div key={roomKey} className='my-3 grid gap-3'>
                  {roomGroup.roomDetails[roomKey].roomType && (
                    <div className='flex items-center gap-2' key={roomKey}>
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
                          {roomGroup.roomDetails[roomKey].size
                            ? `${roomGroup.roomDetails[roomKey].size} m² -`
                            : ''}
                        </div>
                      </div>
                    )}
                  {roomGroup.roomDetails[roomKey].quantity && (
                    <div className='flex items-center gap-2'>
                      <div className='font-medium'>Kişi Sayısı :</div>
                      <div>
                        {roomGroup.roomDetails[roomKey].quantity
                          ? `${roomGroup.roomDetails[roomKey].quantity} Kişi`
                          : ''}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
        </div>
        {hotelCancelWarranty.selectingCancelWarranty ? (
          <div>
            <div className='my-3 flex items-center gap-2'>
              <span className='text-md font-medium'>İptal Koşulları : </span>
              <span className='font-medium text-green-800'>
                Rezervasyonunuzu İptal Güvence Paketi ile son 72 saate kadar
                iptal ettirebilirsiniz.
              </span>
            </div>
          </div>
        ) : (
          <div className='mt-5 text-sm'>
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

            {roomGroup.cancellationPolicies.map((cancelWarranty, index) => (
              <div className='pt-3 font-medium text-green-800' key={index}>
                {cancelWarranty.description}
              </div>
            ))}
          </div>
        )}
      </EmailCard>

      <EmailCard title='Fatura Bilgileri'>
        <BillingCard
          data={{
            fullName: passengerInfo.fullName,
            idNumber: passengerInfo.identityNumber,
            gsm: passengerInfo.mobilePhoneNumber,
            address: data.passenger.billingInformation.at(0)?.address,
          }}
        />
      </EmailCard>

      <EmailCard title='Ödeme Bilgileri'>
        <table cellPadding={4}>
          <tr>
            <td width={150}>Toplam Fiyat</td>
            <td>:</td>
            <td className='font-bold'>
              {formatCurrency(passenger.paymentInformation.basketTotal)}
            </td>
          </tr>
          {passenger.paymentInformation.basketDiscountTotal > 0 &&
            !roomGroup?.earlyBooking && (
              <tr>
                <td>İndirim Tutarı</td>
                <td>:</td>
                <td className='font-bold'>
                  {formatCurrency(
                    passenger.paymentInformation.basketDiscountTotal
                  )}
                </td>
              </tr>
            )}
          {passenger.paymentInformation.mlTotal &&
            passenger.paymentInformation.mlTotal > 0 && (
              <tr>
                <td>ParafPara TL</td>
                <td>:</td>
                <td className='font-bold'>
                  {formatCurrency(passenger.paymentInformation.mlTotal)}
                </td>
              </tr>
            )}
          {roomGroup?.earlyBooking && (
            <>
              <tr>
                <td>Ön Ödeme</td>
                <td>:</td>
                <td className='font-bold'>
                  {formatCurrency(passenger.paymentInformation.collectingTotal)}
                </td>
              </tr>
              <tr>
                <td>Kalan Tutar</td>
                <td>:</td>
                <td className='font-bold'>
                  {formatCurrency(
                    passenger.paymentInformation.basketDiscountTotal
                  )}
                </td>
              </tr>
              <tr>
                <td>Son Ödeme Tarihi</td>
                <td>:</td>
                <td className='font-bold'>
                  {dayjs(roomGroup.checkInDate)
                    .subtract(4, 'days')
                    .format('DD MMMM YYYY')}
                </td>
              </tr>
            </>
          )}
          <tr>
            <td>Kart Numarası</td>
            <td>:</td>
            <td className='font-bold'>
              {passenger.paymentInformation.encryptedCardNumber}
            </td>
          </tr>
          <tr>
            <td>Kart Sahibi</td>
            <td>:</td>
            <td className='font-bold'>
              {passenger.paymentInformation.encryptedCardHolder}
            </td>
          </tr>
          <tr>
            <td>Ödeme Yöntemi</td>
            <td>:</td>
            <td className='font-bold'>
              {passenger.paymentInformation.installmentCount > 1 ? (
                <>{passenger.paymentInformation.installmentCount} Taksit</>
              ) : (
                'Tek Çekim'
              )}
            </td>
          </tr>
          <tr>
            <td>Kredi Kartından Çekilen Tutar</td>
            <td>:</td>
            <td className='font-bold'>
              {formatCurrency(
                Math.abs(
                  (passenger.paymentInformation.basketTotal || 0) -
                    (passenger.paymentInformation.basketDiscountTotal || 0) -
                    (passenger.paymentInformation.mlTotal || 0)
                )
              )}
            </td>
          </tr>
        </table>
      </EmailCard>
    </EmailBody>
  )
}

EmailHotelOrderResult.PreviewProps = {
  data: hotelDummyOrderResultResponse,
}
