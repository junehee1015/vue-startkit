<script setup lang="ts">
import { Loader2 } from 'lucide-vue-next'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  class?: string
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
  loading?: boolean
  to?: string
}

const {
  variant = 'primary',
  size = 'md',
  type = 'button',
  class: className,
  disabled = false,
  loading = false,
  to,
} = defineProps<Props>()

const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
  secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
  outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 text-gray-700',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  danger: 'bg-red-600 text-white hover:bg-red-700',
}

const sizes = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

const buttonClass = computed(() => {
  return cn(
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    className,
  )
})
</script>

<template>
  <component
    :is="to ? 'RouterLink' : 'button'"
    :to="to"
    :type="to ? undefined : type"
    :class="[buttonClass, loading && 'opacity-70 cursor-wait']"
    :disabled="disabled || loading"
  >
    <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
    <slot />
  </component>
</template>
