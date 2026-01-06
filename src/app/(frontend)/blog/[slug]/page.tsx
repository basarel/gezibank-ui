import { Title, Text } from '@mantine/core'
import Image from 'next/image'
import {
  getBlogBySlug,
  getPreviousBlog,
  getNextBlog,
  type Blog,
} from '@/libs/payload'
import { Link } from 'next-view-transitions'
import { Route } from 'next'
import { notFound } from 'next/navigation'
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa'
import dayjs from 'dayjs'
import 'dayjs/locale/tr'
dayjs.locale('tr')

type PageProps = {
  params: Promise<{ slug: string }>
}
function lexicalToHtml(lexical: any): string {
  if (!lexical || typeof lexical !== 'object') return ''

  if (typeof lexical === 'string') return lexical

  if (lexical.root && lexical.root.children) {
    return lexical.root.children
      .map((node: any) => {
        if (node.type === 'paragraph' && node.children) {
          return `<p>${node.children.map((child: any) => child.text || '').join('')}</p>`
        }
        if (node.type === 'heading' && node.children) {
          const level = node.tag || 'h2'
          return `<${level}>${node.children.map((child: any) => child.text || '').join('')}</${level}>`
        }
        if (node.type === 'list' && node.children) {
          const tag = node.listType === 'number' ? 'ol' : 'ul'
          return `<${tag}>${node.children
            .map((child: any) => {
              if (child.children) {
                return `<li>${child.children.map((c: any) => c.text || '').join('')}</li>`
              }
              return ''
            })
            .join('')}</${tag}>`
        }
        return ''
      })
      .join('')
  }

  return ''
}

const BlogDetailPage: React.FC<PageProps> = async ({
  params,
}): Promise<React.JSX.Element> => {
  const { slug } = await params
  const blog: Blog | null = await getBlogBySlug(slug)

  if (!blog) return notFound()

  const imageUrl =
    typeof blog.image === 'object' && blog.image?.url
      ? blog.image.url
      : typeof blog.image === 'string'
        ? blog.image
        : ''

  let descriptionHtml = ''
  if (blog.description) {
    if (typeof blog.description === 'object') {
      descriptionHtml = lexicalToHtml(blog.description)
    } else {
      descriptionHtml = blog.description
    }
  }

  const previousBlog = await getPreviousBlog(blog.id)
  const nextBlog = await getNextBlog(blog.id)

  const formattedDate = blog.createdAt
    ? dayjs(blog.createdAt).format('DD MMMM YYYY')
    : ''

  return (
    <div className='max-w-7xl px-4 py-8 sm:px-6 md:mx-auto lg:px-8'>
      <div className='rounded-lg border p-3 shadow md:p-6'>
        <div className='mb-3 items-center justify-between gap-3 md:flex'>
          {formattedDate && (
            <div className='mb-2 block w-fit text-sm font-medium md:mb-0 md:hidden'>
              {formattedDate}
            </div>
          )}
          <Title className='text-2xl md:text-3xl'>{blog.title}</Title>
          {formattedDate && (
            <div className='mb-2 hidden w-fit text-sm font-medium md:mb-0 md:block'>
              {formattedDate}
            </div>
          )}
        </div>

        <div className='relative mb-5 w-full'>
          {imageUrl && (
            <div className='relative h-[300px] w-full overflow-hidden rounded-lg'>
              <Image
                src={imageUrl}
                alt={blog.title || ''}
                fill
                className='object-cover'
                priority
                sizes='100vw'
              />
            </div>
          )}
        </div>

        {descriptionHtml && (
          <div
            className='prose prose-lg mb-5 text-left'
            dir='rtl'
            dangerouslySetInnerHTML={{
              __html: descriptionHtml,
            }}
          />
        )}

        <div className='mt-8 grid grid-cols-2 gap-2 md:gap-7'>
          <div className='flex-1'>
            {previousBlog ? (
              <Link
                href={`/blog/${previousBlog.slug}` as Route}
                className='group flex items-center gap-2 rounded-lg border p-1 transition-all hover:bg-gray-50 md:p-4'
              >
                <FaArrowLeft className='text-gray-500 transition-colors group-hover:text-blue-600' />
                <div className='flex-1'>
                  <Text size='sm' className='text-gray-500'>
                    Önceki Blog
                  </Text>
                  <Text
                    size='md'
                    className='font-semibold text-gray-800 transition-colors group-hover:text-blue-600'
                  >
                    {previousBlog.title}
                  </Text>
                </div>
              </Link>
            ) : (
              <div className='flex h-full items-center gap-2 rounded-lg border p-4 opacity-50'>
                <FaArrowLeft className='text-gray-400' />
                <div>
                  <Text size='sm' className='text-gray-400'>
                    Önceki Blog
                  </Text>
                </div>
              </div>
            )}
          </div>

          <div className='flex-1'>
            {nextBlog ? (
              <Link
                href={`/blog/${nextBlog.slug}` as Route}
                className='group flex items-center gap-2 rounded-lg border p-1 transition-all hover:bg-gray-50 md:p-4'
              >
                <div className='flex-1 text-right'>
                  <Text size='sm' className='text-gray-500'>
                    Sonraki Blog
                  </Text>
                  <Text
                    size='md'
                    className='font-semibold text-gray-800 transition-colors group-hover:text-blue-600'
                  >
                    {nextBlog.title}
                  </Text>
                </div>
                <FaArrowRight className='text-gray-500 transition-colors group-hover:text-blue-600' />
              </Link>
            ) : (
              <div className='flex h-full items-center justify-end gap-2 rounded-lg border p-4 opacity-50'>
                <div className='text-right'>
                  <Text size='sm' className='text-gray-400'>
                    Sonraki Blog
                  </Text>
                </div>
                <FaArrowRight className='text-gray-400' />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlogDetailPage
