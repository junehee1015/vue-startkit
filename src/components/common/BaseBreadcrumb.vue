<script setup lang="ts">
import { ChevronRight, Home } from 'lucide-vue-next'

export interface BreadcrumbItem {
  label: string
  to?: string
}

interface Props {
  items: BreadcrumbItem[]
  class?: string
}

const { items, class: className } = defineProps<Props>()
</script>

<template>
  <nav aria-label="Breadcrumb" :class="cn('flex items-center text-sm text-gray-500', className)">
    <ol class="flex items-center space-x-2">
      <li>
        <RouterLink to="/" class="flex items-center hover:text-gray-900 transition-colors">
          <Home class="h-4 w-4" />
        </RouterLink>
      </li>

      <li v-for="(item, index) in items" :key="index" class="flex items-center">
        <ChevronRight class="h-4 w-4 text-gray-400 mx-1" />

        <RouterLink
          v-if="item.to"
          :to="item.to"
          class="hover:text-gray-900 transition-colors font-medium"
        >
          {{ item.label }}
        </RouterLink>

        <span v-else class="font-semibold text-gray-900" aria-current="page">
          {{ item.label }}
        </span>
      </li>
    </ol>
  </nav>
</template>
