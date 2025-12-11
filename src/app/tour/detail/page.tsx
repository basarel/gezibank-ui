import { Suspense } from 'react'
import { TourDetailClient } from './client'
import { HotelDetailSkeleton } from '@/app/hotel/(detail)/[slug]/skeletonLoader'

const TourDetailPage = () => {
  return (
    <Suspense
      fallback={
        <div className='h-screen px-0'>
          <HotelDetailSkeleton />
        </div>
      }
    >
      <TourDetailClient />
    </Suspense>
  )
}

export default TourDetailPage
