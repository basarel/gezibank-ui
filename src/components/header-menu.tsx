'use client'

import { Menu, UnstyledButton, Image, Skeleton } from '@mantine/core'
import { useMounted } from '@mantine/hooks'
import { Link } from 'next-view-transitions'
import { Route } from 'next'
import classes from '../styles/headerMenu.module.css'
import { BiChevronDown } from 'react-icons/bi'
import type { HeaderMenuItem } from '@/libs/payload'
type HeaderMenuProps = {
  menuItems?: HeaderMenuItem[]
}

export const HeaderMenu: React.FC<HeaderMenuProps> = ({ menuItems = [] }) => {
  const isMounted = useMounted()
  if (!isMounted || !menuItems || menuItems.length === 0) {
    return (
      <div className='flex items-center gap-4 px-3'>
        <Skeleton height={20} width={80} radius='md' />
        <Skeleton height={20} width={100} radius='md' />
        <Skeleton height={20} width={90} radius='md' />
        <Skeleton height={20} width={80} radius='md' />
        <Skeleton height={20} width={100} radius='md' />
        <Skeleton height={20} width={90} radius='md' />
      </div>
    )
  }
  return (
    <div className='flex items-center px-3'>
      {menuItems.map((item, index) => {
        if (item.slug) {
          const href = item.slug.startsWith('/') ? item.slug : `/${item.slug}`
          return (
            <UnstyledButton
              key={index}
              component={Link}
              href={href as Route}
              className={`flex items-center gap-1 text-sm font-medium ${classes.target}`}
            >
              <span className='text-sm font-medium'>{item.title}</span>
            </UnstyledButton>
          )
        }

        const hasContent =
          item.columns &&
          item.columns.length > 0 &&
          item.columns.some((col) => col.links && col.links.length > 0)

        if (!hasContent) {
          return (
            <UnstyledButton
              key={index}
              className={`flex items-center gap-1 text-sm font-medium ${classes.target}`}
            >
              <span className='text-sm font-medium'>{item.title}</span>
            </UnstyledButton>
          )
        }

        return (
          <Menu
            key={index}
            width={1200}
            position='bottom-start'
            classNames={{
              dropdown: classes.dropdown,
              item: classes.menuItem,
            }}
          >
            <Menu.Target>
              <UnstyledButton
                className={`flex items-center gap-3 text-sm font-medium ${classes.target}`}
              >
                <span className='text-sm font-medium'>{item.title}</span>
                <span className='text-sm font-medium'>
                  <BiChevronDown className={classes.arrowIcon} />
                </span>
              </UnstyledButton>
            </Menu.Target>

            <Menu.Dropdown className={classes.megaMenu}>
              {item.content && item.content.trim() && (
                <div className='mb-4 rounded-md bg-gray-50 p-3 text-sm text-gray-700'>
                  {item.content}
                </div>
              )}
              <div className='flex'>
                {item.columns &&
                  item.columns.length > 0 &&
                  item.columns[0]?.links &&
                  item.columns[0].links.length > 0 && (
                    <div className={classes.leftSideLinks}>
                      <div className={classes.leftSideLinkTitle}>
                        {item.title}
                      </div>
                      {item.columns[0].links.map((link, linkIndex) => {
                        const content = link.url ? (
                          <Link
                            href={link.url as Route}
                            className={`${classes.leftSideLink}`}
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <div className={`${classes.leftSideLink}`}>
                            {link.label}
                          </div>
                        )
                        return <div key={linkIndex}>{content}</div>
                      })}
                    </div>
                  )}

                {item.columns && item.columns.length > 1 && (
                  <div className={classes.rightSideColumns}>
                    {item.columns
                      .slice(1)
                      .filter((col) => col.links && col.links.length > 0)
                      .map((column, colIndex) => {
                        return (
                          <div
                            key={colIndex}
                            className={classes.rightSideColumn}
                          >
                            {column.image && (
                              <div className='h-[150px] w-full overflow-hidden rounded-lg'>
                                <Image
                                  src={column.image?.url || ''}
                                  alt={column.image?.alt || 'Menu image'}
                                  className='h-full w-full object-cover'
                                />
                              </div>
                            )}

                            {column.columnTitle && (
                              <div className={classes.columnTitle}>
                                {column.columnTitle}
                              </div>
                            )}

                            <div className={classes.columnItems}>
                              {column.links.map((link, linkIndex) => {
                                const content = link.url ? (
                                  <Link
                                    href={link.url as Route}
                                    className={`${classes.menuLink}`}
                                  >
                                    <span>{link.label}</span>
                                  </Link>
                                ) : (
                                  <div className={`${classes.menuLink}`}>
                                    <span>{link.label}</span>
                                  </div>
                                )
                                return <div key={linkIndex}>{content}</div>
                              })}
                            </div>
                          </div>
                        )
                      })}
                  </div>
                )}
              </div>

              {item.bottomContents && item.bottomContents.length > 0 && (
                <div className='mt-8 grid grid-cols-4 gap-6'>
                  {item.bottomContents.map((bottomContent, index) => {
                    const CardContent = (
                      <div className='flex flex-col'>
                        {bottomContent.image && (
                          <div className='mb-4 h-[150px] w-full overflow-hidden rounded-lg shadow-md'>
                            <Image
                              src={bottomContent.image?.url || ''}
                              alt={
                                bottomContent.title || 'Bottom content image'
                              }
                              className='h-full w-full object-cover transition-transform duration-300 hover:scale-105'
                            />
                          </div>
                        )}
                        {bottomContent.title && (
                          <h3 className='mb-3 text-lg font-bold text-gray-900'>
                            {bottomContent.title}
                          </h3>
                        )}
                        {bottomContent.links &&
                          bottomContent.links.length > 0 && (
                            <div className='flex flex-col gap-2'>
                              {bottomContent.links.map((link, linkIndex) => {
                                const linkContent = link.url ? (
                                  <Link
                                    href={link.url as Route}
                                    className='text-sm text-gray-600 transition-colors hover:text-blue-600 hover:underline'
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    {link.label}
                                  </Link>
                                ) : (
                                  <span className='text-sm text-gray-600'>
                                    {link.label}
                                  </span>
                                )
                                return <div key={linkIndex}>{linkContent}</div>
                              })}
                            </div>
                          )}
                      </div>
                    )

                    return (
                      <div
                        key={index}
                        className='transition-transform duration-200 hover:scale-[1.02]'
                      >
                        {bottomContent.link ? (
                          <Link
                            href={bottomContent.link as Route}
                            className='block'
                          >
                            {CardContent}
                          </Link>
                        ) : (
                          CardContent
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </Menu.Dropdown>
          </Menu>
        )
      })}
    </div>
  )
}
