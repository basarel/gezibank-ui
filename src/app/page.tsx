import {
  Container,
  Title,
  ScrollArea,
  Tabs,
  TabsList,
  TabsTab,
  TabsPanel,
  SimpleGrid,
  Anchor,
  px,
  Collapse,
  Badge,
  Button,
} from '@mantine/core'
import Image from 'next/image'
import { Link } from 'next-view-transitions'
import { Route } from 'next'

import { SearchEngine } from '@/components/search-engine/'
import { StorySlider } from '@/components/home/story-slider'
import { CmsContent, Params, TourDealType, Widgets } from '@/types/cms-types'
import { UpComingHolidays } from '@/components/home/upcoming-holidays'
import { LastOpportunity } from '@/components/home/last-opportunity'
import { RecommendedProducts } from '@/components/home/recommended-products'

import { TrendRegions } from '@/components/home/trend-regions'
import { HolidayThemes } from '@/components/home/holiday-themes'
import { VideoPromo } from '@/components/home/video-promo'

import { MainBannerCarousel } from '@/components/main-banner'
import { serviceRequest } from '@/network'
import { TourOpportunity } from '@/components/home/tour-opportunity'
import { EbultenForm } from '@/components/home/ebulten-form'

import populerDestinationClasses from '@/styles/OutlineTabs.module.css'
import { HomeTourDom } from '@/components/home/home-tours'
import { CallFormDrawer } from '@/components/call-form/CallFormDrawer'
import { FaArrowRight, FaChevronRight } from 'react-icons/fa'
import { FaArrowRightLong, FaMapLocationDot } from 'react-icons/fa6'
import { IoClose } from 'react-icons/io5'

