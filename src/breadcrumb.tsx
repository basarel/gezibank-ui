import { Breadcrumbs, Anchor } from '@mantine/core'
import { MdOutlineChevronRight } from 'react-icons/md'

type IProps = {
  items: {
    title: string | React.ReactNode
    href?: string
    onClick?: (e: React.MouseEvent) => void
  }[]
}
export default function Breadcrumb({ items }: IProps) {
  const breadcrumbItems = [{ title: 'GeziBank', href: '/' }, ...items]

  return (
    <div>
      <Breadcrumbs
        separator={<MdOutlineChevronRight size={16} />}
        separatorMargin='xs'
      >
        {breadcrumbItems.map((item, index) => {
          const isLast = index === breadcrumbItems.length - 1
          if (isLast) {
            return (
              <span
                key={index}
                className='text-xs font-medium text-gray-600 md:text-sm'
              >
                {item.title}
              </span>
            )
          }
          return (
            <Anchor
              key={index}
              className='text-xs font-medium text-blue-600 hover:text-blue-800 md:text-sm'
              href={item?.href || '#'}
              onClick={item?.onClick}
            >
              {item.title}
            </Anchor>
          )
        })}
      </Breadcrumbs>
    </div>
  )
}
