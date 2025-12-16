import { SearchResultsLoadingSkeleton } from '@/components/search-results-loading-skeleton'

export default function Loading() {
  return (
    <div style={{ height: '100vh' }}>
      <SearchResultsLoadingSkeleton />
    </div>
  )
}
