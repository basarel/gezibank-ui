import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Campaigns: CollectionConfig = {
  slug: 'campaigns',
  labels: {
    singular: 'Campaign Content',
    plural: 'Campaign Contents',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'active', 'ordering'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Kampanya Başlığı',
      required: true,
      admin: {
        description: 'Kampanya başlığı (liste ve detay sayfasında gösterilir)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Kampanya Resmi',
      required: true,
      admin: {
        description: 'Liste sayfasında gösterilecek resim',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'campaign-categories',
      label: 'Kategori',
      required: true,
      admin: {
        description: 'Kampanyanın ait olduğu kategori',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Kampanya Detayı',
      required: false,
      editor: lexicalEditor({}),
      admin: {
        description: 'Kampanya detay açıklaması (detay sayfasında gösterilir)',
      },
    },
    {
      name: 'detailImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Detay Sayfası Resmi',
      required: false,
      admin: {
        description: 'Detay sayfasında gösterilecek resim (opsiyonel)',
      },
    },
    {
      name: 'discountCode',
      type: 'text',
      label: 'İndirim Kodu',
      required: false,
      admin: {
        description: 'Kampanya indirim kodu (opsiyonel)',
      },
    },
    {
      name: 'buttonText',
      type: 'text',
      label: 'Buton Metni',
      required: false,
      admin: {
        description: 'Detay sayfasında gösterilecek buton metni (opsiyonel)',
      },
    },
    {
      name: 'buttonLink',
      type: 'text',
      label: 'Buton Linki',
      required: false,
      admin: {
        description: 'Butona tıklandığında gidilecek URL (opsiyonel)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      admin: {
        description: 'URL için slug (e.g.: yeni-uyeler-kampanyasi)',
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
