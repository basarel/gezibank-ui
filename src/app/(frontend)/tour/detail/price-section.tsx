import { NativeSelect, SimpleGrid, Title } from '@mantine/core'
import { range } from '@mantine/hooks'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  type PassengerFormTypes,
  passengerUpdateSchema,
  type TourDetailApiResponse,
} from '@/modules/tour/type'
import { formatCurrency } from '@/libs/util'
import clsx from 'clsx'

type Props = {
  data: TourDetailApiResponse
  calculatedTotalPrice: number
  onPassengerChange?: (passengers: PassengerFormTypes) => void
  loading: boolean
}
const TourDetailPriceSection: React.FC<Props> = ({
  onPassengerChange = () => null,
  calculatedTotalPrice = 0,
  loading = false,
}) => {
  const adultSelect = range(1, 3).map((value) => {
    return {
      label: `${value} Kişi`,
      value: `${value}:0`,
    }
  })

  const childAgeSelect = range(0, 12).map((value) => ({
    label: value === 0 ? `0-12 aylık` : `${value}`,
    value: '' + value,
  }))

  const passengerForm = useForm<PassengerFormTypes>({
    resolver: zodResolver(passengerUpdateSchema),
    mode: 'onChange',
    defaultValues: {
      adultCount: '2:0',
      childAge: ['-1'],
    },
  })

  const handlePassengerFormSubmit = (passengerFormData: PassengerFormTypes) => {
    onPassengerChange(passengerFormData)
  }

  return (
    <div className='relative'>
      <div className='grid gap-3'>
        <Title order={3} fz={'h2'} className='text-blue-600 md:text-2xl'>
          Tura katılacak Kişi Sayısı
        </Title>

        <form onSubmit={passengerForm.handleSubmit(handlePassengerFormSubmit)}>
          <SimpleGrid cols={2} pt={'md'}>
            <div>
              <Controller
                control={passengerForm.control}
                name='adultCount'
                render={({ field }) => (
                  <NativeSelect
                    size='lg'
                    {...field}
                    data={adultSelect}
                    label='Yetişkin'
                    disabled={loading}
                    onChange={(event) => {
                      const {
                        currentTarget: { value },
                      } = event
                      field.onChange(value)
                      handlePassengerFormSubmit({
                        adultCount: value,
                        childAge: passengerForm.getValues('childAge'),
                      })
                    }}
                  />
                )}
              />
            </div>
            <div>
              <Controller
                control={passengerForm.control}
                name={`childAge.${0}`}
                render={({ field }) => (
                  <NativeSelect
                    size='lg'
                    disabled={loading}
                    {...field}
                    data={[
                      { value: '-1', label: 'Çocuk Yok' },
                      ...childAgeSelect,
                    ]}
                    label='1. Çocuk Yaşı'
                    onChange={(event) => {
                      const {
                        currentTarget: { value },
                      } = event
                      field.onChange(value)
                      handlePassengerFormSubmit({
                        adultCount: passengerForm.getValues('adultCount'),
                        childAge: [value],
                      })
                    }}
                  />
                )}
              />
            </div>
          </SimpleGrid>
        </form>

        <div
          className={clsx(
            'flex justify-between pt-4 transition-all duration-300',
            {
              'opacity-60 blur-sm': loading || calculatedTotalPrice < 1,
              'blur-0 opacity-100': !loading && calculatedTotalPrice >= 1,
            }
          )}
        >
          <div>Toplam Tutar:</div>

          <div className='text-lg font-semibold'>
            {formatCurrency(calculatedTotalPrice)}
          </div>
        </div>
      </div>
    </div>
  )
}

export { TourDetailPriceSection }
