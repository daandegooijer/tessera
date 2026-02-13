<template>
  <nav class="flex items-center gap-8">
    <ul class="flex list-none gap-6 m-0 p-0">
      <li v-for="item in items" :key="item.label">
        <div v-if="item.subItems?.length">
          <UDropdownMenu
            :items="[
              item.subItems.map((sub) => ({
                label: sub.label,
                icon: 'i-lucide-link',
                to: sub.link.href,
                target: sub.link.target,
              })),
            ]"
            :ui="{ content: 'w-48' }"
          >
            <UButton
              variant="ghost"
              color="neutral"
              class="text-slate-700 hover:text-primary-600 transition-colors"
            >
              <span>{{ item.label }}</span>
              <UIcon name="i-lucide-chevron-down" class="w-4 h-4 ml-1" />
            </UButton>
          </UDropdownMenu>
        </div>
        <div v-else>
          <UButton
            variant="ghost"
            :to="item.link.href"
            color="neutral"
            class="text-slate-700 hover:text-primary-600 transition-colors"
          >
            {{ item.label }}
          </UButton>
        </div>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import type { MenuItem } from "~/types/common";

defineProps<{
  items: MenuItem[];
}>();
</script>
