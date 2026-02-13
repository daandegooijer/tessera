/**
 * Page data composable
 * SSR-compatible data fetching for pages
 * Falls back to mock data if CMS is not available
 */

import type { Page, GeneralData } from '~/types/schemas'
import { homePageData, aboutPageData, notFoundPageData, headerData, footerData } from '~/data/content'

export const useFetchPageData = async (
  slug: string | string[] | undefined,
  locale: string
): Promise<Page> => {
  const route = useRoute()

  // Normalize slug
  const slugStr = !slug
    ? ''
    : Array.isArray(slug)
      ? slug.join('/')
      : slug

  // Try to fetch from CMS first
  try {
    const page = await $fetch<Page>('/api/cms/page', {
      query: {
        slug: slugStr || 'home',
        locale,
      },
    })

    if (page) {
      return page
    }
  } catch (error) {
    console.warn('[useFetchPageData] CMS fetch failed, falling back to mock data:', error)
  }

  // Fallback to mock data based on slug
  if (!slugStr) {
    return homePageData
  }

  if (slugStr.includes('about')) {
    return aboutPageData
  }

  // Default to 404 page
  return notFoundPageData
}

export const useFetchGeneralData = async (locale: string): Promise<GeneralData> => {
  // Try to fetch from CMS first
  try {
    const data = await $fetch<GeneralData>('/api/cms/general', {
      query: { locale },
    })

    if (data) {
      return data
    }
  } catch (error) {
    console.warn('[useFetchGeneralData] CMS fetch failed, falling back to mock data:', error)
  }

  // Fallback to mock data
  return {
    header: headerData,
    footer: footerData,
  }
}
