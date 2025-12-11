import { Column, Img, Row } from '@react-email/components'

type IProps = {
  data: {
    fullName: React.ReactNode
    idNumber: React.ReactNode
    gsm: React.ReactNode
    address: React.ReactNode
  }
}
export const BillingCard: React.FC<IProps> = ({ data }) => {
  return (
    <>
      <table cellPadding={5}>
        <tbody>
          <tr>
            <td className='w-32 font-medium'>İsim Soyisim</td>
            <td>:</td>
            <td className='font-bold'>{data.fullName}</td>
          </tr>
          <tr>
            <td className='w-32 font-medium'>TC. Kimlik No</td>
            <td>:</td>
            <td className='font-bold'>{data.idNumber}</td>
          </tr>
          <tr>
            <td className='w-32 font-medium'>GSM</td>
            <td>:</td>
            <td className='font-bold'>{data.gsm}</td>
          </tr>
          <tr>
            <td className='w-32 font-medium'>Adres</td>
            <td>:</td>
            <td className='font-bold'>{data.address}</td>
          </tr>
        </tbody>
      </table>
      <div className='my-2'>
        <Row
          cellPadding={5}
          cellSpacing={4}
          className='rounded bg-blue-700 p-2 text-sm font-bold text-white'
        >
          <Column className='p-2'>
            <Img
              alt='ikon'
              width={16}
              height={16}
              src='https://ykmturizm.mncdn.com/11/Files/email/img/blue-info.png'
            />
          </Column>
          <Column>E-faturanız mail adresinize ayrıca gönderilecektir.</Column>
        </Row>
      </div>
    </>
  )
}
