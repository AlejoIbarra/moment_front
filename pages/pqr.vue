<template>
  <div class="min-h-screen bg-[#070709] text-white pt-10 pb-20 px-4">
    <div class="max-w-2xl mx-auto">
      <!-- Top nav -->
      <div class="flex flex-wrap items-center justify-between gap-3 mb-8">
        <NuxtLink
          to="/legal#aviso"
          class="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#3ef4a1] transition-colors"
        >
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          Centro Legal y Privacidad
        </NuxtLink>

        <select
          v-model="selectedCountry"
          aria-label="País aplicable"
          class="text-xs font-bold bg-white/5 hover:bg-white/10 text-white border border-white/15 rounded-full px-3.5 py-1.5 focus:outline-none focus:border-[#3ef4a1] cursor-pointer"
        >
          <option
            v-for="country in COUNTRY_LEGAL_LIST"
            :key="country.code"
            :value="country.code"
            class="bg-[#0b0b0d] text-white"
          >
            {{ country.flag }} {{ country.name }}
          </option>
        </select>
      </div>

      <!-- Header -->
      <header class="mb-8">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3ef4a1]/10 border border-[#3ef4a1]/25 text-[#3ef4a1] text-[11px] font-extrabold uppercase tracking-wider mb-3">
          <Icon name="lucide:file-check-2" class="w-3.5 h-3.5" />
          Canal Oficial PQR · {{ profile.flag }} {{ profile.name }}
        </span>
        <h1 class="text-3xl sm:text-4xl font-black tracking-tight mb-2">
          Peticiones, quejas y reclamos
        </h1>
        <p class="text-sm text-gray-400 leading-relaxed">
          Cuéntanos qué pasó o qué necesitas. Al enviar, te damos un número de radicado con la fecha y la hora, enviamos copia a tu correo y notificamos directamente a <strong class="text-white">@mastermoments</strong>.
        </p>
      </header>

      <!-- Mode Switch Tabs -->
      <div class="grid grid-cols-2 p-1 rounded-2xl bg-white/5 border border-white/10 mb-6">
        <button
          type="button"
          @click="activeTab = 'submit'"
          :class="[
            'py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer',
            activeTab === 'submit' ? 'bg-[#3ef4a1] text-black shadow-sm' : 'text-gray-400 hover:text-white'
          ]"
        >
          Radicar solicitud
        </button>
        <button
          type="button"
          @click="activeTab = 'lookup'"
          :class="[
            'py-2.5 px-4 rounded-xl text-xs font-extrabold transition-all cursor-pointer',
            activeTab === 'lookup' ? 'bg-[#3ef4a1] text-black shadow-sm' : 'text-gray-400 hover:text-white'
          ]"
        >
          Consultar un radicado
        </button>
      </div>

      <!-- TAB 1: SUBMIT PQR -->
      <div v-if="activeTab === 'submit'" class="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10">
        <!-- Success Radicado Card -->
        <div v-if="submittedResult" class="text-center py-4 space-y-5">
          <div class="w-16 h-16 rounded-2xl bg-[#3ef4a1]/15 border border-[#3ef4a1]/30 text-[#3ef4a1] flex items-center justify-center mx-auto">
            <Icon name="lucide:check-circle-2" class="w-9 h-9" />
          </div>
          <div>
            <h2 class="text-2xl font-black text-white">¡Solicitud radicada!</h2>
            <p class="text-xs text-gray-400 mt-1">
              Enviamos una copia a tu correo y notificamos al administrador (@mastermoments).
            </p>
          </div>

          <div class="p-5 rounded-2xl bg-emerald-950/30 border border-[#3ef4a1]/30">
            <p class="text-[10px] font-extrabold uppercase tracking-widest text-[#3ef4a1] mb-1">Número de Radicado</p>
            <p class="text-2xl sm:text-3xl font-black tracking-wider text-white">{{ submittedResult.radicado }}</p>
            <p class="text-xs text-gray-400 mt-2">
              Fecha y hora: {{ submittedResult.createdAtFormatted }} · {{ submittedResult.requestType }}
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              type="button"
              @click="copyRadicado(submittedResult.radicado)"
              class="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-white transition-colors cursor-pointer"
            >
              {{ copied ? 'Radicado copiado ✓' : 'Copiar radicado' }}
            </button>
            <button
              type="button"
              @click="openLookupWithResult"
              class="px-5 py-3 rounded-xl bg-[#3ef4a1] hover:bg-[#2dd68a] text-xs font-extrabold text-black transition-colors cursor-pointer"
            >
              Consultar estado
            </button>
          </div>
        </div>

        <!-- Form -->
        <form v-else @submit.prevent="submitPqr" class="space-y-4">
          <div>
            <label class="block text-xs font-bold text-gray-300 mb-1.5">Tu nombre completo</label>
            <input
              v-model="form.fullName"
              type="text"
              required
              placeholder="Ej: Laura Martínez"
              class="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3ef4a1]"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-300 mb-1.5">Tu correo electrónico</label>
            <input
              v-model="form.email"
              type="email"
              required
              placeholder="tu@correo.com"
              class="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3ef4a1]"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-300 mb-1.5">Qué tipo de solicitud es</label>
            <select
              v-model="form.requestType"
              required
              class="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-sm text-white focus:outline-none focus:border-[#3ef4a1] cursor-pointer"
            >
              <option value="PETICION" class="bg-[#0b0b0d]">Petición</option>
              <option value="QUEJA" class="bg-[#0b0b0d]">Queja</option>
              <option value="RECLAMO" class="bg-[#0b0b0d]">Reclamo</option>
              <option value="DATOS_PERSONALES" class="bg-[#0b0b0d]">Consulta o reclamo sobre mis datos personales / imagen</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-300 mb-1.5">
              Código del pedido o enlace del evento <span class="text-gray-500 font-normal">(opcional)</span>
            </label>
            <input
              v-model="form.orderCode"
              type="text"
              placeholder="Ej: MOM-482137 o nombre del evento"
              class="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3ef4a1]"
            />
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-300 mb-1.5">Cuéntanos</label>
            <textarea
              v-model="form.message"
              required
              rows="4"
              minlength="8"
              placeholder="Describe detalladamente tu petición, queja, reclamo o solicitud sobre tus datos o fotografías..."
              class="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3ef4a1] resize-none"
            ></textarea>
          </div>

          <button
            type="submit"
            :disabled="submitting"
            class="w-full py-3.5 rounded-full bg-[#3ef4a1] hover:bg-[#2dd68a] disabled:opacity-50 text-black font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span v-if="submitting" class="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
            {{ submitting ? 'Radicando...' : 'Enviar solicitud' }}
          </button>

          <p class="text-[11px] text-gray-400 leading-relaxed pt-1">
            Usamos estos datos solo para atender tu solicitud conforme a {{ profile.dataLaw }}.
            {{ profile.responseSla }}
            <NuxtLink :to="`/legal?country=${selectedCountry}#datos`" class="text-[#3ef4a1] underline ml-1">Política de Datos</NuxtLink>
          </p>
        </form>
      </div>

      <!-- TAB 2: LOOKUP RADICADO -->
      <div v-else class="p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-6">
        <form @submit.prevent="lookupRadicado" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-xs font-bold text-gray-300 mb-1.5">Número de radicado</label>
              <input
                v-model="lookupForm.radicado"
                type="text"
                required
                placeholder="Ej: MOM-261120-4821"
                class="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3ef4a1]"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-300 mb-1.5">Correo electrónico</label>
              <input
                v-model="lookupForm.email"
                type="email"
                required
                placeholder="tu@correo.com"
                class="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3ef4a1]"
              />
            </div>
          </div>
          <button
            type="submit"
            :disabled="lookingUp"
            class="w-full py-3.5 rounded-full bg-[#3ef4a1] hover:bg-[#2dd68a] disabled:opacity-50 text-black font-extrabold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Icon name="lucide:search" class="w-4 h-4" />
            {{ lookingUp ? 'Buscando...' : 'Consultar radicado' }}
          </button>
        </form>

        <div v-if="lookupError" class="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
          {{ lookupError }}
        </div>

        <div v-if="lookupResult" class="p-5 rounded-2xl bg-black/50 border border-white/10 space-y-3">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <span class="text-sm font-black text-white">{{ lookupResult.radicado }}</span>
            <span class="px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#3ef4a1]/15 text-[#3ef4a1] border border-[#3ef4a1]/30">
              {{ lookupResult.status }}
            </span>
          </div>
          <p class="text-xs text-gray-400">
            {{ lookupResult.requestType }} · Radicado el {{ formatDateTime(lookupResult.createdAt) }}
          </p>
          <div class="p-3.5 rounded-xl bg-white/[0.03] border border-white/5 text-xs text-gray-300 whitespace-pre-wrap">
            {{ lookupResult.message }}
          </div>
          <div v-if="lookupResult.adminResponse" class="p-4 rounded-xl bg-emerald-950/30 border border-[#3ef4a1]/30">
            <p class="text-[10px] font-extrabold uppercase tracking-wider text-[#3ef4a1] mb-1">Respuesta oficial de Moments</p>
            <p class="text-xs text-white whitespace-pre-wrap leading-relaxed">{{ lookupResult.adminResponse }}</p>
          </div>
          <p v-else class="text-xs text-gray-500 italic">
            Tu solicitud está en cola de atención. Te notificaremos por correo en cuanto haya respuesta.
          </p>
        </div>
      </div>

      <!-- Footer Legal Strip -->
      <div class="mt-8 text-center text-xs text-gray-500 space-y-1">
        <p>Autoridad de protección al consumidor en {{ profile.name }}: <strong class="text-gray-300">{{ profile.authority }}</strong></p>
        <p>¿Prefieres contacto directo? <a href="mailto:alejandroibarrab0532@gmail.com" class="text-[#3ef4a1] underline">alejandroibarrab0532@gmail.com</a> · <a href="https://wa.me/573245124346" target="_blank" rel="noopener" class="text-[#3ef4a1] underline">WhatsApp +57 324 512 4346</a></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import {
  COUNTRY_LEGAL_LIST,
  COUNTRY_LEGAL_PROFILES,
  detectUserCountryCode
} from '~/utils/biometricLegalByCountry'

