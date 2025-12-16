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
    const result = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
      depth: 2,
    })

    return result.docs[0] || null
  } catch (error) {
    console.warn('Sayfa getirme hatası:', error)
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
    console.warn('Sayfalar getirme hatası:', error)
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
    console.warn('Global header getirme hatası:', error)
    return null
  }
}
