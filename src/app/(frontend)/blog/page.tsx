import { SimpleGrid, Title, Text } from '@mantine/core'
import Image from 'next/image'
import { Link } from 'next-view-transitions'
import { Route } from 'next'
import { type Blog, getAllBlogs } from '@/libs/payload'
import dayjs from 'dayjs'
import 'dayjs/locale/tr'

dayjs.locale('tr')

// Lexical editor type definitions
type LexicalTextNode = {
  text: string
  type?: string
  format?: number
  style?: string
  [key: string]: unknown
}

type LexicalNode = {
  type: string
  children?: LexicalTextNode[]
  tag?: string
  listType?: 'number' | 'bullet'
  [key: string]: unknown
}

type LexicalRoot = {
  root: {
    children: LexicalNode[]
    direction?: string
    format?: string
    indent?: number
    type?: string
    version?: number
    [key: string]: unknown
  }
}

type LexicalContent = string | LexicalRoot | Record<string, unknown>

export default async function BlogListPage() {
  const blogs = await getAllBlogs()

  const getImageUrl = (image: Blog['image']): string => {
    if (typeof image === 'string') return image
    if (image && typeof image === 'object' && 'url' in image) {
      return image.url || ''
    }
    return ''
  }

  // Lexical content'ten kısa metin çıkar
  const getExcerpt = (
    description: LexicalContent,
    maxLength: number = 120
  ): string => {
    if (!description) return ''

    let text = ''

    if (typeof description === 'string') {
      text = description
    } else if (
      typeof description === 'object' &&
      'root' in description &&
      description.root &&
      typeof description.root === 'object' &&
      'children' in description.root &&
      Array.isArray(description.root.children)
    ) {
      // Lexical formatından text çıkar
      const root = description.root as LexicalRoot['root']
      text = root.children
        .map((node: LexicalNode) => {
          if (node.type === 'paragraph' && node.children) {
            return node.children
              .map((child: LexicalTextNode) => child.text || '')
              .join('')
          }
          if (node.type === 'heading' && node.children) {
            return node.children
              .map((child: LexicalTextNode) => child.text || '')
              .join('')
          }
          return ''
        })
        .join(' ')
    }

    // HTML tag'lerini temizle
    text = text.replace(/<[^>]*>/g, '').trim()

    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + '...'
  }

  // Tarihi formatla
  const formatDate = (dateString: string): string => {
    if (!dateString) return ''
    return dayjs(dateString).format('DD MMMM YYYY')
  }

  return (
    <div className='max-w-7xl px-4 py-8 sm:px-6 md:mx-auto lg:px-8'>
      <div className='mb-8'>
        <h1 className='relative mx-auto w-fit border-blue-800 pb-3 text-center text-3xl font-bold text-blue-600 md:text-4xl'>
          Blog Yazıları
        </h1>
      </div>

      {blogs.length === 0 ? (
        <div className='py-12 text-center'>
          <Text size='lg' className='text-gray-500'>
            Henüz blog yazısı bulunmamaktadır.
          </Text>
        </div>
      ) : (
        <SimpleGrid
          cols={{ base: 1, sm: 2, md: 3 }}
          spacing='lg'
          verticalSpacing='lg'
        >
          {blogs.map((blog: Blog) => {
            const imageUrl = getImageUrl(blog.image)
            return (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}` as Route}
                className='group block h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]'
              >
                <div className='flex h-full flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg'>
                  {imageUrl && (
                    <div className='relative h-48 w-full overflow-hidden rounded-t-lg'>
                      <Image
                        src={imageUrl}
                        alt={blog.title}
                        fill
                        className='object-cover transition-transform duration-300 group-hover:scale-105'
                        sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                      />
                    </div>
                  )}

                  <div className='flex flex-1 flex-col p-4'>
                    <Title
                      order={4}
                      className='mb-2 line-clamp-2 text-lg font-bold text-gray-800 group-hover:text-blue-600'
                    >
                      {blog.title}
                    </Title>

                    {/* Kısa açıklama */}
                    {blog.description && (
                      <Text
                        size='sm'
                        className='mb-3 line-clamp-3 text-gray-600'
                        lineClamp={3}
                      >
                        {getExcerpt(blog.description, 120)}
                      </Text>
                    )}

                    {/* Tarih */}
                    {blog.createdAt && (
                      <div className='mt-auto flex items-center gap-2 border-t border-gray-100 pt-2'>
                        <svg
                          className='h-4 w-4 text-gray-400'
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                          />
                        </svg>
                        <Text size='xs' className='font-medium text-gray-500'>
                          {formatDate(blog.createdAt)}
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            )
          })}
        </SimpleGrid>
      )}
    </div>
  )
}
