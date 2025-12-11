'use client'

import { Button, Collapse, LoadingOverlay, UnstyledButton } from '@mantine/core'
import { useState } from 'react'
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from 'react-icons/md'
import { CheckoutCard } from '@/components/card'
import { formatCurrency } from '@/libs/util'

type PriceItem = {
  label: string
  value: number
}

type IProps = {
  hotelPrice: number
  departureFlightPrice?: number
  returnFlightPrice?: number
  transferPrice?: number
  totalPrice?: number
  onCheckout?: () => void
  loading?: boolean
  isLoading?: boolean
  buttonText?: string
  showButton?: boolean
}

const CyprusPriceCard: React.FC<IProps> = ({
  hotelPrice,
  departureFlightPrice,
  returnFlightPrice,
  transferPrice,
  totalPrice,
  onCheckout,
  loading = false,
  isLoading = false,
  buttonText = 'Ödemeye İlerle',
  showButton = true,
}) => {
  const [openedPriceDetails, setOpenedPriceDetails] = useState(false)

  const calculatedTotal =
    hotelPrice +
    (departureFlightPrice ?? 0) +
    (returnFlightPrice ?? 0) +
    (transferPrice ?? 0)
  const priceItems: PriceItem[] = [
    { label: 'Otel Fiyatı', value: hotelPrice },
    departureFlightPrice && departureFlightPrice > 0
      ? { label: 'Gidiş Uçak Fiyatı', value: departureFlightPrice }
      : null,
    returnFlightPrice && returnFlightPrice > 0
      ? { label: 'Dönüş Uçak Fiyatı', value: returnFlightPrice }
      : null,
    transferPrice && transferPrice > 0
      ? { label: 'Transfer Fiyatı', value: transferPrice }
      : null,
  ].filter(Boolean) as PriceItem[]

  return (
    <div className='relative'>
      <LoadingOverlay visible={isLoading} />
      <CheckoutCard className='mb-3'>
        <UnstyledButton
          className='flex w-full items-center justify-between'
          onClick={() => setOpenedPriceDetails(!openedPriceDetails)}
        >
          <div className='flex items-center gap-1'>
            <span className='font-semibold'>Toplam Tutar</span>
            <span className='text-xl'>
              {openedPriceDetails ? (
                <MdKeyboardArrowUp />
              ) : (
                <MdKeyboardArrowDown />
              )}
            </span>
          </div>
          <div className='text-lg font-semibold'>
            {formatCurrency(calculatedTotal)}
          </div>
        </UnstyledButton>
        <Collapse in={openedPriceDetails}>
          <div className='grid gap-2 border-t pt-3 text-sm'>
            {priceItems.map((item, index) => (
              <div key={index} className='flex items-center justify-between'>
                <div>{item.label}</div>
                <div className='font-semibold'>
                  {formatCurrency(item.value)}
                </div>
              </div>
            ))}
          </div>
        </Collapse>
        {showButton && onCheckout && (
          <div className='border-t'>
            <Button
              type='button'
              onClick={onCheckout}
              fullWidth
              size='lg'
              loading={loading}
            >
              {buttonText}
            </Button>
          </div>
        )}
      </CheckoutCard>
    </div>
  )
}

export { CyprusPriceCard }
