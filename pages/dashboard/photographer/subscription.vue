<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 selection:bg-amber-500/30 font-sans pb-24 relative overflow-hidden">
    <!-- Glowing background elements with gold & indigo accents for photographers -->
    <div class="fixed top-[-10%] left-[-10%] w-[550px] h-[550px] bg-amber-500/15 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>
    <div class="fixed top-[30%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none animate-pulse" style="animation-delay: 2s;"></div>
    <div class="fixed bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[150px] pointer-events-none"></div>

    <div class="max-w-6xl mx-auto px-4 pt-10 sm:pt-14 sm:px-6 lg:px-8 relative z-10">
      
      <!-- Top Breadcrumb / Navigation -->
      <div class="flex items-center justify-between mb-8">
        <button 
          @click="router.push('/dashboard/photographer?tab=events')" 
          class="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md cursor-pointer hover:bg-white/10"
        >
          <Icon name="lucide:arrow-left" class="w-3.5 h-3.5" />
          Volver a Mi Panel de Fotógrafo
        </button>

        <div v-if="subscriptionStore.isActive" class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold backdrop-blur-md shadow-sm">
          <Icon name="lucide:crown" class="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span>Membresía Fotógrafo PRO Activa</span>
        </div>
      </div>

      <!-- Separation Notice: Link to Buyer PRO -->
      <div class="mb-10 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-indigo-500/10 via-fuchsia-500/10 to-indigo-600/10 border border-indigo-500/30 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        <div class="flex items-center gap-3.5 text-center sm:text-left">
          <div class="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center shrink-0">
            <Icon name="lucide:user" class="w-5 h-5" />
          </div>
          <div>
            <p class="text-xs sm:text-sm font-bold text-indigo-300">¿Eres Comprador o Coleccionista de Fotos?</p>
            <p class="text-xs text-slate-300">Si buscas recibir +1 foto gratis en cada paquete y descargas Ultra HD para ti, ve al plan exclusivo para compradores.</p>
          </div>
        </div>
        <NuxtLink 
          to="/subscription"
          class="shrink-0 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-fuchsia-600 hover:from-indigo-400 hover:to-fuchsia-500 text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95"
        >
          <Icon name="lucide:sparkles" class="w-4 h-4 text-emerald-300" />
          Moments PRO para Compradores
          <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" />
        </NuxtLink>
      </div>

      <!-- Hero Header -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-yellow-500/20 to-orange-500/20 border border-amber-500/40 text-amber-300 text-xs font-black tracking-widest uppercase mb-6 backdrop-blur-md shadow-2xl">
          <Icon name="lucide:crown" class="w-4 h-4 text-amber-400 fill-amber-400" />
          MOMENTS PRO PARA FOTÓGRAFOS
        </div>

        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15] mb-6">
          Lleva tus Eventos al Siguiente Nivel con
          <span class="block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 mt-1">
            Álbumes Privados y Entrega VIP
          </span>
        </h1>

        <p class="text-base sm:text-lg text-slate-300 font-light leading-relaxed">
          Diseñado exclusivamente para <strong class="text-white font-semibold">Fotógrafos Profesionales</strong>. Publica galerías privadas protegidas por enlace y correos autorizados, habilita descargas directas sin marcas y luce la insignia dorada oficial por solo <strong class="text-amber-400 font-bold">$5.000 COP al mes</strong>.
        </p>
      </div>

      <!-- Active Subscription Banner (if already active) -->
      <div v-if="subscriptionStore.isActive" class="mb-16 bg-gradient-to-r from-amber-950/60 via-slate-900/80 to-yellow-950/60 border border-amber-500/40 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-amber-950/40">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="w-16 h-16 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 flex-shrink-0 shadow-lg">
              <Icon name="lucide:crown" class="w-8 h-8 fill-amber-400" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h2 class="text-xl font-black text-white">Tu Membresía Moments PRO de Fotógrafo está Activa</h2>
                <span class="px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 text-[11px] font-extrabold border border-amber-500/40">PRO ACTIVO</span>
              </div>
              <p class="text-sm text-slate-300 mt-1">
                Puedes crear y publicar <strong class="text-amber-300 font-bold">Álbumes Privados ilimitados</strong> con entrega personalizada para tus clientes.
              </p>
              <p v-if="subscriptionStore.activeSubscription.endDate" class="text-xs text-slate-400 mt-0.5">
                Válido hasta: <span class="text-slate-200 font-medium">{{ formatDate(subscriptionStore.activeSubscription.endDate) }}</span>
              </p>
            </div>
          </div>

          <div class="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <button
              @click="router.push('/dashboard/photographer?tab=events')"
              class="w-full sm:w-auto px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm transition-all shadow-lg hover:shadow-amber-500/20 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Icon name="lucide:calendar-plus" class="w-4 h-4 text-slate-950" />
              Crear Álbum Privado
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
        <div class="lg:col-span-5 relative rounded-3xl p-8 sm:p-10 bg-gradient-to-b from-amber-950/40 via-slate-900/90 to-slate-950 border-2 border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.2)] backdrop-blur-2xl flex flex-col justify-between overflow-hidden">
          <div class="absolute -top-24 -right-24 w-48 h-48 bg-amber-500/30 rounded-full blur-3xl pointer-events-none"></div>
          
          <div>
            <!-- Badge -->
            <div class="flex items-center justify-between mb-6">
              <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md">
                <Icon name="lucide:sparkles" class="w-3.5 h-3.5" />
                PLAN FOTÓGRAFO PRO
              </span>
              <span class="text-xs text-amber-300 font-semibold bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30">
                Sin permanencia
              </span>
            </div>

            <h2 class="text-3xl font-black text-white mb-2">Moments Fotógrafo PRO</h2>
            <p class="text-sm text-slate-300 mb-6">Todo lo que necesitas para gestionar clientes privados, sesiones y eventos VIP.</p>

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
              <p class="text-xs text-amber-400 font-bold mt-2 flex items-center gap-1.5">
                <Icon name="lucide:check-circle-2" class="w-4 h-4 text-amber-400" />
                Precio especial económico • Cancela cuando quieras
              </p>
            </div>

            <!-- Key Points -->
            <div class="space-y-3.5 mb-8">
              <div v-for="b in photographerHighlights" :key="b" class="flex items-start gap-3 text-sm text-slate-200">
                <div class="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5 border border-amber-500/30">
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
              class="w-full py-4 px-6 rounded-2xl font-black text-base text-slate-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 shadow-[0_0_30px_rgba(245,158,11,0.35)] hover:shadow-[0_0_45px_rgba(245,158,11,0.5)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Icon v-if="subscriptionStore.isSubscribing" name="lucide:loader-2" class="w-5 h-5 animate-spin text-slate-950" />
              <Icon v-else name="lucide:crown" class="w-5 h-5 text-slate-950 fill-slate-950" />
              <span>{{ subscriptionStore.isSubscribing ? 'Iniciando Pago...' : 'Activar Fotógrafo PRO por $5.000 COP' }}</span>
            </button>

            <div class="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-2">
              <span class="flex items-center gap-1">
                <Icon name="lucide:shield-check" class="w-3.5 h-3.5 text-emerald-400" />
                Pago Seguro con Wompi (Bancolombia)
              </span>
              <span class="flex items-center gap-1">
                <Icon name="lucide:credit-card" class="w-3.5 h-3.5 text-amber-400" />
                Nequi / Daviplata / PSE / Tarjetas
              </span>
            </div>
          </div>
        </div>

        <!-- Benefits Showcase Grid (7 Cols) -->
        <div class="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            v-for="benefit in photographerBenefits"
            :key="benefit.title"
            class="p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-amber-500/40 hover:bg-white/10 transition-all duration-300 backdrop-blur-md flex flex-col justify-between group"
          >
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-white/10 flex items-center justify-center text-amber-400 group-hover:scale-110 group-hover:text-yellow-300 transition-transform">
                  <Icon :name="benefit.icon" class="w-6 h-6" />
                </div>
                <span class="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-amber-300">
                  {{ benefit.badge }}
                </span>
              </div>

              <h3 class="text-base font-bold text-white mb-2 group-hover:text-amber-200 transition-colors">
                {{ benefit.title }}
              </h3>
              <p class="text-xs text-slate-400 leading-relaxed">
                {{ benefit.desc }}
              </p>
            </div>
          </div>
        </div>

      </div>

      <!-- Plan Comparison Table for Photographers -->
      <div class="mb-24 rounded-3xl bg-white/5 border border-white/10 p-6 sm:p-10 backdrop-blur-xl">
        <div class="text-center max-w-2xl mx-auto mb-10">
          <h2 class="text-2xl sm:text-3xl font-black text-white">Compara: Fotógrafo Estándar vs Fotógrafo PRO</h2>
          <p class="text-sm text-slate-400 mt-2">Herramientas profesionales diseñadas para aumentar tus ingresos y fidelizar clientes</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="border-b border-white/10 text-slate-400 text-xs font-bold uppercase tracking-wider">
                <th class="pb-4 pl-4">Funcionalidad</th>
                <th class="pb-4 text-center">Fotógrafo Estándar</th>
                <th class="pb-4 text-center text-amber-400 font-black">Moments PRO ($5.000/mes)</th>
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
                    <Icon v-if="row.pro" name="lucide:check-circle-2" class="w-5 h-5 text-amber-400 mx-auto" />
                    <Icon v-else name="lucide:x" class="w-5 h-5 text-rose-500 mx-auto" />
                  </span>
                  <span v-else class="text-amber-400">{{ row.pro }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- FAQ Section -->
      <div class="max-w-3xl mx-auto mb-20">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-black text-white">Preguntas Frecuentes de Fotógrafos</h2>
          <p class="text-sm text-slate-400 mt-2">Todo lo que necesitas saber sobre las funciones PRO para tus eventos</p>
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
              <Icon :name="openFaq === idx ? 'lucide:chevron-up' : 'lucide:chevron-down'" class="w-5 h-5 text-amber-400 flex-shrink-0" />
            </button>
            <div v-if="openFaq === idx" class="px-5 pb-5 text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-3">
              {{ faq.a }}
            </div>
          </div>
        </div>
      </div>

      <!-- Bottom CTA Banner -->
      <div class="rounded-3xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-orange-500/20 border border-amber-500/30 p-8 sm:p-12 text-center backdrop-blur-xl relative overflow-hidden">
        <div class="max-w-2xl mx-auto space-y-4">
          <div class="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/30">
            <Icon name="lucide:crown" class="w-6 h-6 fill-amber-400" />
          </div>
          <h3 class="text-2xl sm:text-3xl font-black text-white">¿Listo para publicar tus Álbumes Privados?</h3>
          <p class="text-sm text-slate-300">
            Activa Moments PRO por solo $5.000 COP al mes y empieza a entregar tus fotos a clientes autorizados de inmediato.
          </p>
          <div class="pt-2">
            <button
              @click="handleSubscribe"
              :disabled="subscriptionStore.isSubscribing"
              class="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black rounded-2xl shadow-xl hover:shadow-amber-500/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              <Icon name="lucide:sparkles" class="w-5 h-5 text-slate-950" />
              <span>Suscribirme por $5.000 COP / mes</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useSubscriptionStore } from '~/stores/subscription'
