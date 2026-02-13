<template>
  <section class="py-12 md:py-16 px-4 bg-slate-50">
    <div class="max-w-4xl mx-auto">
      <div v-if="heading" class="mb-12 text-center">
        <h2 class="text-4xl md:text-5xl font-bold text-slate-900 mb-2">
          {{ heading.title }}
        </h2>
        <p v-if="heading.subtitle" class="text-lg text-slate-600">
          {{ heading.subtitle }}
        </p>
      </div>

      <UAccordion
        :items="mappedItems"
        type="multiple"
        :unmount-on-hide="false"
        :ui="{
          trigger: 'text-base font-semibold',
          body: 'text-base text-slate-700',
        }"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import type { AccordionContent } from "~/types/schemas";
import type { AccordionItem as UAccordionItem } from "@nuxt/ui";

const props = defineProps<AccordionContent>();

// Map items to UAccordion format (title -> label, text -> content)
const mappedItems = computed(
  () =>
    props.items.map((item) => ({
      label: item.title,
      content: item.text,
    })) as UAccordionItem[],
);
</script>
