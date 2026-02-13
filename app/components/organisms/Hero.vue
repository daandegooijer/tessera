<template>
  <section class="hero">
    <div v-if="image" class="hero-background">
      <NuxtImg
        :src="image.url"
        :alt="image.alternativeText || 'Hero image'"
        class="hero-image"
        sizes="100vw"
      />
    </div>
    <div class="hero-overlay" />
    <div class="hero-content">
      <div class="hero-text">
        <h1 class="hero-title">{{ title }}</h1>
        <p v-if="subtitle" class="hero-subtitle">{{ subtitle }}</p>
        <div v-if="text" class="hero-description" v-html="text" />
        <div v-if="buttons?.length" class="hero-buttons">
          <NuxtLink
            v-for="button in buttons"
            :key="button.label"
            :to="button.link.href"
            class="hero-button"
          >
            {{ button.label }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Hero as HeroProps } from '~/types/common'

defineProps<HeroProps>()
</script>

<style scoped>
.hero {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem 1rem;
  text-align: center;
  color: white;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  overflow: hidden;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.9));
}

.hero-content {
  position: relative;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  max-width: 800px;
}

.hero-text {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
}

.hero-subtitle {
  font-size: 1.25rem;
  margin: 0;
  opacity: 0.9;
}

.hero-description {
  font-size: 1rem;
  max-width: 600px;
  margin: 0 auto;
  opacity: 0.95;
  line-height: 1.6;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.hero-button {
  padding: 0.75rem 1.5rem;
  border: 2px solid white;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.3s;
}

.hero-button:hover {
  background: white;
  color: black;
}

@media (max-width: 640px) {
  .hero {
    min-height: 70vh;
    padding: 1rem 0.5rem;
  }

  .hero-title {
    font-size: 1.75rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-description {
    font-size: 0.9rem;
  }

  .hero-buttons {
    flex-direction: column;
    gap: 0.5rem;
  }

  .hero-button {
    width: 100%;
  }
}
</style>
