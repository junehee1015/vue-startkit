<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'

import DefaultLayout from '@/components/layouts/DefaultLayout.vue'

const route = useRoute()
</script>

<template>
  <!-- 라우터 meta에 layout 설정이 없으면 Default 사용 -->
  <component :is="route.meta.layout || DefaultLayout">
    <RouterView />
  </component>

  <Toaster position="top-right" />
  <ConfirmDialog />

  <VueQueryDevtools />
</template>
