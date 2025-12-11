'use client'

import React, { useState, useEffect } from 'react'
import {
  Button,
  Checkbox,
  CloseButton,
  Collapse,
  Container,
  Divider,
  NativeSelect,
  rem,
  RemoveScroll,
  Skeleton,
  Stack,
  Title,
  Transition,
  UnstyledButton,
} from '@mantine/core'
import dayjs from 'dayjs'
import { useDisclosure, useMediaQuery } from '@mantine/hooks'
import { FaCheck } from 'react-icons/fa'
import { IoSearchSharp } from 'react-icons/io5'
import { MdLocalTaxi, MdSubdirectoryArrowLeft } from 'react-icons/md'

import { TransferSearchItem } from '@/app/transfer/search-results/search-item'
import { useQueryStates } from 'nuqs'
import {
  filterParsers,
  SortOrderEnums,
} from '@/modules/transfer/searchParams.client'
import { useFilterActions } from './useFilterActions'
import { PriceRangeSlider } from './_components/price-slider'
import { cleanObj, formatCurrency } from '@/libs/util'
import { TransferSearchEngine } from '@/modules/transfer'
import { useDestinationGetBySlug } from '@/hooks/destination'
import { useTransferSearchResults } from './useSearchResults'
import { LoaderBanner } from '@/app/hotel/search-results/components/loader-banner'
import { getContent } from '@/libs/cms-data'
import { CmsContent, Widgets } from '@/types/cms-types'
import { useQuery } from '@tanstack/react-query'
import { Params } from '@/app/car/types'
import { NotFoundForm } from '@/app/hotel/(detail)/[slug]/_components/no-rooms-form'
import Breadcrumb from '@/app/breadcrumb'
import { TbArrowBack } from 'react-icons/tb'

