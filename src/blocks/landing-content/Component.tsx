'use client'

import { Title, Paper } from '@mantine/core'

type LandingContentBlockProps = {
  title?: string
  description?: string
}

export const LandingContentBlock: React.FC<LandingContentBlockProps> = ({
  title,
  description,
}) => {
  if (!title && !description) {
    return null
  }

  return (
    <Paper shadow='md' p='xl' radius='md' className='bg-white text-gray-800'>
      {title && (
        <Title
          order={2}
          className='mb-4 text-2xl font-bold md:text-3xl'
        >
          {title}
        </Title>
      )}
      {description && (
        <div
          className='prose prose-lg max-w-none text-gray-800'
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        />
      )}
    </Paper>
  )
}
