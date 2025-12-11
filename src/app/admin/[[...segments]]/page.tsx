import { RootPage, generatePageMetadata } from '@payloadcms/next/views'
import config from '../../../../payload.config'
import path from 'path'

export default async function AdminPage({
  params,
  searchParams,
}: {
  params: Promise<{ segments?: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] }>
}) {
  const resolvedParams = await params
  const segments = resolvedParams?.segments || []

  return (
    <RootPage
      config={Promise.resolve(config)}
      importMap={{
        baseDir: path.resolve(process.cwd()),
      }}
      params={Promise.resolve({
        segments: Array.isArray(segments) ? segments : [segments].filter(Boolean),
      })}
      searchParams={searchParams}
    />
  )
}

export const generateMetadata = generatePageMetadata

