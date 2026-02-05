<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { User, Settings, LogOut } from 'lucide-vue-next'
import BaseBreadcrumb from '@/components/common/BaseBreadcrumb.vue'
import BaseDropdown, { type DropdownItem } from '@/components/common/BaseDropdown.vue'

const route = useRoute()
const breadcrumbs = computed(() => {
  const currentLabel = route.meta.breadcrumb as string || '페이지'
  return [
    { label: 'Home', to: '/' },
    { label: currentLabel }
  ]
})

const userMenuItems: DropdownItem[] = [
  { label: '내 프로필', icon: User },
  { label: '설정', icon: Settings, shortcut: '⌘S' },
  { label: '로그아웃', icon: LogOut, danger: true, separator: true, onClick: () => alert('로그아웃!') }
]
</script>

<template>
  <header class="h-14 border-b bg-white flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-20">
    <div>
      <BaseBreadcrumb :items="breadcrumbs" />
    </div>

    <div class="flex items-center gap-4">
      <BaseDropdown :items="userMenuItems" label="내 계정">
        <div class="flex items-center gap-2 hover:bg-gray-100 p-1.5 rounded-md transition-colors">
          <div
            class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
            JS
          </div>
          <div class="text-sm text-gray-700 font-medium">Jason Park</div>
        </div>
      </BaseDropdown>
    </div>
  </header>
</template>