# Nuxt 4 Migration Guide

This document outlines the migration from the React/Next.js app in the `web` folder to the new Nuxt 4+ application in the root directory.

## ✅ Completed

### 1. **Project Structure**
- Configured Nuxt 4 with `srcDir: 'app'`
- Created component directories: `atoms`, `molecules`, `organisms`, `layouts`
- Created pages directory with routing structure
- Created types directory with schemas
- Created data directory with mock content
- Created locales directory for i18n

### 2. **Routing**
- **Index page** (`/pages/index.vue`): Home page with hero and flex content
- **Catch-all route** (`/pages/[...slug].vue`): Dynamic routes for other pages
- Currently handles `/about` route with mock data
- Returns 404-like content for unmatched routes
- i18n prefix routing enabled (e.g., `/en/`, `/nl/`)

### 3. **Layout Components** (Plain Vue)
- **Header** (`components/layouts/Header.vue`): Navigation and branding
- **Footer** (`components/layouts/Footer.vue`): Footer with menus, addresses, socials
- **Logo** (`components/atoms/Logo.vue`): Logo component
- **Navigation** (`components/molecules/Navigation.vue`): Menu with submenu support
- **Default Layout** (`layouts/default.vue`): Master layout wrapping pages

### 4. **Content Components** (Flex Content System)
- **Hero** (`components/organisms/Hero.vue`): Full-width hero with overlay and buttons
- **TextContent** (`components/organisms/flexContent/TextContent.vue`): Text with heading and buttons
- **ImageTextContent** (`components/organisms/flexContent/ImageTextContent.vue`): Text + image layouts
- **AccordionContent** (`components/organisms/flexContent/AccordionContent.vue`): Collapsible sections
- **FlexContent** (`components/organisms/flexContent/FlexContent.vue`): Component router
- **FlexContentRenderer** (`components/organisms/FlexContentRenderer.vue`): Batch renderer

### 5. **Data & Types**
- **Types**: 
  - `app/types/common.ts`: Shared types (Hero, MenuItem, Button, etc.)
  - `app/types/schemas.ts`: Content schemas (TextContent, ImageTextContent, FlexContent, Page, etc.)
- **Mock Data**:
  - `app/data/content.ts`: Sample data for header, footer, home page, about page
  - Uses placeholder images from `https://via.placeholder.com/`
  - Includes navigation structure, footer links, and page content

### 6. **Localization (i18n)**
- Configured with `@nuxtjs/i18n` module
- Locale files: `app/locales/en.ts` and `app/locales/nl.ts`
- Prefix-based routing: `/en/` and `/nl/` prefixes
- Default locale: `en`

## 📁 Directory Structure

```
app/
├── components/
│   ├── atoms/
│   │   └── Logo.vue
│   ├── molecules/
│   │   └── Navigation.vue
│   ├── layouts/
│   │   ├── Header.vue
│   │   └── Footer.vue
│   └── organisms/
│       ├── Hero.vue
│       ├── FlexContentRenderer.vue
│       └── flexContent/
│           ├── TextContent.vue
│           ├── ImageTextContent.vue
│           ├── AccordionContent.vue
│           └── FlexContent.vue
├── data/
│   └── content.ts (Mock data)
├── layouts/
│   └── default.vue (Master layout)
├── locales/
│   ├── en.ts
│   └── nl.ts
├── pages/
│   ├── index.vue (Home)
│   └── [...slug].vue (Dynamic routes)
├── types/
│   ├── common.ts
│   └── schemas.ts
└── app.vue (Root component)
```

## 🚀 Getting Started

### Installation
```bash
# Install dependencies
bun install

# Run development server
bun run dev

# Build for production
bun run build
```

The app will be available at:
- English: `http://localhost:3000/en`
- Dutch: `http://localhost:3000/nl`

## 📝 Next Steps for Full Migration

### 1. **Integrate Nuxt UI**
```bash
bun add @nuxt/ui
```
Then update components to use Nuxt UI components instead of plain HTML.

### 2. **Complete Flex Content Components**
Currently implemented:
- ✅ Text
- ✅ ImageText
- ✅ Accordion

Still needed:
- [ ] Image
- [ ] Video
- [ ] Quote
- [ ] CTA
- [ ] Teaser components

Add them in `components/organisms/flexContent/` and register in the `FlexContent.vue` component map.

### 3. **Connect Real Data**
Replace mock data in `app/data/content.ts` with:
- API calls to Strapi or your CMS
- Use composables in `app/composables/` for data fetching
- Example structure:
  ```typescript
  // app/composables/useFetchPageData.ts
  export const useFetchPageData = (slug: string, locale: string) => {
    return useFetch(`/api/pages/${slug}?locale=${locale}`)
  }
  ```

### 4. **Enhance Routing**
- Map all routes from Next app to Nuxt structure
- Add more specific page routes if needed
- Consider moving to file-based routing with dynamic routes

### 5. **Add SEO & Meta Tags**
Implement Nuxt's `definePageMeta` or use composables:
```typescript
definePageMeta({
  title: 'Page Title',
  description: 'Page Description'
})
```

### 6. **Styling**
When ready to add styles with Nuxt UI or Tailwind:
- Install: `bun add -D tailwindcss postcss autoprefixer`
- Configure in `nuxt.config.ts`
- Update component classes

## 🔄 Component Patterns

### Creating New Content Components

1. Create file in `app/components/organisms/flexContent/{Name}.vue`
2. Import and define the type from `app/types/schemas.ts`
3. Register in `FlexContent.vue` component map:
   ```typescript
   const componentMap = {
     'content.text': TextContent,
     'content.your-new': YourNewComponent, // Add here
   }
   ```

### Using Composables for Data

Create in `app/composables/` for reusable logic:
```typescript
// app/composables/useFetchNavigationData.ts
export const useFetchNavigationData = () => {
  return useState(() => ({
    items: [], // or fetch from API
  }))
}
```

## 🛠 Configuration

- **Source Directory**: `app/` (configured in `nuxt.config.ts`)
- **Component Auto-import**: Enabled (no need for explicit imports)
- **i18n**: Prefix-based with `en` and `nl` locales
- **Compatibility Date**: 2025-07-15

## 📋 Notes

- All components are plain Vue 3 (no styling framework yet)
- Components use semantic HTML
- Mock data uses placeholder images
- Links are client-side with `NuxtLink`
- Responsive design is basic (mobile-friendly structure)

## 🔗 References

- [Nuxt Documentation](https://nuxt.com)
- [Nuxt i18n](https://i18n.nuxtjs.org)
- [Nuxt UI](https://ui.nuxt.com)
