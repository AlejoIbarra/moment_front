<template>
  <div class="relative" ref="bellContainerRef">
    <!-- Notification Bell Button -->
    <button
      @click="toggleDropdown"
      class="relative p-2 rounded-full text-gray-700 hover:text-black hover:bg-gray-100 transition-all duration-200 active:scale-95 group focus:outline-none cursor-pointer"
      :class="{ 'bg-gray-100 text-black': notifStore.isDropdownOpen }"
      title="Notificaciones"
      aria-label="Ver notificaciones"
    >
      <Icon
        name="lucide:bell"
        class="w-6 h-6 transition-transform group-hover:rotate-12 duration-200"
        :class="{ 'text-indigo-600': notifStore.unreadCount > 0 }"
      />

      <!-- Instagram / Facebook Style Red Unread Badge -->
      <transition name="badge-pop">
        <span
          v-if="notifStore.unreadCount > 0"
          class="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-gradient-to-r from-rose-500 to-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-md shadow-red-500/30 border-2 border-white animate-pulse pointer-events-none"
        >
          {{ notifStore.unreadCount > 99 ? '99+' : notifStore.unreadCount }}
        </span>
      </transition>
    </button>

    <!-- Dropdown Panel (Instagram / Facebook Web Style) -->
    <transition name="dropdown-fade">
      <div
        v-if="notifStore.isDropdownOpen"
        class="fixed inset-x-2 top-16 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 w-auto sm:w-[410px] max-w-[calc(100vw-16px)] bg-white/95 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-2xl shadow-black/15 z-50 overflow-hidden ring-1 ring-black/5"
      >
        <!-- Header -->
        <div class="px-5 py-3.5 border-b border-gray-100/80 bg-gray-50/50 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <h3 class="font-extrabold text-gray-900 text-base tracking-tight">Notificaciones</h3>
            <span
              v-if="notifStore.unreadCount > 0"
              class="px-2 py-0.5 bg-rose-50 border border-rose-200/60 text-rose-600 text-[10px] font-black rounded-full"
            >
              {{ notifStore.unreadCount }} nueva{{ notifStore.unreadCount > 1 ? 's' : '' }}
            </span>
          </div>

          <!-- Mark All As Read Button -->
          <button
            v-if="notifStore.notifications.length > 0 && notifStore.unreadCount > 0"
            @click="handleMarkAllAsRead"
            class="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1 hover:underline cursor-pointer"
            title="Marcar todas como leídas"
          >
            <Icon name="lucide:check-check" class="w-3.5 h-3.5" />
            <span>Marcar todas</span>
          </button>
        </div>

        <!-- Filter Tabs: Todas vs No leídas -->
        <div class="px-4 py-2 border-b border-gray-100 bg-white flex items-center gap-2 text-xs font-bold">
          <button
            @click="notifStore.activeFilter = 'all'"
            :class="[
              'px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer',
              notifStore.activeFilter === 'all'
                ? 'bg-black text-white shadow-xs'
                : 'text-gray-500 hover:bg-gray-100'
            ]"
          >
            <span>Todas</span>
            <span class="text-[10px] opacity-80">({{ notifStore.notifications.length }})</span>
          </button>

          <button
            @click="notifStore.activeFilter = 'unread'"
            :class="[
              'px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer',
              notifStore.activeFilter === 'unread'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-gray-500 hover:bg-gray-100'
            ]"
          >
            <span>No leídas</span>
            <span
              class="text-[10px] px-1.5 py-0.2 rounded-full"
              :class="notifStore.activeFilter === 'unread' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'"
            >
              {{ notifStore.unreadCount }}
            </span>
          </button>
        </div>

        <!-- Notification List -->
        <div class="max-h-[380px] overflow-y-auto divide-y divide-gray-50 overscroll-contain">
          <!-- Loading State -->
          <div v-if="notifStore.isLoading && notifStore.notifications.length === 0" class="py-12 text-center text-gray-400">
            <Icon name="lucide:loader-2" class="w-6 h-6 mx-auto animate-spin text-indigo-500 mb-2" />
            <span class="text-xs font-medium">Cargando notificaciones...</span>
          </div>

          <!-- Empty State -->
          <div
            v-else-if="notifStore.filteredNotifications.length === 0"
            class="py-12 px-6 text-center text-gray-400 flex flex-col items-center justify-center"
          >
            <div class="w-12 h-12 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center mb-3 text-gray-300 shadow-2xs">
              <Icon
                :name="notifStore.activeFilter === 'unread' ? 'lucide:sparkles' : 'lucide:bell-off'"
                class="w-6 h-6"
              />
            </div>
            <p class="text-sm font-bold text-gray-800">
              {{ notifStore.activeFilter === 'unread' ? '¡Estás al día!' : 'Sin notificaciones' }}
            </p>
            <p class="text-xs text-gray-400 mt-1 max-w-[240px]">
              {{ notifStore.activeFilter === 'unread'
                ? 'No tienes notificaciones pendientes por leer.'
                : 'Aquí aparecerán las compras de tus fotos, nuevos seguidores y comentarios.' }}
            </p>
          </div>

          <!-- Notification Items -->
          <div
            v-for="n in notifStore.filteredNotifications"
            :key="'notif-' + n.id"
            @click="handleNotificationClick(n)"
            :class="[
              'group px-4 py-3.5 flex items-start gap-3 transition-all cursor-pointer relative text-left',
              isItemUnread(n)
                ? 'bg-gradient-to-r from-indigo-50/50 via-emerald-50/30 to-white hover:bg-indigo-50/70'
                : 'bg-white hover:bg-gray-50/80'
            ]"
          >
            <!-- Avatar with Action Type Icon Badge -->
            <div class="relative flex-shrink-0 mt-0.5">
              <div class="w-10 h-10 rounded-full overflow-hidden border border-gray-100 bg-gray-100 flex items-center justify-center">
                <img
                  v-if="n.senderProfilePhoto"
                  :src="n.senderProfilePhoto"
                  :alt="n.senderUsername || 'Usuario'"
                  class="w-full h-full object-cover"
                />
                <Icon v-else name="lucide:user" class="text-gray-400 w-5 h-5" />
              </div>

              <!-- Type Badge Overlay -->
              <span
                class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white shadow-xs border-2 border-white"
                :class="getTypeBadgeClass(n.type)"
                :title="getTypeBadgeTitle(n.type)"
              >
                <Icon :name="getTypeBadgeIcon(n.type)" class="w-2.5 h-2.5" />
              </span>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0 pr-6">
              <!-- Message Text -->
              <p
                class="text-xs text-gray-800 leading-snug break-words"
                :class="{ 'font-semibold': isItemUnread(n) }"
                v-html="formatMessage(n.message)"
              ></p>

              <!-- Timestamp and Type Pill -->
              <div class="flex items-center gap-2 mt-1.5">
                <span class="text-[10px] text-gray-400 font-medium">
                  {{ formatTimeAgo(n.createdAt) }}
                </span>
                <span
                  v-if="n.type === 'PURCHASE'"
                  class="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                >
                  Venta
                </span>
              </div>
            </div>

            <!-- Right-Side Indicators & Actions -->
            <div class="flex items-center gap-1.5 self-center">
              <!-- Unread Blue Dot (Instagram / Facebook Style) -->
              <span
                v-if="isItemUnread(n)"
                class="w-2.5 h-2.5 bg-indigo-600 rounded-full ring-4 ring-indigo-100 flex-shrink-0"
                title="No leída"
              ></span>

              <!-- Action buttons on hover (Desktop) -->
              <div class="hidden group-hover:flex items-center gap-1 transition-opacity">
                <button
                  v-if="isItemUnread(n)"
                  @click.stop="handleMarkSingleRead(n)"
                  class="p-1 text-gray-400 hover:text-indigo-600 rounded-full hover:bg-indigo-50 transition-colors"
                  title="Marcar como leída"
                >
                  <Icon name="lucide:check" class="w-3.5 h-3.5" />
                </button>
                <button
                  @click.stop="handleDeleteNotification(n)"
                  class="p-1 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors"
                  title="Eliminar notificación"
                >
                  <Icon name="lucide:trash-2" class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer: Test Notification & Status -->
        <div class="p-3 bg-gray-50/70 border-t border-gray-100 flex items-center justify-between text-xs">
          <button
            @click="handleTestPurchase"
            :disabled="isTesting"
            class="text-[11px] font-bold text-gray-500 hover:text-indigo-600 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            title="Simular compra de foto para probar notificación"
          >
            <Icon name="lucide:sparkles" class="w-3 h-3 text-amber-500" />
            <span>{{ isTesting ? 'Simulando...' : '🔔 Probar compra de foto' }}</span>
          </button>

          <span class="text-[10px] text-gray-400">
            Tiempo real activo
          </span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import { useNotificationsStore, type NotificationItem } from '~/stores/notifications'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const notifStore = useNotificationsStore()
