import type { SearchParams } from 'nuqs/server'

import { carDetailSearchParamsCache } from '../searchParams'
import { Suspense } from 'react'
import { DetailClient } from './client'
import { Container, Loader } from '@mantine/core'
import { CarDetailLoader } from './loader'

type PageProps = {
  searchParams: Promise<SearchParams>
}

const CarDetailPage: React.FC<PageProps> = async ({ searchParams }) => {
  await carDetailSearchParamsCache.parse(searchParams)

  return (
    <Container>
      <Suspense fallback={<Loader />}>
        <DetailClient />
      </Suspense>
    </Container>
  )
}

export default CarDetailPage
