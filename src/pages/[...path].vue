<script setup lang="ts">
import EmptyLayout from '@/layouts/EmptyLayout.vue'

definePage({
  name: 'not-found',
  meta: {
    layout: EmptyLayout,
    title: '404 Not Found',
    requiresAuth: false,
  },
})
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center px-4 text-center">
    <div class="space-y-4">
      <h1 class="text-9xl font-black text-gray-300">404</h1>

      <div class="space-y-2">
        <h2 class="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          페이지를 찾을 수 없습니다
        </h2>
        <p class="text-gray-500 max-w-sm mx-auto">
          요청하신 페이지가 존재하지 않거나, 주소가 변경되었을 수 있습니다.
        </p>
      </div>

      <div class="pt-4">
        <BaseButton size="lg" class="cursor-pointer" @click="$router.push('/')">
          홈으로 돌아가기
        </BaseButton>
      </div>
    </div>
  </div>
</template>
