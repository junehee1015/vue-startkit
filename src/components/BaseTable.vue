<script setup lang="ts" generic="T">
import { cn } from '@/utils/cn'
import { Inbox } from 'lucide-vue-next'

export interface Column {
  key: string
  label: string
  class?: string
  formatter?: (value: unknown) => string
}

interface Props {
  columns: Column[]
  data?: T[]
  loading?: boolean
  total?: number
  limit?: number
  hidePagination?: boolean
  noDataMessage?: string
  class?: string
  rowKey?: string
}

const {
  loading = false,
  data = [],
  total = 0,
  limit = 10,
  hidePagination = false,
  noDataMessage = '데이터가 존재하지 않습니다.',
  columns,
  class: className,
  rowKey = 'id',
} = defineProps<Props>()

const page = defineModel<number>('page', { default: 1 })

const emit = defineEmits<{
  rowClick: [row: T]
}>()

const tableId = useId()
const scrollContainer = useTemplateRef<HTMLElement>('scrollContainer')

const columnCount = computed(() => columns.length)

watch(page, () => {
  scrollContainer.value?.scrollTo({ top: 0, behavior: 'smooth' })
})
</script>

<template>
  <div class="space-y-4">
    <div
      ref="scrollContainer"
      :class="cn('relative w-full overflow-auto rounded-md border bg-white', className)"
    >
      <table :id="tableId" class="w-full caption-bottom text-sm text-left">
        <thead class="[&_tr]:border-b">
          <tr
            class="border-b transition-colors hover:bg-gray-50/50 data-[state=selected]:bg-gray-50"
          >
            <th
              v-for="col in columns"
              :key="col.key"
              :class="
                cn(
                  'h-10 px-4 text-left align-middle font-medium text-gray-500 [&:has([role=checkbox])]:pr-0',
                  col.class,
                )
              "
            >
              {{ col.label }}
            </th>
          </tr>
        </thead>

        <tbody class="[&_tr:last-child]:border-0">
          <template v-if="loading">
            <tr v-for="i in limit" :key="i" class="border-b transition-colors hover:bg-gray-50/50">
              <td v-for="j in columnCount" :key="j" class="p-4 align-middle">
                <BaseSkeleton class="h-5 w-full" />
              </td>
            </tr>
          </template>

          <template v-else-if="data.length === 0">
            <tr class="border-b transition-colors hover:bg-gray-50/50">
              <td :colspan="columnCount" class="p-4 align-middle h-60 text-center">
                <div class="flex flex-col items-center justify-center text-gray-500">
                  <Inbox class="h-10 w-10 mb-2 stroke-1 opacity-50" />
                  <p>{{ noDataMessage }}</p>
                </div>
              </td>
            </tr>
          </template>

          <template v-else>
            <tr
              v-for="(row, rowIndex) in data"
              :key="(row as any)[rowKey] || rowIndex"
              class="border-b transition-colors hover:bg-gray-50/50 cursor-pointer"
              @click="emit('rowClick', row)"
            >
              <td
                v-for="col in columns"
                :key="col.key"
                :class="cn('p-4 align-middle [&:has([role=checkbox])]:pr-0', col.class)"
              >
                <slot :name="`cell-${col.key}`" :row="row" :value="(row as any)[col.key]">
                  {{ col.formatter ? col.formatter((row as any)[col.key]) : (row as any)[col.key] }}
                </slot>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>

    <div v-if="!loading && !hidePagination && total > 0" class="flex justify-end">
      <BasePagination v-model:page="page" :total="Math.ceil(total / limit)" :sibling-count="1" />
    </div>
  </div>
</template>
