<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Profile Header (Instagram Style) -->
    <div class="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 border-b border-gray-200 pb-12">
      <div class="relative group cursor-pointer" @click="$refs.fileInput.click()">
        <div
          class="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 p-1 transition-transform group-hover:scale-105">
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
            <button @click="currentTab = 'wallet'"
              class="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-sm font-semibold rounded-lg transition-colors flex items-center gap-2">
              <Icon name="lucide:wallet" class="w-4 h-4" />
              ${{ walletStore.balance.toFixed(2) }}
            </button>
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
      <button @click="currentTab = 'wallet'" :class="['flex items-center gap-2 py-4 text-xs font-semibold uppercase tracking-widest border-t -mt-px transition-colors',
        currentTab === 'wallet' ? 'text-gray-900 border-gray-900' : 'text-gray-400 border-transparent']">
        <Icon name="lucide:plus-square" class="w-3 h-3" />
        {{ $t('dashboard.customer.top_up') }}
      </button>
      <button @click="currentTab = 'settings'" :class="['flex items-center gap-2 py-4 text-xs font-semibold uppercase tracking-widest border-t -mt-px transition-colors',
        currentTab === 'settings' ? 'text-gray-900 border-gray-900' : 'text-gray-400 border-transparent']">
        <Icon name="lucide:settings" class="w-3 h-3" />
        Configuración
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

        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div v-for="purchase in purchases" :key="purchase.id"
            class="bg-white border border-gray-200 rounded-xl overflow-hidden group">
            <div class="relative aspect-square overflow-hidden bg-gray-100">
              <img :src="purchase.watermarkedUrl"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
              <div
                class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all flex items-center justify-center">
                <button @click="downloadPhoto(purchase.photoId)"
                  class="opacity-0 group-hover:opacity-100 bg-white text-gray-900 px-4 py-2 rounded-full font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
                  <Icon name="lucide:download" class="w-4 h-4" />
                  {{ $t('dashboard.customer.download') }}
                </button>
              </div>
            </div>
            <div class="p-4">
              <h4 class="font-bold text-gray-900 truncate">{{ purchase.photoTitle }}</h4>
              <p class="text-xs text-gray-500 mt-1">{{ $t('dashboard.customer.purchased_on') }} {{ new
                Date(purchase.createdAt).toLocaleDateString() }}</p>
              <div class="flex items-center justify-between mt-4">
                <span class="text-sm font-semibold text-gray-900">${{ purchase.amount.toFixed(2) }}</span>
                <button @click="downloadPhoto(purchase.photoId)" class="text-blue-500 hover:text-blue-600">
                  <Icon name="lucide:arrow-down-to-line" class="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Wallet Tab -->
      <div v-if="currentTab === 'wallet'" class="max-w-md mx-auto">
        <div class="bg-white border border-gray-200 rounded-lg p-8 text-center shadow-sm">
          <div class="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="lucide:wallet" class="w-8 h-8 text-blue-500" />
          </div>
          <h3 class="text-xl font-bold mb-2">{{ $t('wallet.why_wallet') }}</h3>
          <p class="text-gray-500 mb-6 text-sm">{{ $t('wallet.support_text') }}</p>

          <div class="p-4 bg-gray-50 rounded-xl mb-6 flex justify-between items-center">
            <span class="text-gray-600 font-medium">{{ $t('wallet.total_balance') }}</span>
            <span class="text-xl font-bold text-gray-900">${{ walletStore.balance.toFixed(2) }}</span>
          </div>

          <div class="space-y-4">
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
              <input type="number" v-model.number="topUpAmount" min="5" step="5"
                class="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="0.00">
            </div>
            <button @click="handleTopUp" :disabled="isToppingUp"
              class="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50">
              {{ isToppingUp ? 'Processing...' : $t('wallet.proceed_payment') }}
            </button>

            <!-- Fallback Web Checkout -->
            <div v-if="wompiData" class="mt-4 pt-4 border-t border-gray-100 text-center animate-fade-in">
              <p class="text-[10px] text-gray-400 mb-2">¿Problemas con el pago? Usa el enlace directo:</p>
              <form action="https://checkout.wompi.co/p/" method="GET">
                <input type="hidden" name="public-key" :value="wompiData.publicKey" />
                <input type="hidden" name="currency" :value="wompiData.currency" />
                <input type="hidden" name="amount-in-cents" :value="wompiData.amountInCents" />
                <input type="hidden" name="reference" :value="wompiData.reference" />
                <input type="hidden" name="signature:integrity" :value="wompiData.signature" />
                <input type="hidden" name="redirect-url" :value="windowOrigin + '/payment/success'" />

                <input v-if="wompiData.customerData" type="hidden" name="customer-data:email"
                  :value="wompiData.customerData.email" />
                <input v-if="wompiData.customerData" type="hidden" name="customer-data:full-name"
                  :value="wompiData.customerData.fullName" />

                <button type="submit" class="text-xs font-bold text-blue-500 hover:underline">
                  Pagar en Wompi (Checkout Web)
                </button>
              </form>
            </div>

            <!-- Localhost Info -->
            <div v-if="wompiData && isLocalhost"
              class="mt-4 p-3 bg-blue-50 rounded-lg text-left border border-blue-100">
              <p class="text-[10px] text-blue-700 font-bold mb-1 flex items-center gap-1">
                <Icon name="lucide:info" /> Modo Localhost
              </p>
              <p class="text-[9px] text-blue-600 leading-tight">
                Para evitar errores de seguridad (403) en entorno local, usa el botón de <strong>Checkout Web</strong>
                arriba.
              </p>
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
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useWalletStore } from '~/stores/wallet'

const { $api } = useNuxtApp()
const router = useRouter()
const config = useRuntimeConfig()
const authStore = useAuthStore()
const walletStore = useWalletStore()

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

const descriptionText = ref('')
const savingDescription = ref(false)
const descriptionSuccess = ref(false)

const titleText = ref('')
const savingTitle = ref(false)
const titleSuccess = ref(false)

onMounted(async () => {
  windowOrigin.value = typeof window !== 'undefined' ? window.location.origin : ''
  isLocalhost.value = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  if (!authStore.isCustomer) {
    router.push('/')
    return
  }
  
  descriptionText.value = authStore.user?.description || ''
  titleText.value = authStore.user?.title || ''
  
  await walletStore.fetchBalance()
  await fetchPurchases()
})

async function handleTopUp() {
  if (topUpAmount.value < 5000) {
    alert('El monto mínimo es $5.000 COP')
    return
  }

  isToppingUp.value = true
  try {
    // Check if Wompi widget is loaded
    if (typeof window === 'undefined' || !window.WidgetCheckout) {
      alert('La pasarela de pago aún se está cargando. Por favor, espera un momento y reintenta.')
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

    // If on Localhost, prioritize Web Checkout
    if (isLocalhost.value) {
      isToppingUp.value = false
      console.log('Localhost detected in Dashboard. Use Web Checkout.')
      return
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
    alert('Payment initialization failed. Please try again.')
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
    alert('Profile photo updated!')
  } catch (e) {
    console.error(e)
    alert('Upload failed.')
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
        alert('Error al guardar la biografía')
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
        alert('Error al guardar la etiqueta')
    } finally {
        savingTitle.value = false
    }
}
</script>
