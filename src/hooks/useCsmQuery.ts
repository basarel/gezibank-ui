import { getWidgetsByCollectionSlug } from '@/libs/cms-data'
import { useQuery } from '@tanstack/react-query'

const useGetWidgetsByCollectionSlug = () =>
  useQuery({
    queryKey: ['widgets-by-collection-slug'],
    queryFn: async () => {
      const response = await getWidgetsByCollectionSlug()
      return response?.data
    },
  })

export { useGetWidgetsByCollectionSlug }
