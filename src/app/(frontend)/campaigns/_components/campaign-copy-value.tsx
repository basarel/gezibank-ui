'use client'
import { Button, CopyButton } from '@mantine/core'

export function CampaignCopySection({ code }: { code: string }) {
  return (
    <>
      {code && (
        <div className='inline-grid grid-cols-20 items-center gap-2 rounded-md border border-blue-600 p-4'>
          <div className='col-span-5'>
            <div className='text-sm'>İndirim Kodu :</div>
            <div className='text-2xl font-bold'>{code}</div>
          </div>
          <div className='col-span-15 text-right'>
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
