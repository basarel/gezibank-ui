import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

export const Blogs: CollectionConfig = {
  slug: 'blogs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'active', 'createdAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Blog Başlığı',
      required: true,
      admin: {
        description: 'Blog başlığı (liste ve detay sayfasında gösterilir)',
      },
    },
    {
      name: 'slug',
      type: 'text',
      label: 'Slug',
      required: true,
      unique: true,
      admin: {
        description: 'URL için slug (e.g.: ilk-blog-yazim)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Blog Resmi',
      required: true,
      admin: {
        description: 'Liste ve detay sayfasında gösterilecek resim',
      },
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Blog İçeriği',
      required: true,
      editor: lexicalEditor({}),
      admin: {
        description: 'Blog detay açıklaması (detay sayfasında gösterilir)',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      label: 'Aktif',
      defaultValue: true,
    },
  ],
  timestamps: true,
}
