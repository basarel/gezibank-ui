import { AspectRatio, Box, Image, Loader } from '@mantine/core'
import { SearchLoaderBanner } from '@/libs/payload'
import { IconType } from 'react-icons/lib'

type IProps = {
  data?: SearchLoaderBanner
  Icon: IconType
}

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

export const LoaderBanner = ({ data, Icon }: IProps) => {
  if (!data) return null

  const imageUrl = getImageUrl(data.image)
  const bannerContent = imageUrl ? (
    <AspectRatio ratio={2.6 / 1}>
      <Image
        loading='lazy'
        src={imageUrl}
        alt={data.text || 'Loader Banner'}
        radius='md'
        fit='cover'
        className='h-full w-full'
      />
    </AspectRatio>
  ) : null

  return (
    <div className='grid items-center rounded-md border bg-white p-2 md:gap-5'>
      <div className='flex items-center justify-center gap-2'>
        <div className='relative items-baseline'>
          <Loader className='text-primary-600 mt-2' size='lg' />

          <span className='text-primary-600 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform leading-none'>
            <Icon size={20} />
          </span>
        </div>
        <div className='text-primary-600 text-center font-bold md:text-lg'>
          {data.text || 'Turlar yükleniyor, lütfen bekleyiniz...'}
        </div>
      </div>
      {bannerContent}
    </div>
  )
}
