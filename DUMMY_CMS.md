# Dummy CMS - Mock Data for Building & Demos

The **Dummy CMS** returns pre-built mock data without any external API calls.
Perfect for:

- Building the website layout/components
- Creating demos and prototypes
- Testing without external dependencies
- Local development without CMS setup

## Quick Start

Dummy CMS is the **default**. Just run:

```bash
bun run dev
```

No environment variables needed. The site loads mock data immediately.

## Included Mock Pages

### Default Pages (en & nl)

- **Home** (`/`)
  - Hero section with image overlay
  - Text content block
  - Image-text layout
  - Accordion/FAQ section

- **About** (`/about`)
  - Hero section
  - Story text
  - Values/team accordion

- **Not Found** (fallback for unknown routes)
  - 404-style page with home link

## Example Usage

```bash
# Start with dummy CMS (default)
bun run dev

# Visit:
# - http://localhost:3000/en/
# - http://localhost:3000/en/about
# - http://localhost:3000/nl/
# - http://localhost:3000/nl/about
```

All pages render immediately with mock data. Perfect for:

- Testing component rendering
- Building page layouts
- Demoing to stakeholders
- Screenshot captures

## Add More Mock Pages

### Option 1: Add in .env or Runtime

Create a server plugin to add custom pages:

```typescript
// app/server/plugins/addMockPages.ts
import { getDummyCMSInstance } from "~/server/services/cms/dummy";

export default defineNitroPlugin(() => {
  const dummy = getDummyCMSInstance();

  // Add custom page
  dummy.addPage("en", "services", {
    title: "Our Services",
    hero: {
      title: "Services",
      subtitle: "What we offer",
      text: "<p>Our professional services include...</p>",
      buttons: [],
    },
    flexContent: [],
  });
});
```

### Option 2: Extend Mock Data

Edit `app/data/content.ts` and add more pages:

```typescript
export const servicesPageData: Page = {
  title: "Services",
  hero: {
    /* ... */
  },
  flexContent: [
    /* ... */
  ],
};

export const blogPageData: Page = {
  // ... blog page content
};
```

Then update Dummy CMS:

```typescript
// app/server/services/cms/dummy.ts
this.mockPages = {
  en: {
    home: homePageData,
    about: aboutPageData,
    services: servicesPageData, // Add new page
    blog: blogPageData,
  },
  nl: {
    /* same structure */
  },
};
```

## How It Works

1. **Zero API Calls** - Returns data instantly from memory
2. **Simulated Delays** - Adds fake network latency (100ms) for realistic
   testing
3. **Multi-Language** - Supports English & Dutch by default
4. **Fallback Chain** - Returns `notFoundPageData` for unmapped routes

## Transitioning to Real CMS

When ready to connect a real CMS:

```bash
# Switch to Strapi
CMS_TYPE=strapi CMS_URL=http://localhost:1337 CMS_API_TOKEN=xxx bun run dev

# Switch to Contentful
CMS_TYPE=contentful CONTENTFUL_SPACE_ID=abc CMS_API_TOKEN=xxx bun run dev

# Switch to Storyblok
CMS_TYPE=storyblok CMS_API_TOKEN=xxx bun run dev
```

**All components work the same.** No frontend changes needed.

## Available Commands

```bash
# Run with dummy CMS (default)
bun run dev

# Run with specific CMS
CMS_TYPE=strapi bun run dev

# Build static site with dummy CMS
bun run generate

# Build & preview
bun run build
bun run preview
```

## Mock Data Structure

Dummy CMS includes:

```
homePageData
├── title: "Welcome to Our Website"
├── hero
│   ├── title: "Welcome to Our Website"
│   ├── subtitle: "Build amazing things with us"
│   ├── text: (HTML)
│   ├── image: (placeholder from via.placeholder.com)
│   └── buttons: [Get Started, Learn More]
└── flexContent: [text, image-text, accordion]

aboutPageData
├── hero (similar structure)
└── flexContent: [text, accordion]

headerData
└── items: [Home, About, Services, Contact, ...]

footerData
├── items: [Company, Resources]
├── bottombar: [Privacy, Terms]
├── socials: [Twitter, LinkedIn, GitHub]
└── addresses: [Main Office location]
```

## Server Plugin Example

Add custom pages dynamically:

```typescript
// app/server/plugins/customMockPages.ts
export default defineNitroPlugin(() => {
  const dummy = getDummyCMSInstance();

  const customServices: Page = {
    title: "Services",
    hero: {
      title: "Professional Services",
      subtitle: "Excellence in every project",
      text: "<p>We deliver high-quality solutions...</p>",
      buttons: [
        {
          label: "Get Started",
          link: { target: "_self", href: "/contact" },
        },
      ],
    },
    flexContent: [
      {
        id: 1,
        __component: "content.text",
        hasBackground: true,
        isColumnView: false,
        paragraph: {
          text: "<p>Our service offerings...</p>",
          heading: {
            id: 1,
            title: "What We Do",
            subtitle: "Our expertise",
          },
          buttons: [],
        },
      },
    ],
  };

  dummy.addPage("en", "services", customServices);
  dummy.addPage("nl", "services", customServices); // Or different Dutch version
});
```

## Benefits

✅ **Zero Setup** - Works immediately, no config needed  
✅ **Fast** - Sub-millisecond response times  
✅ **Realistic** - Looks/feels like real CMS  
✅ **Easy to Demo** - Show stakeholders immediately  
✅ **Safe** - No external dependencies  
✅ **Flexible** - Add pages anytime

## Testing

Perfect for testing the entire data pipeline:

```typescript
// Test that pages render correctly
visit("/en/"); // Home page
visit("/en/about"); // About page
visit("/nl/"); // Dutch home
visit("/nl/about"); // Dutch about
visit("/en/nonexist"); // Falls back to 404
```

All work instantly with dummy data.

## Security Note

Dummy CMS is for development only. It doesn't validate/sanitize content like
real CMS. For production, switch to a real CMS with proper security.

## See Also

- **DATA_LAYER.md** - How to create custom CMS adapters
- **CMS_AGNOSTIC.md** - Architecture overview
- **STORYBLOK_SETUP.md** - Example of real CMS integration
