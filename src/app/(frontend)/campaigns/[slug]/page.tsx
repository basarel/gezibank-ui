import { AspectRatio, Button, Container, Image, Title } from '@mantine/core'
import NextImage from 'next/image'

import { getCampaignBySlug, type Campaign } from '@/libs/payload'
import { Link } from 'next-view-transitions'
import { CampaignCopySection } from '@/app/(frontend)/campaigns/_components/campaign-copy-value'
import { Route } from 'next'
import { notFound } from 'next/navigation'

type PageProps = {
  params: Promise<{ slug: string }>
}

// Lexical JSON'u basit HTML'e çeviren yardımcı fonksiyon
function lexicalToHtml(lexical: any): string {
  if (!lexical || typeof lexical !== 'object') return ''
  
  if (typeof lexical === 'string') return lexical
  
  if (lexical.root && lexical.root.children) {
    return lexical.root.children
      .map((node: any) => {
        if (node.type === 'paragraph' && node.children) {
          return `<p>${node.children.map((child: any) => child.text || '').join('')}</p>`
        }
        if (node.type === 'heading' && node.children) {
          const level = node.tag || 'h2'
          return `<${level}>${node.children.map((child: any) => child.text || '').join('')}</${level}>`
        }
        if (node.type === 'list' && node.children) {
          const tag = node.listType === 'number' ? 'ol' : 'ul'
          return `<${tag}>${node.children.map((child: any) => {
            if (child.children) {
              return `<li>${child.children.map((c: any) => c.text || '').join('')}</li>`
            }
            return ''
          }).join('')}</${tag}>`
        }
        return ''
      })
      .join('')
  }
  
  return ''
}

const CampaignDetailPage: React.FC<PageProps> = async ({
  params,
}): Promise<React.JSX.Element> => {
  const { slug } = await params
  const campaign: Campaign | null = await getCampaignBySlug(slug)

  if (!campaign) return notFound()

  const imageUrl =
    typeof campaign.image === 'object' && campaign.image?.url
      ? campaign.image.url
      : typeof campaign.image === 'string'
        ? campaign.image
        : ''

  const detailImageUrl =
    campaign.detailImage &&
    (typeof campaign.detailImage === 'object' && campaign.detailImage?.url
      ? campaign.detailImage.url
      : typeof campaign.detailImage === 'string'
        ? campaign.detailImage
        : '')

  const displayImage = detailImageUrl || imageUrl

  // Lexical içeriğini HTML'e çevir
  let descriptionHtml = ''
  if (campaign.description) {
    if (typeof campaign.description === 'object') {
      descriptionHtml = lexicalToHtml(campaign.description)
    } else {
      descriptionHtml = campaign.description
    }
  }

  return (
    <Container>
      <div className='my-5 rounded-lg border p-3 shadow'>
        <Title className='mb-5' fz={'h1'}>
          {campaign.title}
        </Title>
        {displayImage && (
          <div className='relative mb-5 w-full'>
            <AspectRatio ratio={25 / 13} className='mb-5 pb-5'>
              <Image
                component={NextImage}
                src={displayImage}
                alt={campaign.title || ''}
                width={5000}
                height={5000}
                priority
                radius={'md'}
                placeholder='empty'
              />
            </AspectRatio>
          </div>
        )}
         {campaign.discountCode && (
          <div className='my-5'>
          <CampaignCopySection code={campaign.discountCode} />
          </div>
        )}
        {descriptionHtml && (
          <div
            className='prose prose-lg max-w-none mb-5'
            dangerouslySetInnerHTML={{
              __html: descriptionHtml,
            }}
          />
        )}
       
        {campaign.buttonText && campaign.buttonLink && (
          <Button
            size='lg'
            className='my-5'
            component={Link}
            href={campaign.buttonLink as Route}
          >
            {campaign.buttonText}
          </Button>
        )}
      </div>
    </Container>
  )
}

export default CampaignDetailPage

