<template>
  <section class="text-content" :class="{ 'has-background': hasBackground, 'column-view': isColumnView }">
    <div class="content-wrapper">
      <div v-if="paragraph.heading" class="content-heading">
        <h2 class="heading-title">{{ paragraph.heading.title }}</h2>
        <p v-if="paragraph.heading.subtitle" class="heading-subtitle">{{ paragraph.heading.subtitle }}</p>
      </div>
      <div class="content-text" v-html="paragraph.text" />
      <div v-if="paragraph.buttons?.length" class="content-buttons">
        <NuxtLink
          v-for="button in paragraph.buttons"
          :key="button.label"
          :to="button.link.href"
          class="content-button"
        >
          {{ button.label }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { TextContent } from '~/types/schemas'

defineProps<TextContent>()
</script>

<style scoped>
.text-content {
  padding: 3rem 1rem;
}

.text-content.has-background {
  background: #f9fafb;
}

.content-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

.text-content.column-view .content-wrapper {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.content-heading {
  margin-bottom: 1.5rem;
}

.heading-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.heading-subtitle {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

.content-text {
  font-size: 1rem;
  line-height: 1.6;
  color: #333;
  margin: 1rem 0;
}

.content-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  flex-wrap: wrap;
}

.content-button {
  padding: 0.75rem 1.5rem;
  border: 1px solid #333;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.3s;
}

.content-button:hover {
  background: #333;
  color: white;
}

@media (max-width: 640px) {
  .text-content {
    padding: 2rem 1rem;
  }

  .text-content.column-view .content-wrapper {
    grid-template-columns: 1fr;
  }

  .heading-title {
    font-size: 1.5rem;
  }
}
</style>
