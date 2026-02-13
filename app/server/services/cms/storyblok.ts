/**
 * Storyblok CMS Service Implementation (v2 API)
 * Adapts Storyblok API responses to frontend types
 * https://www.storyblok.com/
 */

import { BaseCMSService } from './base'
import type { Page, GeneralData } from '~/types/schemas'

interface StoryblokAsset {
  id: number
  alt: string
  name: string
  focus: string
  title: string
  filename: string
  copyright: string
  created_at: string
  updated_at: string
  content_type: string
}

interface StoryblokImage {
  alt?: string
  copyright?: string
  id: number
  name: string
  filename: string
  title?: string
}

interface StoryblokStory {
  id: number
  uuid: string
  name: string
  slug: string
  full_slug: string
  content: any
  created_at: string
  published_at: string
  first_published_at: string
  content_type: string
  is_startpage: boolean
}

interface StoryblokResponse<T> {
  stories: T[]
  story?: T
  cv: number
  rels: any[]
}

export class StoryblokCMSService extends BaseCMSService {
  private accessToken: string
  private version: 'draft' | 'published'

  constructor(
    baseUrl: string,
    accessToken: string,
    version: 'draft' | 'published' = 'published'
  ) {
    super(baseUrl)
    this.accessToken = accessToken
    this.version = version
  }

  async fetchPageBySlug(slug: string, locale: string): Promise<Page | null> {
    const url = `${this.baseUrl}/v2/stories/${locale}/${slug}?token=${this.accessToken}&version=${this.version}`

    const response = await this.safeFetch<StoryblokResponse<StoryblokStory>>(url)

    if (!response?.story) return null

    return this.transformPage(response.story)
  }

  async fetchHomePageData(locale: string): Promise<Page | null> {
    // Fetch home page (typically no slug or 'home')
    const url = `${this.baseUrl}/v2/stories/${locale}?token=${this.accessToken}&version=${this.version}&filter_query[is_startpage][eq]=true`

    const response = await this.safeFetch<StoryblokResponse<StoryblokStory>>(url)

    if (!response?.stories || response.stories.length === 0) return null

    return this.transformPage(response.stories[0])
  }

  async fetchGeneralData(locale: string): Promise<GeneralData | null> {
    // Fetch site settings/global data from a special story
    const url = `${this.baseUrl}/v2/stories/${locale}/settings?token=${this.accessToken}&version=${this.version}`

    const response = await this.safeFetch<StoryblokResponse<StoryblokStory>>(url)

    if (!response?.story) return null

    return this.transformGeneralData(response.story)
  }

  /**
   * Transform Storyblok Story to frontend Page type
   */
  private transformPage(story: StoryblokStory): Page {
    const content = story.content || {}

    return {
      title: story.name,
      hero: content.hero ? this.transformHero(content.hero) : {
        title: story.name,
        text: '',
      },
      flexContent: content.body
        ? content.body
            .map((block: any) => this.transformFlexContent(block))
            .filter(Boolean)
        : undefined,
      seo: content.seo,
    }
  }

  /**
   * Transform Storyblok Hero block
   */
  private transformHero(heroBlock: any) {
    return {
      title: heroBlock.title || '',
      subtitle: heroBlock.subtitle || '',
      text: heroBlock.text || heroBlock.description || '',
      image: heroBlock.image ? this.transformImage(heroBlock.image) : undefined,
      buttons: heroBlock.cta
        ? Array.isArray(heroBlock.cta)
          ? heroBlock.cta.map((btn: any) => ({
              label: btn.label || btn.title,
              link: {
                href: this.parseStoryblokLink(btn.link || btn.url),
                target: btn.target || '_self',
              },
            }))
          : [{
              label: heroBlock.cta.label || heroBlock.cta.title,
              link: {
                href: this.parseStoryblokLink(heroBlock.cta.link || heroBlock.cta.url),
                target: heroBlock.cta.target || '_self',
              },
            }]
        : undefined,
    }
  }

