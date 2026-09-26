<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500/30 font-sans pb-24 relative overflow-hidden">
    <!-- Glowing background elements -->
    <div class="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
    <div class="fixed top-[30%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse" style="animation-delay: 2s;"></div>
    <div class="fixed bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none"></div>

    <div class="max-w-6xl mx-auto px-4 pt-12 sm:pt-16 sm:px-6 lg:px-8 relative z-10">
      
      <!-- Top Breadcrumb / Back Link -->
      <div class="flex items-center justify-between mb-6">
        <button @click="router.back()" class="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 backdrop-blur-md cursor-pointer">
          <Icon name="lucide:arrow-left" class="w-3.5 h-3.5" />
          Volver
        </button>

        <div v-if="subscriptionStore.isActive" class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold backdrop-blur-md">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
          Suscripción Activa
        </div>
      </div>

      <!-- Separation Notice: Link to Photographer PRO -->
      <div class="mb-10 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/10 to-amber-600/10 border border-amber-500/30 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div class="flex items-center gap-3.5 text-center sm:text-left">
          <div class="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center shrink-0">
            <Icon name="lucide:camera" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-xs sm:text-sm font-bold text-amber-300">¿Eres Fotógrafo Profesional o Creador?</p>
            <p class="text-xs text-slate-300">Si buscas crear álbumes privados protegidos, entregar sin marcas y gestionar clientes VIP, ve al plan exclusivo de fotógrafos.</p>
          </div>
        </div>
        <NuxtLink 
          to="/dashboard/photographer/subscription"
          class="shrink-0 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
        >
          <Icon name="lucide:crown" class="w-4 h-4 fill-slate-950 text-slate-950" />
          Moments PRO para Fotógrafos
          <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>

      <!-- Hero Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500/20 via-fuchsia-500/20 to-emerald-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-black tracking-widest uppercase mb-6 backdrop-blur-md shadow-2xl">
          <Icon name="lucide:sparkles" class="w-4 h-4 text-emerald-400 animate-pulse" />
          MOMENTS PRO PARA COMPRADORES & COLECCIONISTAS
        </div>

        <h1 class="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
          Más Recuerdos, Menor Precio con
          <span class="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-[#3ef4a1] mt-1">
            Moments PRO
          </span>
        </h1>

        <p class="text-lg sm:text-xl text-slate-400 font-light leading-relaxed">
          Diseñado para <strong class="text-white font-semibold">Atletas, Asistentes a Eventos y Coleccionistas</strong>. Recibe <strong class="text-[#3ef4a1] font-bold">+1 foto extra de regalo</strong> en cada paquete que compres, descargas directas en Ultra HD e insignia de Coleccionista PRO por solo <strong class="text-[#3ef4a1] font-bold">$5.000 COP al mes</strong>.
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
                <h2 class="text-xl font-black text-white">Tu Membresía Moments PRO de Comprador está Activa</h2>
                <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/30 text-emerald-300 text-[11px] font-extrabold border border-emerald-500/40">PRO VIGENTE</span>
              </div>
              <p class="text-sm text-slate-300 mt-1">
                Disfrutas de <strong class="text-emerald-400 font-bold">+1 Foto Extra</strong> en cada paquete de fotos que compres, descargas en Ultra HD e insignia oficial.
              </p>
              <p v-if="subscriptionStore.activeSubscription.endDate" class="text-xs text-slate-400 mt-0.5">
                Válido hasta: <span class="text-slate-200 font-medium">{{ formatDate(subscriptionStore.activeSubscription.endDate) }}</span>
              </p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              @click="router.push('/marketplace')"
              class="w-full sm:w-auto px-6 py-3 bg-[#3ef4a1] hover:bg-[#32c984] text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Icon name="lucide:compass" class="w-4 h-4" />
              Explorar Fotos y Eventos
            </button>
            <button
              @click="handleSubscribe"
              :disabled="subscriptionStore.isSubscribing"
              class="w-full sm:w-auto px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl text-sm transition-all border border-white/10 cursor-pointer"
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
                PLAN COMPRADOR PRO
              </span>
              <span class="text-xs text-indigo-300 font-semibold bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30">
                Sin permanencia
              </span>
            </div>

            <h2 class="text-3xl font-black text-white mb-2">Moments Pass Comprador</h2>
            <p class="text-sm text-slate-300 mb-6">El pase definitivo para atletas, asistentes a eventos y amantes de la fotografía.</p>

            <!-- Price -->
            <div class="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md mb-8">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm text-slate-400 font-bold">Antes</span>
                <span class="text-sm text-rose-400 font-bold line-through">$15.000 COP</span>
                <span class="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase border border-emerald-500/30">66% OFF</span>
              </div>
              <div class="flex items-baseline gap-2">
                <span class="text-5xl font-black text-white tracking-tight">$5.000</span>
                <span class="text-slate-400 font-bold text-sm">COP / mes</span>
              </div>
              <p class="text-xs text-emerald-400 font-bold mt-2 flex items-center gap-1.5">
                <Icon name="lucide:check-circle-2" class="w-4 h-4 text-emerald-400" />
                Precio especial económico • Ahorras en cada foto que compras
              </p>
            </div>

            <!-- Key Points -->
            <div class="space-y-3.5 mb-8">
              <div v-for="b in buyerHighlights" :key="b" class="flex items-start gap-3 text-sm text-slate-200">
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
              <span>{{ subscriptionStore.isSubscribing ? 'Iniciando Pago...' : 'Activar Moments PRO por $5.000 COP' }}</span>
            </button>

            <div class="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-2">
              <span class="flex items-center gap-1">
                <Icon name="lucide:shield-check" class="w-3.5 h-3.5 text-emerald-400" />
                Pago Seguro con Wompi
              </span>
              <span>•</span>
              <span class="flex items-center gap-1">
                <Icon name="lucide:credit-card" class="w-3.5 h-3.5 text-indigo-400" />
                Nequi / Daviplata / PSE / Tarjetas
              </span>
            </div>
          </div>
        </div>

        <!-- Benefits Showcase Grid (7 Cols) -->
        <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="benefit in buyerBenefits"
            :key="benefit.title"
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

      <!-- Plan Comparison Table for Buyers -->
      <div class="mb-24 rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-10 backdrop-blur-xl">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <h2 class="text-2xl sm:text-3xl font-black text-white">Compara: Comprador Gratuito vs Comprador PRO</h2>
          <p class="text-sm text-slate-400 mt-2">Beneficios pensados para ahorrar dinero y coleccionar las mejores capturas</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-white/10 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th class="pb-4 pl-4">Beneficio / Característica</th>
                <th class="pb-4 text-center">Cuenta Gratuita</th>
                <th class="pb-4 text-center text-[#3ef4a1] font-black">Moments PRO ($5.000/mes)</th>
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

      <!-- FAQ Section for Buyers -->
      <div class="max-w-3xl mx-auto mb-20">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-black text-white">Preguntas Frecuentes para Compradores</h2>
          <p class="text-sm text-slate-400 mt-2">Todo lo que necesitas saber sobre el pase Moments PRO para compradores</p>
        </div>

        <div class="space-y-4">
          <div
            v-for="(faq, idx) in faqs"
            :key="idx"
            class="rounded-2xl bg-white/5 border border-white/10 overflow-hidden transition-all duration-300"
          >
            <button
              @click="toggleFaq(idx)"
              class="w-full p-5 text-left font-bold text-white flex items-center justify-between gap-4 hover:bg-white/5 transition-colors cursor-pointer"
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
        <h2 class="text-3xl font-black text-white mb-4">¿Listo para recibir fotos de regalo en cada paquete?</h2>
        <p class="text-slate-300 text-sm max-w-xl mx-auto mb-8">
          Únete a cientos de atletas y asistentes que ya disfrutan de +1 foto extra en cada paquete y descargas directas en máxima resolución.
        </p>
        <button
          @click="handleSubscribe"
          :disabled="subscriptionStore.isSubscribing"
          class="px-8 py-4 bg-[#3ef4a1] hover:bg-[#32c984] text-slate-950 font-black rounded-full text-base transition-all shadow-[0_0_30px_rgba(62,244,161,0.4)] hover:shadow-[0_0_45px_rgba(62,244,161,0.6)] transform hover:-translate-y-0.5 active:translate-y-0 inline-flex items-center gap-2 cursor-pointer"
        >
          <Icon name="lucide:crown" class="w-5 h-5 text-slate-950" />
          Suscribirme a Moments PRO por $5.000 COP
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
  title: 'Moments PRO para Compradores - Fotos de Regalo y Calidad Ultra HD',
  meta: [
    { name: 'description', content: 'Suscríbete a Moments PRO por solo $5.000 COP al mes. Obtén +1 foto de regalo en cada paquete, descargas directas sin marcas de agua e insignia oficial de Coleccionista PRO.' }
  ]
})