const authStore = useAuthStore()

const bellContainerRef = ref<HTMLElement | null>(null)
const isTesting = ref(false)

// Close dropdown on click outside
onClickOutside(bellContainerRef, () => {
  notifStore.isDropdownOpen = false
})

function toggleDropdown() {
  notifStore.isDropdownOpen = !notifStore.isDropdownOpen
  if (notifStore.isDropdownOpen) {
    notifStore.fetchNotifications()
  }
}

function isItemUnread(n: NotificationItem): boolean {
  return !n.isRead && !n.read
}

function getTypeBadgeClass(type: string): string {
  switch (type) {
    case 'PURCHASE':
      return 'bg-gradient-to-tr from-emerald-500 to-green-600'
    case 'LIKE_PHOTO':
    case 'LIKE_EVENT':
      return 'bg-gradient-to-tr from-rose-500 to-pink-600'
    case 'COMMENT':
      return 'bg-gradient-to-tr from-blue-500 to-indigo-600'
    case 'FOLLOW':
      return 'bg-gradient-to-tr from-purple-500 to-violet-600'
    default:
      return 'bg-gradient-to-tr from-gray-500 to-slate-600'
  }
}

function getTypeBadgeIcon(type: string): string {
  switch (type) {
    case 'PURCHASE':
      return 'lucide:badge-dollar-sign'
    case 'LIKE_PHOTO':
    case 'LIKE_EVENT':
      return 'lucide:heart'
    case 'COMMENT':
      return 'lucide:message-circle'
    case 'FOLLOW':
      return 'lucide:user-plus'
    default:
      return 'lucide:bell'
  }
}

