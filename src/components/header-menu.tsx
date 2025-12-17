'use client'

import { Menu, UnstyledButton, Image } from '@mantine/core'
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
      <div className='flex items-center px-3'>
        {menuItems?.map((item, index) => (
          <UnstyledButton key={index} className='text-sm font-medium'>
            {item.title}
          </UnstyledButton>
        ))}
      </div>
    )
  }
  return (
    <div className='flex items-center px-3'>
      {menuItems.map((item, index) => {
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
            width={900}
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
              {item.showContent && item.content && item.content.trim() && (
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
                      {item.columns[0].links.map((link, linkIndex) => {
                        const content = link.url ? (
                          <Link
                            href={link.url as Route}
                            className={`${classes.leftSideLink} ${link.isActive ? classes.active : ''}`}
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <div
                            className={`${classes.leftSideLink} ${link.isActive ? classes.active : ''}`}
                          >
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
                      .slice(1) // İlk kolonu atla
                      .filter((col) => col.links && col.links.length > 0)
                      .map((column, colIndex) => {
                        const imageUrl =
                          column.image && typeof column.image === 'object'
                            ? column.image.url
                            : null

                        return (
                          <div
                            key={colIndex}
                            className={classes.rightSideColumn}
                          >
                            {imageUrl && (
                              <div className='h-[150px] w-full overflow-hidden rounded-lg'>
                                <Image
                                  src={imageUrl}
                                  alt={column.columnTitle || 'Menu image'}
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
                                    className={`${classes.menuLink} ${link.isActive ? classes.active : ''}`}
                                  >
                                    <span>{link.label}</span>
                                  </Link>
                                ) : (
                                  <div
                                    className={`${classes.menuLink} ${link.isActive ? classes.active : ''}`}
                                  >
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
            </Menu.Dropdown>
          </Menu>
        )
      })}
    </div>
  )
}
