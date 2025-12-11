'use client'

import { useDestinationGetBySlug, useGetThemeBySlug } from '@/hooks/destination'
import { HotelSearchEngine } from '@/modules/hotel'
import {
  Accordion,
  Alert,
  Button,
  Collapse,
  Container,
  Drawer,
  Grid,
  LoadingOverlay,
  Modal,
  NativeSelect,
  Select,
  Skeleton,
  Stack,
  Title,
  UnstyledButton,
} from '@mantine/core'
import { useDisclosure, useMediaQuery, useScrollIntoView } from '@mantine/hooks'
import dayjs from 'dayjs'
import { MdLocalHotel } from 'react-icons/md'
import { IoSearchSharp } from 'react-icons/io5'

import { useSearchListQuery } from '@/app/hotel/useListSearchQuery'
import { SearchCopyCode } from '@/components/search-copy-code'
import { useQuery } from '@tanstack/react-query'
import { getContent } from '@/libs/cms-data'
import { CmsContent, Params, Widgets } from '@/types/cms-types'
import { LoaderBanner } from '@/app/hotel/search-results/components/loader-banner'
import { HotelSearchResultItem } from '@/app/hotel/search-results/results-item'
import { useState } from 'react'
import {
  HotelCampaignsResponse,
  HotelSearchResultHotelInfo,
} from '@/app/hotel/types'
import { HotelMap } from '@/app/hotel/search-results/components/maps'
import { request } from '@/network'
import {
  hotelFilterSearchParams,
  HotelSortOrderEnums,
} from '@/modules/hotel/searchParams'
import { useQueryStates } from 'nuqs'
import { SearchByName } from '@/app/hotel/search-results/components/search-by-name'
import { FaCheck, FaChevronDown } from 'react-icons/fa'
import { DestinationIds } from '@/app/hotel/search-results/components/filters/destinationIds'
import { PensionTypes } from '@/app/hotel/search-results/components/filters/pension-types'
import { Themes } from '@/app/hotel/search-results/components/filters/themes'
import { notFound } from 'next/navigation'

type IProps = {
  slug: string
}

