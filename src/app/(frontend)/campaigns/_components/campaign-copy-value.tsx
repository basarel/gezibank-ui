'use client'
import { Button, CopyButton } from '@mantine/core'

export function CampaignCopySection({ code }: { code: string }) {
  return (
    <>
      {code && (
        <div className='my-5 inline-grid grid-cols-12 items-center gap-2 rounded-md border border-blue-600 p-2'>
          <div className='col-span-4'>
            <div className='text-sm'>İndirim Kodu :</div>
            <div className='text-2xl font-bold'>{code}</div>
          </div>
          <div className='col-span-8 text-right'>
            <CopyButton value={code}>
              {({ copied, copy }) => (
                <Button
                  color={copied ? 'teal' : 'blue'}
                  onClick={copy}
                  radius={'lg'}
                >
                  {copied ? 'Kopyalandı' : 'Kopyala'}
                </Button>
              )}
            </CopyButton>
          </div>
        </div>
      )}
    </>
  )
}
