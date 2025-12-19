'use client'

import {
  Title,
  Accordion,
  AccordionItem,
  AccordionControl,
  AccordionPanel,
} from '@mantine/core'

type FAQItem = {
  id: string
  question: string
  answer: string
}

type LandingFaqBlockProps = {
  title?: string
  items?: FAQItem[]
}

export const LandingFaqBlock: React.FC<LandingFaqBlockProps> = ({
  title = 'Sıkça Sorulan Sorular',
  items = [],
}) => {
  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className='w-full'>
      <Title
        order={2}
        className='mb-6 text-start text-2xl font-bold md:text-3xl'
      >
        {title}
      </Title>
      <Accordion
        chevronPosition='right'
        variant='contained'
        radius='md'
        className='w-full'
      >
        {items.map((item) => (
          <AccordionItem key={item.id} value={item.id} className='w-full'>
            <AccordionControl
              classNames={{
                label: 'font-medium py-2 md:py-4 text-base md:text-lg w-full',
                control: 'w-full',
              }}
            >
              {item.question}
            </AccordionControl>
            <AccordionPanel className='w-full'>
              <div
                className='prose prose-sm w-full max-w-none'
                dangerouslySetInnerHTML={{
                  __html: item.answer,
                }}
              />
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
