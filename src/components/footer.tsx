import { Container } from '@mantine/core'
import { getGlobalFooter } from '@/libs/payload'
import NextImage from 'next/image'
import { Link } from 'next-view-transitions'
import { Route } from 'next'
import { CiLocationOn, CiMail } from 'react-icons/ci'
import { MdOutlineLocalPhone } from 'react-icons/md'

function getImageUrl(image: any): string | null {
  if (!image) return null
  if (typeof image === 'string') return image
  if (typeof image === 'object') {
    if (image.url) return image.url
    if (image.filename) {
      return typeof image.sizes !== 'undefined' && image.sizes?.large?.url
        ? image.sizes.large.url
        : image.url || null
    }
  }
  return null
}

const Footer = async () => {
  const footerData = await getGlobalFooter()

  if (!footerData) {
    return null
  }

  const logoUrl = getImageUrl(footerData.logo)

  return (
    <footer className='bg-gray-100 pt-8 pb-6'>
      <Container>
        <div className='grid grid-cols-1 gap-10 md:grid-cols-4'>
          <div className='hidden flex-col items-center justify-center gap-3 md:flex md:items-start md:justify-start'>
            {logoUrl && (
              <div className='flex w-full flex-col'>
                <div className='flex min-h-[28px] items-center'>
                  <NextImage
                    src={logoUrl}
                    alt='GeziBank Logo'
                    width={200}
                    height={200}
                    className='object-contain'
                  />
                </div>
                <div className='mt-1 w-full border-b-2 border-blue-600'></div>
              </div>
            )}
            {footerData.companyName && (
              <p className='text-sm font-medium text-gray-800'>
                {footerData.companyName}
              </p>
            )}
            {footerData.brandLicense && (
              <p className='text-sm text-gray-600'>{footerData.brandLicense}</p>
            )}
            {footerData.address && (
              <div className='flex items-start gap-2 text-sm text-gray-600'>
                <CiLocationOn size={46} color='black' />

                <span>{footerData.address}</span>
              </div>
            )}
            {footerData.email && (
              <div className='flex items-center gap-3 text-sm text-gray-600'>
                <CiMail size={16} color='black' />
                <a
                  href={`mailto:${footerData.email}`}
                  className='hover:text-blue-600'
                >
                  {footerData.email}
                </a>
              </div>
            )}
            {footerData.phone && (
              <div className='flex items-center gap-3 text-sm text-gray-600'>
                <MdOutlineLocalPhone size={16} color='black' />

                <a
                  href={`tel:${footerData.phone.replace(/\s/g, '')}`}
                  className='hover:text-blue-600'
                >
                  {footerData.phone}
                </a>
              </div>
            )}
          </div>

          {footerData.navigationColumns &&
            footerData.navigationColumns.map((column, index) => {
              return (
                <div key={index} className='flex flex-col gap-3'>
                  {column.title && (
                    <div className='flex flex-col'>
                      <h3 className='mt-2 flex min-h-[28px] items-center justify-center text-xl font-semibold text-gray-800 md:justify-start md:pb-2'>
                        {column.title}
                      </h3>
                      <div className='mt-1 w-full border-b-2 border-blue-600'></div>
                    </div>
                  )}
                  <div>
                    <div className='mb-2 flex flex-wrap items-center justify-center gap-3 md:items-start md:justify-start'>
                      {column.links
                        .filter(
                          (link) => getImageUrl(link.image) && !link.label
                        )
                        .map((link, linkIndex) => {
                          const linkImageUrl = getImageUrl(link.image)
                          return (
                            <div key={`image-only-${linkIndex}`}>
                              {linkImageUrl && (
                                <Link href={link.url as Route}>
                                  <NextImage
                                    src={linkImageUrl}
                                    alt='Image'
                                    width={32}
                                    height={32}
                                    className='object-contain'
                                  />
                                </Link>
                              )}
                            </div>
                          )
                        })}
                    </div>

                    <ul className='flex flex-col items-center justify-center gap-2 md:items-start md:justify-start'>
                      {column.links
                        .filter(
                          (link) =>
                            link.label ||
                            (getImageUrl(link.image) && link.label)
                        )
                        .map((link, linkIndex) => {
                          return (
                            <li
                              key={linkIndex}
                              className='flex flex-col items-center justify-center gap-2 md:items-start md:justify-start'
                            >
                              {link.label && (
                                <div className='flex items-center gap-2'>
                                  {link.url ? (
                                    <Link
                                      href={link.url as Route}
                                      className='transition-colors hover:text-blue-600'
                                    >
                                      {link.label}
                                    </Link>
                                  ) : (
                                    <span className='text-sm text-gray-600'>
                                      {link.label}
                                    </span>
                                  )}
                                </div>
                              )}
                              {link.image && link.label && (
                                <div className='mt-1 flex items-center gap-2'>
                                  <NextImage
                                    src={link.image.url}
                                    alt={link.label || 'Image'}
                                    width={20}
                                    height={20}
                                    className='object-contain'
                                  />
                                  <span className='text-sm text-gray-600'>
                                    {link.label}
                                  </span>
                                </div>
                              )}
                            </li>
                          )
                        })}
                    </ul>
                  </div>
                </div>
              )
            })}
        </div>
        <div className='flex flex-col items-center justify-start gap-3 py-10 md:hidden'>
          {logoUrl && (
            <div className='items-center justify-center'>
              <NextImage
                src={logoUrl}
                alt='GeziBank Logo'
                width={250}
                height={150}
                className='object-contain'
              />
            </div>
          )}
          {footerData.companyName && (
            <p className='text-sm font-medium text-gray-800'>
              {footerData.companyName}
            </p>
          )}
          {footerData.brandLicense && (
            <p className='text-sm text-gray-600'>{footerData.brandLicense}</p>
          )}
          {footerData.address && (
            <div className='flex gap-2 text-xs text-gray-600'>
              <CiLocationOn size={36} color='black' />

              <span>{footerData.address}</span>
            </div>
          )}
          {footerData.email && (
            <div className='flex items-center gap-3 text-sm text-gray-600'>
              <CiMail size={16} color='black' />
              <a
                href={`mailto:${footerData.email}`}
                className='hover:text-blue-600'
              >
                {footerData.email}
              </a>
            </div>
          )}
          {footerData.phone && (
            <div className='flex items-center gap-3 text-sm text-gray-600'>
              <MdOutlineLocalPhone size={16} color='black' />

              <a
                href={`tel:${footerData.phone.replace(/\s/g, '')}`}
                className='hover:text-blue-600'
              >
                {footerData.phone}
              </a>
            </div>
          )}
        </div>
        <div className='mt-3 border-t border-gray-300 pt-6'>
          <div className='flex flex-col items-center justify-between gap-4 md:flex-row'>
            {footerData.paymentMethods &&
              footerData.paymentMethods.length > 0 && (
                <div className='flex items-center gap-4'>
                  {footerData.paymentMethods.map((payment, index) => {
                    return (
                      <div key={index}>
                        {payment.logo ? (
                          <NextImage
                            src={payment.logo.url}
                            alt={payment.name || ''}
                            width={50}
                            height={30}
                            className='object-contain'
                          />
                        ) : (
                          <span className='text-xs text-gray-500'>
                            {payment.name}
                          </span>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

            {footerData.copyrightText && (
              <div className='text-center text-sm text-gray-600 md:text-left'>
                {footerData.blkGroupUrl ? (
                  <span>
                    {footerData.copyrightText.split('Blk Group')[0]}
                    <a
                      href={footerData.blkGroupUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='underline hover:text-blue-600'
                    >
                      Blk Group
                    </a>
                    {footerData.copyrightText.split('Blk Group')[1]}
                  </span>
                ) : (
                  <span>{footerData.copyrightText}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </Container>
    </footer>
  )
}

export { Footer }
