import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useAuthStore } from './auth'

export interface ActiveSubscription {
  active: boolean
  plan?: string
  freePhotosRemaining: number
  startDate?: string
  endDate: string
  daysRemaining?: number
  billingPeriod?: string
  monthlyPrice?: number
}

export const useSubscriptionStore = defineStore('subscription', () => {
  const { $api } = useNuxtApp()
  const authStore = useAuthStore()

  const activeSubscription = ref<ActiveSubscription>({
    active: false,
    plan: 'FREE',
    freePhotosRemaining: 0,
    startDate: '',
    endDate: '',
    daysRemaining: 0,
    billingPeriod: 'MENSUAL',
    monthlyPrice: 0
  })
  const loading = ref(false)
  const isSubscribing = ref(false)
  const error = ref('')

  const isActive = computed(() => activeSubscription.value.active)
  const currentPlan = computed(() => activeSubscription.value.plan || 'FREE')
  const freeRemaining = computed(() => activeSubscription.value.freePhotosRemaining)
  const daysRemaining = computed(() => activeSubscription.value.daysRemaining || 0)

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
      activeSubscription.value = { active: false, freePhotosRemaining: 0, startDate: '', endDate: '', daysRemaining: 0 }
      return
    }

    loading.value = true
    error.value = ''
    try {
      const data = await $api('/subscriptions/active')
      if (data) {
        activeSubscription.value = {
          active: !!data.active,
          plan: data.plan || (data.active ? 'BASIC' : 'FREE'),
          freePhotosRemaining: data.freePhotosRemaining ?? 0,
          startDate: data.startDate || '',
          endDate: data.endDate || '',
          daysRemaining: data.daysRemaining ?? 0,
          billingPeriod: data.billingPeriod || 'MENSUAL',
          monthlyPrice: data.monthlyPrice || 0
        }
      }
    } catch (e: any) {
      console.error('Error fetching active subscription:', e)
      activeSubscription.value = { active: false, plan: 'FREE', freePhotosRemaining: 0, startDate: '', endDate: '', daysRemaining: 0 }
    } finally {
      loading.value = false
    }
  }

  async function prepareSubscription(plan: string = 'BASIC') {
    if (!authStore.isAuthenticated) {
      throw new Error('Debes iniciar sesión para suscribirte.')
    }
    const data = await $api('/subscriptions/subscribe', {
      method: 'POST',
      body: { plan }
    })
    return data
  }

  async function activateTrial(plan: string = 'BASIC') {
    if (!authStore.isAuthenticated) {
      throw new Error('Debes iniciar sesión para activar el plan.')
    }
    loading.value = true
    try {
      const res = await $api('/subscriptions/activate-trial', {
        method: 'POST',
        body: { plan }
      })
      await fetchActiveSubscription()
      try {
        const authStore = useAuthStore()
        authStore.updateUserData({ isPro: true, photographerPlan: plan })
      } catch (_) {}
      return res
    } finally {
      loading.value = false
    }
  }

  async function startSubscriptionFlow(plan: string = 'BASIC', onSuccess?: () => void) {
    if (!authStore.isAuthenticated) {
      const router = useRouter()
      router.push('/login?redirect=/dashboard/photographer/subscription')
      return
    }

    isSubscribing.value = true
    try {
      const prep = await prepareSubscription(plan)

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
            authStore.updateUserData({ isPro: true, photographerPlan: plan })
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
    currentPlan,
    freeRemaining,
    daysRemaining,
    benefits,
    fetchActiveSubscription,
    prepareSubscription,
    activateTrial,
    startSubscriptionFlow
  }
})
