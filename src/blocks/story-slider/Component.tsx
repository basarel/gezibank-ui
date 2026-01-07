'use client'

import { Route } from 'next'
import { Link } from 'next-view-transitions'
import { AspectRatio, Box, Button, Image, Skeleton, Text } from '@mantine/core'
import { Carousel, CarouselSlide } from '@mantine/carousel'
import Autoplay from 'embla-carousel-autoplay'
import aspectRatioClasses from '@/blocks/story-slider/storyitems.module.css'
import { useRef, useState, useEffect } from 'react'
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
  const autoplay = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: false,
      stopOnMouseEnter: true, // Hover'da autoplay'i durdur
    })
  )
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [isLargeScreen, setIsLargeScreen] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const checkDevice = () => {
      const touchDevice =
        'ontouchstart' in window || navigator.maxTouchPoints > 0
      const mobileWidth = window.innerWidth < 768
      const largeScreen = window.innerWidth >= 1024
      setIsLargeScreen(largeScreen)
    }

    checkDevice()
    window.addEventListener('resize', checkDevice)
    return () => window.removeEventListener('resize', checkDevice)
  }, [])

  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className='w-full overflow-x-hidden'>
      {title && (
        <h2 className='relative mx-auto my-8 border-blue-800 py-3 text-center text-2xl font-bold text-blue-600 md:text-3xl'>
          {title}
          <div className='absolute bottom-0 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-blue-600'></div>
        </h2>
      )}
      <div className='relative z-0 w-full overflow-x-visible px-4 sm:px-0'>
        <Carousel
          withControls={false}
          slideSize={{
            base: `${100 / 3}%`,
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
            align: 'start',
            dragFree: isLargeScreen ? false : true,
            skipSnaps: false,
            watchDrag: !isLargeScreen,
          }}
          plugins={isHovered && isLargeScreen ? [] : [autoplay.current]}
          onMouseEnter={() => {
            if (isLargeScreen) {
              setIsHovered(true)
              autoplay.current?.stop()
            }
          }}
          onMouseLeave={() => {
            if (isLargeScreen) {
              setIsHovered(false)
              autoplay.current?.play()
            }
          }}
        >
          {items.map((item, index) => {
            return (
              <CarouselSlide key={item.id} className='flex overflow-visible'>
                <div
                  className={`relative flex h-full items-start justify-start overflow-visible transition-all duration-500 ease-in-out ${
                    isLargeScreen && hoveredIndex === index ? 'mr-[350px]' : ''
                  }`}
                  onMouseEnter={() => isLargeScreen && setHoveredIndex(index)}
                >
                  <Box
                    target='_blank'
                    component={item.link ? Link : undefined}
                    href={item.link as Route}
                    className='z-10 block h-full'
                  >
                    <div className='relative flex h-full min-h-[220px] w-[110px] flex-col md:min-h-[280px] md:w-[180px]'>
                      {item.image?.url && (
                        <AspectRatio
                          classNames={aspectRatioClasses}
                          className='mt-4 shrink-0'
                          ratio={1}
                        >
                          <Image
                            src={item.image.url}
                            alt={item.image.alt || item.title}
                          />
                        </AspectRatio>
                      )}
                      <div className={`leading-md flex-1 px-0 py-4 text-center text-sm transition-opacity duration-400 ${
                        isLargeScreen && hoveredIndex === index ? 'opacity-0' : 'opacity-100'
                      }`}>
                        <Text lineClamp={3} component='div'>
                          {item.title}
                        </Text>
                      </div>
                      <div className={`absolute bottom-0 left-1/2 h-[5px] w-[69px] -translate-x-1/2 rounded bg-blue-200 transition-opacity duration-400 ${
                        isLargeScreen && hoveredIndex === index ? 'opacity-0' : 'opacity-100'
                      }`} />
                    </div>
                  </Box>
                  <div
                    className={`absolute top-0 left-27 z-0 mt-5 w-[400px] overflow-visible transition-opacity duration-500 ease-in-out ${
                      isLargeScreen && hoveredIndex === index
                        ? 'pointer-events-auto opacity-100'
                        : 'pointer-events-none opacity-0'
                    }`}
                    style={{
                      transform:
                        isLargeScreen && hoveredIndex === index
                          ? 'translateX(0)'
                          : 'translateX(0)',
                      transition:
                        'opacity 300ms ease-in-out, transform 300ms ease-in-out',
                    }}
                    onMouseEnter={() => isLargeScreen && setHoveredIndex(index)}
                  >
                    <div
                      className='block h-[170px] items-center justify-center rounded-r-xl bg-orange-50 p-4 pl-20 text-center shadow-lg'
                      onMouseEnter={() =>
                        isLargeScreen && setHoveredIndex(index)
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
                          item.link && (
                            <Link
                              href={item.link as Route}
                              className='mt-auto inline-flex pb-1 items-center text-sm text-blue-600 transition-colors hover:text-blue-800 md:text-base'
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
          <div className='mt-8 flex justify-center'>
            <Button component={Link} href={allButtonLink as Route}>
              {allButtonText}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
