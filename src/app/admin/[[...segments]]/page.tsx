import { NextAdmin } from '@payloadcms/next/admin'
import config from '../../../../payload.config'
import { generatePageMetadata } from '@payloadcms/next/views'

export const generateMetadata = async ({
  params,
  searchParams,
}: {
  params: Promise<{ segments?: string[] }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  return generatePageMetadata({
    config,
    params: await params,
    searchParams: await searchParams,
  })
}

export default async function AdminPage({
  params,
}: {
  params: Promise<{ segments?: string[] }>
}) {
  const { segments } = await params
  const segmentsArray = segments || []

  return <NextAdmin config={config} segments={segmentsArray} />
}
