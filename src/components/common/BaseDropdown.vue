<script setup lang="ts">
import { cn } from '@/utils/cn'
import {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
} from 'reka-ui'

export interface DropdownItem {
  label?: string
  icon?: Component
  onClick?: () => void
  danger?: boolean
  separator?: boolean
}

interface Props {
  items?: DropdownItem[]
  label?: string
  align?: 'start' | 'center' | 'end'
  width?: string
}

const { items = [], label, align = 'end', width = 'w-56' } = defineProps<Props>()
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger as-child>
      <slot />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        :align="align"
        :side-offset="5"
        :class="
          cn(
            'z-50 min-w-32 overflow-hidden rounded-md border bg-white p-1 shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2',
            width,
          )
        "
      >
        <template v-if="items.length > 0">
          <DropdownMenuLabel v-if="label" class="px-2 py-1.5 text-xs font-semibold text-gray-500">
            {{ label }}
          </DropdownMenuLabel>
          <DropdownMenuSeparator v-if="label" class="-mx-1 my-1 h-px bg-gray-100" />

          <DropdownMenuGroup>
            <template v-for="(item, index) in items" :key="index">
              <DropdownMenuSeparator v-if="item.separator" class="-mx-1 my-1 h-px bg-gray-100" />

              <DropdownMenuItem
                v-else
                @select="item.onClick"
                :class="
                  cn(
                    'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-disabled:pointer-events-none data-disabled:opacity-50',
                    item.danger && 'text-red-600 focus:text-red-600 focus:bg-red-50',
                  )
                "
              >
                <component :is="item.icon" v-if="item.icon" class="mr-2 h-4 w-4" />
                <span>{{ item.label }}</span>
              </DropdownMenuItem>
            </template>
          </DropdownMenuGroup>
        </template>

        <slot v-else name="content" />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>
