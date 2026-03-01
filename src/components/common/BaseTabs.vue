<script setup lang="ts">
import { TabsRoot, TabsList, TabsTrigger, TabsContent } from 'reka-ui'
import { cn } from '@/utils/cn'

interface TabItem {
  value: string
  label: string
  disabled?: boolean
}

interface Props {
  items: TabItem[]
  defaultValue?: string
  variant?: 'segment' | 'underline'
  class?: string
}

const { items, defaultValue, variant = 'segment', class: className } = defineProps<Props>()

const currentTab = defineModel<string>('modelValue')
</script>

<template>
  <TabsRoot
    v-model="currentTab"
    :default-value="defaultValue || items[0]?.value"
    :class="cn('w-full flex flex-col', className)"
  >
    <TabsList
      :class="
        cn(
          'flex items-center',
          variant === 'segment'
            ? 'inline-flex h-11 items-center justify-center rounded-lg bg-gray-100/80 p-1 text-gray-500'
            : 'w-full border-b border-gray-200 bg-transparent gap-6',
        )
      "
    >
      <TabsTrigger
        v-for="item in items"
        :key="item.value"
        :value="item.value"
        :disabled="item.disabled"
        :class="
          cn(
            'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',

            // Style: Segment (박스형)
            variant === 'segment' && [
              'rounded-md px-3 py-1.5 w-full',
              'data-[state=active]:bg-white data-[state=active]:text-gray-950 data-[state=active]:shadow-sm',
              'hover:text-gray-900',
            ],

            // Style: Underline (밑줄형)
            variant === 'underline' && [
              'relative h-11 rounded-none px-1',
              'text-gray-500 hover:text-gray-700',
              // 활성 상태일 때 텍스트 색상 변경 및 하단 라인 표시
              'data-[state=active]:text-blue-600 data-[state=active]:font-semibold',
              // 가상 요소(after)를 사용한 하단 밑줄 애니메이션 효과
              'after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-blue-600 after:transition-transform after:duration-300 data-[state=active]:after:scale-x-100',
            ],
          )
        "
      >
        {{ item.label }}
      </TabsTrigger>
    </TabsList>

    <div class="mt-4 flex-1 outline-none">
      <template v-for="item in items" :key="item.value">
        <TabsContent
          :value="item.value"
          class="outline-none animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
        >
          <slot :name="`content-${item.value}`" />
        </TabsContent>
      </template>
      <slot />
    </div>
  </TabsRoot>
</template>
