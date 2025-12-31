'use client'

import { Modal, CloseButton } from '@mantine/core'
import { useMemo } from 'react'

type TourDetailVideoModalProps = {
  opened: boolean
  onClose: () => void
  youtubeUrl: string | null | undefined
}
const getEmbedUrl = (url: string): string | null => {
  if (!url || typeof url !== 'string') {
    return null
  }

  if (url.includes('youtube.com/embed/') || url.includes('youtu.be/embed/')) {
    return url
  }

  const watchMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  )

  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`
  }

  return null
}

export const TourDetailVideoModal: React.FC<TourDetailVideoModalProps> = ({
  opened,
  onClose,
  youtubeUrl,
}) => {
  const embedUrl = useMemo(() => {
    if (!youtubeUrl) return null
    return getEmbedUrl(youtubeUrl)
  }, [youtubeUrl])
  if (!embedUrl) {
    return null
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      size='auto'
      centered
      withCloseButton={false}
      padding={0}
      classNames={{
        content: 'rounded-xl overflow-hidden',
        body: 'p-0',
      }}
      styles={{
        content: {
          border: 'none',
          overflow: 'hidden',
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
        body: {
          padding: 0,
          overflow: 'hidden',
          backgroundColor: 'transparent',
        },
        header: {
          display: 'none',
        },
        inner: {
          padding: 0,
        },
      }}
    >
      <div className='relative aspect-video w-full max-w-[95vw] min-w-[360px] md:max-w-[1000px] md:min-w-[640px]'>
        <CloseButton
          onClick={onClose}
          size='lg'
          radius='md'
          variant='filled'
          className='absolute top-2 right-2 z-50 bg-white hover:bg-gray-100'
          style={{
            backgroundColor: 'white',
            color: '#000',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          }}
        />
        <iframe
          src={embedUrl}
          title='Video player'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
          className='h-full w-full rounded-xl'
          style={{
            border: 'none',
          }}
        />
      </div>
    </Modal>
  )
}
