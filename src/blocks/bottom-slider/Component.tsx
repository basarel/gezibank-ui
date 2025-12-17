'use client'

import { Carousel, CarouselSlide } from '@mantine/carousel'
import { Box } from '@mantine/core'
import Image from 'next/image'
import { Link } from 'next-view-transitions'
import { Route } from 'next'
import { useRef } from 'react'
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'
import { EmblaCarouselType } from 'embla-carousel'

type BottomItem = {
  id: string
  image?: {
    id: string
    url: string
    alt?: string
  }
  link?: string
}

type BottomSliderBlockProps = {
  title?: string
  video?: {
    id: string
    url?: string
    filename?: string
  } | string | null
  items?: BottomItem[]
}

export const BottomSliderBlock: React.FC<BottomSliderBlockProps> = ({
  video,
  items = [],
}) => {
  const emblaRef = useRef<EmblaCarouselType | null>(null)
  const videoUrl = typeof video === 'object' && video?.url ? video.url : null
  if (!videoUrl && (!items || items.length === 0)) {
    return null
  }

  return (
    <div className='w-full'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-4'>
        {videoUrl && (
          <div className='relative h-[350px] w-full md:h-[350px]'>
            {videoUrl ? (
              <div className='relative h-full w-full overflow-hidden rounded-2xl border-2'>
                <video
                  src={videoUrl}
                  className='h-full w-full'
                  style={{ objectFit: 'cover' }}
                  playsInline
                  autoPlay
                  loop
                  muted
                >
                  Tarayıcınız video oynatmayı desteklemiyor.
                </video>
              </div>
            ) : null}
          </div>
        )}
        {items && items.length > 0 && (
          <div className={`relative col-span-1 md:col-span-3`}>
            <Carousel
              slideGap='md'
              slideSize='100%'
              withControls={false}
              getEmblaApi={(api) => (emblaRef.current = api)}
              emblaOptions={{
                loop: true,
              }}
              className='w-full'
            >
              {items.map((item) => {
                const linkUrl = item.link
                  ? (`/${item.link.split('/').at(-1)}?slug=${item.link.split('/').at(-1)}` as Route)
                  : undefined

                return (
                  <CarouselSlide key={item.id} className='h-[250px] md:h-[350px]'>
                    <Box
                      component={linkUrl ? Link : undefined}
                      href={linkUrl as Route}
                      className='group relative block h-full w-full overflow-hidden rounded-2xl'
                    >
                      {item.image?.url && (
                        <Image
                          src={item.image.url}
                          alt={item.image.alt || 'Carousel image'}
                          fill
                          className='object-cover rounded-2xl'
                          sizes='(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
                        />
                      )}
                    </Box>
                  </CarouselSlide>
                )
              })}
            </Carousel>
            {items.length > 1 && (
              <>
                <button
                  onClick={() => emblaRef.current?.scrollPrev()}
                  className='absolute left-2 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full border-2 border-white bg-white/90 p-2 shadow-lg transition-all hover:bg-white md:left-4'
                  aria-label='Önceki'
                >
                  <RiArrowLeftLine size={24} className='text-gray-800' />
                </button>
                <button
                  onClick={() => emblaRef.current?.scrollNext()}
                  className='absolute right-2 top-1/2 z-10 -translate-y-1/2 cursor-pointer rounded-full border-2 border-white bg-white/90 p-2 shadow-lg transition-all hover:bg-white md:right-4'
                  aria-label='Sonraki'
                >
                  <RiArrowRightLine size={24} className='text-gray-800' />
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}