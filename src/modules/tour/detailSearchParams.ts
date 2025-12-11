import {
  createSearchParamsCache,
  createSerializer,
  parseAsBoolean,
  parseAsString,
  type inferParserType,
} from 'nuqs/server'

export const tourDetailPageParamParser = {
  productKey: parseAsString,
  slug: parseAsString,
  searchToken: parseAsString,
  sessionToken: parseAsString,
  isCruise: parseAsBoolean.withDefault(false),
}

export const serializeTourDetailPageParams = createSerializer(
  tourDetailPageParamParser
)

export const tourDetailPageParamsCahce = createSearchParamsCache(
  tourDetailPageParamParser
)

export type TourDetailPageParamsType = inferParserType<
  typeof tourDetailPageParamParser
>
