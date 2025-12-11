import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export const calculateFlightDuration = (
  departureTime: string | Date,
  arrivalTime: string | Date
) => {
  const departure = dayjs(departureTime)
  const arrival = dayjs(arrivalTime)
  const durationObj = dayjs.duration(arrival.diff(departure))
  const days = durationObj.days()
  const hours = durationObj.hours()
  const minutes = durationObj.minutes()

  const parts = []
  if (days > 0) parts.push(`${days} gün`)
  if (hours > 0) parts.push(`${hours}sa`)
  if (minutes > 0) parts.push(`${minutes}dk`)

  return parts.length > 0 ? parts.join(' ') : '0dk'
}

export const calculateFlightDurationFromDateAndTime = (
  departureDate: string,
  departureTime: string,
  arrivalDate: string,
  arrivalTime: string
) => {
  const departure = dayjs(`${departureDate} ${departureTime}`)
  const arrival = dayjs(`${arrivalDate} ${arrivalTime}`)
  return calculateFlightDuration(departure.toISOString(), arrival.toISOString())
}
