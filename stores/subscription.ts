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
  const price = ref(5000) // 5,000 COP
  const originalPrice = ref(15000) // 15,000 COP

  const benefits = [
    {
      id: 'photographer_private',
      icon: 'lucide:lock',
      title: 'Álbumes Privados y Entregas VIP (Fotógrafos)',
      desc: 'Crea eventos protegidos con enlace exclusivo, correos autorizados y descarga directa sin marcas para tus clientes privados.',
      badge: 'Exclusivo Fotógrafos'
    },
    {
      id: 'extra_photo',
      icon: 'lucide:plus-circle',
      title: '+1 Foto Extra en Cada Paquete (Compradores)',
      desc: 'Por cada paquete de fotos que compres, recibe 1 foto adicional incluida de regalo.',
      badge: '+1 Foto Gratis'
    },
    {
      id: 'pro_badge',
      icon: 'lucide:crown',
      title: 'Insignia Dorada Moments PRO',
      desc: 'Destácate con el emblema verificado PRO en tu perfil, vitrina y comentarios.',
      badge: 'Distintivo PRO'
    },
    {
      id: 'watermark',
      icon: 'lucide:sparkles',
      title: 'Descargas Directas Sin Marca de Agua',
      desc: 'Archivos en máxima calidad y ultra resolución listos para descargar.',
      badge: 'Calidad Ultra HD'
    },
    {
      id: 'priority',
      icon: 'lucide:zap',
      title: 'Acceso Prioritario y Posicionamiento',
      desc: 'Mayor visibilidad en el marketplace para tus eventos y vitrina de fotógrafo.',
      badge: 'Acceso VIP'
    },
    {
      id: 'cloud_storage',
      icon: 'lucide:cloud',
      title: 'Almacenamiento Permanente en la Nube',
      desc: 'Tus fotos y galerías siempre seguras y respaldadas de por vida.',
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
          try {
            const authStore = useAuthStore()
            authStore.updateUserData({ isPro: true })
          } catch (_) {}
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
    originalPrice,
    benefits,
    fetchActiveSubscription,
    prepareSubscription,
    startSubscriptionFlow
  }
})
