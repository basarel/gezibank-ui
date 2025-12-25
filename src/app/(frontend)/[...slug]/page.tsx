import { getContent } from '@/libs/cms-data'
import { CmsContent } from '@/types/cms-types'
import { Container, Title, Typography } from '@mantine/core'
import { Route } from 'next'
import { Link } from 'next-view-transitions'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { FaArrowRight } from 'react-icons/fa'
import { headers } from 'next/headers'
import { getPageBySlug } from '@/libs/payload'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { TourSearchEngine } from '@/modules/tour'
import Image from 'next/image'
import React from 'react'

type CmsParams = {
  content: {
    value: string
  }
  image: {
    value: string
  }
}

type CMSWidgets = {
  id: ID
  title: string
  typeId: ID
  collectionId: ID
  point: string
  params: {
    menu: {
      menus: {
        id: ID
        poolId: ID
        parentId: null
        language: string
        title: string
        url: string
        urlTarget: null
        comment: null
        icon: null
        image: null
        fileId: null
        active: boolean
        ordering: number
        createdBy: string
        createdDate: string
        updatedBy: string
        updatedDate: string
        items: []
      }[]
      value: string
    }
  }
  ordering: number
  language: string
  active: boolean
}

const searchEngineMap: Record<string, React.ComponentType<any>> = {
     
  tur: TourSearchEngine,
} 

function getSearchEngine(type?: string | null): React.ComponentType<any> | null {
  if (!type) return null
  return searchEngineMap[type] || null
}

function getImageUrl(image: any): string | null {
  if (!image) return null
  if (typeof image === 'string') return image
  if (typeof image === 'object') {
    if (image.url) return image.url
    if (image.filename) {
      // Payload CMS'de genellikle URL oluşturulur
      return typeof image.sizes !== 'undefined' && image.sizes?.large?.url
        ? image.sizes.large.url
        : image.url || null
    }
  }
  return null
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}): Promise<Metadata> {
  const { slug } = await params
  const slugString = slug.join('/')

  // Önce Pages collection'ında ara
  const page = await getPageBySlug(slugString)

  if (page) {
    return {
      title: page.metaTitle || page.title || 'Sayfa',
      description: page.metaDescription || undefined,
    }
  }

  // Pages'de bulunamadıysa, CMS içeriğinden metadata al
  const data = (await getContent<CmsContent<CMSWidgets[], CmsParams>>(slugString))?.data

  if (data) {
    return {
      title: data.title || 'Sayfa',
    }
  }

  return {
    title: 'Sayfa Bulunamadı',
  }
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const slugString = slug.join('/')
  const headersList = await headers()
  const currentPath = headersList.get('x-pathname') || `/${slugString}`

  // Önce Pages collection'ında ara
  const page = await getPageBySlug(slugString)

  // Eğer Pages collection'ında sayfa bulunduysa, onu göster
  if (page) {
    const blocks = page?.layout || []
    const showSearchEngine = page?.showSearchEngine || false
    const searchEngineType = page?.searchEngineType
    const searchEngineBackgroundImage = page?.searchEngineBackgroundImage
    const SearchEngineComponent = getSearchEngine(searchEngineType)
    const backgroundImageUrl = getImageUrl(searchEngineBackgroundImage)

    return (
      <div className='flex flex-col gap-4 md:gap-10'>
        {showSearchEngine && SearchEngineComponent && (
          <div className='relative border-b bg-orange-900 py-4'>
            {backgroundImageUrl && (
              <Image
                src={backgroundImageUrl}
                fill
                alt='Arama Motoru Arka Plan'
                className='absolute inset-0 object-cover'
                priority
              />
            )}
            <div className='absolute inset-0 bg-black/50' aria-hidden />
            <Container className='relative z-10'>
              <div className='rounded-md bg-white p-3 md:p-5'>
                <SearchEngineComponent />
              </div>
            </Container>
          </div>
        )}

        {blocks && Array.isArray(blocks) && blocks.length > 0 ? (
          <RenderBlocks blocks={blocks} />
        ) : null}
      </div>
    )
  }

  // Pages collection'ında bulunamadıysa, mevcut CMS içeriğini göster
  const data = (
    await getContent<CmsContent<CMSWidgets[], CmsParams>>(slugString)
  )?.data

  if (!data) return notFound() // or we can redirect custom not-found page, see =>> https://nextjs.org/docs/app/api-reference/file-conventions/not-found
  const { params: cmsParams, widgets, title } = data

  if (widgets && !widgets.length) notFound()

  return (
    <Container
      py={{
        base: 'md',
        sm: 'lg',
      }}
      className='flex flex-col gap-3 md:gap-5'
    >
      <div className='grid grid-cols-1 gap-3 sm:grid-cols-4'>
        <div className='max-h-[300px] w-full max-w-xs gap-4 overflow-y-auto rounded-md border p-2 shadow md:col-span-1'>
          {widgets.map((widget) =>
            widget.params.menu?.menus?.map((menu) => {
              const isActive = menu.url === currentPath
              return (
                <Link
                  href={menu.url as Route}
                  key={menu.id}
                  className={`group my-1 flex items-center justify-between rounded-md p-2 transition-all duration-100 ${isActive ? 'bg-blue-100 text-blue-800' : 'hover:text-blue-800'}`}
                >
                  <div>{menu.title}</div>
                  <FaArrowRight
                    className={`transition-opacity duration-100 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                  />
                </Link>
              )
            })
          )}
        </div>
        <div className='rounded-md border p-2 shadow md:col-span-3'>
          <Title order={2} className='mb-3'>
            {title}
          </Title>
          <Typography>
            <div
              dangerouslySetInnerHTML={{ __html: cmsParams.content.value }}
            />
          </Typography>
        </div>
      </div>
    </Container>
  )
}
