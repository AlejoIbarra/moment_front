<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Loading -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
    </div>

    <!-- Profile Header (Instagram Style) -->
    <div class="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 border-b border-gray-200 pb-12">
      <!-- Avatar -->
      <div class="relative group cursor-pointer shrink-0" @click="$refs.fileInput.click()">
        <div class="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#3ef4a1] p-1 transition-transform group-hover:scale-105">
          <div class="w-full h-full rounded-full bg-white p-1">
            <div class="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
              <img v-if="authStore.user?.profilePhotoUrl" :src="authStore.user.profilePhotoUrl" alt="Profile" class="w-full h-full object-cover">
              <Icon v-else name="lucide:user" class="w-16 h-16 text-gray-300" />
            </div>
          </div>
        </div>
        <div class="absolute inset-0 flex items-center justify-center bg-black/20 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
          <div class="flex flex-col items-center">
            <Icon name="lucide:camera" class="w-8 h-8 mb-1" />
            <span class="text-xs font-bold uppercase tracking-wider">Cambiar</span>
          </div>
        </div>
        <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onFileSelected" />
      </div>

      <!-- Info -->
      <div class="flex-1 text-center md:text-left mt-2">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div class="flex flex-col md:flex-row md:items-center gap-4">
            <h2 class="text-2xl font-light text-gray-800">{{ authStore.user?.username || 'Customer' }}</h2>
            <NuxtLink :to="`/profile/${authStore.user?.username}`" class="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2">
              <Icon name="lucide:external-link" class="w-4 h-4" />
              Ver Mi Perfil
            </NuxtLink>
          </div>
        </div>

        <div class="flex justify-center md:justify-start gap-8 mb-4 text-sm">
          <span><strong class="text-gray-900">{{ purchases.length }}</strong> {{ $t('dashboard.customer.purchases').toLowerCase() }}</span>
          <span><strong class="text-gray-900">Collector</strong> account</span>
        </div>

        <div class="text-sm">
          <p class="font-semibold text-gray-900">{{ $t('dashboard.customer.member_since') }} {{ new Date().getFullYear() }}</p>
          <div class="mt-1">
             <span v-if="authStore.user?.title" class="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-md mb-2">
                ✨ {{ authStore.user.title }}
             </span>
             <p class="text-gray-500 whitespace-pre-wrap">{{ authStore.user?.description || 'Descubriendo momentos increíbles a través de la lente.' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs (Instagram Style) -->
    <div class="flex justify-center gap-6 md:gap-12 border-t border-gray-200">
      <button @click="currentTab = 'purchases'" :class="['flex items-center gap-2 py-4 text-xs font-semibold uppercase tracking-widest border-t -mt-px transition-colors',
        currentTab === 'purchases' ? 'text-gray-900 border-gray-900' : 'text-gray-400 border-transparent']">
        <Icon name="lucide:grid" class="w-3 h-3" />
        {{ $t('dashboard.customer.purchases') }}
      </button>
      <button @click="currentTab = 'hidden'" :class="['flex items-center gap-2 py-4 text-xs font-semibold uppercase tracking-widest border-t -mt-px transition-colors',
        currentTab === 'hidden' ? 'text-gray-900 border-gray-900' : 'text-gray-400 border-transparent']">
        <Icon name="lucide:eye-off" class="w-3 h-3" />
        Ocultas
      </button>
      <button @click="currentTab = 'settings'" :class="['flex items-center gap-2 py-4 text-xs font-semibold uppercase tracking-widest border-t -mt-px transition-colors',
        currentTab === 'settings' ? 'text-gray-900 border-gray-900' : 'text-gray-400 border-transparent']">
        <Icon name="lucide:settings" class="w-3 h-3" />
        Configuración
      </button>
      <button @click="currentTab = 'subscription'" :class="['flex items-center gap-2 py-4 text-xs font-semibold uppercase tracking-widest border-t -mt-px transition-colors',
        currentTab === 'subscription' ? 'text-gray-900 border-gray-900' : 'text-gray-400 border-transparent']">
        <Icon name="lucide:sparkles" class="w-3 h-3" />
        Suscripción
      </button>
    </div>

    <!-- Content Area -->
    <div class="mt-8">
      <!-- Purchases Tab -->
      <div v-if="currentTab === 'purchases'">
        <div v-if="pendingPurchases" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>

        <div v-else-if="purchases.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
          <div class="w-20 h-20 rounded-full border-2 border-gray-900 flex items-center justify-center mb-4">
            <Icon name="lucide:camera" class="w-10 h-10 text-gray-900" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">{{ $t('dashboard.customer.no_photos') }}</h3>
          <p class="text-gray-500 mb-6">{{ $t('dashboard.customer.no_photos_desc') }}</p>
          <NuxtLink to="/marketplace" class="text-blue-500 font-semibold hover:text-blue-600 transition-colors">
            Explorar el Marketplace
          </NuxtLink>
        </div>

        <div v-else>
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-light text-gray-800">Tus Compras</h3>
            <div class="flex gap-2">
              <button v-if="!selectionMode" @click="selectionMode = true" class="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2">
                <Icon name="lucide:check-square" class="w-4 h-4" /> Seleccionar
              </button>
              <template v-else>
                <button @click="cancelSelection" class="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-sm font-semibold rounded-lg transition-colors">Cancelar</button>
                <button @click="hideSelectedPhotos" :disabled="selectedPhotos.length === 0" class="px-4 py-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">Ocultar</button>
                <button @click="downloadSelectedPhotos" :disabled="isDownloadingAll || selectedPhotos.length === 0" class="px-4 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50">Descargar ({{ selectedPhotos.length }})</button>
              </template>
            </div>
          </div>
          
          <div class="grid grid-cols-3 gap-1 md:gap-4">
            <div v-for="purchase in visiblePurchases" :key="purchase.id"
              class="relative aspect-square overflow-hidden bg-gray-100 group cursor-pointer rounded-sm md:rounded-lg"
              @click="handlePurchaseClick(purchase)">
              
              <img :src="purchase.watermarkedUrl" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
              
              <!-- Selection overlay -->
              <div v-if="selectionMode" class="absolute inset-0 bg-black/10 z-10 transition-colors" :class="{'bg-black/40': selectedPhotos.includes(purchase.photoId)}">
                <div class="absolute top-2 left-2">
                  <div :class="['w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                    selectedPhotos.includes(purchase.photoId) ? 'bg-blue-500 border-blue-500 text-white scale-110' : 'bg-white/50 border-white text-transparent']">
                    <Icon name="lucide:check" class="w-4 h-4" />
                  </div>
                </div>
              </div>

              <!-- Hover overlay (Instagram style) -->
              <div v-if="!selectionMode" class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-6">
                <div class="flex items-center gap-2 text-white font-bold text-sm">
                  <Icon name="lucide:camera" class="w-5 h-5" />
                  <span class="truncate max-w-[100px]">{{ purchase.photoTitle }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Hidden Tab -->
      <div v-if="currentTab === 'hidden'">
        <div v-if="hiddenPurchases.length === 0" class="flex flex-col items-center justify-center py-20 text-center">
          <div class="w-20 h-20 rounded-full border-2 border-gray-300 flex items-center justify-center mb-4">
            <Icon name="lucide:eye-off" class="w-10 h-10 text-gray-400" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900 mb-2">No hay fotos ocultas</h3>
          <p class="text-gray-500">Las fotos que decidas ocultar aparecerán aquí.</p>
        </div>

        <div v-else class="grid grid-cols-3 gap-1 md:gap-4">
          <div v-for="purchase in hiddenPurchases" :key="purchase.id" class="relative aspect-square overflow-hidden bg-gray-100 group cursor-pointer rounded-sm md:rounded-lg opacity-80 hover:opacity-100" @click="activeLightboxImg = purchase.watermarkedUrl">
            <img :src="purchase.watermarkedUrl" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 grayscale-[40%] group-hover:grayscale-0">
            
            <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-4">
              <button @click.stop="unhidePhoto(purchase.photoId)" class="px-3 py-1.5 bg-white text-gray-900 text-xs font-bold rounded-full hover:bg-gray-100 flex items-center gap-1">
                <Icon name="lucide:eye" class="w-3 h-3" /> Restaurar
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Settings Tab -->
      <div v-if="currentTab === 'settings'" class="max-w-2xl mx-auto space-y-8">
        <!-- Edit Profile UI -->
        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Biografía</h3>
          <div class="flex flex-col items-end gap-3 mt-4">
            <textarea v-model="descriptionText" rows="3" maxlength="1000" placeholder="Ej: Descubriendo momentos..." class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-sm"></textarea>
            <div class="w-full flex justify-between items-center">
                <span class="text-xs text-gray-400">{{ descriptionText?.length || 0 }} / 1000</span>
                <button @click="updateDescription" class="px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors" :disabled="savingDescription">
                    {{ savingDescription ? 'Guardando...' : 'Guardar Biografía' }}
                </button>
            </div>
            <p v-if="descriptionSuccess" class="text-xs text-green-600 font-semibold mt-1">✓ Biografía actualizada</p>
          </div>
        </div>
        
        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Etiqueta Principal</h3>
          <div class="flex gap-3 mt-4">
            <input v-model="titleText" type="text" maxlength="30" placeholder="Ej. Collector" class="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm" />
            <button @click="updateTitle" class="px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors" :disabled="savingTitle">
                Guardar
            </button>
          </div>
        </div>
        
        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Nombre de Usuario</h3>
          <div class="flex gap-3 mt-4">
            <input v-model="usernameText" type="text" class="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm" />
            <button @click="updateUsername" class="px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors" :disabled="savingUsername || usernameText === authStore.user?.username">
                Guardar
            </button>
          </div>
        </div>
        
        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-gray-900 mb-1">Perfil Limpio</h3>
            <p class="text-xs text-gray-500">Muestra las fotos sin marcas de agua en tu perfil.</p>
          </div>
          <button @click="toggleWatermarkPreference" :disabled="savingPreference" :class="['relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none', showWatermarked ? 'bg-indigo-600' : 'bg-gray-200']">
            <span :class="['pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out', showWatermarked ? 'translate-x-5' : 'translate-x-0']" />
          </button>
        </div>

        <div class="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h3 class="text-sm font-bold text-red-600 mb-2">Cerrar Sesión</h3>
          <p class="text-xs text-gray-500 mb-4">Cierra tu sesión de forma segura.</p>
          <button @click="showLogoutModal = true" class="px-5 py-2 bg-red-50 text-red-600 hover:bg-red-100 text-sm font-bold rounded-lg transition-colors">
            Cerrar Sesión
          </button>
        </div>
      </div>

      <!-- Subscription Tab Placeholder -->
      <div v-if="currentTab === 'subscription'" class="max-w-2xl mx-auto py-20 text-center">
        <Icon name="lucide:sparkles" class="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 class="text-xl font-bold text-gray-900 mb-2">No active subscriptions</h3>
        <p class="text-gray-500">Subscribe to your favorite photographers to get exclusive content.</p>
      </div>
    </div>
    
    <!-- Lightbox Modal -->
    <div v-if="activeLightboxImg" class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" @click="activeLightboxImg = null">
      <button @click="activeLightboxImg = null" class="absolute top-4 right-4 text-white hover:text-gray-300 z-50">
        <Icon name="lucide:x" class="w-8 h-8" />
      </button>
      <img :src="activeLightboxImg" class="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" @click.stop />
      
      <!-- Download Button in Lightbox -->
      <button v-if="getPhotoIdFromUrl(activeLightboxImg)" @click.stop="downloadPhoto(getPhotoIdFromUrl(activeLightboxImg))" class="absolute bottom-8 px-6 py-3 bg-white text-gray-900 rounded-full font-bold shadow-xl hover:bg-gray-100 flex items-center gap-2 transition-transform active:scale-95">
        <Icon name="lucide:download" class="w-5 h-5" /> Descargar Original
      </button>
    </div>

    <!-- Logout Confirmation Modal -->
    <div v-if="showLogoutModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" @click.self="showLogoutModal = false">
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-scale-up">
        <div class="p-6 text-center">
          <div class="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="lucide:log-out" class="w-8 h-8 text-red-500" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-2">¿Cerrar sesión?</h3>
          <p class="text-gray-500 text-sm">Deberás ingresar tus credenciales la próxima vez que quieras acceder a tus compras.</p>
        </div>
        <div class="p-4 bg-gray-50 flex gap-3">
          <button @click="showLogoutModal = false" class="flex-1 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors">Cancelar</button>
          <button @click="confirmLogout" class="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl transition-colors">Cerrar Sesión</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useWalletStore } from '~/stores/wallet'

