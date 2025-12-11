'use client'
import {
  Accordion,
  Button,
  CloseButton,
  Container,
  NativeSelect,
  RemoveScroll,
  Select,
  Skeleton,
  Title,
  Transition,
  UnstyledButton,
} from '@mantine/core'
import { useQueryStates } from 'nuqs'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { rem } from '@mantine/core'
import { useState, useMemo } from 'react'
import { IoSearchSharp } from 'react-icons/io5'
import { FaCheck } from 'react-icons/fa'
import { MdLocalHotel } from 'react-icons/md'
import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'

import { CyprusSearchEngine } from '@/modules/cyprus'
import { useCyprusSearchResults } from './useSearchResults'
import {
  cyprusSearchParams,
  cyprusFilterSearchParams,
  CyprusSortOrderEnums,
} from '@/modules/cyprus/searchParams'
import { CyprusSearchResult } from './cyprus-result'
import { SearchByName } from '@/app/hotel/search-results/components/search-by-name'
import { DestinationIds } from '@/app/hotel/search-results/components/filters/destinationIds'
import { Themes } from '@/app/hotel/search-results/components/filters/themes'
import { PensionTypes } from '@/app/hotel/search-results/components/filters/pension-types'
import { NotFoundForm } from '@/app/hotel/(detail)/[slug]/_components/no-rooms-form'
import { useCyprusFilterActions } from './filter-actions'
import { CyprusPriceRangeSlider } from './price-range'
import { LoaderBanner } from '@/app/hotel/search-results/components/loader-banner'
import { getContent } from '@/libs/cms-data'
import { CmsContent, Params, Widgets } from '@/types/cms-types'

