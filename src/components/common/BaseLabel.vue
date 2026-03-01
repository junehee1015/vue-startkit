<script setup lang="ts">
import { cn } from '@/utils/cn'
import { Label } from 'reka-ui'

interface Props {
  class?: string
  for?: string
}

const { class: className, for: htmlFor } = defineProps<Props>()
</script>

<template>
  <Label
    :for="htmlFor"
    :class="
      cn(
        'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className,
      )
    "
  >
    <slot />
  </Label>
</template>