import { usePhotosStore } from '~/stores/photos'

const { $api } = useNuxtApp()
const router = useRouter()
const config = useRuntimeConfig()
const authStore = useAuthStore()
const walletStore = useWalletStore()
const photosStore = usePhotosStore()
const toast = useToast()

const currentTab = ref('purchases')
const settingsTab = ref('profile') // New state for Sidebar in Settings
const showLogoutModal = ref(false) // State for Logout modal

const topUpAmount = ref(5000)
const isToppingUp = ref(false)
const wompiData = ref(null)
const windowOrigin = ref('')
const isLocalhost = ref(false)
const purchases = ref([])
const pendingPurchases = ref(true)
const fileInput = ref(null)
const uploading = ref(false)
const isDownloadingAll = ref(false)
const selectionMode = ref(false)
const selectedPhotos = ref([])
const hiddenPhotoIds = ref([])

const visiblePurchases = computed(() => {
  return purchases.value.filter(p => !hiddenPhotoIds.value.includes(p.photoId))
})
const hiddenPurchases = computed(() => {
  return purchases.value.filter(p => hiddenPhotoIds.value.includes(p.photoId))
})

const usernameText = ref('')
const savingUsername = ref(false)
const usernameSuccess = ref(false)

const descriptionText = ref('')
const savingDescription = ref(false)
const descriptionSuccess = ref(false)

