'use client'

import { useState } from 'react'
import dayjs from 'dayjs'
import clsx from 'clsx'
import { CloseButton, Paper, Transition, Portal } from '@mantine/core'

import { useMediaQuery, useClickOutside } from '@mantine/hooks'
import type { DatesRangeValue } from '@mantine/dates'

import { Provider } from '@/components/search-engine/calendar/provider'
import { Input } from '@/components/search-engine/input'

type Props = {
  onDateSelect?: (dates: DatesRangeValue) => void
  defaultDates: DatesRangeValue
  onExit?: (dates: DatesRangeValue) => void
}
const defaultFormat = 'DD MMM ddd'

import { MdOutlineArrowForward } from 'react-icons/md'
import { RiCalendarEventLine } from 'react-icons/ri'
import { CarCalendarWrapper } from './_datepicker'

const CarCalendar: React.FC<Props> = ({
  onDateSelect = () => {},
  defaultDates,
  onExit = () => null,
}) => {
  const [formattedValues, setFormattedValues] = useState<
    [string | null, string | null]
  >([
    defaultDates[0]
      ? dayjs(defaultDates[0]).format(defaultFormat)
      : 'Giriş Tarihi',
    defaultDates[1]
      ? dayjs(defaultDates[1]).format(defaultFormat)
      : 'Çıkış Tarihi',
  ])

  const [containerTransitionState, setContainerTransitionState] =
    useState(false)
  const clickOutsideRef = useClickOutside(() =>
    setContainerTransitionState(false)
  )

  const handleDateSelections = (dates: DatesRangeValue) => {
    onDateSelect(dates)
    setFormattedValues([
      dates[0] ? dayjs(dates[0]).format(defaultFormat) : 'Teslim Tarihi',
      dates[1] ? dayjs(dates[1]).format(defaultFormat) : 'Bırakış Tarihi',
    ])
  }

  return (
    <Provider>
      <div className='relative h-full'>
        <RiCalendarEventLine
          size={20}
          className='absolute top-1/2 left-0 z-10 mx-2 -translate-y-1/2'
        />
        <Input
          label={
            <div className='flex w-full gap-[55px] md:px-2'>
              <span>Alış Tarihi</span>
              <span>Teslim Tarihi</span>
            </div>
          }
          onClick={() => setContainerTransitionState(true)}
          title={
            <div className='flex w-full items-center justify-between gap-[10px] md:px-2'>
              <span>{dayjs(defaultDates[0]).format('DD MMM, ddd')}</span>
              <span>-</span>
              <span>{dayjs(defaultDates[1]).format('DD MMM, ddd')}</span>
            </div>
          }
        />

        <Transition
          keepMounted={false}
          mounted={containerTransitionState}
          transition='pop-top-left'
          duration={100}
          onExit={() => {
            if (!defaultDates[1]) {
              handleDateSelections([
                defaultDates[0],
                dayjs(defaultDates[0]).add(1, 'd').toDate(),
              ])
            }
            onExit(defaultDates)
          }}
        >
          {(styles) => (
            <div
              className='z-overlay fixed start-0 end-0 top-0 bottom-0 rounded-lg border sm:p-20 md:absolute md:end-auto md:bottom-auto md:-ms-1 md:-mt-1 md:p-0'
              ref={clickOutsideRef}
              style={{ ...styles }}
            >
              <Paper className='mx-auto flex h-full flex-col rounded-lg shadow-xl md:h-auto'>
                <div className='pb-3'>
                  <div className='flex justify-end p-2 md:hidden'>
                    <CloseButton
                      className='mt-2'
                      size={35}
                      onClick={() => setContainerTransitionState(false)}
                    />
                  </div>
                  <div className='flex items-center justify-center gap-3 px-3 pb-3 md:justify-start md:pt-3 md:pb-0'>
                    <div
                      className={clsx(
                        'border-b-4 px-2 text-start text-lg font-bold',
                        defaultDates[0] ? 'border-blue-800' : 'border-gray-300'
                      )}
                    >
                      {formattedValues[0]}
                    </div>
                    <div>
                      <MdOutlineArrowForward size={20} />
                    </div>
                    <div
                      className={clsx(
                        'border-b-4 px-2 text-start text-lg font-bold',
                        defaultDates[1] ? 'border-blue-800' : 'border-gray-300'
                      )}
                    >
                      {formattedValues[1]}
                    </div>
                  </div>
                </div>
                <CarCalendarWrapper
                  defaultDates={defaultDates}
                  onChange={handleDateSelections}
                  onClose={setContainerTransitionState}
                />
              </Paper>
            </div>
          )}
        </Transition>
      </div>

      {containerTransitionState && (
        <Portal>
          <div className='z-modal fixed start-0 end-0 top-0 bottom-0 bg-black/90 md:hidden' />
        </Portal>
      )}
    </Provider>
  )
}

export { CarCalendar }
