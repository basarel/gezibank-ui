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

      <Container className='relative z-10 mx-auto rounded-xl bg-white p-6 text-black shadow-[-10px_1px_10px_0px_rgba(0,0,0,0.25)] md:-mt-14 md:-mt-20'>
        <div className='mt-6 flex flex-col items-start justify-between gap-6 md:flex-row'>
          <div className='md:flex hidden flex-1 flex-col gap-4'>
            <div className='flex items-start gap-3'>
              <Skeleton className='h-16 w-2' radius='md' />
              <Skeleton className='h-8 w-3/4' radius='md' />
            </div>
            <div className='hidden flex-col gap-6 pt-5 md:flex'>
              <Skeleton className='h-6 w-full' radius='md' />
              <Skeleton className='h-6 w-4/5' radius='md' />
              <Skeleton className='h-6 w-3/5' radius='md' />
            </div>
          </div>
          <div className='mt-auto flex w-full mt-3 flex-col items-center gap-4 md:w-auto md:items-end'>
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
        <div className='top-0 z-20 my-6 rounded-lg shadow-[-10px_1px_10px_0px_rgba(0,0,0,0.25)] p-2 border'>
          <div className='grid grid-cols-6 gap-2 overflow-x-auto'>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Skeleton key={item} className='h-10 w-24 shrink-0' radius='md' />
            ))}
          </div>
        </div>

        <div className='flex flex-col gap-4 py-4 md:grid md:grid-cols-12 md:grid-rows-[auto_auto] md:py-0'>
          <div className='order-2 rounded-lg border p-5 md:order-0 md:col-span-8 md:row-span-2'>
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

           <div className='order-1 rounded-lg border p-5 md:col-span-4 md:col-start-9 md:row-start-1'>
            <Skeleton className='mb-4 h-6 w-48' radius='md' />
            <div className='flex flex-col gap-4'>
              <Skeleton className='h-12 w-full' radius='md' />
              <Skeleton className='h-12 w-full' radius='md' />
              <div className='mt-4 flex items-center justify-between border-t pt-4'>
                <Skeleton className='h-6 w-24' radius='md' />
                <Skeleton className='h-6 w-32' radius='md' />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

