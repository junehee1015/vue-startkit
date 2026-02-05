<script setup lang="ts">
import { cn } from '@/utils/cn'

interface Props {
  type?: string
  placeholder?: string
  errorMessage?: string
  class?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
})

const model = defineModel<string | number>()
</script>

<template>
  <div class="w-full space-y-1">
    <input
      v-model="model"
      :type="props.type"
      :placeholder="props.placeholder"
      :disabled="props.disabled"
      :class="
        cn(
          'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50',
          props.errorMessage && 'border-red-500 focus-visible:ring-red-500',
          props.class,
        )
      "
    />
    <p v-if="props.errorMessage" class="text-xs text-red-500 font-medium">
      {{ props.errorMessage }}
    </p>
  </div>
</template>
