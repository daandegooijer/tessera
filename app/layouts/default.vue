<template>
  <div class="app-layout">
    <Header :items="headerData.items" :topbar="headerData.topbar" />
    <main class="main-content" id="main-content">
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
import { headerData, footerData } from '~/data/content'
</script>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}
</style>
