import { Widgets } from '@/types/cms-types'
import { Button, CopyButton, Image } from '@mantine/core'

type IProps = {
  data: Widgets
}
export const SearchCopyCode = ({ data }: IProps) => {
  const code = data.at(0)?.params.tag.value ?? ''
  if (!data || data.length === 0 || !code) {
    return null
  }

  return (
    <div className='m-1 mb-2 grid grid-cols-7 items-center justify-between gap-5 rounded-md border border-blue-500 p-1 py-3 md:gap-6 md:p-2 md:px-3'>
      <CopyButton value={code}>
        {({ copied, copy }) => (
          <Button
            color={copied ? 'teal' : 'blue'}
            onClick={copy}
            radius={'lg'}
            className='col-span-3 !h-auto px-4 py-2 md:col-span-2'
          >
            {copied ? (
              <div className='mx-auto !h-auto px-4 py-2 text-sm font-bold md:text-xl'>
                Kopyalandı
              </div>
            ) : (
              <div className='tetx-center flex flex-col items-start'>
                <div className='mx-auto text-[10px] font-normal md:text-sm'>
                  Kodu Kopyala
                </div>
                <div className='text-sm font-bold md:text-2xl'>{code}</div>
              </div>
            )}
          </Button>
        )}
      </CopyButton>

      <div
        className='col-span-4 text-sm font-medium md:text-xl'
        dangerouslySetInnerHTML={{
          __html: data.at(0)?.params.description.value ?? '',
        }}
      />
      <Image
        className='hidden md:col-span-1 md:block'
        src={`${process.env.NEXT_PUBLIC_CMS_CDN}/${data.at(0)?.params.image.value}`}
        alt='Kampanya görseli'
        fit='contain'
        w='auto'
        h={70}
      />
    </div>
  )
}
