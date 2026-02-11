<script setup lang="ts">
interface Props {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning'
  class?: string
}

const { variant = 'default', class: className } = defineProps<Props>()

const variants = {
  default: 'border-transparent bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200',
  outline: 'text-gray-950 border-gray-200 hover:bg-gray-100',
  destructive: 'border-transparent bg-red-500 text-white hover:bg-red-600',
  success: 'border-transparent bg-green-500 text-white hover:bg-green-600', // 성공
  warning: 'border-transparent bg-yellow-500 text-white hover:bg-yellow-600', // 경고
}
</script>

<template>
  <div
    :class="
      cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2',
        variants[variant],
        className,
      )
    "
  >
    <slot />
  </div>
</template>
