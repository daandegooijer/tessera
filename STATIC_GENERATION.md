# Static Generation & Revalidation Setup

This guide explains how to configure static site generation with on-demand
revalidation for CMS content updates.

## How It Works

1. **Initial Build**: `nuxt generate` or `nuxt build` pre-renders static pages
2. **Caching**: Pages are cached with **SWR (Stale-While-Revalidate)**
   - Home page: Cached for 7 days (604800 seconds)
   - Other pages: Cached for 1 day (86400 seconds)
3. **Revalidation**: When CMS content changes, Strapi calls the
   `/api/revalidate` webhook
4. **Cache Purge**: The revalidation endpoint clears stale cache
5. **Regeneration**: Next user request triggers regeneration of that page

## Environment Variables

Create a `.env` file in the project root:

```env
# Optional: Secure your revalidation endpoint
CMS_WEBHOOK_SECRET=your-super-secret-key-here
NUXT_PUBLIC_REVALIDATE_SECRET=your-super-secret-key-here

# Optional: Redis for distributed caching (if using Redis)
REDIS_URL=redis://localhost:6379
```

## Deployment Output

Build static files with:

```bash
# Generate pre-rendered static HTML files
bun run generate

# Output directory: .output/public/
# Deploy this folder to any static host (Vercel, Netlify, CloudFlare Pages, S3, etc.)
```

## Strapi Webhook Configuration

### 1. In Strapi Admin Panel

1. Go to **Settings** → **Webhooks**
2. Click **Create new webhook**
3. Configure:
   - **Name**: `Tessera Revalidation`
   - **URL**: `https://your-deployed-site.com/api/revalidate`
   - **Events**: Select content you want to watch:
     - ✅ `entry.publish.pages`
     - ✅ `entry.update.pages`
     - ✅ `entry.delete.pages`
   - **Headers** (optional, for security):
     ```
     X-CMS-Secret: your-super-secret-key-here
     ```

4. In the **Advanced settings** section, add request body:

```json
{
  "type": "pages",
  "paths": ["/en/{{ $body.data.slug }}", "/nl/{{ $body.data.slug }}"],
  "secret": "your-super-secret-key-here"
}
```

### 2. Example Webhook Calls

**Trigger revalidation for specific pages:**

```bash
curl -X POST https://your-site.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "paths": ["/en/about", "/nl/about", "/en/", "/nl/"],
    "secret": "your-super-secret-key-here"
  }'
```

**Revalidate everything:**

```bash
curl -X POST https://your-site.com/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "type": "all",
    "secret": "your-super-secret-key-here"
  }'
```

## CMS Integration Pattern

### When to Call Revalidation

From your Strapi service or webhook:

```typescript
// Example: After publishing a page in CMS
async function publishPage(pageData: any) {
  // Save to database
  await savePage(pageData);

  // Trigger revalidation
  const paths = [
    `/en/${pageData.slug}`,
    `/nl/${pageData.slug}`,
    `/en/`, // Also revalidate home page
    `/nl/`,
  ];

  await triggerRevalidation(paths, process.env.CMS_WEBHOOK_SECRET);
}
```

## Cache Strategy

| Route              | Cache  | Revalidate        |
| ------------------ | ------ | ----------------- |
| `/en/`, `/nl/`     | 7 days | On publish/update |
| `/en/**`, `/nl/**` | 1 day  | On publish/update |
| `/api/**`          | None   | Real-time         |

## Testing Locally

1. Start the dev server:

```bash
bun run dev
```

2. Test the revalidation endpoint:

```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -d '{
    "paths": ["/en/", "/nl/"],
    "secret": "test-secret"
  }'
```

Expected response:

```json
{
  "success": true,
  "message": "Revalidated 2 path(s)",
  "paths": ["/en/", "/nl/"],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Building for Production

```bash
# Install dependencies including Redis support (optional)
bun install

# Generate static site
bun run generate

# Output is in: .output/public/
# Deploy to static host or Node server with cache
```

## Hosting Options

### Static Hosts (Recommended)

- **Vercel**: Automatic deployment from GitHub, built-in cache
- **Netlify**: Webhook-triggered rebuilds
- **CloudFlare Pages**: Global CDN with caching
- **AWS S3 + CloudFront**: Cost-effective at scale

### Node Servers (With Cache)

- **Render**, **Railway**, **Fly.io**: Full Node.js support
- Requires Redis or similar for distributed caching

## Security Notes

⚠️ **Always use `CMS_WEBHOOK_SECRET`** in production to:

1. Verify webhook calls come from your CMS
2. Prevent cache poisoning attacks
3. Ensure only authorized revalidations occur

Secrets should be:

- Random and long (32+ characters)
- Different per environment
- Never committed to git
- Stored in `.env` (not in version control)

## Troubleshooting

**Issue**: Cache not being purged

- Check `CMS_WEBHOOK_SECRET` matches between config and webhook
- Verify Redis connection if using distributed cache
- Check server logs: `console.log('[Revalidate]...')` messages

**Issue**: Old content still visible

- Edge caches (CloudFlare, CDN) may need purging separately
- Set shorter SWR values for testing
- Clear browser cache (Ctrl+Shift+Delete)

**Issue**: Webhook delivery fails

- Verify URL is publicly accessible
- Check firewall/CORS settings
- Use webhook logs in Strapi to debug
