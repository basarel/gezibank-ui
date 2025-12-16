import { Column, Img, Row, Link, Heading } from '@react-email/components'
import dayjs from 'dayjs'

import { EmailBody } from '../../_components/body'

import {
  CyprusPackageSummaryResponse,
  OperationResultType,
} from '@/app/(frontend)/reservation/types'

import { __dummy__cyprusPackageResult } from '../_dummy-response/cyprus'
import { EmailCard } from '@/components/order-components/email-card'
import { SuccessCard } from '@/components/order-components/success-card'
import { BillingCard } from '@/components/order-components/billing-card'
import { formatCurrency } from '@/libs/util'
import { Fragment } from 'react'

type IProps = {
  data: OperationResultType
}

export default function EmailCyprusPackageBookResult({ data }: IProps) {
  const summary = data.product.summaryResponse as CyprusPackageSummaryResponse
  const { roomGroup, segmentData, selectResponse } = summary
  const { hotel } = roomGroup
  const { passenger } = data
  const passengerInfo = passenger.passengers[0]

  const hasHotel = !!hotel
  const hasFlight = segmentData.length > 0
  const hasTransfer = selectResponse && selectResponse.length > 0

  const packageTitle = [
    hasHotel && 'Otel',
    hasFlight && 'Uçak',
    hasTransfer && 'Transfer',
  ]
    .filter(Boolean)
    .join(' + ')
  const departureFlights = segmentData.filter((seg) =>
    seg.origin.toLowerCase().includes('ayt')
  )
  const returnFlights = segmentData.filter((seg) =>
    seg.destination.toLowerCase().includes('ayt')
  )

  const departureTransfer = selectResponse?.find(
    (tr) => tr.pickupPointType === 2
  )
  const returnTransfer = selectResponse?.find((tr) => tr.dropPointType === 2)
  return (
    <EmailBody>
      <SuccessCard name={passengerInfo.fullName} />
      <Link href={`${process.env.SITE_URL}/kampanyalar?categoryId=156`}>
        <Img
          width={'100%'}
          src='https://paraflystatic.mncdn.com/7/Content/transaction/ucak.png'
        />
      </Link>
      <EmailCard title={packageTitle}>
        <Row>
          <Column width='330'>
            <Img
              width='310'
              src={hotel.images.at(0)?.original}
              alt={hotel.name}
              style={{ borderRadius: '10px' }}
            />
          </Column>

          <Column valign='top'>
            <strong>{hotel.name}</strong>
            <div>{hotel.address}</div>

            <table className='mt-2' cellPadding={6}>
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
              </tbody>
            </table>
          </Column>
        </Row>
      </EmailCard>

      <EmailCard title='Oda Bilgisi'>
        <Row className='w-full' cellPadding={6}>
          <thead>
            <tr className='text-xs font-bold'>
              <Column>Ünvan</Column>
              <Column>Adı Soyadı</Column>
              <Column>Doğum Tarihi</Column>
              <Column>TC. No</Column>
              <Column>Rezervasyon No.</Column>
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
        <div className='mt-5 text-sm'>
          <span className='font-bold' style={{ display: 'flex', gap: '5px' }}>
            İptal Koşulları :{' '}
            <div>
              {roomGroup.nonRefundable ? ' İptal Edilemez' : 'Ücretsiz İptal'}
            </div>
          </span>

          {roomGroup.cancellationPolicies &&
            Array.isArray(roomGroup.cancellationPolicies) &&
            roomGroup.cancellationPolicies.length > 0 &&
            roomGroup.cancellationPolicies.map((cancelWarranty, index) => (
              <div className='pt-3' key={index}>
                {cancelWarranty.description}
              </div>
            ))}
        </div>
      </EmailCard>
      {hasFlight && departureFlights.length > 0 && (
        <EmailCard title='Gidiş Uçuşu'>
          {departureFlights.map((segment, segmentIndex) => {
            return (
              <Fragment key={segmentIndex}>
                {segmentIndex > 0 && (
                  <Row className='bg-gray p-3'>
                    <Column align='center'>{segmentIndex}. Aktarma</Column>
                  </Row>
                )}
                <Row cellPadding={8}>
                  <Column width={1} valign='top'>
                    <Img
                      className='size-[36px]'
                      src={`https://images.trvl-media.com/media/content/expus/graphics/static_content/fusion/v0.1b/images/airlines/vector/s/${segment.operatingAirline.code}_sq.jpg`}
                      alt={segment.operatingAirline.name}
                    />
                  </Column>
                  <Column className='text-xs' width={150} valign='top'>
                    <div>{segment.operatingAirline.name}</div>
                    <div>
                      {segment.operatingAirline.code}
                      {segment.flightNumber}
                    </div>
                  </Column>
                  <Column valign='top' width={200}>
                    <Heading as='h4' className='mt-0 mb-1'>
                      Kalkış ({segment.origin.toUpperCase()})
                    </Heading>
                    <div className='mb-1'>
                      {dayjs(segment.departureTime).format('DD.MM.YYYY, ')}
                      <strong>
                        {dayjs(segment.departureTime).format('HH:mm')}
                      </strong>
                    </div>
                  </Column>
                  <Column valign='top' width={200}>
                    <Heading as='h4' className='m-0 mb-1'>
                      Varış ({segment.destination.toUpperCase()})
                    </Heading>
                    <div className='mb-1'>
                      {dayjs(segment.arrivalTime).format('DD.MM.YYYY, ')}
                      <strong>
                        {dayjs(segment.arrivalTime).format('HH:mm')}
                      </strong>
                    </div>
                  </Column>
                </Row>
                {segment.freeVolatileData && (
                  <div className='mt-2 text-xs text-gray-600'>
                    Paket Bilgileri: Bagaj -{' '}
                    {segment.baggageAllowance?.maxWeight || 'Belirtilmemiş'}
                  </div>
                )}
              </Fragment>
            )
          })}
        </EmailCard>
      )}
      {hasFlight && returnFlights.length > 0 && (
        <EmailCard title='Dönüş Uçuşu'>
          {returnFlights.map((segment, segmentIndex) => {
            return (
              <Fragment key={segmentIndex}>
                {segmentIndex > 0 && (
                  <Row className='bg-gray p-3'>
                    <Column align='center'>{segmentIndex}. Aktarma</Column>
                  </Row>
                )}
                <Row cellPadding={8}>
                  <Column width={1} valign='top'>
                    <Img
                      className='size-[36px]'
                      src={`https://images.trvl-media.com/media/content/expus/graphics/static_content/fusion/v0.1b/images/airlines/vector/s/${segment.operatingAirline.code}_sq.jpg`}
                      alt={segment.operatingAirline.name}
                    />
                  </Column>
                  <Column className='text-xs' width={150} valign='top'>
                    <div>{segment.operatingAirline.name}</div>
                    <div>
                      {segment.operatingAirline.code}
                      {segment.flightNumber}
                    </div>
                    <div>{segment.cabinClass}</div>
                  </Column>
                  <Column valign='top' width={200}>
                    <Heading as='h4' className='mt-0 mb-1'>
                      Kalkış ({segment.origin.toUpperCase()})
                    </Heading>
                    <div className='mb-1'>
                      {dayjs(segment.departureTime).format('DD.MM.YYYY, ')}
                      <strong>
                        {dayjs(segment.departureTime).format('HH:mm')}
                      </strong>
                    </div>
                  </Column>
                  <Column valign='top' width={200}>
                    <Heading as='h4' className='m-0 mb-1'>
                      Varış ({segment.destination.toUpperCase()})
                    </Heading>
                    <div className='mb-1'>
                      {dayjs(segment.arrivalTime).format('DD.MM.YYYY, ')}
                      <strong>
                        {dayjs(segment.arrivalTime).format('HH:mm')}
                      </strong>
                    </div>
                  </Column>
                </Row>
                {segment.freeVolatileData && (
                  <div className='mt-2 text-xs text-gray-600'>
                    Paket Bilgileri: Bagaj -{' '}
                    {segment.baggageAllowance?.maxWeight || 'Belirtilmemiş'}
                  </div>
                )}
              </Fragment>
            )
          })}
        </EmailCard>
      )}

      {/* Transfer Bilgileri */}
      {hasTransfer && (
        <>
          {departureTransfer && (
            <EmailCard title='Transfer - Gidiş'>
              <table cellPadding={4}>
                <tbody>
                  <tr>
                    <td width={150}>
                      <strong>Güzergah</strong>
                    </td>
                    <td>:</td>
                    <td>
                      <strong>Ercan Havalimanı → {hotel.name}</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Araç Tipi</td>
                    <td>:</td>
                    <td>{departureTransfer.transferVehicle?.vehicleName}</td>
                  </tr>
                </tbody>
              </table>
            </EmailCard>
          )}

          {returnTransfer && (
            <EmailCard title='Transfer - Dönüş'>
              <table cellPadding={4}>
                <tbody>
                  <tr>
                    <td width={150}>
                      <strong>Güzergah</strong>
                    </td>
                    <td>:</td>
                    <td>
                      <strong>{hotel.name} → Ercan Havalimanı</strong>
                    </td>
                  </tr>
                  <tr>
                    <td>Araç Tipi</td>
                    <td>:</td>
                    <td>{returnTransfer.transferVehicle?.vehicleName}</td>
                  </tr>
                </tbody>
              </table>
            </EmailCard>
          )}
        </>
      )}

      {/* Fatura Bilgileri */}
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

      {/* Ödeme Bilgileri */}
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
    </EmailBody>
  )
}

EmailCyprusPackageBookResult.PreviewProps = {
  data: __dummy__cyprusPackageResult.data,
}
