import { Suspense } from 'react'
import { TourSearchResultClient } from '@/app/(frontend)/tour/search-results/client'
import { SearchResultsLoadingSkeleton } from '@/components/search-results-loading-skeleton'

const TourSearchResultsPage = async () => {
  return (
    <div>
      <Suspense
        fallback={
          <div style={{ height: '100vh' }}>
            <SearchResultsLoadingSkeleton />
          </div>
        }
      >
        <TourSearchResultClient />
      </Suspense>
    </div>
  )
}

export default TourSearchResultsPage
