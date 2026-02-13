<template>
  <section class="image-text-content">
    <div class="content-wrapper" :class="{ 'text-left': textLeft }">
      <div class="image-container">
        <NuxtImg
          v-if="image"
          :src="image.url"
          :alt="image.alternativeText || 'Content image'"
          class="content-image"
          sizes="(max-width: 640px) 100vw, 50vw"
        />
      </div>
      <div class="text-container">
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
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ImageTextContent } from '~/types/schemas'

defineProps<ImageTextContent>()
</script>

<style scoped>
.image-text-content {
  padding: 3rem 1rem;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
}

.content-wrapper.text-left {
  grid-template-columns: 1fr 1fr;
}

.content-wrapper:not(.text-left) {
  grid-template-columns: 1fr 1fr;
}

.content-wrapper:not(.text-left) .image-container {
  order: 2;
}

.content-wrapper:not(.text-left) .text-container {
  order: 1;
}

.image-container {
  overflow: hidden;
  border-radius: 4px;
}

.content-image {
  width: 100%;
  height: auto;
  display: block;
}

.text-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  .image-text-content {
    padding: 2rem 1rem;
  }

  .content-wrapper {
    grid-template-columns: 1fr;
  }

  .content-wrapper.text-left .image-container,
  .content-wrapper:not(.text-left) .image-container {
    order: 1;
  }

  .content-wrapper.text-left .text-container,
  .content-wrapper:not(.text-left) .text-container {
    order: 2;
  }

  .heading-title {
    font-size: 1.5rem;
  }
}
</style>
