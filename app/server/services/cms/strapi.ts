/**
 * Strapi CMS Service Implementation
 * Adapts Strapi API responses to frontend types
 */

import { BaseCMSService } from './base'
import type { Page, GeneralData } from '~/types/schemas'

interface StrapiPage {
  id: number
  documentId: string
  title: string
  slug: string
  hero?: any
  flexContent?: any[]
  seo?: any
  publishedAt: string
}

interface StrapiResponse<T> {
  data: T | T[]
  meta?: any
}

export class StrapiCMSService extends BaseCMSService {
  private apiToken: string

  constructor(baseUrl: string, apiToken: string) {
    super(baseUrl)
    this.apiToken = apiToken
  }

  async fetchPageBySlug(slug: string, locale: string): Promise<Page | null> {
    const url = `${this.baseUrl}/api/pages?filters[slug][$eq]=${slug}&locale[]=${locale}&populate=*`

    const response = await this.safeFetch<StrapiResponse<StrapiPage>>(url, {
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
    })

    if (!response?.data) return null

    const pages = Array.isArray(response.data) ? response.data : [response.data]
    const page = pages[0]

    if (!page) return null

    return this.transformPage(page)
  }

  async fetchHomePageData(locale: string): Promise<Page | null> {
    // Fetch home page (could be a special route or slug='home')
    const url = `${this.baseUrl}/api/pages?filters[slug][$eq]=home&locale[]=${locale}&populate=*`

    const response = await this.safeFetch<StrapiResponse<StrapiPage>>(url, {
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
    })

    if (!response?.data) return null

    const pages = Array.isArray(response.data) ? response.data : [response.data]
    const page = pages[0]

    if (!page) return null

    return this.transformPage(page)
  }

  async fetchGeneralData(locale: string): Promise<GeneralData | null> {
    const url = `${this.baseUrl}/api/general?locale[]=${locale}&populate=*`

    const response = await this.safeFetch<StrapiResponse<any>>(url, {
      headers: {
        Authorization: `Bearer ${this.apiToken}`,
      },
    })

    if (!response?.data) return null

    const data = Array.isArray(response.data) ? response.data[0] : response.data

    return this.transformGeneralData(data)
  }

  /**
   * Transform Strapi Page to frontend Page type
   */
  private transformPage(strapiPage: StrapiPage): Page {
    return {
      title: strapiPage.title,
      hero: strapiPage.hero ? this.transformHero(strapiPage.hero) : {
        title: strapiPage.title,
        text: '',
      },
      flexContent: strapiPage.flexContent
        ? strapiPage.flexContent.map((item) => this.transformFlexContent(item))
        : undefined,
      seo: strapiPage.seo,
    }
  }

  /**
   * Transform Strapi Hero to frontend Hero type
   */
  private transformHero(strapiHero: any) {
    return {
      title: strapiHero.title,
      subtitle: strapiHero.subtitle,
      text: strapiHero.text,
      image: strapiHero.image ? this.transformImage(strapiHero.image) : undefined,
      buttons: strapiHero.buttons,
    }
  }

  /**
   * Transform flex content items
   */
  private transformFlexContent(item: any) {
    // Route to appropriate transformer based on __component
    switch (item.__component) {
      case 'content.text':
        return this.transformTextContent(item)
      case 'content.image-text':
        return this.transformImageTextContent(item)
      case 'content.accordion':
        return this.transformAccordionContent(item)
      default:
        console.warn(`[Strapi] Unknown flex content type: ${item.__component}`)
        return null
    }
  }

  private transformTextContent(item: any) {
    return {
      id: item.id,
      __component: 'content.text',
      hasBackground: item.hasBackground ?? false,
      isColumnView: item.isColumnView ?? false,
      paragraph: item.paragraph,
    }
  }

  private transformImageTextContent(item: any) {
    return {
      id: item.id,
      __component: 'content.image-text',
      textLeft: item.textLeft ?? true,
      image: item.image ? this.transformImage(item.image) : undefined,
      paragraph: item.paragraph,
    }
  }

  private transformAccordionContent(item: any) {
    return {
      id: item.id,
      __component: 'content.accordion',
      heading: item.heading,
      items: item.items,
    }
  }

  /**
   * Transform Strapi Image to frontend ImageAttributes
   */
  private transformImage(strapiImage: any) {
    return {
      name: strapiImage.name,
      alternativeText: strapiImage.alternativeText,
      caption: strapiImage.caption,
      width: strapiImage.width,
      height: strapiImage.height,
      formats: strapiImage.formats,
      hash: strapiImage.hash,
      ext: strapiImage.ext,
      mime: strapiImage.mime,
      size: strapiImage.size,
      url: strapiImage.url,
      previewUrl: strapiImage.previewUrl,
      provider: strapiImage.provider,
      createdAt: strapiImage.createdAt,
      updatedAt: strapiImage.updatedAt,
      placeholder: strapiImage.placeholder,
    }
  }

  /**
   * Transform Strapi General Data
   */
  private transformGeneralData(strapiData: any): GeneralData {
    return {
      header: {
        items: strapiData.headerItems || [],
        topbar: strapiData.headerTopbar || [],
      },
      footer: {
        items: strapiData.footerItems || [],
        bottombar: strapiData.footerBottombar || [],
        socials: strapiData.footerSocials || [],
        addresses: strapiData.footerAddresses || [],
      },
      seo: strapiData.seo,
    }
  }
}
