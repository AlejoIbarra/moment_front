<template>
  <ClientOnly>
    <Teleport to="body">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[9995] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        @click.self="finishTour"
      >
        <div class="relative w-full max-w-2xl bg-[#09090b] text-white rounded-3xl border border-white/15 shadow-2xl overflow-hidden">
          <!-- Top progress bar -->
          <div class="h-1.5 w-full bg-white/10">
            <div
              class="h-full bg-[#3ef4a1] transition-all duration-300"
              :style="{ width: `${((currentStep + 1) / steps.length) * 100}%` }"
            ></div>
          </div>

          <!-- Header -->
          <div class="px-6 sm:px-8 pt-6 pb-4 flex items-center justify-between gap-4 border-b border-white/10">
            <div class="flex items-center gap-2.5">
              <span class="px-2.5 py-1 rounded-full bg-[#3ef4a1]/15 border border-[#3ef4a1]/30 text-[#3ef4a1] text-[10px] font-black uppercase tracking-wider">
                Guía Rápida · Paso {{ currentStep + 1 }} de {{ steps.length }}
              </span>
              <span class="text-xs text-gray-400 font-semibold hidden sm:inline">Moments para Fotógrafos</span>
            </div>
            <button
              type="button"
              @click="finishTour"
              class="text-xs font-bold text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              Omitir tour ✕
            </button>
          </div>

          <!-- Step Content -->
          <div class="p-6 sm:p-8 space-y-6">
            <div class="flex items-start gap-4">
              <div class="w-14 h-14 rounded-2xl bg-[#3ef4a1]/15 border border-[#3ef4a1]/30 text-[#3ef4a1] flex items-center justify-center shrink-0">
                <Icon :name="activeStep.icon" class="w-7 h-7" />
              </div>
              <div class="space-y-1.5">
                <p class="text-[11px] font-extrabold uppercase tracking-widest text-[#3ef4a1]">{{ activeStep.eyebrow }}</p>
                <h3 class="text-2xl sm:text-3xl font-black tracking-tight text-white leading-tight">
                  {{ activeStep.title }}
                </h3>
              </div>
            </div>

            <p class="text-sm sm:text-base text-gray-300 leading-relaxed">
              {{ activeStep.description }}
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div
                v-for="bullet in activeStep.bullets"
                :key="bullet"
                class="p-3.5 rounded-2xl bg-white/[0.04] border border-white/10 text-xs text-gray-200 flex items-start gap-2.5"
              >
                <Icon name="lucide:check-circle-2" class="w-4 h-4 text-[#3ef4a1] shrink-0 mt-0.5" />
                <span class="leading-relaxed">{{ bullet }}</span>
              </div>
            </div>

            <!-- Step Dots -->
            <div class="flex items-center justify-center gap-2 pt-2">
              <button
                v-for="(s, idx) in steps"
                :key="s.id"
                type="button"
                @click="currentStep = idx"
                :class="[
                  'h-2 rounded-full transition-all cursor-pointer',
                  currentStep === idx ? 'w-7 bg-[#3ef4a1]' : 'w-2 bg-white/20 hover:bg-white/40'
                ]"
                :aria-label="`Ir al paso ${idx + 1}`"
              ></button>
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="px-6 sm:px-8 py-5 bg-black/50 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <button
                v-if="currentStep > 0"
                type="button"
                @click="currentStep--"
                class="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                ← Anterior
              </button>
              <button
                v-if="activeStep.targetTab"
                type="button"
                @click="goToSection(activeStep.targetTab)"
                class="px-4 py-2.5 rounded-xl border border-[#3ef4a1]/40 text-[#3ef4a1] hover:bg-[#3ef4a1]/10 text-xs font-extrabold transition-colors cursor-pointer"
              >
                {{ activeStep.actionLabel || 'Ir a esta sección' }}
              </button>
            </div>

            <button
              v-if="currentStep < steps.length - 1"
              type="button"
              @click="currentStep++"
              class="px-6 py-2.5 rounded-xl bg-[#3ef4a1] hover:bg-[#2dd68a] text-black text-xs font-extrabold transition-all cursor-pointer ml-auto"
            >
              Siguiente →
            </button>
            <button
              v-else
              type="button"
              @click="finishTour"
              class="px-6 py-2.5 rounded-xl bg-[#3ef4a1] hover:bg-[#2dd68a] text-black text-xs font-extrabold transition-all cursor-pointer ml-auto"
            >
              ¡Empezar a usar Moments! 🚀
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </ClientOnly>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'navigate-tab'])
const currentStep = ref(0)

watch(() => props.modelValue, (open) => {
  if (open) currentStep.value = 0
})

