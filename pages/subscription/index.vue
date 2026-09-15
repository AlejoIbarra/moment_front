<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 font-sans pb-24 relative overflow-hidden">
    <!-- Glowing background elements -->
    <div class="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
    <div class="fixed top-[30%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse" style="animation-delay: 2s;"></div>
    <div class="fixed bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none"></div>

    <div class="max-w-6xl mx-auto px-4 pt-12 sm:pt-16 sm:px-6 lg:px-8 relative z-10">
      
      <!-- Top Breadcrumb / Back Link -->
      <div class="flex items-center justify-between mb-8">
        <button @click="router.back()" class="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
          <Icon name="lucide:arrow-left" class="w-3.5 h-3.5" />
          Volver
        </button>

        <div v-if="subscriptionStore.isActive" class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold backdrop-blur-md">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          Suscripción Activa
        </div>
      </div>

      <!-- Hero Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/20 to-pink-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-black tracking-widest uppercase mb-6 backdrop-blur-md shadow-2xl">
          <Icon name="lucide:sparkles" class="w-4 h-4 text-fuchsia-400 animate-pulse" />
          MOMENTS PRO MEMBERSHIP
        </div>

        <h1 class="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
          Tus Mejores Recuerdos con
          <span class="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-[#3ef4a1] mt-1">
            Calidad Profesional Ilimitada
          </span>
        </h1>

        <p class="text-lg sm:text-xl text-slate-400 font-light leading-relaxed">
          Disfruta de <strong class="text-white font-semibold">10 fotos en alta resolución mensuales</strong>, descargas directas sin marcas de agua, acceso prioritario y beneficios exclusivos por solo una cuota mensual.
        </p>
      </div>

      <!-- Active Subscription Dashboard Banner (if user already active) -->
      <div v-if="subscriptionStore.isActive" class="mb-16 bg-gradient-to-r from-emerald-950/60 via-slate-900/80 to-indigo-950/60 border border-emerald-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-emerald-950/40">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-lg">
              <Icon name="lucide:crown" class="w-8 h-8" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-black text-white">Tu Plan Moments PRO está Activo</h2>
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[11px] font-extrabold border border-emerald-500/40">PRO VIGENTE</span>
              </div>
              <p class="text-sm text-slate-300 mt-1">
                Te quedan <strong class="text-emerald-400 font-black text-base">{{ subscriptionStore.freeRemaining }}</strong> fotos gratis para descargar este periodo.
              </p>
              <p v-if="subscriptionStore.activeSubscription.endDate" class="text-xs text-slate-400 mt-0.5">
                Válido hasta: <span class="text-slate-200 font-medium">{{ formatDate(subscriptionStore.activeSubscription.endDate) }}</span>
              </p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              @click="router.push('/marketplace')"
              class="w-full sm:w-auto px-6 py-3 bg-[#3ef4a1] hover:bg-[#32c984] text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
            >
              <Icon name="lucide:compass" class="w-4 h-4" />
              Explorar y Canjear Fotos
            </button>
            <button
              @click="handleSubscribe"
              :disabled="subscriptionStore.isSubscribing"
              class="w-full sm:w-auto px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-all border border-white/10"
            >
              Extender / Renovar
            </button>
          </div>
        </div>
      </div>

      <!-- Main Pricing Card & Feature Highlight Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-20">
        
        <!-- Pricing Card (Featured) -->
        <div class="lg:col-span-5 relative rounded-3xl p-8 sm:p-10 bg-gradient-to-b from-indigo-900/40 via-slate-900/90 to-slate-950 border-2 border-indigo-500/50 shadow-[0_0_50px_rgba(99,102,241,0.25)] backdrop-blur-2xl flex flex-col justify-between overflow-hidden">
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-indigo-500/30 rounded-full blur-3xl pointer-events-none"></div>
          
          <div>
            <!-- Badge -->
            <div class="flex items-center justify-between mb-6">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white shadow-md">
                <Icon name="lucide:flame" class="w-3.5 h-3.5" />
                MÁS POPULAR
              </span>
              <span class="text-xs text-indigo-300 font-semibold bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
                Cancelable en cualquier momento
              </span>
            </div>

            <h2 class="text-3xl font-black text-white mb-2">Moments PRO Pass</h2>
            <p class="text-sm text-slate-300 mb-6">El pase definitivo para atletas, asistentes a eventos y amantes de la fotografía.</p>

            <!-- Price -->
            <div class="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md mb-8">
              <div class="flex items-baseline gap-2">
                <span class="text-5xl font-black text-white tracking-tight">$30.000</span>
                <span class="text-slate-400 font-bold text-sm">COP / mes</span>
              </div>
              <p class="text-xs text-emerald-400 font-bold mt-2 flex items-center gap-1.5">
                <Icon name="lucide:check-circle-2" class="w-4 h-4 text-emerald-400" />
                Solo $3.000 COP por foto (Ahorras más del 70%)
              </p>
            </div>

            <!-- Key Points -->
            <div class="space-y-3.5 mb-8">
              <div v-for="b in topHighlights" :key="b" class="flex items-start gap-3 text-sm text-slate-200">
                <div class="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-emerald-500/30">
                  <Icon name="lucide:check" class="w-3.5 h-3.5 font-black" />
                </div>
                <span>{{ b }}</span>
              </div>
            </div>
          </div>

          <!-- Checkout CTA -->
          <div class="space-y-3">
            <button
              @click="handleSubscribe"
              :disabled="subscriptionStore.isSubscribing"
              class="w-full py-4 px-6 rounded-2xl font-black text-base text-slate-950 bg-gradient-to-r from-[#3ef4a1] via-emerald-400 to-indigo-300 hover:from-emerald-300 hover:to-indigo-200 shadow-[0_0_30px_rgba(62,244,161,0.35)] hover:shadow-[0_0_45px_rgba(62,244,161,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Icon v-if="subscriptionStore.isSubscribing" name="lucide:loader-2" class="w-5 h-5 animate-spin text-slate-950" />
              <Icon v-else name="lucide:sparkles" class="w-5 h-5 text-slate-950" />
              <span>{{ subscriptionStore.isSubscribing ? 'Iniciando Pago...' : 'Suscribirme por $30.000 COP' }}</span>
            </button>

            <div class="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-2">
              <span class="flex items-center gap-1">
                <Icon name="lucide:shield-check" class="w-3.5 h-3.5 text-emerald-400" />
                Pago 100% Seguro
              </span>
              <span>•</span>
              <span class="flex items-center gap-1">
                <Icon name="lucide:credit-card" class="w-3.5 h-3.5 text-indigo-400" />
                Wompi / PSE / Nequi / Tarjetas
              </span>
            </div>
          </div>
        </div>

        <!-- Benefits Showcase Grid (7 Cols) -->
        <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="benefit in subscriptionStore.benefits"
            :key="benefit.id"
            class="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/40 hover:bg-white/10 transition-all duration-300 backdrop-blur-md flex flex-col justify-between group"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 border border-white/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 group-hover:text-fuchsia-300 transition-transform">
                  <Icon :name="benefit.icon" class="w-6 h-6" />
                </div>
                <span class="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-300">
                  {{ benefit.badge }}
                </span>
              </div>

              <h3 class="text-base font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors">
                {{ benefit.title }}
              </h3>
              <p class="text-xs text-slate-400 leading-relaxed">
                {{ benefit.desc }}
              </p>
            </div>
          </div>
        </div>

      </div>

      <!-- Plan Comparison Table -->
      <div class="mb-24 rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-10 backdrop-blur-xl">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <h2 class="text-2xl sm:text-3xl font-black text-white">Compara: Cuenta Gratuita vs Moments PRO</h2>
          <p class="text-sm text-slate-400 mt-2">Todo lo que ganas al activar tu membresía mensual</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-white/10 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th class="pb-4 pl-4">Beneficio / Característica</th>
                <th class="pb-4 text-center">Plan Gratuito</th>
                <th class="pb-4 text-center text-[#3ef4a1] font-black">Moments PRO ($30.000/mes)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5">
              <tr v-for="row in comparisonRows" :key="row.feature" class="hover:bg-white/5 transition-colors">
                <td class="py-4 pl-4 font-semibold text-slate-200">{{ row.feature }}</td>
                <td class="py-4 text-center text-slate-400">
                  <span v-if="typeof row.free === 'boolean'">
                    <Icon v-if="row.free" name="lucide:check" class="w-5 h-5 text-emerald-400 mx-auto" />
                    <Icon v-else name="lucide:x" class="w-5 h-5 text-slate-600 mx-auto" />
                  </span>
                  <span v-else>{{ row.free }}</span>
                </td>
                <td class="py-4 text-center font-bold text-white">
                  <span v-if="typeof row.pro === 'boolean'">
                    <Icon v-if="row.pro" name="lucide:check-circle-2" class="w-5 h-5 text-[#3ef4a1] mx-auto" />
                    <Icon v-else name="lucide:x" class="w-5 h-5 text-rose-500 mx-auto" />
                  </span>
                  <span v-else class="text-[#3ef4a1]">{{ row.pro }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="max-w-3xl mx-auto mb-20">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-black text-white">Preguntas Frecuentes</h2>
          <p class="text-sm text-slate-400 mt-2">Todo lo que necesitas saber sobre la suscripción Moments PRO</p>
        </div>

        <div class="space-y-4">
          <div
            v-for="(faq, idx) in faqs"
            :key="idx"
            class="rounded-2xl bg-white/5 border border-white/10 overflow-hidden transition-all duration-300"
          >
            <button
              @click="toggleFaq(idx)"
              class="w-full p-5 text-left font-bold text-white flex items-center justify-between gap-4 hover:bg-white/5 transition-colors"
            >
              <span>{{ faq.q }}</span>
              <Icon :name="openFaq === idx ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="w-5 h-5 text-indigo-400 flex-shrink-0" />
            </button>
            <div v-if="openFaq === idx" class="px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
              {{ faq.a }}
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom Sticky/CTA Banner -->
      <div class="text-center p-10 rounded-3xl bg-gradient-to-r from-indigo-900/60 via-fuchsia-900/40 to-slate-900/90 border border-indigo-500/30 backdrop-blur-xl shadow-2xl">
        <h2 class="text-3xl font-black text-white mb-4">¿Listo para vivir la experiencia PRO?</h2>
        <p class="text-slate-300 text-sm max-w-xl mx-auto mb-8">
          Únete a cientos de apasionados que ya disfrutan de 10 fotos HD mensuales y descargas directas en máxima calidad.
        </p>
        <button
          @click="handleSubscribe"
          :disabled="subscriptionStore.isSubscribing"
          class="px-8 py-4 bg-[#3ef4a1] hover:bg-[#32c984] text-slate-950 font-black rounded-full text-base transition-all shadow-[0_0_30px_rgba(62,244,161,0.4)] hover:shadow-[0_0_45px_rgba(62,244,161,0.6)] transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-2"
        >
          <Icon name="lucide:crown" class="w-5 h-5 text-slate-950" />
          Suscribirme a Moments PRO por $30.000 COP
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useSubscriptionStore } from '~/stores/subscription'

