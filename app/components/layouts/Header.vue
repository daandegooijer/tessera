<template>
  <header class="border-b border-slate-200 py-4 sticky top-0 bg-white z-50">
    <div class="max-w-6xl mx-auto px-4 flex justify-between items-center">
      <Logo />
      <Navigation :items="items" />
    </div>
  </header>
</template>

<script setup lang="ts">
import type { MenuItem } from "~/types/common";

defineProps<{
  items?: MenuItem[];
  topbar?: MenuItem[];
}>();
</script>
