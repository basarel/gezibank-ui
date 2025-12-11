import { useQueryStates } from 'nuqs'
import { useEffect, useState } from 'react'

import { formatCurrency } from '@/libs/util'
import { cyprusFilterSearchParams } from '@/modules/cyprus/searchParams'
import { Button, RangeSlider, TextInput } from '@mantine/core'

type IProps = {
  minPrice: number
  maxPrice: number
  defaultRanges: [number, number]
}

const CyprusPriceRangeSlider: React.FC<IProps> = ({
  minPrice,
  maxPrice,
  defaultRanges,
}) => {
  const [filterParams, setFilterParams] = useQueryStates(
    cyprusFilterSearchParams
  )

  const [values, setValues] = useState<[number, number]>([minPrice, maxPrice])

  useEffect(() => {
    if (!filterParams.priceRange) {
      setValues(defaultRanges)
    }
  }, [defaultRanges, filterParams])

  return (
    <>
      <RangeSlider
        className='px-2'
        value={values}
        min={defaultRanges[0]}
        max={defaultRanges[1]}
        minRange={1000}
        step={1000}
        size={3}
        styles={{
          markLabel: { display: 'none' },
          mark: { display: 'none' },
          thumb: {
            width: '24px',
            height: '24px',
          },
          track: {
            height: '3px',
          },
        }}
        label={null}
        thumbSize={24}
        onChange={setValues}
      />
      <div className='pt-4'>
        <div className='grid grid-cols-2 gap-3'>
          <div>
            <TextInput
              readOnly
              label='En Düşük'
              value={formatCurrency(values[0])}
              size='sm'
              styles={{
                input: {
                  fontSize: '14px',
                  textAlign: 'center',
                },
                label: {
                  fontSize: '12px',
                  fontWeight: 500,
                },
              }}
            />
          </div>
          <div>
            <TextInput
              readOnly
              label='En Yüksek'
              value={formatCurrency(values[1])}
              size='sm'
              styles={{
                input: {
                  fontSize: '14px',
                  textAlign: 'center',
                },
                label: {
                  fontSize: '12px',
                  fontWeight: 500,
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className='pt-4 text-center'>
        <Button
          type='button'
          size='sm'
          fullWidth
          onClick={() => {
            if (values.length) {
              setFilterParams({
                priceRange: values,
              })
            }
          }}
          styles={{
            root: {
              fontWeight: 500,
            },
          }}
        >
          Uygula
        </Button>
      </div>
    </>
  )
}

export { CyprusPriceRangeSlider }
