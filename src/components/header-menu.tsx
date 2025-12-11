'use client'

import { Menu, UnstyledButton } from '@mantine/core'
import { useMounted } from '@mantine/hooks'
import classes from '../styles/headerMenu.module.css'
import { BiChevronDown } from 'react-icons/bi'

type MenuColumn = {
  title?: string
  items: {
    label: string
    isActive?: boolean
  }[]
}

type MenuData = {
  title: string
  columns: MenuColumn[]
}

const headerMenuData: MenuData[] = [
  {
    title: 'Yurt İçi Turlar',
    columns: [
      {
        title: 'Öne Çıkanlar',
        items: [
          { label: 'Erken Rezervasyon Kültür Turları' },
          { label: 'Yılbaşı Turları' },
          { label: 'Sömestr Turları' },
          { label: 'Kayak Turları' },
          { label: 'Turistik Doğu Ekspresi Turları' },
        ],
      },
      {
        title: 'En Çok Satılan Turlar',
        items: [
          { label: 'Haftanın Fırsatları' },
          { label: 'Hafta Sonu Turları' },
          { label: 'Mardin Turları' },
          { label: 'Kapadokya Turları' },
          { label: 'Turistik Doğu Ekspresi Turları' },
          { label: 'Uçaklı Gap Turları' },
          { label: 'Pamukkale Turları' },
          { label: 'Kasım Ara Tatil Turları' },
        ],
      },
    ],
  },
  {
    title: 'Yurt Dışı Turlar',
    columns: [
      {
        title: 'Öne Çıkanlar',
        items: [
          { label: 'Erken Rezervasyon Avrupa Turları' },
          { label: 'Yılbaşı Yurt Dışı Turları' },
          { label: 'Sömestr Yurt Dışı Turları' },
          { label: 'Dubai Turları' },
          { label: 'Paris Turları' },
        ],
      },
      {
        title: 'Popüler Bölgeler',
        items: [
          { label: 'Dubai Turları' },
          { label: 'Paris Turları' },
          { label: 'Roma Turları' },
          { label: 'Barcelona Turları' },
          { label: 'Atina Turları' },
          { label: 'Kiev Turları' },
          { label: 'Tiflis Turları' },
          { label: 'Kahire Turları' },
          { label: 'Viyana Turları' },
          { label: 'Prag Turları' },
          { label: 'Budapeşte Turları' },
          { label: 'Amsterdam Turları' },
        ],
      },
    ],
  },
  {
    title: 'Tur Takvimi',
    columns: [
      {
        title: 'Sezon Turları',
        items: [
          { label: 'Kış Turları' },
          { label: 'Yaz Turları' },
          { label: 'İlkbahar Turları' },
          { label: 'Sonbahar Turları' },
          { label: 'Yazlık Bölgeler' },
        ],
      },
      {
        title: 'Erken Rezervasyon',
        items: [
          { label: 'Erken Rezervasyon 2025' },
          { label: 'Yaz Erken Rezervasyon' },
          { label: 'Kış Erken Rezervasyon' },
          { label: 'Sezon Başı Fırsatları' },
          { label: 'Ön Ödeme Avantajlı Turlar' },
        ],
      },
    ],
  },
]

export const HeaderMenu: React.FC = () => {
  const isMounted = useMounted()

  if (!isMounted) {
    return (
      <div className='flex items-center px-3'>
        {headerMenuData.map((item, index) => (
          <UnstyledButton key={index} className='text-sm font-medium'>
            {item.title}
          </UnstyledButton>
        ))}
      </div>
    )
  }

  return (
    <div className='flex items-center px-3'>
      {headerMenuData.map((item, index) => (
        <Menu
          key={index}
          width={500}
          position='bottom-start'
          classNames={{
            dropdown: classes.dropdown,
            item: classes.menuItem,
          }}
        >
          <Menu.Target>
            <UnstyledButton
              className={`flex items-center gap-1 text-sm font-medium ${classes.target}`}
            >
              <span className='text-sm font-medium'>{item.title}</span>
              <span className='text-sm font-medium'>
                <BiChevronDown className={classes.arrowIcon} />
              </span>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown className={classes.megaMenu}>
            <div className='grid grid-cols-2 gap-4'>
              {item.columns.map((column, colIndex) => (
                <div key={colIndex} className={classes.column}>
                  {column.title && (
                    <div className={classes.columnTitle}>{column.title}</div>
                  )}
                  <div className={classes.columnItems}>
                    {column.items.map((columnItem, itemIndex) => (
                      <div
                        key={itemIndex}
                        className={`${classes.menuLink} ${columnItem.isActive ? classes.active : ''}`}
                      >
                        <span>{columnItem.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Menu.Dropdown>
        </Menu>
      ))}
    </div>
  )
}