  /**
   * Transform Storyblok flex content blocks
   */
  private transformFlexContent(block: any) {
    const component = block.component || block.type

    switch (component) {
      case 'text':
      case 'textBlock':
        return this.transformTextBlock(block)

      case 'imageText':
      case 'image_text':
      case 'imageTextBlock':
        return this.transformImageTextBlock(block)

      case 'accordion':
      case 'accordionBlock':
        return this.transformAccordionBlock(block)

      default:
        console.warn(`[Storyblok] Unknown block type: ${component}`)
        return null
    }
  }

  private transformTextBlock(block: any) {
    return {
      id: block._uid || block.id || Math.random(),
      __component: 'content.text',
      hasBackground: block.backgroundColor !== 'transparent' && block.backgroundColor !== 'white',
      isColumnView: block.columns === '2' || block.columns === 2,
      paragraph: {
        text: block.text || block.content || '',
        heading: {
          id: block._uid || block.id || Math.random(),
          title: block.title || '',
          subtitle: block.subtitle || '',
        },
        buttons: block.cta
          ? Array.isArray(block.cta)
            ? block.cta.map((btn: any) => ({
                label: btn.label || btn.title,
                link: {
                  href: this.parseStoryblokLink(btn.link || btn.url),
                  target: btn.target || '_self',
                },
              }))
            : [{
                label: block.cta.label || block.cta.title,
                link: {
                  href: this.parseStoryblokLink(block.cta.link || block.cta.url),
                  target: block.cta.target || '_self',
                },
              }]
          : [],
      },
    }
  }

  private transformImageTextBlock(block: any) {
    return {
      id: block._uid || block.id || Math.random(),
      __component: 'content.image-text',
      textLeft: block.imagePosition !== 'right',
      image: block.image ? this.transformImage(block.image) : undefined,
      paragraph: {
        text: block.text || block.content || '',
        heading: {
          id: block._uid || block.id || Math.random(),
          title: block.title || '',
          subtitle: block.subtitle || '',
        },
        buttons: block.cta
          ? Array.isArray(block.cta)
            ? block.cta.map((btn: any) => ({
                label: btn.label || btn.title,
                link: {
                  href: this.parseStoryblokLink(btn.link || btn.url),
                  target: btn.target || '_self',
                },
              }))
            : [{
                label: block.cta.label || block.cta.title,
                link: {
                  href: this.parseStoryblokLink(block.cta.link || block.cta.url),
                  target: block.cta.target || '_self',
                },
              }]
          : [],
      },
    }
  }

  private transformAccordionBlock(block: any) {
    return {
      id: block._uid || block.id || Math.random(),
      __component: 'content.accordion',
      heading: {
        id: block._uid || block.id || Math.random(),
        title: block.title || '',
        subtitle: block.subtitle || '',
      },
      items: (block.items || block.accordion_items || []).map((item: any) => ({
        title: item.title || item.title || '',
        text: item.text || item.content || item.description || '',
      })),
    }
  }

  /**
   * Transform Storyblok Image to frontend ImageAttributes
   * Storyblok serves images via CDN: https://a.storyblok.com/f/{space_id}/{uuid}/{filename}
   */
  private transformImage(storyblokImage: any) {
    let imageUrl = ''

    if (typeof storyblokImage === 'string') {
      // Direct URL
      imageUrl = storyblokImage
    } else if (storyblokImage.filename) {
      // Storyblok asset object
      imageUrl = storyblokImage.filename
    } else if (storyblokImage.image?.filename) {
      // Nested image object
      imageUrl = storyblokImage.image.filename
    } else {
      imageUrl = storyblokImage.url || ''
    }

    // Ensure absolute URL
    if (imageUrl && !imageUrl.startsWith('http')) {
      imageUrl = `https://a.storyblok.com${imageUrl}`
    }

    return {
      name: storyblokImage.alt || storyblokImage.title || 'Image',
      alternativeText: storyblokImage.alt || storyblokImage.title,
      caption: storyblokImage.title || '',
      width: storyblokImage.width || 1200,
      height: storyblokImage.height || 800,
      formats: {
        thumbnail: {
          url: `${imageUrl}?w=150&h=100&fit=crop`,
          ext: imageUrl.split('.').pop() || '',
          hash: storyblokImage.id?.toString() || '',
          mime: 'image/jpeg',
          name: storyblokImage.alt || 'thumb',
          path: null,
          size: 0,
          width: 150,
          height: 100,
          sizeInBytes: 0,
        },
      },
      hash: storyblokImage.id?.toString() || '',
      ext: imageUrl.split('.').pop() || 'jpg',
      mime: 'image/jpeg',
      size: 0,
      url: imageUrl,
      previewUrl: null,
      provider: 'storyblok',
      createdAt: storyblokImage.created_at || new Date().toISOString(),
      updatedAt: storyblokImage.updated_at || new Date().toISOString(),
      placeholder: '',
    }
  }

