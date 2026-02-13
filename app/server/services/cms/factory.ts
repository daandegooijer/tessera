/**
 * CMS Factory & Data Layer
 * Centralizes CMS selection and data fetching
 * Abstracts away CMS specifics from the rest of the application
 */

import type { ICMSService } from "./base";
import { StrapiCMSService } from "./strapi";
import { ContentfulCMSService } from "./contentful";
import { StoryblokCMSService } from "./storyblok";
import { DummyCMSService } from "./dummy";
import type { Page, GeneralData } from "~/types/schemas";

type CMSType = "strapi" | "contentful" | "storyblok" | "dummy" | "mock";

interface CMSConfig {
  type: CMSType;
  baseUrl?: string;
  apiToken?: string;
  spaceId?: string;
  version?: "draft" | "published";
}

class CMSServiceFactory {
  private cmsService: ICMSService | null = null;
  private config: CMSConfig;

  constructor(config: CMSConfig) {
    this.config = config;
    this.initializeCMS();
  }

  private initializeCMS() {
    const { type, baseUrl } = this.config;

    switch (type) {
      case "strapi":
        if (!baseUrl || !this.config.apiToken) {
          throw new Error(
            "Strapi CMS requires baseUrl and apiToken environment variables",
          );
        }
        this.cmsService = new StrapiCMSService(baseUrl, this.config.apiToken!);
        break;

      case "contentful":
        if (!baseUrl || !this.config.spaceId || !this.config.apiToken) {
          throw new Error(
            "Contentful CMS requires baseUrl, spaceId, and apiToken environment variables",
          );
        }
        this.cmsService = new ContentfulCMSService(
          baseUrl,
          this.config.spaceId!,
          this.config.apiToken!,
        );
        break;

      case "storyblok":
        if (!baseUrl || !this.config.apiToken) {
          throw new Error(
            "Storyblok CMS requires baseUrl and apiToken environment variables",
          );
        }
        this.cmsService = new StoryblokCMSService(
          baseUrl,
          this.config.apiToken!,
          this.config.version || "published",
        );
        break;

      case "dummy":
        // Dummy CMS - no configuration needed, returns mock data
        this.cmsService = new DummyCMSService("");
        console.log("[CMS] Using Dummy CMS - returns mock data");
        break;

      case "mock":
        // Alias for dummy - for backward compatibility
        this.cmsService = new DummyCMSService("");
        console.log("[CMS] Using Mock CMS - returns dummy data");
        break;

      default:
        throw new Error(`Unknown CMS type: ${type}`);
    }
  }

  async getPageBySlug(slug: string, locale: string): Promise<Page | null> {
    if (!this.cmsService) {
      console.warn("[CMS] No CMS service configured, using mock mode");
      return null;
    }

    return this.cmsService.fetchPageBySlug(slug, locale);
  }

  async getHomePage(locale: string): Promise<Page | null> {
    if (!this.cmsService) {
      console.warn("[CMS] No CMS service configured, using mock mode");
      return null;
    }

    return this.cmsService.fetchHomePageData(locale);
  }

  async getGeneralData(locale: string): Promise<GeneralData | null> {
    if (!this.cmsService) {
      console.warn("[CMS] No CMS service configured, using mock mode");
      return null;
    }

    return this.cmsService.fetchGeneralData(locale);
  }

  getCMSService(): ICMSService | null {
    return this.cmsService;
  }
}

/**
 * Initialize CMS based on environment variables
 */
export const initializeCMS = (): CMSServiceFactory => {
  const cmsType = (process.env.CMS_TYPE || "dummy") as CMSType;

  const config: CMSConfig = {
    type: cmsType,
    baseUrl: process.env.CMS_URL,
    apiToken: process.env.CMS_API_TOKEN,
    spaceId: process.env.CONTENTFUL_SPACE_ID || process.env.STORYBLOK_SPACE_ID,
    version:
      (process.env.STORYBLOK_VERSION as "draft" | "published") || "published",
  };

  return new CMSServiceFactory(config);
};

/**
 * Global CMS instance
 */
let cmsInstance: CMSServiceFactory | null = null;

export const getCMSService = (): CMSServiceFactory => {
  if (!cmsInstance) {
    cmsInstance = initializeCMS();
  }
  return cmsInstance;
};
