import { cookies } from 'next/headers'
import { Title } from '@mantine/core'
import { AccountInfoLayer } from './_components/accout-info-layer'
import { auth } from '@/app/auth'
import { redirect } from 'next/navigation'

export default async function AccountPage() {
  const session = await auth()
  if (!session?.user) redirect('/auth/login')

  const cookieStore = await cookies()
  const access_token = cookieStore.get('access_token')?.value
  const providerName = cookieStore.get('login-provider')?.value

  return (
    <div>
      <Title fz='h3'>Hesap Bilgilerim</Title>
      <AccountInfoLayer
        access_token={access_token}
        providerName={providerName}
      />
    </div>
  )
}
