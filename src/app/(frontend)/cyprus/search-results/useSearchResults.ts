import { cyprusSearchParams } from '@/modules/cyprus/searchParams'
import { CyprusSearchResultsApiResponse } from '@/modules/cyprus/types'
import { olRequest } from '@/network'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useQueryStates } from 'nuqs'

export const useCyprusSearchResults = () => {
  const [searchParams] = useQueryStates(cyprusSearchParams)
  const { airportCode, isFlight, isTransfer, rooms, ...restSearchParams } =
    searchParams

  const convertChildAges = rooms.flatMap((room) => ({
    ...room,
    childBirthdays: room.childBirthdays.flatMap((age) =>
      dayjs().subtract(age, 'years').format('DD-MM-YYYY')
    ),
  }))

  const searchSessionTokenQuery = useQuery({
    enabled: !!searchParams,
    queryKey: ['cyprus-search-tokens', searchParams],
    queryFn: async ({ signal }) => {
      const response = await olRequest<string>({
        signal,
        apiRoute: 'CyprusPackageService',
        apiAction: 'api/CyprusPackage/GetNewSearchSessionToken',
      })

      if (!response?.data) {
        throw new Error('Session Search token error')
      }

      return response
    },
    select: (query) => {
      return {
        searchToken: query?.data,
        sessionToken: query?.sessionToken,
      }
    },
  })

  const cyprusSearchResultsQuery = useQuery({
    enabled:
      !!searchSessionTokenQuery.data && searchSessionTokenQuery.isSuccess,

    queryKey: [
      'cyprus-search-results',
      convertChildAges,
      airportCode,
      isFlight,
      isTransfer,
      rooms,
      restSearchParams,
      searchSessionTokenQuery?.data?.searchToken,
      searchSessionTokenQuery?.data?.sessionToken,
    ],
    queryFn: async () => {
      const response = await olRequest<{
        hasMoreResponse: boolean
        searchResults: CyprusSearchResultsApiResponse[]
      } | null>({
        apiRoute: 'CyprusPackageService',
        apiAction: 'api/CyprusPackage/Search',
        data: {
          params: {
            hotelSearchModuleRequest: {
              ...restSearchParams,
              rooms: convertChildAges,
            },
            tripType: 0,
            isTransfer,
            isFlight,
            airportCode,
            searchToken: searchSessionTokenQuery.data?.searchToken,
            sessionToken: searchSessionTokenQuery.data?.sessionToken,
          },
          requestType:
            'TravelAccess.Core.Models.CyprusPackage.HotelSearchApiRequest, Business.Models.CyprusPackage, Version=1.0.7.0, Culture=neutral, PublicKeyToken=null',
          returnType:
            'Core.Models.ResultModels.RestResult`1[[TravelAccess.Core.Models.BaseRequestResponses.SearchRestClientResponse`1[[TravelAccess.Core.Models.CyprusPackage.CyprusPackageSearchResponse, Core.Models.CyprusPackage, Version=1.0.6.0, Culture=neutral, PublicKeyToken=null]], Core.Models, Version=1.1.78.0, Culture=neutral, PublicKeyToken=null]], Core.Models, Version=1.1.78.0, Culture=neutral, PublicKeyToken=null',
          sessionToken: searchSessionTokenQuery.data?.sessionToken,
          mlToken: '300e4d36-e149-4324-a09d-81c83d297f9d',
        },
      })

      return response
    },
    select: (query) => {
      return query?.data
    },
  })

  return {
    cyprusSearchResultsQuery,
    searchSessionTokenQuery,
    searchParams,
    searchToken: searchSessionTokenQuery.data?.searchToken,
    sessionToken: searchSessionTokenQuery.data?.sessionToken,
  }
}
