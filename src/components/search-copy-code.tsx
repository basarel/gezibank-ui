import { Button, CopyButton, Image } from '@mantine/core'
import { Search } from '@/libs/payload'

type IProps = {
  data: Search | null
}
export const SearchCopyCode = ({ data }: IProps) => {
  if (!data || !data.copyText) {
    return null
  }

  const imageUrl = data.copyImage?.url

  return (
    <div className='m-1 mb-2 grid grid-cols-7 items-center justify-between gap-5 rounded-md border border-blue-500 p-1 py-3 md:gap-6 md:p-2 md:px-3'>
      <CopyButton value={data.copyText}>
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
              <div className='tetx-center flex flex-col items-center'>
                <div className='mx-auto text-[10px] font-normal md:text-sm'>
                  Kodu Kopyala
                </div>
                <div className='text-sm font-bold md:text-2xl'>{data.copyText}</div>
              </div>
            )}
          </Button>
        )}
      </CopyButton>

      {data.copyDescription && (
        <div
          className='col-span-4 text-sm font-medium md:text-xl'
          dangerouslySetInnerHTML={{
            __html: data.copyDescription,
          }}
        />
      )}

      {imageUrl && (
        <Image
          className='hidden md:col-span-1 md:block'
          src={imageUrl}
          alt='Kampanya görseli'
          fit='contain'
          w='auto'
          h={70}
        />
      )}
    </div>
  )
}
