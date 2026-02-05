<script setup lang="ts">
import {
  PaginationRoot,
  PaginationList,
  PaginationListItem,
  PaginationPrev,
  PaginationNext,
  PaginationEllipsis,
} from 'radix-vue'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-vue-next'

interface Props {
  total: number
  siblingCount?: number
  showEdges?: boolean
  class?: string
  disabled?: boolean
}

const {
  total = 0,
  siblingCount = 1,
  showEdges = false,
  class: className,
  disabled = false
} = defineProps<Props>()

const page = defineModel<number>('page', { default: 1 })
</script>

<template>
  <PaginationRoot v-model:page="page" :total="total" :sibling-count="siblingCount" :show-edges="showEdges"
    :disabled="disabled" :class="cn('flex items-center gap-1', className)">
    <PaginationList v-slot="{ items }" class="flex items-center gap-1">

      <PaginationPrev as-child>
        <BaseButton variant="outline" size="sm" class="w-9 h-9 p-0" :disabled="page === 1 || disabled">
          <ChevronLeft class="h-4 w-4" />
        </BaseButton>
      </PaginationPrev>

      <template v-for="(item, index) in items">

        <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
          <BaseButton size="sm" class="w-9 h-9 p-0 transition-all" :variant="item.value === page ? 'primary' : 'ghost'"
            :disabled="disabled">
            {{ item.value }}
          </BaseButton>
        </PaginationListItem>

        <PaginationEllipsis v-else :key="item.type" class="flex h-9 w-9 items-center justify-center">
          <MoreHorizontal class="h-4 w-4 opacity-50" />
        </PaginationEllipsis>

      </template>

      <PaginationNext as-child>
        <BaseButton variant="outline" size="sm" class="w-9 h-9 p-0" :disabled="page === total || disabled">
          <ChevronRight class="h-4 w-4" />
        </BaseButton>
      </PaginationNext>

    </PaginationList>
  </PaginationRoot>
</template>