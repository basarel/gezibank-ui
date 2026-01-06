import { Container, Skeleton } from '@mantine/core'

type SearchResultsLoadingSkeletonProps = {
  itemCount?: number
  showFilterSkeleton?: boolean
  filterColumnClassName?: string
  resultsColumnClassName?: string
}

export function SearchResultsLoadingSkeleton({
  itemCount = 4,
  showFilterSkeleton = true,
  filterColumnClassName = 'lg:col-span-3',
  resultsColumnClassName = 'lg:col-span-9',
}: SearchResultsLoadingSkeletonProps) {
  return (
    <Container>
      <div className='flex flex-col gap-4 px-0 py-5 sm:px-4 md:gap-6 md:py-6'>
        <div className='grid grid-cols-1 gap-6 lg:grid-cols-12'>
          {showFilterSkeleton && (
            <div className={filterColumnClassName}>
              <div className='hidden rounded-lg border bg-white p-2 md:block'>
                <Skeleton h={24} w='50%' className='mb-4' />

                <div className='mt-3 mb-6'>
                  <Skeleton h={20} w='40%' className='mb-3' />
                  <Skeleton h={40} w='100%' />
                </div>

                <div className='mt-3 mb-6'>
                  <Skeleton h={20} w='55%' className='mb-3' />
                  <div className='space-y-2'>
                    {[1, 2, 3, 4].map((index) => (
                      <div key={index} className='flex items-center gap-2'>
                        <Skeleton h={16} w={16} />
                        <Skeleton h={16} w={110} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className='mt-3 mb-6'>
                  <Skeleton h={16} w='55%' className='mb-3' />
                  <div className='space-y-2'>
                    {[1, 2, 3, 4].map((index) => (
                      <div key={index} className='flex items-center gap-2'>
                        <Skeleton h={16} w={16} className='rounded-full' />
                        <Skeleton h={16} w={110} className='rounded-full' />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div
            className={
              showFilterSkeleton ? resultsColumnClassName : 'lg:col-span-12'
            }
          >
            <div className='space-y-4'>
              {Array.from({ length: itemCount }).map((_, index) => (
                <div
                  key={index}
                  className='mb-4 rounded-lg border border-gray-200 p-4'
                >
                  <div className='flex gap-4'>
                    <Skeleton height={120} width={100} radius='md' />
                    <div className='flex-1 space-y-3'>
                      <Skeleton height={20} width='60%' />
                      <Skeleton height={16} width='40%' />
                      <Skeleton height={16} width='80%' />
                      <div className='flex gap-2'>
                        <Skeleton height={24} width={60} />
                        <Skeleton height={24} width={60} />
                        <Skeleton height={24} width={60} />
                      </div>
                      <div className='flex justify-between'>
                        <Skeleton height={20} width='30%' />
                        <Skeleton height={32} width={100} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
