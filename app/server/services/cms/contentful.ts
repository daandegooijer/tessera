/**
 * Contentful CMS Service Implementation
 * Adapts Contentful API responses to frontend types
 */

import { BaseCMSService } from "./base";
import type { Page, GeneralData } from "~/types/schemas";

interface ContentfulAsset {
  sys: { id: string };
  fields: {
    title: string;
    description: string;
    file: {
      url: string;
      contentType: string;
    };
  };
}

interface ContentfulPage {
  sys: { id: string };
  fields: {
    title: string;
    slug: string;
    hero?: any;
    flexContent?: any[];
    seo?: any;
  };
}

interface ContentfulResponse<T> {
  items: T[];
  includes?: any;
}

export class ContentfulCMSService extends BaseCMSService {
  private accessToken: string;
  private spaceId: string;

  constructor(baseUrl: string, spaceId: string, accessToken: string) {
    super(baseUrl);
    this.spaceId = spaceId;
    this.accessToken = accessToken;
  }

  async fetchPageBySlug(slug: string, locale: string): Promise<Page | null> {
    const url = `${this.baseUrl}/spaces/${this.spaceId}/entries?access_token=${this.accessToken}&content_type=page&fields.slug=${slug}&locale=${locale}`;

    const response =
      await this.safeFetch<ContentfulResponse<ContentfulPage>>(url);

    if (!response?.items || response.items.length === 0) return null;

    return this.transformPage(response.items[0]);
  }

  async fetchHomePageData(locale: string): Promise<Page | null> {
    const url = `${this.baseUrl}/spaces/${this.spaceId}/entries?access_token=${this.accessToken}&content_type=page&fields.slug=home&locale=${locale}`;

    const response =
      await this.safeFetch<ContentfulResponse<ContentfulPage>>(url);

    if (!response?.items || response.items.length === 0) return null;

    return this.transformPage(response.items[0]);
  }

  async fetchGeneralData(locale: string): Promise<GeneralData | null> {
    const url = `${this.baseUrl}/spaces/${this.spaceId}/entries?access_token=${this.accessToken}&content_type=generalSettings&locale=${locale}`;

    const response = await this.safeFetch<ContentfulResponse<any>>(url);

    if (!response?.items || response.items.length === 0) return null;

    return this.transformGeneralData(response.items[0]);
  }

  private transformPage(contentfulPage: ContentfulPage): Page {
    const fields = contentfulPage.fields;

    return {
      title: fields.title,
      hero: fields.hero
        ? this.transformHero(fields.hero)
        : {
            title: fields.title,
            text: "",
          },
      flexContent: fields.flexContent
        ? fields.flexContent.map((item) => this.transformFlexContent(item))
        : undefined,
      seo: fields.seo,
    };
  }

  private transformHero(contentfulHero: any) {
    return {
      title: contentfulHero.title,
      subtitle: contentfulHero.subtitle,
      text: contentfulHero.text,
      image: contentfulHero.image
        ? this.transformImage(contentfulHero.image)
        : undefined,
      buttons: contentfulHero.buttons,
    };
  }

  private transformFlexContent(item: any) {
    switch (item.__component) {
      case "content.text":
        return {
          id: item.sys.id,
          __component: "content.text",
          hasBackground: item.fields.hasBackground ?? false,
          isColumnView: item.fields.isColumnView ?? false,
          paragraph: item.fields.paragraph,
        };
      case "content.image-text":
        return {
          id: item.sys.id,
          __component: "content.image-text",
          textLeft: item.fields.textLeft ?? true,
          image: item.fields.image
            ? this.transformImage(item.fields.image)
            : undefined,
          paragraph: item.fields.paragraph,
        };
      default:
        return null;
    }
  }

  private transformImage(contentfulImage: ContentfulAsset) {
    const file = contentfulImage.fields.file;

    return {
      name: contentfulImage.fields.title,
      alternativeText: contentfulImage.fields.description,
      caption: contentfulImage.fields.description,
      width: 1200, // Contentful doesn't always provide this
      height: 800,
      formats: {
        thumbnail: {
          url: file.url,
          ext: "",
          hash: "",
          mime: file.contentType,
          name: "",
          path: null,
          size: 0,
          width: 150,
          height: 100,
          sizeInBytes: 0,
        },
      },
      hash: contentfulImage.sys.id,
      ext: file.contentType.split("/")[1],
      mime: file.contentType,
      size: 0,
      url: `https:${file.url}`,
      previewUrl: null,
      provider: "contentful",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      placeholder: "",
    };
  }

  private transformGeneralData(contentfulData: any): GeneralData {
    const fields = contentfulData.fields;

    return {
      header: {
        items: fields.headerItems || [],
        topbar: fields.headerTopbar || [],
      },
      footer: {
        items: fields.footerItems || [],
        bottombar: fields.footerBottombar || [],
        socials: fields.footerSocials || [],
        addresses: fields.footerAddresses || [],
      },
      seo: fields.seo,
    };
  }
}
