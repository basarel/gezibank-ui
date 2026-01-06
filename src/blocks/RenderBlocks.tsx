import React from 'react'
import { Container } from '@mantine/core'
import { ThemeCardsBlock } from './theme-cards/Component'
import { StorySliderBlock } from './story-slider/Component'
import { HolidayThemesBlock } from './holiday-themes/Component'
import { TrendRegionsBlock } from './trend-regions/Component'
import { MainBannerBlock } from './main-banner/Component'
import { PopulerLinksBlock } from './populer-links/Component'
import { VideoPromoBlock } from './video-promo/Component'
import { HomeCampaignsBlock } from './home-campaigns/Component'
import { VideoContentsBlock } from './video-contents/Component'
import { BottomSliderBlock } from './bottom-slider/Component'
import { LandingGridBlock } from './landing-grid/Component'
import { LandingContentBlock } from './landing-content/Component'
import { LandingFaqBlock } from './landing-faq/Component'
import { LatestBlogsBlock } from './latest-blogs/Component'
import { ContactBlock } from './contact-block/Component'
import { TourCalendarBlock } from './tour-calendar-block/Component'
import { EmptyContentBlock } from './empty-content/Component'
type Block = {
  blockType: string
  [key: string]: any
}

type RenderBlocksProps = {
  blocks: Block[]
}

const blockComponents: Record<string, React.ComponentType<any>> = {
  themeCards: ThemeCardsBlock,
  storySlider: StorySliderBlock,
  holidayThemes: HolidayThemesBlock,
  trendRegions: TrendRegionsBlock,
  mainBanner: MainBannerBlock,
  popularLinks: PopulerLinksBlock,
  videoPromo: VideoPromoBlock,
  homeCampaigns: HomeCampaignsBlock,
  videoContents: VideoContentsBlock,
  bottomSlider: BottomSliderBlock,
  landingGrid: LandingGridBlock,
  landingContent: LandingContentBlock,
  landingFaq: LandingFaqBlock,
  latestBlogs: LatestBlogsBlock,
  contactBlock: ContactBlock,
  tourCalendarBlock: TourCalendarBlock,
  emptyContent: EmptyContentBlock,
}

export const RenderBlocks: React.FC<RenderBlocksProps> = ({ blocks }) => {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null
  }
  const fullWidthBlocks = ['mainBanner', 'storySlider', 'tourCalendarBlock']
  return (
    <div className='flex flex-col gap-10'>
      {blocks.map((block, index) => {
        const blockId = block.id || `block-${index}`
        const { blockType, id, ...blockData } = block

        if (block && 'isActive' in block && block.isActive === false) {
          return null
        } // cms e eklendı BY

        if (blockType && blockType in blockComponents) {
          const BlockComponent = blockComponents[blockType]
          const isFullWidth = fullWidthBlocks.includes(blockType)

          if (isFullWidth) {
            return <BlockComponent key={blockId} {...blockData} />
          }
          return (
            <Container key={blockId} className='w-full'>
              <BlockComponent {...blockData} />
            </Container>
          )
        }

        return null
      })}
    </div>
  )
}
