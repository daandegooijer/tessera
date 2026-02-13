<template>
  <section class="accordion-content">
    <div class="content-wrapper">
      <div v-if="heading" class="content-heading">
        <h2 class="heading-title">{{ heading.title }}</h2>
        <p v-if="heading.subtitle" class="heading-subtitle">{{ heading.subtitle }}</p>
      </div>
      <div class="accordion-items">
        <div v-for="(item, index) in items" :key="index" class="accordion-item">
          <button
            class="accordion-header"
            :class="{ 'is-open': activeIndex === index }"
            @click="activeIndex = activeIndex === index ? -1 : index"
          >
            <span class="accordion-title">{{ item.title }}</span>
            <span class="accordion-icon">+</span>
          </button>
          <div v-if="activeIndex === index" class="accordion-body">
            <div class="accordion-text">{{ item.text }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { AccordionContent } from '~/types/schemas'

defineProps<AccordionContent>()

const activeIndex = ref<number>(-1)
</script>

<style scoped>
.accordion-content {
  padding: 3rem 1rem;
  background: #f9fafb;
}

.content-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

.content-heading {
  margin-bottom: 2rem;
  text-align: center;
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

.accordion-items {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.accordion-item {
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  background: white;
}

.accordion-header {
  width: 100%;
  padding: 1rem;
  text-align: left;
  background: white;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s;
}

.accordion-header:hover {
  background: #f9fafb;
}

.accordion-header.is-open {
  background: #f5f5f5;
}

.accordion-icon {
  font-size: 1.5rem;
  transition: transform 0.3s;
  user-select: none;
}

.accordion-header.is-open .accordion-icon {
  transform: rotate(45deg);
}

.accordion-body {
  border-top: 1px solid #e5e7eb;
  padding: 1rem;
  background: #fafbfc;
}

.accordion-text {
  color: #333;
  line-height: 1.6;
}

@media (max-width: 640px) {
  .accordion-content {
    padding: 2rem 1rem;
  }

  .heading-title {
    font-size: 1.5rem;
  }
}
</style>
