'use client'

import React from 'react'
import Image from 'next/image'
import { Link } from 'next-view-transitions'
import { Route } from 'next'
import { RiYoutubeFill } from 'react-icons/ri'
import { AspectRatio } from '@mantine/core'

type VideoItems = {
  id: string
  title: string
  tag: string
  subtitle: string
  image: {
    id: string
    url: string
    alt?: string
  }
  link: string
}
type VideoContentsBlockPorps = {
  title?: string
  contents?: VideoItems[]
}

export const VideoContentsBlock: React.FC<VideoContentsBlockPorps> = ({
  title,
  contents = [],
}) => {
  if (!contents || contents.length === 0) {
    return null
  }

  return (
    <div className='w-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] rounded-xl border-2 border-orange-900 p-4 md:p-6 bg-orange-900'>    
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-center justify-center w-full gap-4'>
        <div className='flex flex-col items-center justify-center rounded-2xl bg-orange-900 text-center'>
          <span className='flex items-center justify-center gap-2'>
          <RiYoutubeFill className='text-7xl text-white md:text-8xl' /> 
          <span className='text-white md:text-4xl font-bold'>Youtube</span>
          </span>
          <h3 className='text-xl font-bold leading-tight text-white md:text-2xl'>
            {title}
          </h3>
        </div>
          {contents.map((content) => {
            if (!content.link) return null
            return (
              <Link
                key={content.id}
                href={content.link as Route}
                className='group relative drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] block h-full overflow-hidden rounded-4xl transition-all duration-500'
              >
                {content.image?.url && (
                  <div className='relative h-[300px] w-full md:h-[350px] aspect-video rounded-4xl'>
                    <AspectRatio>
                    <Image
                      src={content.image?.url || ''}
                      alt={content.title}
                      fill
                      className='object-cover transition-transform duration-700 group-hover:border-orange-700 border-2 rounded-4xl border-orange-900'
                      sizes='(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    /></AspectRatio>
                    <div className='absolute inset-0 md:bg-orange-900/60 bg-orange-900/30 transition-all duration-500 group-hover:bg-transparent rounded-2xl' />
                    
                    <div className='absolute inset-x-0 top-25 flex flex-col items-center justify-end p-6 text-center'>
                      <h4 className='mb-3 text-xl font-bold uppercase leading-tight t text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] md:text-2xl'>
                        {content.title}
                      </h4>
                      
                      {content.tag && (
                        <div className='mb-3 rounded-full bg-blue-600 px-5 py-1'>
                          <span className='text-sm font-semibold text-white md:text-base'>
                            {content.tag}
                          </span>
                        </div>
                      )}
                      
                      {content.subtitle && (
                        <p className='text-base mt-5 font-medium text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] md:text-xl'>
                          {content.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </Link>
            )
          })}
        
      </div>
    </div>
  )
}
