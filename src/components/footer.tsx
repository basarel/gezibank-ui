import { Container, Image } from '@mantine/core'

import { getWidgetsByCollectionSlug } from '@/libs/cms-data'
import {
  RiFacebookFill,
  RiInstagramLine,
  RiTwitterXFill,
  RiYoutubeFill,
} from 'react-icons/ri'
import NextImage from 'next/image'

import { Link } from 'next-view-transitions'
import { link } from 'fs'
import { Route } from 'next'
import { Img } from '@react-email/components'

const Footer = async () => {
  const widgetCollection = await getWidgetsByCollectionSlug()
  const widgetCollectionData = widgetCollection?.data
  const footerWidget = widgetCollectionData?.filter(
    (item) => item.point === 'footer'
  )

  return (
    <footer className='flex flex-col gap-5 bg-gray-600 pt-5 text-white'>
      <div>
        <Container className='flex flex-col gap-5 md:flex-row md:justify-between'>
          <div className='flex items-center justify-center gap-4 text-2xl text-blue-700'>
            <Link
              href='https://www.facebook.com/gezibank'
              className='flex size-[32px] items-center justify-center rounded-full bg-white leading-none'
            >
              <RiFacebookFill className='text-orange-800' />
            </Link>
            <Link
              href='https://www.instagram.com/gezibank'
              className='flex size-[32px] items-center justify-center rounded-full bg-white leading-none'
            >
              <RiTwitterXFill className='text-black' />
            </Link>
            <Link
              href='https://x.com/gezibank'
              className='flex size-[32px] items-center justify-center rounded-full bg-white leading-none'
            >
              <RiInstagramLine className='text-red-500' />
            </Link>
            <Link
              href='https://www.youtube.com/@gezibank'
              className='flex size-[32px] items-center justify-center rounded-full bg-white leading-none'
            >
              <RiYoutubeFill className='text-red-800' />
            </Link>
            {/* <Link
              href='https://www.whatsapp.com/channel/0029Vau83EmCRs1qIYPnNO0a'
              className='flex size-[32px] items-center justify-center rounded-full bg-white leading-none'
            >
              <RiTiktokFill />
            </Link> */}
            <Link
              href='https://www.whatsapp.com/channel/0029Vau83EmCRs1qIYPnNO0a'
              className='flex items-center gap-2'
            >
              <div className='text-green-600'>
                <svg
                  fill='#7dd87d'
                  width='32px'
                  height='32px'
                  viewBox='0 0 32 32'
                  version='1.1'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <title>whatsapp</title>
                  <path d='M26.576 5.363c-2.69-2.69-6.406-4.354-10.511-4.354-8.209 0-14.865 6.655-14.865 14.865 0 2.732 0.737 5.291 2.022 7.491l-0.038-0.070-2.109 7.702 7.879-2.067c2.051 1.139 4.498 1.809 7.102 1.809h0.006c8.209-0.003 14.862-6.659 14.862-14.868 0-4.103-1.662-7.817-4.349-10.507l0 0zM16.062 28.228h-0.005c-0 0-0.001 0-0.001 0-2.319 0-4.489-0.64-6.342-1.753l0.056 0.031-0.451-0.267-4.675 1.227 1.247-4.559-0.294-0.467c-1.185-1.862-1.889-4.131-1.889-6.565 0-6.822 5.531-12.353 12.353-12.353s12.353 5.531 12.353 12.353c0 6.822-5.53 12.353-12.353 12.353h-0zM22.838 18.977c-0.371-0.186-2.197-1.083-2.537-1.208-0.341-0.124-0.589-0.185-0.837 0.187-0.246 0.371-0.958 1.207-1.175 1.455-0.216 0.249-0.434 0.279-0.805 0.094-1.15-0.466-2.138-1.087-2.997-1.852l0.010 0.009c-0.799-0.74-1.484-1.587-2.037-2.521l-0.028-0.052c-0.216-0.371-0.023-0.572 0.162-0.757 0.167-0.166 0.372-0.434 0.557-0.65 0.146-0.179 0.271-0.384 0.366-0.604l0.006-0.017c0.043-0.087 0.068-0.188 0.068-0.296 0-0.131-0.037-0.253-0.101-0.357l0.002 0.003c-0.094-0.186-0.836-2.014-1.145-2.758-0.302-0.724-0.609-0.625-0.836-0.637-0.216-0.010-0.464-0.012-0.712-0.012-0.395 0.010-0.746 0.188-0.988 0.463l-0.001 0.002c-0.802 0.761-1.3 1.834-1.3 3.023 0 0.026 0 0.053 0.001 0.079l-0-0.004c0.131 1.467 0.681 2.784 1.527 3.857l-0.012-0.015c1.604 2.379 3.742 4.282 6.251 5.564l0.094 0.043c0.548 0.248 1.25 0.513 1.968 0.74l0.149 0.041c0.442 0.14 0.951 0.221 1.479 0.221 0.303 0 0.601-0.027 0.889-0.078l-0.031 0.004c1.069-0.223 1.956-0.868 2.497-1.749l0.009-0.017c0.165-0.366 0.261-0.793 0.261-1.242 0-0.185-0.016-0.366-0.047-0.542l0.003 0.019c-0.092-0.155-0.34-0.247-0.712-0.434z'></path>
                </svg>
              </div>
              <div className='leading-sm text-xs text-white'>
                Whatsapp <br /> Kanal
              </div>
            </Link>
          </div>
          <div className='flex justify-center'>
            <div>
              <div className='flex items-center gap-3'>
                <div className='text-[32px] leading-none md:text-[65px]'>
                  <EarphoneIcon />
                </div>
                <div>
                  <div className='text-xl font-bold text-orange-800 md:text-3xl md:text-white'>
                    <a href='tel:08508780400'>0850 878 0 400</a>
                  </div>
                  <div className='hidden ps-2 text-xs md:block'>
                    09:00-18:00 arasında arayabilirsiniz.
                  </div>
                </div>
              </div>
              <div className='ps-2 text-xs md:hidden'>
                09:00-18:00 arasında arayabilirsiniz.
              </div>
            </div>
          </div>
        </Container>
      </div>

      {footerWidget?.map((widget) => (
        <div key={widget.id} className='border-t border-b py-5 text-center'>
          <Container className='grid gap-4 md:flex md:gap-8'>
            {widget.params.footer_menu.menus.map((menu) => (
              <div key={menu.id}>
                <Link className='hover:underline' href={`${menu.url}` as Route}>
                  {menu.title}
                </Link>
              </div>
            ))}
          </Container>
        </div>
      ))}
      <div className='block md:hidden'>
        <Container className='justify-between gap-4 md:flex'>
          <div className='mb-4 flex w-full items-center justify-center gap-5 rounded-md bg-white p-4'>
            <div>
              <Image
                component={NextImage}
                src={'/logos/troy-logo.png'}
                width={52}
                w={52}
                height={24}
                alt='troy'
              />
            </div>
            <div>
              <Image
                component={NextImage}
                src={'/logos/visa-logo.png'}
                width={61}
                w={61}
                height={20}
                alt='visa'
              />
            </div>
            <div>
              <Image
                component={NextImage}
                src={'/logos/mastercard-logo.png'}
                width={39}
                w={39}
                height={24}
                alt='mastercard'
              />
            </div>
            <div>
              <Image
                component={NextImage}
                src={'/logos/amex-logo.png'}
                width={24}
                w={24}
                height={24}
                alt='amex'
              />
            </div>
          </div>
          <div className='flex w-full items-center justify-center gap-8 rounded-md bg-white p-4'>
            <div>
              <Image
                component={NextImage}
                src={'/logos/ykm-turizm-logo.png'}
                width={56}
                w={56}
                height={24}
                alt='YKM Turizm'
              />
            </div>
            <div>
              <Image
                component={NextImage}
                src={'/logos/iata-logo.png'}
                width={39}
                w={39}
                height={24}
                alt='iata'
              />
            </div>
            <div>
              <Image
                component={NextImage}
                src={'/logos/tursab-logo.png'}
                width={87}
                w={87}
                height={24}
                h={24}
                alt='tursab'
              />
            </div>
          </div>
        </Container>
      </div>
      <div className='hidden md:block'>
        <Container>
          <div className='py-5 text-sm leading-tight'>
            {footerWidget?.map((widget) => widget.params.description.value)}
          </div>
        </Container>
      </div>
      <div className='text-dark-700 hidden bg-white py-6 md:block'>
        <Container>
          <div className='flex justify-between'>
            <div className='text-sm'>
              Gezibank bir{' '}
              <a
                href='https://blkgroup.com.tr'
                target='_blank'
                rel='noopener noreferrer'
              >
                Blk Group
              </a>
              markasıdır &copy; {new Date().getFullYear()} Her Hakkı Saklıdır.
            </div>
            <div className='flex'>
              <div className='flex items-center gap-5'>
                <div>
                  <Image
                    component={NextImage}
                    src={'/logos/troy-logo.png'}
                    width={52}
                    w={52}
                    height={24}
                    alt='troy'
                  />
                </div>
                <div>
                  <Image
                    component={NextImage}
                    src={'/logos/visa-logo.png'}
                    width={61}
                    w={61}
                    height={20}
                    alt='visa'
                  />
                </div>
                <div>
                  <Image
                    component={NextImage}
                    src={'/logos/mastercard-logo.png'}
                    width={39}
                    w={39}
                    height={24}
                    alt='mastercard'
                  />
                </div>
                <div>
                  <Image
                    component={NextImage}
                    src={'/logos/amex-logo.png'}
                    width={24}
                    w={24}
                    height={24}
                    alt='amex'
                  />
                </div>
                <div>
                  <Image
                    component={NextImage}
                    src={'/logos/tursab-logo.png'}
                    width={87}
                    w={87}
                    height={24}
                    h={24}
                    alt='tursab'
                  />
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
      <div className='text-dark-700 bg-white p-6 text-center text-xs md:hidden'>
        <div className='leading-tight'>
          {footerWidget?.map((widget) => widget.params.description.value)}
        </div>
        <div className='pt-6'>
          GeziBank &copy; {new Date().getFullYear()} Her Hakkı Saklıdır.
        </div>
      </div>
    </footer>
  )
}

