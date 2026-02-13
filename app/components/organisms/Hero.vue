<template>
  <section
    class="relative flex items-center justify-center min-h-screen p-4 text-white overflow-hidden"
  >
    <!-- Background Image -->
    <div v-if="image" class="absolute inset-0 overflow-hidden">
      <NuxtImg
        :src="image.url"
        :alt="image.alternativeText || 'Hero image'"
        class="w-full h-full object-cover object-center"
        sizes="100vw"
      />
    </div>

    <!-- Dark Overlay -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/60 to-black/90" />

    <!-- Content -->
    <div class="relative z-10 flex items-center justify-center max-w-4xl">
      <div class="flex flex-col gap-4 text-center">
        <h1 class="text-5xl md:text-6xl font-bold leading-tight">
          {{ title }}
        </h1>

        <p v-if="subtitle" class="text-xl md:text-2xl opacity-90">
          {{ subtitle }}
        </p>

        <div
          v-if="text"
          class="text-base md:text-lg max-w-2xl mx-auto opacity-95 leading-relaxed"
          v-html="text"
        />

        <div
          v-if="buttons?.length"
          class="flex flex-wrap gap-4 justify-center mt-6"
        >
          <UButton
            v-for="button in buttons"
            :key="button.label"
            :to="button.link.href"
            size="lg"
            variant="outline"
            color="white"
          >
            {{ button.label }}
          </UButton>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Hero as HeroProps } from "~/types/common";

defineProps<HeroProps>();
</script>
