<template>
  <ClientOnly>
    <Teleport to="body">
      <Transition name="announcement-fade">
        <div
          v-if="isOpen && activeAnnouncement"
          class="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm"
          @click.self="dismiss"
        >
          <div
            role="dialog"
            aria-modal="true"
            :aria-label="activeAnnouncement.title"
            class="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[92vh] animate-announcement-pop"
          >
            <!-- Hero con imagen real -->
            <div class="relative h-44 sm:h-52 w-full bg-slate-900 shrink-0 overflow-hidden">
              <img
                :src="activeAnnouncement.imageUrl"
                :alt="activeAnnouncement.imageAlt || activeAnnouncement.title"
                class="w-full h-full object-cover object-center"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/35 to-black/25"></div>

              <!-- Botón cerrar -->
              <button
                type="button"
                @click="dismiss"
                aria-label="Cerrar anuncio"
                class="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-black/45 hover:bg-black/70 text-white backdrop-blur-md flex items-center justify-center transition-colors cursor-pointer"
              >
                <Icon name="lucide:x" class="w-4 h-4" />
              </button>

              <!-- Badge + Título sobre la imagen -->
              <div class="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white">
                <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#3ef4a1]/20 border border-[#3ef4a1]/45 text-[#3ef4a1] text-[10px] font-black uppercase tracking-wider backdrop-blur-sm mb-2">
                  {{ activeAnnouncement.badge }}
                </span>
                <h3 class="text-lg sm:text-xl font-black leading-snug tracking-tight">
                  {{ activeAnnouncement.title }}
                </h3>
              </div>
            </div>

            <!-- Contenido scrollable -->
            <div class="p-5 sm:p-6 space-y-4 overflow-y-auto">
              <p class="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {{ activeAnnouncement.subtitle }}
              </p>

              <!-- Lista de consejos -->
              <div class="space-y-2.5">
                <div
                  v-for="(tip, idx) in activeAnnouncement.tips"
                  :key="idx"
                  class="flex items-start gap-3 p-3 rounded-2xl bg-gray-50/90 border border-gray-100"
                >
                  <div class="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon :name="tip.icon" class="w-4 h-4" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-extrabold text-gray-900 leading-snug">
                      {{ tip.title }}
                    </p>
                    <p class="text-[11px] sm:text-xs text-gray-500 leading-relaxed mt-0.5">
                      {{ tip.description }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Enlace rápido del perfil para copiar y pegar en Instagram -->
              <div
                v-if="activeAnnouncement.showProfileLinkCopy && publicProfileUrl"
                class="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50/90 to-indigo-50/70 border border-emerald-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
              >
                <div class="min-w-0">
                  <p class="text-[10px] font-black uppercase tracking-wider text-emerald-700">
                    Tu enlace listo para Instagram
                  </p>
                  <p class="text-xs font-bold text-gray-800 truncate">
                    {{ publicProfileUrl }}
                  </p>
                </div>
                <button
                  type="button"
                  @click="copyProfileUrl"
                  class="px-3.5 py-2 rounded-xl bg-gray-900 hover:bg-emerald-600 text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                >
                  <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="w-3.5 h-3.5" />
                  <span>{{ copied ? '¡Copiado!' : 'Copiar link' }}</span>
                </button>
              </div>
            </div>

            <!-- Footer de acciones -->
            <div class="px-5 sm:px-6 py-4 border-t border-gray-100 bg-gray-50/80 flex flex-col-reverse sm:flex-row items-center justify-between gap-2.5 shrink-0">
              <button
                type="button"
                @click="dismiss"
                class="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-100 text-gray-700 text-xs font-bold transition-colors cursor-pointer"
              >
                {{ activeAnnouncement.secondaryCtaLabel || 'Entendido' }}
              </button>

              <button
                v-if="activeAnnouncement.primaryCta"
                type="button"
                @click="handlePrimaryCta"
                class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold inline-flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98] cursor-pointer"
              >
                <span>{{ activeAnnouncement.primaryCta.label }}</span>
                <Icon name="lucide:arrow-right" class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { CLIENT_ANNOUNCEMENTS, type ClientAnnouncement } from '~/data/clientAnnouncements'

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()
const toast = useToast()

