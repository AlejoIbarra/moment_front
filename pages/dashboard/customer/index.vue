<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Profile Header (Instagram Style) -->
    <div class="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 border-b border-gray-200 pb-12">
      <div class="relative group cursor-pointer" @click="$refs.fileInput.click()">
        <div
          class="w-32 h-32 md:w-40 md:h-40 rounded-full bg-[#3ef4a1] p-1 transition-transform group-hover:scale-105">
          <div class="w-full h-full rounded-full bg-white p-1">
            <div
              class="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100 italic">
              <img v-if="authStore.user?.profilePhotoUrl" :src="authStore.user.profilePhotoUrl" alt="Profile"
                class="w-full h-full object-cover">
              <Icon v-else name="lucide:user" class="w-16 h-16 text-gray-300" />
            </div>
          </div>
        </div>
        <div
          class="absolute inset-0 flex items-center justify-center bg-black/20 text-white opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
          <Icon name="lucide:upload" class="w-8 h-8" />
        </div>
        <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onFileSelected" />
      </div>

      <!-- Profile Info -->
      <div class="flex-1 text-center md:text-left">
        <div class="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          <h2 class="text-2xl font-light text-gray-800">{{ authStore.user?.username || 'Customer' }}</h2>
          <div class="flex items-center justify-center md:justify-start gap-2">
            <NuxtLink :to="`/profile/${authStore.user?.username}`"
              class="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg transition-colors flex items-center gap-2">
              <Icon name="lucide:user" class="w-4 h-4" />
              View My Profile
            </NuxtLink>
          </div>
        </div>

        <div class="flex justify-center md:justify-start gap-6 mb-4 text-sm">
          <span><strong class="text-gray-900">{{ purchases.length }}</strong> {{
            $t('dashboard.customer.purchases').toLowerCase() }}</span>
          <span><strong class="text-gray-900">{{ $t('dashboard.customer.buyer_account') }}</strong></span>
        </div>

        <div class="text-sm">
          <p class="font-semibold text-gray-900">{{ $t('dashboard.customer.member_since') }} {{ new Date().getFullYear() }}</p>
          <div class="mt-1">
             <span v-if="authStore.user?.title" class="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-md mb-2">
                ✨ {{ authStore.user.title }}
             </span>
             <span v-else class="inline-block px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-bold rounded-md mb-2">
                ✨ Collector
             </span>
             <p class="text-gray-500 whitespace-pre-wrap">{{ authStore.user?.description || 'Discovering amazing moments through the lens.' }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabs (Instagram Style) -->
    <div class="flex justify-center gap-12 border-t border-gray-200">
      <button @click="currentTab = 'purchases'" :class="['flex items-center gap-2 py-4 text-xs font-semibold uppercase tracking-widest border-t -mt-px transition-colors',
        currentTab === 'purchases' ? 'text-gray-900 border-gray-900' : 'text-gray-400 border-transparent']">
        <Icon name="lucide:grid" class="w-3 h-3" />
        {{ $t('dashboard.customer.purchases') }}
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
            {{ $t('dashboard.customer.browse') }}
          </NuxtLink>
        </div>

        <div v-else>
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold text-gray-900">Tus Compras</h3>
            <button @click="downloadAllPhotos" :disabled="isDownloadingAll" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center gap-1.5 transition-all shadow-md active:scale-95 disabled:opacity-50">
              <Icon v-if="isDownloadingAll" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
              <Icon v-else name="lucide:download-cloud" class="w-4 h-4" />
              {{ isDownloadingAll ? 'Descargando...' : 'Descargar Todas' }}
            </button>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="purchase in purchases" :key="purchase.id"
              class="bg-white border border-gray-200 rounded-xl overflow-hidden group">
            <div class="relative aspect-square overflow-hidden bg-gray-100 cursor-pointer" @click="activeLightboxImg = purchase.watermarkedUrl">
              <img :src="purchase.watermarkedUrl"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
            </div>
            <div class="p-4">
              <h4 class="font-bold text-gray-900 truncate">{{ purchase.photoTitle }}</h4>
              <p class="text-xs text-gray-500 mt-1">{{ $t('dashboard.customer.purchased_on') }} {{ new
                Date(purchase.createdAt).toLocaleDateString() }}</p>

              <div class="flex items-center justify-between mt-6">
                <div></div>
                <button @click="downloadPhoto(purchase.photoId)" class="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all active:scale-95">
                  <Icon name="lucide:arrow-down-to-line" class="w-4 h-4" />
                  Descargar Original
                </button>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>

      <!-- Settings Tab -->
      <div v-if="currentTab === 'settings'" class="max-w-2xl mx-auto">
        <!-- Edit Profile UI -->
        <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Biografía</h3>
          <p class="text-sm text-gray-500 mb-4">Personaliza una descripción sobre ti.</p>
          <div class="flex flex-col items-end gap-3">
            <textarea 
              v-model="descriptionText" 
              rows="3" 
              maxlength="1000"
              placeholder="Ej: Discovering amazing moments through the lens."
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all resize-none text-sm"
            ></textarea>
            <div class="w-full flex justify-between items-center">
                <span class="text-xs text-gray-400">{{ descriptionText?.length || 0 }} / 1000</span>
                <button @click="updateDescription" class="px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors" :disabled="savingDescription">
                    {{ savingDescription ? 'Guardando...' : 'Guardar Biografía' }}
                </button>
            </div>
            <p v-if="descriptionSuccess" class="text-xs text-green-600 font-semibold mt-1">✓ Biografía actualizada</p>
          </div>
        </div>

        <!-- Edit Tag UI -->
        <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Etiqueta de Coleccionista</h3>
          <p class="text-sm text-gray-500 mb-4">Destaque su perfil con etiquetas como "Collector", "Deportista", "Futbolista", etc.</p>
          <div class="flex flex-col items-end gap-3">
            <input 
              type="text"
              v-model="titleText" 
              maxlength="30"
              placeholder="Ej: Collector"
              class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
            />
            <div class="w-full flex justify-between items-center">
                <span class="text-xs text-gray-400">{{ titleText?.length || 0 }} / 30</span>
                <button @click="updateTitle" class="px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors" :disabled="savingTitle">
                    {{ savingTitle ? 'Guardando...' : 'Guardar Etiqueta' }}
                </button>
            </div>
            <p v-if="titleSuccess" class="text-xs text-green-600 font-semibold mt-1">✓ Etiqueta actualizada</p>
          </div>
        </div>

        <!-- Watermark Display Settings -->
        <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
          <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Visualización en Perfil Público</h3>
          <p class="text-sm text-gray-500 mb-4">Elige cómo se mostrarán las fotos que has comprado a las demás personas que visiten tu perfil público.</p>
          <div class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
            <span class="text-sm font-semibold text-gray-700">Mostrar fotos sin marca de agua en mi perfil</span>
            <button 
              @click="toggleWatermarkPreference"
              :class="['w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 focus:outline-none', 
                showWatermarked ? 'bg-indigo-600' : 'bg-gray-300']"
            >
              <div :class="['bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300', 
                showWatermarked ? 'translate-x-6' : 'translate-x-0']"></div>
            </button>
          </div>
          <p v-if="preferenceSuccess" class="text-xs text-green-600 font-semibold mt-2">✓ Preferencia guardada con éxito</p>
        </div>
      </div>

      <!-- Subscription Tab -->
      <div v-if="currentTab === 'subscription'" class="max-w-2xl mx-auto">
        <div v-if="checkingSubscription" class="flex justify-center py-20">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>

        <div v-else-if="activeSubscription?.active" class="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm text-center">
          <div class="w-20 h-20 bg-[#3ef4a1] rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-lg">
            <Icon name="lucide:sparkles" class="w-10 h-10 animate-pulse" />
          </div>
          <h2 class="text-3xl font-extrabold text-gray-900 mb-2">¡Suscripción Moment Premium Activa! ✨</h2>
          <p class="text-gray-500 text-sm mb-6">Gracias por apoyar a nuestra comunidad de fotógrafos independientes.</p>

          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="p-4 bg-indigo-50 rounded-xl border border-indigo-100 text-center">
              <span class="block text-xs font-semibold uppercase tracking-wider text-indigo-500 mb-1">Fotos Gratis Restantes</span>
              <span class="text-3xl font-extrabold text-indigo-900">{{ activeSubscription.freePhotosRemaining }}</span>
            </div>
            <div class="p-4 bg-purple-50 rounded-xl border border-purple-100 text-center">
              <span class="block text-xs font-semibold uppercase tracking-wider text-purple-500 mb-1">Próxima Renovación</span>
              <span class="text-lg font-bold text-purple-900">{{ activeSubscription.endDate }}</span>
            </div>
          </div>

          <div class="p-4 bg-gray-50 rounded-xl text-left text-sm text-gray-600 space-y-2 mb-6">
            <p class="flex items-center gap-2"><Icon name="lucide:check-circle" class="w-4 h-4 text-green-500" /> Tienes acceso exclusivo a paquetes especiales en los eventos.</p>
            <p class="flex items-center gap-2"><Icon name="lucide:check-circle" class="w-4 h-4 text-green-500" /> Recibirás regalos y promociones directas en tu bandeja.</p>
          </div>
        </div>

        <div v-else class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xl border-t-8 border-indigo-600">
          <div class="p-8 text-center bg-[#3ef4a1]">
            <span class="inline-block px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-widest rounded-full mb-4">Recomendado</span>
            <h2 class="text-3xl font-extrabold text-gray-900 mb-2">Moment Premium 🚀</h2>
            <p class="text-gray-500 text-sm max-w-md mx-auto mb-6">Lleva tu pasión por el deporte al siguiente nivel. Suscríbete hoy y obtén fotos de regalo exclusivas todos los meses.</p>
            
            <div class="text-4xl font-extrabold text-gray-900 mb-8">$30.000 <span class="text-lg font-normal text-gray-500">/ mes</span></div>

            <div class="max-w-md mx-auto text-left space-y-4 mb-8">
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5"><Icon name="lucide:check" class="w-4 h-4 text-indigo-600" /></div>
                <div>
                  <h4 class="font-bold text-gray-900 text-sm">10 Fotos de Regalo al Mes</h4>
                  <p class="text-xs text-gray-500">Canjea hasta 10 fotos originales sin costo adicional en cualquier evento de la plataforma.</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5"><Icon name="lucide:check" class="w-4 h-4 text-indigo-600" /></div>
                <div>
                  <h4 class="font-bold text-gray-900 text-sm">Acceso a Paquetes Exclusivos</h4>
                  <p class="text-xs text-gray-500">Compra ofertas y paquetes especiales que los fotógrafos habilitan solo para miembros Premium.</p>
                </div>
              </div>
              <div class="flex items-start gap-3">
                <div class="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center shrink-0 mt-0.5"><Icon name="lucide:check" class="w-4 h-4 text-indigo-600" /></div>
                <div>
                  <h4 class="font-bold text-gray-900 text-sm">Regalos y Promociones Frecuentes</h4>
                  <p class="text-xs text-gray-500">Recibe descuentos exclusivos y regalos directos de los organizadores y fotógrafos.</p>
                </div>
              </div>
            </div>

            <button 
              @click="handleSubscribe" 
              :disabled="isSubscribing"
              class="w-full max-w-sm py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50"
            >
              {{ isSubscribing ? 'Iniciando Pago...' : 'Suscribirse Ahora' }}
            </button>
            <p class="text-[10px] text-gray-400 mt-4">Transacción segura procesada a través de Wompi. Puedes cancelar tu suscripción en cualquier momento.</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Lightbox Modal -->
  <div v-if="activeLightboxImg" class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8" @click="activeLightboxImg = null">
    <button @click="activeLightboxImg = null" class="absolute top-6 right-6 text-white/70 hover:text-white z-10">
      <Icon name="lucide:x" class="w-8 h-8" />
    </button>
    <div class="relative max-w-full max-h-full flex items-center justify-center" @click.stop>
      <img :src="activeLightboxImg" class="max-w-full max-h-full object-contain rounded-lg shadow-2xl" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
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

