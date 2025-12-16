import { Suspense } from 'react'
import { TourDetailClient } from './client'
import { Skeleton, Stack } from '@mantine/core'

const TourDetailPage = () => {
  return (
    <Suspense
      fallback={
        <div className='h-screen px-0'>
          <Stack gap='md' p='md'>
            <Skeleton height={400} />
            <Skeleton height={200} />
            <Skeleton height={300} />
          </Stack>
        </div>
      }
    >
      <TourDetailClient />
    </Suspense>
  )
}

export default TourDetailPage
