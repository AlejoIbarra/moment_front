<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="flex items-center gap-4 mb-8">
      <button @click="$router.push('/dashboard/photographer')" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
        <Icon name="lucide:arrow-left" class="w-6 h-6 text-gray-800" />
      </button>
      <h1 class="text-2xl font-bold text-gray-900">Configuración de Perfil</h1>
    </div>

    <!-- Profile Photo -->
    <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
      <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Foto de Perfil</h3>
      <div class="flex items-center gap-6">
        <div class="relative group cursor-pointer" @click="$refs.profileInput.click()">
          <div class="w-24 h-24 rounded-full bg-[#3ef4a1] p-[3px]">
            <div class="w-full h-full rounded-full bg-white p-[3px]">
              <div class="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                <img v-if="authStore.user?.profilePhotoUrl" :src="authStore.user.profilePhotoUrl" alt="Profile" class="w-full h-full object-cover" />
                <Icon v-else name="lucide:camera" class="w-10 h-10 text-gray-300" />
              </div>
            </div>
          </div>
          <div class="absolute inset-0 rounded-full bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Icon name="lucide:upload" class="w-6 h-6 text-white" />
          </div>
          <input type="file" ref="profileInput" class="hidden" accept="image/*" @change="uploadProfilePhoto" />
        </div>
        <div>
          <p class="font-bold text-gray-900">{{ authStore.user?.username }}</p>
          <p class="text-sm text-gray-500">Haz clic en la foto para cambiarla</p>
          <p v-if="uploadingProfile" class="text-xs text-indigo-600 font-semibold mt-1">Subiendo...</p>
        </div>
      </div>
    </div>

    <!-- Edit Username UI -->
    <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
      <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Nombre de Usuario</h3>
      <p class="text-sm text-gray-500 mb-4">Modifica tu nombre de usuario público. Nota: Cambiar tu nombre de usuario invalida los enlaces antiguos a tu perfil.</p>
      <div class="flex flex-col items-end gap-3">
        <input 
          type="text"
          v-model="usernameText" 
          maxlength="30"
          placeholder="Ej: juanperez123"
          class="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-sm"
        />
        <div class="w-full flex justify-between items-center">
            <span class="text-xs text-gray-400">{{ usernameText?.length || 0 }} / 30</span>
            <button @click="updateUsername" class="px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-lg hover:bg-indigo-700 transition-colors" :disabled="savingUsername || usernameText === authStore.user?.username">
                {{ savingUsername ? 'Guardando...' : 'Guardar Nombre de Usuario' }}
            </button>
        </div>
        <p v-if="usernameSuccess" class="text-xs text-green-600 font-semibold mt-1">✓ Nombre de usuario actualizado</p>
      </div>
    </div>

    <!-- Profile Description (Bio) -->
    <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
      <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Biografía</h3>
      <p class="text-sm text-gray-500 mb-4">
        Escribe una breve descripción sobre ti y tu trabajo fotográfico.
      </p>
      
      <div class="flex flex-col items-end gap-3">
        <textarea 
          v-model="descriptionText" 
          rows="3" 
          maxlength="1000"
          placeholder="Ej: Professional event photographer capturing your best moments. 📸✨"
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

    <!-- Watermark Logo -->
    <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
      <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Logo de Marca de Agua</h3>
      <p class="text-sm text-gray-500 mb-4">
        Este logo se superpondrá en tus fotos como marca de agua. Recomendamos un PNG con fondo transparente.
      </p>

      <div class="flex flex-col sm:flex-row items-start gap-6">
        <!-- Current Logo Preview -->
        <div class="relative group cursor-pointer" @click="$refs.logoInput.click()">
          <div class="w-32 h-32 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden hover:border-indigo-400 hover:bg-indigo-50 transition-all">
            <img v-if="watermarkLogoUrl" :src="watermarkLogoUrl" alt="Watermark Logo" class="w-full h-full object-contain p-2" />
            <div v-else class="text-center">
              <Icon name="lucide:image-plus" class="w-10 h-10 text-gray-300 mx-auto mb-1" />
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Subir Logo</span>
            </div>
          </div>
          <div v-if="watermarkLogoUrl" class="absolute inset-0 rounded-2xl bg-black/25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Icon name="lucide:upload" class="w-8 h-8 text-white" />
          </div>
          <input type="file" ref="logoInput" class="hidden" accept="image/png, image/svg+xml, image/jpeg" @change="uploadWatermarkLogo" />
        </div>

        <div class="flex-1">
          <div class="space-y-3 text-sm">
            <div class="flex items-start gap-2 text-gray-600">
              <Icon name="lucide:check-circle" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Formato recomendado: <strong>PNG</strong> con fondo transparente</span>
            </div>
            <div class="flex items-start gap-2 text-gray-600">
              <Icon name="lucide:check-circle" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Se aplicará con <strong>50% de opacidad</strong> sobre tus fotos</span>
            </div>
            <div class="flex items-start gap-2 text-gray-600">
              <Icon name="lucide:check-circle" class="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Tamaño mínimo sugerido: <strong>300x300 px</strong></span>
            </div>
          </div>
          <p v-if="uploadingLogo" class="text-xs text-indigo-600 font-semibold mt-3">Subiendo logo...</p>
          <p v-if="logoSuccess" class="text-xs text-green-600 font-semibold mt-3">✓ Logo actualizado correctamente</p>

          <button v-if="watermarkLogoUrl" @click="removeLogo"
                  class="mt-4 px-4 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors">
            Eliminar Logo
          </button>
        </div>
      </div>
    </div>

    <!-- Preview Section -->
    <div v-if="watermarkLogoUrl" class="bg-white border border-gray-200 rounded-2xl p-6">
      <h3 class="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Vista Previa de Marca de Agua</h3>
      <div class="relative w-full aspect-video bg-gray-800 rounded-xl overflow-hidden flex items-center justify-center">
        <div class="absolute inset-0 flex items-center justify-center">
          <p class="text-gray-500 text-sm">Ejemplo de cómo se verá tu marca de agua</p>
        </div>
        <img :src="watermarkLogoUrl" class="relative w-1/3" style="transform: rotate(-30deg); opacity: 0.85;" />
      </div>
    </div>

    <!-- Payout Settings Card (Wompi Split / Nequi / Bancolombia) -->
    <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Icon name="lucide:credit-card" class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-900">Datos Bancarios para Dispersión Directa</h3>
            <p class="text-xs text-gray-500">Recibe tus ganancias directamente en tu Nequi o cuenta bancaria sin retenciones manuales</p>
          </div>
        </div>
        <span 
          :class="[payoutData.payoutEnabled ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200', 'px-2.5 py-1 rounded-full text-[11px] font-extrabold border']"
        >
          {{ payoutData.payoutEnabled ? '✓ Configurado' : 'Pendiente' }}
        </span>
      </div>

      <div class="space-y-4 pt-2">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Nombre Completo del Titular</label>
            <input 
              v-model="payoutData.accountHolder" 
              type="text" 
              placeholder="Ej: Carlos Andrés Gómez" 
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Banco o Billetera</label>
            <select 
              v-model="payoutData.bankName" 
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            >
              <option value="">Selecciona tu banco o billetera</option>
              <option value="NEQUI">Nequi (Bancolombia)</option>
              <option value="BANCOLOMBIA">Bancolombia</option>
              <option value="DAVIPLATA">Daviplata</option>
              <option value="DAVIVIENDA">Davivienda</option>
              <option value="BBVA">BBVA Colombia</option>
              <option value="BANCO_DE_BOGOTA">Banco de Bogotá</option>
              <option value="DALE">Dale!</option>
              <option value="OTRO">Otro banco nacional</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Tipo de Documento</label>
            <select 
              v-model="payoutData.documentType" 
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            >
              <option value="CC">Cédula de Ciudadanía (CC)</option>
              <option value="NIT">NIT / Empresa</option>
              <option value="CE">Cédula de Extranjería (CE)</option>
              <option value="PASSPORT">Pasaporte</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Número de Documento</label>
            <input 
              v-model="payoutData.documentNumber" 
              type="text" 
              placeholder="Ej: 1085234567" 
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>
          <div>
            <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Tipo de Cuenta</label>
            <select 
              v-model="payoutData.accountType" 
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 text-sm bg-white"
            >
              <option value="AHORROS">Cuenta de Ahorros</option>
              <option value="NEQUI">Depósito Electrónico (Nequi/Daviplata)</option>
              <option value="CORRIENTE">Cuenta Corriente</option>
            </select>
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Número de Cuenta o Celular Nequi</label>
          <input 
            v-model="payoutData.accountNumber" 
            type="text" 
            placeholder="Ej: 3001234567" 
            class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 text-sm font-mono"
          />
        </div>

        <div v-if="payoutData.wompiSubmerchantId" class="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-800">
          <span class="font-bold flex items-center gap-1.5">
            <Icon name="lucide:check-circle" class="w-4 h-4 text-emerald-600" />
            ID Subcomercio Wompi Activo:
          </span>
          <code class="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-emerald-300">{{ payoutData.wompiSubmerchantId }}</code>
        </div>

        <div class="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="flex items-center gap-2 text-xs text-gray-500">
            <Icon name="lucide:shield-check" class="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Tus datos son encriptados y procesados mediante la red segura de Wompi / Bancolombia.</span>
          </div>
          <button 
            @click="savePayoutSettings" 
            :disabled="savingPayout"
            class="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Icon v-if="savingPayout" name="lucide:loader-2" class="w-4 h-4 animate-spin text-slate-950" />
            <Icon v-else name="lucide:save" class="w-4 h-4 text-slate-950" />
            <span>{{ savingPayout ? 'Guardando...' : 'Guardar Datos Bancarios' }}</span>
          </button>
        </div>
        <p v-if="payoutSuccess" class="text-xs text-green-600 font-semibold mt-1">✓ Datos bancarios actualizados correctamente</p>
      </div>
    </div>

    <!-- Mercado Pago Marketplace (Split Automático) Card -->
    <div class="bg-gradient-to-r from-blue-50/70 via-sky-50/50 to-white border border-blue-200/80 rounded-2xl p-6 mb-6 shadow-sm">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-2xl bg-[#009ee3] text-white flex items-center justify-center shadow-md shrink-0 font-black text-lg">
            <Icon name="lucide:hand-coins" class="w-6 h-6 text-white" />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-base font-bold text-gray-900">Mercado Pago Marketplace</h3>
              <span class="px-2 py-0.5 rounded text-[10px] font-black uppercase bg-blue-100 text-blue-800">Split Automático</span>
            </div>
            <p class="text-xs text-gray-600 mt-0.5">
              Conecta tu cuenta de Mercado Pago con 1 clic para que tus ganancias de cada venta se acrediten en tu cuenta al instante.
            </p>
          </div>
        </div>

        <span 
          :class="[mpStatus.connected ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : 'bg-gray-100 text-gray-600 border-gray-200', 'px-3 py-1 rounded-full text-xs font-black border shrink-0 text-center']"
        >
          {{ mpStatus.connected ? '✓ Conectado con Mercado Pago' : 'No Conectado' }}
        </span>
      </div>

      <!-- Connected State -->
      <div v-if="mpStatus.connected" class="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="space-y-0.5">
          <p class="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
            <Icon name="lucide:check-circle-2" class="w-4 h-4 text-emerald-600" />
            Tu cuenta de Mercado Pago está vinculada y lista para recibir pagos
          </p>
          <p class="text-[11px] text-emerald-800 font-mono">
            ID de Vendedor: {{ mpStatus.userId }} <span v-if="mpStatus.nickname">({{ mpStatus.nickname }})</span>
          </p>
        </div>
        <button 
          @click="disconnectMercadoPago"
          :disabled="disconnectingMp"
          class="shrink-0 px-3.5 py-1.5 bg-white hover:bg-rose-50 text-rose-600 border border-rose-200 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
        >
          {{ disconnectingMp ? 'Desconectando...' : 'Desconectar cuenta' }}
        </button>
      </div>

      <!-- Disconnected State -->
      <div v-else class="space-y-3 pt-2">
        <div class="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-900 leading-relaxed">
          <p class="font-bold flex items-center gap-1.5 mb-1">
            <Icon name="lucide:sparkles" class="w-3.5 h-3.5 text-blue-600" />
            ¿Cómo funciona el Split con Mercado Pago?
          </p>
          Al conectar tu cuenta, cada vez que un comprador adquiere fotos de tus eventos, Mercado Pago divide la transacción en el acto: la comisión de la plataforma se envía a Moments y <strong>tu 85% neto cae directamente en tu billetera de Mercado Pago en el mismo segundo</strong>.
        </div>

        <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
          <span class="text-xs text-gray-500 flex items-center gap-1.5">
            <Icon name="lucide:shield-check" class="w-4 h-4 text-emerald-600" />
            Autorización 100% oficial y segura vía OAuth de Mercado Pago
          </span>
          <button 
            @click="connectMercadoPago" 
            :disabled="connectingMp"
            class="w-full sm:w-auto px-6 py-3 bg-[#009ee3] hover:bg-[#0082ba] text-white font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-95"
          >
            <Icon v-if="connectingMp" name="lucide:loader-2" class="w-4 h-4 animate-spin text-white" />
            <Icon v-else name="lucide:link" class="w-4 h-4 text-white" />
            <span>{{ connectingMp ? 'Conectando con Mercado Pago...' : 'Conectar mi cuenta de Mercado Pago' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Accessibility Settings Card -->
    <div class="bg-white border border-gray-200 rounded-2xl p-6 mb-6 shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Icon name="lucide:accessibility" class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-gray-900">Accesibilidad Universal</h3>
            <p class="text-xs text-gray-500">Configura alto contraste, tamaño de texto y opciones para dislexia</p>
          </div>
        </div>
        <button 
          @click="accessibility.isOpen.value = true"
          type="button"
          class="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5"
        >
          <Icon name="lucide:sliders" class="w-4 h-4" />
          Configurar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { useAccessibility } from '~/composables/useAccessibility'

const { $api } = useNuxtApp()
const authStore = useAuthStore()
const accessibility = useAccessibility()
const router = useRouter()
const { confirm } = useConfirm()
const toast = useToast()

const uploadingProfile = ref(false)
const uploadingLogo = ref(false)
const logoSuccess = ref(false)
const watermarkLogoUrl = ref('')

const usernameText = ref('')
const savingUsername = ref(false)
const usernameSuccess = ref(false)

const descriptionText = ref('')
const savingDescription = ref(false)
const descriptionSuccess = ref(false)

onMounted(async () => {
    if (!authStore.isPhotographer) {
        router.push('/')
        return
    }
    
    // Set current username and description
    usernameText.value = authStore.user?.username || ''
    descriptionText.value = authStore.user?.description || ''

    // Fetch current watermark logo
    try {
        const res = await $api('/users/watermark-logo')
        watermarkLogoUrl.value = res.url || ''
    } catch (e) {
        console.error(e)
    }

    // Fetch payout / bank settings
    try {
        const pRes = await $api('/users/payout-settings')
        if (pRes) {
            payoutData.value = {
                accountHolder: pRes.accountHolder || '',
                bankName: pRes.bankName || '',
                documentType: pRes.documentType || 'CC',
                documentNumber: pRes.documentNumber || '',
                accountType: pRes.accountType || 'AHORROS',
                accountNumber: pRes.accountNumber || '',
                wompiSubmerchantId: pRes.wompiSubmerchantId || '',
                payoutEnabled: !!pRes.payoutEnabled
            }
        }
    } catch (e) {
        console.error('Error fetching payout settings:', e)
    }

    // Fetch Mercado Pago Marketplace status
    await fetchMercadoPagoStatus()
})

const mpStatus = ref({
    connected: false,
    userId: null,
    nickname: null
})
const connectingMp = ref(false)
const disconnectingMp = ref(false)

async function fetchMercadoPagoStatus() {
    try {
        const res = await $api('/mercadopago/status')
        if (res) {
            mpStatus.value = {
                connected: !!res.connected,
                userId: res.userId || null,
                nickname: res.nickname || null
            }
        }
    } catch (e) {
        console.error('Error fetching Mercado Pago status:', e)
    }
}

async function connectMercadoPago() {
    if (connectingMp.value) return
    connectingMp.value = true
    try {
        const res = await $api('/mercadopago/connect-url')
        if (res && res.url) {
            window.location.href = res.url
        } else {
            toast.error('Error', 'No se pudo generar el enlace de conexión con Mercado Pago.')
        }
    } catch (e) {
        console.error(e)
        toast.error('Error', 'Error al conectar con Mercado Pago.')
    } finally {
        connectingMp.value = false
    }
}

async function disconnectMercadoPago() {
    if (disconnectingMp.value) return
    const confirmed = await confirm({
        title: 'Desconectar Mercado Pago',
        message: '¿Estás seguro de que deseas desconectar tu cuenta de Mercado Pago?',
        confirmText: 'Desconectar',
        cancelText: 'Cancelar'
    })
    if (!confirmed) return

    disconnectingMp.value = true
    try {
        const res = await $api('/mercadopago/disconnect', { method: 'POST' })
        if (res && res.success) {
            mpStatus.value.connected = false
            mpStatus.value.userId = null
            mpStatus.value.nickname = null
            toast.success('Desconectado', 'Tu cuenta de Mercado Pago ha sido desvinculada.')
        }
    } catch (e) {
        console.error(e)
        toast.error('Error', 'No se pudo desconectar la cuenta.')
    } finally {
        disconnectingMp.value = false
    }
}

const payoutData = ref({
    accountHolder: '',
    bankName: '',
    documentType: 'CC',
    documentNumber: '',
    accountType: 'AHORROS',
    accountNumber: '',
    wompiSubmerchantId: '',
    payoutEnabled: false
})
const savingPayout = ref(false)
const payoutSuccess = ref(false)

async function savePayoutSettings() {
    if (savingPayout.value) return
    savingPayout.value = true
    try {
        const res = await $api('/users/payout-settings', {
            method: 'PUT',
            body: payoutData.value
        })
        if (res) {
            payoutData.value.payoutEnabled = !!res.payoutEnabled
            payoutData.value.wompiSubmerchantId = res.wompiSubmerchantId || ''
            payoutSuccess.value = true
            toast.success('Datos Bancarios Guardados', 'Tu información para dispersión directa ha sido actualizada.')
            setTimeout(() => { payoutSuccess.value = false }, 4000)
        }
    } catch (e) {
        console.error(e)
        toast.error('Error', 'No se pudieron guardar los datos bancarios.')
    } finally {
        savingPayout.value = false
    }
}

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

async function uploadProfilePhoto(event) {
    const file = event.target.files[0]
    if (!file) return
    uploadingProfile.value = true
    try {
        const { compressImage } = useImageActions()
        const optimizedFile = await compressImage(file)

        const formData = new FormData()
        formData.append('file', optimizedFile)
        const config = useRuntimeConfig()
        const res = await $fetch(`${config.public.apiBase}/photos/upload-public`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${authStore.token}` },
            body: formData
        })
        await $fetch(`${config.public.apiBase}/users/profile-photo`, {
            method: 'PUT',
            headers: { 
                Authorization: `Bearer ${authStore.token}`,
                'Content-Type': 'text/plain' 
            },
            body: res.url
        })
        authStore.updateUserData({ profilePhotoUrl: res.url })
    } catch (e) {
        console.error(e)
        toast.error('Error', 'Error al subir la foto de perfil')
    } finally {
        uploadingProfile.value = false
    }
}

async function updateDescription() {
    if (savingDescription.value) return
    savingDescription.value = true
    try {
        const config = useRuntimeConfig()
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

async function uploadWatermarkLogo(event) {
    const file = event.target.files[0]
    if (!file) return
    uploadingLogo.value = true
    logoSuccess.value = false
    try {
        const { compressImage } = useImageActions()
        // For watermark logos, we maintain PNG to preserve transparency but limit size
        const optimizedFile = await compressImage(file, { 
            maxWidth: 1000, 
            maxHeight: 1000, 
            quality: 0.9, 
            type: 'image/png' 
        })

        const formData = new FormData()
        formData.append('file', optimizedFile)
        const config = useRuntimeConfig()
        const res = await $fetch(`${config.public.apiBase}/photos/upload-public`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${authStore.token}` },
            body: formData
        })
        await $fetch(`${config.public.apiBase}/users/watermark-logo`, {
            method: 'PUT',
            headers: { 
                Authorization: `Bearer ${authStore.token}`,
                'Content-Type': 'text/plain' 
            },
            body: res.url
        })
        watermarkLogoUrl.value = res.url
        logoSuccess.value = true
        setTimeout(() => { logoSuccess.value = false }, 3000)
    } catch (e) {
        console.error(e)
        toast.error('Error', 'Error al subir el logo')
    } finally {
        uploadingLogo.value = false
    }
}

async function removeLogo() {
    const ok = await confirm({
        title: '¿Eliminar marca de agua?',
        message: '¿Estás seguro de que quieres eliminar tu logo de marca de agua?'
    })
    if (!ok) return
    try {
        const config = useRuntimeConfig()
        let deleted = false
        try {
            await $fetch(`${config.public.apiBase}/users/watermark-logo`, {
                method: 'DELETE',
                headers: { 
                    Authorization: `Bearer ${authStore.token}` 
                }
            })
            deleted = true
        } catch (delError) {
            console.warn('DELETE not supported, falling back to PUT', delError)
        }

        if (!deleted) {
            await $fetch(`${config.public.apiBase}/users/watermark-logo`, {
                method: 'PUT',
                headers: { 
                    Authorization: `Bearer ${authStore.token}`,
                    'Content-Type': 'text/plain' 
                },
                body: ''
            })
        }

        watermarkLogoUrl.value = ''
        toast.success('Marca de agua eliminada', 'El logo de marca de agua ha sido eliminado exitosamente.')
    } catch (e) {
        console.error('Error al eliminar marca de agua:', e)
        toast.error('Error', 'No se pudo eliminar la marca de agua')
    }
}
</script>
