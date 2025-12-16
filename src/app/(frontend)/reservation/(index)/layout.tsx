import { Suspense } from 'react'
import { Container } from '@mantine/core'
import Loading from './loading'

export default function ReservationMainLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Suspense fallback={<Loading />}>
      <Container className='py-5'>{children}</Container>
    </Suspense>
  )
}
