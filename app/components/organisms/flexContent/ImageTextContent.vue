<template>
  <section class="py-12 md:py-16 px-4">
    <div class="max-w-6xl mx-auto">
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center"
        :class="{ 'md:grid-cols-2': textLeft, 'md:grid-cols-2': !textLeft }"
      >
        <div v-if="!textLeft" class="order-2 md:order-1">
          <div class="overflow-hidden rounded-lg">
            <NuxtImg
              v-if="image"
              :src="image.url"
              :alt="image.alternativeText || 'Content image'"
              class="w-full h-auto display block"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        </div>

        <div class="order-1" :class="{ 'md:order-2': !textLeft }">
          <div v-if="paragraph.heading" class="mb-6">
            <h2 class="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
              {{ paragraph.heading.title }}
            </h2>
            <p v-if="paragraph.heading.subtitle" class="text-lg text-slate-600">
              {{ paragraph.heading.subtitle }}
            </p>
          </div>

          <div
            class="text-slate-700 leading-relaxed space-y-4 mb-6"
            v-html="paragraph.text"
          />

          <div v-if="paragraph.buttons?.length" class="flex flex-wrap gap-4">
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

        <div v-if="textLeft">
          <div class="overflow-hidden rounded-lg">
            <NuxtImg
              v-if="image"
              :src="image.url"
              :alt="image.alternativeText || 'Content image'"
              class="w-full h-auto display block"
              sizes="(max-width: 640px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { ImageTextContent } from "~/types/schemas";

defineProps<ImageTextContent>();
</script>
