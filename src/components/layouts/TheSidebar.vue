<script setup lang="ts">
import { cn } from '@/utils/cn'
import { BookOpen, Box, LayoutDashboard } from 'lucide-vue-next'

const menuItems = [
  // 1. Dashboard 같은 메인 페이지는 exactMatch 옵션이 필요할 수 있음
  { label: '대시보드', to: '/dashboard', icon: LayoutDashboard, exact: true },
  { label: '사용자 가이드', to: '/guide', icon: BookOpen },
]
</script>

<template>
  <aside class="w-64 border-r bg-white h-screen flex flex-col fixed left-0 top-0 z-30">
    <div class="h-14 flex items-center px-6 border-b shrink-0">
      <Box class="h-6 w-6 text-blue-600 mr-2" />
      <span class="font-bold text-lg tracking-tight">Vue Startkit</span>
    </div>

    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      <RouterLink
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        :active-class="'bg-blue-50 text-blue-700'"
        :exact-active-class="item.exact ? 'bg-blue-50 text-blue-700' : ''"
        :class="
          cn(
            'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
            'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
          )
        "
      >
        <component
          :is="item.icon"
          class="h-5 w-5 mr-3 shrink-0 transition-colors group-hover:text-gray-500 group-[.router-link-active]:text-blue-600 text-gray-400"
        />
        {{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>
