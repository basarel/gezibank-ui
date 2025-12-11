import { BusSummaryResponse } from '@/app/reservation/types'
import dayjs from 'dayjs'
import { CheckoutCard } from '@/components/card'
import Image from 'next/image'
import { Img, Link } from '@react-email/components'

type IProps = {
  data: BusSummaryResponse
}

const BusSummary: React.FC<IProps> = ({ data }) => {
  const { busJourney } = data
  return (
    <>
      <Link href={`${process.env.SITE_URL}/kampanyalar?categoryId=157`}>
        <Img
          width={800}
          height={200}
          className='my-3'
          src='https://paraflystatic.mncdn.com/7/Content/transaction/otel.png'
        />
      </Link>
      <CheckoutCard title='Sefer Bilgileri'>
        <div className='overflow-x-auto'>
          <div className='min-w-[800px] md:min-w-0'>
            <div className='flex w-full items-center justify-between p-1'>
              <div className='text-lg font-bold'>{busJourney.company}</div>
              <Img
                width={70}
                height={70}
                src={`https://eticket.ipektr.com/wsbos3/LogoVer.Aspx?fnum=${busJourney.companyId}`}
                alt={`${busJourney.company} logosu`}
              />
            </div>

            <div className='my-6 grid grid-cols-4'>
              <div className='mr-3 border-r-2 border-gray-300'>
                <div className='text-sm font-bold'>Firma</div>
                <div className='mt-1 text-sm font-medium'>
                  {busJourney.company}
                </div>
              </div>
              <div className='mr-3 border-r-2 border-gray-300'>
                <div className='text-sm font-bold'>Kalkış</div>
                <div className='mt-1 text-sm font-medium'>
                  {busJourney.origin}
                </div>
              </div>
              <div className='mr-3 border-r-2 border-gray-300'>
                <div className='text-sm font-bold'>Varış</div>
                <div className='mt-1 text-sm font-medium'>
                  {busJourney.destination}
                </div>
              </div>
              <div className='mr-3'>
                <div className='text-sm font-bold'>Tarih</div>
                <div className='mt-1 text-sm font-medium'>
                  {dayjs(busJourney.bus.departureDate).format(
                    'DD MMMM YYYY - dddd HH:mm'
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CheckoutCard>
    </>
  )
}

export { BusSummary }
