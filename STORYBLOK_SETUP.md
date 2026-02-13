# Storyblok CMS Integration Guide

Complete guide to using Storyblok v2 API with your Nuxt app.

## Setup

### 1. Get Your Storyblok Credentials

1. Sign up at [storyblok.com](https://www.storyblok.com)
2. Create a space
3. Go to **Settings** → **Access Tokens**
4. Create a token (public or preview):
   - **Public token**: For published content only
   - **Preview token**: For draft + published content

### 2. Configure Environment Variables

```env
CMS_TYPE=storyblok
CMS_URL=https://api.storyblok.com
CMS_API_TOKEN=your-storyblok-token
STORYBLOK_SPACE_ID=your-space-id
STORYBLOK_VERSION=published
```

### 3. Start Dev Server

```bash
bun run dev
```

Your app will now fetch content from Storyblok.

## Content Structure in Storyblok

### Create Page Content Type

In Storyblok Editor, your page stories should have this structure:

```
Page
├── title (text)
├── slug (slug)
├── hero (nested)
│   ├── title (text)
│   ├── subtitle (text)
│   ├── text / description (text/richtext)
│   ├── image (asset)
│   └── cta (array of buttons)
│       ├── label (text)
│       ├── link (link)
│       └── target (select: _self/_blank)
├── body (blocks)
│   ├── text (component)
│   │   ├── title (text)
│   │   ├── subtitle (text)
│   │   ├── text (text/richtext)
│   │   ├── backgroundColor (select)
│   │   ├── columns (select: 1/2)
│   │   └── cta (array of buttons)
│   │
│   ├── image_text (component)
│   │   ├── title (text)
│   │   ├── subtitle (text)
│   │   ├── text (text/richtext)
│   │   ├── image (asset)
│   │   ├── imagePosition (select: left/right)
│   │   └── cta (array of buttons)
│   │
│   └── accordion (component)
│       ├── title (text)
│       ├── subtitle (text)
│       └── items (array)
│           ├── title (text)
│           └── text (text)
├── seo (object)
│   ├── metaTitle (text)
│   ├── metaDescription (text)
│   └── metaImage (asset)
```

### Create Settings Story

For header/footer, create a special story:

```
Settings
├── navigation (array)
│   ├── label (text)
│   ├── link (link)
│   └── subItems (array) - same structure
│
├── footerColumns (array)
│   ├── title (text)
│   └── items (array)
│       ├── label (text)
│       └── link (link)
│
├── footerLinks (array)
│   ├── label (text)
│   └── link (link)
│
├── socials (array)
│   ├── platform (text)
│   └── url (text)
│
└── addresses (array)
    ├── title (text)
    ├── street (text)
    ├── houseNumber (number)
    ├── postalCode (text)
    ├── city (text)
    ├── email (text)
    └── phone (text)
```

## Component Mapping

The adapter maps Storyblok blocks to frontend components:

| Storyblok Component | Frontend Component | Fields Used |
|-------------------|------------------|-------------|
| `text` / `textBlock` | `content.text` | title, subtitle, text, backgroundColor, columns, cta |
| `imageText` / `image_text` | `content.image-text` | title, subtitle, text, image, imagePosition, cta |
| `accordion` / `accordionBlock` | `content.accordion` | title, subtitle, items (with title, text) |

## Content Type Examples

### Text Block Component

```json
{
  "component": "text",
  "title": "Welcome",
  "subtitle": "Get started",
  "text": "This is the main content",
  "backgroundColor": "light-gray",
  "columns": "1",
  "cta": [
    {
      "label": "Learn More",
      "link": {
        "id": 123,
        "slug": "about",
        "linktype": "story"
      },
      "target": "_self"
    }
  ]
}
```

### Image-Text Block Component

```json
{
  "component": "image_text",
  "title": "Features",
  "text": "Amazing features included",
  "image": {
    "alt": "Feature image",
    "title": "Our Features",
    "id": 12345,
    "filename": "https://a.storyblok.com/f/space-id/uuid/image.jpg"
  },
  "imagePosition": "left",
  "cta": []
}
```

### Accordion Block Component

```json
{
  "component": "accordion",
  "title": "FAQ",
  "subtitle": "Frequently Asked Questions",
  "items": [
    {
      "title": "How does it work?",
      "text": "Here's how..."
    },
    {
      "title": "What's the price?",
      "text": "Starting from..."
    }
  ]
}
```

## Multi-Language Support

Storyblok supports multi-language stories. The adapter handles locale routing:

1. In Storyblok, create a space with locales: `en`, `nl`, etc.
2. Translate stories for each locale
3. Your app automatically uses the correct locale:
   - User visits `/en/about` → Fetches English story
   - User visits `/nl/about` → Fetches Dutch story

Configure in Nuxt config (already set up):
```typescript
i18n: {
  locales: [
    { code: 'en', language: 'en-US' },
    { code: 'nl', language: 'nl-NL' },
  ],
  defaultLocale: 'en',
}
```

## Webhooks for Cache Revalidation

### Setup Webhook in Storyblok

1. Go to **Settings** → **Webhooks**
2. Create webhook:
   - **URL**: `https://your-site.com/api/revalidate`
   - **Events**: Select events to trigger revalidation
     - `story.published`
     - `story.unpublished`
     - `story.deleted`

3. **Headers** (optional, for security):
   - `X-Webhook-Secret: your-webhook-secret`

4. **Body** - Set request body to JSON:
   ```json
   {
     "paths": [
       "/en/{{ story.full_slug }}",
       "/nl/{{ story.full_slug }}"
     ],
     "secret": "{{ env.WEBHOOK_SECRET }}"
   }
   ```

### How It Works

1. When editor publishes story in Storyblok
2. Storyblok calls your `/api/revalidate` endpoint
3. Cache for those paths is purged
4. Next user request triggers fresh render
5. Static page regenerated with latest content

## Draft/Preview Mode

### Development (See Unpublished Changes)

```env
CMS_TYPE=storyblok
STORYBLOK_VERSION=draft
CMS_API_TOKEN=your-storyblok-preview-token
```

This fetches draft content, so you see unpublished changes immediately.

### Production (Published Only)

```env
CMS_TYPE=storyblok
STORYBLOK_VERSION=published
CMS_API_TOKEN=your-storyblok-public-token
```

Only published stories are rendered.

## Image Handling

### Storyblok Image URLs

Storyblok provides images via CDN:

```
https://a.storyblok.com/f/{space-id}/{uuid}/{filename}
```

The adapter automatically:
- Converts Storyblok image objects to standard format
- Handles image resizing with query parameters
- Creates thumbnails with `?w=150&h=100&fit=crop`
- Supports alt text and captions

### Image Formats

Storyblok returns images in the `filename` field. In your Storyblok field settings:

```
Asset Field
├── Restrict file types: Images
├── Show image dimensions: Yes
└── Allow external URLs: Optional
```

## Troubleshooting

### "No data found" Messages

1. **Check token**: Is it correct?
2. **Check space**: Does space have stories?
3. **Check slug**: Does story slug match request?
4. **Check locale**: Is story translated for locale?
5. **Check version**: Is story published (if using published version)?

```bash
# Test API directly
curl "https://api.storyblok.com/v2/stories/en/about?token=YOUR_TOKEN&version=published"
```

### Images Not Loading

1. Check image filename in Storyblok
2. Ensure it starts with `/f/` or is full URL
3. Check if CDN is reachable
4. Look for CORS issues in browser console

### Draft Content Not Appearing

```env
# Make sure using draft token and version
STORYBLOK_VERSION=draft
CMS_API_TOKEN=your-preview-token  # Not public token!
```

### Webhook Not Firing

1. Check webhook URL is publicly accessible
2. Check webhook secret matches env variable
3. Check server logs for webhook requests
4. Test webhook manually from Storyblok UI
5. Verify events are selected in webhook config

## API Reference

### Storyblok v2 REST API

Base URL: `https://api.storyblok.com/v2`

**Fetch Story**
```
GET /stories/{locale}/{slug}
  ?token={token}
  &version={draft|published}
```

**Fetch All Stories**
```
GET /stories
  ?token={token}
  &starts_with={path}
  &per_page=100
```

**Query Parameters**
- `token`: Access token
- `version`: `draft` or `published`
- `resolve_relations`: Load linked content
- `cv`: Cache version (for CDN caching)

## Example Workflows

### Create New Page

1. In Storyblok: Create new story
2. Add content (hero, body blocks)
3. Publish story
4. Webhook fires → Cache purged
5. Visit URL immediately sees new page

### Update Existing Page

1. In Storyblok: Edit published story (draft)
2. See changes in preview mode
3. Publish story
4. Webhook fires → Cache purged
5. Live site reflects changes within seconds

### Unpublish Page

1. In Storyblok: Unpublish story
2. Webhook fires → Cache cleared
3. User sees 404 page

## Performance Tips

### Caching Strategy

The app uses **Stale-While-Revalidate** (SWR):
- Home page: 7 days cache
- Other pages: 1 day cache
- Webhook purges cache on publish

Data is served from cache most of the time, revalidated in background.

### Image Optimization

```typescript
// Storyblok CDN supports image sizing
https://a.storyblok.com/f/space-id/uuid/image.jpg?w=800&h=600&fit=crop

// The adapter generates thumbnails
https://a.storyblok.com/f/space-id/uuid/image.jpg?w=150&h=100&fit=crop
```

## Links

- [Storyblok Documentation](https://www.storyblok.com/docs)
- [Storyblok API v2](https://www.storyblok.com/docs/api/content-delivery)
- [Storyblok Webhooks](https://www.storyblok.com/docs/guide/web-events)
- [Component Schematic](https://www.storyblok.com/docs/guide/integration/essential-concepts)
