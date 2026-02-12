<script setup lang="ts">
definePage({
  name: 'guide',
  meta: {
    title: '사용자 가이드',
    breadcrumb: '사용자 가이드',
  },
})

const tabs = [
  { label: 'API & 상태관리', value: 'api' },
  { label: '공통 컴포넌트', value: 'common' },
]

const currentTab = ref('api') // BaseTabs의 v-model과 연결
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto space-y-8">
    <div>
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">사용자 가이드</h1>
      <p class="mt-2 text-gray-600">Vue-Startkit의 핵심 기능과 개발 규칙을 확인하는 공간입니다.</p>
    </div>

    <BaseTabs v-model="currentTab" :items="tabs" variant="underline">
      <template #content-api>
        <div class="py-6">
          <GuideApi />
        </div>
      </template>

      <template #content-common>
        <div class="py-6">
          <GuideCommon />
        </div>
      </template>
    </BaseTabs>
  </div>
</template>
