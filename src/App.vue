<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import DefaultLayout from './components/layouts/DefaultLayout.vue'
</script>

<template>
  <RouterView v-slot="{ Component, route }">
    <component :is="route.meta.layout || DefaultLayout">
      <component :is="Component" />
    </component>
  </RouterView>

  <Toaster position="top-center" rich-colors />
  <ConfirmDialog />
  <VueQueryDevtools />
</template>