const router = useRouter()
const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()
const toast = useToast()

useHead({
  title: 'Suscripción Moments PRO - 10 Fotos Mensuales y Calidad Ultra HD',
  meta: [
    { name: 'description', content: 'Suscríbete a Moments PRO por solo $30.000 COP al mes. Obtén 10 fotos en alta resolución mensuales, descargas directas sin marcas de agua y descuentos exclusivos.' }
  ],
  script: [
    { src: 'https://checkout.wompi.co/widget.js' }
  ]
})

const openFaq = ref(0)
function toggleFaq(idx) {
  openFaq.value = openFaq.value === idx ? -1 : idx
}

const topHighlights = [
  '10 Fotos en Alta Calidad (Originales) mensuales incluidas',
  'Descarga inmediata sin marcas de agua',
  'Acceso prioritario a nuevos álbumes de eventos',
  '15% de descuento en todos los paquetes adicionales',
  'Insignia oficial Moments PRO en tu cuenta',
  'Respaldo de por vida en la nube R2'
]

const comparisonRows = [
  { feature: 'Fotos originales en HD mensuales', free: '0 fotos (pago por foto)', pro: '10 fotos incluidas cada mes' },
  { feature: 'Precio promedio por foto', free: 'Desde $10.000 COP', pro: '$3.000 COP (con tu plan)' },
  { feature: 'Descargas sin marca de agua', free: 'Solo fotos compradas', pro: 'Inmediato con tus fotos PRO' },
  { feature: 'Acceso prioritario a galerías', free: false, pro: true },
  { feature: 'Descuentos en paquetes de eventos', free: false, pro: '15% de descuento extra' },
  { feature: 'Insignia PRO en Perfil', free: false, pro: true },
  { feature: 'Almacenamiento de por vida', free: true, pro: true },
  { feature: 'Soporte prioritario', free: false, pro: true }
]

