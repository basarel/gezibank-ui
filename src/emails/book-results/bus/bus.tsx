import { Column, Row, Link } from '@react-email/components'
import {
  BusSummaryResponse,
  OperationResultType,
} from '@/app/reservation/types'
import { busDummyResponse } from '../_dummy-response/bus'
import { EmailCard } from '../../../components/order-components/email-card'
import { EmailBody } from '../../_components/body'
import dayjs from 'dayjs'
import { SuccessCard } from '@/components/order-components/success-card'
import { formatCurrency } from '@/libs/util'
import { Img } from '@react-email/components'
import { BillingCard } from '@/components/order-components/billing-card'
type IProps = {
  data: OperationResultType
}

export default function EmailBusOrderResult({ data }: IProps) {
  const { busJourney } = data.product.summaryResponse as BusSummaryResponse
  const { passenger } = data

  const passengerInfo = passenger.passengers[0]
  return (
    <EmailBody previewText='Otobüs bilet bilgileriniz'>
      <SuccessCard name={data.passenger.passengers[0].fullName} />
      <Link href={`${process.env.SITE_URL}/kampanyalar?categoryId=157`}>
        <Img
          width={'100%'}
          src='https://paraflystatic.mncdn.com/7/Content/transaction/otel.png'
        />
      </Link>
      <EmailCard
        title={
          <Row className='w-full'>
            <Column>
              <tr>
                <td align='left'>Sefer Bilgileri</td>
                <td align='right'>
                  <Img
                    sizes='50px'
                    src={`https://eticket.ipektr.com/wsbos3/LogoVer.Aspx?fnum=${busJourney.companyId}`}
                    alt={`${busJourney.company} logosu`}
                  />
                </td>
              </tr>
            </Column>
          </Row>
        }
      >
        <Row className='w-full' cellPadding={2}>
          <Column width={180}>
            <div>Firma</div>
            <div className='mt-1 font-bold'>{busJourney.company}</div>
          </Column>
          <Column width={150} className='text-center'>
            <div>Kalkış</div>
            <div className='mt-1 font-bold'>{busJourney.origin}</div>
          </Column>
          <Column width={250} className='text-center'>
            <div>Varış</div>
            <div className='mt-1 font-bold'>{busJourney.destination}</div>
          </Column>
          <Column width={150} className='text-center'>
            <div>Tarih</div>
            <div className='mt-1 font-bold'>
              {dayjs(busJourney.bus.departureDate).format(
                'DD MMMM YYYY - dddd HH:mm'
              )}
            </div>
          </Column>
        </Row>
      </EmailCard>

      <EmailCard title='Yolcu Bilgileri'>
        <Row className='w-full' cellPadding={6}>
          <thead>
            <tr className='text-xs font-bold'>
              <Column>ÜNVAN</Column>
              <Column>ADI SOYADI</Column>
              <Column>DOĞUM TARİHİ</Column>
              <Column>TC. NO</Column>
              <Column>KOLTUK NO</Column>
              <Column>REZERVASYON NO.</Column>
            </tr>
          </thead>

          <tbody>
            {passenger.passengers.map((passengerInfo, index) => (
              <tr key={index}>
                <Column width={80}>
                  {passengerInfo.gender == 0 ? 'Bay' : 'Bayan'}
                </Column>
                <Column width={180}>
                  {passengerInfo.firstName} {passengerInfo.lastName}
                </Column>
                <Column width={120}>
                  {dayjs(passengerInfo.birthday).format('DD.MM.YYYY')}
                </Column>
                <Column width={120}>{passengerInfo.identityNumber}</Column>
                <Column width={150}>
                  {busJourney.selectedSeats[index].no}
                </Column>
                <Column width={150}>
                  <div>{passengerInfo.bookingCode}</div>
                </Column>
              </tr>
            ))}
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
          {passenger.paymentInformation.basketDiscountTotal != null &&
            passenger.paymentInformation.basketDiscountTotal > 0 && (
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
          {passenger.paymentInformation.mlTotal != null &&
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
              {passenger.paymentInformation.installmentCount > 1 ? (
                <>{passenger.paymentInformation.installmentCount} Taksit = </>
              ) : null}
              {formatCurrency(
                passenger.paymentInformation.basketTotal -
                  (passenger.paymentInformation.basketDiscountTotal || 0) -
                  (passenger.paymentInformation.mlTotal || 0)
              )}{' '}
            </td>
          </tr>
        </table>
      </EmailCard>
    </EmailBody>
  )
}

// Preview için gerçek dummy data kullanımı
EmailBusOrderResult.PreviewProps = {
  data: busDummyResponse.data,
}
