import { Button } from '@mantine/core'
import { DatePicker, DatesRangeValue } from '@mantine/dates'

import classes from '@/styles/Datepicker.module.css'
import dayjs from 'dayjs'
import { useOfficialDays } from '../useOfficialDays'
import { useMediaQuery } from '@mantine/hooks'

type IProps = {
  defaultDates: DatesRangeValue
  onChange: (value: DatesRangeValue) => void
  onClose: (state: boolean) => void
}

const CarCalendarWrapper: React.FC<IProps> = ({
  defaultDates,
  onChange,
  onClose,
}) => {
  const { dayRenderer, handleOfficialDates, OfficialDayRendererMemo } =
    useOfficialDays({ numberOfColumns: 2, defaultDate: defaultDates[0] })
  const matches = useMediaQuery('(min-width: 62em)')

  const today = dayjs()
  const maxDate = today.add(1, 'year')

  return (
    <>
      <div className='relative grow overflow-y-auto overscroll-contain scroll-smooth pb-2'>
        <DatePicker
          highlightToday
          allowSingleDateInRange
          type={'range'}
          numberOfColumns={matches ? 2 : 1}
          minDate={today.toDate()}
          maxDate={maxDate.toDate()}
          maxLevel='month'
          classNames={classes}
          defaultValue={defaultDates}
          defaultDate={dayjs(defaultDates[0]).toISOString()}
          renderDay={dayRenderer}
          onChange={onChange}
          onDateChange={handleOfficialDates}
          onNextMonth={handleOfficialDates}
          onPreviousMonth={handleOfficialDates}
        />
      </div>
      <div className='flex items-center border-t p-3 md:justify-between'>
        <div className='hidden flex-col gap-1 md:flex'>
          <OfficialDayRendererMemo />
        </div>
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
    </>
  )
}

export { CarCalendarWrapper }
