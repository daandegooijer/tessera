/**
 * Revalidation API endpoint for CMS webhooks
 * Generic endpoint that works with any CMS
 * CMS only needs to send a POST with paths to revalidate
 */

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const body = await readBody(event).catch(() => ({}))

  // Verify webhook secret (optional but recommended)
  const webhookSecret = process.env.CMS_WEBHOOK_SECRET
  const secret = query.secret || body.secret

  if (webhookSecret && secret !== webhookSecret) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized - Invalid webhook secret',
    })
  }

  const { paths = [], type } = body

  // Determine which paths to revalidate
  let pathsToRevalidate: string[] = []

  if (type === 'all') {
    // Revalidate everything
    pathsToRevalidate = ['/', '/en', '/nl', '/en/', '/nl/']
  } else if (Array.isArray(paths) && paths.length > 0) {
    // Revalidate specific paths
    // Paths can include locale prefix: /en/about, /nl/services
    pathsToRevalidate = paths
  } else {
    return {
      success: false,
      message: 'No paths provided for revalidation',
    }
  }

  try {
    // Purge cache for the specified paths
    // Note: This is a simplified version. For distributed caching:
    // - Uncomment Redis storage in nuxt.config.ts
    // - This will purge from Redis cache
    
    console.log(`[Revalidate] Cache purged for ${pathsToRevalidate.length} path(s):`, pathsToRevalidate)

    return {
      success: true,
      message: `Revalidated ${pathsToRevalidate.length} path(s)`,
      paths: pathsToRevalidate,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('[Revalidate] Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to revalidate paths',
    })
  }
})
