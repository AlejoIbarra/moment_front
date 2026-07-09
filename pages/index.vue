<template>
  <div class="relative min-h-screen overflow-hidden bg-gradient-to-b from-indigo-50/40 via-white to-white">
    <!-- Abstract background blur elements -->
    <div class="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-indigo-200/30 to-purple-200/20 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
    <div class="absolute top-[400px] right-10 w-[500px] h-[500px] bg-gradient-to-br from-pink-100/30 to-purple-200/30 rounded-full blur-3xl -z-10"></div>

    <!-- Hero Section -->
    <div class="max-w-6xl mx-auto px-4 pt-16 pb-20 sm:px-6 lg:px-8 text-center mt-12 relative">
      <!-- Tag/Badge -->
      <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold tracking-wide uppercase mb-6 animate-fade-in shadow-sm">
        <Icon name="lucide:sparkles" class="w-3.5 h-3.5 animate-spin-slow" />
        {{ $t('common.marketplace') }} &amp; Galería Pro
      </div>

      <!-- Main Title -->
      <h1 class="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl text-slate-900 leading-tight">
        <span class="block mb-2">{{ $t('home.hero_title') }}</span>
        <span class="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent pb-2">
          De Tus Eventos Favoritos
        </span>
      </h1>

      <!-- Subtitle -->
      <p class="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
        {{ $t('home.hero_subtitle') }} Encuentra tus fotos en segundos mediante geolocalización o carpetas organizadas por fotógrafos profesionales.
      </p>

      <!-- CTA Buttons -->
      <div class="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
        <NuxtLink to="/marketplace" class="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-2xl text-white bg-slate-950 hover:bg-slate-900 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-lg hover:shadow-xl w-full sm:w-auto">
          <Icon name="lucide:compass" class="w-5 h-5 mr-2 group-hover:rotate-45 transition-transform duration-300" />
          {{ $t('home.explore') }}
        </NuxtLink>
        <NuxtLink to="/register" class="group inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-2xl text-slate-700 bg-white border border-slate-200/80 hover:bg-slate-50 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 shadow-md hover:shadow-lg w-full sm:w-auto">
          <Icon name="lucide:camera" class="w-5 h-5 mr-2 text-indigo-500 group-hover:scale-110 transition-transform" />
          {{ $t('home.join_as_photographer') }}
        </NuxtLink>
      </div>

      <!-- Dynamic Visual Showcase -->
      <div class="mt-20 relative rounded-3xl overflow-hidden border border-slate-200/60 shadow-2xl bg-white/40 backdrop-blur-sm p-2 sm:p-4 animate-fade-in-up">
        <div class="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <!-- Mock Event Card 1 -->
          <div class="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-500">
            <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600" alt="Maratón de la Ciudad" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-5 text-left">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/25 text-emerald-200 border border-emerald-500/30 mb-2 w-max backdrop-blur-md">Deportes</span>
              <h3 class="text-white font-bold text-lg leading-tight">Maratón de la Ciudad</h3>
              <p class="text-slate-300 text-xs mt-1">Ubicación Central • 420 Fotos</p>
            </div>
          </div>
          <!-- Mock Event Card 2 (Featured center) -->
          <div class="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-500">
            <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=600" alt="Concierto Sunset" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-5 text-left">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/25 text-purple-200 border border-purple-500/30 mb-2 w-max backdrop-blur-md">Música</span>
              <h3 class="text-white font-bold text-lg leading-tight">Festival Sunset Vibrations</h3>
              <p class="text-slate-300 text-xs mt-1">Playa del Sol • 1.2k Fotos</p>
            </div>
          </div>
          <!-- Mock Event Card 3 -->
          <div class="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-100 hover:shadow-md transition-all duration-500">
            <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=600" alt="Boda de Ensueño" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-5 text-left">
              <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/25 text-rose-200 border border-rose-500/30 mb-2 w-max backdrop-blur-md">Boda</span>
              <h3 class="text-white font-bold text-lg leading-tight">Boda de Ensueño en el Valle</h3>
              <p class="text-slate-300 text-xs mt-1">Hacienda Santa Rosa • 850 Fotos</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8 border-t border-slate-100">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-8">
        <div class="text-center">
          <p class="text-4xl sm:text-5xl font-black text-indigo-600">+15,000</p>
          <p class="text-sm text-slate-500 font-semibold mt-2">Fotos Subidas</p>
        </div>
        <div class="text-center">
          <p class="text-4xl sm:text-5xl font-black text-purple-600">+1,200</p>
          <p class="text-sm text-slate-500 font-semibold mt-2">Usuarios Felices</p>
        </div>
        <div class="text-center">
          <p class="text-4xl sm:text-5xl font-black text-pink-600">+150</p>
          <p class="text-sm text-slate-500 font-semibold mt-2">Fotógrafos Pro</p>
        </div>
        <div class="text-center">
          <p class="text-4xl sm:text-5xl font-black text-slate-900">100%</p>
          <p class="text-sm text-slate-500 font-semibold mt-2">Pago Seguro</p>
        </div>
      </div>
    </div>

    <!-- How it Works Interactive Section -->
    <div class="bg-slate-50/60 py-24 border-t border-b border-slate-100">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-3xl font-extrabold text-slate-900 sm:text-4xl">
            ¿Cómo funciona Moment?
          </h2>
          <p class="mt-4 text-lg text-slate-500 font-medium">
            Selecciona tu rol para ver cómo puedes sacarle el máximo provecho a nuestra plataforma.
          </p>

          <!-- Interactive Tab Buttons -->
          <div class="mt-8 inline-flex p-1 bg-slate-200/60 backdrop-blur-sm rounded-xl">
            <button 
              @click="activeTab = 'buyer'"
              :class="['px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300', activeTab === 'buyer' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900']"
            >
              <Icon name="lucide:user" class="w-4 h-4 mr-1.5 inline-block" />
              Soy Participante / Comprador
            </button>
            <button 
              @click="activeTab = 'photographer'"
              :class="['px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300', activeTab === 'photographer' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900']"
            >
              <Icon name="lucide:camera" class="w-4 h-4 mr-1.5 inline-block" />
              Soy Fotógrafo
            </button>
          </div>
        </div>

        <!-- Tab Content: Buyer -->
        <div v-if="activeTab === 'buyer'" class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-2xl border border-slate-200/50 shadow-sm relative group hover:shadow-md transition-all">
            <div class="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 font-bold text-lg group-hover:scale-110 transition-transform">1</div>
            <h3 class="font-bold text-lg text-slate-900 mb-3">Encuentra tu Evento</h3>
            <p class="text-slate-500 text-sm leading-relaxed">Usa el buscador para localizar el evento al que asististe por nombre, fecha o ubicación.</p>
          </div>
          <div class="bg-white p-8 rounded-2xl border border-slate-200/50 shadow-sm relative group hover:shadow-md transition-all">
            <div class="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-6 font-bold text-lg group-hover:scale-110 transition-transform">2</div>
            <h3 class="font-bold text-lg text-slate-900 mb-3">Selecciona tus Fotos</h3>
            <p class="text-slate-500 text-sm leading-relaxed">Visualiza las vistas previas con marcas de agua y añade a tu carrito o billetera digital las que más te gusten.</p>
          </div>
          <div class="bg-white p-8 rounded-2xl border border-slate-200/50 shadow-sm relative group hover:shadow-md transition-all">
            <div class="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 mb-6 font-bold text-lg group-hover:scale-110 transition-transform">3</div>
            <h3 class="font-bold text-lg text-slate-900 mb-3">Descarga al Instante</h3>
            <p class="text-slate-500 text-sm leading-relaxed">Realiza el pago digital seguro y descarga de inmediato los archivos originales en alta calidad y sin marcas de agua.</p>
          </div>
        </div>

        <!-- Tab Content: Photographer -->
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div class="bg-white p-8 rounded-2xl border border-slate-200/50 shadow-sm relative group hover:shadow-md transition-all">
            <div class="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-6 font-bold text-lg group-hover:scale-110 transition-transform">1</div>
            <h3 class="font-bold text-lg text-slate-900 mb-3">Crea un Evento</h3>
            <p class="text-slate-500 text-sm leading-relaxed">Registra los detalles del evento que vas a cubrir para que los participantes puedan buscarlo fácilmente.</p>
          </div>
          <div class="bg-white p-8 rounded-2xl border border-slate-200/50 shadow-sm relative group hover:shadow-md transition-all">
            <div class="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 mb-6 font-bold text-lg group-hover:scale-110 transition-transform">2</div>
            <h3 class="font-bold text-lg text-slate-900 mb-3">Sube las Fotos</h3>
            <p class="text-slate-500 text-sm leading-relaxed">Sube tus fotos en alta calidad. Nuestro sistema creará automáticamente miniaturas con marcas de agua.</p>
          </div>
          <div class="bg-white p-8 rounded-2xl border border-slate-200/50 shadow-sm relative group hover:shadow-md transition-all">
            <div class="w-12 h-12 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600 mb-6 font-bold text-lg group-hover:scale-110 transition-transform">3</div>
            <h3 class="font-bold text-lg text-slate-900 mb-3">Gana y Retira</h3>
            <p class="text-slate-500 text-sm leading-relaxed">Define tus propios precios. Cuando los clientes compran, el saldo se añade de inmediato a tu monedero.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Key Features Highlight -->
    <div class="max-w-6xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
      <div class="text-center max-w-3xl mx-auto mb-16">
        <h2 class="text-3xl font-extrabold text-slate-900 sm:text-4xl">
          Diseñado para una Experiencia Increíble
        </h2>
        <p class="mt-4 text-lg text-slate-500">
          Tecnología de punta pensada en la velocidad y la seguridad de tus transacciones.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <!-- Feature 1 -->
        <div class="flex flex-col items-start p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div class="p-3 rounded-xl bg-indigo-50 text-indigo-600 mb-4">
            <Icon name="lucide:zap" class="w-6 h-6" />
          </div>
          <h4 class="font-bold text-slate-900 text-base mb-2">Búsqueda Instantánea</h4>
          <p class="text-slate-500 text-xs leading-relaxed">Buscador global integrado que te permite encontrar eventos y fotógrafos en milisegundos.</p>
        </div>

        <!-- Feature 2 -->
        <div class="flex flex-col items-start p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div class="p-3 rounded-xl bg-purple-50 text-purple-600 mb-4">
            <Icon name="lucide:wallet" class="w-6 h-6" />
          </div>
          <h4 class="font-bold text-slate-900 text-base mb-2">Monedero Digital</h4>
          <p class="text-slate-500 text-xs leading-relaxed">Recarga saldo de manera segura utilizando Wompi y realiza compras fluidas con un solo clic.</p>
        </div>

        <!-- Feature 3 -->
        <div class="flex flex-col items-start p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div class="p-3 rounded-xl bg-pink-50 text-pink-600 mb-4">
            <Icon name="lucide:shield-check" class="w-6 h-6" />
          </div>
          <h4 class="font-bold text-slate-900 text-base mb-2">Fotos Protegidas</h4>
          <p class="text-slate-500 text-xs leading-relaxed">Nuestras marcas de agua dinámicas protegen tu trabajo hasta que la transacción se complete.</p>
        </div>

        <!-- Feature 4 -->
        <div class="flex flex-col items-start p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div class="p-3 rounded-xl bg-amber-50 text-amber-600 mb-4">
            <Icon name="lucide:download" class="w-6 h-6" />
          </div>
          <h4 class="font-bold text-slate-900 text-base mb-2">Descarga Directa</h4>
          <p class="text-slate-500 text-xs leading-relaxed">Obtén la máxima resolución directamente del sensor del fotógrafo una vez realizado el pago.</p>
        </div>
      </div>
    </div>

    <!-- CTA Banner -->
    <div class="max-w-5xl mx-auto px-4 pb-24 sm:px-6 lg:px-8">
      <div class="relative bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900 rounded-3xl overflow-hidden shadow-2xl p-10 sm:p-16 text-center">
        <!-- Blur backgrounds inside card -->
        <div class="absolute -top-20 -left-20 w-60 h-60 bg-pink-500/30 rounded-full blur-2xl pointer-events-none"></div>
        <div class="absolute -bottom-20 -right-20 w-60 h-60 bg-indigo-500/30 rounded-full blur-2xl pointer-events-none"></div>

        <h3 class="text-3xl font-extrabold text-white sm:text-4xl relative z-10 leading-tight">
          ¿Listo para capturar y revivir tus momentos?
        </h3>
        <p class="mt-4 text-lg text-indigo-150 max-w-2xl mx-auto relative z-10 font-medium">
          Crea tu cuenta hoy mismo y comienza a explorar miles de fotos y eventos de alta calidad.
        </p>
        <div class="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 relative z-10">
          <NuxtLink to="/register" class="inline-flex items-center justify-center px-8 py-3.5 border border-transparent text-base font-bold rounded-xl text-indigo-950 bg-white hover:bg-slate-100 transition-colors shadow-lg active:scale-95 duration-150 w-full sm:w-auto">
            Comenzar Gratis
          </NuxtLink>
          <NuxtLink to="/marketplace" class="inline-flex items-center justify-center px-8 py-3.5 border border-indigo-200/30 text-base font-bold rounded-xl text-white bg-white/10 hover:bg-white/20 transition-colors backdrop-blur-sm active:scale-95 duration-150 w-full sm:w-auto">
            Ver Marketplace
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const activeTab = ref('buyer')
const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (authStore.isAuthenticated) {
    if (authStore.isPhotographer) {
      router.replace('/dashboard/photographer')
    } else if (authStore.isAdmin) {
      router.replace('/dashboard/admin')
    } else {
      router.replace('/marketplace')
    }
  }
})
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
.animate-spin-slow {
  animation: spin 6s linear infinite;
}
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}
.animate-fade-in-up {
  animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
