import { getPayload } from 'payload'
import config from '../../../../payload.config'
import { AdminLayout, generateMetadata } from '@payloadcms/next/views'

const payload = await getPayload({ config })

export default async function AdminPage({
  params,
}: {
  params: Promise<{ segments?: string[] }>
}) {
  const { segments } = await params
  const segmentsArray = segments || []

  return (
    <AdminLayout
      config={config}
      payload={payload}
      params={{
        segments: segmentsArray,
      }}
    />
  )
}

export { generateMetadata }
