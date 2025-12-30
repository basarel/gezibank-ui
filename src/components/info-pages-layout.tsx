'use client'

import { Link } from 'next-view-transitions'
import { usePathname } from 'next/navigation'
import { Route } from 'next'
import { FaArrowRight } from 'react-icons/fa'
import { Container } from '@mantine/core'
import { ReactNode } from 'react'

const navigationLinks = [
  { title: 'GeziBank', url: '/about' },
  { title: 'Yardım', url: '/iletisim' },
  { title: 'Kullanım Şartları', url: '/kullanim-sartlari' },
  { title: 'Gizlilik ve Güvenlik', url: '/gizlilik-politikasi' },
  { title: 'KVKK', url: '/kvkk' },
//   { title: 'Sıkça Sorulan Sorular', url: '/yardim/populer-sorular' },
]

type InfoPagesLayoutProps = {
  children: ReactNode
}

export const InfoPagesLayout = ({ children }: InfoPagesLayoutProps) => {
  const pathname = usePathname()

  return (
    <Container
      py={{
        base: 'md',
        sm: 'lg',
      }}
      className='flex flex-col gap-3 md:gap-5'
    >
      <div className='grid grid-cols-1 gap-4 sm:grid-cols-4'>
         <div className='w-full border rounded-md h-fit border-gray-200 bg-white sm:col-span-1'>
          <nav className='flex flex-col'>
            {navigationLinks.map((link) => {
              const isActive = (pathname === link.url || pathname?.startsWith(link.url + '/'))
              return (
                <Link
                  href={link.url as Route}
                  key={link.url}
                  className={`group flex items-center justify-between px-4 py-3 transition-all duration-100 ${
                    isActive
                      ? 'bg-orange-50 text-blue-600 font-medium border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className='text-sm'>{link.title}</span>
                  {isActive && (
                    <FaArrowRight
                      className='text-blue-600 transition-opacity duration-100'
                      size={14}
                    />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className='sm:col-span-3'>
          {children}
        </div>
      </div>
    </Container>
  )
}

