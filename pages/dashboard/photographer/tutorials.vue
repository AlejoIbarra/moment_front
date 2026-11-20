<template>
  <div class="min-h-screen bg-slate-50/70 pb-24 pt-6 sm:pt-8 print:bg-white print:pt-0 print:pb-0">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

      <!-- ═══════════════════════════════════════════════════════ -->
      <!-- TOP BREADCRUMB & HEADER                                -->
      <!-- ═══════════════════════════════════════════════════════ -->
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-5 border-b border-slate-200 print:hidden">
        <div class="flex items-start sm:items-center gap-3.5">
          <NuxtLink
            to="/dashboard/photographer"
            class="w-10 h-10 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-black flex items-center justify-center shadow-2xs transition-all hover:scale-105 active:scale-95 shrink-0 mt-0.5 sm:mt-0"
            title="Volver al Panel de Fotógrafo"
          >
            <Icon name="lucide:arrow-left" class="w-5 h-5" />
          </NuxtLink>
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-[11px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <Icon name="lucide:graduation-cap" class="w-3.5 h-3.5" />
                Academia Exclusiva para Fotógrafos
              </span>
              <span class="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Guías Paso a Paso + Manual Oficial
              </span>
            </div>
            <h1 class="text-2xl sm:text-3xl font-black text-slate-900 mt-1 tracking-tight">
              Tutoriales y Manual de Usuario Moments 📚
            </h1>
            <p class="text-xs sm:text-sm text-slate-500 mt-0.5">
              Aprende a dominar cada herramienta de tu estudio digital: álbumes, búsqueda por IA (rostro y dorsal), paquetes, tarjetas de regalo y cobros.
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-wrap w-full lg:w-auto justify-end">
          <button
            v-if="activeSection === 'manual'"
            type="button"
            @click="printManual"
            class="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Icon name="lucide:printer" class="w-4 h-4 text-slate-500" />
            <span>Imprimir / Guardar PDF</span>
          </button>
          <NuxtLink
            to="/chat?user=mastermoments"
            class="px-3.5 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5"
          >
            <Icon name="lucide:headset" class="w-4 h-4 text-emerald-600" />
            <span>Soporte @mastermoments</span>
          </NuxtLink>
          <NuxtLink
            to="/dashboard/photographer"
            class="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs shadow-2xs transition-all flex items-center gap-1.5"
          >
            <Icon name="lucide:layout-dashboard" class="w-4 h-4 text-[#3ef4a1]" />
            <span>Volver al Centro de Mando</span>
          </NuxtLink>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════ -->
      <!-- MAIN SWITCHER + SEARCH BAR                             -->
      <!-- ═══════════════════════════════════════════════════════ -->
      <div class="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 print:hidden">
        <!-- Section Switcher Tabs -->
        <div class="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            type="button"
            @click="activeSection = 'tutorials'"
            :class="[
              'flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer',
              activeSection === 'tutorials'
                ? 'bg-slate-950 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            <Icon name="lucide:play-circle" class="w-4 h-4" :class="activeSection === 'tutorials' ? 'text-[#3ef4a1]' : 'text-slate-500'" />
            <span>Tutoriales Paso a Paso</span>
            <span class="px-1.5 py-0.5 rounded-md text-[10px] font-black" :class="activeSection === 'tutorials' ? 'bg-white/15 text-[#3ef4a1]' : 'bg-slate-200 text-slate-700'">
              {{ tutorials.length }}
            </span>
          </button>

          <button
            type="button"
            @click="activeSection = 'manual'"
            :class="[
              'flex-1 sm:flex-initial px-4 py-2.5 rounded-xl text-xs sm:text-sm font-black transition-all flex items-center justify-center gap-2 cursor-pointer',
              activeSection === 'manual'
                ? 'bg-slate-950 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            ]"
          >
            <Icon name="lucide:book-open" class="w-4 h-4" :class="activeSection === 'manual' ? 'text-[#3ef4a1]' : 'text-slate-500'" />
            <span>Manual de Usuario Completo</span>
            <span class="px-1.5 py-0.5 rounded-md text-[10px] font-black" :class="activeSection === 'manual' ? 'bg-white/15 text-[#3ef4a1]' : 'bg-slate-200 text-slate-700'">
              {{ manualChapters.length }} Cap.
            </span>
          </button>
        </div>

        <!-- Search Input -->
        <div class="relative flex-1 max-w-md">
          <Icon name="lucide:search" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar tutorial o tema (ej. dorsal, rostro, paquetes, pagos, marca de agua)..."
            class="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
          />
          <button
            v-if="searchQuery"
            type="button"
            @click="searchQuery = ''"
            class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <Icon name="lucide:x" class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════ -->
      <!-- SECTION 1: TUTORIALES INTERACTIVOS PASO A PASO         -->
      <!-- ═══════════════════════════════════════════════════════ -->
      <div v-if="activeSection === 'tutorials'" class="space-y-6">
        <!-- Category Pills -->
        <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <button
            v-for="cat in tutorialCategories"
            :key="cat.id"
            type="button"
            @click="selectedCategory = cat.id"
            :class="[
              'px-3.5 py-2 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer border',
              selectedCategory === cat.id
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200/80 hover:bg-slate-50'
            ]"
          >
            <Icon :name="cat.icon" class="w-3.5 h-3.5" />
            <span>{{ cat.label }}</span>
          </button>
        </div>

        <!-- Empty Search Result -->
        <div v-if="filteredTutorials.length === 0" class="bg-white rounded-3xl p-12 text-center border border-slate-200/80">
          <Icon name="lucide:search-x" class="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 class="text-base font-black text-slate-900">No encontramos tutoriales con "{{ searchQuery }}"</h3>
          <p class="text-xs text-slate-500 mt-1">Prueba buscando otro término o revisa el Manual Completo.</p>
          <button
            type="button"
            @click="searchQuery = ''; selectedCategory = 'ALL'"
            class="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold cursor-pointer"
          >
            Ver todos los tutoriales
          </button>
        </div>

        <!-- Tutorials Grid -->
        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div
            v-for="(tut, idx) in filteredTutorials"
            :key="tut.id"
            class="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
          >
            <div class="p-5 sm:p-6 space-y-4">
              <!-- Card Top Meta -->
              <div class="flex items-start justify-between gap-3">
                <div class="flex items-center gap-3">
                  <div :class="['w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 shadow-xs', tut.iconBg, tut.iconColor]">
                    <Icon :name="tut.icon" class="w-5 h-5" />
                  </div>
                  <div>
                    <div class="flex items-center gap-2 flex-wrap">
                      <span :class="['text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md', tut.badgeClass]">
                        {{ tut.categoryLabel }}
                      </span>
                      <span class="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                        <Icon name="lucide:clock" class="w-3 h-3" />
                        {{ tut.duration }}
                      </span>
                    </div>
                    <h3 class="text-base sm:text-lg font-black text-slate-900 mt-1 leading-snug">
                      {{ tut.title }}
                    </h3>
                  </div>
                </div>
                <span class="text-xs font-black text-slate-300 font-mono">#0{{ idx + 1 }}</span>
              </div>

              <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {{ tut.summary }}
              </p>

              <!-- Step-by-Step Accordion / List -->
              <div class="bg-slate-50/90 rounded-2xl p-4 border border-slate-100 space-y-3">
                <p class="text-[11px] font-black uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Icon name="lucide:list-checks" class="w-3.5 h-3.5 text-indigo-600" />
                  Pasos para realizarlo:
                </p>
                <ol class="space-y-2.5">
                  <li
                    v-for="(step, sIdx) in tut.steps"
                    :key="sIdx"
                    class="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed"
                  >
                    <span class="w-5 h-5 rounded-full bg-slate-900 text-[#3ef4a1] font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {{ sIdx + 1 }}
                    </span>
                    <div>
                      <span class="font-extrabold text-slate-900">{{ step.title }}: </span>
                      <span>{{ step.detail }}</span>
                    </div>
                  </li>
                </ol>
              </div>

              <!-- Pro Tip Box -->
              <div v-if="tut.proTip" class="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-xs text-amber-950">
                <Icon name="lucide:lightbulb" class="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span class="font-black">Consejo de Experto: </span>
                  <span>{{ tut.proTip }}</span>
                </div>
              </div>
            </div>

            <!-- Action Footer -->
            <div class="px-5 py-3.5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                @click="openChapterInManual(tut.manualChapterId)"
                class="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
              >
                <Icon name="lucide:book-open" class="w-3.5 h-3.5" />
                <span>Ver en el Manual</span>
              </button>

              <NuxtLink
                :to="tut.actionRoute"
                class="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-2xs transition-all active:scale-95"
              >
                <span>{{ tut.actionLabel }}</span>
                <Icon name="lucide:arrow-right" class="w-3.5 h-3.5 text-[#3ef4a1]" />
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════ -->
      <!-- SECTION 2: MANUAL DE USUARIO COMPLETO DEL APLICATIVO   -->
      <!-- ═══════════════════════════════════════════════════════ -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <!-- Left Sidebar: Table of Contents -->
        <aside class="lg:col-span-4 xl:col-span-3 bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/90 shadow-xs lg:sticky lg:top-20 space-y-3 print:hidden">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 class="text-xs font-black uppercase tracking-wider text-slate-500">
              Índice del Manual
            </h3>
            <span class="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              v2.5 Oficial
            </span>
          </div>

          <nav class="space-y-1">
            <button
              v-for="(chapter, idx) in filteredManualChapters"
              :key="chapter.id"
              type="button"
              @click="scrollToChapter(chapter.id)"
              :class="[
                'w-full px-3 py-2.5 rounded-2xl text-left text-xs font-bold transition-all flex items-center gap-2.5 cursor-pointer',
                activeChapterId === chapter.id
                  ? 'bg-slate-950 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-slate-100'
              ]"
            >
              <span
                class="w-6 h-6 rounded-lg text-[10px] font-black flex items-center justify-center shrink-0"
                :class="activeChapterId === chapter.id ? 'bg-[#3ef4a1] text-slate-950' : 'bg-slate-100 text-slate-600'"
              >
                {{ idx + 1 }}
              </span>
              <span class="truncate">{{ chapter.shortTitle }}</span>
            </button>
          </nav>

          <!-- Direct Help Box inside Sidebar -->
          <div class="mt-4 pt-4 border-t border-slate-100">
            <div class="p-3.5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 text-white space-y-2">
              <div class="flex items-center gap-2">
                <Icon name="lucide:headset" class="w-4 h-4 text-[#3ef4a1]" />
                <span class="text-xs font-black">¿Necesitas ayuda personalizada?</span>
              </div>
              <p class="text-[11px] text-slate-300 leading-relaxed">
                Nuestro equipo en <span class="text-[#3ef4a1] font-bold">@mastermoments</span> está disponible para asistirte.
              </p>
              <NuxtLink
                to="/chat?user=mastermoments"
                class="w-full py-2 px-3 rounded-xl bg-[#3ef4a1] hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Icon name="lucide:message-circle" class="w-3.5 h-3.5" />
                <span>Escribir a @mastermoments</span>
              </NuxtLink>
            </div>
          </div>
        </aside>

        <!-- Right Content: Full Manual Chapters -->
        <div class="lg:col-span-8 xl:col-span-9 space-y-6">
          <!-- Manual Cover Banner -->
          <div class="bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
            <div class="relative z-10 max-w-2xl space-y-2">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[#3ef4a1] text-[11px] font-black uppercase tracking-wider">
                <Icon name="lucide:shield-check" class="w-3.5 h-3.5" />
                Manual Oficial para Fotógrafos Moments Gallery
              </div>
              <h2 class="text-2xl sm:text-3xl font-black tracking-tight">
                Guía Completa de Operación y Ventas
              </h2>
              <p class="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Este manual detalla el funcionamiento técnico y comercial de la plataforma Moments: desde la creación y blindaje de tus galerías hasta la indexación por Inteligencia Artificial y la recepción automática de tus ganancias.
              </p>
            </div>
          </div>

          <!-- Chapters Loop -->
          <article
            v-for="(chapter, cIdx) in filteredManualChapters"
            :key="chapter.id"
            :id="`chapter-${chapter.id}`"
            class="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-5 scroll-mt-24"
          >
            <div class="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
              <div class="flex items-center gap-3.5">
                <div class="w-11 h-11 rounded-2xl bg-slate-950 text-[#3ef4a1] font-black text-sm flex items-center justify-center shrink-0 shadow-sm">
                  0{{ cIdx + 1 }}
                </div>
                <div>
                  <span class="text-[10px] font-black uppercase tracking-wider text-indigo-600">
                    Capítulo {{ cIdx + 1 }}
                  </span>
                  <h3 class="text-lg sm:text-xl font-black text-slate-900">
                    {{ chapter.title }}
                  </h3>
                </div>
              </div>
              <Icon :name="chapter.icon" class="w-6 h-6 text-slate-400 shrink-0 hidden sm:block" />
            </div>

            <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {{ chapter.intro }}
            </p>

            <!-- Subsections -->
            <div class="space-y-4">
              <div
                v-for="(sub, sIdx) in chapter.sections"
                :key="sIdx"
                class="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-100 space-y-2"
              >
                <h4 class="text-sm font-black text-slate-900 flex items-center gap-2">
                  <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                  {{ sub.heading }}
                </h4>
                <p class="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {{ sub.body }}
                </p>
                <ul v-if="sub.bullets && sub.bullets.length" class="space-y-1.5 pt-1">
                  <li
                    v-for="(bullet, bIdx) in sub.bullets"
                    :key="bIdx"
                    class="text-xs text-slate-700 flex items-start gap-2"
                  >
                    <Icon name="lucide:check-circle-2" class="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{{ bullet }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Key Takeaway -->
            <div v-if="chapter.keyRule" class="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-start gap-3 text-xs sm:text-sm text-emerald-950">
              <Icon name="lucide:Sparkles" class="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span class="font-black">Regla de Oro: </span>
                <span>{{ chapter.keyRule }}</span>
              </div>
            </div>
          </article>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()

// Verificación estricta: solo fotógrafos (o administradores) pueden acceder a esta ruta
onMounted(() => {
  if (!authStore.isPhotographer && !authStore.isAdmin) {
    toast.warning('Acceso exclusivo para fotógrafos registrados.')
    router.replace('/marketplace')
    return
  }
  if (route.query.section === 'manual') {
    activeSection.value = 'manual'
  }
})

const activeSection = ref<'tutorials' | 'manual'>('tutorials')
const selectedCategory = ref('ALL')
const searchQuery = ref('')
const activeChapterId = ref('overview')

const tutorialCategories = [
  { id: 'ALL', label: 'Todos los Tutoriales', icon: 'lucide:layers' },
  { id: 'START', label: 'Primeros Pasos', icon: 'lucide:rocket' },
  { id: 'AI', label: 'IA (Rostro y Dorsal)', icon: 'lucide:scan-face' },
  { id: 'SALES', label: 'Ventas, Paquetes y Cupones', icon: 'lucide:badge-dollar-sign' },
  { id: 'PRO', label: 'Herramientas Studio & Juegos', icon: 'lucide:sparkles' }
]

const tutorials = [
  {
    id: 'create-event-upload',
    category: 'START',
    categoryLabel: 'Primeros Pasos',
    duration: '3 min',
    title: 'Cómo crear tu primer Álbum y subir fotos en lote',
    summary: 'Crea un evento público o privado, define el precio por foto en tu moneda local y sube decenas o cientos de fotografías con marca de agua automática.',
    icon: 'lucide:calendar-plus',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    badgeClass: 'bg-indigo-50 text-indigo-700 border border-indigo-200/60',
    manualChapterId: 'albums',
    actionLabel: 'Ir a Mis Eventos',
    actionRoute: '/dashboard/photographer?tab=events',
    steps: [
      {
        title: 'Abre el creador de eventos',
        detail: 'En tu Centro de Mando, entra a la pestaña "My Events" y pulsa el botón verde "+ Create Event".'
      },
      {
        title: 'Completa los datos básicos',
        detail: 'Ingresa el título del evento (ej. "Media Maratón Bogotá 2026"), fecha, ubicación y moneda de venta (COP, USD, MXN, etc.).'
      },
      {
        title: 'Elige la privacidad del álbum',
        detail: 'Selecciona Público (visible en tu vitrina y marketplace) o Privado VIP (protegido por contraseña o lista de correos invitados).'
      },
      {
        title: 'Sube las fotografías',
        detail: 'Entra al álbum creado o usa la pestaña "Quick Upload", asigna el precio base por foto y arrastra tus archivos JPG, PNG, WebP o RAW.'
      }
    ],
    proTip: 'La primera foto que subas o selecciones como portada será la imagen principal de tu evento en el Marketplace.'
  },
  {
    id: 'ai-face-bib-search',
    category: 'AI',
    categoryLabel: 'Inteligencia Artificial',
    duration: '4 min',
    title: 'Cómo activar y aprovechar la Búsqueda por Dorsal y Reconocimiento Facial',
    summary: 'Permite que los asistentes y deportistas encuentren todas sus fotos en 2 segundos subiendo una selfie o escribiendo su número de dorsal.',
    icon: 'lucide:scan-face',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    badgeClass: 'bg-emerald-50 text-emerald-700 border border-emerald-200/60',
    manualChapterId: 'ai-engine',
    actionLabel: 'Ver mis Álbumes',
    actionRoute: '/dashboard/photographer?tab=events',
    steps: [
      {
        title: 'Indexación automática al subir',
        detail: 'Cada vez que subes fotos a un evento, el motor de IA de Moments analiza los rostros y detecta los números de dorsal automáticamente en segundo plano.'
      },
      {
        title: 'Búsqueda por Número de Dorsal (OCR)',
        detail: 'En la galería del evento, tu cliente escribe su número (ej. "28" o "405") en la barra "Buscar por dorsal..." y verá al instante todas las fotos donde aparece ese dorsal.'
      },
      {
        title: 'Búsqueda por Selfie (Reconocimiento Facial)',
        detail: 'El cliente pulsa el botón "Buscar por Rostro", toma o sube una selfie y la IA compara la biometría facial mostrando sus fotos ordenadas por porcentaje de coincidencia.'
      },
      {
        title: 'Re-indexar un álbum existente',
        detail: 'Si tenías fotos antiguas sin procesar, entra al detalle de tu evento en el panel de fotógrafo y pulsa "Procesar / Indexar IA".'
      }
    ],
    proTip: 'Para eventos deportivos, asegúrate de que el dorsal sea legible en el pecho o torso; nuestro motor une dígitos cercanos automáticamente.'
  },
  {
    id: 'photo-packages',
    category: 'SALES',
    categoryLabel: 'Ventas y Conversión',
    duration: '2 min',
    title: 'Cómo crear Paquetes de Fotos con descuento por volumen',
    summary: 'Incentiva a tus clientes a comprar 5, 10 o 20 fotos juntas en lugar de una sola, aumentando tu ganancia promedio por pedido.',
    icon: 'lucide:package',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    badgeClass: 'bg-amber-50 text-amber-800 border border-amber-200/60',
    manualChapterId: 'packages-giftcards',
    actionLabel: 'Configurar Paquetes',
    actionRoute: '/dashboard/photographer?tab=packages',
    steps: [
      {
        title: 'Entra a la pestaña Packages',
        detail: 'Desde el Centro de Mando, haz clic en la tarjeta "Packages" o en el botón "Crear Paquete" sobre tus eventos.'
      },
      {
        title: 'Define la cantidad y el precio total',
        detail: 'Por ejemplo: si 1 foto cuesta $10.000 COP, crea un "Pack 5 Fotos" por $35.000 COP (máximo 20 fotos por paquete).'
      },
      {
        title: 'Asigna el alcance',
        detail: 'Puedes hacer que el paquete aplique a "Todos tus eventos" o exclusivamente a un evento específico.'
      },
      {
        title: 'Aplicación automática en el carrito',
        detail: 'Cuando el comprador agregue esa cantidad de fotos al carrito, el sistema aplicará la tarifa especial del paquete automáticamente.'
      }
    ],
    proTip: 'Los fotógrafos que configuran al menos 2 paquetes (ej. Pack 3 fotos y Pack 10 fotos) incrementan sus ventas totales hasta en un 65%.'
  },
  {
    id: 'gift-cards-batches',
    category: 'SALES',
    categoryLabel: 'Ventas y Fidelización',
    duration: '3 min',
    title: 'Cómo emitir Tarjetas de Regalo y Cupones Prepagados',
    summary: 'Vende bonos por adelantado (por cantidad de fotos o por saldo en dinero) y compártelos por WhatsApp o descárgalos en Excel.',
    icon: 'lucide:gift',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    badgeClass: 'bg-rose-50 text-rose-700 border border-rose-200/60',
    manualChapterId: 'packages-giftcards',
    actionLabel: 'Ir a Tarjetas de Regalo',
    actionRoute: '/dashboard/photographer?tab=giftcards',
    steps: [
      {
        title: 'Selecciona el tipo de beneficio',
        detail: 'En la pestaña "Tarjetas de Regalo", elige si el código dará derecho a "Cantidad de Fotos Gratis" (ej. 3 fotos HD) o "Saldo en Dinero" (ej. $30.000 COP).'
      },
      {
        title: 'Elige validez y cantidad del lote',
        detail: 'Define si los códigos servirán en todos tus eventos o en uno solo, e indica cuántas tarjetas deseas generar en el lote (de 1 a 50).'
      },
      {
        title: 'Activa y comparte con tus clientes',
        detail: 'En "Mis Lotes Generados", haz clic en "Ver Códigos" para enviar la tarjeta interactiva tipo raspa-y-gana por WhatsApp, Chat o exportar a Excel.'
      }
    ],
    proTip: 'Ideal para organizadores de carreras o colegios que te compran paquetes pre-pagados para entregar códigos individuales a cada participante.'
  },
  {
    id: 'watermark-payments-settings',
    category: 'START',
    categoryLabel: 'Configuración y Cobros',
    duration: '3 min',
    title: 'Cómo personalizar tu Marca de Agua y vincular Mercado Pago',
    summary: 'Protege tu autoría visual con marca de agua personalizada y vincula tu cuenta para recibir el dinero de tus ventas.',
    icon: 'lucide:settings',
    iconBg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    badgeClass: 'bg-purple-50 text-purple-700 border border-purple-200/60',
    manualChapterId: 'security-watermarks',
    actionLabel: 'Ir a Configuración',
    actionRoute: '/dashboard/photographer/settings',
    steps: [
      {
        title: 'Abre Configuración (Settings)',
        detail: 'Haz clic en el botón "Settings" en la parte superior derecha de tu perfil de fotógrafo.'
      },
      {
        title: 'Configura tu Marca de Agua',
        detail: 'Elige el texto de tu marca de agua o sube tu propio logotipo en PNG transparente (disponible en Plan Premium) para que se estampe automáticamente en las vistas previas.'
      },
      {
        title: 'Conecta Mercado Pago y revisa tus ventas',
        detail: 'Vincula tu cuenta en la sección de pagos y consulta cada foto vendida y tu saldo disponible en la pestaña "Summary / Dashboard".'
      }
    ],
    proTip: 'Las fotos originales de alta resolución se guardan en una bóveda privada y solo se desbloquean sin marca de agua cuando el pago es aprobado.'
  },
  {
    id: 'studio-pro-and-games',
    category: 'PRO',
    categoryLabel: 'Herramientas Avanzadas',
    duration: '4 min',
    title: 'Cómo usar Studio Pro y los Juegos Rompehielos con QR en Mesas',
    summary: 'Edita y revela fotografías desde el navegador con Studio Pro y dinamiza bodas o fiestas con retos interactivos por código QR.',
    icon: 'lucide:gamepad-2',
    iconBg: 'bg-pink-50',
    iconColor: 'text-pink-600',
    badgeClass: 'bg-pink-50 text-pink-700 border border-pink-200/60',
    manualChapterId: 'studio-games',
    actionLabel: 'Abrir Juegos QR',
    actionRoute: '/dashboard/photographer/games',
    steps: [
      {
        title: 'Moments Studio Pro',
        detail: 'Haz clic en el botón "Studio Pro" en tu Centro de Mando para abrir el laboratorio de revelado digital, ajustar exposición/color y aplicar presets antes de publicar.'
      },
      {
        title: 'Juegos Rompehielos (QR en Mesas)',
        detail: 'En la pestaña "Juegos Rompehielos", selecciona tu evento social (boda, 15 años, corporativo) y activa misiones fotográficas, ruleta o torneo de likes.'
      },
      {
        title: 'Descarga el Código QR del Evento',
        detail: 'Imprime o proyecta el QR en las mesas para que los invitados participen en vivo y luego compren las fotos oficiales de tu galería.'
      }
    ],
    proTip: 'Los juegos con QR hacen que todos los invitados escaneen y entren a tu álbum oficial durante el evento, multiplicando las visitas y ventas.'
  }
]

const manualChapters = [
  {
    id: 'overview',
    shortTitle: 'Visión General y Flujo',
    title: 'Visión General del Ecosistema Moments para Fotógrafos',
    icon: 'lucide:compass',
    intro: 'Moments Gallery es tu estudio y tienda de comercio electrónico fotográfico automatizado. Su objetivo es que solo te preocupes por capturar grandes fotos mientras la plataforma se encarga de protegerlas, indexarlas con IA, cobrar y entregarlas en alta resolución.',
    sections: [
      {
        heading: '1.1 ¿Cómo funciona el ciclo de venta?',
        body: 'El flujo completo está automatizado de principio a fin:',
        bullets: [
          'Creas un álbum y subes tus fotografías originales en alta calidad.',
          'Moments genera automáticamente una versión de vista previa con tu marca de agua y blindaje anti-captura de pantalla.',
          'Nuestro motor de IA indexa los rostros y los números de dorsal de cada foto.',
          'El cliente entra al álbum, se encuentra con una selfie o por su dorsal, paga con Mercado Pago o tarjeta de regalo, y recibe al instante la foto original sin marca de agua.'
        ]
      },
      {
        heading: '1.2 Tu Vitrina Pública (@usuario)',
        body: 'Cada fotógrafo cuenta con un perfil público compartible (moments-gallery.com/profile/tu-usuario) donde tus clientes pueden ver tu biografía, tus eventos públicos activos y contactarte por chat directo.'
      }
    ],
    keyRule: 'Comparte siempre el enlace de tu evento o tu código QR apenas termines de subir las fotos: las primeras 48 horas tras el evento concentran el 80% de las compras.'
  },
  {
    id: 'albums',
    shortTitle: 'Gestión de Eventos y Álbumes',
    title: 'Creación, Privacidad y Administración de Eventos',
    icon: 'lucide:calendar',
    intro: 'En Moments cada sesión, carrera deportiva, boda o torneo se organiza dentro de un Evento (Álbum). Desde tu pestaña "My Events" tienes control total sobre su visibilidad, colaboradores y precios.',
    sections: [
      {
        heading: '2.1 Tipos de Visibilidad y Acceso',
        body: 'Al crear o editar un evento puedes elegir cómo acceden tus clientes:',
        bullets: [
          'Público: Aparece en el Marketplace general y en tu vitrina pública.',
          'Privado con Enlace / Contraseña (PRO): Solo quienes tengan el enlace o la clave secreta pueden ver las fotos.',
          'Privado por Lista VIP de Correos (PRO): Restringe el acceso únicamente a los correos electrónicos autorizados.',
          'Ocultar en mi panel: Puedes archivar visualmente eventos antiguos con el filtro "Ver ocultos" para mantener ordenado tu espacio de trabajo.'
        ]
      },
      {
        heading: '2.2 Trabajo con Fotógrafos Colaboradores',
        body: 'Si cubres un evento grande con un equipo, puedes activar la opción "Permitir Colaboradores" e invitar a otros fotógrafos registrados mediante el botón "Invitar / Compartir" de la tarjeta del evento.'
      }
    ],
    keyRule: 'Puedes cambiar la foto de portada de cualquier álbum entrando al detalle del evento y seleccionando la mejor imagen como portada.'
  },
  {
    id: 'security-watermarks',
    shortTitle: 'Subida, Marcas de Agua y Blindaje',
    title: 'Carga Masiva, Marcas de Agua y Protección Anti-Robo (Anti-Screenshot)',
    icon: 'lucide:shield-alert',
    intro: 'Sabemos que el mayor riesgo de vender fotografías en la web son las capturas de pantalla. Moments incorpora un sistema de seguridad multicapa para proteger tu trabajo.',
    sections: [
      {
        heading: '3.1 Subida Rápida y Formatos Soportados',
        body: 'Puedes subir archivos desde el detalle del evento o desde la pestaña "Quick Upload". Soportamos JPG, JPEG, PNG, WebP y formatos profesionales RAW (CR2, CR3, NEF, ARW, DNG).',
        bullets: [
          'Asigna un precio base antes de iniciar la carga para aplicarlo a todo el lote.',
          'El sistema procesa la miniatura optimizada, aplica la marca de agua en el servidor y almacena el archivo original en privado.'
        ]
      },
      {
        heading: '3.2 Escudo Anti-Screenshot de 5 Capas',
        body: 'En la galería pública del Marketplace, las fotos no compradas están protegidas por:',
        bullets: [
          'Marca de agua grabada directamente en los píxeles de la imagen desde el servidor (imposible de quitar desde el código HTML).',
          'Malla diagonal y sello central de protección en el visor ampliado (Lightbox) con zoom bloqueado hasta la compra.',
          'Apagón instantáneo (0ms) de las fotografías cuando el navegador pierde el foco, se cambia de ventana o se presiona PrintScreen / Cmd+Shift+3/4 / Win+Shift+S.',
          'Bloqueo de clic derecho, arrastre de imagen, gestos de captura de 3 dedos en móviles e impresión de página.'
        ]
      }
    ],
    keyRule: 'El comprador solo obtiene el archivo de máxima resolución y libre de sellos tras completar la compra.'
  },
  {
    id: 'ai-engine',
    shortTitle: 'Búsqueda con IA (Rostro y Dorsal)',
    title: 'Motor de Inteligencia Artificial: Reconocimiento Facial y OCR de Dorsales',
    icon: 'lucide:cpu',
    intro: 'Cuando un evento tiene cientos o miles de fotos, el comprador no quiere pasar páginas buscando manualmente. La IA de Moments permite que se encuentre en segundos.',
    sections: [
      {
        heading: '4.1 Búsqueda por Número de Dorsal (RapidOCR)',
        body: 'Nuestro motor de visión artificial detecta carteles numéricos en el torso o uniforme de los participantes:',
        bullets: [
          'Une automáticamente dígitos contiguos de izquierda a derecha para leer el número completo del corredor.',
          'Filtra el ruido visual y permite buscar cualquier número exacto desde la barra "Buscar por dorsal...".'
        ]
      },
      {
        heading: '4.2 Búsqueda por Reconocimiento Facial (Biometría 128D)',
        body: 'Cada rostro claro en tus fotos se convierte en un vector biométrico de 128 dimensiones:',
        bullets: [
          'El cliente sube una selfie o foto de su rostro en "Buscar por Rostro".',
          'El sistema corrige la orientación de la selfie en celulares y devuelve todas las fotos donde aparece esa persona, indicando el porcentaje de coincidencia.'
        ]
      }
    ],
    keyRule: 'Si subiste fotos con la IA desactivada o deseas re-procesar un álbum completo, usa el botón de indexación IA dentro de la vista de administración del evento.'
  },
  {
    id: 'packages-giftcards',
    shortTitle: 'Paquetes y Tarjetas de Regalo',
    title: 'Estrategias Comerciales: Paquetes de Volumen y Tarjetas de Regalo',
    icon: 'lucide:shopping-bag',
    intro: 'Aumenta tus ingresos ofreciendo descuentos automáticos por cantidad de fotos y vendiendo códigos prepagados.',
    sections: [
      {
        heading: '5.1 Paquetes Promocionales (Packages)',
        body: 'En la pestaña "Packages" puedes crear combos de hasta 20 fotos. Cuando un cliente añade fotos de tu evento al carrito, Moments calcula automáticamente la combinación más favorable con tus paquetes para motivarlo a llevar más fotos.'
      },
      {
        heading: '5.2 Lotes de Tarjetas de Regalo (Gift Cards)',
        body: 'En la pestaña "Tarjetas de Regalo" puedes emitir lotes de códigos únicos:',
        bullets: [
          'Modalidad Fotos Gratis: El código permite descargar X fotos sin costo en el checkout.',
          'Modalidad Saldo COP: El código descuenta un monto en dinero del carrito.',
          'Experiencia Interactiva: Tu cliente recibe un enlace (/gift/CODIGO) con una tarjeta digital que puede raspar en pantalla para revelar y reclamar su beneficio.'
        ]
      }
    ],
    keyRule: 'Puedes marcar cada tarjeta como "Entregada" en tu panel de lotes y exportar todo el listado a un archivo Excel (.xlsx) con un clic.'
  },
  {
    id: 'plans-earnings',
    shortTitle: 'Planes PRO, Comisiones y Retiros',
    title: 'Membresías PRO, Comisiones y Panel de Ganancias',
    icon: 'lucide:wallet',
    intro: 'Controla tus métricas financieras en tiempo real desde la pestaña "Summary / Dashboard" y optimiza tu porcentaje de ganancia con los planes de Moments.',
    sections: [
      {
        heading: '6.1 Comparativa de Planes para Fotógrafos',
        body: 'Puedes consultar o actualizar tu plan en cualquier momento:',
        bullets: [
          'Plan Gratuito: Hasta 5 eventos activos simultáneos, 1.000 fotos y comisión de plataforma del 25% (tú recibes el 75%).',
          'Plan Básico PRO: Hasta 8 eventos simultáneos, 2.500 fotos, 3 álbumes privados VIP y comisión reducida al 20% (tú recibes el 80%).',
          'Plan Premium PRO: Eventos y fotos ilimitadas, álbumes privados ilimitados, marca de agua con tu propio logo y comisión mínima del 15% (tú recibes el 85% de cada venta).',
          'Beneficio de Bienvenida: Todos los fotógrafos pueden activar 3 Meses de Plan Premium 100% Gratis desde el banner de bienvenida o en la página de suscripción.'
        ]
      },
      {
        heading: '6.2 Historial de Fotos Vendidas y Billetera',
        body: 'En "Summary / Dashboard" puedes filtrar tus ventas por fecha (Hoy, Últimos 7 días, Últimos 30 días o rango personalizado), ver quién compró cada foto, cuánto ganaste neto y gestionar tu saldo disponible.'
      }
    ],
    keyRule: 'Ante cualquier duda con un pago, plan o álbum, contáctanos desde el botón de Soporte o escribe directamente a @mastermoments en el Chat.'
  }
]

const filteredTutorials = computed(() => {
  return tutorials.filter((tut) => {
    const matchesCat = selectedCategory.value === 'ALL' || tut.category === selectedCategory.value
    if (!matchesCat) return false
    if (!searchQuery.value.trim()) return true
    const q = searchQuery.value.trim().toLowerCase()
    const inSteps = tut.steps.some(
      (s) => s.title.toLowerCase().includes(q) || s.detail.toLowerCase().includes(q)
    )
    return (
      tut.title.toLowerCase().includes(q) ||
      tut.summary.toLowerCase().includes(q) ||
      tut.categoryLabel.toLowerCase().includes(q) ||
      inSteps
    )
  })
})

const filteredManualChapters = computed(() => {
  if (!searchQuery.value.trim()) return manualChapters
  const q = searchQuery.value.trim().toLowerCase()
  return manualChapters.filter((ch) => {
    const inSections = ch.sections.some(
      (s) =>
        s.heading.toLowerCase().includes(q) ||
        s.body.toLowerCase().includes(q) ||
        (s.bullets && s.bullets.some((b) => b.toLowerCase().includes(q)))
    )
    return (
      ch.title.toLowerCase().includes(q) ||
      ch.intro.toLowerCase().includes(q) ||
      inSections
    )
  })
})

const scrollToChapter = (chapterId: string) => {
  activeChapterId.value = chapterId
  if (typeof document !== 'undefined') {
    const el = document.getElementById(`chapter-${chapterId}`)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}

const openChapterInManual = (chapterId: string) => {
  searchQuery.value = ''
  activeSection.value = 'manual'
  nextTick(() => {
    scrollToChapter(chapterId)
  })
}

const printManual = () => {
  if (typeof window !== 'undefined') {
    window.print()
  }
}
</script>
