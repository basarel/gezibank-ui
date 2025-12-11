'use client'
import { Drawer } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { FaCheck } from 'react-icons/fa'
import { IoMdInformationCircleOutline } from 'react-icons/io'
import { IoClose } from 'react-icons/io5'
import { PiHandCoins } from 'react-icons/pi'

type IProps = {
  themesPriceDiff: boolean
}

export const PriceDiff: React.FC<IProps> = ({ themesPriceDiff }) => {
  const [
    priceDiffDrawerOpened,
    { open: openPriceDiffDrawer, close: closePriceDiffDrawer },
  ] = useDisclosure(false)

  return (
    themesPriceDiff && (
      <>
        <div className='mb-2 flex items-center gap-1'>
          <div
            className='flex cursor-pointer items-center'
            onClick={openPriceDiffDrawer}
          >
            <PiHandCoins size={18} className='mr-2' />
            <div>Fiyat Farkı İade Garantisi</div>
            <IoMdInformationCircleOutline
              size={17}
              className='ms-2 cursor-pointer'
            />
          </div>
          <Drawer
            opened={priceDiffDrawerOpened}
            onClose={closePriceDiffDrawer}
            title={
              <div className='flex items-center gap-3 px-0'>
                <button
                  onClick={closePriceDiffDrawer}
                  className='rounded-r-xl bg-red-800 p-2 px-5 text-white'
                >
                  <IoClose color='white' />
                </button>
                <div className='mx-auto border-b-4 border-blue-600 pb-2 text-lg font-bold'>
                  Fiyat Farkı İade Garantisi
                </div>
              </div>
            }
            position='right'
            size='xl'
            radius='lg'
            classNames={{
              header: 'px-0 py-5',
            }}
            closeButtonProps={{
              style: { display: 'none' },
            }}
          >
            <div>
              <ul className='list-disc space-y-2 pl-5'>
                <li>
                  ParaflyTravel &quot;Fiyat Farkı İade Garantisi&quot; ibaresi
                  ile satışa sunduğu otellerde, misafirlerin konaklama yapacağı
                  tarihten önce misafirin satın aldığı tutarı olumsuz yönde
                  etkileyecek şekilde, ParaflyTravel.com sitesi üzerinde bir
                  fiyat farkı oluşur ise, aradaki fiyat farkını iade eder.
                </li>
                <li>
                  Fiyat Farkı İade Garantisinin müşteri nezdinde geçerli
                  olabilmesi ve iade hakkının olabilmesi için; 1 Nisan 2025 – 30
                  Kasım 2025 tarihleri arasında yapılacak konaklamalar için
                  geçerlidir.
                </li>
                <li>
                  Fiyat Farkı İade Garantisi ibaresini taşıyan ürünlerde,
                  ParaflyTravel’dan (web sitesi, call center, yetkili satış
                  acentesi üzerinden) satın alınan bu ürün ile ilgili satın alma
                  işleminin kaydı (rezervasyon/voucher) gerekmektedir.
                </li>
                <li>
                  Fiyat Farkı İade Garantisi misafirin aldığı aynı oda tipinde,
                  aynı kişi sayısında, aynı pansiyon tipinde, aynı otelde, aynı
                  tarih konaklaması için geçerlidir. Söz konusu fiyat farkının
                  ParaflyTravel internet sitesi üzerinde
                  görülebilir/ispatlanabilir olması gerekmektedir.
                </li>
                <li>
                  Fiyat Farkı İade Garantisi talebinin değerlendirilmesi için
                  misafirin rezervasyon numarası ile birlikte, site üzerinden
                  aynı oda tipinde, aynı kişi sayısında, aynı pansiyon tipinde,
                  aynı otelde, aynı tarihli konaklaması için ispat nitelikli
                  rezervasyon ödeme sayfasında güncel son fiyatın ekran
                  görüntüsü sunulması gerekmektedir.
                </li>
                <li>
                  Fiyat Farkı İade Garantisi, başka bir firmanın uygulamış
                  olduğu fiyat ve indirim durumlarında geçerli değildir.
                </li>
                <li>
                  Misafir rezervasyon işlemi tarihinden sonra aynı ürün için
                  uygulanacak banka kartı, ulaşım, transfer, indirim kuponu,
                  hediye çeki vb. ve tesise ait anlık promosyonel uygulamalar
                  Fiyat Farkı İade Garantisi kapsamına girmemektedir. Fiyat
                  Farkı İade Garantisi talepleri ancak konaklama tarihi
                  başlamadan geçerlidir. Konaklama tarihi başladıktan sonra
                  yapılacak talepler geçerli sayılmayacaktır.
                </li>
                <li>
                  Fiyat Farkı İade Talepleriniz için Müşteri İlişkileri
                  Departmanımıza yukarıdaki gereklilikler ile birlikte ulaşmanız
                  yeterlidir.
                </li>
              </ul>
            </div>
          </Drawer>
        </div>
      </>
    )
  )
}