const isOpen = ref(false)
const activeAnnouncement = ref<ClientAnnouncement | null>(null)
const copied = ref(false)
let showTimer: ReturnType<typeof setTimeout> | null = null

const STORAGE_PREFIX = 'moments_seen_announcements_v1_'

const userStorageKey = computed(() => {
  const uid = authStore.user?.id || authStore.user?.username || authStore.user?.email
  return uid ? `${STORAGE_PREFIX}${uid}` : null
})

const publicProfileUrl = computed(() => {
  const username = authStore.user?.username
  if (!username) return ''
  const origin = process.client ? window.location.origin : 'https://www.moments-gallery.com'
  return `${origin}/profile/${username}`
})

function getSeenIds(): string[] {
  if (!process.client || !userStorageKey.value) return []
  try {
    const raw = localStorage.getItem(userStorageKey.value)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function markAsSeen(id: string) {
  if (!process.client || !userStorageKey.value) return
  try {
    const current = getSeenIds()
    if (!current.includes(id)) {
      current.push(id)
      localStorage.setItem(userStorageKey.value, JSON.stringify(current))
    }
  } catch {
    // Ignore storage quota errors
  }
}

function matchesAudience(announcement: ClientAnnouncement): boolean {
  if (announcement.audience === 'all') return true
  if (announcement.audience === 'photographer') return authStore.isPhotographer
  if (announcement.audience === 'customer') {
    return authStore.isCustomer && !authStore.isPhotographer && !authStore.isAdmin
  }
  return false
}

function checkAnnouncements() {
  if (!process.client) return
  if (!authStore.isAuthenticated || !authStore.user || !userStorageKey.value) {
    isOpen.value = false
    activeAnnouncement.value = null
    return
  }

  // No interrumpir pantallas de login, registro o completar perfil
  const skipPaths = ['/login', '/register', '/complete-profile', '/forgot-password', '/reset-password']
  if (skipPaths.some(p => route.path.startsWith(p))) return

  const seenIds = getSeenIds()
  const next = CLIENT_ANNOUNCEMENTS.find(
    a => a.active && matchesAudience(a) && !seenIds.includes(a.id)
  )

  if (!next) return

  if (showTimer) clearTimeout(showTimer)
  showTimer = setTimeout(() => {
    if (!authStore.isAuthenticated) return
    // Revalidar por si otra pestaña lo cerró
    if (getSeenIds().includes(next.id)) return
    activeAnnouncement.value = next
    isOpen.value = true
  }, 600)
}

function dismiss() {
  if (activeAnnouncement.value) {
    markAsSeen(activeAnnouncement.value.id)
  }
  isOpen.value = false
}

function handlePrimaryCta() {
  const target = activeAnnouncement.value?.primaryCta?.to
  dismiss()
  if (target) {
    router.push(target)
  }
}

async function copyProfileUrl() {
  if (!publicProfileUrl.value || !process.client) return
  try {
    await navigator.clipboard.writeText(publicProfileUrl.value)
    copied.value = true
    toast.success('¡Enlace copiado!', 'Pégalo en tu bio o historias de Instagram para mostrar tu galería.')
    setTimeout(() => {
      copied.value = false
    }, 2500)
  } catch {
    toast.info('Tu enlace', publicProfileUrl.value)
  }
}

watch(
  () => [authStore.isAuthenticated, authStore.user?.id, route.path],
  () => {
    checkAnnouncements()
  }
)

onMounted(() => {
  checkAnnouncements()
})

onUnmounted(() => {
  if (showTimer) clearTimeout(showTimer)
})
</script>

<style scoped>
.announcement-fade-enter-active,
.announcement-fade-leave-active {
  transition: opacity 0.25s ease;
}
.announcement-fade-enter-from,
.announcement-fade-leave-to {
  opacity: 0;
}

@keyframes announcementPop {
  from {
    opacity: 0;
    transform: translateY(12px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.animate-announcement-pop {
  animation: announcementPop 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
