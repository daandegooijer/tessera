<template>
  <UApp>
    <div id="app" class="flex flex-col min-h-screen bg-white">
      <NuxtRouteAnnouncer />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </UApp>
</template>

<style>
@import "tailwindcss";
@import "@nuxt/ui";
</style>
