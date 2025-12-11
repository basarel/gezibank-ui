import { Button } from '@mantine/core'
import { DatePicker, type DateValue } from '@mantine/dates'
import dayjs from 'dayjs'

import classes from '@/styles/Datepicker.module.css'
import { useOfficialDays } from '../useOfficialDays'

type IProps = {
  defaultDate: DateValue
  onChange: (value: DateValue) => void
  onClose: (state: boolean) => void
}

const BusCalendarWrapper: React.FC<IProps> = ({
  defaultDate,
  onChange,
  onClose,
}) => {
  const { dayRenderer, handleOfficialDates, OfficialDayRendererMemo } =
    useOfficialDays({ numberOfColumns: 1, defaultDate })

  const today = dayjs()
  const maxDate = today.add(1, 'year')

  return (
    <>
      <div className='relative grow overflow-y-auto overscroll-contain scroll-smooth pb-2'>
        <DatePicker
          highlightToday
          minDate={today.toDate()}
          maxDate={maxDate.toDate()}
          maxLevel='month'
          classNames={classes}
          defaultValue={defaultDate}
          defaultDate={dayjs(defaultDate).toISOString()}
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

export { BusCalendarWrapper }
