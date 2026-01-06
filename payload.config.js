import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const Users = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'İsim',
    },
  ],
}

const Media = {
  slug: 'media',
  upload: true,
  admin: {
    useAsTitle: 'filename',
  },
  access: {
    read: () => true,
  },
  fields: [],
}

const Pages = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'Slug',
      admin: {
        description: 'e.g.: home, about, contact, etc.',
      },
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Head Title',
    },
    {
      name: 'showSearchEngine',
      type: 'checkbox',
      label: 'Arama Motoru Gösterilsin mi?',
      defaultValue: false,
      admin: {
        description: 'Sayfanın en üstünde arama motoru gösterilsin mi?',
      },
    },
    {
      name: 'searchEngineType',
      type: 'select',
      label: 'Arama Motoru Tipi',
      required: false,
      admin: {
        condition: (data) => data.showSearchEngine === true,
        description: 'Hangi arama motoru gösterilecek?',
      },
      options: [
        {
          label: 'Otel',
          value: 'otel',
        },
        {
          label: 'Tur',
          value: 'tur',
        },
      ],
    },
    {
      name: 'searchEngineBackgroundImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Arama Motoru Arka Plan Resmi',
      required: false,
      admin: {
        condition: (data) => data.showSearchEngine === true,
        description: 'Arama motorunun arka planında gösterilecek resim',
      },
    },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Layout',
      required: false,
      blocks: [
        {
          slug: 'themeCards',
          labels: {
            singular: 'Theme Cards',
            plural: 'Theme Cards',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: false,
            },
            {
              name: 'cards',
              type: 'array',
              label: 'Cards',
              minRows: 1,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Card Title',
                  required: true,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Image',
                  required: false,
                },
                {
                  name: 'location',
                  type: 'text',
                  label: 'Location',
                  required: false,
                },
                {
                  name: 'tag',
                  type: 'text',
                  label: 'Tag',
                  required: false,
                  admin: {
                    description: 'e.g.: New, Popular, Offer, Ay, İndirim',
                  },
                },
                {
                  name: 'price',
                  type: 'text',
                  label: 'Fiyat',
                  required: false,
                  admin: {
                    description: 'e.g.: ₺1.500,00',
                  },
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'URL',
                  required: false,
                  admin: {
                    description: 'Product detail page URL',
                  },
                },
                {
                  name: 'active',
                  type: 'checkbox',
                  label: 'Aktif',
                  defaultValue: true,
                },
              ],
            },
            {
              name: 'isActive',
              type: 'checkbox',
              label: 'Block Aktif',
              defaultValue: true,
            },
          ],
        },
        {
          slug: 'storySlider',
          labels: {
            singular: 'Story Slider',
            plural: 'Story Sliders',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: false,
            },
            {
              name: 'showAllButton',
              type: 'checkbox',
              label: 'Show All Button',
              defaultValue: true,
            },
            {
              name: 'allButtonLink',
              type: 'text',
              label: 'All Button Link',
              required: false,
              defaultValue: '/kampanyalar',
              admin: {
                description: 'e.g.: /kampanyalar',
              },
            },
            {
              name: 'allButtonText',
              type: 'text',
              label: 'All Button Text',
              required: false,
              defaultValue: 'View All Campaigns',
            },
            {
              name: 'items',
              type: 'array',
              label: 'Items',
              minRows: 1,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Item Title',
                  required: true,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Image',
                  required: false,
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'URL',
                  required: false,
                  admin: {
                    description: 'Item detail page URL',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                  required: false,
                  admin: {
                    description: 'On hover panel description',
                  },
                },
                {
                  name: 'buttonText',
                  type: 'text',
                  label: 'Button Text',
                  required: false,
                  admin: {
                    description: 'On hover panel button text',
                  },
                },
                {
                  name: 'active',
                  type: 'checkbox',
                  label: 'Aktif',
                  defaultValue: true,
                },
              ],
            },
            {
              name: 'isActive',
              type: 'checkbox',
              label: 'Block Aktif',
              defaultValue: true,
            },
          ],
        },
        {
          slug: 'holidayThemes',
          labels: {
            singular: 'Holiday Themes',
            plural: 'Holiday Themes',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: false,
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              required: false,
              admin: {
                description: 'Description text (appears below the title)',
              },
            },
            {
              name: 'items',
              type: 'array',
              label: 'Items',
              minRows: 1,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Item Title',
                  required: true,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Image',
                  required: false,
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'URL',
                  required: false,
                  admin: {
                    description: 'Item detail page URL',
                  },
                },
                {
                  name: 'active',
                  type: 'checkbox',
                  label: 'Aktif',
                  defaultValue: true,
                },
              ],
            },
            {
              name: 'isActive',
              type: 'checkbox',
              label: 'Block Aktif',
              defaultValue: true,
            },
          ],
        },
        {
          slug: 'trendRegions',
          labels: {
            singular: 'Trend Regions',
            plural: 'Trend Regions',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: false,
            },
            {
              name: 'items',
              type: 'array',
              label: 'Regions',
              minRows: 1,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Region Title',
                  required: true,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Image',
                  required: true,
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'URL',
                  required: false,
                  admin: {
                    description: 'Region detail page URL',
                  },
                },
                {
                  name: 'active',
                  type: 'checkbox',
                  label: 'Aktif',
                  defaultValue: true,
                },
              ],
            },
            {
              name: 'isActive',
              type: 'checkbox',
              label: 'Block Aktif',
              defaultValue: true,
            },
          ],
        },
        {
          slug: 'mainBanner',
          labels: {
            singular: 'Main Banner Carousel',
            plural: 'Main Banner Carousels',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: false,
              admin: {
                description: 'e.g.: Popular Tour Categories',
              },
            },
            {
              name: 'subtitle',
              type: 'text',
              label: 'Subtitle',
              required: false,
              admin: {
                description: 'e.g.: Categories (appears next to the title)',
              },
            },
            {
              name: 'slides',
              type: 'array',
              label: 'Slides',
              minRows: 1,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Slide Title',
                  required: true,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Image',
                  required: true,
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'URL',
                  required: false,
                  admin: {
                    description: 'Page URL to navigate when slide is clicked',
                  },
                },
                {
                  name: 'active',
                  type: 'checkbox',
                  label: 'Aktif',
                  defaultValue: true,
                },
              ],
            },
            {
              name: 'isActive',
              type: 'checkbox',
              label: 'Block Aktif',
              defaultValue: true,
            },
          ],
        },
        {
          slug: 'popularSearches',
          labels: {
            singular: 'Popular Searches Block',
            plural: 'Popular Searches Blocks',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: false,
              admin: {
                description: 'e.g.: Popular Searches Block Title',
              },
            },
            {
              name: 'items',
              type: 'array',
              label: 'Items',
              minRows: 1,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Item Title',
                  required: true,
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'URL',
                  required: false,
                  admin: {
                    description: 'Item detail page URL',
                  },
                },
                {
                  name: 'active',
                  type: 'checkbox',
                  label: 'Aktif',
                  defaultValue: true,
                },
              ],
            },
            {
              name: 'isActive',
              type: 'checkbox',
              label: 'Block Aktif',
              defaultValue: true,
            },
          ],
        },
        {
          slug: 'popularLinks',
          labels: {
            singular: 'Popular Links Block',
            plural: 'Popular Links Blocks',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: false,
              admin: {
                description: 'e.g.: Popular Routes',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              required: false,
              admin: {
                description: 'Description text to be displayed below the title',
              },
            },
            {
              name: 'menus',
              type: 'array',
              label: 'Menus',
              minRows: 1,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Menu Title',
                  required: true,
                  admin: {
                    description: 'Will appear as tab title',
                  },
                },
                {
                  name: 'ordering',
                  type: 'number',
                  label: 'Ordering',
                  required: true,
                  defaultValue: 0,
                  admin: {
                    description: 'Display order of menus (low to high)',
                  },
                },
                {
                  name: 'items',
                  type: 'array',
                  label: 'Links',
                  minRows: 1,
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      label: 'Link Title',
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
                    {
                      name: 'active',
                      type: 'checkbox',
                      label: 'Aktif',
                      defaultValue: true,
                    },
                  ],
                },
                {
                  name: 'active',
                  type: 'checkbox',
                  label: 'Aktif',
                  defaultValue: true,
                },
              ],
            },
            {
              name: 'isActive',
              type: 'checkbox',
              label: 'Block Aktif',
              defaultValue: true,
            },
          ],
        },
        {
          slug: 'videoPromo',
          labels: {
            singular: 'Video Promo Block',
            plural: 'Video Promo Blocks',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: false,
              admin: {
                description: 'Video promo title text',
              },
            },
            {
              name: 'text',
              type: 'textarea',
              label: 'Text',
              required: false,
              admin: {
                description: 'Additional text content',
              },
            },
            {
              name: 'backgroundImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Background Image',
              required: false,
              admin: {
                description: 'Background image for the video promo section',
              },
            },
            {
              name: 'videoUrl',
              type: 'text',
              label: 'Video URL',
              required: false,
              admin: {
                description:
                  'YouTube or other video embed URL (e.g., https://www.youtube.com/embed/VIDEO_ID)',
              },
            },
            {
              name: 'isActive',
              type: 'checkbox',
              label: 'Block Aktif',
              defaultValue: true,
            },
          ],
        },
        {
          slug: 'homeCampaigns',
          labels: {
            singular: 'Home Campaigns Block',
            plural: 'Home Campaigns Blocks',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Block Title',
              required: false,
              admin: {
                description: 'e.g.: Çağrı Merkezine Özel Kampanyalar',
              },
            },
            {
              name: 'campaigns',
              type: 'array',
              label: 'Campaigns',
              minRows: 1,
              maxRows: 4,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Image',
                  required: true,
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                  required: true,
                },
                {
                  name: 'subtitle',
                  type: 'text',
                  label: 'Subtitle',
                  required: false,
                  admin: {
                    description:
                      'e.g.: Hemen Keşfet!, Hemen Üye Ol, İndirimi Kaçırma!',
                  },
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'URL',
                  required: true,
                  admin: {
                    description: 'e.g.: /campaigns/new-members',
                  },
                },
                {
                  name: 'active',
                  type: 'checkbox',
                  label: 'Aktif',
                  defaultValue: true,
                },
              ],
            },
            {
              name: 'isActive',
              type: 'checkbox',
              label: 'Block Aktif',
              defaultValue: true,
            },
          ],
        },
        {
          slug: 'videoContents',
          labels: {
            singular: 'Video Contents Block',
            plural: 'Video Contents Blocks',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Block Title',
              required: false,
              admin: {
                description: 'e.g.: Video Contents Block Title',
              },
            },
            {
              name: 'contents',
              type: 'array',
              label: 'Contents',
              minRows: 1,
              maxRows: 4,
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Content Title',
                  required: true,
                },
                {
                  name: 'tag',
                  type: 'text',
                  label: 'Tag',
                  required: true,
                  admin: {
                    description: 'e.g.: New, Popular, Offer',
                  },
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Image',
                  required: true,
                },
                {
                  name: 'subtitle',
                  type: 'text',
                  label: 'Subtitle',
                  required: false,
                  admin: {
                    description: 'e.g.: Video Contents Subtitle',
                  },
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'Link URL',
                  required: true,
                  admin: {
                    description: 'e.g.: /video-contents/yeni-uyeler',
                  },
                },
                {
                  name: 'active',
                  type: 'checkbox',
                  label: 'Aktif',
                  defaultValue: true,
                },
              ],
            },
            {
              name: 'isActive',
              type: 'checkbox',
              label: 'Block Aktif',
              defaultValue: true,
            },
          ],
        },
        {
          slug: 'bottomSlider',
          labels: {
            singular: 'Bottom Slider Block',
            plural: 'Bottom Slider Blocks',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Block Title',
              required: false,
              admin: {
                description: 'Bottom slider block title (optional)',
              },
            },
            {
              name: 'video',
              type: 'upload',
              relationTo: 'media',
              label: 'Video',
              required: false,
              admin: {
                description:
                  'Video file (MP4, WebM etc.). Will be shown on the left.',
              },
            },
            {
              name: 'items',
              type: 'array',
              label: 'Carousel Items',
              minRows: 1,
              admin: {
                description: 'for images and links in Bottom slider block ',
              },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Image',
                  required: true,
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'URL',
                  required: false,
                  admin: {
                    description: 'Image click to go to the page URL',
                  },
                },
                {
                  name: 'active',
                  type: 'checkbox',
                  label: 'Aktif',
                  defaultValue: true,
                },
              ],
            },
            {
              name: 'isActive',
              type: 'checkbox',
              label: 'Block Aktif',
              defaultValue: true,
            },
          ],
        },
        {
          slug: 'landingGrid',
          labels: {
            singular: 'Landing Grid Block',
            plural: 'Landing Grid Blocks',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: false,
            },
            {
              name: 'items',
              type: 'array',
              label: 'Grid Items',
              minRows: 1,
              maxRows: 8,
              admin: {
                description: 'Maximum 8 items (2 rows x 4 columns)',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Item Title',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Description',
                  required: false,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Background Image',
                  required: true,
                },
                {
                  name: 'link',
                  type: 'text',
                  label: 'URL',
                  required: false,
                  admin: {
                    description: 'Link URL for the item',
                  },
                },
                {
                  name: 'active',
                  type: 'checkbox',
                  label: 'Aktif',
                  defaultValue: true,
                },
              ],
            },
            {
              name: 'isActive',
              type: 'checkbox',
              label: 'Block Aktif',
              defaultValue: true,
            },
          ],
        },
        {
          slug: 'landingContent',
          labels: {
            singular: 'Landing Content Block',
            plural: 'Landing Content Blocks',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: false,
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              required: false,
              admin: {
                description: 'Rich text content (supports bold, italic, etc.)',
              },
            },
            {
              name: 'isActive',
              type: 'checkbox',
              label: 'Block Aktif',
              defaultValue: true,
            },
          ],
        },
        {
          slug: 'landingFaq',
          labels: {
            singular: 'Landing FAQ Block',
            plural: 'Landing FAQ Blocks',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Title',
              required: false,
              defaultValue: 'Sıkça Sorulan Sorular',
            },
            {
              name: 'items',
              type: 'array',
              label: 'FAQ Items',
              minRows: 1,
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  label: 'Question',
                  required: true,
                },
                {
                  name: 'answer',
                  type: 'textarea',
                  label: 'Answer',
                  required: true,
                  admin: {
                    description: 'FAQ cevabı',
                  },
                },
                {
                  name: 'active',
                  type: 'checkbox',
                  label: 'Aktif',
                  defaultValue: true,
                },
              ],
            },
            {
              name: 'isActive',
              type: 'checkbox',
              label: 'Block Aktif',
              defaultValue: true,
            },
          ],
        },
        {
          slug: 'latestBlogs',
          labels: {
            singular: 'Latest Blogs Block',
            plural: 'Latest Blogs Blocks',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Block Title',
              required: false,
              admin: {
                description: 'e.g.: Son Blog Yazılarımız',
              },
            },
            {
              name: 'isActive',
              type: 'checkbox',
              label: 'Block Aktif',
              defaultValue: true,
            },
          ],
        },
        {
          slug: 'contactBlock',
          labels: {
            singular: 'Contact Block',
            plural: 'Contact Blocks',
          },
          fields: [
            {
              name: 'showContactForm',
              type: 'checkbox',
              label: 'İletişim Formu Göster',
              defaultValue: true,
              admin: {
                description: 'İletişim formu gösterilsin mi?',
              },
            },
            {
              name: 'showContactInfo',
              type: 'checkbox',
              label: 'İletişim Bilgileri Göster',
              defaultValue: true,
              admin: {
                description: 'İletişim bilgileri gösterilsin mi?',
              },
            },
            {
              name: 'addressLabel',
              type: 'text',
              label: 'Adres Etiketi',
              required: false,
              admin: {
                description: 'e.g.: Adres',
              },
            },
            {
              name: 'addressValue',
              type: 'textarea',
              label: 'Adres Değeri',
              required: false,
            },
            {
              name: 'callLabel',
              type: 'text',
              label: 'Telefon Etiketi',
              required: false,
              admin: {
                description: 'e.g.: Telefon',
              },
            },
            {
              name: 'callValue',
              type: 'text',
              label: 'Telefon Değeri',
              required: false,
              admin: {
                description: 'e.g.: 0850 840 01 51',
              },
            },
            {
              name: 'faxLabel',
              type: 'text',
              label: 'Faks Etiketi',
              required: false,
              admin: {
                description: 'e.g.: Faks',
              },
            },
            {
              name: 'faxValue',
              type: 'text',
              label: 'Faks Değeri',
              required: false,
            },
            {
              name: 'emailLabel',
              type: 'text',
              label: 'E-posta Etiketi',
              required: false,
              admin: {
                description: 'e.g.: E-posta',
              },
            },
            {
              name: 'emailValue',
              type: 'text',
              label: 'E-posta Değeri',
              required: false,
              admin: {
                description: 'e.g.: info@gezibank.com',
              },
            },
            {
              name: 'mapHtml',
              type: 'textarea',
              label: 'Harita HTML',
              required: false,
              admin: {
                description: 'Google Maps embed HTML kodu',
              },
            },
            {
              name: 'isActive',
              type: 'checkbox',
              label: 'Block Aktif',
              defaultValue: true,
            },
          ],
        },
        {
          slug: 'tourCalendarBlock',
          labels: {
            singular: 'Tour Calendar Block',
            plural: 'Tour Calendar Blocks',
          },
          fields: [
            {
              name: 'tours',
              type: 'array',
              label: 'Turlar',
              minRows: 1,
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Tur Resmi',
                  required: false,
                  admin: {
                    description: 'Tur kartında gösterilecek resim',
                  },
                },
                {
                  name: 'title',
                  type: 'text',
                  label: 'Tur Başlığı',
                  required: true,
                },
                {
                  name: 'tag',
                  type: 'text',
                  label: 'Tag (Çıkış Yeri)',
                  required: false,
                  admin: {
                    description: 'Örn: Ankara Çıkışlı, İstanbul Çıkışlı',
                  },
                },
                {
                  name: 'startDate',
                  type: 'text',
                  label: 'Giriş Tarihi',
                  required: true,
                  admin: {
                    description: 'Format: DD MMMM YYYY (örn: 15 Mart 2026)',
                  },
                },
                {
                  name: 'endDate',
                  type: 'text',
                  label: 'Çıkış Tarihi',
                  required: true,
                  admin: {
                    description: 'Format: DD MMMM YYYY (örn: 18 Mart 2026)',
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'Tur URL',
                  required: false,
                  admin: {
                    description:
                      'Kartın tıklanınca gideceği URL (örn: /tur/detail/kapadokya)',
                  },
                },
                {
                  name: 'addButton',
                  type: 'checkbox',
                  label: 'Buton Ekle',
                  defaultValue: false,
                  admin: {
                    description: 'Bu tur için buton eklemek istiyor musunuz?',
                  },
                },
                {
                  name: 'buttons',
                  type: 'array',
                  label: 'Butonlar',
                  admin: {
                    condition: (data, siblingData) => {
                      return siblingData?.addButton === true
                    },
                  },
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      label: 'Buton Metni',
                      required: true,
                    },
                    {
                      name: 'url',
                      type: 'text',
                      label: 'Buton URL',
                      required: true,
                      admin: {
                        description: 'Örn: /tur veya https://example.com',
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'isActive',
              type: 'checkbox',
              label: 'Block Aktif',
              defaultValue: true,
            },
          ],
        },
        {
          slug: 'emptyContent',
          labels: {
            singular: 'Empty Content',
            plural: 'Empty Contents',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              label: 'Başlık',
              required: false,
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Açıklama',
              required: false,
            },
            {
              name: 'isActive',
              type: 'checkbox',
              label: 'Block Aktif',
              defaultValue: true,
            },
          ],
        },
      ],
    },
    {
      name: 'metaTitle',
      type: 'text',
      label: 'Meta Title',
    },
    {
      name: 'metaDescription',
      type: 'textarea',
      label: 'Meta Description',
    },
  ],
}

