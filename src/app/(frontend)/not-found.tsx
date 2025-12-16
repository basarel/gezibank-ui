import NextImage from 'next/image'
import { Container, Title, Button } from '@mantine/core'
import { Link } from 'next-view-transitions'

export default function NotFound() {
  return (
    <Container className='py-12'>
      <div className='flex flex-col items-center justify-center gap-3 text-center'>
        <div className='mx-auto max-w-4xl'>
          <NextImage
            src={'/404.webp'}
            alt='Üzgünüz, aradığınız sayfa bulunamadı.'
            width={421}
            height={185}
          />
        </div>
        <Title mb={'md'}>Üzgünüz, aradığınız sayfa bulunamadı.</Title>
        <p className='text-lg'>
          Ulaşmaya çalıştığınız sayfa yayından kaldırılmış veya yanlış olabilir.
          Ana sayfadan kontrol edip tekrar deneyiniz.
        </p>
        <div>
          <Button component={Link} href='/' size='lg'>
            Ana Sayfa
          </Button>
        </div>
      </div>
    </Container>
  )
}
