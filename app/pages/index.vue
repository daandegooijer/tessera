<template>
  <div v-if="finalPageData">
    <Hero v-bind="finalPageData.hero" />
    <FlexContentRenderer
      v-if="finalPageData.flexContent?.length"
      :components="finalPageData.flexContent"
    />
  </div>
</template>

<script setup lang="ts">
import { homePageData } from "~/data/content";

const { locale } = useI18n();

// Initialize with mock data immediately
const finalPageData = ref(homePageData);

// Fetch page data from API
const { data: pageData, error } = useFetch(`/api/cms/page`, {
  query: {
    slug: "home",
    locale: locale.value,
  },
});

if (error.value) {
  console.error("Failed to load page:", error.value);
}

// Update with fetched data when available
watch(pageData, (newData) => {
  if (newData) {
    finalPageData.value = newData;
  }
});
</script>
