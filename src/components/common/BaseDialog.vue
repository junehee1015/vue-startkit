<script setup lang="ts">
import {
  DialogRoot,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from 'radix-vue'
import { X } from 'lucide-vue-next'
import { cn } from '@/utils/cn'

interface Props {
  title?: string
  description?: string
  class?: string
}

const props = defineProps<Props>()

const open = defineModel<boolean>('open')
</script>

<template>
  <DialogRoot v-model:open="open">
    <DialogTrigger as-child>
      <slot name="trigger" />
    </DialogTrigger>

    <DialogPortal>
      <DialogOverlay
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
      />

      <DialogContent
        :class="
          cn(
            'fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg',
            props.class,
          )
        "
      >
        <div class="flex flex-col space-y-1.5 text-center sm:text-left">
          <DialogTitle v-if="title" class="text-lg font-semibold leading-none tracking-tight">{{
            title
          }}</DialogTitle>
          <DialogDescription v-if="description" class="text-sm text-muted-foreground">{{
            description
          }}</DialogDescription>
        </div>

        <slot />

        <DialogClose
          class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        >
          <X class="h-4 w-4" />
          <span class="sr-only">Close</span>
        </DialogClose>

        <div
          v-if="$slots.footer"
          class="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2"
        >
          <slot name="footer" />
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>
