'use client'

import { ScrollArea, Skeleton, Tabs, TabsTab } from '@mantine/core'
import { useLocalStorage, useMounted } from '@mantine/hooks'

import { RiSuitcaseLine } from 'react-icons/ri'
import { TourSearchEngine } from '@/modules/tour'

import classes from '@/components/search-engine/Search.module.css'

const searchModules = {
  tour: { value: 'tour', title: 'Tur' },
}

export const SearchEngine = () => {
  const mounted = useMounted()

  if (!mounted)
    return <Skeleton visible={!mounted} radius={'lg'} mih={200}></Skeleton>

  return (
    <Tabs
      value={searchModules.tour.value}
      classNames={classes}
      keepMounted={true}
      variant='unstyle'
    >
      <ScrollArea
        type='auto'
        scrollbars='x'
        scrollbarSize={0}
        className='border-b whitespace-nowrap'
      >
        <Tabs.List
          px={{
            sm: 'sm',
            md: 'lg',
          }}
          style={{
            minWidth: 'max-content',
          }}
        >
          <TabsTab
            value={searchModules.tour.value}
            leftSection={<RiSuitcaseLine size={24} />}
          >
            {searchModules.tour.title}
          </TabsTab>
        </Tabs.List>
      </ScrollArea>

      <div className='p-4'>
        <Tabs.Panel value={searchModules.tour.value}>
          <TourSearchEngine />
        </Tabs.Panel>
      </div>
    </Tabs>
  )
}
