import { Suspense } from 'react'

import { TransferSearchResults } from './search-results'
import { SearchResultsLoadingSkeleton } from '@/components/search-results-loading-skeleton'

export default function Page() {
  return (
    <Suspense
      fallback={
        <div style={{ height: '100vh' }}>
          <SearchResultsLoadingSkeleton />
        </div>
      }
    >
      <TransferSearchResults />
    </Suspense>
  )
}
