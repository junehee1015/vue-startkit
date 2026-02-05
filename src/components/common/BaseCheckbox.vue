<script setup lang="ts">
import { CheckboxRoot, CheckboxIndicator } from 'radix-vue'
import { Check } from 'lucide-vue-next'

interface Props {
  disabled?: boolean
  class?: string
  id?: string
}

const {
  disabled = false,
  class: className,
  id
} = defineProps<Props>()

const checked = defineModel<boolean>('checked')
const checkboxId = id || useId()
</script>

<template>
  <CheckboxRoot v-model:checked="checked" :id="checkboxId" :disabled="disabled" :class="cn(
    'peer h-4 w-4 shrink-0 rounded-sm border border-gray-300 ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 data-[state=checked]:text-white',
    className
  )">
    <CheckboxIndicator class="flex items-center justify-center text-current">
      <Check class="h-3.5 w-3.5 stroke-[3px]" />
    </CheckboxIndicator>
  </CheckboxRoot>
</template>