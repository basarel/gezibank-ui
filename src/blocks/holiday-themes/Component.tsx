'use client'

import { Route } from 'next'
import { Link } from 'next-view-transitions'
import { Box, Image, Skeleton, Text } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import Autoplay from 'embla-carousel-autoplay'
import { EmblaCarouselType } from 'embla-carousel'
import { useMounted } from '@mantine/hooks'
import { useRef } from 'react'
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'

type ContentItem = {
  id: string
  title: string
  image?: {
    id: string
    url: string
    alt?: string
  }
  link?: string
}

type HolidayThemesBlockProps = {
  title?: string
  description?: string
  items: ContentItem[]
}

export const HolidayThemesBlockSkeleton = () => {
  return (
    <div className='flex w-full justify-center gap-5 overflow-hidden whitespace-nowrap'>
      {new Array(5).fill(true).map((_, itemIndex) => (
        <div key={itemIndex} className='flex flex-col gap-2 md:gap-4'>
          <Skeleton className='size-[120px] md:size-[180px]' circle />
          <Skeleton h={20} radius='md' className='mx-auto w-[80%]' />
        </div>
      ))}
    </div>
  )
}

export const HolidayThemesBlock: React.FC<HolidayThemesBlockProps> = ({
  title,
  description,
  items = [],
}) => {
  const autoplay = useRef(Autoplay({ delay: 4000 }))
  const isMounted = useMounted()
  const emblaRef = useRef<EmblaCarouselType | null>(null)
  if (!items || items.length === 0) {
    return null
  }

  if (!isMounted) {
    return (
      <div className='relative overflow-hidden py-8 whitespace-nowrap'>
        <HolidayThemesBlockSkeleton />
      </div>
    )
  }

  return (
    <div className='py-8'>
      {title && (
        <div className='mb-4 text-center'>
          <h2 className='relative mx-auto mb-8 w-fit border-blue-800 pb-3 text-center text-2xl font-bold text-blue-600 md:text-3xl'>
            {title}
            <div className='absolute bottom-0 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-blue-600'></div>
          </h2>
        </div>
      )}
      {description && (
        <Text className='mb-8 text-center text-gray-600' size='sm'>
          {description}
        </Text>
      )}
      <div className='relative px-4 sm:px-0'>
        <Carousel
          slideGap='xs'
          slideSize='100%'
          withControls={false}
          getEmblaApi={(api) => (emblaRef.current = api)}
        >
          {items.map((item) => {
            const linkUrl = item.link
              ? (`/${item.link.split('/').at(-1)}?slug=${item.link.split('/').at(-1)}` as Route)
              : undefined

            return (
              <Carousel.Slide
                key={item.id}
                className='!basis-full p-5 px-5 transition-all duration-400 hover:scale-110 sm:!basis-1/2 md:!basis-1/5'
              >
                <Box
                  target='_blank'
                  component={linkUrl ? Link : undefined}
                  href={linkUrl as Route}
                  className='group block h-full'
                >
                  <div className='flex h-full flex-col items-center gap-3 md:gap-4'>
                    {item.image?.url && (
                      <Image
                        src={item.image.url}
                        alt={item.image.alt || item.title}
                        className='mx-auto h-50 w-50 rounded-full object-cover shadow-2xl'
                      />
                    )}
                    <Text size='md' fw={600} className='mt-2 text-center'>
                      {item.title}
                    </Text>
                  </div>
                </Box>
              </Carousel.Slide>
            )
          })}
        </Carousel>
        {/* Kontroller */}
        <button
          onClick={() => emblaRef.current?.scrollPrev()}
          className='absolute top-1/2 left-[0px] z-10 -translate-y-1/2 cursor-pointer rounded-full border border-blue-800 bg-white p-3 text-white shadow-xl hover:bg-gray-100 md:left-[-64px]'
          aria-label='Previous'
        >
          <RiArrowLeftLine size={24} className='text-blue-800' />
        </button>

        <button
          onClick={() => emblaRef.current?.scrollNext()}
          className='absolute top-1/2 right-[0px] z-10 -translate-y-1/2 cursor-pointer rounded-full border border-blue-800 bg-white p-3 text-white shadow-xl hover:bg-gray-100 md:right-[-64px]'
          aria-label='Next'
        >
          <RiArrowRightLine size={24} className='text-blue-800' />
        </button>
      </div>
    </div>
  )
}
