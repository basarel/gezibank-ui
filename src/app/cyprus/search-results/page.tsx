import { Suspense } from 'react'
import { CyprusSearchResults } from './client'
import { Skeleton } from '@mantine/core'
import { SearchResultsLoadingSkeleton } from '@/components/search-results-loading-skeleton'

const CyprusSearchResultsPage = () => {
  return (
    <Suspense fallback={<Loader />}>
      <CyprusSearchResults />
    </Suspense>
  )
}

export default CyprusSearchResultsPage
const Loader = () => (
  <div style={{ height: '100vh' }}>
    <SearchResultsLoadingSkeleton />
  </div>
)
