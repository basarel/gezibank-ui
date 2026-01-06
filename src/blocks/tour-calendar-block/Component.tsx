'use client'

import { Button, Grid, GridCol, Card, Text, Badge } from '@mantine/core'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
import 'dayjs/locale/tr'
import Image from 'next/image'
import Link from 'next/link'
import { Route } from 'next'

dayjs.extend(customParseFormat)
dayjs.locale('tr')

type TourButton = {
  label: string
  url: string
}

type TourCard = {
  image?: { id?: string; url?: string; alt?: string }
  title: string
  startDate: string
  endDate: string
  tag?: string
  url?: string
  addButton?: boolean
  buttons?: TourButton[]
}

type TourCalendarBlockProps = {
  tours?: TourCard[]
}

export const TourCalendarBlock: React.FC<TourCalendarBlockProps> = ({
  tours = [],
}) => {
  const calculateNightsAndDays = (
    startDate: string,
    endDate: string
  ): { nights: number; days: number } => {
    try {
      const start = dayjs(startDate, 'DD MMMM YYYY', 'tr')
      const end = dayjs(endDate, 'DD MMMM YYYY', 'tr')

      if (!start.isValid() || !end.isValid()) {
        const startAlt = dayjs(startDate, 'DD/MM/YYYY')
        const endAlt = dayjs(endDate, 'DD/MM/YYYY')
        if (startAlt.isValid() && endAlt.isValid()) {
          const nights = endAlt.diff(startAlt, 'day')
          return { nights, days: nights + 1 }
        }
        return { nights: 0, days: 0 }
      }

      const nights = end.diff(start, 'day')
      return { nights, days: nights + 1 }
    } catch (error) {
      return { nights: 0, days: 0 }
    }
  }

  if (!tours || tours.length === 0) {
    return null
  }

  return (
    <div className='mx-auto w-full max-w-7xl'>
      <Grid gutter='md'>
        {tours.map((tour, index) => {
          const { nights, days } = calculateNightsAndDays(
            tour.startDate,
            tour.endDate
          )
          const imageUrl = tour.image?.url || ''
          const tourUrl = tour.url || '#'
          return (
            <GridCol key={index} span={{ base: 12, sm: 6, md: 4 }}>
              <Link href={tourUrl as Route} className='block h-full'>
                <div className='h-full cursor-pointer overflow-hidden rounded-md border border-gray-200 shadow-xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl'>
                  {imageUrl && (
                    <div className='relative aspect-[4/3] w-full overflow-hidden rounded-t-md'>
                      <Image
                        src={imageUrl}
                        alt={tour.title}
                        fill
                        className='object-cover'
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      />
                    </div>
                  )}
                  <div className='p-4'>
                    <div className='pb-3'>
                      <Text
                        size='xl'
                        fw={600}
                        className='text-left text-gray-800'
                      >
                        {tour.title}
                      </Text>
                      {tour.tag && (
                        <div className='text-left text-sm text-gray-600'>
                          {tour.tag}
                        </div>
                      )}
                    </div>
                    <div className='my-3 grid items-center justify-between rounded-md border border-gray-200 p-2 md:flex'>
                      <div className='flex items-center justify-start gap-2 text-sm text-gray-600'>
                        <Text size='sm' className='text-gray-700'>
                          {tour.startDate}
                        </Text>
                        <Text size='sm' c='dimmed'>
                          -
                        </Text>
                        <Text size='sm' className='text-gray-700'>
                          {tour.endDate}
                        </Text>
                      </div>

                      <div className='flex justify-start'>
                        <Badge
                          size='lg'
                          radius='xl'
                          className='bg-green-600 px-4 py-2 text-white'
                        >
                          {nights} Gece, {days} Gün
                        </Badge>
                      </div>
                    </div>
                    {tour.addButton &&
                      tour.buttons &&
                      tour.buttons.length > 0 && (
                        <div className='flex flex-wrap items-center justify-center gap-2'>
                          {tour.buttons.map((button, btnIndex) => (
                            <div
                              key={btnIndex}
                              onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                                window.location.href = button.url
                              }}
                              className='inline-block cursor-pointer'
                            >
                              <Badge
                                size='md'
                                radius='xl'
                                variant='light'
                                className='bg-gray-100 px-3 py-1 text-gray-700 hover:bg-gray-200'
                              >
                                {button.label}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              </Link>
            </GridCol>
          )
        })}
      </Grid>
    </div>
  )
}
