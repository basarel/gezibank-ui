'use client'

import { Route } from 'next'
import { Link } from 'next-view-transitions'
import { FaArrowRightLong } from 'react-icons/fa6'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { useMemo } from 'react'
import PopularSearchesBlock from '@/blocks/popular-searches/Components'

export default function PopularSearchesTour() {
  const { data: homePage, isLoading } = useQuery({
    queryKey: ['home-page-popular-searches'],
    queryFn: async () => {
      const response = await fetch(
        `/api/pages?where[slug][equals]=home&depth=2`
      )
      if (!response.ok) return null
      const data = await response.json()
      return data.docs?.[0] || null
    },
  })

  const popularSearchesItems = useMemo(() => {
    if (!homePage?.layout) return []
    const popularSearchesBlock = homePage.layout.find(
      (block: any) => block.blockType === 'popularSearches'
    )
    return popularSearchesBlock?.items || []
  }, [homePage])

  if (isLoading) {
    return null
  }

  if (!popularSearchesItems || popularSearchesItems.length === 0) {
    return null
  }

  return <PopularSearchesBlock items={popularSearchesItems} />
}
