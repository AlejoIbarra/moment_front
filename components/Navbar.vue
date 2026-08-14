<template>
  <nav class="bg-white shadow">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center cursor-pointer group gap-2" @click="router.push('/')">
            <img src="/logo.png" alt="Moments Logo" class="h-8 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
            <h1
              class="text-2xl font-black tracking-tighter italic bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300">
              Moments
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



            <!-- Shopping Cart Button -->
            <div v-if="authStore.isCustomer" class="relative">
              <button @click="showCart = !showCart" class="relative text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-50 transition-colors">
                <Icon name="lucide:shopping-cart" class="w-5 h-5" />
                <span v-if="cartStore.items.length > 0" class="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-[9px] font-extrabold text-white rounded-full flex items-center justify-center animate-pulse">
                  {{ cartStore.items.length }}
                </span>
              </button>
            </div>

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

  <!-- Cart Drawer -->
  <div v-if="showCart" class="fixed inset-0 z-50 overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
    <div class="absolute inset-0 overflow-hidden">
      <!-- Background backdrop -->
      <div @click="showCart = false" class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fade-in" aria-hidden="true"></div>

      <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div class="pointer-events-auto w-screen max-w-md animate-slide-in">
          <div class="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
            <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              <div class="flex items-start justify-between">
                <h2 class="text-lg font-bold text-gray-900" id="slide-over-title">Carrito de Compras 🛒</h2>
                <div class="ml-3 flex h-7 items-center">
                  <button @click="showCart = false" type="button" class="relative -m-2 p-2 text-gray-400 hover:text-gray-500">
                    <span class="sr-only">Close panel</span>
                    <Icon name="lucide:x" class="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div class="mt-8">
                <div class="flow-root">
                  <ul role="list" class="-my-6 divide-y divide-gray-200">
                    <li v-for="item in cartStore.items" :key="item.id" class="flex py-6">
                      <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                        <img :src="item.type === 'package' ? (item.photos[0]?.watermarkedR2Url || item.photos[0]?.watermarkedUrl) : (item.watermarkedR2Url || item.watermarkedUrl)" alt="Item image" class="h-full w-full object-cover object-center" />
                      </div>

                      <div class="ml-4 flex flex-1 flex-col">
                        <div>
                          <div class="flex justify-between text-base font-semibold text-gray-900">
                            <h3 class="text-sm font-bold text-gray-900">
                              {{ item.type === 'package' ? `Paquete: ${item.package.name}` : `Foto #${item.id}` }}
                            </h3>
                            <p class="ml-4 text-sm font-bold text-indigo-600">${{ Number(item.price).toLocaleString('es-CO') }}</p>
                          </div>
                          <p class="mt-1 text-[11px] text-gray-500">Fotógrafo: {{ item.event?.photographer?.username || 'Asignado' }}</p>
                          <p class="mt-0.5 text-[11px] text-gray-500">
                            {{ item.type === 'package' ? `${item.photos.length} fotos seleccionadas` : `Evento: ${item.event?.title || 'Galería'}` }}
                          </p>
                        </div>
                        <div class="flex flex-1 items-end justify-between text-sm">
                          <button @click="cartStore.removeFromCart(item.id)" type="button" class="font-bold text-red-500 hover:text-red-700 text-xs flex items-center gap-1">
                            <Icon name="lucide:trash-2" class="w-3.5 h-3.5" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div v-if="cartStore.items.length === 0" class="text-center py-16 text-gray-400">
                    <Icon name="lucide:shopping-cart" class="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p class="text-sm font-medium">Tu carrito está vacío.</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="cartStore.items.length > 0" class="border-t border-gray-200 px-4 py-6 sm:px-6 bg-gray-50/50">
              <!-- Coupon input -->
              <div class="mb-4">
                <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Código de Regalo / Promocional</label>
                <div class="flex gap-2">
                  <input v-model="cartStore.giftCardCode" type="text" placeholder="Ej: GFT-XXXX" class="flex-1 min-w-0 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white" />
                </div>
              </div>

              <div class="flex justify-between text-base font-semibold text-gray-900 border-t border-gray-100 pt-4">
                <p>Subtotal</p>
                <p>${{ cartStore.subtotal.toLocaleString('es-CO') }}</p>
              </div>
              <p class="mt-1 text-[10px] text-gray-400">El cargo final e impuestos de plataforma se aplican al pagar.</p>
              <div class="mt-6">
                <button @click="handleCartCheckout" :disabled="cartStore.loading" class="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg hover:bg-indigo-700 transition-colors disabled:opacity-50">
                  {{ cartStore.loading ? 'Procesando...' : 'Pagar Ahora' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { useWalletStore } from '~/stores/wallet'
import { useCartStore } from '~/stores/cart'
import { useRouter } from 'vue-router'
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()
const walletStore = useWalletStore()
const cartStore = useCartStore()
const router = useRouter()
const config = useRuntimeConfig()
const toast = useToast()
const { t, locale: currentLocale, locales, setLocale } = useI18n()

const showCart = ref(false)

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

async function handleCartCheckout() {
  if (!authStore.isAuthenticated) {
    toast.warning('Inicia sesión', 'Debes iniciar sesión para comprar.')
    router.push('/login?redirect=' + window.location.pathname)
    return
  }

  try {
    const data = await cartStore.checkout()

    if (data.fullyCovered) {
      toast.success('Compra exitosa', 'Las fotos han sido adquiridas exitosamente.')
      cartStore.clearCart()
      showCart.value = false
      router.push('/dashboard/customer')
      return
    }

    if (typeof window !== 'undefined' && window.WidgetCheckout) {
      const checkoutOptions = {
        publicKey: data.publicKey,
        currency: data.currency,
        amountInCents: data.amountInCents,
        reference: data.reference,
        redirectUrl: window.location.origin + '/payment/success',
        customerData: { email: data.customerEmail }
      }

      if (data.signature) checkoutOptions.signature = { integrity: data.signature }

      const checkout = new window.WidgetCheckout(checkoutOptions)
      checkout.open((res) => {
        const transaction = res.transaction
        if (transaction.status === 'APPROVED') {
          toast.success('Pago aprobado', 'Tus fotos se están activando.')
          cartStore.clearCart()
          showCart.value = false
          router.push('/dashboard/customer')
        }
      })
    } else {
      toast.error('Error', 'La pasarela de pago no se pudo cargar. Intenta de nuevo.')
    }
  } catch (error) {
    toast.error('Error al pagar', error.response?._data?.error || error.message || 'No se pudo iniciar la transacción.')
  }
}
</script>
