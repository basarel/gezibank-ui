import { Container } from '@mantine/core'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { getPageBySlug } from '@/libs/payload'
import { TourSearchEngine } from '@/modules/tour'

export default async function TourLandingPage() {
  const page = await getPageBySlug('landing')
  const blocks = page?.layout || []

  return (
    <div className='flex flex-col gap-4 md:gap-10'>
      <div className='relative border-b py-4'>
        <Container className='relative z-10'>
          <div className='rounded-md bg-white p-3 md:p-5'>
            <TourSearchEngine />
          </div>
        </Container>
      </div>

      {blocks && Array.isArray(blocks) && blocks.length > 0 ? (
        <RenderBlocks blocks={blocks} />
      ) : null}
    </div>
  )
}
