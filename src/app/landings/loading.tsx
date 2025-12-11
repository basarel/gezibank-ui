import { Container, Skeleton } from '@mantine/core'

const Loading = () => (
  <div>
    <div className='relative'>
      <Skeleton height={120} />
    </div>
    <Container className='grid grid-cols-1 gap-8 py-5 md:gap-12 md:py-10'>
      <div>
        <Skeleton height={32} width='40%' mb='lg' />
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-3 md:grid-cols-4'>
          {[...Array(8)].map((_, index) => (
            <div key={index} className='overflow-hidden rounded-md border'>
              <Skeleton height={150} />
              <div className='p-3'>
                <Skeleton height={20} mb='xs' />
                <Skeleton height={16} width='80%' />
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  </div>
)

export default Loading