const CyprusSearchResults = () => {
  const [searchParams] = useQueryStates(cyprusSearchParams)
  const { cyprusSearchResultsQuery, searchToken, sessionToken } =
    useCyprusSearchResults()

  const [isSearchEngineOpened, { toggle: toggleSearchEngineVisibility }] =
    useDisclosure(false)

  const [filterSectionIsOpened, setFilterSectionIsOpened] = useState(false)
  const isBreakPointMatchesMd = useMediaQuery('(min-width: 62em)')

  const totalPassengerCount = () => {
    const total = searchParams.rooms.reduce((a, b) => {
      a += b.adult + b.child
      return a
    }, 0)
    return total
  }

  // Client-side filtreleme ve sıralama
  const rawData =
    cyprusSearchResultsQuery?.data?.searchResults?.flatMap(
      (result) => result.items
    ) || []
  const hasBaseResults = rawData.length > 0
  const { filteredData } = useCyprusFilterActions(rawData)

  const totalCount = filteredData.length

  const isResultsLoading =
    cyprusSearchResultsQuery.isLoading ||
    cyprusSearchResultsQuery.isFetching ||
    (!cyprusSearchResultsQuery.data && !cyprusSearchResultsQuery.isFetched)
  const shouldShowNotFound =
    cyprusSearchResultsQuery.isFetched &&
    !hasBaseResults &&
    !cyprusSearchResultsQuery.isFetching &&
    !cyprusSearchResultsQuery.isLoading

  const sortOptions = [
    {
      label: 'Popüler Paketler',
      value: CyprusSortOrderEnums.popular,
    },
    {
      label: 'Fiyata Göre Artan',
      value: CyprusSortOrderEnums.priceAsc,
    },
    {
      label: 'Fiyata Göre Azalan',
      value: CyprusSortOrderEnums.priceDesc,
    },
    {
      label: 'İsme Göre (Z-A)',
      value: CyprusSortOrderEnums.nameDesc,
    },
  ]
  const [filterParams, setFilterParams] = useQueryStates(
    cyprusFilterSearchParams
  )
  const { orderBy, ...restFilterParams } = filterParams

  const { data: cmsData } = useQuery({
    queryKey: ['cms-data', 'otel-arama'],
    queryFn: () =>
      getContent<CmsContent<Widgets, Params>>('otel-arama').then(
        (response) => response?.data
      ),
  })
  const loaderBannerCyprus =
    cmsData?.widgets?.filter((x) => x.point === 'loader_banner_kibris_react') ??
    []

  return (
    <>
      <div className='border-b md:py-4'>
        <Container>
          <div className='relative py-2 text-sm md:hidden'>
            <button
              className='absolute start-0 end-0 top-0 bottom-0 z-10'
              onClick={toggleSearchEngineVisibility}
            />
            <div className='font-medium'>{searchParams.name}</div>

            <div className='text-s flex items-center gap-2'>
              <div>
                {dayjs(searchParams.checkInDate).format('DD MMM ddd')} -{' '}
                {dayjs(searchParams.checkOutDate).format('DD MMM ddd')} (
                {dayjs(searchParams.checkOutDate).diff(
                  searchParams.checkInDate,
                  'day'
                )}{' '}
                Gece) - {totalPassengerCount()} Kişi
              </div>
              <div className='z-0 ms-auto rounded-md bg-blue-200 p-2'>
                <IoSearchSharp size={24} className='text-blue-800' />
              </div>
            </div>
          </div>
          <div
            className={`${isBreakPointMatchesMd || isSearchEngineOpened ? 'block' : 'hidden'}`}
          >
            {searchParams.slug && (
              <div className='pb-3 md:pb-0'>
                <CyprusSearchEngine
                  defaultValues={{
                    rooms: searchParams.rooms,
                    checkInDate: searchParams.checkInDate,
                    checkOutDate: searchParams.checkOutDate,
                    isFlight: searchParams.isFlight,
                    isTransfer: searchParams.isTransfer,
                    slug: searchParams.slug,
                    airportCode: searchParams.airportCode ?? '',
                  }}
                />
              </div>
            )}
          </div>
        </Container>
      </div>

      {(cyprusSearchResultsQuery.isLoading ||
        cyprusSearchResultsQuery.isFetching) &&
        !cyprusSearchResultsQuery.data && (
          <div className='relative'>
            <div className='absolute start-0 end-0'>
              <Skeleton h={6} radius={0} />
            </div>
          </div>
        )}

      <Container className='p-2 pt-5 pb-20'>
        <div className='grid md:grid-cols-8 md:gap-5'>
          <div className='md:col-span-2'>
            <Transition
              transition={'slide-right'}
              mounted={filterSectionIsOpened || !!isBreakPointMatchesMd}
            >
              {(styles) => (
                <RemoveScroll
                  enabled={filterSectionIsOpened && !isBreakPointMatchesMd}
                >
                  <div
                    className='fixed start-0 end-0 top-0 bottom-0 z-50 overflow-y-auto bg-white md:static md:z-auto'
                    style={styles}
                  >
                    <div className='flex items-center justify-between border-b p-4 md:hidden'>
                      <Title className='text-xl font-medium'>Filtreler</Title>
                      <CloseButton
                        size={'lg'}
                        onClick={() => setFilterSectionIsOpened(false)}
                      />
                    </div>

                    <div className='p-4 md:p-0 md:px-2'>
                      {isResultsLoading ? (
                        <div className='space-y-4'>
                          <div className='mb-4 flex justify-between gap-2 md:mb-6'>
                            <div className='hidden md:block'>
                              <Skeleton h={28} w={100} />
                            </div>
                            <Skeleton h={32} w={80} />
                          </div>
                          <div className='space-y-3'>
                            <div className='space-y-2'>
                              <Skeleton h={20} w={'100%'} />
                            </div>
                            <div className='space-y-2'>
                              <div className='space-y-2 pl-4'>
                                <div className='flex gap-2'>
                                  <Skeleton className='size-4' />
                                  <Skeleton h={16} className='flex-1' />
                                </div>
                                <div className='flex gap-2'>
                                  <Skeleton className='size-4' />
                                  <Skeleton h={16} className='flex-1' />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className='mb-4 flex justify-between gap-2 md:mb-6'>
                            <div className='hidden md:block'>
                              <Title
                                className='text-xl font-medium'
                                mb={rem(10)}
                              >
                                Filtreler
                              </Title>
                            </div>
                            <div>
                              <UnstyledButton
                                className='rounded-md px-4 py-2 font-semibold text-blue-500 transition-colors hover:bg-blue-50'
                                fz='xs'
                                hidden={
                                  !Object.values(restFilterParams).find(Boolean)
                                }
                                onClick={() => {
                                  setFilterParams(null)
                                }}
                              >
                                Temizle
                              </UnstyledButton>
                            </div>
                          </div>
                          <Accordion
                            defaultValue={[
                              'priceRange',
                              'byName',
                              'destinationIds',
                              'pensionTypes',
                              'themes',
                            ]}
                            multiple
                            classNames={{
                              root: 'filter-accordion',
                              control: 'text-md font-medium',
                            }}
                          >
                            <Accordion.Item value='priceRange'>
                              <Accordion.Control>
                                Fiyat Aralığı
                              </Accordion.Control>
                              <Accordion.Panel>
                                {cyprusSearchResultsQuery.data?.searchResults.at(
                                  -1
                                ) && (
                                  <CyprusPriceRangeSlider
                                    minPrice={
                                      cyprusSearchResultsQuery.data.searchResults.at(
                                        -1
                                      )?.minPrice?.value || 0
                                    }
                                    maxPrice={
                                      cyprusSearchResultsQuery.data.searchResults.at(
                                        -1
                                      )?.maxPrice?.value || 100000
                                    }
                                    defaultRanges={[
                                      cyprusSearchResultsQuery.data.searchResults.at(
                                        -1
                                      )?.minPrice?.value || 0,
                                      cyprusSearchResultsQuery.data.searchResults.at(
                                        -1
                                      )?.maxPrice?.value || 100000,
                                    ]}
                                  />
                                )}
                              </Accordion.Panel>
                            </Accordion.Item>
                            <Accordion.Item value='byName'>
                              <Accordion.Control>
                                Otel Adına Göre
                              </Accordion.Control>
                              <Accordion.Panel>
                                <SearchByName
                                  defaultValue={restFilterParams.hotelName}
                                  onClear={() => {
                                    setFilterParams({
                                      hotelName: null,
                                    })
                                  }}
                                  onSearchClick={(value) => {
                                    setFilterParams({
                                      hotelName: value,
                                    })
                                  }}
                                />
                              </Accordion.Panel>
                            </Accordion.Item>
                            <Accordion.Item value='destinationIds'>
                              <Accordion.Control>Yakın Çevre</Accordion.Control>
                              <Accordion.Panel>
                                {cyprusSearchResultsQuery.data?.searchResults.at(
                                  -1
                                )?.destinationsInfo && (
                                  <DestinationIds
                                    destinationsInfo={
                                      cyprusSearchResultsQuery.data?.searchResults.at(
                                        -1
                                      )?.destinationsInfo ?? []
                                    }
                                    filterParams='cyprus'
                                  />
                                )}
                              </Accordion.Panel>
                            </Accordion.Item>
                            <Accordion.Item value='pensionTypes'>
                              <Accordion.Control>
                                Konaklama Tipi
                              </Accordion.Control>
                              <Accordion.Panel>
                                {cyprusSearchResultsQuery.data?.searchResults.at(
                                  -1
                                )?.pensionTypes && (
                                  <PensionTypes
                                    data={
                                      cyprusSearchResultsQuery.data?.searchResults.at(
                                        -1
                                      )?.pensionTypes
                                    }
                                  />
                                )}
                              </Accordion.Panel>
                            </Accordion.Item>
                            <Accordion.Item value='themes'>
                              <Accordion.Control>Temalar</Accordion.Control>
                              <Accordion.Panel>
                                {cyprusSearchResultsQuery.data?.searchResults.at(
                                  -1
                                )?.themes && (
                                  <Themes
                                    data={
                                      cyprusSearchResultsQuery.data?.searchResults.at(
                                        -1
                                      )?.themes
                                    }
                                    filterParams='cyprus'
                                  />
                                )}
                              </Accordion.Panel>
                            </Accordion.Item>
                          </Accordion>
                        </>
                      )}
                    </div>
                  </div>
                </RemoveScroll>
              )}
            </Transition>
          </div>

          <div className='md:col-span-6'>
            {isResultsLoading ? (
              <>
                <div className='mb-2 grid gap-3 md:flex md:justify-between md:gap-1'>
                  <div className='hidden md:flex md:items-center md:gap-2'>
                    <Skeleton height={28} width={300} />
                  </div>
                  <div className='hidden md:flex'>
                    <Skeleton height={36} width={200} />
                  </div>
                  <div className='flex items-center gap-2 px-2 md:hidden'>
                    <Skeleton height={20} width='100%' />
                  </div>
                </div>
                {(cyprusSearchResultsQuery.isLoading ||
                  cyprusSearchResultsQuery.isFetching) && (
                  <div className='mb-4'>
                    <LoaderBanner
                      data={loaderBannerCyprus}
                      moduleName='Paketler'
                      Icon={MdLocalHotel}
                    />
                  </div>
                )}
                {[1, 2, 3, 4, 5].map((index) => (
                  <div
                    key={index}
                    className='my-2 rounded-lg border bg-white p-4 shadow-sm'
                  >
                    <div className='flex flex-col gap-4 md:flex-row'>
                      <Skeleton
                        height={200}
                        width={280}
                        radius='md'
                        className='shrink-0'
                      />
                      <div className='flex flex-1 flex-col gap-3'>
                        <Skeleton height={24} width='70%' />
                        <Skeleton height={18} width='40%' />
                        <div className='mt-2 space-y-2'>
                          <Skeleton height={16} width='90%' />
                          <Skeleton height={16} width='80%' />
                        </div>
                        <div className='mt-auto flex items-end justify-between pt-4'>
                          <div className='space-y-2'>
                            <Skeleton height={14} width={120} />
                            <Skeleton height={32} width={150} />
                          </div>
                          <Skeleton height={40} width={120} radius='md' />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div>
                {totalCount > 0 && (
                  <div className='space-y-3'>
                    <div className='hidden md:block'>
                      <div>
                        <span className='text-lg font-bold'>
                          {searchParams.name} Otelleri
                        </span>
                        , {totalCount} Paket Bulundu
                      </div>
                    </div>
                    <div className='md:hidden'>
                      <div className='mb-3'>
                        <span className='text-sm'>
                          <span className='font-semibold'>
                            {searchParams.name} Otelleri
                          </span>
                          , {totalCount} Paket Bulundu
                        </span>
                      </div>
                      <div className='flex items-center justify-between gap-2'>
                        <Button
                          size='sm'
                          color='black'
                          className='border-gray-400 px-8 font-medium'
                          variant='outline'
                          onClick={() =>
                            setFilterSectionIsOpened((prev) => !prev)
                          }
                        >
                          Filtreler
                        </Button>
                        <NativeSelect
                          className='font-medium'
                          size='sm'
                          style={{ width: 'fit-content', minWidth: '140px' }}
                          value={filterParams.orderBy}
                          onChange={({ currentTarget: { value } }) => {
                            setFilterParams({
                              orderBy: value as CyprusSortOrderEnums,
                            })
                          }}
                          data={[
                            {
                              label: 'Popüler Paketler',
                              value: CyprusSortOrderEnums.popular,
                            },
                            {
                              label: 'Fiyata Göre Artan',
                              value: CyprusSortOrderEnums.priceAsc,
                            },
                            {
                              label: 'Fiyata Göre Azalan',
                              value: CyprusSortOrderEnums.priceDesc,
                            },
                            {
                              label: 'İsme Göre (Z-A)',
                              value: CyprusSortOrderEnums.nameDesc,
                            },
                            {
                              label: 'Yıldız Sayısı (Artan)',
                              value: CyprusSortOrderEnums.starAsc,
                            },
                            {
                              label: 'Yıldız Sayısı (Azalan)',
                              value: CyprusSortOrderEnums.starDesc,
                            },
                          ]}
                        />
                      </div>
                    </div>
                    <div className='mb-3 hidden items-center justify-between gap-2 md:flex'>
                      {sortOptions.map((option) => (
                        <Button
                          size='sm'
                          className={
                            filterParams.orderBy === option.value
                              ? 'rounded-md border-0 bg-blue-100 font-medium text-blue-700'
                              : 'rounded-md border-gray-400 font-normal text-black hover:bg-blue-50 hover:text-blue-700'
                          }
                          key={option.value}
                          leftSection={
                            filterParams.orderBy === option.value ? (
                              <FaCheck />
                            ) : (
                              ''
                            )
                          }
                          color='blue'
                          variant={
                            filterParams.orderBy === option.value
                              ? 'filled'
                              : 'outline'
                          }
                          onClick={() =>
                            setFilterParams({
                              orderBy: option.value,
                            })
                          }
                        >
                          {option.label}
                        </Button>
                      ))}
                      <Select
                        className='font-medium'
                        size='sm'
                        radius={'md'}
                        placeholder='Daha Fazla Göster'
                        style={{ width: 'fit-content', minWidth: '140px' }}
                        value={filterParams.orderBy}
                        onChange={(value) => {
                          setFilterParams({
                            orderBy: value as CyprusSortOrderEnums,
                          })
                        }}
                        data={[
                          {
                            label: 'İsme Göre (A-Z)',
                            value: CyprusSortOrderEnums.nameAsc,
                          },
                          {
                            label: 'Yıldız Sayısı (Artan)',
                            value: CyprusSortOrderEnums.starAsc,
                          },
                          {
                            label: 'Yıldız Sayısı (Azalan)',
                            value: CyprusSortOrderEnums.starDesc,
                          },
                        ]}
                      />
                    </div>
                  </div>
                )}
                {shouldShowNotFound && (
                  <NotFoundForm moduleName='Kıbrıs Otelleri' />
                )}
                {totalCount > 0 &&
                  filteredData.map((item) => {
                    // Hotel info ve room detail'i bul
                    const searchResult =
                      cyprusSearchResultsQuery?.data?.searchResults?.find(
                        (result) =>
                          result.items.some(
                            (resultItem) => resultItem.key === item.key
                          )
                      )

                    const hotelInfo = searchResult?.hotelInfos.find(
                      (hotel) => hotel.id === item.hotelId
                    )
                    const roomDetail =
                      searchResult?.roomDetails[item.rooms[0]?.key]

                    return (
                      <CyprusSearchResult
                        key={item.key}
                        hotelInfo={hotelInfo}
                        resultItem={item}
                        roomDetail={roomDetail}
                        searchToken={searchToken || ''}
                        sessionToken={sessionToken || ''}
                        searchParams={searchParams}
                      />
                    )
                  })}
              </div>
            )}
          </div>
        </div>
      </Container>
    </>
  )
}

export { CyprusSearchResults }
