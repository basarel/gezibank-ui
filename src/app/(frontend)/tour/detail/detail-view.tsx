import { Accordion, Divider, Spoiler, Title } from '@mantine/core'
import dayjs from 'dayjs'
import { IoCalendarClearOutline } from 'react-icons/io5'

import { TourDetailApiResponse } from '@/modules/tour/type'
import { BiMoon } from 'react-icons/bi'
import { IoIosAirplane } from 'react-icons/io'
import { MdOutlineLocalHotel } from 'react-icons/md'
import { FaRegCheckCircle } from 'react-icons/fa'
import { GoNoEntry } from 'react-icons/go'
import { TbWorld } from 'react-icons/tb'
import { CiLocationOn } from 'react-icons/ci'
import { HiOutlineLocationMarker } from 'react-icons/hi'
// import { TourPassengers } from '../_components/tour-passengers'
type Props = {
  data: TourDetailApiResponse
}

const TourDetail: React.FC<Props> = ({ data }) => { 
  
  return (
    <div className='flex flex-col gap-6'>
      <div className='flex flex-col gap-5 p-5'>
        <div className='flex flex-col gap-6'>
          <Title
            order={2}
            fz={{ base: 'h4', md: 'h2' }}
            px={{ base: 'md', md: 0 }}
            id='tour-program'
          >
            Tur Programı
          </Title>
          {data.detail.tourProgram.map((tourProgram, tourProgramIndex) => (
            <div key={tourProgramIndex}>
              <Title order={4} fz={{ base: 'md' }} c={'blue.8'} pb='md'>
                {tourProgram.title}
              </Title>
              <Title fz={'sm'} lh={'sm'}>
                <div
                  dangerouslySetInnerHTML={{
                    __html: tourProgram.description,
                  }}
                />
              </Title>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export { TourDetail }