import { useToast } from '~/composables/useToast'
import { formatColombiaDate } from '~/utils/date'

const router = useRouter()
const authStore = useAuthStore()
const subscriptionStore = useSubscriptionStore()
const toast = useToast()

useHead({
  title: 'Moments PRO para Fotógrafos - Álbumes Privados y Entrega VIP',
  meta: [
    { name: 'description', content: 'Activa Moments PRO para fotógrafos por solo $5.000 COP al mes. Desbloquea álbumes privados, entrega personalizada por correo, insignia dorada y descargas libres sin marcas de agua.' }
  ]
})

const openFaq = ref(0)
function toggleFaq(idx: number) {
  openFaq.value = openFaq.value === idx ? -1 : idx
}

function formatDate(dateStr: string) {
  return formatColombiaDate(dateStr, { year: 'numeric', month: 'long', day: 'numeric' })
}

const photographerHighlights = [
  'Creación de álbumes privados protegidos por enlace',
  'Restricción de acceso exclusivo a correos de clientes autorizados',
  'Modo de entrega libre (gratis sin marca) o venta privada',
  'Insignia dorada oficial Moments PRO en tu vitrina y perfil',
  'Mayor visibilidad y posicionamiento en el Marketplace',
  'Almacenamiento permanente en la nube Cloudflare R2 sin caducidad'
]

