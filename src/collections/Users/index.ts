import type { CollectionConfig } from 'payload/types'
import { authenticated } from '@/access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  access: {
    read: authenticated,
    // create: Payload CMS auth collection'larında ilk kullanıcı oluşturma otomatik olarak izin verilir
    // Admin panel üzerinden ilk kullanıcı oluşturulabilir
    create: () => true, // İlk kullanıcı için izin ver (Payload CMS otomatik yönetir)
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
}

