import { Container, Skeleton } from '@mantine/core'

export const TourDetailSkeleton = () => {
  return (
    <div className='relative'>
      {/* Resim Galerisi Skeleton */}
      <div className='relative flex flex-col gap-4 px-3 md:flex-row md:px-0'>
        <Skeleton className='h-64 w-full md:h-96 md:w-[40%]' radius='md' />
        <div className='static hidden w-full flex-col gap-4 md:flex md:w-[60%]'>
          <div className='grid grid-cols-2 gap-4'>
            <Skeleton className='h-40' radius='md' />
            <Skeleton className='h-40' radius='md' />
          </div>
          <div className='grid grid-cols-3 gap-4'>
            <Skeleton className='h-32' radius='md' />
            <Skeleton className='h-32' radius='md' />
            <Skeleton className='h-32' radius='md' />
          </div>
        </div>
      </div>

      <Container className='relative z-10 mx-auto rounded-xl bg-white p-6 text-black shadow-[-10px_10px_20px_0px_rgba(0,0,0,0.25)] md:-mt-14 md:-mt-20'>
        <div className='mt-6 flex flex-col items-start justify-between gap-6 md:flex-row'>
          <div className='flex flex-1 flex-col gap-4'>
            <div className='flex items-center gap-3'>
              <Skeleton className='h-16 w-2' radius='md' />
              <Skeleton className='h-8 w-3/4' radius='md' />
            </div>
            <div className='flex flex-col gap-6 pt-5'>
              <Skeleton className='h-6 w-full' radius='md' />
              <Skeleton className='h-6 w-4/5' radius='md' />
              <Skeleton className='h-6 w-3/5' radius='md' />
            </div>
          </div>
          <div className='mt-4 flex w-full flex-col items-center gap-4 md:w-auto md:items-end'>
            <Skeleton className='h-6 w-32' radius='md' />
            <Skeleton className='h-20 w-40' radius='md' />
            <Skeleton className='h-10 w-full md:w-48' radius='md' />
            <div className='flex w-full flex-col gap-3 md:w-auto'>
              <Skeleton className='h-10 w-full md:w-48' radius='md' />
              <Skeleton className='h-10 w-full md:w-48' radius='md' />
            </div>
          </div>
        </div>
      </Container>

      <Container className='px-0'>
        {/* Tab Skeleton */}
        <div className='my-6'>
          {/* Tab List Skeleton */}
          <div className='rounded-lg bg-orange-900 px-2 py-4 shadow-[-10px_10px_20px_0px_rgba(0,0,0,0.25)] md:px-4'>
            <div className='flex gap-2 md:gap-4'>
              <Skeleton className='h-8 w-24 bg-white/20 md:w-32' radius='md' />
              <Skeleton className='h-8 w-24 bg-white/20 md:w-32' radius='md' />
              <Skeleton className='h-8 w-32 bg-white/20 md:w-40' radius='md' />
            </div>
          </div>

          {/* Tab Panel Skeleton */}
          <div className='mt-4 rounded-lg border border-gray-200 bg-white p-5 shadow-md'>
            <Skeleton className='mb-6 h-8 w-48' radius='md' />
            <div className='flex flex-col gap-6'>
              {[1, 2, 3].map((item) => (
                <div key={item} className='flex flex-col gap-3'>
                  <Skeleton className='h-6 w-64' radius='md' />
                  <Skeleton className='h-4 w-full' radius='md' />
                  <Skeleton className='h-4 w-full' radius='md' />
                  <Skeleton className='h-4 w-5/6' radius='md' />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}