export default async function Home() {
  const response = await fetch(
    `${process.env.SERVICE_PATH}/api/cms/content?` +
      new URLSearchParams({ slug: 'ana-sayfa' }),
    {
      cache: 'no-store',
    }
  )
  const responseData = (await response.json()) as {
    data: CmsContent<Widgets, Params>
  }
  const tourDeals = await serviceRequest<TourDealType[]>({
    axiosOptions: {
      url: 'api/cms/getDealList',
      params: {
        channel: 7,
        pageNumber: 1,
        placement: 'homepage',
        takeCount: 100,
        languageCode: 'tr_TR',
      },
    },
  })

  const cmsData = responseData.data

  const landingMenus = cmsData?.params.landing_menu

  const dealsOfWeekData = cmsData?.widgets.filter(
    (x) => x.point === 'deals_of_week'
  )
  const youtube_area = cmsData?.widgets?.filter((x) => x.point == 'tour_themes')

  const recommendedProductsData = cmsData?.widgets.filter(
    (x) => x.point === 'tour_deals'
  )
  const hotelDestinationsBtns = cmsData?.widgets.filter(
    (x) => x.point === 'hotel_deals_btns'
  )
  const holidayThemesData = cmsData?.widgets.filter(
    (x) => x.point === 'tour_themes'
  )

  const trendRegionsData = cmsData?.widgets.filter(
    (x) => x.point === 'tour_popular_regions'
  )
  const hotelPopularRegionsBtns = cmsData?.widgets.filter(
    (x) => x.point === 'hotel_popular_regions_btns'
  )
  const upcomingHolidaysData = cmsData?.widgets.filter(
    (x) => x.point === 'upcoming_holidays'
  )
  const lastOpportunityData = cmsData?.widgets.filter(
    (x) => x.point === 'last_opportunity'
  )
  const homeTourDomData = cmsData?.widgets.filter(
    (x) => x.point === 'home_tour_dom'
  )
  const headerInfoReact = cmsData?.widgets?.find(
    (item) => item.point === 'header_info'
  )
  const videoPromoData = cmsData?.widgets?.find(
    (item) => item.point === 'youtube_area' || item.point === 'youtube_area'
  )
  return (
    <div className='flex flex-col gap-4 md:gap-10'>
      <div className='relative'>
        <Image
          src='https://ykmturizm.mncdn.com/11/Files/638923998198240440.jpg'
          fill
          alt='GeziBank'
          priority
          className='absolute top-0 left-0 -z-50 hidden h-full w-full md:block object-cover'
          style={{
            clipPath: 'ellipse(90% 90% at 50% 00%)',
          }}
        />
        <div className='absolute top-0 right-0 m-1 hidden rounded bg-gray-200 p-1 text-center text-xs opacity-85 md:flex'>
          CRASSULA TURİZM SEYAHAT ACENTASI Belge No: 15092
        </div>
        <div>
          <Container className='px-0 md:px-4 md:pt-[58px]'>
            {headerInfoReact && (
              <div className='relative mb-10 hidden overflow-hidden rounded-lg md:block'>
                <div className='absolute inset-0 bg-linear-to-b from-gray-800/70 via-gray-700/75 to-gray-800/80 px-4 opacity-80' />
                <div className='relative z-10 flex min-h-[55px] items-center justify-between p-6 md:p-3 md:py-2'>
                  <div className='flex-1'>
                    <div className='relative flex justify-center py-2 text-white'>
                      <Container className='grid w-full items-center justify-between px-0 font-medium md:flex'>
                        <div className='flex items-center gap-3'>
                          <div>
                            <FaMapLocationDot size={30} />
                          </div>
                          <Link
                            className='text-sm'
                            href={headerInfoReact.params.link.value as Route}
                          >
                            <div
                              dangerouslySetInnerHTML={{
                                __html:
                                  headerInfoReact.params.description.value ??
                                  '',
                              }}
                            />
                          </Link>
                        </div>
                        <div className='hidden items-center justify-center gap-2 md:flex'>
                          <Badge className='bg-blue-800/80 py-3 text-white'>
                            {headerInfoReact.params.sort_description.value}
                          </Badge>
                          <Link
                            className='font-bold hover:underline'
                            href={headerInfoReact.params.link.value as Route}
                          >
                            {headerInfoReact.params.btn_text.value}
                          </Link>
                          <FaChevronRight />
                        </div>
                      </Container>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Title
              className='hidden text-center font-medium text-white md:mb-10 md:block'
              style={{ fontSize: '32px' }}
            >
              GeziBank ile Tatilin keyfini çıkarın!
            </Title>
            <div className='mb-1 rounded bg-gray-200 p-1 py-2 text-center text-xs opacity-85 md:hidden'>
              CRASSULA TURİZM SEYAHAT ACENTASI Belge No: 15092
            </div>
            <div className='z-50 bg-white shadow-lg md:rounded-lg md:border'>
              <SearchEngine />
            </div>
          </Container>
        </div>
      </div>

      {dealsOfWeekData && (
        <div className='py-3 md:py-8'>
          <StorySlider data={dealsOfWeekData} />
        </div>
      )}
      <div>
        {youtube_area && (
          <div className='mb-10'>
            <MainBannerCarousel
              slides={youtube_area.map((slide) => ({
                ...slide,
                id: String(slide.id),
                Title: slide.title,
              }))}
            />
          </div>
        )}
        <Container className='gap-7 md:gap-10'>
          {upcomingHolidaysData && upcomingHolidaysData.length > 0 && (
            <div>
              <UpComingHolidays data={upcomingHolidaysData} />
            </div>
          )}

          {lastOpportunityData && lastOpportunityData?.length > 0 && (
            <div>
              <LastOpportunity data={lastOpportunityData} />
            </div>
          )}
          {videoPromoData && <VideoPromo data={videoPromoData} />}

          {recommendedProductsData && recommendedProductsData.length > 0 && (
            <div>
              <h2 className='relative mx-auto my-8 w-fit border-blue-800 py-3 text-center text-2xl font-bold text-blue-600 md:text-3xl'>
                Tavsiye Ettiğimiz Tur Fırsatları
                <div className='absolute bottom-0 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-blue-600'></div>
              </h2>
              {hotelDestinationsBtns && hotelDestinationsBtns?.length > 0 && (
                <div className='hidden gap-3 overflow-hidden py-8 whitespace-nowrap md:flex'>
                  <ScrollArea w={'100%'}>
                    <div className='flex gap-3 pb-5'>
                      {hotelDestinationsBtns
                        ?.sort((a, b) => a.ordering - b.ordering)
                        ?.map((hotelDestination) => (
                          <CategoryLink
                            key={hotelDestination.id}
                            link={hotelDestination.params.link.value as Route}
                            title={hotelDestination.title}
                          />
                        ))}
                    </div>
                  </ScrollArea>
                </div>
              )}

              <div>
                <RecommendedProducts data={recommendedProductsData} />
              </div>
            </div>
          )}
          {homeTourDomData && homeTourDomData.length > 0 && (
            <div>
              <h2 className='relative mx-auto my-8 w-fit border-blue-800 py-3 text-center text-2xl font-bold text-blue-600 md:text-3xl'>
                Yurtiçi Kültür Turları
                <div className='absolute bottom-0 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-blue-600'></div>
              </h2>
              <div>
                <HomeTourDom data={homeTourDomData} />
              </div>
              <div>* Çift kişilik odada kişi fiyatıdır.</div>
            </div>
          )}
          {/* {tourDeals?.data && tourDeals.data?.length > 0 && (
            <>
              <h2 className='relative mx-auto mt-8 mb-8 w-fit py-3 text-center text-2xl font-bold text-blue-600 md:text-3xl'>
                Tur Fırsatları
                <div className='absolute bottom-0 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-blue-600'></div>
              </h2>
              <TourOpportunity data={tourDeals.data} />
            </>
          )} */}
          {trendRegionsData && trendRegionsData.length > 0 && (
            <div className='hidden sm:block'>
              <h2 className='relative mx-auto my-8 w-fit py-3 text-center text-2xl font-bold text-blue-600 md:text-3xl'>
                Trend Tatil Bölgeleri
                <div className='absolute bottom-0 left-1/2 h-2 w-12 -translate-x-1/2 rounded-full bg-blue-600'></div>
              </h2>
              {hotelPopularRegionsBtns?.map((hotelPopularRegionsBtn) => {
                return (
                  <div
                    className='hidden gap-3 overflow-hidden pb-8 md:block'
                    key={hotelPopularRegionsBtn.id}
                  >
                    <ScrollArea w={'100%'}>
                      <div className='flex gap-3 pb-5'>
                        {hotelPopularRegionsBtn.params.destinations?.destinations.map(
                          (destination) => (
                            <CategoryLink
                              key={destination.id}
                              link={
                                `/otel-listesi/${destination.slug}` as Route
                              }
                              title={destination.name}
                            />
                          )
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                )
              })}

              <TrendRegions data={trendRegionsData} />
            </div>
          )}
          <div>
            {holidayThemesData && <HolidayThemes data={holidayThemesData} />}
          </div>
          <EbultenForm />
          {landingMenus && landingMenus.menus.length > 0 && (
            <>
              <Title fz={{ base: 'h3', md: 'h2' }} mb={'md'}>
                Popüler Rotalar
              </Title>
              <div>
                <Tabs
                  defaultValue={'' + landingMenus?.menus[0].id}
                  variant='unstyle'
                  classNames={populerDestinationClasses}
                >
                  <ScrollArea
                    type='auto'
                    scrollbars='x'
                    scrollbarSize={0}
                    className='whitespace-nowrap'
                  >
                    <TabsList className='flex-nowrap gap-2'>
                      {landingMenus?.menus
                        .sort((a, b) => a.ordering - b.ordering)
                        .map((menu) => {
                          return (
                            <TabsTab key={menu.id} value={'' + menu.id}>
                              {menu.title}
                            </TabsTab>
                          )
                        })}
                    </TabsList>
                  </ScrollArea>

                  <div className='pt-3 md:pt-8'>
                    {landingMenus?.menus.map((menu) => (
                      <TabsPanel value={'' + menu.id} key={menu.id}>
                        <SimpleGrid
                          className='gap-2 overflow-x-auto whitespace-nowrap md:gap-1'
                          cols={{ base: 2, md: 4 }}
                          spacing={'xs'}
                        >
                          {menu.items.map((item) => (
                            <div key={item.id}>
                              <Anchor
                                href={item.url as Route}
                                className='text-dark-700'
                                component={Link}
                              >
                                {item.title}
                              </Anchor>
                            </div>
                          ))}
                        </SimpleGrid>
                      </TabsPanel>
                    ))}
                  </div>
                </Tabs>
              </div>
            </>
          )}
          <CallFormDrawer />
        </Container>
      </div>
    </div>
  )
}

const CategoryLink = ({ link, title }: { link: Route; title: string }) => (
  <Link
    target='_blank'
    href={link}
    className='block rounded-md border bg-white px-4 py-3 hover:bg-blue-100'
  >
    {title}
  </Link>
)
