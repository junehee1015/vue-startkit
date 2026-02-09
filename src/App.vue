<script setup lang="ts">
import { Toaster } from 'vue-sonner'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'

const route = useRoute()
</script>

<template>
  <!-- 라우터 meta에 layout 설정이 없으면 Default 사용 -->
  <component :is="route.meta.layout || 'div'">
    <RouterView />
  </component>

  <Toaster position="top-center" rich-colors />
  <ConfirmDialog />

  <VueQueryDevtools />
</template>
