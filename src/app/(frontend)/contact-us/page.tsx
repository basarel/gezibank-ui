import { notFound } from 'next/navigation'
import { InfoPagesLayout } from '@/components/info-pages-layout'
import { getPageBySlug } from '@/libs/payload'
import { RenderBlocks } from '@/blocks/RenderBlocks'

export default async function ContactPage() {
  const page = await getPageBySlug('iletisim')

  if (!page) return notFound()

  const blocks = page?.layout || []
  return (
    <InfoPagesLayout>
      {blocks && Array.isArray(blocks) && blocks.length > 0 && (
        <RenderBlocks blocks={blocks} />
      )}
    </InfoPagesLayout>
  )
}
