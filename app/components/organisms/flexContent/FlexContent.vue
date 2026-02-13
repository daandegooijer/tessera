<template>
  <div class="flex-content-container">
    <component
      :is="componentMap[content.__component]"
      v-if="componentMap[content.__component]"
      v-bind="content"
    />
    <div v-else class="fallback-message">
      Component not found: {{ content.__component }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FlexContent } from "~/types/schemas";
import TextContent from "./TextContent.vue";
import ImageTextContent from "./ImageTextContent.vue";
import AccordionContent from "./AccordionContent.vue";

const componentMap = {
  "content.text": TextContent,
  "content.image-text": ImageTextContent,
  "content.accordion": AccordionContent,
} as Record<string, any>;

defineProps<{
  content: FlexContent;
}>();
</script>

<style scoped>
.flex-content-container {
  width: 100%;
}

.fallback-message {
  padding: 2rem;
  text-align: center;
  color: #999;
  font-style: italic;
}
</style>
