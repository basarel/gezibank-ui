'use client'

import { Route } from 'next'
import { Link } from 'next-view-transitions'
import { AspectRatio, Box, Button, Image, Skeleton, Text } from '@mantine/core'
import { Carousel, CarouselSlide } from '@mantine/carousel'
import Autoplay from 'embla-carousel-autoplay'
import aspectRatioClasses from '@/components/home/storyitems.module.css'
import { useRef } from 'react'

type StoryItem = {
  id: string
  title: string
  image?: {
    id: string
    url: string
    alt?: string
  }
  link?: string
}

type StorySliderBlockProps = {
  title?: string
  showAllButton?: boolean
  allButtonLink?: string
  allButtonText?: string
  items: StoryItem[]
}

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

export const StorySliderBlock: React.FC<StorySliderBlockProps> = ({
  title,
  showAllButton = true,
  allButtonLink = '/kampanyalar',
  allButtonText = 'Tüm Kampanyaları Gör',
  items = [],
}) => {
  const autoplay = useRef(Autoplay({ delay: 3000 }))

  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className='py-8'>
      {title && (
        <h2 className='relative mx-auto my-8 border-blue-800 py-3 text-center text-2xl font-bold text-blue-600 md:text-3xl'>
          {title}
          <div className='absolute bottom-0 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-blue-600'></div>
        </h2>
      )}
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
            if (
              autoplay.current &&
              typeof autoplay.current.stop === 'function'
            ) {
              autoplay.current.stop()
            }
          }}
          onMouseLeave={() => {
            if (
              autoplay.current &&
              typeof autoplay.current.play === 'function'
            ) {
              autoplay.current.play()
            }
          }}
        >
          {items.map((item) => {
            const linkUrl = item.link
              ? (`/${item.link.split('/').at(-1)}?slug=${item.link.split('/').at(-1)}` as Route)
              : undefined

            return (
              <CarouselSlide key={item.id}>
                <Box
                  target='_blank'
                  component={linkUrl ? Link : undefined}
                  href={linkUrl as Route}
                  className='group block h-full'
                >
                  <div className='flex h-full w-[90px] flex-col md:w-[160px]'>
                    {item.image?.url && (
                      <AspectRatio
                        classNames={aspectRatioClasses}
                        className='mt-4'
                      >
                        <Image
                          src={item.image.url}
                          alt={item.image.alt || item.title}
                        />
                      </AspectRatio>
                    )}
                    <div className='leading-md py-4 text-center text-sm'>
                      <Text lineClamp={3} component='div'>
                        {item.title}
                      </Text>
                    </div>
                    <div className='mx-auto mt-auto mb-10 h-[5px] w-[69px] rounded bg-blue-200 opacity-100 transition-opacity duration-400 group-hover:opacity-0' />
                  </div>
                </Box>
              </CarouselSlide>
            )
          })}
        </Carousel>
        {showAllButton && (
          <div className='flex justify-center'>
            <Button component={Link} href={allButtonLink as Route}>
              {allButtonText}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
