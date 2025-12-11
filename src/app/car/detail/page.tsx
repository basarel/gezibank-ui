import type { SearchParams } from 'nuqs/server'

import { carDetailSearchParamsCache } from '../searchParams'
import { Suspense } from 'react'
import { DetailClient } from './client'
import { Container, Skeleton } from '@mantine/core'

type PageProps = {
  searchParams: Promise<SearchParams>
}

const CarDetailPage: React.FC<PageProps> = async ({ searchParams }) => {
  await carDetailSearchParamsCache.parse(searchParams)

  return (
    <Container>
      <Suspense fallback={<Loader />}>
        <DetailClient />
      </Suspense>
    </Container>
  )
}

export default CarDetailPage

const Loader = () => (
  <>
    <div className='mt-5 grid items-start gap-5 md:grid md:grid-cols-6'>
      <div className='col-span-4 grid gap-4'>
        <div className='grid gap-5 rounded-md border p-3 md:p-5'>
          <div className='md:col-span-2'>
            <Skeleton radius={'md'} h={200} />
          </div>
          <div className='grid gap-3 md:col-span-3'>
            <div className='flex items-center gap-2'>
              <Skeleton radius={'md'} h={32} w='60%' />
              <Skeleton radius={'md'} h={20} w='40%' />
              <Skeleton radius={'md'} h={20} w='40%' />
            </div>
            <div className='grid gap-2 md:flex md:gap-4'>
              <div className='flex items-center gap-2'>
                <Skeleton radius={'md'} h={32} w='60%' />
                <Skeleton radius={'md'} h={20} w='40%' />
                <Skeleton radius={'md'} h={20} w='40%' />
              </div>
            </div>
          </div>
          <div className='hidden'>
            <Skeleton radius={'md'} h={60} w={60} />
          </div>
          <div className='md:col-span-5'>
            <div className='grid gap-3 rounded-md bg-gray-50 p-3 md:grid-cols-2'>
              <div className='space-y-2'>
                <Skeleton radius={'md'} h={24} w='80%' />
                <Skeleton radius={'md'} h={16} w='60%' />
              </div>
              <div className='space-y-2'>
                <Skeleton radius={'md'} h={24} w='80%' />
                <Skeleton radius={'md'} h={16} w='60%' />
              </div>
            </div>
          </div>
        </div>

        <div className='grid gap-3 rounded-md border p-4'>
          <Skeleton radius={'md'} h={28} w='60%' />
          <div className='grid gap-3'>
            {[1].map((item) => (
              <Skeleton key={item} radius={'md'} h={60} />
            ))}
          </div>
        </div>

        <div className='grid gap-3 rounded-md border p-4'>
          <Skeleton radius={'md'} h={28} w='50%' />
          <div className='grid gap-3'>
            {[1].map((item) => (
              <Skeleton key={item} radius={'md'} h={60} />
            ))}
          </div>
        </div>

        <div className='grid gap-3 rounded-md border p-3'>
          <Skeleton radius={'md'} h={40} />
        </div>
      </div>

      <div className='hidden md:sticky md:top-1 md:col-span-2 md:grid md:w-full'>
        <div className='grid gap-3 rounded-md border bg-white p-4'>
          <Skeleton radius={'md'} h={28} w='60%' />
          <div className='flex items-center justify-between rounded bg-gray-50 p-3'>
            <Skeleton radius={'md'} h={20} w='60%' />
            <Skeleton radius={'md'} h={20} w='30%' />
          </div>
          <Skeleton radius={'md'} h={16} w='40%' className='ms-auto' />
          <div className='flex items-center justify-between rounded bg-gray-50 p-3'>
            <Skeleton radius={'md'} h={20} w='50%' />
            <Skeleton radius={'md'} h={20} w='30%' />
          </div>
          <Skeleton radius={'md'} h={1} />
          <div className='flex items-center justify-between p-3'>
            <Skeleton radius={'md'} h={24} w='40%' />
            <Skeleton radius={'md'} h={24} w='35%' />
          </div>
          <Skeleton radius={'md'} h={44} />
        </div>
      </div>
    </div>
  </>
)
export { Loader as CarDetailLoader }
