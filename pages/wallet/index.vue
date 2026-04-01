<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <!-- Wallet Header Card -->
    <div class="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-8 mb-12 shadow-2xl relative overflow-hidden">
      <!-- Decorative circles -->
      <div class="absolute -top-12 -right-12 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-400/20 rounded-full blur-2xl"></div>
      
      <div class="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="text-center md:text-left">
          <p class="text-indigo-100 text-sm font-medium uppercase tracking-wider mb-2">{{ $t('wallet.total_balance') }}</p>
          <h1 class="text-5xl font-bold text-white tracking-tight">
            ${{ walletStore.balance.toFixed(2) }}
          </h1>
        </div>
        
        <div class="flex gap-4">
          <button 
            @click="scrollToRecharge"
            class="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-bold hover:bg-opacity-90 transition-all shadow-lg active:scale-95 flex items-center gap-2"
          >
            <Icon name="lucide:plus" class="w-5 h-5" />
            {{ $t('wallet.add_funds') }}
          </button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <!-- Recharge Section -->
      <div id="recharge-section" class="lg:col-span-2 space-y-8">
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Icon name="lucide:zap" class="w-6 h-6 text-yellow-500" />
            {{ $t('wallet.quick_recharge') }}
          </h2>
          
          <div class="grid grid-cols-3 gap-4 mb-8">
            <button 
              v-for="amount in [10, 20, 50]" 
              :key="amount"
              @click="rechargeForm.amount = amount"
              :class="['py-4 rounded-2xl font-bold transition-all border-2', 
                       rechargeForm.amount === amount ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 hover:border-gray-200 text-gray-600']"
            >
              ${{ amount }}
            </button>
          </div>

          <div class="mb-8">
            <label class="block text-sm font-semibold text-gray-700 mb-2">{{ $t('wallet.custom_amount') }}</label>
            <div class="relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
              <input 
                type="number" 
                v-model.number="rechargeForm.amount"
                class="w-full bg-gray-50 border-0 rounded-2xl py-4 pl-8 pr-4 text-xl font-bold focus:ring-2 focus:ring-indigo-500 transition-all font-mono"
                placeholder="0.00"
                min="5"
              >
            </div>
            <p class="mt-2 text-xs text-gray-400 font-medium">{{ $t('wallet.min_recharge') }}</p>
          </div>

          <button 
            @click="handleWompiTopUp"
            :disabled="loading"
            class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-200 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
          >
            <Icon v-if="loading" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
            <span v-else>{{ $t('wallet.proceed_payment') }}</span>
          </button>

          <!-- Fallback/Localhost Web Checkout -->
          <div v-if="wompiData" class="mt-6 pt-6 border-t border-gray-100 text-center animate-fade-in shadow-inner rounded-2xl bg-orange-50/50 p-4">
            <template v-if="isLocalhost">
              <p class="text-sm font-bold text-orange-800 mb-3 flex items-center justify-center gap-2">
                <Icon name="lucide:shield-alert" />
                Modo Localhost Detectado
              </p>
              <p class="text-xs text-orange-600 mb-4 px-4 text-pretty">
                Para evitar bloqueos de seguridad en tu máquina local, Wompi requiere el método de <strong>redirección completa</strong>.
              </p>
            </template>
            <p v-else class="text-xs text-gray-500 mb-3">¿Problemas con el widget? Usa el método alternativo:</p>
            
            <form :id="'wompi-form-' + wompiData.reference" action="https://checkout.wompi.co/p/" method="GET">
              <input type="hidden" name="public-key" :value="wompiData.publicKey" />
              <input type="hidden" name="currency" :value="wompiData.currency" />
              <input type="hidden" name="amount-in-cents" :value="wompiData.amountInCents" />
              <input type="hidden" name="reference" :value="wompiData.reference" />
              <input type="hidden" name="signature:integrity" :value="wompiData.signature" />
              <input type="hidden" name="redirect-url" :value="windowOrigin + '/payment/success'" />
              
              <!-- Pre-filled Customer Data -->
              <input v-if="wompiData.customerData" type="hidden" name="customer-data:email" :value="wompiData.customerData.email" />
              <input v-if="wompiData.customerData" type="hidden" name="customer-data:full-name" :value="wompiData.customerData.fullName" />
              
              <button 
                type="submit"
                class="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95"
              >
                <Icon name="lucide:external-link" />
                Pagar en Wompi (Página Completa)
              </button>
            </form>
          </div>
          
          <div class="mt-6 flex items-center justify-center gap-4 filter grayscale opacity-50">
            <img src="https://wompi.co/assets/img/icon-secure.svg" class="h-6" alt="Secure Payment" />
            <span class="text-xs text-gray-400 font-medium">{{ $t('wallet.secured_by') }} Wompi</span>
          </div>
        </div>

        <!-- History Preview -->
        <div class="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div class="flex justify-between items-center mb-6">
            <h2 class="text-2xl font-bold text-gray-900">{{ $t('wallet.recent_activity') }}</h2>
          </div>
          
          <div v-if="walletStore.transactions.length" class="space-y-4">
            <div v-for="tx in walletStore.transactions" :key="tx.id" class="flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors">
              <div class="flex items-center gap-4">
                <div :class="['w-12 h-12 rounded-xl flex items-center justify-center', 
                             tx.status === 'COMPLETED' || tx.status === 'SUCCESS' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600']">
                  <Icon :name="tx.status === 'COMPLETED' || tx.status === 'SUCCESS' ? 'lucide:arrow-down-left' : 'lucide:alert-circle'" class="w-6 h-6" />
                </div>
                <div>
                  <p class="font-bold text-gray-900">{{ tx.photoTitle || 'Wallet Top Up' }}</p>
                  <p class="text-xs text-gray-400">{{ formatDate(tx.createdAt) }}</p>
                </div>
              </div>
              <p :class="['font-bold text-lg', tx.status === 'COMPLETED' || tx.status === 'SUCCESS' ? 'text-green-600' : 'text-red-600']">
                {{ tx.status === 'COMPLETED' || tx.status === 'SUCCESS' ? '+' : '' }}${{ tx.amount.toFixed(2) }}
              </p>
            </div>
          </div>
          
          <div v-else class="text-center py-12">
            <div class="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-300">
               <Icon name="lucide:history" class="w-8 h-8" />
            </div>
            <p class="text-gray-400 font-medium">{{ $t('wallet.no_transactions') }}</p>
          </div>
        </div>
      </div>

      <!-- Wallet Perks/Help -->
      <div class="space-y-8">
        <div class="bg-indigo-50 rounded-3xl p-8 border border-indigo-100">
          <h3 class="text-indigo-900 font-bold text-lg mb-4">{{ $t('wallet.why_wallet') }}</h3>
          <ul class="space-y-4">
            <li class="flex gap-3 text-sm text-indigo-700">
              <Icon name="lucide:zap" class="w-5 h-5 flex-shrink-0" />
              <span>{{ $t('wallet.perk_instant') }}</span>
            </li>
            <li class="flex gap-3 text-sm text-indigo-700">
              <Icon name="lucide:shield-check" class="w-5 h-5 flex-shrink-0" />
              <span>{{ $t('wallet.perk_secure') }}</span>
            </li>
            <li class="flex gap-3 text-sm text-indigo-700">
              <Icon name="lucide:gift" class="w-5 h-5 flex-shrink-0" />
              <span>{{ $t('wallet.perk_discount') }}</span>
            </li>
          </ul>
        </div>
        
        <div class="bg-gray-900 rounded-3xl p-8 text-white relative overflow-hidden group">
          <Icon name="lucide:help-circle" class="absolute -right-4 -bottom-4 w-32 h-32 opacity-10 group-hover:rotate-12 transition-transform duration-500" />
          <h3 class="font-bold text-lg mb-4">{{ $t('wallet.need_help') }}</h3>
          <p class="text-gray-400 text-sm mb-6">{{ $t('wallet.support_text') }}</p>
          <button class="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-bold transition-colors">
            {{ $t('wallet.contact_support') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useWalletStore } from '~/stores/wallet'
import { useAuthStore } from '~/stores/auth'

const router = useRouter()
const walletStore = useWalletStore()
const authStore = useAuthStore()

const loading = ref(false)
const wompiData = ref(null)
const windowOrigin = ref('')
const isLocalhost = ref(false)

const rechargeForm = reactive({
  amount: 5000
})

onMounted(async () => {
    windowOrigin.value = window.location.origin
    isLocalhost.value = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    if (!authStore.isAuthenticated) {
        router.push('/login')
        return
    }
    await walletStore.fetchBalance()
    await walletStore.fetchTransactions()
})

function scrollToRecharge() {
  document.getElementById('recharge-section')?.scrollIntoView({ behavior: 'smooth' })
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

async function handleWompiTopUp() {
  if (rechargeForm.amount < 5000) {
    alert('El monto mínimo de recarga es $5.000 COP')
    return
  }

    // Check if Wompi widget is loaded
    if (typeof window === 'undefined' || !window.WidgetCheckout) {
      alert('La pasarela de pago aún se está cargando. Por favor, espera un momento y reintenta.')
      return
    }

    loading.value = true
    try {
        const data = await walletStore.prepareWompiPayment(rechargeForm.amount)
        console.log('Wompi prepare data:', data)
        wompiData.value = data
        
        const checkoutOptions = {
            publicKey: data.publicKey,
            currency: data.currency,
            amountInCents: data.amountInCents,
            reference: data.reference,
            redirectUrl: window.location.origin + '/payment/success',
            customerData: data.customerData
        }

        // Only add integrity signature if provided by the backend
        if (data.signature) {
            checkoutOptions.signature = { integrity: data.signature }
        }

        // If on Localhost, we strongly suggest using the Web Checkout form instead of the widget
        if (isLocalhost.value) {
            loading.value = false
            console.log('Localhost detected. Form method prepared.')
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
    console.error('Payment initialization error:', e)
    alert('Payment initialization failed. Please try again or check your connectivity.')
  } finally {
    loading.value = false
  }
}
</script>
