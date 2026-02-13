/**
 * Cache control utilities for static generation with revalidation
 * Use these composables when fetching CMS data
 */

import type { FlexContent, Page } from "~/types/schemas";

export const useCachedPageData = async (
  slug: string,
  locale: string,
): Promise<Page | null> => {
  // In a real app, fetch from CMS/API here
  // For now, using mock data with cache headers

  try {
    // Set cache headers for static generation
    const event = useRequestEvent();
    if (event) {
      // These headers tell Nuxt to cache this response
      setHeader(event, "Cache-Control", "public, max-age=86400, swr=604800");
    }

    // Replace with actual CMS fetch:
    // const data = await $fetch(`/api/pages/${slug}`, { query: { locale } })

    return null;
  } catch (error) {
    console.error(`Error fetching page data for ${slug}:`, error);
    return null;
  }
};

export const useCacheKeyGenerator = (
  type: string,
  identifier: string,
  locale?: string,
) => {
  const parts = ["nuxt", type, identifier];
  if (locale) parts.push(locale);
  return parts.join(":");
};

/**
 * Helper to trigger manual revalidation from client/server
 * Useful for "Publish" buttons in admin panels
 */
export const triggerRevalidation = async (paths: string[], secret?: string) => {
  try {
    const response = await $fetch("/api/revalidate", {
      method: "POST",
      body: {
        paths,
        secret: secret || process.env.NUXT_PUBLIC_REVALIDATE_SECRET,
      },
    });
    return response;
  } catch (error) {
    console.error("Revalidation failed:", error);
    throw error;
  }
};