const titleText = ref('')
const savingTitle = ref(false)
const titleSuccess = ref(false)

const showWatermarked = ref(true)
const savingPreference = ref(false)
const preferenceSuccess = ref(false)
const activeLightboxImg = ref(null)

const route = useRoute()

onMounted(async () => {
  windowOrigin.value = typeof window !== 'undefined' ? window.location.origin : ''
  isLocalhost.value = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  if (!authStore.isCustomer) {
    router.push('/')
    return
  }
  
  if (route.query.tab) {
    currentTab.value = route.query.tab
  }
  
  usernameText.value = authStore.user?.username || ''
  descriptionText.value = authStore.user?.description || ''
  titleText.value = authStore.user?.title || ''
  showWatermarked.value = authStore.user?.showWatermarkedInProfile === false
  
  if (authStore.user?.username) {
    try {
      const data = await $api('/users/settings/hidden-photos')
      if (data) hiddenPhotoIds.value = data
    } catch (e) {
      console.error('Error fetching hidden photos', e)
    }
  }
  
  await walletStore.fetchBalance()
  await fetchPurchases()
  await checkSubscription()
})



const activeSubscription = ref(null)
const checkingSubscription = ref(true)
const isSubscribing = ref(false)

async function updateUsername() {
  if (savingUsername.value || usernameText.value === authStore.user?.username) return
  savingUsername.value = true
  try {
    const res = await authStore.updateUsername(usernameText.value)
    if (res.success) {
      usernameSuccess.value = true
      setTimeout(() => { usernameSuccess.value = false }, 3000)
    } else {
      toast.error('Error', res.error || 'No se pudo actualizar el nombre de usuario.')
    }
  } catch (e) {
    console.error(e)
    toast.error('Error', 'Error al guardar el nombre de usuario')
  } finally {
    savingUsername.value = false
  }
}

