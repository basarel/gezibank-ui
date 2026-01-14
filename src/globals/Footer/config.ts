import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      label: 'Logo',
      required: false,
      admin: {
        description: 'Footer logo',
      },
    },
    {
      name: 'companyName',
      type: 'text',
      label: 'Şirket Adı',
      required: false,
      admin: {
        description: 'Örn: CRASSULA TURİZM SEYAHAT ACENTASI',
      },
    },
    {
      name: 'brandLicense',
      type: 'text',
      label: 'Marka/Lisans',
      required: false,
      admin: {
        description: 'Örn: GEZİBANK | BELGE NO: 15092',
      },
    },
    {
      name: 'address',
      type: 'text',
      label: 'Adres',
      required: false,
      admin: {
        description: 'Şirket adresi',
      },
    },
    {
      name: 'email',
      type: 'email',
      label: 'E-posta',
      required: false,
      admin: {
        description: 'İletişim e-postası',
      },
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Telefon',
      required: false,
      admin: {
        description: 'İletişim telefonu',
      },
    },
    {
      name: 'navigationColumns',
      type: 'array',
      label: 'Navigasyon Kolonları',
      minRows: 1,
      maxRows: 3,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Kolon Başlığı',
          required: false,
          admin: {
            description:
              'Örn: Bilgi Sayfaları, Kurumsal, Sosyal Medya (opsiyonel)',
          },
        },
        {
          name: 'links',
          type: 'array',
          label: 'Linkler',
          minRows: 1,
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Link Metni',
              required: false,
              admin: {
                description: 'Link metni (opsiyonel)',
              },
            },
            {
              name: 'url',
              type: 'text',
              label: 'URL',
              required: false,
              admin: {
                description: "Link URL'si (opsiyonel)",
              },
            },
            {
              name: 'image',
              type: 'upload',
              relationTo: 'media',
              label: 'Resim',
              required: false,
              admin: {
                description: 'Item için resim (opsiyonel)',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'paymentMethods',
      type: 'array',
      label: 'Ödeme Yöntemleri',
      required: false,
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Ödeme Yöntemi Adı',
          required: true,
          admin: {
            description: 'Örn: VISA, Mastercard, American Express, Troy',
          },
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          label: 'Logo',
          required: false,
        },
      ],
    },
    {
      name: 'copyrightText',
      type: 'text',
      label: 'Telif Hakkı Metni',
      required: false,
      admin: {
        description:
          'Örn: Gezibank bir Blk Group markasıdır © 2025 Tüm hakları saklıdır.',
      },
    },
    {
      name: 'blkGroupUrl',
      type: 'text',
      label: 'Blk Group URL',
      required: false,
      admin: {
        description: 'Blk Group linki (opsiyonel)',
      },
    },
  ],
}
