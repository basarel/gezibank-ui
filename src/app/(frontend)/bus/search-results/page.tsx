import { BusSearchResults } from '@/app/(frontend)/bus/search-results/search-results'
import { Skeleton } from '@mantine/core'
import { Suspense } from 'react'
import Loading from './loading'

const BusSearchResultsPage = () => {
  return (
    <Suspense
      fallback={
        <div style={{ height: '100vh' }}>
          <Loading />
        </div>
      }
    >
      <BusSearchResults />
    </Suspense>
  )
}

export default BusSearchResultsPage
