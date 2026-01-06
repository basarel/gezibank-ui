'use client'

import { Modal, Image, UnstyledButton, CloseButton } from '@mantine/core'
import { Carousel } from '@mantine/carousel'
import { useMediaQuery } from '@mantine/hooks'
import { validateUrl } from '@/libs/util'
import { cdnSiteImageUrl } from '@/libs/cms-data'
import { useEffect, useState, useRef } from 'react'
import { useCallback } from 'react'
import { EmblaCarouselType } from 'embla-carousel'
import styles from './media-gallery.module.css'

type Props = {
  images: string[]
  title: string | undefined
  opened: boolean
  onClose: () => void
  onOpen?: () => void
}

const TourMediaGallery = ({ images, title, opened, onClose }: Props) => {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const [embla, setEmbla] = useState<EmblaCarouselType | null>(null)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([])

  if (!images.length) return <div>Resim yok</div>

  useEffect(() => {
    if (!embla) return

    const onSelect = () => {
      setSelectedIndex(embla.selectedScrollSnap())
    }

    embla.on('select', onSelect)
    onSelect()

    return () => {
      embla.off('select', onSelect)
    }
  }, [embla])
  useEffect(() => {
    const thumbnailElement = thumbnailRefs.current[selectedIndex]
    if (thumbnailElement) {
      thumbnailElement.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      })
    }
  }, [selectedIndex])

  const scrollTo = useCallback(
    (index: number) => {
      if (embla) {
        embla.scrollTo(index)
      }
    },
    [embla]
  )

  return (
    <>
      <Modal
        opened={opened}
        onClose={onClose}
        fullScreen
        padding={0}
        styles={{
          root: {
            zIndex: 1000,
          },
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
          },
          content: {
            backgroundColor: '#000',
          },
          body: {
            padding: 0,
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
          },
          header: {
            display: 'none',
          },
        }}
        closeOnClickOutside={true}
        closeOnEscape={true}
      >
        <div className='relative flex h-full flex-col bg-black'>
          <div className='absolute top-4 right-4 z-50'>
            <CloseButton
              onClick={onClose}
              size={isMobile ? 'sm' : 'xl'}
              radius='md'
              variant='filled'
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: '#fff',
                border: 'none',
              }}
              className='hover:bg-white/30'
            />
          </div>
          <div
            className={`flex flex-1 items-center justify-center ${isMobile ? 'p-2' : 'p-4'}`}
          >
            <Carousel
              getEmblaApi={setEmbla}
              slideSize='100%'
              slideGap={0}
              withControls={true}
              withIndicators={false}
              controlSize={40}
              styles={{
                control: {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                  color: '#fff',
                  border: 'none',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                  },
                },
              }}
              emblaOptions={{
                loop: true,
                dragFree: false,
                align: 'center',
              }}
              className='md:h-full md:w-full'
            >
              {images.map((img, idx) => (
                <Carousel.Slide
                  key={idx}
                  className='flex items-center justify-center'
                >
                  <div
                    className={`flex h-full w-full items-center justify-center ${isMobile ? 'p-2' : 'p-4'}`}
                  >
                    <Image
                      src={validateUrl(img) ? img : cdnSiteImageUrl(img)}
                      alt={`${title} - ${idx + 1}`}
                      className='max-h-full max-w-full object-contain'
                      style={{
                        height: 'auto',
                        width: 'auto',
                        maxHeight: isMobile
                          ? 'calc(100vh - 80px)'
                          : 'calc(100vh - 200px)',
                        maxWidth: '100%',
                      }}
                    />
                  </div>
                </Carousel.Slide>
              ))}
            </Carousel>
          </div>

          <div
            className={`border-t border-gray-800 bg-black ${isMobile ? 'p-2' : 'p-4'}`}
          >
            <div className={styles.thumbnailContainer}>
              {images.map((img, idx) => (
                <UnstyledButton
                  key={idx}
                  ref={(el) => {
                    thumbnailRefs.current[idx] = el
                  }}
                  onClick={() => scrollTo(idx)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded border-2 transition-all ${
                    selectedIndex === idx
                      ? 'scale-110 border-white'
                      : 'border-gray-600 opacity-60 hover:opacity-100'
                  }`}
                >
                  <Image
                    src={validateUrl(img) ? img : cdnSiteImageUrl(img)}
                    alt={`Thumbnail ${idx + 1}`}
                    className='h-full w-full object-cover'
                  />
                </UnstyledButton>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export { TourMediaGallery }