const TransferSearchResults = () => {
  const [{ order, ...filterParams }, setFilterParams] =
    useQueryStates(filterParsers)
  const { searchParams, searchResultsQuery: transferSearchResultsQuery } =
    useTransferSearchResults()

  const [filterSectionIsOpened, setFilterSectionIsOpened] = useState(false)
  const isBreakPointMatchesMd = useMediaQuery('(min-width: 62em)')
  const [
    isSearchEngineOpened,
    { toggle: toggleSearchEngineVisibility, close: closeSearchEngine },
  ] = useDisclosure(false)
  useEffect(() => {
    return () => closeSearchEngine()
  }, [closeSearchEngine, transferSearchResultsQuery.data])

  const { data: cmsData } = useQuery({
    queryKey: ['cms-data', 'transfer-arama'],
    queryFn: () =>
      getContent<CmsContent<Widgets, Params>>('transfer-arama').then(
        (response) => response?.data
      ),
  })
  const loaderBannerTransfer =
    cmsData?.widgets?.filter(
      (x) => x.point === 'loader_banner_transfer_react'
    ) ?? []

  const searchResults =
    transferSearchResultsQuery.data?.pages.flatMap((page) =>
      page.searchResults.flatMap((searchResults) => searchResults.vehicles)
    ) ?? []

  const isRealLoading = !transferSearchResultsQuery.data
  const hasResults = searchResults.length > 0
  const isResultsLoading =
    isRealLoading ||
    (!hasResults &&
      (transferSearchResultsQuery.isFetching ||
        transferSearchResultsQuery.isLoading))

  const maxPrice = Math.ceil(
    Math.max(
      ...searchResults.map((data) => data.transferData.bookDetail.sortPrice)
    )
  )
  const minPrice = Math.floor(
    Math.min(
      ...searchResults.map((data) => data.transferData.bookDetail.sortPrice)
    )
  )
  const vehicleTypeChecks = searchResults.map((result) => ({
    id: result.vehicleType,
    label: result?.vehicleTitle?.split('-')?.shift()?.trim(),
  }))
  const paxChecks = [
    ...new Set(
      searchResults.map((result) => result.transferInfo.transferMax.pax)
    ),
  ].sort((a, b) => +a - +b)

  const filteredData = useFilterActions(searchResults)
  const filterOptions = [
    {
      label: 'Fiyata Göre Artan ',
      value: SortOrderEnums.priceAsc,
    },
    {
      label: 'Fiyata Göre Azalan',
      value: SortOrderEnums.priceDesc,
    },
  ]
  const totalCount = searchResults.length ?? 0
  // const destinationName = searchResults[0].transferData.selectedTransferDetail

  if (transferSearchResultsQuery.hasNextPage) {
    transferSearchResultsQuery.fetchNextPage()
  }
  const destinationInfoQuery = useDestinationGetBySlug({
    slugs: [
      searchParams.originSlug as string,
      searchParams.destinationSlug as string,
    ],
    moduleName: 'Transfer',
  })
  const destinationInfoData = destinationInfoQuery.data ?? []
  const originName =
    destinationInfoData.find(
      (destination) => destination?.Result.Slug === searchParams.originSlug
    )?.Result.Name ?? ''
  const destinationName =
    destinationInfoData.find(
      (destination) => destination?.Result.Slug === searchParams.destinationSlug
    )?.Result.Name ?? ''
  const isBreadcrumbLoading = isRealLoading || destinationInfoQuery.pending

  return (
    <>
      <div className='border-b py-3 md:py-6'>
        <Container>
          <div className='relative flex items-center gap-2 text-sm md:hidden'>
            <button
              className='absolute start-0 end-0 top-0 bottom-0 z-10'
              onClick={toggleSearchEngineVisibility}
            />
            <div>
              <div className='relative grid items-center'>
                <div className='flex items-center gap-1 font-medium'>
                  {originName || '...'}
                </div>
                <div className='absolute end-0 top-1/2 -me-7 mt-1 -translate-y-1/2'>
                  {' '}
                  <TbArrowBack size={25} />
                </div>
                <div className='font-medium'>{destinationName || '...'}</div>
              </div>
              <div className='flex-1 grow'>
                {dayjs(searchParams.date).format('DD MMMM ddd')} -{' '}
                {searchParams.time} - {searchParams.adultPassengerCount} Kişi
              </div>
            </div>
            <div className='z-0 ms-auto rounded-md bg-blue-100 p-2'>
              <IoSearchSharp size={24} className='text-blue-800' />
            </div>
          </div>
          <Collapse in={isBreakPointMatchesMd || isSearchEngineOpened}>
            <div className='pt-3 md:pt-0'>
              <TransferSearchEngine />
            </div>
          </Collapse>
        </Container>
      </div>
      <div className='relative'>
        <Container py={'lg'}>
          <div className='mb-4 hidden md:block'>
            {isBreadcrumbLoading ? (
              <Skeleton w='30%' h={25} radius='sm' />
            ) : (
              <>
                <Breadcrumb
                  items={[
                    { title: 'Transfer', href: '/transfer' },
                    {
                      title:
                        originName && destinationName
                          ? `${originName} - ${destinationName}`
                          : 'Transfer Arama',
                    },
                  ]}
                />
              </>
            )}
          </div>
          <div className='grid gap-0 md:grid-cols-8 md:gap-7'>
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
                      className='fixed start-0 end-0 top-0 bottom-0 z-10 overflow-y-auto bg-white p-3 md:static md:p-0'
                      style={styles}
                    >
                      <div className='flex justify-end md:hidden'>
                        <CloseButton
                          onClick={() => setFilterSectionIsOpened(false)}
                        />
                      </div>
                      {isResultsLoading ? (
                        <div className='rounded-lg bg-white p-2'>
                          <Skeleton h={24} w='50%' className='mb-4' />

                          <div className='mt-3 mb-6'>
                            <Skeleton h={20} w='40%' className='mb-3' />
                            <Skeleton h={40} w='100%' />
                          </div>

                          <div className='mt-3 mb-6'>
                            <Skeleton h={20} w='55%' className='mb-3' />
                            <div className='space-y-2'>
                              {[1, 2, 3, 4].map((index) => (
                                <div
                                  key={index}
                                  className='flex items-center gap-2'
                                >
                                  <Skeleton h={16} w={16} />
                                  <Skeleton h={16} w={110} />
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className='mt-3 mb-6'>
                            <Skeleton h={16} w='55%' className='mb-3' />
                            <div className='space-y-2'>
                              {[1, 2, 3, 4].map((index) => (
                                <div
                                  key={index}
                                  className='flex items-center gap-2'
                                >
                                  <Skeleton
                                    h={16}
                                    w={16}
                                    className='rounded-full'
                                  />
                                  <Skeleton
                                    h={16}
                                    w={110}
                                    className='rounded-full'
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className='flex justify-between px-3 pb-6 md:px-0'>
                            <Title className='text-xl font-medium'>
                              Filtreler
                            </Title>
                            <div
                              hidden={
                                Object.keys(cleanObj(filterParams)).length === 0
                              }
                            >
                              <UnstyledButton
                                fz='sm'
                                className='px-4 font-semibold text-blue-500'
                                onClick={() => {
                                  setFilterParams(null)
                                }}
                              >
                                Temizle
                              </UnstyledButton>
                            </div>
                          </div>
                          <div>
                            <div className='pb-5'>
                              <div className='flex justify-between pb-4'>
                                <div>
                                  {formatCurrency(
                                    filterParams.priceRange
                                      ? filterParams.priceRange[0]
                                      : minPrice
                                  )}
                                </div>
                                <div>
                                  {formatCurrency(
                                    filterParams.priceRange
                                      ? filterParams.priceRange[1]
                                      : maxPrice
                                  )}
                                </div>
                              </div>
                              <div className='px-3'>
                                <PriceRangeSlider
                                  minPrice={minPrice}
                                  maxPrice={maxPrice}
                                />
                              </div>
                            </div>
                            <Divider my={'md'} />
                            <div>
                              <Title order={5}>Araç Türleri</Title>
                              <Checkbox.Group
                                pt={rem(12)}
                                onChange={(values) => {
                                  setFilterParams({
                                    vehicle: values.length
                                      ? values.map(String)
                                      : null,
                                  })
                                }}
                                value={
                                  filterParams.vehicle
                                    ? filterParams.vehicle
                                    : []
                                }
                                classNames={{
                                  root: 'filter-accordion',
                                }}
                              >
                                <Stack gap={rem(6)}>
                                  {vehicleTypeChecks
                                    .filter(
                                      (item, itemIndex, itemArr) =>
                                        itemArr.findIndex(
                                          (item2) => item.id === item2.id
                                        ) === itemIndex
                                    )
                                    .map((data, dataIndex) => (
                                      <Checkbox
                                        key={dataIndex}
                                        label={data.label}
                                        value={data.id.toString()}
                                      />
                                    ))}
                                </Stack>
                              </Checkbox.Group>
                            </div>
                            <Divider my={'md'} />
                            <div>
                              <Title order={5}>Alabileceği Yolcu Sayısı</Title>
                              <Checkbox.Group
                                pt={rem(12)}
                                value={filterParams.pax ? filterParams.pax : []}
                                onChange={(values) => {
                                  setFilterParams({
                                    pax: values.length ? values : null,
                                  })
                                }}
                                classNames={{
                                  root: 'filter-accordion',
                                }}
                              >
                                <Stack gap={rem(6)}>
                                  {paxChecks.map((data) => (
                                    <Checkbox
                                      key={data}
                                      label={data}
                                      value={data}
                                    />
                                  ))}
                                </Stack>
                              </Checkbox.Group>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </RemoveScroll>
                )}
              </Transition>
            </div>
            <div className='md:col-span-6'>
              <div className='flex justify-between gap-1 pb-3'>
                <Skeleton
                  className='col-span-2 hidden md:flex'
                  visible={isResultsLoading}
                >
                  <>
                    <div className='hidden items-center gap-2 md:flex'>
                      <div>
                        <span className='text-lg font-bold'>Transferiniz</span>{' '}
                        İçin Toplam{' '}
                        <span className='text-lg font-bold'> {totalCount}</span>{' '}
                        Araç Bulundu
                      </div>
                    </div>
                  </>
                </Skeleton>
                <Skeleton className='w-40 md:w-full' visible={isResultsLoading}>
                  <Button
                    size='sm'
                    color='black'
                    className='flex border-gray-400 px-6 font-medium md:hidden'
                    variant='outline'
                    onClick={() => setFilterSectionIsOpened((prev) => !prev)}
                    hiddenFrom='md'
                  >
                    Filtreler
                  </Button>

                  <div className='hidden items-center justify-end gap-1 md:flex'>
                    {filterOptions.map((option) => (
                      <Button
                        size='sm'
                        className={
                          order === option.value
                            ? 'rounded-md border-0 bg-blue-200 px-3 font-medium text-blue-700'
                            : 'rounded-md border-gray-400 px-3 font-normal text-black hover:bg-blue-50 hover:text-blue-700'
                        }
                        key={option.value}
                        leftSection={order === option.value ? <FaCheck /> : ''}
                        color='blue'
                        variant={order === option.value ? 'filled' : 'outline'}
                        onClick={() =>
                          setFilterParams({
                            order: option.value,
                          })
                        }
                      >
                        {option.label}
                      </Button>
                    ))}
                  </div>
                </Skeleton>
                <Skeleton className='md:hidden' visible={isResultsLoading}>
                  <div>
                    <NativeSelect
                      leftSection={<FaCheck />}
                      className='font-medium md:hidden'
                      size='sm'
                      value={order ? order : ''}
                      data={[
                        {
                          label: 'Fiyata Göre Artan ',
                          value: SortOrderEnums.priceAsc,
                        },
                        {
                          label: 'Fiyata Göre Azalan',
                          value: SortOrderEnums.priceDesc,
                        },
                      ]}
                      onChange={({ target: { value } }) => {
                        setFilterParams({
                          order: value as SortOrderEnums,
                        })
                      }}
                    />
                  </div>
                </Skeleton>
              </div>
              <Skeleton
                className='col-span-2 mt-2 mb-4 flex md:hidden'
                visible={isResultsLoading}
              >
                <>
                  <div className='flex items-center gap-2 md:hidden'>
                    <div className='text-sm font-semibold text-gray-500'>
                      Transferiniz İçin Toplam{' '}
                      <span className='text-xl font-bold'>{totalCount}</span>{' '}
                      Araç Bulundu
                    </div>
                  </div>
                </>
              </Skeleton>
              <div className='grid gap-4 md:gap-6'>
                {isResultsLoading && (
                  <>
                    <React.Fragment>
                      <LoaderBanner
                        data={loaderBannerTransfer}
                        moduleName='Transferler'
                        Icon={MdLocalTaxi}
                      />
                    </React.Fragment>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index} className='mb-4 rounded-lg border-2 p-4'>
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
                  </>
                )}

                {!transferSearchResultsQuery.isFetchingNextPage &&
                  !transferSearchResultsQuery.isLoading &&
                  !transferSearchResultsQuery.isFetching &&
                  !isResultsLoading &&
                  transferSearchResultsQuery.data &&
                  transferSearchResultsQuery.data.pages &&
                  filteredData.length === 0 && (
                    <NotFoundForm moduleName='Transfer' />
                  )}

                {filteredData?.map((data) => {
                  return <TransferSearchItem key={data.id} data={data} />
                })}
              </div>
            </div>
          </div>
        </Container>
      </div>
    </>
  )
}

export { TransferSearchResults }
