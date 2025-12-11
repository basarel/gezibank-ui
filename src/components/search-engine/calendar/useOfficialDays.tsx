import { OfficialHolidayServiceResponse } from '@/types/global'
import { useOfficialHolidayQuery } from './useOfficialHolidayQuery'
import { memo, useCallback, useState } from 'react'
import dayjs from 'dayjs'
import { DatePickerProps, DateValue } from '@mantine/dates'
import { Indicator, Tooltip } from '@mantine/core'

const useOfficialDays = ({
  numberOfColumns = 2,
  defaultDate,
}: {
  numberOfColumns: number
  defaultDate: DateValue
}) => {
  const officialDayQuery = useOfficialHolidayQuery()
  const _officialDays = officialDayQuery.data

  const initialDates = [
    dayjs(defaultDate).add(numberOfColumns > 1 ? 1 : 0, 'month'),
    numberOfColumns > 1 ? dayjs(defaultDate) : undefined,
  ]
  const initialOfficialDays = _officialDays?.result.filter((officialDay) => {
    return initialDates.find((month) => {
      return (
        month?.year() === dayjs(officialDay.day).year() &&
        dayjs(officialDay.day).month() == month.month()
      )
    })
  })

  const [filteredOfficialDays, setOfficialDays] = useState<
    OfficialHolidayServiceResponse['result'] | undefined
  >(initialOfficialDays)

  const handleOfficialDates = (date: DateValue) => {
    const dateObj = [
      dayjs(date).add(numberOfColumns > 1 ? 1 : 0, 'month'),
      numberOfColumns > 1 ? dayjs(date) : undefined,
    ]

    setOfficialDays(
      _officialDays?.result.filter((officialDay) => {
        return dateObj.find((month) => {
          return (
            month?.year() === dayjs(officialDay.day).year() &&
            dayjs(officialDay.day).month() == month.month()
          )
        })
      })
    )
  }

  const dayRenderer: DatePickerProps['renderDay'] = (date) => {
    const day = dayjs(date)
    const officialDayDates = dayjs(
      officialDayQuery.data?.result.find((officialDay) =>
        dayjs(officialDay.day).isSame(day)
      )?.day ?? null
    )
    const officialDay = officialDayQuery.data?.result.find((officialDay) =>
      dayjs(officialDay.day).isSame(day)
    )

    return (
      <Tooltip
        label={officialDay?.description}
        disabled={officialDayDates.date() !== day.date()}
        withArrow
        transitionProps={{
          transition: 'fade-down',
        }}
        offset={12}
      >
        <Indicator
          size={8}
          color='blue'
          offset={-1}
          disabled={officialDayDates.date() !== day.date()}
          position='bottom-center'
        >
          {day.date()}
        </Indicator>
      </Tooltip>
    )
  }

  const officialDayRenderer = useCallback(() => {
    return filteredOfficialDays?.map((officialDay) => {
      return (
        <div key={officialDay.id} className='ps-4'>
          <Indicator position='middle-start' offset={-10}>
            <div className='text-sm'>
              {dayjs(officialDay.day).format('DD MMMM')}{' '}
              {officialDay.description}
            </div>
          </Indicator>
        </div>
      )
    })
  }, [filteredOfficialDays])
  const OfficialDayRendererMemo = memo(function OfficialDayRenderer() {
    return officialDayRenderer()
  })

  return {
    dayRenderer,
    handleOfficialDates,
    filteredOfficialDays,
    officialDayRenderer,
    OfficialDayRendererMemo,
  }
}

export { useOfficialDays }
