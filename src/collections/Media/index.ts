import type { CollectionConfig } from 'payload/types'
import { publicAccess } from '@/access/public'
import { authenticated } from '@/access/authenticated'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: true,
  access: {
    read: publicAccess,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
    },
  ],
}

