import { cookies } from 'next/headers'
// import { serviceRequest } from '@/network'
// import { auth } from '@/app/auth'
// import { Account } from '@/app/account/type'

import { ReservationLayout } from './_components/page-layout'
import { CheckoutPassengerPage } from './_components/passenger-page'
import { Suspense } from 'react'
import Loading from './loading'

export default async function CheckoutPage() {
  const cookieStore = await cookies()
  const access_token = cookieStore.get('access_token')?.value
  const providerName = cookieStore.get('login-provider')?.value

  return (
    <Suspense fallback={<Loading />}>
      <ReservationLayout>
        <CheckoutPassengerPage
          access_token={access_token}
          providerName={providerName}
        />
      </ReservationLayout>
    </Suspense>
  )
}