function getTypeBadgeTitle(type: string): string {
  switch (type) {
    case 'PURCHASE':
      return 'Compra realizada'
    case 'LIKE_PHOTO':
    case 'LIKE_EVENT':
      return 'Me gusta'
    case 'COMMENT':
      return 'Nuevo comentario'
    case 'FOLLOW':
      return 'Nuevo seguidor'
    default:
      return 'Notificación'
  }
}

// Format @usernames and highlights smoothly
function formatMessage(message: string): string {
  if (!message) return ''
  // Escape HTML characters
  let safe = message
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

  // Bold @mentions
  safe = safe.replace(/(@[a-zA-Z0-9_.-]+)/g, '<span class="font-bold text-gray-900">$1</span>')
  
  // Highlight amounts like $25,000 COP
  safe = safe.replace(/(\$[\d,.]+ ?(?:COP)?)/g, '<span class="font-bold text-emerald-600">$1</span>')

  return safe
}

// Relative time formatting in Spanish
function formatTimeAgo(dateString: string): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 45) return 'justo ahora'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `hace ${minutes} min`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours} h`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'ayer'
  if (days < 30) return `hace ${days} d`
  const months = Math.floor(days / 30)
  if (months < 12) return `hace ${months} mes${months > 1 ? 'es' : ''}`
  const years = Math.floor(months / 12)
  return `hace ${years} año${years > 1 ? 's' : ''}`
}

// Handle notification item click
async function handleNotificationClick(n: NotificationItem) {
  // If unread, mark it as read immediately
  if (isItemUnread(n)) {
    await notifStore.markAsRead(n.id)
  }
  notifStore.isDropdownOpen = false

  // Navigate based on type
  if (n.type === 'PURCHASE') {
    if (authStore.isPhotographer) {
      router.push('/dashboard/photographer')
    } else {
      router.push('/wallet')
    }
  } else if (n.type === 'FOLLOW') {
    if (n.senderUsername) {
      router.push(`/profile/${n.senderUsername}`)
    }
  } else if (n.type === 'COMMENT' || n.type === 'LIKE_PHOTO') {
    if (n.relatedId) {
      router.push('/marketplace')
    } else {
      router.push('/marketplace')
    }
  } else {
    router.push('/marketplace')
  }
}

async function handleMarkSingleRead(n: NotificationItem) {
  await notifStore.markAsRead(n.id)
}

async function handleDeleteNotification(n: NotificationItem) {
  await notifStore.deleteNotification(n.id)
}

async function handleMarkAllAsRead() {
  await notifStore.markAllAsRead()
}

async function handleTestPurchase() {
  if (isTesting.value) return
  isTesting.value = true
  try {
    await notifStore.sendTestPurchase()
  } finally {
    isTesting.value = false
  }
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    notifStore.startSync()
  }
})

onUnmounted(() => {
  notifStore.stopSync()
})
</script>

<style scoped>
.badge-pop-enter-active,
.badge-pop-leave-active {
  transition: all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.badge-pop-enter-from,
.badge-pop-leave-to {
  transform: scale(0);
  opacity: 0;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s ease-out;
}
.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}
</style>
