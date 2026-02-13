/**
 * API route to fetch page data
 * Works with any CMS via the data layer
 */

import { getCMSService } from "~/server/services/cms/factory";
import { homePageData, aboutPageData, notFoundPageData } from "~/data/content";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const slug = (query.slug as string) || "";
  const locale = (query.locale as string) || "en";

  // Try to fetch from configured CMS
  const cmsService = getCMSService();

  const cmsData =
    slug === "home" || slug === ""
      ? await cmsService.getHomePage(locale)
      : await cmsService.getPageBySlug(slug, locale);

  if (cmsData) {
    // Cache this response
    setHeader(event, "Cache-Control", "public, max-age=86400, swr=604800");
    return cmsData;
  }

  // Fallback to mock data
  console.warn(
    `[CMS] No data found for slug: ${slug}, locale: ${locale}. Using mock data.`,
  );

  if (slug === "home" || slug === "") {
    return homePageData;
  }

  if (slug.includes("about")) {
    return aboutPageData;
  }

  return notFoundPageData;
});
