import { Title, Button, Alert } from '@mantine/core'
import { Link } from 'next-view-transitions'
import { FaExclamationTriangle } from 'react-icons/fa'

export default async function BookErrorPage() {
  return (
    <div className='flex flex-col items-center gap-6 rounded-md py-4 md:px-10 md:py-10'>
      <Alert color='red' variant='light' className='grid w-full gap-3'>
        <div className='flex justify-center'>
          <FaExclamationTriangle
            size={44}
            className='text-red-700'
            color='red'
          />
        </div>
        <div className='flex flex-col gap-4 text-center'>
          <Title order={2} size='h2' className='text-red-700'>
            Rezervasyon İşleminizde Sorun Oluştu
          </Title>
          <p className='text-lg text-gray-700'>
            Üzgünüz, geçici bir hata oluştu. Lütfen birkaç dakika sonra tekrar
            deneyiniz.
          </p>
          <div className='mt-4 flex flex-col justify-center gap-3 sm:flex-row'>
            <Button
              component={Link}
              href='/'
              size='lg'
              variant='filled'
              color='blue'
            >
              Ana Sayfa
            </Button>
            <Button
              component={Link}
              href='/iletisim'
              size='lg'
              variant='outline'
              color='blue'
            >
              Destek İletişim
            </Button>
          </div>
        </div>
      </Alert>

      <div className='text-md mt-4 text-center text-gray-700'>
        <p>
          Sorun devam ederse, lütfen destek için{' '}
          <a href='tel:08508780400' className='text-blue-600 hover:underline'>
            0850 840 01 51
          </a>{' '}
          numaralı müşteri hizmetlerimizle iletişime geçin.
        </p>
      </div>
    </div>
  )
}
