'use client'

import {
  Title,
  ScrollArea,
  Tabs,
  TabsList,
  TabsTab,
  TabsPanel,
  SimpleGrid,
  Anchor,
} from '@mantine/core'
import { Link } from 'next-view-transitions'
import { Route } from 'next'
import populerDestinationClasses from '@/styles/OutlineTabs.module.css'

type MenuItem = {
  id: string
  title: string
  url: string
}

type Menu = {
  id: string
  title: string
  ordering: number
  items: MenuItem[]
}

type PopulerLinksBlockProps = {
  title?: string
  description?: string
  menus: Menu[]
}

export const PopulerLinksBlock: React.FC<PopulerLinksBlockProps> = ({
  title,
  description,
  menus = [],
}) => {
  if (!menus || menus.length === 0) {
    return null
  }

  const sortedMenus = [...menus].sort((a, b) => a.ordering - b.ordering)

  return (
    <div>
      {title && (
        <Title fz={{ base: 'h3', md: 'h2' }} mb={'md'}>
          {title}
        </Title>
      )}
      {description && <div className='mb-4 text-gray-700'>{description}</div>}
      <div>
        <Tabs
          defaultValue={'' + sortedMenus[0]?.id}
          variant='unstyle'
          classNames={populerDestinationClasses}
        >
          <ScrollArea
            type='auto'
            scrollbars='x'
            scrollbarSize={0}
            className='whitespace-nowrap'
          >
            <TabsList className='flex-nowrap gap-2'>
              {sortedMenus.map((menu) => {
                return (
                  <TabsTab key={menu.id} value={'' + menu.id}>
                    {menu.title}
                  </TabsTab>
                )
              })}
            </TabsList>
          </ScrollArea>

          <div className='pt-3 md:pt-8'>
            {sortedMenus.map((menu) => (
              <TabsPanel value={'' + menu.id} key={menu.id}>
                <SimpleGrid
                  className='mt-8 overflow-x-auto whitespace-nowrap md:mt-0'
                  cols={{ base: 2, md: 4 }}
                >
                  {menu.items.map((item) => (
                    <div className='w-full md:w-100' key={item.id}>
                      <Anchor
                        href={item.url as Route}
                        className='text-dark-700'
                        component={Link}
                      >
                        {item.title}
                      </Anchor>
                    </div>
                  ))}
                </SimpleGrid>
              </TabsPanel>
            ))}
          </div>
        </Tabs>
      </div>
    </div>
  )
}
