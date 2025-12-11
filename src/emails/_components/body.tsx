import { EmailCard } from '@/components/order-components/email-card'
import { DEFAULT_THEME } from '@mantine/core'
import {
  Body,
  Column,
  Container,
  Html,
  Img,
  Link,
  pixelBasedPreset,
  Preview,
  Row,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import dayjs from 'dayjs'
import 'dayjs/locale/tr'

dayjs.locale('tr')

type IProps = {
  children: React.ReactNode
  previewText?: string
}

export const EmailBody: React.FC<IProps> = ({ children, previewText }) => {
  return (
    <Html>
      <Tailwind
        config={{
          presets: [pixelBasedPreset],
          darkMode: 'selector',
          theme: {
            colors: {
              black: '#000',
              white: '#fff',

              gray: { DEFAULT: '#DEE2E6' },
              green: {
                DEFAULT: DEFAULT_THEME.colors.green[0],
                100: DEFAULT_THEME.colors.green[1],
                200: DEFAULT_THEME.colors.green[2],
                300: DEFAULT_THEME.colors.green[3],
                400: DEFAULT_THEME.colors.green[4],
                500: DEFAULT_THEME.colors.green[5],
                600: DEFAULT_THEME.colors.green[6],
                700: DEFAULT_THEME.colors.green[7],
                800: DEFAULT_THEME.colors.green[8],
                900: DEFAULT_THEME.colors.green[9],
              },
              red: {
                DEFAULT: DEFAULT_THEME.colors.red[0],
                100: DEFAULT_THEME.colors.red[1],
                200: DEFAULT_THEME.colors.red[2],
                300: DEFAULT_THEME.colors.red[3],
                400: DEFAULT_THEME.colors.red[4],
                500: DEFAULT_THEME.colors.red[5],
                600: DEFAULT_THEME.colors.red[6],
                700: DEFAULT_THEME.colors.red[7],
                800: DEFAULT_THEME.colors.red[8],
                900: DEFAULT_THEME.colors.red[9],
              },
              blue: {
                DEFAULT: DEFAULT_THEME.colors.blue[0],
                100: DEFAULT_THEME.colors.blue[1],
                200: DEFAULT_THEME.colors.blue[2],
                300: DEFAULT_THEME.colors.blue[3],
                400: DEFAULT_THEME.colors.blue[4],
                500: DEFAULT_THEME.colors.blue[5],
                600: DEFAULT_THEME.colors.blue[6],
                700: DEFAULT_THEME.colors.blue[7],
                800: DEFAULT_THEME.colors.blue[8],
                900: DEFAULT_THEME.colors.blue[9],
              },
            },
            // borderRadius: {
            //   none: '0',
            //   sm: '.125rem',
            //   DEFAULT: '.25rem',
            //   lg: '.5rem',
            //   full: '9999px',
            // },
          },
        }}
      >
        <Body className='m-0 w-full bg-white font-sans leading-normal text-black'>
          {previewText && <Preview>{previewText}</Preview>}
          <div className='bg-white'>
            <Row>
              <Column align='center'>
                <Link href='https://www.gezibank.com/'>
                  <Img
                    src={
                      'https://paraflystatic.mncdn.com/7/Content/img/logo2x.png'
                    }
                    alt='Gezibank'
                    width={116}
                    className='mx-auto'
                  />
                </Link>
              </Column>
            </Row>
            <div className='h-[16px]'>&nbsp;</div>

            <Container
              style={{
                maxWidth: 900,
              }}
            >
              <Section className='bg-blue-600 p-2'>
                <Row>
                  <Column align='center'>
                    <table>
                      <tr>
                        <td className='px-[18px]'>
                          <Link
                            className='text-white'
                            href={`${process.env.SITE_URL}/ucak`}
                          >
                            Uçak
                          </Link>
                        </td>
                        <td className='px-[8px]'>
                          <Link
                            className='text-white'
                            href={`${process.env.SITE_URL}/otel`}
                          >
                            Otel
                          </Link>
                        </td>
                        <td className='px-[8px]'>
                          <Link
                            className='text-white'
                            href={`${process.env.SITE_URL}/arac`}
                          >
                            Araç
                          </Link>
                        </td>
                        <td className='px-[8px]'>
                          <Link
                            className='text-white'
                            href={`${process.env.SITE_URL}/tur`}
                          >
                            Tur
                          </Link>
                        </td>
                        <td className='px-[8px]'>
                          <Link
                            className='text-white'
                            href={`${process.env.SITE_URL}/otobus`}
                          >
                            Otobüs
                          </Link>
                        </td>
                        <td className='px-[8px]'>
                          <Link
                            className='text-white'
                            href={`${process.env.SITE_URL}/transfer`}
                          >
                            Transfer
                          </Link>
                        </td>
                      </tr>
                    </table>
                  </Column>
                </Row>
              </Section>
              <div className='h-[16px]'>&nbsp;</div>
              <Section>
                <Row>
                  <Column>{children}</Column>
                </Row>
              </Section>
              <div className='h-[16px]'>&nbsp;</div>
              <EmailCard title='Bilgilendirme'>
                <table cellPadding={4}>
                  <tr>
                    <td>
                      • Satın almış olduğunuz seyahatinizi iptal etmeniz
                      durumunda, Acente tarafından alınan hizmet bedeli iade
                      edilmemektedir.{' '}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      • Detaylı bilgi için haftanın her günü 09:00-18:00
                      saatleri arasında{' '}
                      <a href='tel:08508780400'>0850 878 0 400</a> nolu
                      telefondan Müşteri Hizmetlerimize ulaşabilirsiniz.{' '}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      • Muhasebe işlemleri için{' '}
                      <a href='mailto:muhasebe@ykmturizm.com.tr'>
                        muhasebe@ykmturizm.com.tr
                      </a>{' '}
                      mail adresinden detaylı bilgi alabilirsiniz.{' '}
                    </td>
                  </tr>
                </table>
                <div className='h-[16px]'>&nbsp;</div>
              </EmailCard>
              <div className='h-[16px]'>&nbsp;</div>

              <center>
                <Link href='https://whatsapp.com/channel/0029Vau83EmCRs1qIYPnNO0a'>
                  <Img src='https://ykmturizm.mncdn.com/11/Files/email/img/whatsp.png' />
                </Link>
              </center>

              <div className='h-[16px]'>&nbsp;</div>
              <Section className='text-center text-xs'>
                <Text className='mx-auto w-3/4'>
                  Gezibank.com sitesinin tüm seyahat hizmetleri Yeni GeziBank
                  tarafından verilmektedir.
                </Text>
                <Section width={'55%'}>
                  <div>
                    <strong>GeziBank</strong>
                  </div>
                  <div>
                    Adana Mah. Atatürk Bulvarı No:134/A, 06760 Çankaya / Ankara
                  </div>
                  <div> Mersis No: 0948006409700018 </div>
                </Section>
              </Section>
            </Container>
          </div>
        </Body>
      </Tailwind>
    </Html>
  )
}
