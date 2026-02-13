<template>
  <div class="flex flex-col min-h-screen">
    <Header :items="headerData.items" :topbar="headerData.topbar" />
    <main class="flex-1" id="main-content">
      <slot />
    </main>
    <Footer
      :items="footerData.items"
      :bottombar="footerData.bottombar"
      :socials="footerData.socials"
      :addresses="footerData.addresses"
    />
  </div>
</template>

<script setup lang="ts">
import { headerData, footerData } from "~/data/content";
</script>
