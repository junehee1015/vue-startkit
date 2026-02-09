<script setup lang="ts">
import { BookOpen, Box } from 'lucide-vue-next'

const route = useRoute()

const menuItems = [
  { label: '사용자 가이드', to: '/guide', icon: BookOpen },
  { label: '세션 관리', to: '/sessions', icon: Box },
]

const isActive = (path: string) => route.path.startsWith(path)
</script>

<template>
  <aside class="w-64 border-r bg-white h-screen flex flex-col fixed left-0 top-0 z-30">
    <div class="h-14 flex items-center px-6 border-b">
      <Box class="h-6 w-6 text-blue-600 mr-2" />
      <span class="font-bold text-lg tracking-tight">Vue Startkit</span>
    </div>

    <nav class="flex-1 overflow-y-auto py-4 px-3 space-y-1">
      <RouterLink
        v-for="item in menuItems"
        :key="item.to"
        :to="item.to"
        :class="
          cn(
            'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
            isActive(item.to)
              ? 'bg-blue-50 text-blue-700'
              : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900',
          )
        "
      >
        <component
          :is="item.icon"
          class="h-5 w-5 mr-3 shrink-0"
          :class="isActive(item.to) ? 'text-blue-600' : 'text-gray-400'"
        />
        {{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>