const faqs = [
  {
    q: '¿Cómo uso mis 10 fotos gratis de la suscripción?',
    a: 'Al momento de comprar cualquier foto individual en cualquier evento del Marketplace, selecciona la casilla "Usar foto gratis de mi suscripción" en la ventana de confirmación de pago. ¡El costo de la foto será $0 COP y se descargará de inmediato en máxima resolución!'
  },
  {
    q: '¿Qué métodos de pago puedo usar para pagar mi suscripción?',
    a: 'Aceptamos todos los métodos de pago disponibles en Colombia a través de Wompi: Nequi, Daviplata, Tarjetas Débito y Crédito (Visa, Mastercard, American Express) y transferencias PSE bancarias.'
  },
  {
    q: '¿Las fotos que descargue durante mi suscripción seguirán disponibles si cancelo?',
    a: '¡Sí, absolutamente! Todas las fotos que descargues o adquieras durante tu membresía PRO se guardan permanentemente en tu perfil y biblioteca en la nube para siempre, sin fecha de caducidad.'
  },
  {
    q: '¿Qué pasa si no gasto las 10 fotos en el mes?',
    a: 'Cada mes tu cuota de 10 fotos se renueva con el ciclo de facturación mensual para que disfrutes de las mejores fotos de tus eventos favoritos.'
  },
  {
    q: '¿Puedo cancelar mi suscripción cuando lo desee?',
    a: 'Sí, puedes gestionar tu plan en cualquier momento sin contratos de permanencia ni penalizaciones.'
  }
]

function formatDate(dateStr) {
  if (!dateStr) return ''
  try {
    const d = new Date(dateStr)
    return d.toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' })
  } catch (e) {
    return dateStr
  }
}

async function handleSubscribe() {
  if (!authStore.isAuthenticated) {
    toast.info('Inicia sesión', 'Debes iniciar sesión para suscribirte a Moments PRO.')
    router.push('/login?redirect=/subscription')
    return
  }

  if (authStore.isPhotographer) {
    toast.warning('Cuenta de Fotógrafo', 'Las suscripciones Moments PRO para compradores son para cuentas de usuario/cliente.')
  }

  try {
    await subscriptionStore.startSubscriptionFlow(() => {
      toast.success('¡Felicitaciones!', '¡Tu suscripción a Moments PRO ha sido activada con éxito!')
    })
  } catch (e) {
    toast.error('Error', e.message || 'No se pudo iniciar el proceso de suscripción.')
  }
}

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await subscriptionStore.fetchActiveSubscription()
  }
})
</script>
