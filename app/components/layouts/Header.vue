<template>
  <header class="header">
    <div class="header-content">
      <Logo />
      <Navigation :items="items" />
    </div>
  </header>
</template>

<script setup lang="ts">
import type { MenuItem } from '~/types/common'

defineProps<{
  items?: MenuItem[]
  topbar?: MenuItem[]
}>()
</script>

<style scoped>
.header {
  border-bottom: 1px solid #e5e7eb;
  padding: 1rem 0;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
</style>
