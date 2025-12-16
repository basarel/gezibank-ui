import { buildConfig } from 'payload'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor, BlocksFeature } from '@payloadcms/richtext-lexical'
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
      ],
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Content',
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
  editor: lexicalEditor(),
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
