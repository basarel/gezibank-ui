import { Suspense } from 'react'
import { Skeleton } from '@mantine/core'
import { ListResults } from './_client'

type PageProps = {
  params: Promise<{ slug: string }>
}

export default async function HotelListViewPage({ params }: PageProps) {
  const { slug } = await params

  return (
    <Suspense fallback={<Skeleton h={20} radius={'sm'} />}>
      <ListResults slug={slug} />
    </Suspense>
  )
}