const photographerBenefits = [
  {
    icon: 'lucide:lock',
    badge: 'Seguridad y Privacidad',
    title: 'Álbumes Privados Protegidos',
    desc: 'Publica eventos íntimos (bodas, quinceañeros, sesiones corporativas) que no aparecerán en el marketplace público y solo podrán ver quienes tengan el enlace.'
  },
  {
    icon: 'lucide:mail-check',
    badge: 'Entrega Personalizada',
    title: 'Control de Correos Autorizados',
    desc: 'Asigna qué correos electrónicos o usuarios tienen acceso a ver y adquirir las fotografías de cada evento privado.'
  },
  {
    icon: 'lucide:download-cloud',
    badge: 'Flexibilidad de Entrega',
    title: 'Descarga Libre sin Marcas o Venta',
    desc: 'Elige si los clientes autorizados descargan las fotos en ultra alta calidad sin pagar, o si deben comprarlas con marca de agua previa.'
  },
  {
    icon: 'lucide:crown',
    badge: 'Distinción y Confianza',
    title: 'Insignia Dorada Moments PRO',
    desc: 'Destaca con el distintivo verificado PRO en tu vitrina de fotógrafo, perfil público y comentarios, generando máxima credibilidad con organizadores.'
  },
  {
    icon: 'lucide:trending-up',
    badge: 'Crecimiento de Negocio',
    title: 'Posicionamiento Preferente',
    desc: 'Tus eventos públicos obtienen mayor relevancia y prioridad en las búsquedas y el explorador del marketplace de Moments.'
  },
  {
    icon: 'lucide:cloud',
    badge: 'Nube Cloudflare R2',
    title: 'Almacenamiento Seguro de por Vida',
    desc: 'Tus fotos en resolución original permanecen respaldadas de forma segura y permanente sin temor a que expiren con el tiempo.'
  }
]