const route = useRoute()
const config = useRuntimeConfig()
const authStore = useAuthStore()
const toast = useToast()

const selectedCountry = ref(detectUserCountryCode())
const profile = computed(() => COUNTRY_LEGAL_PROFILES[selectedCountry.value] || COUNTRY_LEGAL_PROFILES.CO)

const activeTab = ref(route.query.tab === 'lookup' ? 'lookup' : 'submit')
const submitting = ref(false)
const submittedResult = ref(null)
const copied = ref(false)

const form = reactive({
  fullName: authStore.user?.fullName || '',
  email: authStore.user?.email || '',
  requestType: 'PETICION',
  orderCode: '',
  message: ''
})

const lookupForm = reactive({
  radicado: typeof route.query.radicado === 'string' ? route.query.radicado : '',
  email: ''
})
const lookingUp = ref(false)
const lookupResult = ref(null)
const lookupError = ref('')

async function submitPqr() {
  submitting.value = true
  try {
    const headers = authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}
    const res = await $fetch(`${config.public.apiBase}/pqr`, {
      method: 'POST',
      headers,
      body: {
        fullName: form.fullName,
        email: form.email,
        countryCode: selectedCountry.value,
        requestType: form.requestType,
        orderCode: form.orderCode,
        message: form.message
      }
    })
    submittedResult.value = res
    toast.success('Solicitud radicada', `Tu número de radicado es ${res.radicado}`)
  } catch (e) {
    const msg = e?.data?.message || e?.data?.error || 'No se pudo radicar tu solicitud. Verifica los datos.'
    toast.error('Error', msg)
  } finally {
    submitting.value = false
  }
}

async function copyRadicado(rad) {
  try {
    await navigator.clipboard.writeText(rad)
    copied.value = true
    setTimeout(() => { copied.value = false }, 2500)
  } catch {}
}

function openLookupWithResult() {
  lookupForm.radicado = submittedResult.value?.radicado || ''
  lookupForm.email = form.email
  activeTab.value = 'lookup'
  lookupRadicado()
}

async function lookupRadicado() {
  lookingUp.value = true
  lookupError.value = ''
  lookupResult.value = null
  try {
    const res = await $fetch(`${config.public.apiBase}/pqr/lookup`, {
      params: {
        radicado: lookupForm.radicado.trim(),
        email: lookupForm.email.trim()
      }
    })
    lookupResult.value = res
  } catch (e) {
    lookupError.value = e?.data?.message || e?.data?.error || 'No encontramos una solicitud con ese radicado y correo.'
  } finally {
    lookingUp.value = false
  }
}

function formatDateTime(iso) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString('es-CO')
  } catch {
    return iso
  }
}

useSeoMeta({
  title: 'Peticiones, Quejas y Reclamos (PQR) | Moments',
  description: 'Radica una petición, queja, reclamo o consulta sobre tus datos personales en Moments y consulta el estado con tu número de radicado.'
})
</script>
