import type { CollectionConfig } from 'payload'

export const TourDetail: CollectionConfig = {
  slug: 'detail',
  labels: {
    singular: 'Tour Detail',
    plural: 'Tour Details',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'isActive'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
    readVersions: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Başlık',
      required: true,
      admin: {
        description: 'Admin panelde görünen başlık',
      },
    },
    {
      name: 'keywords',
      type: 'array',
      label: 'Anahtar Kelimeler',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'keyword',
          type: 'text',
          label: 'Anahtar Kelime',
          required: true,
          admin: {
            description:
              'Tur adında aranacak anahtar kelime (küçük harfli ve sade girilmelidir)',
          },
        },
      ],
      admin: {
        description:
          'Tur adında aranacak anahtar kelimeler (örn: kapadokya, balkan, italya)',
      },
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      label: 'YouTube Video URL',
      required: false,
      admin: {
        description:
          'YouTube embed edilebilir video linki (boş bırakılırsa video render edilmez)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Aktif',
      defaultValue: true,
      admin: {
        description: 'İçeriğin aktif / pasif kontrolü',
      },
    },
  ],
}
