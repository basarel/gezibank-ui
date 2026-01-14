import type { CollectionConfig } from 'payload'

export const CampaignCategories: CollectionConfig = {
  slug: 'campaign-categories',
  labels: {
    singular: 'Campaign Category Title',
    plural: 'Campaign Categories Titles',
  },
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Kategori Başlığı',
      required: true,
      admin: {
        description: 'e.g.: Banka Kampanyaları, Tur Kampanyaları',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      admin: {
        description: 'e.g.: banka-kampanyalari, tur-kampanyalari',
      },
    },
    {
      name: 'ordering',
      type: 'number',
      label: 'Sıralama',
      required: true,
      defaultValue: 0,
      admin: {
        description: 'Görüntülenme sırası (düşükten yükseğe)',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Aktif',
      defaultValue: true,
    },
  ],
}
