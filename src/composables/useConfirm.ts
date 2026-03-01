interface ConfirmOptions {
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  variant?: 'primary' | 'danger'
  hideCancel?: boolean // Alert 모드를 위한 옵션 추가
}

const isOpen = ref(false)
const options = ref<ConfirmOptions>({
  title: '',
  description: '',
  confirmText: '확인',
  cancelText: '취소',
  variant: 'primary',
  hideCancel: false,
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

const handleOpenChange = (open: boolean) => {
  if (!open && isOpen.value) {
    handleCancel()
  } else {
    isOpen.value = open
  }
}

export const useConfirmState = () => {
  return { isOpen, options, handleConfirm, handleCancel, handleOpenChange }
}

export const useConfirm = (userOptions: ConfirmOptions): Promise<boolean> => {
  options.value = {
    confirmText: '확인',
    cancelText: '취소',
    variant: 'primary',
    hideCancel: false, // 기본값은 취소 버튼 표시
    ...userOptions,
  }
  isOpen.value = true

  return new Promise((resolve) => {
    resolvePromise = resolve
  })
}

export const useAlert = (
  userOptions: Omit<ConfirmOptions, 'hideCancel' | 'cancelText'>,
): Promise<boolean> => {
  return useConfirm({
    ...userOptions,
    hideCancel: true,
  })
}
