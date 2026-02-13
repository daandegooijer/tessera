# CMS-Agnostic Data Layer Implementation

Your Nuxt app now has a **completely decoupled data layer** that works with any
CMS. Components have zero knowledge of where data comes from.

## 📦 What You Have

### **CMS Adapters** (Transform CMS data → Frontend types)

- ✅ **Strapi** - `server/services/cms/strapi.ts`
- ✅ **Contentful** - `server/services/cms/contentful.ts`
- 📄 **Sanity** - `server/services/cms/sanity.example.ts` (reference)
- ➕ **Add any CMS** - Follow adapter pattern

### **Data Layer Files**

```
app/
├── server/services/cms/
│   ├── base.ts              # Abstract interface
│   ├── strapi.ts            # Strapi adapter
│   ├── contentful.ts        # Contentful adapter
│   ├── sanity.example.ts    # Sanity reference impl
│   └── factory.ts           # CMS selection logic
├── server/api/cms/
│   ├── page.get.ts          # GET /api/cms/page?slug=&locale=
│   └── general.get.ts       # GET /api/cms/general?locale=
└── data/content.ts          # Mock data fallback
```

### **Component Usage** (No CMS knowledge needed)

```vue
<script setup>
const { data: page } = await useFetch("/api/cms/page", {
  query: { slug: "about", locale: "en" },
});
</script>

<template>
  <Hero v-bind="page.hero" />
  <FlexContentRenderer :components="page.flexContent" />
</template>
```

## 🔧 Configuration

### Start with No CMS (Mock Data)

```bash
# .env
CMS_TYPE=mock
npm run dev
```

Components use fallback mock data. Perfect for development.

### Switch to Strapi

```bash
# .env
CMS_TYPE=strapi
CMS_URL=http://localhost:1337
CMS_API_TOKEN=your-token
npm run dev
```

The adapter transforms Strapi responses automatically.

### Switch to Contentful

```bash
# .env
CMS_TYPE=contentful
CMS_URL=https://cdn.contentful.com
CONTENTFUL_SPACE_ID=abc123
CMS_API_TOKEN=your-token
npm run dev
```

Same components, different CMS. **No frontend changes needed.**

## 🎯 How It Works

### Data Flow

```
1. Component fetches: GET /api/cms/page?slug=about&locale=en
2. API route gets request
3. Factory instantiates correct adapter (StrapiCMSService, etc)
4. Adapter fetches from CMS API
5. Adapter transforms to frontend types
6. Client receives standardized data
7. Component renders (doesn't care about CMS)
```

### Fallback Strategy

- ✅ Try CMS API → Success: use CMS data
- ❌ CMS offline → Use mock data
- Frontend still works even if CMS is down

## 📝 Adding a New CMS (Example: AWS Amplify)

### 1. Create Adapter (`server/services/cms/amplify.ts`)

```typescript
import { BaseCMSService } from "./base";

export class AmplifiyCMSService extends BaseCMSService {
  async fetchPageBySlug(slug: string, locale: string): Promise<Page | null> {
    // 1. Fetch from Amplify API
    const response = await this.safeFetch(
      `${this.baseUrl}/pages/${slug}?locale=${locale}`,
    );

    // 2. Transform to frontend types
    if (!response) return null;
    return this.transformPage(response);
  }

  // ... implement other methods

  private transformPage(data: any): Page {
    // Map Amplify fields to frontend Page type
    return {
      /* ... */
    };
  }
}
```

### 2. Register in Factory (`server/services/cms/factory.ts`)

```typescript
import { AmplifiyCMSService } from './amplify'

case 'amplify':
  this.cmsService = new AmplifiyCMSService(baseUrl)
  break
```

### 3. Add Environment Variables

```bash
CMS_TYPE=amplify
CMS_URL=https://api.amplify.example.com
CMS_API_TOKEN=your-token
```

### 4. Done! ✅

Components still don't change. They fetch `/api/cms/page` which now uses
AmplifyService.

## 🌍 Multi-CMS Support (Optional)

You can even support **multiple CMS per locale**:

```typescript
// Use Strapi for English, Contentful for Dutch
const getService = (locale: string) => {
  if (locale === "en") return strapiService;
  if (locale === "nl") return contentfulService;
};
```

## 🔄 Webhook/Revalidation (CMS-Agnostic)

**Any CMS** can trigger cache purge:

```bash
curl -X POST https://your-site.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "paths": ["/en/about", "/nl/about"],
    "secret": "your-webhook-secret"
  }'
```

This works the same regardless of which CMS is active.

## 📄 Files & Docs

| File                                      | Purpose                          |
| ----------------------------------------- | -------------------------------- |
| **DATA_LAYER.md**                         | Complete architecture guide      |
| **server/services/cms/base.ts**           | Interface all adapters implement |
| **server/services/cms/strapi.ts**         | Strapi transformation logic      |
| **server/services/cms/contentful.ts**     | Contentful transformation logic  |
| **server/services/cms/sanity.example.ts** | Sanity reference implementation  |
| **server/services/cms/factory.ts**        | CMS selection & instantiation    |
| **.env.example**                          | Configuration template           |

## ✨ Key Benefits

✅ **Zero Coupling** - Components don't know about CMS  
✅ **Easy Migration** - Switch CMS by changing 1 env var  
✅ **Graceful Degradation** - Works offline with mock data  
✅ **Extensible** - Add any CMS in ~30 minutes  
✅ **Type Safe** - TypeScript ensures correct transformations  
✅ **Testable** - Mock CMS for unit tests  
✅ **Future Proof** - Replace CMS anytime without touching components

## 🚀 Next Steps

1. **Read DATA_LAYER.md** - Full architecture explanation
2. **Test with Mock** - Verify components work without CMS
3. **Connect Your CMS**:
   - Have Strapi instance? → Use default Strapi adapter
   - Have Contentful? → Use default Contentful adapter
   - Other CMS? → Use adapter pattern to create one
4. **Setup Webhooks** - Configure CMS to call `/api/revalidate`
5. **Deploy** - Static generation + on-demand revalidation ready

## Questions?

Check **DATA_LAYER.md** for:

- Architecture deep-dive
- Step-by-step CMS adapter creation
- Transformation patterns
- Best practices
- Debugging tips
