# Data Layer Architecture

This document explains how the Nuxt app's data layer works, how it's
CMS-agnostic, and how to add support for new CMS platforms.

## Architecture Overview

The data layer follows a **Adapter Pattern** to decouple the frontend from any
specific CMS:

```
┌─────────────────────────────────────────────────────────────┐
│                    Vue Components                            │
│              (don't know about CMS)                          │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│           API Routes (/api/cms/*)                           │
│       (useFetch in composables or pages)                    │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│              CMS Factory & Service                           │
│         (determines which adapter to use)                   │
└────────────────────────┬────────────────────────────────────┘
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
┌──────▼──────┐  ┌──────▼──────┐  ┌──────▼──────┐
│   Strapi    │  │ Contentful  │  │    Mock     │
│  Adapter    │  │  Adapter    │  │  (fallback) │
└─────────────┘  └─────────────┘  └─────────────┘
       │                 │                 │
       └─────────────────┼─────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│         Frontend Data Types                                  │
│    (Page, Hero, TextContent, etc.)                          │
└─────────────────────────────────────────────────────────────┘
```

## Key Components

### 1. **Base CMS Service** (`server/services/cms/base.ts`)

Abstract interface all CMS adapters must implement:

```typescript
interface ICMSService {
  fetchPageBySlug(slug: string, locale: string): Promise<Page | null>;
  fetchHomePageData(locale: string): Promise<Page | null>;
  fetchGeneralData(locale: string): Promise<GeneralData | null>;
}
```

### 2. **CMS Adapters** (`server/services/cms/*.ts`)

Transform CMS-specific data to frontend types:

- **Strapi** (`strapi.ts`) - Transforms Strapi REST API responses
- **Contentful** (`contentful.ts`) - Transforms Contentful API responses
- Add your own: `myaws.ts`, `sanity.ts`, etc.

### 3. **CMS Factory** (`server/services/cms/factory.ts`)

Instantiates the correct adapter based on `CMS_TYPE` env variable.

### 4. **API Routes** (`server/api/cms/`)

- `/api/cms/page?slug=about&locale=en` - Fetch page by slug
- `/api/cms/general?locale=en` - Fetch header/footer data

### 5. **Composables** (`composables/usePageData.ts`)

SSR-safe hooks for components to fetch data with fallbacks.

## Usage

### In Components/Pages

```vue
<script setup lang="ts">
const { locale } = useI18n();
const { data: pageData } = await useFetch("/api/cms/page", {
  query: { slug: "about", locale: locale.value },
});

// Falls back to mock data if CMS fetch fails
const finalPage = computed(() => pageData.value || mockData);
</script>

<template>
  <Hero v-bind="finalPage.hero" />
  <FlexContentRenderer :components="finalPage.flexContent" />
</template>
```

### Environment Configuration

```bash
# .env for development
CMS_TYPE=mock              # Start with mock data, no external CMS

# .env for production with Strapi
CMS_TYPE=strapi
CMS_URL=https://api.example.com
CMS_API_TOKEN=your-token

# .env for production with Contentful
CMS_TYPE=contentful
CMS_URL=https://cdn.contentful.com
CONTENTFUL_SPACE_ID=xyz123
CMS_API_TOKEN=your-token
```

## Adding a New CMS

### Step 1: Create Adapter File

Create `app/server/services/cms/mycms.ts`:

```typescript
import { BaseCMSService } from "./base";
import type { Page, GeneralData } from "~/types/schemas";

export class MyCMSService extends BaseCMSService {
  async fetchPageBySlug(slug: string, locale: string): Promise<Page | null> {
    // 1. Fetch from your CMS API
    const response = await this.safeFetch(
      `${this.baseUrl}/pages/${slug}?locale=${locale}`,
    );

    // 2. Transform CMS data to frontend types
    if (!response) return null;
    return this.transformPage(response);
  }

  async fetchHomePageData(locale: string): Promise<Page | null> {
    // Similar to above but for home page
  }

  async fetchGeneralData(locale: string): Promise<GeneralData | null> {
    // Fetch and transform header/footer data
  }

  // Private transformer methods
  private transformPage(cmsPage: any): Page {
    return {
      title: cmsPage.title,
      hero: this.transformHero(cmsPage.hero),
      flexContent: cmsPage.content?.map((item) =>
        this.transformFlexContent(item),
      ),
      seo: cmsPage.seo,
    };
  }

  private transformHero(cmsHero: any) {
    // Map CMS hero fields to frontend Hero type
  }

  // ... other transform methods
}
```

### Step 2: Register in Factory

Update `app/server/services/cms/factory.ts`:

