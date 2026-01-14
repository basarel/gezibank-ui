import { postgresAdapter } from '@payloadcms/db-postgres'
import sharp from 'sharp'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { s3Storage } from '@payloadcms/storage-s3'

import { Users } from './collections/Users/config'
import { Media } from './collections/Media/config'
import { Pages } from './collections/Pages/config'
import { CampaignCategories } from './collections/CampaignCategories/config'
import { Campaigns } from './collections/Campaigns/config'
import { Blogs } from './collections/Blogs/config'
import { Search } from './collections/Search/config'
import { TourDetail } from './collections/TourDetail/config'
import { Header } from './globals/Header/config'
import { Footer } from './globals/Footer/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      graphics: {
        Logo: '@/components/Admin/logo#Logo',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
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
  globals: [Header, Footer],
  secret: process.env.PAYLOAD_SECRET || '',
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
          generateFileURL: (args: { prefix?: string; filename: string }) => {
            if (process.env.S3_CDN_URL) {
              return `${process.env.S3_CDN_URL}/${process.env.S3_BUCKET}/${args.prefix}/${args.filename}`
            }
            return ''
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
