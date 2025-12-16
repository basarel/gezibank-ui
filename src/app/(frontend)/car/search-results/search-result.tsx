import { SearchParams } from 'nuqs'
import { notFound } from 'next/navigation'

import { getCarSearchResultParams } from '@/app/(frontend)/car/search-results/request-model'
import { Search } from '../component/search'
import { SearchResultsLoadingSkeleton } from '@/components/search-results-loading-skeleton'
import { Suspense } from 'react'

type IProps = {
  searchParams: SearchParams
}

const SearchResult: React.FC<IProps> = async ({ searchParams }) => {
  const searchApiParams = await getCarSearchResultParams(searchParams)

  if (!searchApiParams) {
    notFound()
  }

  return (
    <Suspense
      fallback={
        <div style={{ height: '100vh' }}>
          <SearchResultsLoadingSkeleton />
        </div>
      }
    >
      <Search searchRequestParams={searchApiParams} />
    </Suspense>
  )
}

export { SearchResult }
