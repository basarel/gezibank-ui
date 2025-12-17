'use client'

import { Route } from 'next'
import { Link } from 'next-view-transitions'
import { AspectRatio, Box, Button, Image, Skeleton, Text } from '@mantine/core'
import { Carousel, CarouselSlide } from '@mantine/carousel'
import Autoplay from 'embla-carousel-autoplay'
import aspectRatioClasses from '@/components/home/storyitems.module.css'
import { useRef, useState, useEffect } from 'react'
import { BiChevronRight } from 'react-icons/bi'
import { FaArrowRightLong } from 'react-icons/fa6'

type StoryItem = {
  id: string
  title: string
  description?: string
  buttonText?: string
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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice('ontouchstart' in window || navigator.maxTouchPoints > 0)
  }, [])

  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className='w-full overflow-x-hidden py-8'>
      {title && (
        <h2 className='relative mx-auto my-8 border-blue-800 py-3 text-center text-2xl font-bold text-blue-600 md:text-3xl'>
          {title}
          <div className='absolute bottom-0 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-blue-600'></div>
        </h2>
      )}
      <div className='relative w-full overflow-x-hidden px-4 sm:px-0'>
        <Carousel
          withControls={false}
          slideSize={{
            base: `${100 / 2}%`,
            xs: `${100 / 5}%`,
            sm: `${100 / 6}%`,
            lg: `${100 / 8}%`,
          }}
          slideGap='xs'
          classNames={{
            viewport: 'overflow-x-visible scrollbar-hide',
            root: 'scrollbar-hide',
          }}
          emblaOptions={{
            loop: true,
          }}
          plugins={[autoplay.current]}
        >
          {items.map((item, index) => {
            const linkUrl = item.link
              ? (`/${item.link.split('/').at(-1)}?slug=${item.link.split('/').at(-1)}` as Route)
              : undefined

            return (
              <CarouselSlide key={item.id} className='overflow-visible'>
                <div
                  className='relative flex items-center justify-start overflow-visible'
                  onMouseEnter={() => !isTouchDevice && setHoveredIndex(index)}
                >
                  <Box
                    target='_blank'
                    component={linkUrl ? Link : undefined}
                    href={linkUrl as Route}
                    className='z-10 block h-full'
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
                      <div className='mx-auto mt-auto mb-10 h-[5px] w-[69px] rounded bg-blue-200 opacity-100 transition-opacity duration-400' />
                    </div>
                  </Box>
                  <div
                    className={`z-0 overflow-hidden transition-all duration-600 ease-in-out ${
                      !isTouchDevice && hoveredIndex === index
                        ? 'pointer-events-auto w-[250px] opacity-100 md:w-[310px]'
                        : 'pointer-events-none w-0 opacity-0'
                    }`}
                    onMouseEnter={() =>
                      !isTouchDevice && setHoveredIndex(index)
                    }
                  >
                    <div
                      className='absolute top-4 left-20 block h-[156px] min-w-[200px] items-center justify-center rounded-r-xl bg-orange-50 px-1 py-3 text-center shadow-lg md:min-w-[390px]'
                      onMouseEnter={() =>
                        !isTouchDevice && setHoveredIndex(index)
                      }
                    >
                      <div className='flex h-full flex-col items-center justify-center'>
                        <Text
                          component='h3'
                          className='text-lg font-bold text-gray-800 md:text-xl'
                        >
                          {item.title}
                        </Text>
                        {item.description && (
                          <Text
                            component='p'
                            className='mt-2 text-sm text-gray-600 md:text-base'
                          >
                            {item.description}
                          </Text>
                        )}
                        {item.buttonText &&
                          item.buttonText !== '' &&
                          linkUrl && (
                            <Link
                              href={linkUrl}
                              className='mt-auto inline-flex items-center text-sm text-blue-600 transition-colors hover:text-blue-800 md:text-base'
                            >
                              {item.buttonText}{' '}
                              <FaArrowRightLong
                                size={15}
                                className='ml-2 h-4 w-4'
                              />
                            </Link>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
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
