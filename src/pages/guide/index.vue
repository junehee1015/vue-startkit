<script setup lang="ts">
import GuideApi from '@/components/guide/GuideApi.vue'
// import GuideCommon from '@/components/guide/GuideCommon.vue' // 나중에 추가

definePage({
  meta: {
    title: '사용자 가이드',
    breadcrumb: '사용자 가이드',
  },
})

const tabs = [
  { label: '공통 컴포넌트', value: 'common' },
  { label: 'API & 상태관리', value: 'api' },
]

const currentTab = ref('api') // 기본값 API 탭
</script>

<template>
  <div class="p-6 max-w-5xl mx-auto space-y-8">
    <div>
      <h1 class="text-3xl font-bold tracking-tight text-gray-900">사용자 가이드</h1>
      <p class="mt-2 text-gray-600">Vue-Startkit의 핵심 기능과 개발 규칙을 확인하는 공간입니다.</p>
    </div>

    <div class="border-b border-gray-200">
      <nav class="-mb-px flex space-x-8" aria-label="Tabs">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          @click="currentTab = tab.value"
          :class="[
            currentTab === tab.value
              ? 'border-indigo-500 text-indigo-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
            'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors',
          ]"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <div class="py-4">
      <GuideApi v-if="currentTab === 'api'" />
      <div v-else-if="currentTab === 'common'" class="text-gray-500 py-10 text-center">
        🚧 공통 컴포넌트 가이드는 준비 중입니다.
      </div>
    </div>
  </div>
</template>
