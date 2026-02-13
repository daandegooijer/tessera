<template>
  <section
    :class="['py-12 md:py-16 px-4', hasBackground ? 'bg-slate-50' : 'bg-white']"
  >
    <div
      class="max-w-4xl mx-auto"
      :class="{ 'grid grid-cols-1 md:grid-cols-2 gap-8': isColumnView }"
    >
      <div v-if="paragraph.heading" class="mb-6 md:mb-8">
        <h2 class="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
          {{ paragraph.heading.title }}
        </h2>
        <p v-if="paragraph.heading.subtitle" class="text-lg text-slate-600">
          {{ paragraph.heading.subtitle }}
        </p>
      </div>

      <div
        class="text-slate-700 leading-relaxed space-y-4"
        v-html="paragraph.text"
      />

      <div v-if="paragraph.buttons?.length" class="flex flex-wrap gap-4 mt-6">
        <UButton
          v-for="button in paragraph.buttons"
          :key="button.label"
          :to="button.link.href"
          size="md"
          color="slate"
        >
          {{ button.label }}
        </UButton>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { TextContent } from "~/types/schemas";

defineProps<TextContent>();
</script>
