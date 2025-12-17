'use client'

import { SimpleGrid, Title, Text } from '@mantine/core'
import Image from 'next/image'
import { Link } from 'next-view-transitions'
import { Route } from 'next'
type CampaignItem = {
  id: string
  image?:
    {
    id: string
    url: string
    alt?: string
  }
  title: string
  subtitle?: string
  link?: string
}
type HomeCampaignsBlockProps = {
  title?: string
  campaigns?: CampaignItem[]
}
export const HomeCampaignsBlock: React.FC<HomeCampaignsBlockProps> = ({
  title,
  campaigns = [],
}) => {
  if (!campaigns || campaigns.length === 0) {
    return null
  }
  return (
    <div className='w-full '>
      {title && (
        <h2 className='relative mx-auto mb-8 w-fit border-blue-800 pb-3 text-center text-2xl font-bold text-blue-600 md:text-3xl'>
        {title}
        <div className='absolute bottom-0 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-blue-600'></div>
      </h2>
      )}
      <SimpleGrid
        cols={{ base: 1, sm: 2, md: 4 }}
        spacing={{ base: 'md', sm: 'lg' }}
      >
        {campaigns.map((campaign) => {
          if (!campaign.link) return null
          return (
            <Link
              key={campaign.id}
              href={campaign.link as Route}
              className='group block h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]'
            >
              <div className='flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg'>
                {campaign.image?.url && (
                  <div className='relative h-48 w-full overflow-hidden rounded-t-lg'>
                    <Image
                      src={campaign.image?.url || ''}
                      alt={campaign.title}
                      fill
                      className='object-cover transition-transform duration-300 group-hover:scale-105'
                      sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw'
                    />
                  </div>
                )}

                <div className='flex flex-1 flex-col p-4'>
                  <Title
                    order={4}
                    className='mb-2 line-clamp-2 text-lg font-bold text-gray-800 group-hover:text-blue-600'
                  >
                    {campaign.title}
                  </Title>
                  {campaign.subtitle && (
                    <Text
                      size='sm'
                      className='mt-auto text-orange-500 underline transition-colors group-hover:text-orange-600'
                    >
                      {campaign.subtitle}
                    </Text>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </SimpleGrid>
    </div>
  )
}
