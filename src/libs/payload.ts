import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Payload } from 'payload'

export type HeaderMenuLink = {
  label: string
  url?: string | null
}

export type HeaderMenuColumn = {
  image?: {
    id: string
    url: string
    alt?: string
  }
  columnTitle?: string | null
  links: HeaderMenuLink[]
}

export type HeaderMenuBottomContent = {
  image?: {
    id: string
    url: string
    alt?: string
  }
  title?: string | null
  link?: string | null
  links?: HeaderMenuLink[] | null
}

export type HeaderMenuItem = {
  title: string
  slug?: string | null
  content?: string | null
  columns: HeaderMenuColumn[]
  bottomContents?: HeaderMenuBottomContent[] | null
}

export type GlobalHeader = {
  menuItems: HeaderMenuItem[]
}

export type FooterLink = {
  label?: string | null
  url?: string | null
  image?: {
    id: string
    url: string
    alt?: string
  }
}

export type FooterNavigationColumn = {
  title?: string | null
  links: FooterLink[]
}

export type FooterPaymentMethod = {
  name: string
  logo?: {
    id: string
    url: string
    alt?: string
  } | null
}

export type GlobalFooter = {
  logo?: {
    id: string
    url: string
    alt?: string
  } | null
  companyName?: string | null
  brandLicense?: string | null
  address?: string | null
  email?: string | null
  phone?: string | null
  navigationColumns?: FooterNavigationColumn[] | null
  paymentMethods?: FooterPaymentMethod[] | null
  copyrightText?: string | null
  blkGroupUrl?: string | null
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

export async function getGlobalFooter(): Promise<GlobalFooter | null> {
  try {
    const payload = await getPayloadInstance()

    type FindGlobalMethod = <T = GlobalFooter>(args: {
      slug: string
      depth?: number
    }) => Promise<T | null>
    const findGlobalMethod = payload.findGlobal as FindGlobalMethod

    const result = await findGlobalMethod<GlobalFooter>({
      slug: 'footer',
      depth: 2,
    })

    if (!result) return null

    return result
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

export async function getCampaignBySlug(
  slug: string
): Promise<Campaign | null> {
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

export type SearchCampaign = {
  id: string
  text: string
  link: string
  viewCountry: string
  active?: boolean
}

export type SearchLoaderBanner = {
  id?: string
  text?: string
  image?: number | { id: number; url?: string } | null
  viewCountry: string
  active?: boolean
}

export type Search = {
  id: number
  title: string
  campaigns: SearchCampaign[]
  loaderBanners?: SearchLoaderBanner[]
  active: boolean
}

export async function getSearch(): Promise<Search | null> {
  try {
    const payload = await getPayloadInstance()
    const result = await (payload as any).find({
      collection: 'search',
      where: {
        active: {
          equals: true,
        },
      },
      sort: 'ordering',
      limit: 1,
      depth: 1,
    })

    return (result.docs[0] as Search) || null
  } catch (error) {
    return null
  }
}

export type Detail = {
  id: number
  title: string
  keywords: Array<{ keyword: string }>
  youtubeUrl?: string | null
  isActive: boolean
}

export async function getDetailByTourTitle(
  tourTitle: string
): Promise<Detail | null> {
  try {
    if (!tourTitle || typeof tourTitle !== 'string') {
      return null
    }

    const payload = await getPayloadInstance()
    const result = await payload.find({
      collection: 'detail',
      where: {
        isActive: {
          equals: true,
        },
      },
      limit: 100,
      depth: 1,
    })

    if (!result.docs || result.docs.length === 0) {
      return null
    }

    const normalizedTourTitle = tourTitle.toLowerCase().trim()

    // Her kayıt için keywords kontrolü yap
    for (const detail of result.docs) {
      const detailData = detail as Detail

      if (!detailData.keywords || !Array.isArray(detailData.keywords)) {
        continue
      }

      // Keywords array'inde herhangi bir keyword tur adında geçiyor mu kontrol et
      const hasMatch = detailData.keywords.some((keywordItem) => {
        const keyword = keywordItem?.keyword?.toLowerCase().trim()
        if (!keyword) return false
        return normalizedTourTitle.includes(keyword)
      })

      if (hasMatch && detailData.youtubeUrl) {
        return detailData
      }
    }

    return null
  } catch (error) {
    return null
  }
}

export type Blog = {
  id: number
  title: string
  slug: string
  image: string | { id: number; url?: string } | null
  description: any
  active: boolean
  createdAt: string
  updatedAt: string
}

export async function getLatestBlogs(limit: number = 3): Promise<Blog[]> {
  try {
    const payload = await getPayloadInstance()
    const result = await payload.find({
      collection: 'blogs',
      where: {
        active: {
          equals: true,
        },
      },
      sort: '-createdAt',
      limit,
      depth: 2,
    })

    return (result.docs as Blog[]) || []
  } catch (error) {
    return []
  }
}

export async function getAllBlogs(): Promise<Blog[]> {
  try {
    const payload = await getPayloadInstance()
    const result = await payload.find({
      collection: 'blogs',
      where: {
        active: {
          equals: true,
        },
      },
      sort: '-createdAt',
      limit: 1000, // Yeterince büyük bir limit
      depth: 2,
    })

    return (result.docs as Blog[]) || []
  } catch (error) {
    return []
  }
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    const payload = await getPayloadInstance()
    const result = await payload.find({
      collection: 'blogs',
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

    return (result.docs[0] as Blog) || null
  } catch (error) {
    return null
  }
}

export async function getPreviousBlog(
  currentBlogId: number
): Promise<Blog | null> {
  try {
    const payload = await getPayloadInstance()
    const currentBlog = await payload.findByID({
      collection: 'blogs',
      id: currentBlogId.toString(),
      depth: 1,
    })

    if (!currentBlog || !currentBlog.createdAt) return null

    const result = await payload.find({
      collection: 'blogs',
      where: {
        and: [
          {
            active: {
              equals: true,
            },
          },
          {
            id: {
              not_equals: currentBlogId,
            },
          },
          {
            createdAt: {
              less_than: currentBlog.createdAt,
            },
          },
        ],
      },
      sort: '-createdAt',
      limit: 1,
      depth: 2,
    })

    return (result.docs[0] as Blog) || null
  } catch (error) {
    return null
  }
}

export async function getNextBlog(
  currentBlogId: number
): Promise<Blog | null> {
  try {
    const payload = await getPayloadInstance()
    const currentBlog = await payload.findByID({
      collection: 'blogs',
      id: currentBlogId.toString(),
      depth: 1,
    })

    if (!currentBlog || !currentBlog.createdAt) return null

    const result = await payload.find({
      collection: 'blogs',
      where: {
        and: [
          {
            active: {
              equals: true,
            },
          },
          {
            id: {
              not_equals: currentBlogId,
            },
          },
          {
            createdAt: {
              greater_than: currentBlog.createdAt,
            },
          },
        ],
      },
      sort: 'createdAt',
      limit: 1,
      depth: 2,
    })

    return (result.docs[0] as Blog) || null
  } catch (error) {
    return null
  }
}
