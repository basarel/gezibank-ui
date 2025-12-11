'use client'

import { Route } from 'next'
import { Link } from 'next-view-transitions'
import { AspectRatio, Box, Button, Image, Skeleton, Text } from '@mantine/core'
import { Carousel, CarouselSlide } from '@mantine/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { Widgets } from '@/types/cms-types'
import aspectRatioClasses from './storyitems.module.css'
import { cdnImageUrl } from '@/libs/cms-data'
import { useMounted } from '@mantine/hooks'
import { useRef } from 'react'

export const StorySliderSkeleton = () => {
  return (
    <div className='flex w-full justify-center gap-5 overflow-hidden whitespace-nowrap'>
      {new Array(8).fill(true).map((_, itemIndex) => (
        <div key={itemIndex} className='flex flex-col gap-2 md:gap-8'>
          <Skeleton className='size-[90px] md:size-[160px]' circle />

          <Skeleton h={16} radius='md' className='mx-auto w-[65%]' />
        </div>
      ))}
    </div>
  )
}

type IProps = {
  data: Widgets
}

const StorySlider: React.FC<IProps> = ({ data }) => {
  const autoplay = useRef(Autoplay({ delay: 3000 }))
  const dealsOfWeekData = data
  const isMounted = useMounted()

  if (!isMounted) {
    return (
      <div className='relative overflow-hidden whitespace-nowrap'>
        <StorySliderSkeleton />
      </div>
    )
  }

  return (
    <div className='relative px-4 sm:px-0'>
      <Carousel
        withControls={false}
        slideSize={{
          base: `${100 / 3}%`,
          xs: `${100 / 5}%`,
          sm: `${100 / 6}%`,
          lg: `${100 / 8}%`,
        }}
        slideGap='xs'
        emblaOptions={{
          dragFree: true,
        }}
        plugins={[autoplay.current]}
        onMouseEnter={() => {
          if (autoplay.current && typeof autoplay.current.stop === 'function') {
            autoplay.current.stop()
          }
        }}
        onMouseLeave={() => {
          if (autoplay.current && typeof autoplay.current.play === 'function') {
            autoplay.current.play()
          }
        }}
      >
        {dealsOfWeekData?.map((item) => (
          <CarouselSlide key={item.id}>
            <Box
              target='_blank'
              component={Link}
              href={item.params.link.value as Route}
              className='group block h-full'
            >
              <div className='flex h-full w-[90px] flex-col md:w-[160px]'>
                <AspectRatio classNames={aspectRatioClasses} className='mt-4'>
                  <Image src={cdnImageUrl(item.params.image.value)} alt='' />
                </AspectRatio>
                <div className='leading-md py-4 text-center text-sm'>
                  <Text lineClamp={3} component='div'>
                    {item.title}
                  </Text>
                </div>
                <div className='mx-auto mt-auto mb-10 h-[5px] w-[69px] rounded bg-blue-200 opacity-100 transition-opacity duration-400 group-hover:opacity-0' />
              </div>
            </Box>
          </CarouselSlide>
        ))}
      </Carousel>
      <div className='flex justify-center'>
        <Button component={Link} href='/kampanyalar'>
          Tüm Kampanyaları Gör
        </Button>
      </div>
    </div>
  )
}
export { StorySlider }
