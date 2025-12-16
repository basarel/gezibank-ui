import { formatCurrency } from '@/libs/util'
import { Button, Title, Divider } from '@mantine/core'
import {
  IoChevronForwardSharp,
  IoChevronUpSharp,
  IoChevronDownSharp,
} from 'react-icons/io5'
import { DetailResponseData } from '../type'
import { useState } from 'react'

type IProps = {
  detailItem: DetailResponseData['detailResponse']['items'][0]
  selectedExtraOptionPrice: number
  selectedInsurancePrice: number
  onCarSelect: () => void
  isLoading: boolean
}

const CarBottomSticky: React.FC<IProps> = ({
  detailItem,
  selectedExtraOptionPrice,
  selectedInsurancePrice,
  onCarSelect,
  isLoading,
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const totalPrice = detailItem?.totalPrice.value ?? 0
  const allTotalPrice =
    selectedExtraOptionPrice + selectedInsurancePrice + totalPrice

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className='fixed right-0 bottom-0 left-0 z-50 md:hidden'>
      {isExpanded && (
        <div className='space-y-2 rounded-t-lg border-4 border-b-0 bg-white p-4'>
          <div className='text-lg font-bold'>Fiyat Detayları</div>
          <div className='text-md flex items-center justify-between rounded-md bg-gray-300 p-3'>
            <div>Kartınızdan Çekilecek Tutar</div>
            <div className='font-semibold'>{formatCurrency(totalPrice)}</div>
          </div>
          {(selectedExtraOptionPrice || selectedInsurancePrice) > 0 && (
            <>
              <div className='text-md flex items-center justify-between rounded-md bg-gray-300 p-3'>
                <div>Ofiste Ödenecek Tutar</div>
                <div className='font-semibold'>
                  {formatCurrency(
                    selectedExtraOptionPrice + selectedInsurancePrice
                  )}
                </div>
              </div>
              <div>
                {detailItem.carExtraOption
                  .filter((item) => item.selected)
                  .map((item) => (
                    <div
                      key={item.code}
                      className='flex items-center justify-between text-sm font-bold text-gray-700'
                    >
                      <div className='px-4'>{item.name}</div>
                      <div>{formatCurrency(item.totalPrice.value)}</div>
                    </div>
                  ))}
                {detailItem.carInsurances
                  .filter((item) => item.selected)
                  .map((item) => (
                    <div
                      key={item.code}
                      className='flex items-center justify-between text-sm font-bold text-gray-600'
                    >
                      <div className='px-4'>{item.description}</div>
                      <div>{formatCurrency(item.totalPrice.value)}</div>
                    </div>
                  ))}
              </div>
            </>
          )}
          <Divider />
        </div>
      )}
      <div className='flex justify-between gap-2 rounded-t-lg bg-white px-4 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.3),0_-2px_4px_-2px_rgba(0,0,0,0.06)]'>
        <div
          className='grid cursor-pointer items-center justify-between'
          onClick={toggleExpanded}
        >
          <div className='flex items-center gap-2'>
            <div>Toplam Tutar</div>
            {isExpanded ? (
              <IoChevronDownSharp size={16} />
            ) : (
              <IoChevronUpSharp size={16} />
            )}
          </div>
          <div className='text-xl font-semibold'>
            {formatCurrency(allTotalPrice)}
          </div>
        </div>
        <Button
          onClick={onCarSelect}
          variant='default'
          size='md'
          className='bg-primary border-none text-white'
          radius={'md'}
          loading={isLoading}
        >
          Ödemeye İlerle
        </Button>
      </div>
    </div>
  )
}

export { CarBottomSticky }
