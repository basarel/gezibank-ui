import { cookies } from 'next/headers'

import NextAuth, { type DefaultSession } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import Google from 'next-auth/providers/google'
import Facebook from 'next-auth/providers/facebook'

declare module 'next-auth' {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    // user: Account & DefaultSession['user']
    user: {} & DefaultSession['user']
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
  trustHost: true,
  session: {
    maxAge: 1200,
  },
  callbacks: {
    async signIn(params) {
      const cookieStore = await cookies()
      const { account, profile, user } = params
      const providerName = account?.provider
      const isSocialLogin = providerName !== 'credentials'

      if (isSocialLogin) {
        if (providerName === 'google' && !profile?.email_verified) {
          return false
        }

        if (providerName === 'facebook' && !user.email) {
          return false
        }

        if (providerName) {
          cookieStore.set('login-provider', providerName, {
            secure: true,
            httpOnly: true,
          })
        }

        if (account?.access_token) {
          cookieStore.set('access_token', account?.access_token, {
            secure: true,
            httpOnly: true,
          })
        }
      }

      return true
    },
  },
  events: {
    signOut: async (params) => {
      const cookieStore = await cookies()
      cookieStore.delete('access_token')
      cookieStore.delete('login-provider')
      cookieStore.delete('CySvc')
    },
  },
  providers: [
    Credentials({
      authorize: async (credentials) => {
        if (!credentials || typeof credentials.name !== 'string') {
          return null
        }
        return { ...credentials }
      },
    }),
    Google,
    Facebook,
  ],
})
