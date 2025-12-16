import { Container, Skeleton } from '@mantine/core'
import { SearchParams } from 'nuqs/server'
import { cyprusHotelDetailLoader } from '../searchParams'
import { CyprusTransferSelect } from './_client'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'

export default async function CyprusTransferPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const queryParams = await cyprusHotelDetailLoader(searchParams)

  if (!queryParams) {
    return notFound()
  }

  return (
    <Container pt={'lg'} className='px-2 md:px-3'>
      <Suspense
        fallback={
          <div className='grid grid-cols-3 gap-3 md:grid-cols-12'>
            <div className='col-span-12 md:col-span-8'>
              <Skeleton h={400} w={'100%'} />
            </div>
            <div className='col-span-12 md:col-span-4'>
              <Skeleton h={400} w={'100%'} />
            </div>
          </div>
        }
      >
        <CyprusTransferSelect queryParams={queryParams} />
      </Suspense>
    </Container>
  )
}