const openFaq = ref(0)
function toggleFaq(idx) {
  openFaq.value = openFaq.value === idx ? -1 : idx
}

const buyerHighlights = [
  '+1 Foto Extra de Regalo en cada paquete de fotos que compres',
  'Descargas directas en máxima resolución Ultra HD sin marcas de agua',
  'Insignia Dorada oficial de Coleccionista PRO en tu perfil',
  'Ahorras dinero desde tu primera compra en la galería',
  'Respaldo permanente en la nube Cloudflare R2 sin caducidad',
  'Soporte prioritario VIP para compras y descargas'
]

const buyerBenefits = [
  {
    icon: 'lucide:gift',
    badge: '+1 FOTO GRATIS',
    title: '+1 Foto Extra en Cada Paquete',
    desc: 'Cada vez que compres un paquete de fotos de cualquier fotógrafo o evento, obtendrás 1 foto adicional totalmente gratis.'
  },
  {
    icon: 'lucide:sparkles',
    badge: 'CALIDAD ULTRA HD',
    title: 'Descargas en Máxima Calidad',
    desc: 'Descarga tus fotos en la resolución original tomada por el fotógrafo, sin marcas de agua ni compresión.'
  },
  {
    icon: 'lucide:crown',
    badge: 'DISTINTIVO PRO',
    title: 'Insignia de Coleccionista PRO',
    desc: 'Luce tu insignia oficial Moments PRO dorada en tu perfil y cada interacción dentro de la plataforma.'
  },
  {
    icon: 'lucide:cloud',
    badge: 'NUBE PERMANENTE',
    title: 'Tus Recuerdos Protegidos de por Vida',
    desc: 'Accede y vuelve a descargar tus fotos compradas las veces que quieras desde tu panel sin fecha límite.'
  },
  {
    icon: 'lucide:coins',
    badge: 'MÁXIMO AHORRO',
    title: 'Retorno de Inversión Inmediato',
    desc: 'Con solo una foto de regalo que recibas, la membresía de $5.000 COP ya se amortiza por completo.'
  },
  {
    icon: 'lucide:headphones',
    badge: 'SOPORTE 24/7',
    title: 'Atención Prioritaria',
    desc: 'Atención VIP para resolver cualquier duda sobre tus descargas, fotos y pagos en minutos.'
  }
]

