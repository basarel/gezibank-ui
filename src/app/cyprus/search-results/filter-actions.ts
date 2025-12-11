import { useMemo } from 'react'
import { useQueryStates } from 'nuqs'
import {
  CyprusFilterSearchParams,
  cyprusFilterSearchParams,
  CyprusSortOrderEnums,
} from '@/modules/cyprus/searchParams'
import { CyprusSearchResultsApiResponse } from '@/modules/cyprus/types'

type CyprusPackageItem = CyprusSearchResultsApiResponse['items'][0]

const sortCyprusPackages = (
  packages: CyprusPackageItem[],
  orderBy: CyprusSortOrderEnums
) => {
  return [...packages].sort((a, b) => {
    switch (orderBy) {
      case CyprusSortOrderEnums.priceAsc:
        return a.totalPrice.value - b.totalPrice.value
      case CyprusSortOrderEnums.priceDesc:
        return b.totalPrice.value - a.totalPrice.value
      case CyprusSortOrderEnums.popular:
        return (b.hotel?.listing_rate || 0) - (a.hotel?.listing_rate || 0)
      case CyprusSortOrderEnums.nameAsc:
        return (a.hotel?.name || '').localeCompare(b.hotel?.name || '', 'tr')
      case CyprusSortOrderEnums.nameDesc:
        return (b.hotel?.name || '').localeCompare(a.hotel?.name || '', 'tr')
      case CyprusSortOrderEnums.starAsc:
        return (a.hotel?.stars || 0) - (b.hotel?.stars || 0)
      case CyprusSortOrderEnums.starDesc:
        return (b.hotel?.stars || 0) - (a.hotel?.stars || 0)
      default:
        return (b.hotel?.listing_rate || 0) - (a.hotel?.listing_rate || 0) // Default: popular
    }
  })
}

const filterCyprusPackages = (
  packages: CyprusPackageItem[],
  filterParams: CyprusFilterSearchParams
) => {
  return packages.filter((pkg) => {
    // Otel adı filtresi
    if (filterParams.hotelName) {
      const searchTerm = filterParams.hotelName.toLowerCase()
      if (!pkg.hotel?.name.toLowerCase().includes(searchTerm)) {
        return false
      }
    }

    // Destinasyon filtresi
    if (filterParams.destinationIds && filterParams.destinationIds.length > 0) {
      const hasMatchingDestination = pkg.hotel?.destination_map?.some(
        (destId) => filterParams.destinationIds?.includes(destId.toString())
      )

      if (!hasMatchingDestination) {
        return false
      }
    }

    // Konaklama tipi filtresi
    if (filterParams.pensionTypes && filterParams.pensionTypes.length > 0) {
      if (!filterParams.pensionTypes?.includes(pkg.hotel?.meal_type ?? '')) {
        return false
      }
    }

    // Tema filtresi
    if (filterParams.themes && filterParams.themes.length > 0) {
      const hasMatchingTheme = pkg.hotel?.themes?.some((theme) =>
        filterParams.themes?.includes(theme.toString())
      )
      if (!hasMatchingTheme) {
        return false
      }
    }

    // Tesis filtresi
    if (filterParams.facilities && filterParams.facilities.length > 0) {
      const hasMatchingFacility = pkg.hotel?.facilities?.some((facility) =>
        filterParams.facilities?.includes(facility.toString())
      )
      if (!hasMatchingFacility) {
        return false
      }
    }

    // Fiyat aralığı filtresi
    if (filterParams.priceRange && filterParams.priceRange.length === 2) {
      const [minPrice, maxPrice] = filterParams.priceRange
      if (pkg.totalPrice.value < minPrice || pkg.totalPrice.value > maxPrice) {
        return false
      }
    }

    // Yıldız filtresi
    if (
      filterParams.minStarRating &&
      (pkg.hotel?.stars || 0) < filterParams.minStarRating
    ) {
      return false
    }
    if (
      filterParams.maxStarRating &&
      (pkg.hotel?.stars || 0) > filterParams.maxStarRating
    ) {
      return false
    }

    return true
  })
}

export const useCyprusFilterActions = (
  cyprusData: CyprusPackageItem[] | undefined
) => {
  const [filterParams] = useQueryStates(cyprusFilterSearchParams)

  const filteredData = useMemo(() => {
    if (!cyprusData || cyprusData.length === 0) return []

    // Önce filtreleme yap
    const filtered = filterCyprusPackages(cyprusData, filterParams)

    // Sonra sıralama yap
    const sorted = sortCyprusPackages(filtered, filterParams.orderBy)

    return sorted
  }, [cyprusData, filterParams])

  return { filteredData }
}
