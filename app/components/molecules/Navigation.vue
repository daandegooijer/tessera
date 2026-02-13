<template>
  <nav class="navigation">
    <ul class="menu">
      <li v-for="item in items" :key="item.label" class="menu-item">
        <NuxtLink :to="item.link.href" class="menu-link">
          {{ item.label }}
        </NuxtLink>
        <ul v-if="item.subItems?.length" class="submenu">
          <li v-for="subItem in item.subItems" :key="subItem.label">
            <NuxtLink :to="subItem.link.href" class="submenu-link">
              {{ subItem.label }}
            </NuxtLink>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import type { MenuItem } from '~/types/common'

defineProps<{
  items: MenuItem[]
}>()
</script>

<style scoped>
.navigation {
  padding: 0;
}

.menu {
  list-style: none;
  display: flex;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

.menu-item {
  position: relative;
}

.menu-link {
  text-decoration: none;
  color: inherit;
  padding: 0.5rem 1rem;
}

.menu-link:hover {
  opacity: 0.7;
}

.submenu {
  list-style: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: white;
  padding: 0.5rem 0;
  margin: 0.5rem 0 0 0;
  min-width: 150px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: none;
}

.menu-item:hover .submenu {
  display: block;
}

.submenu-link {
  display: block;
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: inherit;
}

.submenu-link:hover {
  background: #f5f5f5;
}
</style>
