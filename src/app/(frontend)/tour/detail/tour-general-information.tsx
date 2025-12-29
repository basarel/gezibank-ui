'use client'

import React from 'react'
import { TourDetailApiResponse } from '@/modules/tour/type'
import { Button, Modal, Tooltip, UnstyledButton } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { FaBus, FaCheck } from 'react-icons/fa'
import { RiInformationLine, RiPlaneFill } from 'react-icons/ri'
import { IoClose } from 'react-icons/io5'

type IPrps = {
  data: TourDetailApiResponse
  transportTypeText: string
}

const parseHtmlToListItems = (
  html: string,
  isIncluded: boolean = true
): React.ReactNode => {
  if (!html) {
    return null
  }

  const Icon = isIncluded ? FaCheck : IoClose
  const iconColor = isIncluded ? 'text-green-600' : 'text-red-600'

 
  if (html.includes('<ul>') || html.includes('<li>')) {
     const liPattern = /<li[^>]*>(.*?)<\/li>/gi
    const matches = Array.from(html.matchAll(liPattern))

    if (matches.length > 0) {
      return (
        <ul className='list-none space-y-2 ml-4'>
          {matches.map((match, index) => (
            <li key={index} className='flex items-start gap-2'>
              <Icon size={19} className={`${iconColor} shrink-0 mt-0.5`} />
              <span dangerouslySetInnerHTML={{ __html: match[1] }} />
            </li>
          ))}
        </ul>
      )
    }
  }

 
  const items = html.split(/<br\s*\/?>/i).filter((item) => item.trim())

  if (items.length > 1) {
    return (
      <ul className='list-none space-y-2'>
        {items.map((item, index) => (
          <li key={index} className='flex items-start gap-2'>
            <Icon size={16} className={`${iconColor} shrink-0 mt-0.5`} />
            <span dangerouslySetInnerHTML={{ __html: item.trim() }} />
          </li>
        ))}
      </ul>
    )
  }

   if (items.length === 1) {
    return (
      <div className='flex items-start gap-2'>
        <Icon size={16} className={`${iconColor} shrink-0 mt-0.5`} />
        <span dangerouslySetInnerHTML={{ __html: items[0].trim() }} />
      </div>
    )
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} />
}

