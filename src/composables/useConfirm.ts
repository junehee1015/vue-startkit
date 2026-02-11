interface ConfirmOptions {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'primary' | 'danger'
}

const isOpen = ref(false)
const options = ref<ConfirmOptions>({
  title: '',
  description: '',
  confirmText: '확인',
  cancelText: '취소',
  variant: 'primary',
})

let resolvePromise: (value: boolean) => void = () => {}

const handleConfirm = () => {
  isOpen.value = false
  resolvePromise(true)
}

const handleCancel = () => {
  isOpen.value = false
  resolvePromise(false)
}

export const useConfirmState = () => {
  return { isOpen, options, handleConfirm, handleCancel }
}

export const useConfirm = (userOptions: ConfirmOptions): Promise<boolean> => {
  options.value = {
    confirmText: '확인',
    cancelText: '취소',
    variant: 'primary',
    ...userOptions,
  }
  isOpen.value = true

  return new Promise((resolve) => {
    resolvePromise = resolve
  })
}
