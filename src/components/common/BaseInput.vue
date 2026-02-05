<script setup lang="ts">
import { useId } from 'vue'
import { cn } from '@/utils/cn'

interface Props {
  type?: string
  placeholder?: string
  class?: string
  disabled?: boolean
  id?: string
  invalid?: boolean
}

const {
  type = 'text',
  placeholder,
  class: className,
  disabled = false,
  id,
  invalid = false
} = defineProps<Props>()

const model = defineModel<string | number>()

const inputId = id || useId()
</script>

<template>
  <div class="w-full space-y-1">
    <input :id="inputId" v-model="model" :type="type" :placeholder="placeholder" :disabled="disabled" :class="cn(
      'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50',
      invalid && 'border-red-500 focus-visible:ring-red-500',
      className
    )" />

  </div>
</template>