export const TourGeneralInformation: React.FC<IPrps> = ({
  data,
  transportTypeText,
}) => {
  const [opened, { open, close }] = useDisclosure(false)
  const transportTypeIcon =
    transportTypeText === 'Uçaklı Tur' ? (
      <RiPlaneFill size={20} className='shrink-0 text-blue-700' />
    ) : (
      <FaBus size={20} className='shrink-0 text-blue-700' />
    )
  return (
    <div>
      <div className='flex flex-col gap-20'>
        <div className='grid items-center gap-3'>
          <span
            id='included-information'
            className='text-lg font-semibold text-blue-600 md:text-2xl'
          >
            Fiyata Dahil Hizmetler
          </span>
          {parseHtmlToListItems(data.detail.includedInformation || '', true)}
        </div>

        <div className='grid items-center gap-3'>
          <span
            id='not-included-information'
            className='text-lg font-semibold text-blue-600 md:text-2xl'
          >
            Fiyata Dahil Olmayan Hizmetler & Önemli Notlar
          </span>
          <div className='my-5'>
            {parseHtmlToListItems(
              data.detail.notIncludedInformation || '',
              false
            )}
          </div>
        </div>

        {data.detail.flightInformation !== null &&
          data.detail.flightInformation !== undefined &&
          data.detail.flightInformation.length > 0 && (
            <>
              <div className='flex flex-col gap-5'>
                <span
                  id='transport'
                  className='text-lg font-semibold text-blue-600 md:text-2xl'
                >
                  Ulaşım Bilgisi
                </span>
                <div className='grid gap-4'>
                  {data.detail.flightInformation
                    .filter(
                      (flight) =>
                        flight &&
                        typeof flight === 'string' &&
                        flight.trim().length > 0 &&
                        flight.trim() !== '0'
                    )
                    .map((flight, flightIndex) => (
                      <div key={flightIndex}>
                        <div dangerouslySetInnerHTML={{ __html: flight }} />
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        {(!data.detail.flightInformation ||
          data.detail.flightInformation === null ||
          data.detail.flightInformation === undefined ||
          data.detail.flightInformation.length === 0) &&
          transportTypeText && (
            <>
              <div className='flex flex-col gap-5'>
                <span
                  id='transport'
                  className='text-lg font-semibold text-blue-600 md:text-2xl'
                >
                  Ulaşım Bilgisi
                </span>
                <div className='flex items-center gap-2'>
                  {transportTypeIcon}
                  <span className='text-base font-semibold text-orange-900 md:text-lg'>
                    {transportTypeText}
                  </span>
                </div>
              </div>
            </>
          )}
        {data.package.hotelInformations &&
        data.package.hotelInformations.length > 0 ? (
          <>
            <div className='flex flex-col gap-5'>
              <div className='grid items-center gap-3'>
                <span
                  id='hotel'
                  className='text-lg font-semibold text-blue-600 md:text-2xl'
                >
                  Otel Bilgisi
                </span>
                {data.package.hotelInformations.map(
                  (hotel, hotelIndex) =>
                    hotel.name && <div key={hotelIndex}>{hotel.name}</div>
                )}
              </div>
            </div>
          </>
        ) : data.package.description && data.package.description.length > 0 ? (
          <>
            <div className='flex flex-col gap-5'>
              <span
                id='hotel'
                className='text-lg font-semibold text-blue-600 md:text-2xl'
              >
                Otel Bilgisi
              </span>
              <div>
                <span
                  className='text-base font-semibold text-orange-900 md:text-lg'
                  dangerouslySetInnerHTML={{
                    __html: data.package.description,
                  }}
                />
              </div>
            </div>
          </>
        ) : null}
        <Tooltip label='Vize bilgileri için tıklayınız'>
        <div className='flex flex-col gap-3'>
          <div className='flex items-center gap-3'>
            <span
              id='visa-infos'
              className='text-lg flex items-center gap-2 cursor-pointer font-semibold text-blue-600 md:text-2xl'
              onClick={() => open()}
              role='button'
              tabIndex={0}
             >
              Vize Bilgileri
              <RiInformationLine size={20} />
            </span>
            </div>
          </div>
        </Tooltip>
      </div>
      <Modal
        opened={opened}
        onClose={close}
        title={
          <span className='text-lg font-semibold text-blue-600 md:text-2xl'>
            Vize Bilgileri
          </span>
        }
        size='lg'
        withCloseButton
      >
        <ul className='ml-4 list-inside list-disc space-y-2'>
          <li>
            Vize başvurusu için evrak talebinin (Otel, uçak rezervasyonu ve
            seyahat sigortası) vize randevu tarihinden en az 15 gün önce
            yapılması gerekmektedir. İlgili evrakların hazırlanması başvuru
            yapılacak ülkelere göre değiştiğinden, vize randevusu almadan önce
            mutlaka satış ekiplerimizden evrakların iletilmesiyle ilgili bilgi
            alınması ve buna göre vize randevusu alınması gerekmektedir.
            Acentemizin doğacak olumsuzluklardan dolayı herhangi bir
            sorumluluğu bulunmamaktadır.
          </li>
          <li>
            Yeşil pasaport sahibi misafirlerimizin pasaportlarının süresi
            dolması durumunda soğuk damga ile uzatma yapmamalarını ve
            yenilemelerini tavsiye ediyoruz. Uzatma yapılan pasaportlar birçok
            ülkede kabul görmemektedir. Acentamızın bu hususta bir sorumluluğu
            bulunmamaktadır.
          </li>
          <li>
            Yurt dışı çıkış fonu ücreti fiyatlarımıza dahil değildir. Çıkış
            harcının yolcular tarafından ödenmesi gerekmektedir.
          </li>
          <li>
            Tur dönüş tarihi esas alınmak şartıyla yolcunun en az 6 ay geçerli
            pasaportunun olması gerekmektedir.
          </li>
          <li>Pasaport alım tarihi 10 yıldan eski olmamalıdır.</li>
          <li>
            Vize talepleriniz için +90 (212) 368 4969 telefon numarasını
            arayarak bilgi alabilirsiniz.
          </li>
          <li>
            Acentemiz, misafirlerimiz ile konsolosluklar arasında aracı kurum
            olup, herhangi bir vize alım garantisi vermez. Konsolosluğun vize
            vermemesi acentemizin sorumluluğunda değildir.
          </li>
          <li>
            Vize başvurularının tur hareket tarihinden en az 3 ay öncesinde
            yapılması tavsiye edilir. Vize sürecinizin daha sağlıklı
            ilerleyebilmesi adına başvurunuzu tur kalkış tarihinden en az 3 ay
            öncesinde tamamlamanızı önemle tavsiye ediyoruz.
          </li>
          <li>
            Ziyaret edilen ülke Türk vatandaşlarına vize uygulayan bir ülke
            ise ilgili vizenin geçerli pasaportunuzda olması gerekmektedir.
            İptal edilmiş bir pasaporttaki vize geçerli bir vize dahi olsa, bu
            vize/pasaport ile seyahat edilememektedir. Acentemizin doğacak
            olumsuzluklardan dolayı herhangi bir sorumluluğu bulunmamaktadır.
          </li>
          <li>
            Gümrük geçişlerinde ve sınır kapılarında, pasaportunuza
            giriş-çıkış kaşesi basılabilmesi için, pasaportunuzda en az 6 boş
            sayfa olması gerekmektedir. Vize alınmış olması veya vize
            gerektirmeyen pasaporta sahip olunması, ülkeye giriş ve çıkış
            yapılabileceği anlamına gelmeyip, pasaport polisinin sizi ülkeye
            giriş izni vermeme veya ülkeden çıkarmama yetkisi bulunmaktadır.
            Acentemizin bu konuda herhangi bir sorumluluğu bulunmamaktadır.
          </li>
          <li>
            Türk vatandaşı olmayan ya da çifte vatandaşlığı olup da diğer ülke
            pasaportunu kullanarak tura katılacak olan misafirlerin; seyahat
            edilecek ülkenin, kullanacakları pasaporta uyguladığı vize
            prosedürünü ilgili konsolosluklara bizzat danışmaları
            gerekmektedir. Acentemizin doğacak olumsuzluklardan dolayı
            herhangi bir sorumluluğu bulunmamaktadır.
          </li>
          <li>
            Farklı bir ülkede oturum izni bulunan misafirlerin vize
            durumlarını, bağlı bulundukları konsolosluklara bizzat danışmaları
            gerekmektedir. Acentemizin doğacak olumsuzluklardan dolayı
            herhangi bir sorumluluğu bulunmamaktadır.
          </li>
          <li>
            Yırtılmış, yıpranmış veya benzeri tahribatlara uğramış pasaportlar
            ile seyahat edilememektedir.
          </li>
          <li>
            Evlilik sebebiyle soyadı değişen misafirlerin, evliliğin üzerinden
            3 aydan fazla süre geçtiyse pasaportunu değiştirmesi
            gerekmektedir. Ülkeden çıkış ve ilgili ülkelere giriş kuralları
            tamamen pasaport polisi insiyatifindedir.
          </li>
          <li>
            18 yaşından küçük bireylerin tek başlarına ya da anne ve babadan
            sadece bir tanesi ile seyahat etmesi durumunda hem anneden hem de
            babadan noter onaylı muvafakatname alması gerekmektedir.
          </li>
        </ul>
      </Modal>
    </div>
  )
}
