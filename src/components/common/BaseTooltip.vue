<script setup lang="ts">
import {
  TooltipProvider,
  TooltipRoot,
  TooltipTrigger,
  TooltipPortal,
  TooltipContent,
  TooltipArrow,
} from 'radix-vue'

interface Props {
  content?: string
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  delayDuration?: number
  class?: string
}

const {
  content,
  side = 'top',
  align = 'center',
  delayDuration = 200,
  class: className,
} = defineProps<Props>()
</script>

<template>
  <TooltipProvider>
    <TooltipRoot :delay-duration="delayDuration">
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>

      <TooltipPortal>
        <TooltipContent
          :side="side"
          :align="align"
          :side-offset="5"
          :class="
            cn(
              'z-50 overflow-hidden rounded-md bg-gray-900 px-3 py-1.5 text-xs text-white animate-in fade-in-0 zoom-in-95',
              className,
            )
          "
        >
          <slot name="content">
            {{ content }}
          </slot>
          <TooltipArrow class="fill-gray-900" />
        </TooltipContent>
      </TooltipPortal>
    </TooltipRoot>
  </TooltipProvider>
</template>
