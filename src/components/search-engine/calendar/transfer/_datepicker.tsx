import { Button } from '@mantine/core'
import { DatePicker, type DateValue } from '@mantine/dates'
import { useMediaQuery } from '@mantine/hooks'
import dayjs from 'dayjs'

import classes from '@/styles/Datepicker.module.css'
import { useOfficialDays } from '../useOfficialDays'

type IProps = {
  defaultDate: DateValue
  onChange: (value: DateValue) => void
  onClose: (state: boolean) => void
}

const TransferCalendarWrapper: React.FC<IProps> = ({
  defaultDate,
  onChange,
  onClose,
}) => {
  const today = dayjs()
  const maxDate = today.add(1, 'year')
  const matches = useMediaQuery('(min-width: 62em)')

  const { dayRenderer, handleOfficialDates, officialDayRenderer } =
    useOfficialDays({ numberOfColumns: 1, defaultDate: defaultDate })

  return (
    <>
      <div className='relative mx-auto grow overflow-y-auto overscroll-contain scroll-smooth'>
        <div className='py-3'>
          <DatePicker
            highlightToday
            onChange={onChange}
            minDate={today.toDate()}
            maxDate={maxDate.toDate()}
            maxLevel='month'
            classNames={classes}
            defaultValue={defaultDate}
            defaultDate={dayjs(defaultDate).toISOString()}
            renderDay={dayRenderer}
            onDateChange={handleOfficialDates}
            onNextMonth={handleOfficialDates}
            onPreviousMonth={handleOfficialDates}
            numberOfColumns={1}
          />
        </div>
      </div>
      <div className='flex items-center border-t p-3 md:justify-between'>
        <div className='hidden flex-col gap-1 md:flex'>
          {officialDayRenderer()}
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

export { TransferCalendarWrapper }
