import dayjs from 'dayjs'
import {
  createLoader,
  createSerializer,
  parseAsArrayOf,
  parseAsBoolean,
  parseAsInteger,
  parseAsIsoDate,
  parseAsJson,
  parseAsString,
  parseAsStringEnum,
} from 'nuqs/server'
import { z } from 'zod'

export enum CyprusSortOrderEnums {
  priceAsc = 'price-asc',
  priceDesc = 'price-desc',
  popular = 'popular',
  nameAsc = 'name-asc',
  nameDesc = 'name-desc',
  starAsc = 'star-asc',
  starDesc = 'star-desc',
}

export const cyprusFilterSearchParams = {
  orderBy: parseAsStringEnum<CyprusSortOrderEnums>(
    Object.values(CyprusSortOrderEnums)
  ).withDefault(CyprusSortOrderEnums.popular),
  hotelName: parseAsString,
  destinationIds: parseAsArrayOf(parseAsString),
  pensionTypes: parseAsArrayOf(parseAsString),
  themes: parseAsArrayOf(parseAsString),
  facilities: parseAsArrayOf(parseAsString),
  priceRange: parseAsArrayOf(parseAsInteger),
  maxStarRating: parseAsInteger,
  minStarRating: parseAsInteger,
  maxTripAdvisorRating: parseAsInteger,
  minTripAdvisorRating: parseAsInteger,
}

export type CyprusFilterSearchParams = {
  orderBy: CyprusSortOrderEnums
  hotelName: string | null
  destinationIds: string[] | null
  pensionTypes: string[] | null
  themes: string[] | null
  facilities: string[] | null
  priceRange: number[] | null
  maxStarRating: number | null
  minStarRating: number | null
  maxTripAdvisorRating: number | null
  minTripAdvisorRating: number | null
}
export const cyprusRoomParser = z.array(
  z.object({
    childBirthdays: z.array(z.number()),
    adult: z.number(),
    child: z.number(),
    // infant: z.number(),
    // student: z.number(),
    // senior: z.number(),
    // military: z.number(),
  })
)

export const cyprusSearchParams = {
  isTransfer: parseAsBoolean.withDefault(true),
  isFlight: parseAsBoolean.withDefault(true),
  rooms: parseAsJson(cyprusRoomParser.parse).withDefault([
    {
      adult: 2,
      child: 0,
      childBirthdays: [],
    },
  ]),
  checkInDate: parseAsIsoDate.withDefault(dayjs().add(1, 'months').toDate()),
  checkOutDate: parseAsIsoDate.withDefault(
    dayjs().add(1, 'months').add(5, 'days').toDate()
  ),
  slug: parseAsString.withDefault('kibris'),
  name: parseAsString,
  airportCode: parseAsString,
  type: parseAsInteger,
  id: parseAsInteger,
  earlyBooking: parseAsBoolean.withDefault(false),
  languageCode: parseAsString.withDefault('tr_TR'),
  pageNo: parseAsInteger.withDefault(0),
  pageSize: parseAsInteger.withDefault(20),
  maxTripAdvisorRating: parseAsInteger.withDefault(0),
  minTripAdvisorRating: parseAsInteger.withDefault(0),
  isAvailabilityResult: parseAsBoolean.withDefault(false),
  isSocketConnected: parseAsBoolean.withDefault(false),
  // tags: null,
  // hotelName: null,
  // facilities: null,
  // pensionTypes: null,
  // themes: null,
  // destinationIds: null,
  // nonRefundable: null,
  // extentionData: {},
  // provider: null,
}

export const loadCyprusSearchParams = createLoader(cyprusSearchParams)
export const cyprusSearchSerializer = createSerializer(cyprusSearchParams)
