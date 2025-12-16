import { Column, Heading, Img, Link, Row } from '@react-email/components'
import {
  FlightSummaryResponse,
  OperationResultType,
} from '@/app/(frontend)/reservation/types'
import dayjs from 'dayjs'

import { Fragment } from 'react'
import { formatCurrency } from '@/libs/util'
import { EmailCard } from '../../../components/order-components/email-card'
import { __dummy__flightPaymentSummaryResponse } from '../_dummy-response/flight'
import { EmailBody } from '../../_components/body'
import { SuccessCard } from '@/components/order-components/success-card'
import { BillingCard } from '@/components/order-components/billing-card'

type IProps = {
  data: OperationResultType
}

export default function EmailFlightBookResult({ data }: IProps) {
  const { flightList, airlineList, airportList } = data.product
    .summaryResponse as FlightSummaryResponse

  const { passenger } = data
  const passengerInfo = passenger.passengers[0]
  return (
    <EmailBody>
      <SuccessCard name={data.passenger.passengers[0].fullName} />
      <Link href={`${process.env.SITE_URL}/kampanyalar?categoryId=158`}>
        <Img
          width={'100%'}
          src='https://paraflystatic.mncdn.com/7/Content/transaction/arac.png'
        />
      </Link>
      <div>
        {flightList.map((flight) => {
          return (
            <>
              {' '}
              <div key={flight.flightDetail.key}>
                <EmailCard
                  title={
                    flight.flightDetail.groupId === 0
                      ? 'Gidiş Uçuşu'
                      : 'Dönüş Uçuşu'
                  }
                >
                  {flight.flightSegments.map(
                    (segment, segmentIndex, segmentArr) => {
                      return (
                        <Fragment key={segmentIndex}>
                          {segmentIndex > 0 &&
                            (() => {
                              const previousSegment =
                                segmentArr[segmentIndex - 1]
                              const layoverMinutes = dayjs(
                                segment.departureTime
                              ).diff(
                                dayjs(previousSegment.arrivalTime),
                                'minute'
                              )
                              const layoverHours = Math.floor(
                                layoverMinutes / 60
                              )
                              const layoverMins = layoverMinutes % 60
                              const layoverText =
                                layoverHours > 0
                                  ? `${layoverHours}s ${layoverMins}dk`
                                  : `${layoverMins}dk`

                              return (
                                <Row className='bg-gray my-3 p-3 font-semibold text-red-800'>
                                  <Column align='center'>
                                    {segmentIndex} Aktarma{' - '}
                                    {
                                      airportList[
                                        previousSegment.destination.code
                                      ].value.find(
                                        (val) => val.langCode === 'tr_TR'
                                      )?.value
                                    }{' '}
                                    ({previousSegment.destination.code}) -
                                    Bekleme Süresi: {layoverText}
                                  </Column>
                                </Row>
                              )
                            })()}
                          <Row cellPadding={8}>
                            <Column width={1} valign='top'>
                              <Img
                                className='size-[28px]'
                                src={`https://images.trvl-media.com/media/content/expus/graphics/static_content/fusion/v0.1b/images/airlines/vector/s/${segment.operatingAirline.code}_sq.jpg`}
                                alt={airlineList[segment.operatingAirline.code]}
                              />
                            </Column>
                            <Column
                              className='text-sm'
                              width={150}
                              valign='top'
                            >
                              <div>
                                {airlineList[segment.operatingAirline.code]}
                              </div>
                              <div>
                                {segment.operatingAirline.code}
                                {segment.flightNumber}
                              </div>
                              <div>{segment.freeVolatileData.BrandName}</div>
                            </Column>
                            <Column valign='top' width={100}>
                              <Heading
                                as='h4'
                                className='mt-0 mb-1 font-medium'
                              >
                                Kalkış ({segment.origin.code.toUpperCase()})
                              </Heading>
                              <div className='mb-1'>
                                {dayjs(segment.departureTime).format(
                                  'DD.MM.YYYY, '
                                )}
                                <strong>
                                  {dayjs(segment.departureTime).format('HH.mm')}
                                </strong>
                              </div>
                              <div className='text-sm'>
                                <div>
                                  {airportList[segment.origin.code].city},{' '}
                                  {airportList[segment.origin.code].country}
                                </div>
                                <div>
                                  {
                                    airportList[segment.origin.code].value.find(
                                      (val) => val.langCode === 'tr_TR'
                                    )?.value
                                  }
                                </div>
                              </div>
                            </Column>
                            <Column valign='middle' width={50} align='center'>
                              <div
                                style={{ fontSize: '34px', fontWeight: 'bold' }}
                              >
                                →
                              </div>
                            </Column>
                            <Column valign='top' width={200}>
                              <Heading as='h4' className='m-0 mb-1 font-medium'>
                                Varış ({segment.destination.code.toUpperCase()})
                              </Heading>
                              <div className='mb-1'>
                                {dayjs(segment.arrivalTime).format(
                                  'DD.MM.YYYY, '
                                )}

                                <strong>
                                  {dayjs(segment.arrivalTime).format('HH.mm')}
                                </strong>
                              </div>
                              <div className='text-sm'>
                                <div>
                                  {airportList[segment.destination.code].city},{' '}
                                  {
                                    airportList[segment.destination.code]
                                      .country
                                  }
                                </div>
                                <div>
                                  {
                                    airportList[
                                      segment.destination.code
                                    ].value.find(
                                      (val) => val.langCode === 'tr_TR'
                                    )?.value
                                  }
                                </div>
                              </div>
                            </Column>
                          </Row>
                        </Fragment>
                      )
                    }
                  )}
                </EmailCard>
              </div>
            </>
          )
        })}

        <EmailCard title='Yolcu Bilgileri'>
          <Row cellPadding={6}>
            <thead className='text-sm font-bold'>
              <tr>
                <Column>Ünvan</Column>
                <Column>Adı Soyadı</Column>
                <Column>Doğum Tarihi</Column>
                <Column>TC No</Column>
                <Column>Rezervasyon No</Column>
                <Column>E-Bilet No</Column>
              </tr>
            </thead>
            <tbody className='text-sm'>
              {data.passenger.passengers.map(
                ({ fullName, identityNumber, ...passenger }) => {
                  return (
                    <tr key={identityNumber}>
                      <Column>
                        {passenger.gender === 0 ? 'Bay' : 'Bayan'}
                      </Column>
                      <Column>{fullName}</Column>
                      <Column>
                        {dayjs(passenger.birthday).format('DD.MM.YYYY')}
                      </Column>
                      <Column>{identityNumber}</Column>
                      <Column>
                        <div>{passenger.bookingCode}</div>
                      </Column>
                      <Column>
                        <div>{passenger.eTicketNumber}</div>
                      </Column>
                    </tr>
                  )
                }
              )}
            </tbody>
          </Row>
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
            {passenger.paymentInformation.basketDiscountTotal > 0 && (
              <tr>
                <td>İndirim Tutarı</td>
                <td>:</td>
                <td className='font-bold'>
                  -
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
        <EmailCard title='Lütfen Satın Aldığınız Seyahat Detaylarını Kontrol Ediniz'>
          <table cellPadding={4}>
            <tr>
              <td>
                • Satın alma işleminiz tamamlandıktan sonra iptal ve iade
                talepleriniz de satın almış olduğunuz ürünün kuralları
                kapsamında işlem yapılmaktadır.{' '}
              </td>
            </tr>
            <tr>
              <td>
                •Sıralı uçuş kuralı gereği ilk uçuş kullanılmadığında,
                sonrasındaki uçuş veya uçuşlar kullanılamaz.{' '}
              </td>
            </tr>
            <tr>
              <td>
                •Yurt dışı uçuşlarınızda pasaportunuzun seyahat başlangıç
                tarihinden itibaren en az 6 ay önce suresi olduğunu kontrol
                ediniz.
              </td>
            </tr>
            <tr>
              <td>
                Herhangi bir gecikme yaşamamak adına uçuştan 120 dakika önce
                havalimanında olarak bagaj kontrolü ve check-in işlemlerinizi
                tamamlamanız tavsiye edilir.
              </td>
            </tr>
          </table>
        </EmailCard>
      </div>
    </EmailBody>
  )
}

EmailFlightBookResult.PreviewProps = {
  data: __dummy__flightPaymentSummaryResponse.data,
}