export const ListResults: React.FC<IProps> = ({ slug }) => {
  const isBreakPointMatchesMd = useMediaQuery('(min-width: 62em)')

  const [
    isSearchEngineOpened,
    { toggle: toggleSearchEngineVisibility, open: openSearchEngineVisibility },
  ] = useDisclosure(false)

  const [
    isFilterDrawerOpen,
    {
      close: closeFilterDrawer,
      toggle: toggleFilterDrawer,
      open: openFilterDrawer,
    },
  ] = useDisclosure(false)

  const { data: cmsData } = useQuery({
    queryKey: ['cms-data', 'hotel-search-csm-data'],
    queryFn: () =>
      getContent<CmsContent<Widgets, Params>>('otel-arama').then(
        (response) => response?.data
      ),
  })
  const searchCopyCode =
    cmsData?.widgets?.filter((x) => x.point === 'hotel_camp_banner_react') ?? []
  const loaderBannerHotel =
    cmsData?.widgets?.filter((x) => x.point === 'loader_banner_hotel_react') ??
    []
  const [{ orderBy, ...restFilterParams }, setFilterParams] = useQueryStates(
    hotelFilterSearchParams
  )
  const destinationWithSlug = useDestinationGetBySlug({
    slugs: [slug],
    moduleName: 'Hotel',
  })
  const themeBySlug = useGetThemeBySlug(slug)
  const isLocationInfoLoading =
    destinationWithSlug.pending || themeBySlug.isLoading

  const destination =
    themeBySlug.data?.Result ??
    destinationWithSlug.data.filter((item) => !!item?.Result).at(0)?.Result

  const searchResultQuery = useSearchListQuery({
    name: destination?.Name ?? '',
    id: destination?.Id ?? 0,
    slug: destination?.Slug ?? '',
    type: destination?.Type ?? 0,
    filterParams: {
      orderBy,
      ...restFilterParams,
    },
  })
  const [isMapsModalOpened, { open: openMapsModal, close: closeMapsModal }] =
    useDisclosure(false)
  const [hotelInfo, setHotelInfo] = useState<HotelSearchResultHotelInfo>()
  const [searchEnginCalendarVisible, setSearchEnginCalendarVisible] =
    useState(false)

  const countryCode =
    searchResultQuery.data?.pages.at(0)?.searchResults[0]?.hotelInfos?.at(0)
      ?.country_code ?? 'tr'
  const hotelCampaignsQuery = useQuery({
    enabled:
      searchResultQuery.data?.pages &&
      searchResultQuery.data?.pages?.length > 0,
    queryKey: ['hotel-search-campaigns', countryCode],
    queryFn: async () => {
      const cc = countryCode
      const response = await request({
        url: `${process.env.NEXT_PUBLIC_SERVICE_PATH}/hotel/GetCampaigns?countryCode=${cc}`,
        method: 'get',
      })

      return response as HotelCampaignsResponse[]
    },
  })
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>()

  const orderByOptions = [
    {
      value: HotelSortOrderEnums.listingRateDescending,
      label: 'Popüler Oteller',
    },
    {
      value: HotelSortOrderEnums.nameAscending,
      label: 'İsme Göre (A-Z)',
    },
    {
      value: HotelSortOrderEnums.nameDescending,
      label: 'İsme Göre (Z-A)',
    },
    {
      value: HotelSortOrderEnums.starAscending,
      label: 'Yıldız Sayısı (Artan)',
    },
    {
      value: HotelSortOrderEnums.starDescending,
      label: 'Yıldız Sayısı (Azalan)',
    },
  ]

  if (
    !themeBySlug.isLoading &&
    !destinationWithSlug.pending &&
    !themeBySlug.data?.Result &&
    !destinationWithSlug.data.some((item) => item?.Result)
  ) {
    // we may show no result message
    notFound()
  }

  const hasMoreResponse =
    searchResultQuery.data?.pages.at(-1)?.hasMoreResponse ?? false

  const destinationsInfos = searchResultQuery.data?.pages
    .at(-1)
    ?.searchResults.at(-1)?.destinationsInfo

  const filterSections = (
    <div className='relative min-h-[300px]'>
      <LoadingOverlay
        visible={!searchResultQuery.data || searchResultQuery.isLoading}
        zIndex={20}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ type: 'bars' }}
      />
      <div className='flex justify-between'>
        <Title className='text-xl font-medium'>Filtreler</Title>
        <UnstyledButton
          hidden={!Object.values(restFilterParams).find(Boolean)}
          fz='xs'
          className='px-4 font-semibold text-blue-500'
          onClick={() => {
            setFilterParams(null)
          }}
        >
          Temizle
        </UnstyledButton>
      </div>
      <div className='pt-3'>
        <Accordion
          defaultValue={[
            'byName',
            'priceRange',
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
          <Accordion.Item value='byName'>
            <Accordion.Control>Otel Adına Göre</Accordion.Control>
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
          {destinationsInfos && (
            <Accordion.Item value='destinationIds'>
              <Accordion.Control>Yakın Çevre</Accordion.Control>
              <Accordion.Panel>
                <DestinationIds destinationsInfo={destinationsInfos} />
              </Accordion.Panel>
            </Accordion.Item>
          )}
          {searchResultQuery.data?.pages.at(-1)?.searchResults.at(-1)
            ?.pensionTypes && (
            <Accordion.Item value='pensionTypes'>
              <Accordion.Control>Konaklama Tipi</Accordion.Control>
              <Accordion.Panel>
                <PensionTypes
                  data={
                    searchResultQuery.data?.pages.at(-1)?.searchResults.at(-1)
                      ?.pensionTypes
                  }
                />
              </Accordion.Panel>
            </Accordion.Item>
          )}
          {searchResultQuery.data?.pages.at(-1)?.searchResults.at(-1)
            ?.themes && (
            <Accordion.Item value='themes'>
              <Accordion.Control>Temalar</Accordion.Control>
              <Accordion.Panel>
                <Themes
                  data={
                    searchResultQuery.data?.pages.at(-1)?.searchResults.at(-1)
                      ?.themes
                  }
                />
              </Accordion.Panel>
            </Accordion.Item>
          )}
        </Accordion>
      </div>
    </div>
  )

  return (
    <>
      <div className='border-b md:py-4' ref={targetRef}>
        <Container>
          {isLocationInfoLoading && <Skeleton h={52} />}
          {!isLocationInfoLoading && (
            <>
              <div className='relative py-2 text-xs md:hidden'>
                <button
                  className='absolute start-0 end-0 top-0 bottom-0 z-10'
                  onClick={toggleSearchEngineVisibility}
                />

                <div className='flex items-center gap-2'>
                  <div className='font-medium'>{destination?.Name}</div>
                  <div className='z-0 ms-auto rounded-md bg-blue-200 p-2'>
                    <IoSearchSharp size={24} className='text-blue-800' />
                  </div>
                </div>
              </div>
              <Collapse in={isBreakPointMatchesMd || isSearchEngineOpened}>
                <div className='pb-3 md:pb-0'>
                  <HotelSearchEngine
                    showCalendar={searchEnginCalendarVisible}
                    onCalendarClose={() => {
                      setSearchEnginCalendarVisible(false)
                    }}
                    defaultValues={{
                      checkinDate: dayjs().add(13, 'days').toDate(),
                      checkoutDate: dayjs().add(20, 'days').toDate(),
                      destination: {
                        id: destination?.Id ?? 0,
                        name: destination?.Name ?? '',
                        slug: destination?.Slug ?? '',
                        type: destination?.Type ?? 0,
                      },
                      rooms: [{ adult: 2, child: 0, childAges: [] }],
                    }}
                  />
                </div>
              </Collapse>
            </>
          )}
        </Container>
      </div>
      <Container className='px-0 md:py-3'>
        <Grid>
          <Grid.Col span={{ sm: 4, md: 3 }} visibleFrom='sm'>
            {filterSections}
          </Grid.Col>
          <Grid.Col span={{ sm: 8, md: 9 }}>
            <SearchCopyCode data={searchCopyCode} />
            <div className='flex justify-between py-4 md:hidden'>
              <Button
                size='sm'
                color='black'
                className='border-gray-400 px-8 font-medium'
                variant='outline'
                onClick={openFilterDrawer}
                hiddenFrom='sm'
              >
                Filtreler
              </Button>
              <NativeSelect
                className='mx-1 ms-auto w-50 font-medium'
                size='sm'
                style={{ width: 'fit-content' }}
                value={orderBy}
                onChange={({ currentTarget: { value } }) => {
                  setFilterParams({
                    orderBy: value as HotelSortOrderEnums,
                  })
                }}
                data={[
                  {
                    value: HotelSortOrderEnums.listingRateDescending,
                    label: 'Popüler Oteller',
                  },
                  // {
                  //   label: 'Fiyata Göre Artan ',
                  //   value: HotelSortOrderEnums.priceAscending,
                  // },
                  // {
                  //   label: 'Fiyata Göre Azalan',
                  //   value: HotelSortOrderEnums.priceDescending,
                  // },

                  {
                    value: HotelSortOrderEnums.nameAscending,
                    label: 'İsme Göre (A-Z)',
                  },
                  {
                    value: HotelSortOrderEnums.nameDescending,
                    label: 'İsme Göre (Z-A)',
                  },
                  {
                    value: HotelSortOrderEnums.starAscending,
                    label: 'Yıldız Sayısı (Artan)',
                  },
                  {
                    value: HotelSortOrderEnums.starDescending,
                    label: 'Yıldız Sayısı (Azalan)',
                  },
                ]}
              />
            </div>
            {!searchResultQuery.data || searchResultQuery.isLoading ? (
              <div className='my-2'>
                <LoaderBanner
                  data={loaderBannerHotel}
                  moduleName='Oteller'
                  Icon={MdLocalHotel}
                />
                {[1, 2, 3, 4, 5, 6].map((arrIndex) => (
                  <div
                    key={arrIndex}
                    className='my-4 rounded-lg border-2 border-gray-200 p-4'
                  >
                    <div className='flex gap-4'>
                      <Skeleton height={120} width={100} radius='md' />
                      <div className='flex-1 space-y-3'>
                        <Skeleton height={20} width='60%' />
                        <Skeleton height={16} width='40%' />
                        <Skeleton height={16} width='80%' />
                        <div className='flex gap-2'>
                          <Skeleton height={24} width={60} />
                          <Skeleton height={24} width={60} />
                          <Skeleton height={24} width={60} />
                        </div>
                        <div className='flex justify-between'>
                          <Skeleton height={20} width='30%' />
                          <Skeleton height={32} width={100} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <Stack gap={'lg'}>
                <div className='mt-2 hidden w-full items-center gap-2 md:flex'>
                  {orderByOptions.map((option) => (
                    <Button
                      size='sm'
                      className={
                        orderBy === option.value
                          ? 'flex-1 rounded-md border-0 bg-blue-200 font-medium text-blue-700'
                          : 'flex-1 rounded-md border-gray-400 font-normal text-black hover:bg-blue-50 hover:text-blue-700'
                      }
                      key={option.value}
                      leftSection={orderBy === option.value ? <FaCheck /> : ''}
                      color='blue'
                      variant={orderBy === option.value ? 'filled' : 'outline'}
                      onClick={() =>
                        setFilterParams({
                          orderBy: option.value,
                        })
                      }
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
                {searchResultQuery.data?.pages.every(
                  (page) =>
                    !page?.searchResults[0].hotelInfos ||
                    page?.searchResults[0].hotelInfos.length === 0
                ) && <Alert color='red'>Sonuç Bulunamadı</Alert>}
                {searchResultQuery.data?.pages.map((page) =>
                  page?.searchResults?.map((searchResult) => {
                    return searchResult?.hotelInfos?.map((hotelInfo) => {
                      return (
                        <div key={hotelInfo.id}>
                          <HotelSearchResultItem
                            hotelInfo={hotelInfo}
                            searchToken=''
                            sessionToken=''
                            onMapClick={() => {
                              openMapsModal()
                              setHotelInfo(hotelInfo)
                            }}
                            campaignContents={hotelCampaignsQuery?.data}
                            onDateSelect={() => {
                              scrollIntoView()

                              openSearchEngineVisibility()
                              setSearchEnginCalendarVisible(true)
                            }}
                          />
                        </div>
                      )
                    })
                  })
                )}
              </Stack>
            )}

            {hasMoreResponse && (
              <div className='my-3 flex justify-center'>
                <Button
                  className='mx-auto'
                  size='lg'
                  loading={searchResultQuery.isFetchingNextPage}
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault()
                    searchResultQuery.fetchNextPage()
                  }}
                >
                  Daha Fazla Yükle
                </Button>
              </div>
            )}
          </Grid.Col>
        </Grid>
      </Container>
      <Modal
        opened={isMapsModalOpened}
        onClose={closeMapsModal}
        size={'xl'}
        title={hotelInfo?.name}
      >
        <HotelMap hotelInfo={hotelInfo} />
      </Modal>
      <Drawer
        opened={isFilterDrawerOpen}
        onClose={closeFilterDrawer}
        hiddenFrom='sm'
      >
        {filterSections}
      </Drawer>
    </>
  )
}
