<template>
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center cursor-pointer group" @click="router.push('/')">
            <h1
              class="text-2xl font-black tracking-tighter italic bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              Moment
            </h1>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8" v-if="authStore.isAuthenticated">
            <NuxtLink v-if="authStore.isCustomer" to="/marketplace"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              {{ $t('navbar.marketplace') }}
            </NuxtLink>
            <NuxtLink v-if="authStore.isCustomer" to="/dashboard/customer"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              {{ $t('navbar.my_profile') }}
            </NuxtLink>
            <NuxtLink v-if="authStore.isPhotographer" to="/dashboard/photographer"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              {{ $t('navbar.dashboard') }}
            </NuxtLink>
            <NuxtLink to="/wallet"
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
              {{ $t('navbar.billetera') }}
            </NuxtLink>
          </div>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <div v-if="authStore.isAuthenticated" class="flex items-center gap-4">
            <!-- Language Switcher -->
            <div class="flex items-center gap-1 bg-gray-50 rounded-lg p-1 mr-2 border border-gray-100">
              <button v-for="locale in locales" :key="locale.code" @click="setLocale(locale.code)"
                :class="['px-2 py-1 text-xs font-bold rounded-md transition-all',
                  currentLocale === locale.code ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600']">
                {{ locale.code.toUpperCase() }}
              </button>
            </div>

            <NuxtLink to="/wallet"
              class="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full transition-colors group">
              <Icon name="lucide:wallet" class="w-4 h-4" />
              <span class="text-sm font-bold">${{ walletStore.balance.toFixed(2) }}</span>
              <Icon name="lucide:plus" class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </NuxtLink>

            <!-- Notifications Bell -->
            <div class="relative">
              <button @click="toggleNotifications" class="relative text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-50 transition-colors">
                <Icon name="lucide:bell" class="w-5 h-5" />
                <span v-if="unreadCount > 0" class="absolute top-1 right-1 w-4 h-4 bg-red-500 text-[9px] font-extrabold text-white rounded-full flex items-center justify-center animate-pulse">
                  {{ unreadCount }}
                </span>
              </button>

              <!-- Notifications Dropdown -->
              <div v-if="showNotifications" class="absolute right-0 mt-3 w-80 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-2 animate-scale-up">
                <div class="px-4 py-2 border-b border-gray-50 flex items-center justify-between">
                  <h4 class="font-bold text-gray-900 text-sm">Notificaciones</h4>
                  <button v-if="notifications.length > 0" @click="markAllAsRead" class="text-xs text-indigo-600 font-bold hover:underline">Marcar todo</button>
                </div>
                <div class="max-h-72 overflow-y-auto divide-y divide-gray-50">
                  <div v-if="notifications.length === 0" class="px-4 py-8 text-center text-gray-400 text-sm">
                    <Icon name="lucide:bell-off" class="w-8 h-8 mx-auto mb-1 opacity-40" />
                    <span>Sin notificaciones nuevas.</span>
                  </div>
                  <div
                    v-for="n in notifications"
                    :key="n.id"
                    @click="clickNotification(n)"
                    :class="['px-4 py-3 flex gap-3 hover:bg-gray-50/70 transition-colors cursor-pointer text-left', { 'bg-indigo-50/30': !n.read }]"
                  >
                    <div class="w-8 h-8 rounded-full overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <img v-if="n.senderProfilePhoto" :src="n.senderProfilePhoto" class="w-full h-full object-cover" />
                      <Icon v-else name="lucide:user" class="text-gray-300 w-4 h-4" />
                    </div>
                    <div class="flex-1 min-w-0">
                      <p class="text-xs text-gray-700 font-medium break-words">{{ n.message }}</p>
                      <span class="text-[9px] text-gray-400 block mt-0.5">{{ formatTimeAgo(n.createdAt) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <NuxtLink
              :to="authStore.isPhotographer ? `/photographers/${authStore.user?.username}` : `/profile/${authStore.user?.username}`"
              class="flex items-center space-x-2 border-l border-gray-200 pl-4 hover:opacity-80 transition-opacity">
              <div v-if="authStore.user?.profilePhotoUrl"
                class="w-8 h-8 rounded-full overflow-hidden border border-gray-200">
                <img :src="authStore.user.profilePhotoUrl" alt="Profile" class="w-full h-full object-cover">
              </div>
              <div v-else
                class="w-8 h-8 rounded-full bg-indigo-50 border border-gray-100 flex items-center justify-center">
                <span class="text-xs font-bold text-indigo-600">{{ authStore.user?.username?.charAt(0).toUpperCase() ||
                  'U' }}</span>
              </div>
              <span class="text-sm text-gray-500 hidden md:inline">{{ authStore.user?.username }}</span>
            </NuxtLink>
            <button @click="logout" class="text-gray-400 hover:text-gray-600 p-1" title="Logout">
              <Icon name="lucide:log-out" class="w-5 h-5" />
            </button>
          </div>
          <div v-else class="flex gap-4 items-center">
            <!-- Language Switcher for guests -->
            <div class="flex items-center gap-1 mr-2">
              <button v-for="locale in locales" :key="locale.code" @click="setLocale(locale.code)" :class="['text-xs font-bold uppercase transition-all px-2',
                currentLocale === locale.code ? 'text-indigo-600 underline' : 'text-gray-400 hover:text-gray-600']">
                {{ locale.code }}
              </button>
            </div>
            <NuxtLink to="/login" class="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">{{
              $t('common.login') }}</NuxtLink>
            <NuxtLink to="/register"
              class="bg-indigo-600 text-white hover:bg-indigo-700 px-4 py-2 rounded-xl text-sm font-medium shadow-lg shadow-indigo-100">
              {{ $t('common.register') }}</NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { useWalletStore } from '~/stores/wallet'
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()
const walletStore = useWalletStore()
const router = useRouter()
const config = useRuntimeConfig()
const { t, locale: currentLocale, locales, setLocale } = useI18n()

// Notifications
const showNotifications = ref(false)
const notifications = ref([])
const unreadCount = ref(0)

function toggleNotifications() {
  showNotifications.value = !showNotifications.value
  if (showNotifications.value) {
    fetchNotifications()
  }
}

async function fetchNotifications() {
  if (!authStore.isAuthenticated) return
  try {
    const data = await $fetch(`${config.public.apiBase}/notifications`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    notifications.value = data
  } catch (error) {
    console.error('Error fetching notifications:', error)
  }
}

async function fetchUnreadCount() {
  if (!authStore.isAuthenticated) return
  try {
    const count = await $fetch(`${config.public.apiBase}/notifications/unread-count`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    unreadCount.value = count
  } catch (error) {
    console.error('Error fetching unread count:', error)
  }
}

async function clickNotification(n) {
  if (!n.read) {
    try {
      await $fetch(`${config.public.apiBase}/notifications/${n.id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${authStore.token}` }
      })
      n.read = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    } catch (error) {
      console.error(error)
    }
  }
  showNotifications.value = false
  // Redirect based on type
  if (n.type === 'FOLLOW') {
    router.push(`/profile/${n.senderUsername}`)
  } else {
    router.push('/dashboard/photographer')
  }
}

async function markAllAsRead() {
  try {
    await $fetch(`${config.public.apiBase}/notifications/read-all`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    notifications.value.forEach(n => n.read = true)
    unreadCount.value = 0
  } catch (error) {
    console.error(error)
  }
}

function formatTimeAgo(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  const seconds = Math.floor((new Date() - date) / 1000)
  
  let interval = Math.floor(seconds / 31536000)
  if (interval >= 1) return `hace ${interval} año` + (interval > 1 ? 's' : '')
  interval = Math.floor(seconds / 2592000)
  if (interval >= 1) return `hace ${interval} mes` + (interval > 1 ? 'es' : '')
  interval = Math.floor(seconds / 86400)
  if (interval >= 1) return `hace ${interval} día` + (interval > 1 ? 's' : '')
  interval = Math.floor(seconds / 3600)
  if (interval >= 1) return `hace ${interval} hora` + (interval > 1 ? 's' : '')
  interval = Math.floor(seconds / 60)
  if (interval >= 1) return `hace ${interval} minuto` + (interval > 1 ? 's' : '')
  return 'hace unos segundos'
}

let socket = null

function connectWebSocket() {
  if (!authStore.isAuthenticated || !authStore.token) return
  if (socket) {
    socket.close()
  }

  const base = config.public.apiBase
  const wsProto = base.startsWith('https') ? 'wss' : 'ws'
  const host = base.replace(/^https?:\/\//, '').split('/')[0]
  const wsUrl = `${wsProto}://${host}/ws-notifications?token=${authStore.token}`

  socket = new WebSocket(wsUrl)

  socket.onmessage = (event) => {
    try {
      const newNotification = JSON.parse(event.data)
      notifications.value.unshift(newNotification)
      unreadCount.value++
    } catch (e) {
      console.error('Failed to parse WebSocket notification:', e)
    }
  }

  socket.onclose = () => {
    if (authStore.isAuthenticated) {
      setTimeout(connectWebSocket, 5000)
    }
  }

  socket.onerror = (err) => {
    console.error('WebSocket connection error:', err)
  }
}

onMounted(async () => {
  if (authStore.isAuthenticated) {
    await walletStore.fetchBalance()
    await fetchUnreadCount()
    connectWebSocket()
  }
})

onUnmounted(() => {
  if (socket) {
    socket.close()
  }
})

function logout() {
  if (socket) {
    socket.close()
  }
  authStore.logout()
  router.push('/login')
}
</script>
