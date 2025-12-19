'use client'

import { AspectRatio, Button, Title, Box, Image, Badge } from '@mantine/core'
import { Carousel, CarouselSlide } from '@mantine/carousel'
import { Link } from 'next-view-transitions'
import { RiArrowLeftLine, RiArrowRightLine } from 'react-icons/ri'
import { Route } from 'next'

type ThemeCardItem = {
  id: string
  title: string
  image?: {
    id: string
    url: string
    alt?: string
  }
  price: string
  discountPrice?: string
  location?: string
  tag?: string
  link?: string
}

type ThemeCardsBlockProps = {
  title?: string
  products: ThemeCardItem[]
  cards: ThemeCardItem[]
}

export const ThemeCardsBlock: React.FC<ThemeCardsBlockProps> = ({
  title,
  cards = [],
}) => {
  if (!cards || cards.length === 0) {
    return null
  }

  return (
    <div>
      {title && (
        <h2 className='relative mx-auto mb-8 w-fit border-blue-800 pb-3 text-center text-2xl font-bold text-blue-600 md:text-3xl'>
          {title}
          <div className='absolute bottom-0 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-blue-600'></div>
        </h2>
      )}
      <Carousel
        slideGap='lg'
        slideSize={{ base: '100%', sm: `${100 / 4}%` }}
        controlSize={48}
        emblaOptions={{
          dragFree: true,
        }}
        controlsOffset={0}
        nextControlIcon={
          <div className='text-blue-800'>
            <RiArrowRightLine size={24} />
          </div>
        }
        previousControlIcon={
          <div className='text-blue-800'>
            <RiArrowLeftLine size={24} />
          </div>
        }
      >
        {cards.map((item) => {
          const linkUrl = item.link

          return (
            <CarouselSlide key={item.id}>
              <Box
                target='_blank'
                href={linkUrl as Route}
                component={linkUrl ? Link : undefined}
                className='group block h-full w-full gap-3'
              >
                <Box className='group mb-10 w-full rounded-xl bg-white shadow-xl'>
                  <div className='relative'>
                    {item.image?.url && (
                      <AspectRatio>
                        <Image
                          src={item.image.url}
                          alt={item.image.alt || item.title}
                          className='rounded-t-xl'
                        />
                      </AspectRatio>
                    )}
                    {item.tag && (
                      <Badge
                        size='lg'
                        radius={'md'}
                        className={
                          'absolute top-2 left-3 bg-blue-700 font-normal'
                        }
                      >
                        {item.tag}
                      </Badge>
                    )}
                  </div>
                  <div className='-mt-xl relative z-10 grid gap-3 rounded-xl border border-t-5 border-t-transparent bg-white p-5 transition-all group-hover:shadow-[0_-6px_0_0_var(--mantine-color-blue-8)]'>
                    <Title order={3} fz='md' lineClamp={1}>
                      {item.title}
                    </Title>
                    {item.location && (
                      <p className='text-xs text-gray-900'>{item.location}</p>
                    )}
                    <div className='flex items-center justify-between pt-5'>
                      <p className='text-xl font-bold'>
                        {item.discountPrice || item.price}
                        <span className='text-sm font-normal'> / Kişi</span>
                      </p>
                      <Button
                        component='div'
                        variant='light'
                        color='blue'
                        size='sm'
                        radius='xl'
                        className='transition-all ease-linear group-hover:bg-blue-800 group-hover:text-white'
                      >
                        İncele
                      </Button>
                    </div>
                  </div>
                </Box>
              </Box>
            </CarouselSlide>
          )
        })}
      </Carousel>
    </div>
  )
}
