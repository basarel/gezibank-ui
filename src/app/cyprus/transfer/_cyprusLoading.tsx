'use client'

import { Skeleton, Stack } from '@mantine/core'
import { CheckoutCard } from '@/components/card'

export const CyprusLoading = () => {
  return (
    <div className='grid grid-cols-3 gap-3 md:grid-cols-12'>
      <div className='col-span-12 md:col-span-8'>
        <div className='mb-3 md:mb-8'>
          <Skeleton height={32} width='60%' className='mb-2' />
          <Skeleton height={20} width='80%' />
        </div>

        <Stack gap={'xl'}>
          {/* Gidiş Uçuşu Skeleton */}
          <div className='rounded-lg border border-gray-200 bg-white p-3 shadow-sm md:p-6'>
            <div className='mb-4'>
              <Skeleton height={28} width='40%' className='mb-2' />
              <div className='flex items-center justify-between'>
                <Skeleton height={20} width='30%' />
                <Skeleton height={20} width='35%' />
              </div>
            </div>
            <div className='space-y-3'>
              <Skeleton height={80} radius='md' />
              <Skeleton height={80} radius='md' />
              <Skeleton height={80} radius='md' />
            </div>
          </div>

          {/* Dönüş Uçuşu Skeleton */}
          <div className='rounded-lg border border-gray-200 bg-white p-3 shadow-sm md:p-6'>
            <div className='mb-4'>
              <Skeleton height={28} width='40%' className='mb-2' />
              <div className='flex items-center justify-between'>
                <Skeleton height={20} width='30%' />
                <Skeleton height={20} width='35%' />
              </div>
            </div>
            <div className='space-y-3'>
              <Skeleton height={80} radius='md' />
              <Skeleton height={80} radius='md' />
              <Skeleton height={80} radius='md' />
            </div>
          </div>

          {/* Transfer Seçenekleri Skeleton */}
          <div className='rounded-lg border border-gray-200 bg-white p-3 shadow-sm md:p-6'>
            <div className='mb-4'>
              <Skeleton height={28} width='45%' className='mb-2' />
              <Skeleton height={16} width='90%' />
              <Skeleton height={16} width='70%' className='mt-1' />
            </div>
            <div className='space-y-3 pt-2'>
              <Skeleton height={120} radius='md' />
              <Skeleton height={120} radius='md' />
              <Skeleton height={120} radius='md' />
            </div>
          </div>
        </Stack>
      </div>

      <div className='col-span-12 md:col-span-4'>
        <div className='sticky top-4 grid gap-3'>
          <div className='hidden md:block'>
            <CheckoutCard>
              <Skeleton height={24} width='50%' className='mb-4' />
              <Skeleton height={32} width='100%' className='mb-4' />
              <div className='space-y-2 border-t pt-3'>
                <Skeleton height={20} width='100%' />
                <Skeleton height={20} width='100%' />
                <Skeleton height={20} width='100%' />
                <Skeleton height={20} width='100%' />
              </div>
              <div className='mt-4 border-t pt-4'>
                <Skeleton height={48} width='100%' radius='md' />
              </div>
            </CheckoutCard>
          </div>
        </div>
      </div>
    </div>
  )
}
