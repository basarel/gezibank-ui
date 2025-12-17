import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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
                  name: 'price',
                  type: 'text',
                  label: 'Price',
                  required: true,
                  admin: {
                    description: 'e.g.: ₺1.500,00',
                  },
                },
                {
                  name: 'discountPrice',
                  type: 'text',
                  label: 'Discount Price',
                  required: false,
                  admin: {
                    description: 'e.g.: ₺1.200,00',
                  },
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
                    description: 'e.g.: New, Popular, Offer',
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
              ],
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
              ],
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
              ],
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
              ],
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
              ],
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
              ],
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
                  ],
                },
              ],
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
              ],
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
              ],
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
              ],
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
              ],
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
              ],
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
            name: 'showContent',
            type: 'checkbox',
            label: 'Show Content',
            defaultValue: false,
            admin: {
              description: 'is content show under title ?',
            },
          },
          {
            name: 'content',
            type: 'textarea',
            label: 'Content',
            required: false,
            admin: {
              condition: (data) => data.showContent === true,
              description: 'the content going to show under title',
            },
          },
          {
            name: 'columns',
            type: 'array',
            label: 'Columns',
            minRows: 1,
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
                  {
                    name: 'isActive',
                    type: 'checkbox',
                    label: 'Active',
                    defaultValue: false,
                    admin: {
                      description: 'Mark as active link',
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
}

export default buildConfig({
  admin: {
    user: Users.slug,
    routes: {
      admin: '/admin',
    },
  },
  collections: [Users, Media, Pages],
  globals: [Globals.header],
  secret: process.env.PAYLOAD_SECRET || 'dev-secret',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
})
