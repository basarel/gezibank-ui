import { useState } from 'react'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import duration from 'dayjs/plugin/duration'
import clsx from 'clsx'

dayjs.extend(utc)
dayjs.extend(duration)

import { CloseButton, Paper, Transition, Portal, Button } from '@mantine/core'
import { useClickOutside } from '@mantine/hooks'
import { type DatesRangeValue } from '@mantine/dates'

import { Provider } from '@/components/search-engine/calendar/provider'
import { Input } from '@/components/search-engine/input'

type Props = {
  onDateSelect?: (dates: DatesRangeValue) => void
  defaultDates: DatesRangeValue
}

import { RiCalendarEventLine } from 'react-icons/ri'
import { TourCalendarWrapper } from './_datepicker'

enum SegmentOptions {
  'months' = 'months',
  'specialDays' = 'specialDays',
}

const TourCalendar: React.FC<Props> = ({
  onDateSelect = () => {},
  defaultDates,
}) => {
  const dayJsStartDate = dayjs(defaultDates[0])
  const dayJsEndDate = dayjs(defaultDates[1])
  const isAnySeasonSelected = dayJsEndDate.diff(dayJsStartDate, 'months') > 1
  const anySeasonTitle = 'Herhangi Bir Dönem'

  // const specialDaysQuery = useOfficialHolidayQuery()

  // const specialDaysData = specialDaysQuery.data?.result.map((specialDay) => {
  //   return {
  //     ...specialDay,
  //     isSelected:
  //       dayJsStartDate.isSame(dayjs.utc(specialDay.day)) &&
  //       dayJsEndDate.diff(dayJsStartDate, 'days') < 27, //! this must be a joke 😲,
  //   }
  // })

  // let selectedSpecialDay = specialDaysData?.find((item) => item.isSelected)

  // const [segmentValue, setSegmentValue] = useState<string>(
  //   selectedSpecialDay ? SegmentOptions.specialDays : SegmentOptions.months
  // )

  const [containerTransitionState, setContainerTransitionState] =
    useState(false)
  const clickOutsideRef = useClickOutside(() =>
    setContainerTransitionState(false)
  )

  const [isContainerTransitionEntered, setIsContainerTransitionEntered] =
    useState(false)

  const handleDateSelections = (dates: DatesRangeValue) => {
    // if (segmentValue === SegmentOptions.months) {
    //   const firstDate = dayjs.utc(dates[0]).startOf('month')
    //   const checkinDate = firstDate.toDate()
    //   const checkoutDate = firstDate.endOf('month').toDate()

    //   onDateSelect([checkinDate, checkoutDate])
    // } else {
    //   onDateSelect(dates)
    // }
    // const firstDate = dayjs.utc(dates[0]).startOf('month')
    // const checkinDate = firstDate.toDate()
    // const checkoutDate = firstDate.endOf('month').toDate()
    onDateSelect(dates)

    // setContainerTransitionState(false)
  }

  return (
    <Provider>
      <div className='relative'>
        {/* <Skeleton visible={specialDaysQuery.isLoading}></Skeleton> */}

        <RiCalendarEventLine
          size={20}
          className='absolute top-1/2 left-0 z-10 mx-2 -translate-y-1/2'
        />
        <Input
          label={<div className='w-full md:px-2'>Ne zaman gideceksiniz?</div>}
          onClick={() => setContainerTransitionState(true)}
          title={
            <div className='flex w-full items-center gap-[12px] md:px-2'>
              <span>
                {isAnySeasonSelected
                  ? anySeasonTitle
                  : dayjs(defaultDates[0]).format('MMMM YYYY')}
              </span>
            </div>
          }
        />
        <Transition
          mounted={containerTransitionState}
          keepMounted={false}
          transition='pop-top-left'
          onExit={() => {
            // if (segmentValue === SegmentOptions.months) {
            //   handleDateSelections([defaultDates[0], defaultDates[1]])
            // }
            setIsContainerTransitionEntered(false)
          }}
          // onEnter={() =>
          //   setSegmentValue(
          //     !!selectedSpecialDay
          //       ? SegmentOptions.specialDays
          //       : SegmentOptions.months
          //   )
          // }
          onEntered={() => {
            setIsContainerTransitionEntered(true)
          }}
        >
          {(styles) => (
            <div
              className='z-overlay md:-start-md fixed start-0 end-0 top-0 bottom-0 sm:p-20 md:absolute md:end-auto md:bottom-auto md:-ms-1 md:-mt-1 md:p-0'
              ref={clickOutsideRef}
              style={{ ...styles }}
            >
              <Paper className='mx-auto h-full rounded-lg border shadow-xl md:h-auto'>
                <div className='md:hidden'>
                  <div className='flex justify-end p-2'>
                    <CloseButton
                      size='lg'
                      onClick={() => setContainerTransitionState(false)}
                    />
                  </div>
                </div>
                {/* <div className='flex justify-center pt-3'>
                  {isContainerTransitionEntered ? (
                    <SegmentedControl
                      bdrs={'xl'}
                      size='md'
                      classNames={{
                        indicator: 'bg-primary-filled rounded-lg',
                        label: 'data-[active]:text-white',
                      }}
                      data={[
                        {
                          label: 'Aylar',
                          value: SegmentOptions.months,
                        },
                        {
                          label: 'Resmi Tatil ve Özel Günler',
                          value: SegmentOptions.specialDays,
                        },
                      ]}
                      onChange={setSegmentValue}
                      value={segmentValue}
                    />
                  ) : (
                    <Skeleton h={30} bdrs={'sm'} />
                  )}
                </div> */}
                <div className='flex flex-col gap-3 p-3'>
                  <div className='flex justify-center'>
                    <Button
                      type='button'
                      variant={isAnySeasonSelected ? 'filled' : 'outline'}
                      onClick={() => {
                        handleDateSelections([
                          dayjs().toDate(),
                          dayjs().add(1, 'years').toDate(),
                        ])
                      }}
                    >
                      {anySeasonTitle}
                    </Button>
                  </div>
                  <div>
                    {/* {segmentValue === SegmentOptions.specialDays && (
                    <SimpleGrid cols={{ base: 2, sm: 4 }} spacing={3}>
                      {specialDaysData?.map((specialDay) => (
                        <Box
                          key={specialDay.id}
                          className={clsx(
                            'cursor-pointer rounded-md border p-2 text-center text-xs',
                            {
                              'border-blue-filled bg-blue-50':
                                specialDay.isSelected,
                            }
                          )}
                          component='button'
                          type='button'
                          onClick={() => {
                            handleDateSelections([
                              dayjs.utc(specialDay.day).toDate(),
                              dayjs.utc(specialDay.day).toDate(),
                            ])
                            specialDaysData.forEach(
                              (item) => (item.isSelected = false)
                            )
                            selectedSpecialDay = {
                              ...specialDay,
                              isSelected: true,
                            }
                            // setSelectedSpecialDay(specialDay)
                          }}
                        >
                          <Box className='font-semibold'>
                            {specialDay.description}
                          </Box>
                        </Box>
                      ))}
                    </SimpleGrid>
                  )} */}

                    <TourCalendarWrapper
                      defaultDates={defaultDates}
                      onChange={(dates) => {
                        const firstDate = dayjs.utc(dates[0]).startOf('month')
                        const checkinDate = firstDate.toDate()
                        const checkoutDate = firstDate.endOf('month').toDate()
                        handleDateSelections([checkinDate, checkoutDate])
                      }}
                      onClose={setContainerTransitionState}
                    />
                  </div>
                </div>
                <div className='flex items-center border-t p-3 md:justify-end'>
                  <Button
                    type='button'
                    radius='xl'
                    className='w-full md:w-auto'
                    size='sm'
                    onClick={() => setContainerTransitionState(false)}
                  >
                    Tamam
                  </Button>
                </div>
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

export { TourCalendar }
