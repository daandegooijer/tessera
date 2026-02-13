/**
 * Sanity CMS Service Implementation (Example)
 * Shows how to add support for any CMS
 */

import { BaseCMSService } from "./base";
import type { Page, GeneralData } from "~/types/schemas";

interface SanityPage {
  _id: string;
  _type: "page";
  title: string;
  slug: { current: string };
  hero?: any;
  content?: any[];
  seo?: any;
}

interface SanityResponse<T> {
  result: T[];
}

export class SanityCMSService extends BaseCMSService {
  private projectId: string;
  private dataset: string;

  constructor(
    baseUrl: string,
    projectId: string,
    dataset: string = "production",
  ) {
    super(baseUrl);
    this.projectId = projectId;
    this.dataset = dataset;
  }

  async fetchPageBySlug(slug: string, locale: string): Promise<Page | null> {
    const query = encodeURIComponent(
      `*[_type == "page" && slug.current == "${slug}" && language == "${locale}"] | order(_updatedAt desc)[0]`,
    );

    const url = `${this.baseUrl}/v2023-05-03/data/query/${this.dataset}?query=${query}`;

    const response = await this.safeFetch<SanityResponse<SanityPage>>(url);

    if (!response?.result || response.result.length === 0) return null;

    return this.transformPage(response.result[0]);
  }

  async fetchHomePageData(locale: string): Promise<Page | null> {
    const query = encodeURIComponent(
      `*[_type == "page" && isHomepage == true && language == "${locale}"][0]`,
    );

    const url = `${this.baseUrl}/v2023-05-03/data/query/${this.dataset}?query=${query}`;

    const response = await this.safeFetch<SanityResponse<SanityPage>>(url);

    if (!response?.result || response.result.length === 0) return null;

    return this.transformPage(response.result[0]);
  }

  async fetchGeneralData(locale: string): Promise<GeneralData | null> {
    const query = encodeURIComponent(
      `*[_type == "siteSettings" && language == "${locale}"][0]`,
    );

    const url = `${this.baseUrl}/v2023-05-03/data/query/${this.dataset}?query=${query}`;

    const response = await this.safeFetch<any>(url);

    if (!response?.result) return null;

    return this.transformGeneralData(response.result[0]);
  }

  private transformPage(sanityPage: SanityPage): Page {
    return {
      title: sanityPage.title,
      hero: sanityPage.hero
        ? this.transformHero(sanityPage.hero)
        : {
            title: sanityPage.title,
            text: "",
          },
      flexContent: sanityPage.content
        ? sanityPage.content
            .map((item) => this.transformFlexContent(item))
            .filter(Boolean)
        : undefined,
      seo: sanityPage.seo,
    };
  }

  private transformHero(sanityHero: any) {
    return {
      title: sanityHero.title,
      subtitle: sanityHero.subtitle,
      text: sanityHero.description || "",
      image: sanityHero.image
        ? this.transformImage(sanityHero.image)
        : undefined,
      buttons: sanityHero.cta?.map((cta: any) => ({
        label: cta.label,
        link: {
          href: cta.url,
          target: cta.openInNewTab ? "_blank" : "_self",
        },
      })),
    };
  }

  private transformFlexContent(item: any) {
    switch (item._type) {
      case "textBlock":
        return {
          id: item._id,
          __component: "content.text",
          hasBackground: item.backgroundColor !== "white",
          isColumnView: item.columns === 2,
          paragraph: {
            text: item.text,
            heading: {
              id: item._id,
              title: item.title || "",
              subtitle: item.subtitle || "",
            },
            buttons:
              item.cta?.map((cta: any) => ({
                label: cta.label,
                link: {
                  href: cta.url,
                  target: cta.openInNewTab ? "_blank" : "_self",
                },
              })) || [],
          },
        };

      case "imageTextBlock":
        return {
          id: item._id,
          __component: "content.image-text",
          textLeft: item.imagePosition !== "left",
          image: item.image ? this.transformImage(item.image) : undefined,
          paragraph: {
            text: item.text,
            heading: {
              id: item._id,
              title: item.title || "",
              subtitle: item.subtitle || "",
            },
            buttons:
              item.cta?.map((cta: any) => ({
                label: cta.label,
                link: {
                  href: cta.url,
                  target: cta.openInNewTab ? "_blank" : "_self",
                },
              })) || [],
          },
        };

      case "accordionBlock":
        return {
          id: item._id,
          __component: "content.accordion",
          heading: {
            id: item._id,
            title: item.title || "",
            subtitle: item.subtitle || "",
          },
          items:
            item.items?.map((accordionItem: any) => ({
              title: accordionItem.title,
              text: accordionItem.content,
            })) || [],
        };

      default:
        console.warn(`[Sanity] Unknown content type: ${item._type}`);
        return null;
    }
  }

