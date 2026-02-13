/**
 * Abstract CMS Service
 * All CMS integrations should implement this interface
 * Ensures consistent data transformation regardless of CMS
 */

import type { Page, GeneralData } from '~/types/schemas'

export interface ICMSService {
  // Page data fetching
  fetchPageBySlug(slug: string, locale: string): Promise<Page | null>
  fetchHomePageData(locale: string): Promise<Page | null>
  
  // General data (header, footer, navigation)
  fetchGeneralData(locale: string): Promise<GeneralData | null>
  
  // Optional: For listing/searching
  fetchPageList?(locale: string): Promise<Page[]>
}

/**
 * Base CMS Service class with common utilities
 */
export abstract class BaseCMSService implements ICMSService {
  protected baseUrl: string
  protected locale: string

  constructor(baseUrl: string, locale: string = 'en') {
    this.baseUrl = baseUrl
    this.locale = locale
  }

  abstract fetchPageBySlug(slug: string, locale: string): Promise<Page | null>
  abstract fetchHomePageData(locale: string): Promise<Page | null>
  abstract fetchGeneralData(locale: string): Promise<GeneralData | null>

  /**
   * Fetch with error handling
   */
  protected async safeFetch<T>(url: string, options?: any): Promise<T | null> {
    try {
      return await $fetch<T>(url, {
        ...options,
        parseResponse: JSON.parse,
      })
    } catch (error) {
      console.error(`[CMS] Fetch error from ${url}:`, error)
      return null
    }
  }

  /**
   * Transform ISO date to readable format
   */
  protected formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString()
  }
}
