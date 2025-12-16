import { Suspense } from 'react'

import { Container, Skeleton } from '@mantine/core'
import { type SearchParams } from 'nuqs'
import { SearchResult } from './search-result'
import { SearchResultsLoadingSkeleton } from '@/components/search-results-loading-skeleton'

type PageProps = {
  searchParams: Promise<SearchParams>
}
const CarSearchResultPage: React.FC<PageProps> = async ({ searchParams }) => {
  const params = await searchParams

  return (
    <Suspense fallback={<Loader />}>
      <SearchResult searchParams={params} />
    </Suspense>
  )
}

export default CarSearchResultPage

const Loader = () => (
  <div style={{ height: '100vh' }}>
    <SearchResultsLoadingSkeleton />
  </div>
)
