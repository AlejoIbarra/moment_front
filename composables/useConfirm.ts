import { ref } from 'vue'

const isOpen = ref(false)
const title = ref('')
const message = ref('')
const confirmText = ref('')
const cancelText = ref('')
const icon = ref('')
const resolvePromise = ref<((value: boolean) => void) | null>(null)

export const useConfirm = () => {
  const confirm = (options: {
    title?: string,
    message: string,
    confirmText?: string,
    cancelText?: string,
    icon?: string
  }): Promise<boolean> => {
    isOpen.value = true
    title.value = options.title || '¿Estás seguro?'
    message.value = options.message
    confirmText.value = options.confirmText || 'Confirmar'
    cancelText.value = options.cancelText || 'Cancelar'
    icon.value = options.icon || 'lucide:alert-triangle'

    return new Promise((resolve) => {
      resolvePromise.value = resolve
    })
  }

  const onConfirm = () => {
    isOpen.value = false
    if (resolvePromise.value) resolvePromise.value(true)
  }

  const onCancel = () => {
    isOpen.value = false
    if (resolvePromise.value) resolvePromise.value(false)
  }

  return {
    isOpen,
    title,
    message,
    confirmText,
    cancelText,
    icon,
    confirm,
    onConfirm,
    onCancel
  }
}