const CampaignCategories = {
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

const Campaigns = {
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

const Blogs = {
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

const Search = {
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

const TourDetail = {
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

const Globals = {
  header: {
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
  },
  footer: {
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
  },
}

export default buildConfig({
  admin: {
    user: Users.slug,
    routes: {
      admin: '/admin',
    },
    css: path.resolve(dirname, 'src/app/(payload)/custom.scss'),
    components: {
      graphics: {
        Logo: '@/components/Admin/logo#Logo',
      },
    },
  },
  collections: [
    Users,
    Media,
    Pages,
    CampaignCategories,
    Campaigns,
    Blogs,
    Search,
    TourDetail,
  ],
  globals: [Globals.header, Globals.footer],
  secret: process.env.PAYLOAD_SECRET || 'dev-secret',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  plugins: [
    s3Storage({
      collections: {
        media: {
          prefix: process.env.S3_PREFIX || 'media',
          generateFileURL: (args) => {
            if (process.env.S3_CDN_URL) {
              return `${process.env.S3_CDN_URL}/${process.env.S3_BUCKET}/${args.prefix}/${args.filename}`
            }
            return args.url || ''
          },
        },
      },
      bucket: process.env.S3_BUCKET || '',
      config: {
        forcePathStyle: true,
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
        },
        region: process.env.S3_REGION || 'us-east-1',
        ...(process.env.S3_ENDPOINT && {
          endpoint: process.env.S3_ENDPOINT,
          bucketEndpoint: false,
          disableHostPrefix: true,
        }),
      },
    }),
  ],
  sharp,
})
