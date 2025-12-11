import { useState } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

import clsx from 'clsx'
import { CloseButton, Paper, Transition, Portal } from '@mantine/core'

import { useMediaQuery, useClickOutside } from '@mantine/hooks'
import type { DatesRangeValue, DateValue } from '@mantine/dates'

import { IoArrowForwardSharp } from 'react-icons/io5'

import { Provider } from '@/components/search-engine/calendar/provider'
import { Input } from '@/components/search-engine/input'
import { FlightCalendarWrappers } from './_datepicker'

type Props = {
  tripKind?: 'one-way' | 'round-trip'
  onDateSelect?: (dates: DatesRangeValue) => void
  defaultDates: DatesRangeValue
}
const defaultFormat = 'DD MMM, ddd'

const FlightCalendar: React.FC<Props> = ({
  onDateSelect = () => {},
  tripKind = 'one-way',
  defaultDates,
}) => {
  const matches = useMediaQuery('(min-width: 62em)')
  const [containerTransitionState, setContainerTransitionState] =
    useState(false)
  const clickOutsideRef = useClickOutside(() =>
    setContainerTransitionState(false)
  )
  const departureDate = dayjs(defaultDates[0])
  const returnDateIsValid = dayjs(defaultDates[1]).isValid()
  const returnDate = returnDateIsValid ? dayjs(defaultDates[1]) : null

  const [selectedDates, setSelectedDates] = useState<
    DatesRangeValue | DateValue
  >([defaultDates[0], returnDateIsValid ? defaultDates[1] : null])

  const handleDateSelections = (dates: DatesRangeValue | DateValue) => {
    setSelectedDates(dates)
    let selectedDepartureDate
    let selectedReturnDate

    if (Array.isArray(dates)) {
      selectedDepartureDate = dayjs(dates.at(0))
      selectedReturnDate = dayjs(dates.at(1))
      onDateSelect(dates)
    } else if (dayjs(dates).isValid()) {
      selectedDepartureDate = dayjs(dates)
      onDateSelect([dates, dates])
    }
  }

  return (
    <Provider>
      <div className='relative h-full'>
        <Input
          label={
            tripKind === 'round-trip' ? (
              <div className='flex w-full gap-[76px] md:px-2'>
                <span>Gidiş</span>
                <span>Dönüş</span>
              </div>
            ) : (
              <div className='md:px-2'>Gidiş</div>
            )
          }
          onClick={() => setContainerTransitionState(true)}
          title={
            tripKind === 'round-trip' ? (
              <div className='flex w-full items-center justify-between gap-2 md:px-2'>
                <span>{departureDate.format(defaultFormat) ?? 'Gidiş'}</span>
                <span>-</span>
                <span>{returnDate?.format(defaultFormat) ?? 'Dönüş'}</span>
              </div>
            ) : (
              <span className='md:px-2'>
                {departureDate.format(defaultFormat) ?? 'Gidiş'}
              </span>
            )
          }
        />
        <Transition
          keepMounted={false}
          duration={100}
          mounted={containerTransitionState}
          transition={matches ? 'pop-top-left' : 'pop'}
          onExit={() => {
            handleDateSelections([
              departureDate.toDate(),
              returnDate && returnDateIsValid
                ? returnDate.toDate()
                : dayjs(defaultDates[0]).add(2, 'd').toDate(),
            ])
          }}
        >
          {(styles) => (
            <div
              className='fixed start-0 end-0 top-0 bottom-0 z-50 mx-auto rounded-lg border md:absolute md:start-[-75px] md:end-auto md:bottom-auto'
              ref={clickOutsideRef}
              style={{ ...styles }}
            >
              <Paper className='mx-auto flex h-full flex-col rounded-lg shadow-xl'>
                <div className='px-3 pt-3'>
                  <div className='flex justify-end p-2 md:hidden'>
                    <CloseButton
                      className='mt-2'
                      size={35}
                      onClick={() => setContainerTransitionState(false)}
                    />
                  </div>
                  <div className='flex items-center justify-center gap-8 pb-5 md:justify-start md:pb-0'>
                    <div className='flex'>
                      <div className='border-b-4 border-blue-800 px-2 text-start text-lg font-bold'>
                        {departureDate.isValid() ? (
                          departureDate.format(defaultFormat)
                        ) : (
                          <span className='text-gray-400'>Gidiş</span>
                        )}
                      </div>
                    </div>
                    {tripKind === 'round-trip' && (
                      <>
                        <div className='text-xl'>
                          <IoArrowForwardSharp />
                        </div>
                        <div className='flex'>
                          <button
                            type='button'
                            className={clsx(
                              'border-b-4 px-2 text-start text-lg font-bold',
                              returnDateIsValid
                                ? 'border-blue-800'
                                : 'border-gray-300'
                            )}
                          >
                            {returnDateIsValid &&
                            Array.isArray(selectedDates) &&
                            selectedDates[1] ? (
                              returnDate?.format(defaultFormat)
                            ) : (
                              <span className='text-gray-400'>Dönüş</span>
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <FlightCalendarWrappers
                  defaultDates={defaultDates}
                  onChange={handleDateSelections}
                  onClose={setContainerTransitionState}
                  tripKind={tripKind}
                />
              </Paper>
            </div>
          )}
        </Transition>
      </div>

      {matches && containerTransitionState && (
        <Portal>
          <div className='fixed start-0 end-0 top-0 bottom-0 bg-black/50 md:hidden' />
        </Portal>
      )}
    </Provider>
  )
}

export { FlightCalendar }