const comparisonRows = [
  { feature: 'Fotos de regalo en paquetes', free: '0 fotos extra', pro: '+1 foto gratis por cada paquete' },
  { feature: 'Descargas sin marca de agua', free: 'Solo fotos compradas', pro: 'Inmediatas en Ultra HD' },
  { feature: 'Insignia oficial en el perfil', free: false, pro: 'Insignia Dorada Coleccionista PRO' },
  { feature: 'Almacenamiento de fotos en la nube', free: true, pro: true },
  { feature: 'Acceso a eventos del marketplace', free: true, pro: true },
  { feature: 'Soporte al cliente', free: 'Estándar', pro: 'Prioritario VIP 24/7' }
]

const faqs = [
  {
    q: '¿Cómo funciona el beneficio de +1 Foto Extra en cada paquete?',
    a: 'Al tener tu suscripción Moments PRO activa, cada vez que selecciones un paquete de fotos en cualquier evento (por ejemplo un paquete de 3, 5 o 10 fotos), el sistema te permitirá elegir automáticamente una foto adicional sin pagar un solo peso de más.'
  },
  {
    q: '¿Cuánto cuesta la suscripción de comprador y qué métodos de pago aceptan?',
    a: 'Tiene un precio sumamente económico de solo $5.000 COP al mes (con un 66% de descuento de lanzamiento). Aceptamos Nequi, Daviplata, PSE y cualquier tarjeta de crédito o débito a través de la pasarela segura Wompi (Bancolombia).'
  },
  {
    q: '¿Soy fotógrafo, esta es mi página de suscripción?',
    a: 'No, los fotógrafos tienen su propia membresía dedicada con Álbumes Privados y entrega VIP sin marcas. Puedes ir a Moments PRO para Fotógrafos en /dashboard/photographer/subscription.'
  },
  {
    q: '¿Las fotos que descargue seguirán disponibles si cancelo?',
    a: '¡Sí, absolutamente! Todas las fotos compradas durante tu membresía PRO se mantienen guardadas de por vida en tu biblioteca de Moments sin fecha de caducidad.'
  },
  {
    q: '¿Puedo cancelar mi suscripción cuando lo desee?',
    a: 'Sí, puedes cancelar tu plan en cualquier momento sin contratos de permanencia ni penalizaciones.'
  }
]

import { formatColombiaDate } from '~/utils/date'

function formatDate(dateStr) {
  return formatColombiaDate(dateStr, { year: 'numeric', month: 'long', day: 'numeric' })
}

async function handleSubscribe() {
  if (!authStore.isAuthenticated) {
    toast.info('Inicia sesión', 'Debes iniciar sesión para suscribirte a Moments PRO.')
    router.push('/login?redirect=/subscription')
    return
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