```typescript
import { MyCMSService } from "./mycms";

class CMSServiceFactory {
  private initializeCMS() {
    switch (this.config.type) {
      case "mycms":
        this.cmsService = new MyCMSService(this.config.baseUrl!);
        break;
      // ... other cases
    }
  }
}
```

### Step 3: Add Environment Variables

Update `.env.example`:

```env
# My CMS Configuration
CMS_TYPE=mycms
CMS_URL=https://api.mycms.com
CMS_API_TOKEN=your-api-token
```

### Step 4: Done!

Your components don't change. The factory automatically uses your new adapter
based on `CMS_TYPE`.

## Data Transformation Strategy

Each adapter transforms CMS data to match these frontend types:

### Page Structure

```typescript
{
  title: string
  hero: Hero           // Full-width hero
  flexContent: []      // Array of content blocks
  seo?: Seo           // SEO metadata
}
```

### Flex Content Types

- `content.text` - Text with heading
- `content.image-text` - Text + image layout
- `content.accordion` - Collapsible sections
- Extend with more as needed

### General Data (Header/Footer)

```typescript
{
  header: {
    items: MenuItem[]    // Navigation
    topbar: MenuItem[]   // Top announcements
  }
  footer: {
    items: Menu[]        // Footer columns
    bottombar: MenuItem[]
    socials: Social[]
    addresses: Address[]
  }
}
```

## Fallback Strategy

Data fetching has built-in fallbacks:

1. **Try CMS** → Fetch from configured CMS adapter
2. **Fall back to API cache** → If CMS request fails, use cached response
3. **Fall back to mock data** → If all else fails, use `app/data/content.ts`

This ensures the site works even if your CMS is temporarily down.

## Webhook Integration (CMS-Agnostic)

All CMS adapters integrate with the same `/api/revalidate` endpoint:

```bash
# Any CMS can call this to purge cache
curl -X POST https://your-site.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "paths": ["/en/about", "/nl/about"],
    "secret": "your-webhook-secret"
  }'
```

The CMS doesn't need to know about the frontend architecture.

## Best Practices

### 1. **Transform at Adapter Level**

Don't let CMS-specific data reach components. Transform in adapter:

```typescript
// ✅ DO: Transform in adapter
private transformImage(cmsImage: any) {
  return {
    url: cmsImage.assets[0].url,  // ← Handle CMS quirks here
    alternativeText: cmsImage.alt,
    // ...
  }
}

// ❌ DON'T: Let CMS structure reach components
// Components shouldn't know about cmsImage.assets[0]
```

### 2. **Type Safety**

Use TypeScript to ensure transformers output correct types:

```typescript
private transformPage(data: any): Page {
  // TypeScript validates this matches frontend Page type
  return { /* ... */ }
}
```

### 3. **Consistent Field Names**

Map all CMS field variations to standard names:

```typescript
// Different CMS might call this:
// - "metaDescription" (Strapi)
// - "description" (Contentful)
// - "seoDescription" (Others)

// Transform to single standard: seo.metaDescription
```

### 4. **Handle Missing Data Gracefully**

```typescript
private transformHero(hero: any): Hero {
  return {
    title: hero?.title || 'Default Title',
    text: hero?.description || '',
    image: hero?.image ? this.transformImage(hero.image) : undefined,
    buttons: hero?.buttons || [],
  }
}
```

## Testing Different CMS

```bash
# Start with mock data (no external CMS needed)
CMS_TYPE=mock npm run dev

# Test Strapi integration
CMS_TYPE=strapi CMS_URL=... CMS_API_TOKEN=... npm run dev

# Test without CMS (components use fallback)
CMS_TYPE=none npm run dev
```

## Debugging

Check which CMS is active:

```typescript
// In any server route
const cmsService = getCMSService();
console.log(cmsService.getCMSService()); // Logs adapter instance
```

Monitor cache hits:

```bash
# Pages will log when falling back to mock data
# Check server logs for: "[CMS] No data found for slug: ..."
```

## File Structure

```
app/
├── server/services/cms/
│   ├── base.ts           # Abstract interface
│   ├── strapi.ts         # Strapi adapter
│   ├── contentful.ts     # Contentful adapter
│   └── factory.ts        # CMS selection logic
├── server/api/cms/
│   ├── page.get.ts       # Fetch page by slug
│   └── general.get.ts    # Fetch header/footer
├── composables/
│   └── usePageData.ts    # SSR-safe data fetching
└── data/content.ts       # Mock data fallback
```

## Next: Strapi Integration Example

When ready to connect Strapi:

```bash
CMS_TYPE=strapi \
CMS_URL=http://localhost:1337 \
CMS_API_TOKEN=your-token \
npm run dev
```

The adapter will:

1. Fetch from Strapi API
2. Transform responses to frontend types
3. Cache results per SWR config
4. Fall back to mock if Strapi is down
5. Listen for revalidation webhooks
