<template>
  <footer class="border-t border-slate-200 bg-slate-50">
    <!-- Footer Content -->
    <div class="max-w-6xl mx-auto px-4 py-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Footer Sections -->
        <div v-for="section in items" :key="section.title">
          <h3 v-if="section.title" class="font-semibold text-slate-900 mb-4">
            {{ section.title }}
          </h3>
          <ul class="space-y-2">
            <li v-for="item in section.items" :key="item.label">
              <NuxtLink
                :to="item.link.href"
                class="text-slate-600 hover:text-primary-600 text-sm transition-colors"
              >
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Addresses -->
        <div v-if="addresses?.length">
          <div v-for="address in addresses" :key="address.title">
            <h3 class="font-semibold text-slate-900 mb-3 text-sm">
              {{ address.title }}
            </h3>
            <div class="space-y-1 text-sm text-slate-600">
              <p v-if="address.street">
                {{ address.street }} {{ address.houseNumber
                }}{{
                  address.houseNumberAddition
                    ? ` ${address.houseNumberAddition}`
                    : ""
                }}
              </p>
              <p v-if="address.postalCode">
                {{ address.postalCode }} {{ address.city }}
              </p>
              <a
                v-if="address.email"
                :href="`mailto:${address.email}`"
                class="block hover:text-primary-600 transition-colors"
              >
                {{ address.email }}
              </a>
              <a
                v-if="address.phone"
                :href="address.phone.href"
                class="block hover:text-primary-600 transition-colors"
              >
                {{ address.phone.label }}
              </a>
            </div>
          </div>
        </div>

        <!-- Social Links -->
        <div v-if="socials?.length">
          <h3 class="font-semibold text-slate-900 mb-4">Follow us</h3>
          <div class="flex gap-4">
            <a
              v-for="social in socials"
              :key="social.channel"
              :href="social.url"
              target="_blank"
              rel="noopener noreferrer"
              class="text-slate-600 hover:text-primary-600 text-sm capitalize transition-colors"
            >
              {{ social.channel }}
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Bottom -->
    <div class="border-t border-slate-200 bg-white">
      <div class="max-w-6xl mx-auto px-4 py-4">
        <ul v-if="bottombar?.length" class="flex justify-center gap-6">
          <li v-for="item in bottombar" :key="item.label">
            <NuxtLink
              :to="item.link.href"
              class="text-slate-600 hover:text-primary-600 text-xs transition-colors"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import type { Menu, MenuItem, Address, Social } from "~/types/common";

defineProps<{
  items?: Menu[];
  bottombar?: MenuItem[];
  socials?: Social[];
  addresses?: Address[];
}>();
</script>
