/**
 * API route to fetch general data (header, footer, etc)
 * Works with any CMS via the data layer
 */

import { getCMSService } from '~/server/services/cms/factory'
import { headerData, footerData } from '~/data/content'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const locale = (query.locale as string) || 'en'

  // Try to fetch from configured CMS
  const cmsService = getCMSService()
  const cmsData = await cmsService.getGeneralData(locale)

  if (cmsData) {
    // Cache this response for longer since it changes less frequently
    setHeader(event, 'Cache-Control', 'public, max-age=604800, swr=2592000')
    return cmsData
  }

  // Fallback to mock data
  console.warn(`[CMS] No general data found for locale: ${locale}. Using mock data.`)

  return {
    header: headerData,
    footer: footerData,
  }
})