const steps = [
  {
    id: 'vitrina',
    icon: 'lucide:sparkles',
    eyebrow: '1 · Tu Vitrina de Talento',
    title: 'Expone tu trabajo ante miles de clientes y organizadores',
    description:
      'Moments es tu vitrina profesional. Tu perfil y tus álbumes públicos aparecen en el Marketplace y en el directorio por ciudad para que deportistas, marcas y clientes descubran tu talento y te contraten.',
    bullets: [
      'Perfil público con tu portafolio, ciudad y enlace directo.',
      'Chat interno en tiempo real con clientes y organizadores.',
      'Botón de compartir en Stories/WhatsApp que multiplica tu alcance.',
      'Conservas hasta el 85% neto de cada venta (la comisión más baja del nicho).'
    ],
    targetTab: 'summary',
    actionLabel: 'Ver mi Resumen'
  },
  {
    id: 'events-privacy',
    icon: 'lucide:shield-check',
    eyebrow: '2 · Álbumes & Privacidad Facial',
    title: 'Control total: álbumes públicos, privados o Solo por Rostro',
    description:
      'Crea eventos deportivos, bodas o fiestas en segundos. Si cubres colegios, menores o eventos VIP, activa el Modo Galería Privada por Rostro: nadie verá fotos de otros si su cara no aparece.',
    bullets: [
      'Galería Privada por Rostro: selfie obligatoria y cero exposición a terceros.',
      'Marca de agua inteligente y protección anticapturas.',
      'Invita colaboradores (fotógrafos aliados) con comisiones automáticas.',
      'Código QR oficial del evento listo para imprimir o compartir.'
    ],
    targetTab: 'events',
    actionLabel: 'Ir a Mis Eventos'
  },
  {
    id: 'ai-upload',
    icon: 'lucide:scan-face',
    eyebrow: '3 · Subida Masiva con IA Dual',
    title: 'Sube cientos de fotos y deja que la IA haga el trabajo pesado',
    description:
      'Elige entre Reconocimiento Facial, Lectura de Dorsales (OCR), ambos o publicación inmediata sin IA. Tus clientes se toman una selfie o escriben su número y encuentran sus fotos en 3 segundos.',
    bullets: [
      'Detección automática de rostros y números de dorsal.',
      'Compatible con JPG, PNG, WEBP y archivos RAW (CR2/CR3/DNG).',
      'Edición o corrección manual de dorsales en 1 clic.',
      'Los originales quedan guardados en alta resolución listos para entrega.'
    ],
    targetTab: 'upload',
    actionLabel: 'Ir a Subir Fotos'
  },
  {
    id: 'presale-packages',
    icon: 'lucide:package',
    eyebrow: '4 · Preventas y Venta por Paquetes',
    title: 'Cobra antes del evento con Preventas y Paquetes',
    description:
      'Con planes superiores (Básico o Premium) puedes activar Preventas con póster oficial, precio Antes vs. Después, fecha de lanzamiento y elegir vender únicamente por paquetes.',
    bullets: [
      'Vende antes de que exista una sola foto del evento.',
      'Configura precio promocional Antes y precio normal Después.',
      'Opción "Solo por Paquetes" para aumentar el ticket promedio.',
      'Cada comprador recibe su pase único PRE-XXXXXX automático.'
    ],
    targetTab: 'events',
    actionLabel: 'Configurar en un Evento'
  },
  {
    id: 'race-codes',
    icon: 'lucide:ticket',
    eyebrow: '5 · Códigos para Carreras Negociadas',
    title: 'Genera lotes en Excel para kits de running y eventos',
    description:
      '¿Negociaste una carrera de 500 o 2.000 corredores? Dentro de la pestaña Paquetes de tu evento puedes generar códigos activos por lote y descargar el Excel (.xlsx) para entregarlos con la inscripción.',
    bullets: [
      'Hasta 2.000 códigos por lote con prefijo personalizado (ej. RUN26).',
      'Define cuántas fotos incluye cada código (1 a 999).',
      '10% dto (>100 códigos) y 20% dto (>300 códigos) si tienes plan PRO.',
      'Pago inmediato en pasarela Wompi y descarga directa en Excel.'
    ],
    targetTab: 'events',
    actionLabel: 'Ver en Eventos'
  },
  {
    id: 'earnings-studio',
    icon: 'lucide:wand-2',
    eyebrow: '6 · Studio Pro y Retiros Directos',
    title: 'Edita en lote con Studio Pro y retira tus ganancias fácil',
    description:
      'Revela lotes completos con presets profesionales en Studio Pro sin salir de Moments, sigue tus ventas y métricas en vivo y retira tus ganancias directo a tu cuenta.',
    bullets: [
      'Studio Pro integrado para revelar y ajustar color en segundos.',
      'Estadísticas de vistas, likes y fotos más buscadas por evento.',
      'Billetera Moments con historial transparente de cada venta.',
      'Puedes volver a abrir este tour cuando quieras desde la barra superior.'
    ],
    targetTab: 'summary',
    actionLabel: 'Ir al Dashboard'
  }
]

const activeStep = computed(() => steps[currentStep.value] || steps[0])

function goToSection(tabKey) {
  emit('navigate-tab', tabKey)
  finishTour()
}

function finishTour() {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('moments_photographer_tour_v1', 'done')
    } catch {}
  }
  emit('update:modelValue', false)
}
</script>
