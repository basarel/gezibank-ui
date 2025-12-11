'use client'

import { useRef, useState, useEffect } from 'react'
import {
  AspectRatio,
  Button,
  Container,
  Image,
  Skeleton,
  Text,
} from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import { Link } from 'next-view-transitions'
import { cdnImageUrl } from '@/libs/cms-data'
import { Route } from 'next'
import { EmblaCarouselType } from 'embla-carousel'
import Autoplay from 'embla-carousel-autoplay'

type SlideType = {
  id: string
  params: {
    image: { value: string }
    link?: { value: string }
  }
  Title: string
}

type PropType = {
  slides: SlideType[]
}

const MainBannerCarousel: React.FC<PropType> = ({ slides }) => {
  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeSlides, setActiveSlides] = useState<Set<number>>(new Set())
  const autoplay = useRef(Autoplay({ delay: 5000 }))

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    const updateActiveSlides = () => {
      if (!emblaApi) return

      const selected = emblaApi.selectedScrollSnap()
      const total = slides.length
      const active = new Set<number>()
      for (let i = -2; i <= 2; i++) {
        const index = (selected + i + total) % total
        active.add(index)
      }

      setActiveSlides(active)
    }

    const timeoutId = setTimeout(updateActiveSlides, 50)

    updateActiveSlides()
    emblaApi.on('select', updateActiveSlides)
    emblaApi.on('scroll', updateActiveSlides)
    emblaApi.on('reInit', updateActiveSlides)

    return () => {
      clearTimeout(timeoutId)
      emblaApi.off('select', updateActiveSlides)
      emblaApi.off('scroll', updateActiveSlides)
      emblaApi.off('reInit', updateActiveSlides)
    }
  }, [emblaApi, slides.length])

  return (
    <div className='relative w-full gap-5 py-8'>
      <Container className='mb-6'>
        <h2 className='text-3xl leading-tight font-bold text-black'>
          Popüler Tur{' '}
          <span className='text-gray font-normal'>Kategorileri</span>
        </h2>
      </Container>

      <div className='relative w-full p-0'>
        {!isLoaded && (
          <div className='absolute inset-0 z-10 flex w-full items-center justify-center gap-5'>
            {[...Array(8)].map((_, index) => (
              <Skeleton
                key={index}
                className='h-100 w-full basis-[50%] rounded-lg sm:!basis-[240px] md:!basis-[240px]'
              />
            ))}
          </div>
        )}

        <Carousel
          plugins={[autoplay.current]}
          onMouseEnter={() => autoplay.current.stop()}
          onMouseLeave={() => autoplay.current.play()}
          slideGap='xs'
          withControls={false}
          getEmblaApi={setEmblaApi}
          className={isLoaded ? 'opacity-100' : 'opacity-0'}
          emblaOptions={{
            align: 'center',
            loop: true,
            dragFree: false,
          }}
        >
          {slides.map((slide, index) => {
            const isActive = activeSlides.has(index)

            return (
              <Carousel.Slide
                key={slide.id}
                className={`basis-[50%] transition-opacity duration-300 sm:!basis-[240px] md:!basis-[240px] ${
                  isActive ? 'opacity-100' : 'opacity-30'
                }`}
              >
                <Link
                  href={
                    isActive
                      ? ((slide.params.link?.value || '#') as Route)
                      : '#'
                  }
                  className='block'
                >
                  <div
                    className={`group ${!isActive ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    <AspectRatio
                      ratio={2 / 4}
                      className='mb-3 overflow-hidden rounded-lg'
                    >
                      <Image
                        src={cdnImageUrl(slide.params.image.value)}
                        alt={slide.Title}
                        className={`h-full w-full object-cover transition-transform duration-300 ${
                          isActive ? 'group-hover:scale-105' : ''
                        }`}
                        fit='cover'
                      />
                    </AspectRatio>

                    <Text
                      size='sm'
                      fw={500}
                      className={`text-center transition-colors ${
                        isActive
                          ? 'text-gray-700 group-hover:text-gray-900'
                          : 'text-gray-400'
                      }`}
                    >
                      {slide.Title}
                    </Text>
                  </div>
                </Link>
              </Carousel.Slide>
            )
          })}
        </Carousel>

        {isLoaded && slides.length > 1 && (
          <>
            <Button
              size='md'
              variant='outline'
              color='blue'
              onClick={() => emblaApi?.scrollPrev()}
              className='absolute top-1/2 left-6 z-20 -translate-y-1/2 cursor-pointer bg-white px-2'
              aria-label='Önceki'
            >
              <svg
                width='30'
                height='30'
                viewBox='0 0 20 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M12.5 15L7.5 10L12.5 5'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </Button>

            <Button
              size='md'
              variant='outline'
              color='blue'
              onClick={() => emblaApi?.scrollNext()}
              className='absolute top-1/2 right-6 z-20 -translate-y-1/2 cursor-pointer bg-white px-2'
              aria-label='Sonraki'
            >
              <svg
                width='30'
                height='30'
                viewBox='0 0 20 20'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M7.5 15L12.5 10L7.5 5'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            </Button>
          </>
        )}
      </div>
    </div>
  )
}

export { MainBannerCarousel }