  /**
   * Transform Storyblok Settings story to GeneralData
   */
  private transformGeneralData(settingsStory: StoryblokStory): GeneralData {
    const content = settingsStory.content || {}

    return {
      header: {
        items: (content.navigation || content.headerMenu || [])
          .map((item: any) => this.transformMenuItem(item))
          .filter(Boolean),
        topbar: (content.topbar || [])
          .map((item: any) => this.transformMenuItem(item))
          .filter(Boolean),
      },
      footer: {
        items: (content.footerColumns || content.footerMenu || [])
          .map((col: any) => ({
            title: col.title || col.label,
            items: (col.items || col.links || [])
              .map((item: any) => this.transformMenuItem(item))
              .filter(Boolean),
          }))
          .filter(Boolean),
        bottombar: (content.footerLinks || content.bottombar || [])
          .map((item: any) => this.transformMenuItem(item))
          .filter(Boolean),
        socials: (content.socials || []).map((social: any) => ({
          channel: social.platform || social.channel,
          url: social.url,
        })),
        addresses: (content.addresses || []).map((addr: any) => ({
          title: addr.title,
          street: addr.street,
          houseNumber: addr.houseNumber,
          houseNumberAddition: addr.houseNumberAddition,
          postalCode: addr.postalCode,
          city: addr.city,
          email: addr.email,
          phone: addr.phone
            ? {
                label: addr.phone,
                href: `tel:${addr.phone.replace(/\s/g, '')}`,
              }
            : undefined,
        })),
      },
      seo: content.seo,
    }
  }

  /**
   * Transform a Storyblok menu item
   */
  private transformMenuItem(item: any): any {
    if (!item) return null

    return {
      label: item.label || item.title || '',
      link: {
        href: this.parseStoryblokLink(item.link || item.url),
        target: item.target === '_blank' ? '_blank' : '_self',
      },
      subItems: item.subItems
        ? item.subItems
            .map((sub: any) => this.transformMenuItem(sub))
            .filter(Boolean)
        : undefined,
    }
  }

  /**
   * Parse Storyblok link format
   * Can be:
   * - URL string: "/about"
   * - Link object: { id: 123, slug: "about", linktype: "story" }
   * - External: { url: "https://example.com", linktype: "url", target: "_blank" }
   */
  private parseStoryblokLink(link: any): string {
    if (!link) return '/'

    if (typeof link === 'string') {
      return link.startsWith('/') ? link : `/${link}`
    }

    if (typeof link === 'object') {
      // Story link
      if (link.linktype === 'story' || link.cached_url) {
        const slug = link.slug || link.cached_url || ''
        return slug.startsWith('/') ? slug : `/${slug}`
      }

      // URL link
      if (link.linktype === 'url' || link.url) {
        return link.url || '/'
      }

      // Fallback to any available slug/url property
      if (link.slug) return `/${link.slug}`
      if (link.url) return link.url
    }

    return '/'
  }
}

/**
 * Environment Variables:
 * 
 * CMS_TYPE=storyblok
 * CMS_URL=https://api.storyblok.com
 * CMS_API_TOKEN=your-storyblok-access-token
 * STORYBLOK_SPACE_ID=your-space-id (optional, for webhook verification)
 * STORYBLOK_VERSION=published (or 'draft' for preview)
 * 
 * Usage:
 * const service = new StoryblokCMSService(
 *   'https://api.storyblok.com',
 *   'your-token',
 *   'published'
 * )
 */
