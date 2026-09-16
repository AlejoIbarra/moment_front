import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

export interface ActiveSubscription {
  active: boolean
  freePhotosRemaining: number
  endDate: string
}

export const useSubscriptionStore = defineStore('subscription', () => {
  const { $api } = useNuxtApp()
  const authStore = useAuthStore()

  const activeSubscription = ref<ActiveSubscription>({
    active: false,
    freePhotosRemaining: 0,
    endDate: ''
  })
  const loading = ref(false)
  const isSubscribing = ref(false)
  const error = ref('')

  const isActive = computed(() => activeSubscription.value.active)
  const freeRemaining = computed(() => activeSubscription.value.freePhotosRemaining)
  const price = ref(30000) // 30,000 COP

  const benefits = [
    {
      id: 'photos',
      icon: 'lucide:image',
      title: '10 Fotos en Alta Resolución al Mes',
      desc: 'Descarga hasta 10 fotos originales sin costo adicional cada mes.',
      badge: '10 Fotos / Mes'
    },
    {
      id: 'watermark',
      icon: 'lucide:sparkles',
      title: 'Descargas Directas Sin Marca de Agua',
      desc: 'Archivos en máxima calidad listos para imprimir o compartir en redes.',
      badge: 'Calidad Ultra HD'
    },
    {
      id: 'priority',
      icon: 'lucide:zap',
      title: 'Acceso Prioritario a Galerías',
      desc: 'Sé el primero en ver y descargar las fotos de tus eventos preferidos.',
      badge: 'Acceso VIP'
    },
    {
      id: 'discounts',
      icon: 'lucide:percent',
      title: 'Descuentos Exclusivos en Paquetes',
      desc: '15% de descuento adicional en paquetes completos de fotos.',
      badge: '15% OFF'
    },
    {
      id: 'pro_badge',
      icon: 'lucide:crown',
      title: 'Insignia Moments PRO',
      desc: 'Destácate con el emblema verificado PRO en tu perfil y comentarios.',
      badge: 'Distintivo PRO'
    },
    {
      id: 'cloud_storage',
      icon: 'lucide:cloud',
      title: 'Almacenamiento Permanente en la Nube',
      desc: 'Tus fotos compradas y canjeadas siempre seguras y respaldadas.',
      badge: 'Nube Cloudflare R2'
    }
  ]

  async function fetchActiveSubscription() {
    if (!authStore.isAuthenticated) {
      activeSubscription.value = { active: false, freePhotosRemaining: 0, endDate: '' }
      return
    }

    loading.value = true
    error.value = ''
    try {
      const data = await $api('/subscriptions/active')
      if (data) {
        activeSubscription.value = {
          active: !!data.active,
          freePhotosRemaining: data.freePhotosRemaining ?? 0,
          endDate: data.endDate || ''
        }
      }
    } catch (e: any) {
      console.error('Error fetching active subscription:', e)
      activeSubscription.value = { active: false, freePhotosRemaining: 0, endDate: '' }
    } finally {
      loading.value = false
    }
  }

  async function prepareSubscription() {
    if (!authStore.isAuthenticated) {
      throw new Error('Debes iniciar sesión para suscribirte.')
    }
    const data = await $api('/subscriptions/subscribe', {
      method: 'POST'
    })
    return data
  }

  async function startSubscriptionFlow(onSuccess?: () => void) {
    if (!authStore.isAuthenticated) {
      const router = useRouter()
      router.push('/login?redirect=/subscription')
      return
    }

    isSubscribing.value = true
    try {
      const prep = await prepareSubscription()

      const WidgetCheckoutClass = await getWompiWidget()
      if (!WidgetCheckoutClass) {
        throw new Error('La pasarela de pago Wompi no se encuentra disponible. Por favor recarga e intenta de nuevo.')
      }

      const checkoutOptions: any = {
        publicKey: prep.publicKey,
        currency: prep.currency || 'COP',
        amountInCents: prep.amountInCents,
        reference: prep.reference,
        redirectUrl: `${window.location.origin}/payment/success`,
        customerData: {
          email: prep.customerEmail
        }
      }

      if (prep.signature) {
        checkoutOptions.signature = { integrity: prep.signature }
      }

      const checkout = new WidgetCheckoutClass(checkoutOptions)
      checkout.open(async (res: any) => {
        if (res.transaction?.status === 'APPROVED') {
          await fetchActiveSubscription()
          if (onSuccess) onSuccess()
          const router = useRouter()
          router.push('/payment/success')
        }
      })
    } catch (e: any) {
      console.error('Subscription error:', e)
      throw e
    } finally {
      isSubscribing.value = false
    }
  }

  return {
    activeSubscription,
    loading,
    isSubscribing,
    error,
    isActive,
    freeRemaining,
    price,
    benefits,
    fetchActiveSubscription,
    prepareSubscription,
    startSubscriptionFlow
  }
})
