import { Title } from '@mantine/core'
import { TourDetailApiResponse } from '@/modules/tour/type'
type Props = {
  data: TourDetailApiResponse
}

const TourDetail: React.FC<Props> = ({ data }) => {
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-5 p-5'>
        <div className='flex flex-col gap-6'>
          <Title
            className='border-b border-gray-400 pb-1 text-blue-600'
            order={2}
            fz={'h2'}
            px={{ base: 'md', md: 0 }}
            id='tour-program'
          >
            Tur Programı
          </Title>
          {data.detail.tourProgram.map((tourProgram, tourProgramIndex) => (
            <div key={tourProgramIndex}>
              <Title order={4} fz={{ base: 'md' }} c={'blue.6'} pb='md'>
                {tourProgram.title}
              </Title>
              <div className='text-sm leading-relaxed'>
                <div
                  dangerouslySetInnerHTML={{
                    __html: tourProgram.description,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { TourDetail }
