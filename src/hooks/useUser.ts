import { Account } from '@/app/(frontend)/account/type'
import { serviceRequest } from '@/network'
import { useQuery } from '@tanstack/react-query'
import { useSession } from 'next-auth/react'

export const useUserInfoQuery = ({ enabled }: { enabled: boolean }) => {
  const session = useSession()

  return useQuery({
    enabled: session.status === 'authenticated' && enabled,
    queryKey: ['user-info'],
    queryFn: async () => {
      const response = await serviceRequest<Account>({
        axiosOptions: {
          url: 'api/account/user-info',
        },
      })

      return response
    },
  })
}

export const useExternalLoginQuery = ({
  accessToken,
  providerName,
}: {
  accessToken: string | undefined | null
  providerName: string | undefined | null
}) => {
  return useQuery({
    enabled: !!accessToken,
    queryKey: ['externalLogin', accessToken, providerName],
    queryFn: async () => {
      const externalLogin = await serviceRequest<{
        name: string
        surname: string
        fullName: string
        userAuthenticationToken: string
        userAuthCookie: string
        loginProvider: 'google' | 'facebook'
        isFacebookConnected: boolean
        isGoogleConnected: boolean
        isMobileConnectActivated: boolean
        email: string
        id: number
        cookieId: null
        mobilePhoneNumberFull: null
        optInEmail: boolean
        optInSms: boolean
        totalRewardAmount: null
      }>({
        axiosOptions: {
          url: 'api/account/socialLogin',
          method: 'post',
          data: {
            appName: process.env.APP_NAME,
            scopeCode: process.env.SCOPE_CODE,
            scopeName: process.env.SCOPE_NAME,
            providerName,
            accessToken,
            returnUrl: '',
          },
        },
      })

      return externalLogin
    },
  })
}
