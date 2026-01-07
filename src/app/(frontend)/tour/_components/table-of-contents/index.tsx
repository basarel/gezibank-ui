import React from 'react'
import { TableOfContents } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import classes from './Toc.module.css'
import {
  FaInfoCircle,
  FaBed,
  FaBus,
  FaCheckCircle,
  FaTimesCircle,
  FaPassport,
} from 'react-icons/fa'
import { BsLuggageFill } from 'react-icons/bs'
import { IoClose } from 'react-icons/io5'

type TourTableOfContentsProps = {
  onVisaClick?: () => void
  isDomestic?: boolean
}

const getIconForTitle = (title: string) => {
  const titleLower = title.toLowerCase()

  if (titleLower.includes('genel') || titleLower.includes('general')) {
    return <FaInfoCircle size={16} className='mr-2' />
  }
  if (titleLower.includes('otel') || titleLower.includes('hotel')) {
    return <FaBed size={16} className='mr-2' />
  }
  if (titleLower.includes('program') || titleLower.includes('tur program')) {
    return <BsLuggageFill size={16} className='mr-2' />
  }
  if (titleLower.includes('ulaşım') || titleLower.includes('transport')) {
    return <FaBus size={16} className='mr-2' />
  }
  if (
    titleLower.includes('dahil olmayan') ||
    titleLower.includes('not included')
  ) {
    return <IoClose size={20} className='mr-2' />
  }
  if (titleLower.includes('dahil') || titleLower.includes('included')) {
    return <FaCheckCircle size={16} className='mr-2' />
  }
  if (titleLower.includes('vize') || titleLower.includes('visa')) {
    return <FaPassport size={16} className='mr-2' />
  }

  return null
}

const TourTableOfContents: React.FC<TourTableOfContentsProps> = ({
  onVisaClick,
  isDomestic = false,
}) => {
  const baseSelector =
    '#general, #hotel, #tour-program, #transport, #included-information, #not-included-information'
  const selector = isDomestic ? baseSelector : `${baseSelector}, #visa-infos`

  return (
    <div
      className='relative z-20 bg-orange-900 text-white shadow-[-10px_10px_20px_0px_rgba(0,0,0,0.25)] md:rounded-lg'
      style={{ pointerEvents: 'auto' }}
    >
      <div className='relative mx-auto max-w-6xl justify-center overflow-x-auto overflow-y-hidden md:overflow-hidden'>
        <div className='w-full'>
          <TableOfContents
            classNames={classes}
            variant='filled'
            color='orange'
            size='sm'
            radius='xs'
            py={0}
            scrollSpyOptions={{
              selector,
            }}
            getControlProps={({ data }) => {
              const icon = getIconForTitle(data.value)
              const isVisa =
                data.value.toLowerCase().includes('vize') ||
                data.value.toLowerCase().includes('visa')

              if (isVisa && onVisaClick) {
                return {
                  onClick: (e: React.MouseEvent) => {
                    e.preventDefault()
                    e.stopPropagation()
                    if (e.nativeEvent) {
                      e.nativeEvent.stopImmediatePropagation()
                    }
                    onVisaClick()
                  },
                  onMouseDown: (e: React.MouseEvent) => {
                    e.preventDefault()
                    e.stopPropagation()
                  },
                  href: '#',
                  children: (
                    <span className='flex items-center justify-center text-center'>
                      {icon}
                      {data.value}
                    </span>
                  ),
                }
              }

              return {
                onClick: () => {
                  const node = data.getNode()
                  if (node) {
                    node.scrollIntoView({
                      behavior: 'smooth',
                    })
                  }
                },
                children: (
                  <span className='flex items-center justify-center text-center'>
                    {icon}
                    {data.value}
                  </span>
                ),
              }
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default TourTableOfContents
