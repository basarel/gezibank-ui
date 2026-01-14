import type { CollectionConfig } from 'payload'

export const Search: CollectionConfig = {
  slug: 'search',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'active', 'ordering'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Başlık',
      required: true,
      admin: {
        description: 'Arama sayfası başlığı',
      },
    },
    {
      name: 'campaigns',
      type: 'array',
      label: 'Kampanyalar',
      minRows: 0,
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Kampanya Metni',
          required: true,
          admin: {
            description: 'Kampanya butonunda gösterilecek metin',
          },
        },
        {
          name: 'link',
          type: 'text',
          label: 'Kampanya Linki',
          required: true,
          admin: {
            description: 'Kampanya butonuna tıklandığında gidilecek URL',
          },
        },
        {
          name: 'viewCountry',
          type: 'select',
          label: 'Görüntüleme Ülkesi',
          required: true,
          options: [
            {
              label: 'Yurt İçi',
              value: '1',
            },
            {
              label: 'Yurt Dışı',
              value: '0',
            },
          ],
          admin: {
            description: 'Kampanyanın hangi turlarda gösterileceği',
          },
        },
        {
          name: 'active',
          type: 'checkbox',
          label: 'Aktif',
          defaultValue: true,
          admin: {},
        },
      ],
    },
    {
      name: 'loaderBanners',
      type: 'array',
      label: 'Loader Bannerlar',
      minRows: 0,
      fields: [
        {
          name: 'text',
          type: 'text',
          label: 'Banner Metni',
          required: false,
          admin: {
            description: 'Loader bannerında gösterilecek metin',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Banner Resmi',
          required: false,
          admin: {
            description: 'Loader bannerında gösterilecek resim',
          },
        },
        {
          name: 'viewCountry',
          type: 'select',
          label: 'Görüntüleme Ülkesi',
          required: true,
          options: [
            {
              label: 'Yurt İçi',
              value: '1',
            },
            {
              label: 'Yurt Dışı',
              value: '0',
            },
          ],
          admin: {
            description: 'Bannerın hangi turlarda gösterileceği',
          },
        },
        {
          name: 'active',
          type: 'checkbox',
          label: 'Aktif',
          defaultValue: true,
          admin: {},
        },
      ],
    },
    {
      name: 'copyText',
      type: 'text',
      label: 'Kopyalanacak Metin',
      required: false,
      admin: {
        description: 'Kopyalanacak kampanya kodu veya metni',
      },
    },
    {
      name: 'copyDescription',
      type: 'textarea',
      label: 'Açıklama (HTML)',
      required: false,
      admin: {
        description:
          'Kopyalama alanının yanında gösterilecek açıklama metni (HTML destekler)',
      },
    },
    {
      name: 'copyImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Kopyalama Alanı Görseli',
      required: false,
      admin: {
        description: 'Kopyalama alanında gösterilecek görsel',
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
