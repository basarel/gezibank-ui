import { TableOfContents } from '@mantine/core'
import classes from './Toc.module.css'

const TourTableOfContents: React.FC = () => {
  return (
    <div
      className='relative z-20 rounded-md bg-orange-900 text-white'
      style={{ pointerEvents: 'auto' }}
    >
      <div className='relative mx-auto max-w-6xl overflow-hidden'>
        <div className='flex items-center justify-center gap-4 overflow-x-auto overflow-y-hidden md:mt-0 md:flex-row md:justify-between md:overflow-visible'>
          <TableOfContents
            classNames={classes}
            variant='filled'
            color='orange'
            size='xs'
            radius='xs'
            scrollSpyOptions={{
              selector:
                ' #general, #hotel, #tour-program, #transport, #included-information, #not-included-information, #visa-infos',
            }}
            getControlProps={({ data }) => ({
              onClick: () =>
                data.getNode().scrollIntoView({
                  behavior: 'smooth',
                }),
              children: data.value,
            })}
          />
        </div>
      </div>
    </div>
  )
}

export default TourTableOfContents
