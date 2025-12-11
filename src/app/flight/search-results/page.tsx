import { Suspense } from 'react'

import { FlightSearchView } from '@/app/flight/search-results/client'
import { SearchResultsLoadingSkeleton } from '@/components/search-results-loading-skeleton'

export default function FlightSearchResultsPage() {
  return (
    <Suspense
      fallback={
        <div>
          <Loader />
        </div>
      }
    >
      <FlightSearchView />
    </Suspense>
  )
}

const Loader = () => (
  <div style={{ height: '100vh' }}>
    <SearchResultsLoadingSkeleton />
  </div>
)
