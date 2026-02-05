<script setup lang="ts">
import {
  AlertDialogRoot,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from 'radix-vue'
import { useConfirmState } from '@/composables/useConfirm'

const { isOpen, options, handleConfirm, handleCancel } = useConfirmState()
</script>

<template>
  <AlertDialogRoot v-model:open="isOpen">
    <AlertDialogPortal>
      <AlertDialogOverlay
        class="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-in fade-in-0"
      />

      <AlertDialogContent
        class="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] rounded-lg bg-white p-6 shadow-lg animate-in zoom-in-95"
      >
        <div class="flex flex-col space-y-2 text-center sm:text-left">
          <AlertDialogTitle class="text-lg font-semibold">
            {{ options.title }}
          </AlertDialogTitle>
          <AlertDialogDescription v-if="options.description" class="text-sm text-gray-500">
            {{ options.description }}
          </AlertDialogDescription>
        </div>

        <div class="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <AlertDialogCancel as-child>
            <BaseButton variant="outline" @click="handleCancel">
              {{ options.cancelText }}
            </BaseButton>
          </AlertDialogCancel>

          <AlertDialogAction as-child>
            <BaseButton
              :variant="options.variant === 'danger' ? 'danger' : 'primary'"
              @click="handleConfirm"
            >
              {{ options.confirmText }}
            </BaseButton>
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialogPortal>
  </AlertDialogRoot>
</template>
