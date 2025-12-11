import { Container, Skeleton, Stack } from '@mantine/core'

const Loading = () => {
  return (
    <div style={{ minHeight: '100vh', width: '100%' }}>
      <Container size='xl' className='py-6'>
        <Stack gap='md'>
          <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-12 grid gap-4 md:col-span-8'>
              <div className='rounded-lg border p-4'>
                <Skeleton h={24} w={150} mb='sm' />
                <div className='grid gap-3'>
                  <Skeleton h={20} w='100%' />
                  <Skeleton h={20} w='80%' />
                  <Skeleton h={20} w='90%' />
                </div>
              </div>

              <div className='rounded-lg border p-4'>
                <Skeleton h={24} w={180} mb='md' />
                <div className='grid gap-4'>
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className='rounded border p-3'>
                      <Skeleton h={20} w={120} mb='sm' />
                      <div className='grid grid-cols-1 gap-3 md:grid-cols-2'>
                        <Skeleton h={40} w='100%' />
                        <Skeleton h={40} w='100%' />
                        <Skeleton h={40} w='100%' />
                        <Skeleton h={40} w='100%' />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className='rounded-lg border p-4'>
                <Skeleton h={24} w={150} mb='md' />
                <div className='grid gap-3'>
                  <Skeleton h={40} w='100%' />
                  <Skeleton h={40} w='100%' />
                  <Skeleton h={40} w='100%' />
                </div>
              </div>
            </div>
            <div className='col-span-4 hidden md:block'>
              <div className='rounded-lg border p-4'>
                <Skeleton h={24} w={150} mb='md' />
                <div className='grid gap-3'>
                  <Skeleton h={40} w='100%' />
                  <Skeleton h={40} w='100%' />
                </div>
              </div>
            </div>
          </div>
        </Stack>
      </Container>
    </div>
  )
}
export default Loading
