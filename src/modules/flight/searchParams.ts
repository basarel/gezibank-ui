import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

import {
  createSerializer,
  inferParserType,
  parseAsArrayOf,
  parseAsInteger,
  parseAsIsoDate,
  parseAsJson,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs'
import { parseAsStringLiteral } from 'nuqs/server'
import { z } from 'zod'
import { CabinClassTitle, CabinClassValue } from './types'

dayjs.extend(utc)

export enum SortOrderEnums {
  priceAsc = 'PRICE_ASC',
  priceDesc = 'PRICE_DESC',
  hourAsc = 'HOUR_ASC',
  hourDesc = 'HOUR_DESC',
  durationAsc = 'DURATION_ASC',
  durationDesc = 'DURATION_DESC',
}

const cabinClassSchema = z.object({
  value: z.nativeEnum(CabinClassValue),
  title: z.nativeEnum(CabinClassTitle),
})

const passengerCounts = z.object({
  Adult: z.number(),
  Child: z.number(),
  Infant: z.number(),
})

const destinationSchema = z.object({
  code: z.string(),
  iata: z.array(z.string()),
  type: z.number(),
  isDomestic: z.boolean(),
  id: z.number().or(z.string()),
})

export const flightSearchParams = {
  origin: parseAsJson(destinationSchema.parse),
  destination: parseAsJson(destinationSchema.parse),
  departureDate: parseAsIsoDate.withDefault(
    dayjs().utc().startOf('day').add(1, 'month').toDate()
  ),
  returnDate: parseAsIsoDate.withDefault(
    dayjs().utc().startOf('day').add(1, 'month').add(5, 'days').toDate()
  ),
  activeTripKind: parseAsStringLiteral(['1', '2']).withDefault('1'),
  cabinClass: parseAsJson(cabinClassSchema.parse),
  passengerCounts: parseAsJson(passengerCounts.parse).withDefault({
    Adult: 1,
    Child: 0,
    Infant: 0,
  }),
}

export const filterParsers = {
  order: parseAsStringEnum<SortOrderEnums>(
    Object.values(SortOrderEnums)
  ).withDefault(SortOrderEnums.priceAsc),
  numOfStops: parseAsArrayOf(parseAsInteger),
  airlines: parseAsArrayOf(parseAsString),
  airports: parseAsArrayOf(parseAsString),
  departureHours: parseAsArrayOf(parseAsInteger, '-'),
  returnHours: parseAsArrayOf(parseAsInteger, '-'),
  baggage: parseAsArrayOf(parseAsString),
}

export type FlightFilterSearchParams = inferParserType<typeof filterParsers>
export const serializeFlightSearchParams = createSerializer(flightSearchParams)
