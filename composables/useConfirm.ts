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
    message?: string,
    confirmText?: string,
    cancelText?: string,
    icon?: string
  } | string): Promise<boolean> => {
    isOpen.value = true
    if (typeof options === 'string') {
      title.value = '¿Estás seguro?'
      message.value = options
      confirmText.value = 'Confirmar'
      cancelText.value = 'Cancelar'
      icon.value = 'lucide:alert-triangle'
    } else {
      title.value = options.title || '¿Estás seguro?'
      message.value = options.message || ''
      confirmText.value = options.confirmText || 'Confirmar'
      cancelText.value = options.cancelText || 'Cancelar'
      icon.value = options.icon || 'lucide:alert-triangle'
    }

    return new Promise((resolve) => {
      resolvePromise.value = resolve
    })
  }

  const onConfirm = () => {
    isOpen.value = false
    const resolve = resolvePromise.value
    resolvePromise.value = null
    if (resolve) resolve(true)
  }

  const onCancel = () => {
    isOpen.value = false
    const resolve = resolvePromise.value
    resolvePromise.value = null
    if (resolve) resolve(false)
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
