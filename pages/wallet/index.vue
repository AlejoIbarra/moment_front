<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <!-- Wallet Header Card -->
    <div class="bg-[#3ef4a1] rounded-3xl p-8 mb-12 shadow-2xl relative overflow-hidden">
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

    <!-- Photographer Direct Payout Status Banner -->
    <div v-if="authStore.isPhotographer" class="mb-8 p-5 rounded-3xl bg-white border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-3.5">
        <div class="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Icon name="lucide:landmark" class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-sm font-bold text-gray-900 flex items-center gap-2">
            Dispersión Directa de Ganancias (Mercado Pago Split)
            <span :class="[payoutEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800', 'px-2 py-0.5 rounded text-[10px] font-black uppercase']">
              {{ payoutEnabled ? 'Activa' : 'Sin Configurar' }}
            </span>
          </h3>
          <p class="text-xs text-gray-500 mt-0.5">
            {{ payoutEnabled ? 'Tus ventas se liquidan directamente a tu cuenta bancaria o Nequi configurada.' : 'Configura tu cuenta bancaria o Nequi para recibir tus ingresos directamente sin intermediación manual.' }}
          </p>
        </div>
      </div>
      <button 
        @click="router.push('/dashboard/photographer/settings')" 
        class="shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
      >
        <Icon name="lucide:settings" class="w-3.5 h-3.5" />
        {{ payoutEnabled ? 'Ver / Modificar Datos' : 'Configurar Cuenta Bancaria' }}
      </button>
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
              v-for="amount in [10000, 20000, 50000]" 
              :key="amount"
              @click="rechargeForm.amount = amount"
              :class="['py-4 rounded-2xl font-bold transition-all border-2', 
                       rechargeForm.amount === amount ? 'border-indigo-600 bg-indigo-50 text-indigo-700' : 'border-gray-100 hover:border-gray-200 text-gray-600']"
            >
              ${{ amount.toLocaleString() }}
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
                placeholder="0"
                min="5000"
                step="1000"
              >
            </div>
            <p class="mt-2 text-xs text-gray-400 font-medium">{{ $t('wallet.min_recharge') }} ($5.000 COP)</p>
          </div>

          <!-- Prepare Payment Button -->
          <button 
            @click="handlePreparePayment"
            :disabled="loading || rechargeForm.amount < 5000"
            class="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-200 disabled:opacity-50 active:scale-95 flex items-center justify-center gap-2"
          >
            <Icon v-if="loading" name="lucide:loader-2" class="w-5 h-5 animate-spin" />
            <template v-else>
              <Icon name="lucide:credit-card" class="w-5 h-5" />
              <span>{{ $t('wallet.proceed_payment') }}</span>
            </template>
          </button>

          <div class="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400 font-medium">
            <Icon name="lucide:shield-check" class="w-4 h-4 text-sky-500" />
            <span>{{ $t('wallet.secured_by') }} Mercado Pago</span>
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
import { reactive, ref, onMounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useWalletStore } from '~/stores/wallet'
import { useAuthStore } from '~/stores/auth'

const toast = useToast()

const router = useRouter()
const walletStore = useWalletStore()
const authStore = useAuthStore()

const loading = ref(false)

const rechargeForm = reactive({
  amount: 5000
})

const payoutEnabled = ref(false)

onMounted(async () => {
    if (!authStore.isAuthenticated) {
        router.push('/login')
        return
    }
    await walletStore.fetchBalance()
    await walletStore.fetchTransactions()

    if (authStore.isPhotographer) {
      try {
        const { $api } = useNuxtApp()
        const pRes = await $api('/users/payout-settings')
        if (pRes) {
          payoutEnabled.value = !!pRes.payoutEnabled
        }
      } catch (e) {
        console.error('Error loading payout settings in wallet:', e)
      }
    }
})

function scrollToRecharge() {
  document.getElementById('recharge-section')?.scrollIntoView({ behavior: 'smooth' })
}

import { formatColombiaDateTime } from '~/utils/date'

function formatDate(dateString) {
  return formatColombiaDateTime(dateString)
}

async function handlePreparePayment() {
  if (rechargeForm.amount < 5000) {
    toast.error('Monto insuficiente', 'El monto mínimo de recarga es $5.000 COP')
    return
  }

  loading.value = true

  try {
    const data = await walletStore.prepareMercadoPagoTopUp(rechargeForm.amount)
    const checkoutUrl = data?.initPoint || data?.sandboxInitPoint
    if (!checkoutUrl) {
      throw new Error('No se recibió URL de Mercado Pago')
    }
    toast.info('Redirigiendo a Mercado Pago...')
    window.location.href = checkoutUrl
  } catch (e) {
    console.error('Payment preparation error:', e)
    toast.error('Error de pago', 'Error al preparar el pago en Mercado Pago. Por favor, intenta de nuevo.')
  } finally {
    loading.value = false
  }
}
</script>