async function checkSubscription() {
  checkingSubscription.value = true
  try {
    const data = await $api('/subscriptions/active')
    activeSubscription.value = data
  } catch (e) {
    console.error('Failed to fetch subscription', e)
  } finally {
    checkingSubscription.value = false
  }
}

async function handleSubscribe() {
  isSubscribing.value = true
  try {
    if (typeof window === 'undefined' || !window.WidgetCheckout) {
      toast.info('Cargando pasarela', 'La pasarela de pago aún se está cargando. Por favor, espera un momento y reintenta.')
      isSubscribing.value = false
      return
    }

    const data = await $api('/subscriptions/subscribe', { method: 'POST' })
    console.log('Wompi prepare subscription data:', data)

    const checkoutOptions = {
      publicKey: data.publicKey,
      currency: data.currency,
      amountInCents: data.amountInCents,
      reference: data.reference,
      redirectUrl: window.location.origin + '/payment/success',
      customerData: {
        email: data.customerEmail
      }
    }

    if (data.signature) {
      checkoutOptions.signature = { integrity: data.signature }
    }

    const checkout = new window.WidgetCheckout(checkoutOptions)
    checkout.open((result) => {
      const transaction = result.transaction
      if (transaction.status === 'APPROVED') {
        router.push('/payment/success')
      }
    })
  } catch (e) {
    console.error('Failed to subscribe', e)
    toast.error('Error de suscripción', e.response?._data?.error || 'No se pudo iniciar la suscripción.')
  } finally {
    isSubscribing.value = false
  }
}

