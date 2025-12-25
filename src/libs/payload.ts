import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Payload } from 'payload'

export type HeaderMenuLink = {
  label: string
  url?: string | null
}

export type HeaderMenuColumn = {
  image?: string | { id: string; url?: string } | null
  columnTitle?: string | null
  links: HeaderMenuLink[]
}

export type HeaderMenuItem = {
  title: string
  slug?: string | null
  content?: string | null
  columns: HeaderMenuColumn[]
}

export type GlobalHeader = {
  menuItems: HeaderMenuItem[]
}

export async function getPayloadInstance(): Promise<Payload> {
  return await getPayload({ config: configPromise })
}

export async function getPageBySlug(slug: string) {
  try {
    const payload = await getPayloadInstance()
    const trimmedSlug = slug.trim()
    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: trimmedSlug,
        },
      },
      limit: 1,
      depth: 2,
    })

    if (!result.docs[0]) {
      const allPages = await payload.find({
        collection: 'pages',
        limit: 100,
      })

      const foundPage = allPages.docs.find(
        (page) => page.slug?.trim() === trimmedSlug
      )

      if (foundPage) {
        const fullPage = await payload.findByID({
          collection: 'pages',
          id: foundPage.id,
          depth: 2,
        })
        return fullPage || null
      }
    }

    return result.docs[0] || null
  } catch (error) {
    return null
  }
}

export async function getAllPages() {
  try {
    const payload = await getPayloadInstance()
    const result = await payload.find({
      collection: 'pages',
      limit: 100,
    })

    return result.docs || []
  } catch (error) {
    return []
  }
}

export async function getGlobalHeader(): Promise<GlobalHeader | null> {
  try {
    const payload = await getPayloadInstance()

    type FindGlobalMethod = <T = GlobalHeader>(args: {
      slug: string
      depth?: number
    }) => Promise<T | null>
    const findGlobalMethod = payload.findGlobal as FindGlobalMethod

    const result = await findGlobalMethod<GlobalHeader>({
      slug: 'header',
      depth: 2,
    })

    if (!result) return null

    return {
      menuItems: result.menuItems || [],
    }
  } catch (error) {
    return null
  }
}

export type CampaignCategory = {
  id: number
  title: string
  slug: string
  ordering: number
  active: boolean
}

export type Campaign = {
  id: number
  title: string
  slug: string
  image: string | { id: number; url?: string } | null
  description: any
  category: number | CampaignCategory | null
  detailImage?: string | { id: number; url?: string } | null
  discountCode?: string | null
  buttonText?: string | null
  buttonLink?: string | null
  ordering: number
  active: boolean
}

export async function getCampaignCategories(): Promise<CampaignCategory[]> {
  try {
    const payload = await getPayloadInstance()
    const result = await payload.find({
      collection: 'campaign-categories',
      where: {
        active: {
          equals: true,
        },
      },
      sort: 'ordering',
      depth: 1,
    })

    return (result.docs as CampaignCategory[]) || []
  } catch (error) {
    return []
  }
}

export async function getCampaigns(categoryId?: string): Promise<Campaign[]> {
  try {
    const payload = await getPayloadInstance()
    const where: any = {
      active: {
        equals: true,
      },
    }

    if (categoryId) {
      where.category = {
        equals: Number(categoryId),
      }
    }

    const result = await payload.find({
      collection: 'campaigns',
      where,
      sort: 'ordering',
      depth: 2,
    })

    return (result.docs as Campaign[]) || []
  } catch (error) {
    return []
  }
}

export async function getCampaignBySlug(slug: string): Promise<Campaign | null> {
  try {
    const payload = await getPayloadInstance()
    const result = await payload.find({
      collection: 'campaigns',
      where: {
        slug: {
          equals: slug,
        },
        active: {
          equals: true,
        },
      },
      limit: 1,
      depth: 2,
    })

    return (result.docs[0] as Campaign) || null
  } catch (error) {
    return null
  }
}
