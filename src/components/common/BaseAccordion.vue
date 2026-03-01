<script setup lang="ts">
import {
  AccordionRoot,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionContent,
} from 'reka-ui'
import { ChevronDown } from 'lucide-vue-next'
import { cn } from '@/utils/cn'

interface AccordionItemData {
  value: string
  title: string
  content?: string
}

interface Props {
  items: AccordionItemData[]
  type?: 'single' | 'multiple'
  collapsible?: boolean
  class?: string
}

const { items, type = 'single', collapsible = true, class: className } = defineProps<Props>()

const modelValue = defineModel<string | string[]>()
</script>

<template>
  <AccordionRoot
    v-model="modelValue"
    :type="type"
    :collapsible="collapsible"
    :class="
      cn(
        'w-full border border-gray-200 rounded-lg divide-y divide-gray-200 bg-white shadow-sm',
        className,
      )
    "
  >
    <AccordionItem
      v-for="item in items"
      :key="item.value"
      :value="item.value"
      class="overflow-hidden focus-within:relative focus-within:z-10 focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-inset"
    >
      <AccordionHeader class="flex">
        <AccordionTrigger
          class="flex flex-1 items-center justify-between py-4 px-5 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-50 [&[data-state=open]>svg]:rotate-180 focus:outline-none"
        >
          {{ item.title }}
          <ChevronDown
            class="h-4 w-4 shrink-0 text-gray-500 transition-transform duration-200 ease-in-out"
          />
        </AccordionTrigger>
      </AccordionHeader>

      <AccordionContent
        class="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      >
        <div class="px-5 pb-4 pt-1 text-gray-600 leading-relaxed">
          <slot :name="`content-${item.value}`" :item="item">
            {{ item.content }}
          </slot>
        </div>
      </AccordionContent>
    </AccordionItem>
  </AccordionRoot>
</template>

<style scoped>
@keyframes accordion-down {
  from {
    height: 0;
  }
  to {
    height: var(--reka-accordion-content-height);
  }
}
@keyframes accordion-up {
  from {
    height: var(--reka-accordion-content-height);
  }
  to {
    height: 0;
  }
}
.animate-accordion-down {
  animation: accordion-down 0.2s ease-out;
}
.animate-accordion-up {
  animation: accordion-up 0.2s ease-out;
}
</style>
