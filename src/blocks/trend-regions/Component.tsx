'use client'

import { Image } from '@mantine/core'
import { Link } from 'next-view-transitions'
import { Route } from 'next'

type TrendRegionItem = {
  id: string
  title: string
  image?: {
    id: string
    url: string
    alt?: string
  }
  link?: string
}

type TrendRegionsBlockProps = {
  title?: string
  items: TrendRegionItem[]
}

export const TrendRegionsBlock: React.FC<TrendRegionsBlockProps> = ({
  title,
  items = [],
}) => {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className='w-full'>
      {title && (
        <h2 className='relative mx-auto mb-8 w-fit border-blue-800 pb-3 text-center text-2xl font-bold text-blue-600 md:text-3xl'>
          {title}
          <div className='absolute bottom-0 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-blue-600'></div>
        </h2>
      )}
      <div className='grid grid-cols-2 gap-2 md:auto-rows-[200px] md:grid-cols-12 md:gap-5'>
        {items.map((item, index) => {
          let colWidth = 'md:col-span-3'
          let rowLength = ''

          if (index === 0) {
            colWidth = 'md:col-span-3'
            rowLength = 'md:row-span-2'
          } else if (index === 1) {
            colWidth = 'md:col-span-2'
            rowLength = ''
          } else if (index === 2) {
            colWidth = 'md:col-span-4'
            rowLength = ''
          } else if (index === 3) {
            colWidth = 'md:col-span-3'
            rowLength = 'md:row-span-2'
          } else if (index === 4) {
            colWidth = 'md:col-span-3'
            rowLength = ''
          } else if (index === 5) {
            colWidth = 'md:col-span-3'
            rowLength = ''
          }

          const linkUrl = item.link

          const content = (
            <>
              <div className='h-full w-full overflow-hidden'>
                <Image
                  src={item.image?.url || ''}
                  alt={item.image?.alt || item.title}
                  className='h-full w-full object-cover transition-all duration-400 hover:scale-110'
                />
              </div>
              <div className='pointer-events-none absolute right-0 bottom-0 left-0 flex h-28 items-end truncate bg-gradient-to-t from-blue-600 to-transparent p-3 text-xl font-medium text-white'>
                {item.title}
              </div>
            </>
          )

          return (
            <div
              key={item.id}
              className={`group col-span-6 ${colWidth} ${rowLength} rounded-3xl`}
            >
              {linkUrl ? (
                <Link
                  href={linkUrl as Route}
                  className='relative block h-full overflow-hidden rounded-3xl shadow-xl'
                >
                  {content}
                </Link>
              ) : (
                <div className='relative block h-full overflow-hidden rounded-3xl shadow-xl'>
                  {content}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
