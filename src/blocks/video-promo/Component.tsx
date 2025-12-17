'use client'

import { cdnImageUrl } from '@/libs/cms-data'
import { Box, Container, Text } from '@mantine/core'

type VideoPromoBlockProps = {
  title?: string
  text?: string
  backgroundImage?:
    | string
    | {
        id?: string
        url?: string
        filename?: string
        alt?: string
      }
    | null
  videoUrl?: string
}
export const VideoPromoBlock: React.FC<VideoPromoBlockProps> = ({
  title,
  text,
  backgroundImage,
  videoUrl,
}) => {
  if (!videoUrl && !title) {
    return null
  }
  const getEmbedUrl = (url: string): string => {
    if (!url) return url

    if (url.includes('youtube.com/embed/') || url.includes('youtu.be/embed/')) {
      return url
    }
    const watchMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
    )
    if (watchMatch && watchMatch[1]) {
      return `https://www.youtube.com/embed/${watchMatch[1]}`
    }
    return url
  }
  const embedUrl = videoUrl ? getEmbedUrl(videoUrl) : null

  const imageUrl =
    typeof backgroundImage === 'string'
      ? cdnImageUrl(backgroundImage)
      : backgroundImage?.url ||
        (backgroundImage?.filename
          ? `/media/${backgroundImage.filename}`
          : null)

  return (
       <Box className='relative overflow-hidden rounded-2xl shadow-xl'>
        {imageUrl && (
          <>
            <div
              className='absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat'
              style={{ backgroundImage: `url(${imageUrl})` }}
            />
            <div className='absolute inset-0 -z-10 bg-black/40' />
          </>
        )}

        <div className='relative grid grid-cols-1 gap-6 p-6 md:grid-cols-2 md:gap-8 md:p-8 lg:p-20'>
          <div className='flex flex-col justify-center'>
            {title && (
              <h3 className='mb-4 text-center text-2xl leading-tight font-bold text-white md:text-3xl lg:text-3xl'>
                {title}
              </h3>
            )}
            {text && (
              <Text
                component='p'
                className='text-center text-base leading-relaxed text-white md:text-lg'
              >
                {text}
              </Text>
            )}
          </div>

          {embedUrl && (
            <div className='relative aspect-video w-full overflow-hidden rounded-lg'>
              <iframe
                src={embedUrl}
                title='Video player'
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
                className='h-full w-full rounded-lg border-4 border-orange-500'
              />
            </div>
          )}
        </div>
      </Box>
   )
}
