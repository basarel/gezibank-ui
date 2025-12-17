import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Payload } from 'payload'

export type HeaderMenuLink = {
  label: string
  url?: string | null
  isActive?: boolean
}

export type HeaderMenuColumn = {
  image?: string | { id: string; url?: string } | null
  columnTitle?: string | null
  links: HeaderMenuLink[]
}

export type HeaderMenuItem = {
  title: string
  showContent?: boolean
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
