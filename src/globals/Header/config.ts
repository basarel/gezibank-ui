import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
  label: 'Header',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'menuItems',
      type: 'array',
      label: 'Menu Items',
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Title',
          required: true,
          admin: {
            description: 'e.g.: Domestic Tours, International Tours',
          },
        },
        {
          name: 'slug',
          type: 'text',
          label: 'Slug',
          required: false,
          admin: {
            description:
              "Menu item'a tıklandığında gidilecek sayfa slug'ı (opsiyonel). Eğer slug varsa, dropdown açılmaz ve direkt sayfaya gider.",
          },
        },
        {
          name: 'content',
          type: 'textarea',
          label: 'Content',
          required: false,
          admin: {
            description: 'the content going to show under title',
          },
        },
        {
          name: 'columns',
          type: 'array',
          label: 'Columns',
          minRows: 1,
          maxRows: 4,
          admin: {
            description:
              'İlk kolon sol tarafta, diğer 3 kolon sağ tarafta gösterilir (toplam 4 kolon: 1 sol + 3 sağ)',
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Column Image',
              required: false,
              admin: {
                description: 'Image for the column',
              },
            },
            {
              name: 'columnTitle',
              type: 'text',
              label: 'Column Title',
              required: false,
              admin: {
                description: 'e.g.: Featured, Popular Areas',
              },
            },
            {
              name: 'links',
              type: 'array',
              label: 'Links',
              minRows: 1,
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Link Text',
                  required: true,
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'URL',
                  required: false,
                  admin: {
                    description: 'e.g.: /tours/domestic',
                  },
                },
              ],
            },
          ],
        },
        {
          name: 'bottomContents',
          type: 'array',
          label: 'Bottom Contents',
          required: false,
          maxRows: 4,
          admin: {
            description:
              'Alt kısımda gösterilecek içerikler (maksimum 4 adet)',
          },
          fields: [
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Image',
              required: true,
              admin: {
                description: 'Kart için resim',
              },
            },
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: true,
              admin: {
                description: 'Kart başlığı (e.g.: İstanbul Hareketli Turlar)',
              },
            },
            {
              name: 'link',
              type: 'text',
              label: 'Link URL',
              required: false,
              admin: {
                description: 'Karta tıklandığında gidilecek URL (opsiyonel)',
              },
            },
            {
              name: 'links',
              type: 'array',
              label: 'Links',
              required: false,
              admin: {
                description: 'Kart altında gösterilecek linkler (opsiyonel)',
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Link Text',
                  required: true,
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'URL',
                  required: false,
                  admin: {
                    description: 'e.g.: /tours/domestic',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
