'use client'

import React, { Fragment } from 'react'
import { Container } from '@mantine/core'
import { ThemeCardsBlock } from './theme-cards/Component'
import { StorySliderBlock } from './story-slider/Component'
import { HolidayThemesBlock } from './content-block/Component'
import { TrendRegionsBlock } from './trend-regions/Component'
import { MainBannerBlock } from './main-banner/Component'
import { PopulerLinksBlock } from './populer-links/Component'
 
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
  populerlinks: PopulerLinksBlock,
 }

export const RenderBlocks: React.FC<RenderBlocksProps> = ({ blocks }) => {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) {
    return null
  }
  const fullWidthBlocks = ['mainBanner', 'storySlider']

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const blockId = block.id || `block-${index}`
        const { blockType, id, ...blockData } = block

        if (block && 'isActive' in block && block.isActive === false) {
          return null
        }

        if (blockType && blockType in blockComponents) {
          const BlockComponent = blockComponents[blockType]
          const isFullWidth = fullWidthBlocks.includes(blockType)

          if (isFullWidth) {
            return <BlockComponent key={blockId} {...blockData} />
          }
          return (
            <Container key={blockId} className='my-5'>
              <BlockComponent {...blockData} />
            </Container>
          )
        }

        return null
      })}
    </Fragment>
  )
}