async function handleTopUp() {
  if (topUpAmount.value < 5000) {
    toast.error('Monto insuficiente', 'El monto mínimo es $5.000 COP')
    return
  }

  isToppingUp.value = true
  try {
    // Check if Wompi widget is loaded
    if (typeof window === 'undefined' || !window.WidgetCheckout) {
      toast.info('Cargando pasarela', 'La pasarela de pago aún se está cargando. Por favor, espera un momento y reintenta.')
      isToppingUp.value = false
      return
    }

    // Use the centralized wallet store logic
    const data = await walletStore.prepareWompiPayment(topUpAmount.value)
    console.log('Wompi Dashboard prepare data:', data)
    wompiData.value = data

    // 2. Open Wompi Widget
    const checkoutOptions = {
      publicKey: data.publicKey,
      currency: data.currency,
      amountInCents: data.amountInCents,
      reference: data.reference,
      redirectUrl: window.location.origin + '/payment/success',
      customerData: data.customerData
    }

    if (data.signature) {
      checkoutOptions.signature = { integrity: data.signature }
    }

    const checkout = new window.WidgetCheckout(checkoutOptions)

    checkout.open((result) => {
      const transaction = result.transaction
      if (transaction.status === 'APPROVED') {
        router.push('/payment/success')
      }
    })
  } catch (e) {
    console.error('Failed to prepare payment', e)
    toast.error('Error de pago', 'Payment initialization failed. Please try again.')
  } finally {
    isToppingUp.value = false
  }
}

async function fetchPurchases() {
  pendingPurchases.value = true
  try {
    const data = await $api('/payment/my-purchases')
    purchases.value = data
  } catch (e) {
    console.error('No purchases found or endpoint error', e)
  } finally {
    pendingPurchases.value = false
  }
}

function handlePurchaseClick(purchase) {
  if (selectionMode.value) {
    const index = selectedPhotos.value.indexOf(purchase.photoId)
    if (index > -1) {
      selectedPhotos.value.splice(index, 1)
    } else {
      selectedPhotos.value.push(purchase.photoId)
    }
  } else {
    activeLightboxImg.value = purchase.watermarkedUrl
  }
}

function cancelSelection() {
  selectionMode.value = false
  selectedPhotos.value = []
}

async function hideSelectedPhotos() {
  for (const id of selectedPhotos.value) {
    if (!hiddenPhotoIds.value.includes(id)) {
      hiddenPhotoIds.value.push(id)
    }
  }
  
  try {
    await $fetch(`${config.public.apiBase}/users/settings/hidden-photos`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.token}`, 'Content-Type': 'application/json' },
      body: hiddenPhotoIds.value
    })
    toast.success('Fotos ocultadas', 'Las fotos seleccionadas se han movido a Fotos Ocultas.')
  } catch (e) {
    console.error(e)
    toast.error('Error', 'No se pudieron ocultar las fotos en el servidor.')
  }
  
  cancelSelection()
}

async function unhidePhoto(photoId) {
  const idx = hiddenPhotoIds.value.indexOf(photoId)
  if (idx > -1) {
    hiddenPhotoIds.value.splice(idx, 1)
    try {
      await $fetch(`${config.public.apiBase}/users/settings/hidden-photos`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${authStore.token}`, 'Content-Type': 'application/json' },
        body: hiddenPhotoIds.value
      })
      toast.success('Restaurada', 'La foto vuelve a estar en tu feed principal.')
    } catch (e) {
      console.error(e)
      toast.error('Error', 'No se pudo restaurar la foto en el servidor.')
      // rollback
      hiddenPhotoIds.value.push(photoId)
    }
  }
}

async function genuineDownload(downloadUrl, filename) {
  try {
    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error('Network response was not ok');
    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(objectUrl);
    return true;
  } catch (e) {
    return false;
  }
}

