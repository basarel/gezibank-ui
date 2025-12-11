'use client'

import { Box, Container } from '@mantine/core'
import NextImage from 'next/image'
import { Widgets } from '@/types/cms-types'
import { cdnImageUrl } from '@/libs/cms-data'

type VideoPromoProps = {
  data?: Widgets[0] | null
}

const VideoPromo: React.FC<VideoPromoProps> = ({ data }) => {
  if (!data) {
    return null
  }

  const title = data.title
  const videoUrl = data.params.link?.value
  const backgroundImage = cdnImageUrl(data.params.image.value)

  return (
    <Container className='mb-8 md:mb-12'>
      <Box className='relative overflow-hidden rounded-2xl shadow-xl'>
        <div className='absolute inset-0 -z-10'>
          <NextImage
            src={backgroundImage}
            alt='Background'
            fill
            className='object-cover'
            priority
          />
        </div>
        <div className='absolute inset-0 -z-10 bg-black/40' />

        <div className='relative grid grid-cols-1 gap-6 p-6 md:grid-cols-2 md:gap-8 md:p-8 lg:p-20'>
          <div className='flex flex-col justify-center'>
            <h3 className='mb-4 text-center text-2xl leading-tight font-bold text-white md:text-3xl lg:text-3xl'>
              {title}
            </h3>
          </div>

          <div className='relative aspect-video w-full overflow-hidden rounded-lg'>
            <iframe
              src={videoUrl}
              title='Video player'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              className='h-full w-full rounded-lg border-4 border-orange-500'
            />
          </div>
        </div>
      </Box>
    </Container>
  )
}

export { VideoPromo }
