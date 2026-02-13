<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- Footer Sections -->
      <div class="footer-sections">
        <div v-for="section in items" :key="section.title" class="footer-section">
          <h3 v-if="section.title" class="footer-section-title">{{ section.title }}</h3>
          <ul class="footer-menu">
            <li v-for="item in section.items" :key="item.label">
              <NuxtLink :to="item.link.href" class="footer-link">
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Addresses -->
      <div v-if="addresses?.length" class="footer-addresses">
        <div v-for="address in addresses" :key="address.title" class="address">
          <h3 class="address-title">{{ address.title }}</h3>
          <p v-if="address.street" class="address-text">
            {{ address.street }} {{ address.houseNumber }}{{ address.houseNumberAddition ? ` ${address.houseNumberAddition}` : '' }}
          </p>
          <p v-if="address.postalCode" class="address-text">
            {{ address.postalCode }} {{ address.city }}
          </p>
          <a v-if="address.email" :href="`mailto:${address.email}`" class="address-text">
            {{ address.email }}
          </a>
          <a v-if="address.phone" :href="address.phone.href" class="address-text">
            {{ address.phone.label }}
          </a>
        </div>
      </div>

      <!-- Social Links -->
      <div v-if="socials?.length" class="footer-socials">
        <a v-for="social in socials" :key="social.channel" :href="social.url" target="_blank" rel="noopener noreferrer" class="social-link">
          {{ social.channel }}
        </a>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="footer-bottom">
      <ul v-if="bottombar?.length" class="bottom-menu">
        <li v-for="item in bottombar" :key="item.label">
          <NuxtLink :to="item.link.href" class="bottom-link">
            {{ item.label }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { Menu, MenuItem, Address, Social } from '~/types/common'

defineProps<{
  items?: Menu[]
  bottombar?: MenuItem[]
  socials?: Social[]
  addresses?: Address[]
}>()
</script>

<style scoped>
.footer {
  border-top: 1px solid #e5e7eb;
  background: #f9fafb;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.footer-sections {
  display: contents;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-section-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.footer-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link {
  text-decoration: none;
  color: inherit;
  font-size: 0.9rem;
}

.footer-link:hover {
  opacity: 0.7;
}

.footer-addresses {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.address {
  display: flex;
  flex-direction: column;
}

.address-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
}

.address-text {
  font-size: 0.85rem;
  margin: 0.25rem 0;
  color: inherit;
}

.address-text a {
  text-decoration: none;
  color: inherit;
}

.footer-socials {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.social-link {
  text-decoration: none;
  color: inherit;
  font-size: 0.9rem;
  padding: 0.25rem 0.5rem;
}

.social-link:hover {
  opacity: 0.7;
}

.footer-bottom {
  border-top: 1px solid #e5e7eb;
  padding: 1rem;
  text-align: center;
}

.bottom-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.bottom-link {
  text-decoration: none;
  color: inherit;
  font-size: 0.85rem;
}

.bottom-link:hover {
  opacity: 0.7;
}
</style>