  private transformImage(sanityImage: any) {
    const imageUrl = sanityImage.asset?._id
      ? this.constructImageUrl(
          sanityImage.asset._id,
          sanityImage.crop,
          sanityImage.hotspot,
        )
      : sanityImage.url;

    return {
      name: sanityImage.alt || "Image",
      alternativeText: sanityImage.alt,
      caption: sanityImage.caption || "",
      width: 1200,
      height: 800,
      formats: {
        thumbnail: {
          url: `${imageUrl}?w=150&h=100&fit=crop`,
          ext: "jpg",
          hash: sanityImage.asset?._id || "",
          mime: "image/jpeg",
          name: sanityImage.alt || "thumb",
          path: null,
          size: 0,
          width: 150,
          height: 100,
          sizeInBytes: 0,
        },
      },
      hash: sanityImage.asset?._id || "",
      ext: "jpg",
      mime: "image/jpeg",
      size: 0,
      url: imageUrl,
      previewUrl: null,
      provider: "sanity",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      placeholder: "",
    };
  }

  private constructImageUrl(
    assetId: string,
    crop?: any,
    hotspot?: any,
  ): string {
    // Extract project ID and image ID from asset
    const parts = assetId.split("-");
    const imageId = parts.pop();

    return `https://cdn.sanity.io/images/${this.projectId}/${this.dataset}/${imageId}`;
  }

  private transformGeneralData(sanityData: any): GeneralData {
    return {
      header: {
        items:
          sanityData.navigation?.map((item: any) => ({
            label: item.label,
            link: {
              href: item.url,
              target: item.openInNewTab ? "_blank" : "_self",
            },
            subItems: item.subItems?.map((sub: any) => ({
              label: sub.label,
              link: {
                href: sub.url,
                target: sub.openInNewTab ? "_blank" : "_self",
              },
            })),
          })) || [],
        topbar: [],
      },
      footer: {
        items:
          sanityData.footerColumns?.map((col: any) => ({
            title: col.title,
            items:
              col.links?.map((link: any) => ({
                label: link.label,
                link: {
                  href: link.url,
                  target: link.openInNewTab ? "_blank" : "_self",
                },
              })) || [],
          })) || [],
        bottombar:
          sanityData.footerLinks?.map((link: any) => ({
            label: link.label,
            link: {
              href: link.url,
              target: link.openInNewTab ? "_blank" : "_self",
            },
          })) || [],
        socials:
          sanityData.socials?.map((social: any) => ({
            channel: social.platform,
            url: social.url,
          })) || [],
        addresses:
          sanityData.addresses?.map((addr: any) => ({
            title: addr.title,
            street: addr.street,
            houseNumber: addr.houseNumber,
            postalCode: addr.postalCode,
            city: addr.city,
            email: addr.email,
            phone: addr.phone
              ? {
                  label: addr.phone,
                  href: `tel:${addr.phone.replace(/\s/g, "")}`,
                }
              : undefined,
          })) || [],
      },
      seo: sanityData.seo,
    };
  }
}

/**
 * Usage in factory:
 *
 * case 'sanity':
 *   if (!baseUrl || !process.env.SANITY_PROJECT_ID) {
 *     throw new Error('Sanity requires baseUrl and SANITY_PROJECT_ID')
 *   }
 *   this.cmsService = new SanityCMSService(
 *     baseUrl,
 *     process.env.SANITY_PROJECT_ID,
 *     process.env.SANITY_DATASET || 'production'
 *   )
 *   break
 *
 * Env vars:
 * CMS_TYPE=sanity
 * CMS_URL=https://api.sanity.io
 * SANITY_PROJECT_ID=abc123
 * SANITY_DATASET=production
 */
