import type { Access } from 'payload/types'

export const authenticated: Access = ({ req: { user } }) => {
  return Boolean(user)
}

