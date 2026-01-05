'use client'

import { Title, Text, Container } from '@mantine/core'

type EmptyContentBlockProps = {
  title?: string
  description?: string
}

export const EmptyContentBlock: React.FC<EmptyContentBlockProps> = ({
  title,
  description,
}) => {
  if (!title && !description) {
    return null
  }

  return (
    <div className='w-full py-8'>
      <Container size='lg'>
        {title && (
          <Title order={2} size='h2' className='mb-4 text-center text-gray-800'>
            {title}
          </Title>
        )}
        {description && (
          <Text size='md' className='text-center text-gray-600'>
            {description}
          </Text>
        )}
      </Container>
    </div>
  )
}

