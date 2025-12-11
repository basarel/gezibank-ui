import { olRequest } from '@/network'
import { useInfiniteQuery } from '@tanstack/react-query'

import { type HotelOlResponse } from '@/app/hotel/types'
import { HotelSearchResultsFilterParams } from '@/modules/hotel/searchParams'
import { cleanObj } from '@/libs/util'

export const useSearchListQuery = ({
  name,
  id,
  slug,
  type,
  filterParams,
}: {
  name: string
  slug: string
  id: number
  type: number
  filterParams: HotelSearchResultsFilterParams
}) =>
  useInfiniteQuery({
    enabled: !!(name && id && slug && type),
    initialPageParam: {
      pageNo: 0,
    },
    queryKey: ['hotel-list-results', id, slug, name, type, filterParams],
    queryFn: async ({ pageParam }) => {
      const response = await olRequest<HotelOlResponse>({
        apiAction: '/api/Hotel/GetHotels',
        apiRoute: 'HotelService',
        data: {
          params: {
            hotelSearchModuleRequest: {
              id,
              slug,
              name,
              type,
              pageNo: pageParam.pageNo,
              pageSize: 20,
              ...cleanObj(filterParams),
            },
          },
          requestType:
            'TravelAccess.Business.Models.Hotel.HotelSearchApiRequest, Business.Models.Hotel, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null',
        },
      })

      return response?.data
    },
    getNextPageParam: (lastPage, allPages, lastPageParam, allPageParam) => {
      return {
        pageNo: lastPageParam.pageNo + 1,
      }
    },
  })
