import { getCampaigns, type Campaign } from '@/libs/payload'
import {
  AspectRatio,
  Card,
  CardSection,
  Image,
  rem,
  Title,
} from '@mantine/core'
import { Route } from 'next'
import { Link } from 'next-view-transitions'
import NextImage from 'next/image'

type PageProps = {
  categoryId: string
}

const CategoryContents: React.FC<PageProps> = async ({
  categoryId,
}): Promise<React.JSX.Element> => {
  const campaigns: Campaign[] = await getCampaigns(
    categoryId ? String(categoryId) : undefined
  )

  return (
    <div className='@container grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-7'>
      {campaigns?.map((campaign: Campaign) => {
        const imageUrl =
          typeof campaign.image === 'object' && campaign.image?.url
            ? campaign.image.url
            : typeof campaign.image === 'string'
              ? campaign.image
              : ''

        return (
          <div key={campaign.id}>
            <Card
              radius={'md'}
              component={Link}
              href={`/kampanyalar/${campaign.slug}` as Route}
              h={'100%'}
            >
              <CardSection>
                <AspectRatio ratio={16 / 9}>
                  <Image
                    component={NextImage}
                    src={imageUrl}
                    alt={campaign.title || ''}
                    width={550}
                    height={550}
                    priority
                    radius={'md'}
                    placeholder='empty'
                  />
                </AspectRatio>
              </CardSection>
              <Title
                pt={rem(10)}
                className='@xs:text-md px-0 text-start text-lg @sm:text-lg'
              >
                {campaign.title}
              </Title>
            </Card>
          </div>
        )
      })}
    </div>
  )
}

export { CategoryContents }
