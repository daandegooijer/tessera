// https://nuxt.com/docs/api/configuration/nuxt-config
import en from './app/locales/en'
import nl from './app/locales/nl'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'app',
  modules: ['@nuxtjs/i18n', '@nuxt/image'],
  i18n: {
    strategy: 'prefix',
    locales: [
      { code: 'en', language: 'en-US', name: 'English' },
      { code: 'nl', language: 'nl-NL', name: 'Dutch' },
    ],
    defaultLocale: 'en',
    messages: {
      en,
      nl,
    },
  },
  // Static generation with on-demand revalidation
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/en', '/nl', '/en/', '/nl/', '/sitemap.xml', '/robots.txt'],
      ignore: ['/api'],
    },
    storage: {
      redis: {
        driver: 'redis',
        // optional, will use REDIS_URL env variable
        url: process.env.REDIS_URL,
      },
    },
  },
  routeRules: {
    // Cache home page for 1 week (604800 seconds)
    '/en': { swr: 604800 },
    '/nl': { swr: 604800 },
    '/en/': { swr: 604800 },
    '/nl/': { swr: 604800 },
    // Cache dynamic pages for 1 day with revalidation
    '/en/**': { swr: 86400 },
    '/nl/**': { swr: 86400 },
    // Don't cache API routes
    '/api/**': { cache: false },
  },
  components: {
    dirs: [
      {
        path: '~/components',
        pathPrefix: false,
      },
    ],
  },
})