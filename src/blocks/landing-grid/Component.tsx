'use client'

import Image from 'next/image'
import { Link } from 'next-view-transitions'
import { Route } from 'next'
import { Title } from '@mantine/core'

type LandingGridItem = {
  id: string
  title: string
  description?: string
  image?: {
    id: string
    url: string
    alt?: string
    filename?: string
  }
  link?: string
}

type LandingGridBlockProps = {
  title?: string
  items?: LandingGridItem[]
}

export const LandingGridBlock: React.FC<LandingGridBlockProps> = ({
  title,
  items = [],
}) => {
  if (!items || items.length === 0) {
    return null
  }
  return (
    <div className='w-full'>
      {title && (
        <Title
          order={2}
          className='mb-6 text-start text-2xl font-bold md:text-3xl'
        >
          {title}
        </Title>
      )}
      <div className='grid grid-cols-2 md:grid-cols-4 gap-4 w-full'>
        {items.map((item) => {
          return (
            <Link
              key={item.id}
              href={item.link as Route}
              className='group relative block bg-black/70 aspect-square overflow-hidden rounded-2xl'
            >
              {item.image && (
                <Image
                  src={
                    item.image.url ||
                    (item.image.filename
                      ? `/media/${item.image.filename}`
                      : '')
                  }
                  alt={item.image.alt || item.title}
                  fill
                  className='object-cover transition-transform duration-300 group-hover:scale-105'
                  sizes='(max-width: 768px) 50vw, 25vw'
                />
              )}
               <div className='absolute inset-0 rounded-2xl bg-black/0 transition-all duration-500 group-hover:bg-transparent md:bg-black/30' />
              <div className='absolute bottom-0 left-0 right-0 p-4'>
                <h3 className='text-lg font-bold text-white md:text-xl'>
                  {item.title}
                </h3>
                {item.description && (
                  <p className='mt-1 line-clamp-2 text-sm text-white/90 md:text-base'>
                    {item.description}
                  </p>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
