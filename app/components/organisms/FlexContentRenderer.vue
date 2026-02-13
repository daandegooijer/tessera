<template>
  <div class="flex-content-renderer">
    <FlexContent
      v-for="(content, index) in components"
      :key="index"
      :content="content"
    />
  </div>
</template>

<script setup lang="ts">
import type { FlexContent } from "~/types/schemas";

defineProps<{
  components: FlexContent[];
}>();
</script>

<style scoped>
.flex-content-renderer {
  width: 100%;
}
</style>
