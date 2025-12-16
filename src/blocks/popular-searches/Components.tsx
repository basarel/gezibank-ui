'use client'

import { Route } from 'next'
import { Link } from 'next-view-transitions'
import { FaArrowRightLong } from 'react-icons/fa6'
import { motion } from 'framer-motion'

type PopularSearchItem= {
  id: string
  title: string
  link: string
}
type PopularSearchesBlockProps = {
  items: PopularSearchItem[]
}
export default function PopularSearchesBlock({ items }: PopularSearchesBlockProps) {
  console.log('PopularSearchesBlock rendered with items:', items)
  
  if (!items || items.length === 0) {
    console.log('PopularSearchesBlock: No items, returning null')
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='w-full'
    >
      <div className='mt-5 flex flex-wrap items-center gap-2 text-sm'>
        <div className='font-medium'>Popüler Aramalar :</div>
        <div className='grid grid-cols-2 items-center gap-3 md:flex md:gap-8'>
          {items?.map((item, index) => (
            <div key={index}>
              <Link href={item.link as Route} className='flex items-center gap-2 text-blue-800 hover:text-blue-900'>
                <span className='truncate text-sm font-medium'>
                  {item.title}
                </span>
                <FaArrowRightLong className='text-blue-800' size={15} />
              </Link>  
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
