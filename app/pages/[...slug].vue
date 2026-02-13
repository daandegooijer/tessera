<template>
  <div v-if="finalPageData">
    <Hero v-bind="finalPageData.hero" />
    <FlexContentRenderer v-if="finalPageData.flexContent?.length" :components="finalPageData.flexContent" />
  </div>
</template>

<script setup lang="ts">
import { aboutPageData, notFoundPageData } from '~/data/content'

const route = useRoute()
const { locale } = useI18n()
const slug = route.params.slug
const slugStr = Array.isArray(slug) ? slug.join('/') : slug

// Initialize with fallback data based on slug
const getDynamicFallback = () => {
  if (slugStr?.includes('about')) return aboutPageData
  return notFoundPageData
}

const finalPageData = ref(getDynamicFallback())

const { data: pageData, error } = useFetch(`/api/cms/page`, {
  query: {
    slug: slugStr || '',
    locale: locale.value,
  },
})

if (error.value) {
  console.error('Failed to load page:', error.value)
}

watch(pageData, (newData) => {
  if (newData) {
    finalPageData.value = newData
  }
})
</script>
