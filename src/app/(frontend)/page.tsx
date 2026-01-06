import { Container, Title } from '@mantine/core'
import Image from 'next/image'
import { SearchEngine } from '@/components/search-engine/'
import { CallFormDrawer } from '@/components/call-form/CallFormDrawer'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { getPageBySlug } from '@/libs/payload'
import { EbultenForm } from '@/components/home/ebulten-form'

export default async function Home() {
  const page = await getPageBySlug('home')
  const blocks = page?.layout || []
  return (
    <div className='flex flex-col gap-10 md:gap-20'>
      <div className='relative'>
        <Image
          src='/engine-bg.png'
          fill
          alt='GeziBank'
          priority
          className='absolute top-0 left-0 -z-50 hidden h-full w-full object-cover md:block'
          style={{
            clipPath: 'ellipse(90% 90% at 50% 00%)',
          }}
        />
        <div
          className='absolute top-0 left-0 -z-40 hidden h-full w-full bg-black/30 md:block'
          style={{
            clipPath: 'ellipse(90% 90% at 50% 00%)',
          }}
        />
        <div className='absolute top-0 right-0 m-1 hidden rounded bg-gray-200 p-1 text-center text-xs opacity-85 md:flex'>
          CRASSULA TURİZM SEYAHAT ACENTASI Belge No: 15092
        </div>
        <div>
          <Container className='px-0 md:px-4 md:pt-[208px]'>
            <Title
              className='hidden text-center font-medium text-white md:mb-20 md:block'
              style={{
                fontSize: '36px',
                textShadow:
                  '2px 2px 4px rgba(0, 0, 0, 0.8), 0px 10px 20px rgba(0, 0, 0, 0.6), 0px 0px 10px rgba(0, 0, 0, 0.8)',
              }}
            >
              GeziBank ile Tatilin keyfini çıkarın!
            </Title>
            <div className='mb-1 rounded bg-gray-200 p-1 py-2 text-center text-xs opacity-85 md:hidden'>
              CRASSULA TURİZM SEYAHAT ACENTASI Belge No: 15092
            </div>
            <div className='z-50 mx-auto bg-white shadow-lg md:rounded-lg md:border'>
              <SearchEngine />
            </div>
          </Container>
        </div>
      </div>

      {blocks && Array.isArray(blocks) && blocks.length > 0 && (
        <RenderBlocks blocks={blocks} />
      )}
      {/* <Container className='gap-7 md:gap-10'>
        <EbultenForm />
      </Container> */}
      <Container className='gap-7 md:gap-10'>
        <CallFormDrawer />
      </Container>
    </div>
  )
}
