import classes from '@/styles/Datepicker.module.css'

import { Button } from '@mantine/core'
import { DatePicker, type DatesRangeValue } from '@mantine/dates'
import { useMediaQuery } from '@mantine/hooks'
import dayjs from 'dayjs'
import { useOfficialDays } from '../useOfficialDays'
import { useState } from 'react'

type IProps = {
  defaultDates: DatesRangeValue
  onChange: (value: DatesRangeValue) => void
  onClose: (state: boolean) => void
}

const HotelCalendarWrappers: React.FC<IProps> = ({
  defaultDates,
  onChange,
  onClose,
}) => {
  const { dayRenderer, handleOfficialDates, OfficialDayRendererMemo } =
    useOfficialDays({ numberOfColumns: 2, defaultDate: defaultDates[0] })

  const calculateNightCounts = (value: DatesRangeValue) => {
    const startDate = dayjs(value[0])
    const endDate = dayjs(value[1])

    return endDate.isValid() ? endDate.diff(startDate, 'day') : 0
  }

  const matches = useMediaQuery('(min-width: 62em)')
  const today = dayjs()
  const maxDate = today.add(1, 'year')

  const [numberOfNights, setNumberOfNights] = useState(
    calculateNightCounts(defaultDates)
  )

  const handleOnChange = (values: DatesRangeValue) => {
    setNumberOfNights(calculateNightCounts(values))
    onChange(values)
  }

  return (
    <>
      <div className='relative grow overflow-y-auto overscroll-contain scroll-smooth p-3'>
        <DatePicker
          highlightToday
          type={'range'}
          classNames={classes}
          numberOfColumns={matches ? 2 : 1}
          minDate={today.toDate()}
          maxDate={maxDate.toDate()}
          maxLevel='month'
          defaultValue={defaultDates}
          defaultDate={dayjs(defaultDates[0]).toISOString()}
          renderDay={dayRenderer}
          onChange={handleOnChange}
          onDateChange={handleOfficialDates}
          onNextMonth={handleOfficialDates}
          onPreviousMonth={handleOfficialDates}
        />
      </div>
      <div className='items-center justify-between gap-3 border-t p-3 md:flex'>
        <div className='hidden flex-col gap-1 md:flex'>
          <OfficialDayRendererMemo />
        </div>
        <div className='flex items-center gap-2'>
          <div>
            {numberOfNights !== null && numberOfNights > 0 && (
              <span className='text-md rounded-2xl bg-gray-100 p-2 px-4 font-medium text-gray-700'>
                {numberOfNights} gece
              </span>
            )}
          </div>
          <div>
            <Button
              type='button'
              radius='xl'
              className='w-full md:w-auto'
              size='sm'
              onClick={() => onClose(false)}
            >
              Tamam
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}

export { HotelCalendarWrappers }
