'use client'

import { MyAccount } from './my-account'
import { Skeleton } from '@mantine/core'
import { useExternalLoginQuery, useUserInfoQuery } from '@/hooks/useUser'

export const AccountInfoLayer = ({
  access_token,
  providerName,
}: {
  access_token?: string | null | undefined
  providerName?: string | null | undefined
}) => {
  const externalLoginQuery = useExternalLoginQuery({
    accessToken: access_token,
    providerName,
  })
  const userInfoQuery = useUserInfoQuery({
    enabled: !externalLoginQuery.isLoading || !access_token,
  })

  if (externalLoginQuery.isLoading || userInfoQuery.isLoading)
    return <Skeleton height={20} />

  if (userInfoQuery.data?.data)
    return <MyAccount defaultValues={userInfoQuery.data?.data} />
}
