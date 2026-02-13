/**
 * Dummy CMS Service Implementation
 * Returns mock data with simulated API delays
 * Perfect for development and demos without external CMS
 */

import { BaseCMSService } from "./base";
import type { Page, GeneralData } from "~/types/schemas";
import {
  homePageData,
  aboutPageData,
  notFoundPageData,
  headerData,
  footerData,
} from "~/data/content";

export class DummyCMSService extends BaseCMSService {
  private mockPages: Record<string, Record<string, Page>> = {
    en: {
      home: homePageData,
      about: aboutPageData,
      "about/team": aboutPageData,
      "about/values": aboutPageData,
    },
    nl: {
      home: homePageData,
      about: aboutPageData,
      "about/team": aboutPageData,
      "about/values": aboutPageData,
    },
  };

  private mockGeneralData: Record<string, GeneralData> = {
    en: {
      header: headerData,
      footer: footerData,
    },
    nl: {
      header: headerData,
      footer: footerData,
    },
  };

  async fetchPageBySlug(slug: string, locale: string): Promise<Page | null> {
    // Simulate network delay
    await this.delay(100);

    const localizedPages = this.mockPages[locale];
    if (!localizedPages) return null;

    // Try exact match
    if (localizedPages[slug]) {
      console.log(`[Dummy CMS] Fetched page: ${locale}/${slug}`);
      return localizedPages[slug];
    }

    // Try without trailing content
    const cleanSlug = slug.replace(/\/$/, "");
    if (localizedPages[cleanSlug]) {
      console.log(`[Dummy CMS] Fetched page: ${locale}/${cleanSlug}`);
      return localizedPages[cleanSlug];
    }

    console.log(`[Dummy CMS] Page not found: ${locale}/${slug}`);
    return null;
  }

  async fetchHomePageData(locale: string): Promise<Page | null> {
    // Simulate network delay
    await this.delay(100);

    const localizedPages = this.mockPages[locale];
    if (!localizedPages) return null;

    const homePage = localizedPages.home || Object.values(localizedPages)[0];
    console.log(`[Dummy CMS] Fetched home page: ${locale}`);
    return homePage || null;
  }

  async fetchGeneralData(locale: string): Promise<GeneralData | null> {
    // Simulate network delay
    await this.delay(50);

    const generalData = this.mockGeneralData[locale];
    if (!generalData) return null;

    console.log(`[Dummy CMS] Fetched general data: ${locale}`);
    return generalData;
  }

  /**
   * Add a custom page to the dummy CMS
   */
  addPage(locale: string, slug: string, page: Page): void {
    if (!this.mockPages[locale]) {
      this.mockPages[locale] = {};
    }
    this.mockPages[locale][slug] = page;
  }

  /**
   * Add multiple pages
   */
  addPages(locale: string, pages: Record<string, Page>): void {
    if (!this.mockPages[locale]) {
      this.mockPages[locale] = {};
    }
    this.mockPages[locale] = {
      ...this.mockPages[locale],
      ...pages,
    };
  }

  /**
   * Get all pages for a locale
   */
  getPages(locale: string): Record<string, Page> {
    return this.mockPages[locale] || {};
  }

  /**
   * Simulate network delay
   */
  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

/**
 * Global dummy CMS instance for adding custom pages
 */
let dummyInstance: DummyCMSService | null = null;

export const getDummyCMSInstance = (): DummyCMSService => {
  if (!dummyInstance) {
    dummyInstance = new DummyCMSService("");
  }
  return dummyInstance;
};
