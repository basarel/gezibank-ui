'use client'

import { Route } from 'next'
import { Link } from 'next-view-transitions'
import { AspectRatio, Box, Button, Image, Skeleton, Text } from '@mantine/core'
import { Carousel, CarouselSlide } from '@mantine/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { Widgets } from '@/types/cms-types'
import aspectRatioClasses from '@/components/home/storyitems.module.css'
import { cdnImageUrl } from '@/libs/cms-data'
import { useMounted } from '@mantine/hooks'
import { useRef, useState } from 'react'

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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (!isMounted) {
    return (
      <div className='relative overflow-hidden whitespace-nowrap'>
        <StorySliderSkeleton />
      </div>
    )
  }

  return (
    <div className='relative px-4 sm:px-0'>
      <div className='overflow-visible'>
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
          classNames={{
            viewport: 'overflow-visible',
          }}
        >
          {dealsOfWeekData?.map((item, index) => (
            <CarouselSlide key={item.id}>
              <div
                className={`relative transition-all duration-300 ${
                  hoveredIndex === index ? 'mr-[280px] md:mr-[320px]' : ''
                }`}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
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
                
                {/* Hover Panel */}
                {hoveredIndex === index && (
                  <div className='absolute left-full top-0 z-10 ml-4 h-full min-w-[250px] rounded-lg bg-blue-50 p-4 shadow-lg transition-all duration-300 md:min-w-[300px]'>
                    <div className='flex h-full flex-col justify-center'>
                      <Text
                        component='h3'
                        className='text-lg font-bold text-gray-800 md:text-xl'
                      >
                        {item.title}
                      </Text>
                      {item.params.description?.value && (
                        <Text
                          component='p'
                          className='mt-2 text-sm text-gray-600 md:text-base'
                        >
                          {item.params.description.value}
                        </Text>
                      )}
                      <Link
                        href={item.params.link.value as Route}
                        className='mt-4 inline-flex items-center text-sm font-semibold text-blue-600 transition-colors hover:text-blue-800 md:text-base'
                      >
                        Detaylı Bilgi →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </CarouselSlide>
          ))}
        </Carousel>
      </div>
      <div className='flex justify-center'>
        <Button component={Link} href='/kampanyalar'>
          Tüm Kampanyaları Gör
        </Button>
      </div>
    </div>
  )
}
export { StorySlider }