const descriptionText = ref('')
const savingDescription = ref(false)
const descriptionSuccess = ref(false)

const titleText = ref('')
const savingTitle = ref(false)
const titleSuccess = ref(false)

const showWatermarked = ref(true) // True = show original unwatermarked on profile (Wait, newValue is toggle based)
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
  
  descriptionText.value = authStore.user?.description || ''
  titleText.value = authStore.user?.title || ''
  showWatermarked.value = authStore.user?.showWatermarkedInProfile === false
  
  await walletStore.fetchBalance()
  await fetchPurchases()
  await checkSubscription()
})

const activeSubscription = ref(null)
const checkingSubscription = ref(true)
const isSubscribing = ref(false)

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

async function downloadPhoto(photoId) {
  let newWin = null
  const isIOS = typeof navigator !== 'undefined' && (/iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1))
  
  if (isIOS) {
    newWin = window.open('', '_blank')
    if (newWin) {
      newWin.document.write('<div style="font-family:sans-serif; text-align:center; padding-top:50px; color:#333;">Preparando tu foto de alta resolución...</div>')
    }
  }

  try {
    const res = await photosStore.getDownloadUrl(photoId)
    const downloadUrl = res?.presignedUrl || res
    if (downloadUrl && typeof downloadUrl === 'string') {
      if (newWin) {
        newWin.location.href = downloadUrl
      } else {
        const opened = window.open(downloadUrl, '_blank')
        if (!opened) {
          window.location.href = downloadUrl // Fallback for strict popup blockers
        }
      }
    } else {
      if (newWin) newWin.close()
      toast.error('Error', 'No se pudo obtener el enlace de descarga de la foto original.')
    }
  } catch (err) {
    if (newWin) newWin.close()
    console.error(err)
    toast.error('Error', 'Error al procesar la descarga.')
  }
}

async function downloadAllPhotos() {
  if (!purchases.value || purchases.value.length === 0) return
  isDownloadingAll.value = true
  toast.info('Descargando...', 'Iniciando descarga múltiple. Por favor espera y permite las descargas si tu navegador lo solicita.')

  for (let i = 0; i < purchases.value.length; i++) {
    const purchase = purchases.value[i]
    try {
      const res = await photosStore.getDownloadUrl(purchase.photoId)
      const downloadUrl = res?.presignedUrl || res
      
      if (downloadUrl && typeof downloadUrl === 'string') {
        const a = document.createElement('a')
        a.href = downloadUrl
        a.download = `moment-photo-${purchase.photoId}.jpg`
        a.target = '_blank'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    } catch (e) {
      console.error('Error al descargar foto', purchase.photoId, e)
    }
    
    // Pequeña pausa entre descargas para no saturar al navegador ni bloquear múltiples popups
    await new Promise(resolve => setTimeout(resolve, 800))
  }
  
  isDownloadingAll.value = false
  toast.success('¡Listo!', 'Se han solicitado las descargas de todas tus fotos.')
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