async function downloadPhoto(photoId) {
  try {
    const res = await photosStore.getDownloadUrl(photoId)
    const downloadUrl = res?.presignedUrl || res
    
    if (downloadUrl && typeof downloadUrl === 'string') {
      try {
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const blob = await response.blob();
        const objectUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = `moment-photo-${photoId}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(objectUrl);
      } catch (e) {
        // Fallback for strict browsers or CORS errors: direct link without _blank
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `moment-photo-${photoId}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } else {
      toast.error('Error', 'No se pudo obtener el enlace de descarga.')
    }
  } catch (err) {
    console.error(err)
    toast.error('Error', 'Error al procesar la descarga.')
  }
}

function handleLogout() {
  authStore.logout()
}

function getPhotoIdFromUrl(url) {
  const purchase = purchases.value.find(p => p.watermarkedUrl === url)
  return purchase ? purchase.photoId : null
}

async function downloadSelectedPhotos() {
  if (selectedPhotos.value.length === 0) return
  isDownloadingAll.value = true
  toast.info('Descargando...', 'Iniciando descarga múltiple. Por favor espera.')

  for (let i = 0; i < selectedPhotos.value.length; i++) {
    const photoId = selectedPhotos.value[i]
    try {
      const res = await photosStore.getDownloadUrl(photoId)
      const downloadUrl = res?.presignedUrl || res
      
      if (downloadUrl && typeof downloadUrl === 'string') {
        const success = await genuineDownload(downloadUrl, `moment-photo-${photoId}.jpg`)
        if (!success) {
          const a = document.createElement('a')
          a.href = downloadUrl
          a.download = `moment-photo-${photoId}.jpg`
          a.target = '_blank'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
      }
    } catch (e) {
      console.error('Error al descargar foto', photoId, e)
    }
    
    await new Promise(resolve => setTimeout(resolve, 800))
  }
  
  isDownloadingAll.value = false
  toast.success('¡Listo!', 'Tus fotos han sido descargadas.')
  cancelSelection()
}

async function toggleWatermarkPreference() {
  if (savingPreference.value) return
  savingPreference.value = true
  // showWatermarked = true means show clean original (showWatermarkedInProfile = false in backend)
  const showOriginalOnProfile = !showWatermarked.value
  const backendValue = !showOriginalOnProfile // true if watermarked, false if original clean

  try {
    await $fetch(`${config.public.apiBase}/users/settings/watermark-profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: backendValue
    })
    showWatermarked.value = showOriginalOnProfile
    authStore.updateUserData({ showWatermarkedInProfile: backendValue })
    preferenceSuccess.value = true
    setTimeout(() => { preferenceSuccess.value = false }, 3000)
  } catch (err) {
    console.error(err)
    toast.error('Error', 'No se pudo guardar la preferencia.')
  } finally {
    savingPreference.value = false
  }
}

async function onFileSelected(event) {
  const file = event.target.files[0]
  if (!file) return

  uploading.value = true
  try {
    const { compressImage } = useImageActions()
    const optimizedFile = await compressImage(file)

    const formData = new FormData()
    formData.append('file', optimizedFile)

    // Upload to R2 via backend
    const res = await $fetch(`${config.public.apiBase}/photos/upload-public`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: formData
    })

    const photoUrl = res.url
    // Update user profile photo
    await $fetch(`${config.public.apiBase}/users/profile-photo`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: photoUrl
    })

    authStore.user.profilePhotoUrl = photoUrl
    toast.success('¡Éxito!', 'Profile photo updated!')
  } catch (e) {
    console.error(e)
    toast.error('Error de subida', 'Upload failed.')
  } finally {
    uploading.value = false
  }
}

async function updateDescription() {
    if (savingDescription.value) return
    savingDescription.value = true
    try {
        await $fetch(`${config.public.apiBase}/users/description`, {
            method: 'PUT',
            headers: { 
                Authorization: `Bearer ${authStore.token}`,
                'Content-Type': 'text/plain' 
            },
            body: descriptionText.value
        })
        authStore.updateUserData({ description: descriptionText.value })
        descriptionSuccess.value = true
        setTimeout(() => { descriptionSuccess.value = false }, 3000)
    } catch (e) {
        console.error(e)
        toast.error('Error', 'Error al guardar la biografía')
    } finally {
        savingDescription.value = false
    }
}

async function updateTitle() {
    if (savingTitle.value) return
    savingTitle.value = true
    try {
        await $fetch(`${config.public.apiBase}/users/title`, {
            method: 'PUT',
            headers: { 
                Authorization: `Bearer ${authStore.token}`,
                'Content-Type': 'text/plain' 
            },
            body: titleText.value
        })
        authStore.updateUserData({ title: titleText.value })
        titleSuccess.value = true
        setTimeout(() => { titleSuccess.value = false }, 3000)
    } catch (e) {
        console.error(e)
        toast.error('Error', 'Error al guardar la etiqueta')
    } finally {
        savingTitle.value = false
    }
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.4s ease-out forwards;
}
</style>
