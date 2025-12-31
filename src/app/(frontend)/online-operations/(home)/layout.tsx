import { Container} from '@mantine/core'

export default function OnlineOperationsLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='pb-5'>
      <div className='relative'>
        <div className='before:absolute before:start-0 before:top-0 before:-z-10 before:block before:h-1/2 before:w-full before:bg-blue-800'>
          <div className='relative'>
            <div className='before:absolute before:start-0 before:top-0 before:-z-10 before:block before:h-1/2 before:w-full before:bg-blue-800'>
              <div className='relative before:absolute before:start-0 before:top- md:pt-25 h-[600px] before:-z-10 before:block before:h-1/2 before:w-full before:bg-blue-800'>
                <Container>
                  <div className='rounded-md border bg-white p-3 md:p-8'>
                    {children}
                  </div>
                </Container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
