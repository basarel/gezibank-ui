import { buildConfig } from 'payload/config'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { nextjsPlugin } from '@payloadcms/next'
import path from 'path'
import sharp from 'sharp'
import { Users } from './src/collections/Users'
import { Media } from './src/collections/Media'

const config = buildConfig({
  admin: {
    user: 'users',
    importMap: {
      baseDir: path.resolve(__dirname),
    },
    meta: {
      titleSuffix: '- GeziBank',
    },
  },
  collections: [Users, Media],
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
      max: 5,
      min: 0,
      idleTimeoutMillis: 60000,
      connectionTimeoutMillis: 20000,
      allowExitOnIdle: true,
    },
  }),
  plugins: [nextjsPlugin()],
  secret: process.env.PAYLOAD_SECRET || '',
  sharp,
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
})

export default config

