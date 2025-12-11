import { DatesRangeValue, MonthPicker } from '@mantine/dates'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

type IProps = {
  defaultDates: DatesRangeValue
  onChange: (value: DatesRangeValue) => void
  onClose: (state: boolean) => void
}

const TourCalendarWrapper: React.FC<IProps> = ({ defaultDates, onChange }) => {
  const today = dayjs.utc()
  const maxDate = today.add(1, 'year')
  const isMoreThanMonth =
    dayjs(defaultDates[1]).diff(dayjs(defaultDates[0]), 'month') > 1

  return (
    <>
      <div className='relative flex grow justify-center overflow-y-auto overscroll-contain scroll-smooth'>
        <MonthPicker
          size='lg'
          monthsListFormat='MMMM'
          minDate={today.toDate()}
          maxDate={maxDate.toDate()}
          maxLevel='year'
          value={isMoreThanMonth ? null : defaultDates[0]}
          defaultDate={dayjs(defaultDates[0]).toISOString()}
          onChange={(value) => {
            onChange([dayjs.utc(value).toDate(), dayjs.utc(value).toDate()])
          }}
        />
      </div>
    </>
  )
}

export { TourCalendarWrapper }
