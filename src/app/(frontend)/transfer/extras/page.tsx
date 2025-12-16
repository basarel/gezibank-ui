import { Suspense } from 'react'
import { ExtraPage } from './_client'
import { Skeleton } from '@mantine/core'

export default function TransferExtraPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ExtraPage />
    </Suspense>
  )
}

const Loader = () => (
  <div className='flex flex-col items-start gap-5 md:grid md:grid-cols-6'>
    <div className='col-span-4 grid gap-4'>
      <div className='grid gap-5 rounded-md border p-3 md:p-5'>
        <div className='md:col-span-2'>
          <Skeleton radius={'md'} h={200} />
        </div>
        <div className='flex flex-col gap-3 md:col-span-3'>
          <Skeleton radius={'md'} h={32} w='70%' />
          <Skeleton radius={'md'} h={20} w='50%' />
          <div className='flex gap-4'>
            <Skeleton radius={'md'} h={20} w={100} />
            <Skeleton radius={'md'} h={20} w={100} />
            <Skeleton radius={'md'} h={20} w={100} />
          </div>
          <Skeleton radius={'md'} h={20} w='40%' />
        </div>
        <div className='md:col-span-5'>
          <div className='grid gap-3 rounded-md bg-gray-50 p-3 md:grid-cols-2'>
            <div className='space-y-2'>
              <Skeleton radius={'md'} h={16} w='30%' />
              <Skeleton radius={'md'} h={24} w='80%' />
            </div>
            <div className='space-y-2'>
              <Skeleton radius={'md'} h={16} w='30%' />
              <Skeleton radius={'md'} h={24} w='80%' />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className='hidden md:sticky md:top-1 md:col-span-2 md:grid md:w-full'>
      <div className='flex flex-col gap-3 rounded-md border bg-white p-4'>
        <Skeleton radius={'md'} h={28} w='60%' />
        <Skeleton radius={'md'} h={20} w='40%' className='ms-auto' />
        <Skeleton radius={'md'} h={1} />
        <Skeleton radius={'md'} h={60} />
      </div>
    </div>
  </div>
)
