import { Suspense } from 'react'
import { HotelDetailSection } from './detail'
import { HotelDetailSkeleton } from './skeletonLoader'

const HotelDetailPage = async ({
  params,
}: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await params

  return (
    <Suspense
      fallback={
        <div className='h-screen'>
          <HotelDetailSkeleton />
        </div>
      }
    >
      <HotelDetailSection slug={slug} />
    </Suspense>
  )
}

export default HotelDetailPage
