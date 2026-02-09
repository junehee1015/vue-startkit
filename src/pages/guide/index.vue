<script setup lang="ts">
definePage({
  meta: {
    title: '사용자 가이드',
    breadcrumb: '가이드',
    requiresAuth: true,
  },
})
</script>

<template>
  <div class="p-6 max-w-4xl space-y-8">
    <div>
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">사용자 가이드</h1>
      <p class="mt-2 text-gray-600">Vue 3 Startkit의 컴포넌트 및 유틸리티 사용법을 안내합니다.</p>
    </div>

    <section class="space-y-4">
      <h2 class="text-xl font-semibold border-b pb-2">1. 공통 컴포넌트 (Common)</h2>
      <p class="text-sm text-gray-500">TODO: BaseInput, BaseButton 등 사용법 작성</p>
    </section>

    <section class="space-y-4">
      <h2 class="text-xl font-semibold border-b pb-2">2. API 호출 (Ofetch)</h2>
      <p class="text-sm text-gray-500">TODO: api() 인스턴스 사용법 작성</p>
    </section>
  </div>
</template>
