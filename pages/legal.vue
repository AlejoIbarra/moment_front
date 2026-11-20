<template>
  <div class="min-h-screen bg-[#070709] text-white pt-10 pb-20 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Top Bar -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#3ef4a1] transition-colors"
        >
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          Volver a Moments
        </NuxtLink>

        <!-- Country Selector -->
        <div class="flex items-center gap-2">
          <span class="text-xs text-gray-400 font-semibold">Normativa por país:</span>
          <select
            v-model="selectedCountry"
            aria-label="Seleccionar país para normativa legal"
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
      </div>

      <!-- Hero Header -->
      <header class="mb-10">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3ef4a1]/10 border border-[#3ef4a1]/25 text-[#3ef4a1] text-[11px] font-extrabold uppercase tracking-wider mb-4">
          <Icon name="lucide:shield-check" class="w-3.5 h-3.5" />
          Centro Legal · {{ profile.flag }} {{ profile.name }}
        </span>
        <h1 class="text-3xl sm:text-5xl font-black tracking-tight mb-3">
          Documentos Legales de Moments
        </h1>
        <p class="text-sm sm:text-base text-gray-400 leading-relaxed max-w-2xl">
          Transparencia total sobre el funcionamiento de la plataforma, tus derechos como usuario o comprador, la privacidad de tus datos y el uso de reconocimiento facial (selfie) adaptado a <strong class="text-white">{{ profile.name }}</strong>.
        </p>

        <!-- Quick Anchor Pills -->
        <nav class="flex flex-wrap gap-2 mt-6">
          <a href="#aviso" class="px-3.5 py-2 rounded-xl bg-[#3ef4a1] text-black font-extrabold text-xs hover:bg-[#2dd68a] transition-colors">
            Aviso de Privacidad
          </a>
          <a href="#autorizacion" class="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-200 transition-colors">
            Autorización Biométrica (Selfie)
          </a>
          <a href="#datos" class="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-200 transition-colors">
            Política de Datos Personales
          </a>
          <a href="#terminos" class="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-200 transition-colors">
            Términos y Responsabilidad
          </a>
        </nav>
      </header>

      <!-- Country Legal Summary Strip -->
      <section class="p-5 sm:p-6 rounded-2xl bg-emerald-950/20 border border-[#3ef4a1]/25 mb-10">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <p class="text-gray-400 uppercase font-bold tracking-wider text-[10px] mb-1">Ley de Protección de Datos</p>
            <p class="text-white font-semibold">{{ profile.dataLaw }}</p>
          </div>
          <div>
            <p class="text-gray-400 uppercase font-bold tracking-wider text-[10px] mb-1">Autoridad de Control</p>
            <p class="text-white font-semibold">{{ profile.authority }}</p>
          </div>
          <div>
            <p class="text-gray-400 uppercase font-bold tracking-wider text-[10px] mb-1">Protección al Consumidor</p>
            <p class="text-gray-200">{{ profile.consumerLaw }}</p>
          </div>
          <div>
            <p class="text-gray-400 uppercase font-bold tracking-wider text-[10px] mb-1">Plazo de Respuesta</p>
            <p class="text-gray-200">{{ profile.responseSla }}</p>
          </div>
        </div>
      </section>

      <div class="space-y-8">
        <!-- 1. AVISO DE PRIVACIDAD -->
        <section id="aviso" class="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10">
          <div class="flex items-center gap-2 text-[#3ef4a1] text-xs font-extrabold uppercase tracking-wider mb-2">
            <Icon name="lucide:file-text" class="w-4 h-4" />
            Documento 01 · #aviso
          </div>
          <h2 class="text-2xl font-black mb-4">Aviso de Privacidad — {{ profile.flag }} {{ profile.name }}</h2>
          <div class="space-y-3 text-sm text-gray-300 leading-relaxed">
            <p>
              <strong class="text-white">Moments</strong> (<span class="text-[#3ef4a1]">www.moments-gallery.com</span>) informa a los titulares de datos personales en <strong class="text-white">{{ profile.name }}</strong> que los datos recolectados a través de la plataforma serán tratados conforme a <strong class="text-white">{{ profile.dataLaw }}</strong>.
            </p>
            <ul class="list-disc pl-5 space-y-2">
              <li><strong class="text-white">Finalidades principales:</strong> permitir el acceso a álbumes de eventos públicos o privados, localizar fotografías mediante búsqueda por número de dorsal o reconocimiento facial voluntario (selfie), procesar pagos y entregar descargas digitales en alta resolución.</li>
              <li><strong class="text-white">Datos sensibles (biometría):</strong> la entrega de una selfie y su comparación facial son <strong>completamente opcionales</strong>. Ningún usuario está obligado a autorizarlas.</li>
              <li><strong class="text-white">Tus derechos:</strong> {{ profile.rightsSummary }}</li>
              <li><strong class="text-white">Canales de atención y reclamos (PQR):</strong> correo <a href="mailto:alejandroibarrab0532@gmail.com" class="text-[#3ef4a1] underline">alejandroibarrab0532@gmail.com</a> / <a href="mailto:contacto@moments-gallery.com" class="text-[#3ef4a1] underline">contacto@moments-gallery.com</a> o WhatsApp oficial <a href="https://wa.me/573245124346" target="_blank" rel="noopener" class="text-[#3ef4a1] underline">+57 324 512 4346</a>.</li>
              <li><strong class="text-white">Tiempos de respuesta:</strong> {{ profile.responseSla }}</li>
            </ul>
          </div>
        </section>

        <!-- 2. AUTORIZACIÓN DE USO DE IMAGEN Y DATOS BIOMÉTRICOS -->
        <section id="autorizacion" class="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10">
          <div class="flex items-center gap-2 text-[#3ef4a1] text-xs font-extrabold uppercase tracking-wider mb-2">
            <Icon name="lucide:scan-face" class="w-4 h-4" />
            Documento 02 · #autorizacion
          </div>
          <h2 class="text-2xl font-black mb-2">Autorización de Uso de Imagen y Datos Biométricos</h2>
          <p class="text-xs text-gray-400 mb-6">Versión vigente: {{ BIOMETRIC_CONSENT_VERSION }}</p>

          <div class="space-y-4">
            <div v-for="sec in biometricSections" :key="sec.title" class="p-4 rounded-2xl bg-black/40 border border-white/5">
              <h3 class="text-xs font-extrabold uppercase tracking-wider text-[#3ef4a1] mb-1">{{ sec.title }}</h3>
              <p class="text-sm text-gray-300 leading-relaxed">{{ sec.body }}</p>
            </div>
            <div class="p-4 rounded-2xl bg-black/40 border border-white/5">
              <h3 class="text-xs font-extrabold uppercase tracking-wider text-[#3ef4a1] mb-1">Menores de edad en {{ profile.name }}</h3>
              <p class="text-sm text-gray-300 leading-relaxed">{{ profile.minorsRule }}</p>
            </div>
          </div>
        </section>

        <!-- 3. POLÍTICA DE TRATAMIENTO DE DATOS -->
        <section id="datos" class="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10">
          <div class="flex items-center gap-2 text-[#3ef4a1] text-xs font-extrabold uppercase tracking-wider mb-2">
            <Icon name="lucide:database" class="w-4 h-4" />
            Documento 03 · #datos
          </div>
          <h2 class="text-2xl font-black mb-4">Política de Tratamiento de Datos Personales</h2>
          <div class="space-y-3 text-sm text-gray-300 leading-relaxed">
            <p>
              <strong class="text-white">Selfie del usuario:</strong> se procesa únicamente en memoria durante la búsqueda y se elimina inmediatamente al terminar la consulta. No se almacena en servidores ni se comparte con terceros para publicidad o entrenamiento de IA.
            </p>
            <p>
              <strong class="text-white">Vectores faciales de álbumes:</strong> los datos matemáticos extraídos para permitir la búsqueda en un evento se eliminan automáticamente al cumplirse <strong class="text-white">1 año (365 días)</strong> desde la fecha del evento.
            </p>
            <p>
              <strong class="text-white">Evidencia del consentimiento:</strong> conservamos fecha, hora, país seleccionado, versión del texto aceptado, dirección IP y agente de usuario como prueba legal de autorización.
            </p>
            <p class="pt-2">
              Consulta el documento completo en
              <NuxtLink to="/privacy" class="text-[#3ef4a1] underline font-semibold">Política de Privacidad</NuxtLink> y
              <NuxtLink to="/data-deletion" class="text-[#3ef4a1] underline font-semibold">Eliminación de Datos</NuxtLink>.
            </p>
          </div>
        </section>

        <!-- 4. TÉRMINOS Y RESPONSABILIDAD -->
        <section id="terminos" class="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10">
          <div class="flex items-center gap-2 text-[#3ef4a1] text-xs font-extrabold uppercase tracking-wider mb-2">
            <Icon name="lucide:scale" class="w-4 h-4" />
            Documento 04 · #terminos
          </div>
          <h2 class="text-2xl font-black mb-4">Términos, Alcance del Reconocimiento Facial y Responsabilidad</h2>
          <div class="space-y-3 text-sm text-gray-300 leading-relaxed">
            <p>
              <strong class="text-white">Naturaleza de la plataforma:</strong> Moments es una plataforma tecnológica que conecta fotógrafos independientes y organizadores de eventos con los asistentes para facilitar la búsqueda y compra de fotografías digitales.
            </p>
            <p>
              <strong class="text-white">Precisión aproximada:</strong> la búsqueda por selfie y la lectura automática de dorsales (OCR) son herramientas de coincidencia asistida por IA. Pueden no localizar el 100% de las fotografías (por ángulos, gafas, casco, poca luz o movimiento); el usuario siempre puede revisar la galería manualmente o buscar por dorsal.
            </p>
            <p>
              <strong class="text-white">Retiro o bloqueo de contenido:</strong> si apareces en una fotografía y deseas solicitar su revisión o retiro, o reportar un evento que no corresponde, puedes usar el botón de reporte dentro del álbum o escribirnos directamente por correo o WhatsApp.
            </p>
            <div class="flex flex-wrap gap-3 pt-3 text-xs">
              <NuxtLink to="/terms-user" class="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-semibold">Términos para Usuarios</NuxtLink>
              <NuxtLink to="/terms-photographer" class="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-semibold">Términos para Fotógrafos</NuxtLink>
              <NuxtLink to="/refunds" class="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-semibold">Política de Reembolsos</NuxtLink>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  BIOMETRIC_CONSENT_VERSION,
  COUNTRY_LEGAL_LIST,
  COUNTRY_LEGAL_PROFILES,
  detectUserCountryCode,
  getBiometricConsentSections
} from '~/utils/biometricLegalByCountry'

const route = useRoute()
const queryCountry = typeof route.query.country === 'string' ? route.query.country.toUpperCase() : ''
const initialCountry = COUNTRY_LEGAL_PROFILES[queryCountry] ? queryCountry : detectUserCountryCode()

const selectedCountry = ref(initialCountry)
const profile = computed(() => COUNTRY_LEGAL_PROFILES[selectedCountry.value] || COUNTRY_LEGAL_PROFILES.CO)
const biometricSections = computed(() => getBiometricConsentSections(selectedCountry.value))

useSeoMeta({
  title: 'Centro Legal, Aviso de Privacidad y Biometría | Moments',
  description: 'Aviso de Privacidad, Autorización de Uso de Imagen y Datos Biométricos, Política de Datos y Términos de Moments adaptados por país.'
})
</script>