export { Footer }

export const EarphoneIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    viewBox='0 0 32 32'
    fill='none'
  >
    <path d='M15.9999 31.7538C24.7006 31.7538 31.7538 24.7006 31.7538 15.9999C31.7538 7.29933 24.7006 0.246094 15.9999 0.246094C7.29933 0.246094 0.246094 7.29933 0.246094 15.9999C0.246094 24.7006 7.29933 31.7538 15.9999 31.7538Z' />
    <path
      d='M7.13842 21.2185H8.76303C9.30457 21.2185 9.74765 20.7754 9.74765 20.2339V16.3939V14.8677V13.4893C9.74765 10.0431 12.5538 7.23697 16 7.23697C19.4461 7.23697 22.2523 10.0431 22.2523 13.4893V14.8677V16.3939V19.9385C21.76 20.5785 20.0369 22.597 16.9846 22.9908V22.1539C16.9846 21.6124 16.5415 21.1693 16 21.1693C15.4584 21.1693 15.0153 21.6124 15.0153 22.1539V25.797C15.0153 26.3385 15.4584 26.7816 16 26.7816C16.5415 26.7816 16.9846 26.3385 16.9846 25.797V24.96C20.7261 24.6154 22.9415 22.2524 23.7292 21.2185H24.8615C26.4861 21.2185 27.8153 19.8893 27.8153 18.2647V16.7877C27.8153 15.1631 26.4861 13.8339 24.8615 13.8339H24.2215V13.44C24.2215 8.91081 20.5292 5.21851 16 5.21851C11.4707 5.21851 7.77842 8.91081 7.77842 13.44V13.8339H7.13842C5.5138 13.8339 4.18457 15.1631 4.18457 16.7877V18.2647C4.18457 19.8893 5.5138 21.2185 7.13842 21.2185ZM24.8615 15.8031C25.403 15.8031 25.8461 16.2462 25.8461 16.7877V18.2647C25.8461 18.8062 25.403 19.2493 24.8615 19.2493H24.2215V16.3939V15.8524H24.8615V15.8031ZM6.1538 16.7877C6.1538 16.2462 6.59688 15.8031 7.13842 15.8031H7.77842V16.3447V19.2H7.13842C6.59688 19.2 6.1538 18.757 6.1538 18.2154V16.7877Z'
      fill='white'
    />
  </svg>
)