const comparisonRows = [
  { feature: 'Publicar eventos públicos en Marketplace', free: true, pro: true },
  { feature: 'Crear álbumes y galerías privadas por enlace', free: false, pro: true },
  { feature: 'Restricción de acceso a correos específicos', free: false, pro: true },
  { feature: 'Modo descarga directa gratuita sin marcas de agua', free: false, pro: true },
  { feature: 'Modo venta de fotos privada con marca de agua', free: false, pro: true },
  { feature: 'Insignia dorada oficial PRO en Perfil y Vitrina', free: false, pro: true },
  { feature: 'Posicionamiento destacado en Marketplace', free: false, pro: true },
  { feature: 'Tarjetas de Regalo para clientes', free: true, pro: true },
  { feature: 'Respaldo seguro en la nube Cloudflare R2', free: true, pro: true },
  { feature: 'Soporte prioritario para fotógrafos', free: false, pro: true }
]

const faqs = [
  {
    q: '¿Cómo funcionan los álbumes privados para fotógrafos?',
    a: 'Al activar Moments PRO, al crear o editar cualquier evento puedes elegir la opción "Privado". Esto hace que el evento no aparezca en el Marketplace general. Solo podrán entrar las personas que tengan el enlace directo o los correos autorizados que tú especifiques.'
  },
  {
    q: '¿Mis clientes deben pagar para descargar fotos en un álbum privado?',
    a: 'Tú tienes el control total: puedes configurar el álbum en modo "Descarga libre" (donde tus clientes autorizados descargan en alta calidad sin marcas de forma gratuita) o en modo "Vender fotos" (donde ven las fotos con marca de agua y deben comprarlas en paquetes).'
  },
  {
    q: '¿Cuánto cuesta la suscripción y qué métodos de pago aceptan?',
    a: 'Tiene un precio sumamente económico y accesible de solo $5.000 COP al mes (con un 66% de descuento de lanzamiento). Aceptamos Nequi, Daviplata, PSE y cualquier tarjeta de crédito o débito a través de la pasarela segura Wompi (Bancolombia).'
  },
  {
    q: '¿Qué pasa con mis eventos privados si decido cancelar la suscripción?',
    a: 'Tus eventos privados existentes y las fotos subidas se mantienen intactos y seguros en la nube. Simplemente no podrás crear nuevos álbumes privados hasta que reactives tu membresía PRO.'
  },
  {
    q: '¿Puedo cancelar mi suscripción en cualquier momento?',
    a: 'Sí, 100% libre y sin compromisos. Puedes cancelar tu plan en cualquier momento sin penalizaciones ni cláusulas de permanencia.'
  }
]

async function handleSubscribe() {
  if (!authStore.isAuthenticated) {
    toast.info('Inicia sesión', 'Debes iniciar sesión para suscribirte a Moments PRO.')
    router.push('/login?redirect=/dashboard/photographer/subscription')
    return
  }

  try {
    await subscriptionStore.startSubscriptionFlow(() => {
      authStore.updateUserData({ isPro: true })
      toast.success('¡Felicitaciones!', '¡Tu membresía Moments PRO para fotógrafos ha sido activada con éxito!')
      router.push('/dashboard/photographer?tab=events')
    })
  } catch (e: any) {
    toast.error('Error', e.message || 'No se pudo iniciar el proceso de suscripción.')
  }
}

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await subscriptionStore.fetchActiveSubscription()
  }
})
</script>
