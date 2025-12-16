import { type SearchParams } from 'nuqs/server'

import { Suspense } from 'react'
import { HotelSearchResults } from './search-result'
import { SearchResultsLoadingSkeleton } from '@/components/search-results-loading-skeleton'

type PageProps = {
  searchParams: Promise<SearchParams>
}

const HotelSearchResultsPage: React.FC<PageProps> = async ({
  searchParams,
}) => {
  const { slug } = await searchParams

  return (
    <Suspense
      fallback={
        <div style={{ height: '100vh' }}>
          <LoadingComponent />
        </div>
      }
    >
      <HotelSearchResults slug={slug as string} />
    </Suspense>
  )
}

export default HotelSearchResultsPage
const LoadingComponent = () => {
  return (
    <div style={{ height: '100vh' }}>
      <SearchResultsLoadingSkeleton />
    </div>
  )
}

export { LoadingComponent }
