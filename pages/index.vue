<template>
  <div class="relative min-h-screen overflow-hidden bg-slate-950 text-slate-200 selection:bg-indigo-500/30 font-sans">
    <!-- Ambient Background / Glowing Orbs -->
    <div class="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse-slow"></div>
    <div class="fixed top-[20%] right-[-5%] w-[400px] h-[400px] bg-fuchsia-600/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none animate-pulse-slow" style="animation-delay: 2s;"></div>
    <div class="fixed bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none animate-pulse-slow" style="animation-delay: 4s;"></div>
    <div class="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>

    <!-- Hero Section -->
    <div class="max-w-7xl mx-auto px-4 pt-24 pb-20 sm:px-6 lg:px-8 text-center relative z-10">
      <!-- Badge -->
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-indigo-300 text-xs font-bold tracking-widest uppercase mb-8 shadow-2xl animate-fade-in-up hover:bg-white/10 transition-colors cursor-default">
        <Icon name="lucide:sparkles" class="w-4 h-4 text-fuchsia-400 animate-pulse" />
        {{ $t('common.marketplace') }} &amp; Galería Pro
      </div>

      <!-- Main Title -->
      <h1 class="text-5xl font-black tracking-tight sm:text-7xl lg:text-8xl text-white leading-[1.1] animate-fade-in-up" style="animation-delay: 100ms;">
        <span class="block mb-2">{{ $t('home.hero_title') }}</span>
        <span class="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-pink-400 pb-4 drop-shadow-sm">
          De Tus Eventos Favoritos
        </span>
      </h1>

      <!-- Subtitle -->
      <p class="mt-8 text-lg sm:text-2xl text-slate-400 max-w-3xl mx-auto font-light leading-relaxed animate-fade-in-up" style="animation-delay: 200ms;">
        {{ $t('home.hero_subtitle') }} Encuentra tus fotos en segundos mediante geolocalización o carpetas organizadas por profesionales.
      </p>

      <!-- CTA Buttons -->
      <div class="mt-12 flex flex-col sm:flex-row justify-center items-center gap-6 animate-fade-in-up" style="animation-delay: 300ms;">
        <NuxtLink to="/marketplace" class="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-white bg-white/5 border border-white/10 backdrop-blur-lg hover:bg-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden w-full sm:w-auto shadow-lg hover:shadow-indigo-500/10">
          <div class="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <Icon name="lucide:compass" class="w-5 h-5 mr-3 group-hover:rotate-45 transition-transform duration-300" />
          {{ $t('home.explore') }}
        </NuxtLink>
        <NuxtLink to="/register" class="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-slate-950 bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-pink-400 hover:from-indigo-300 hover:via-fuchsia-300 hover:to-pink-300 transition-all duration-300 shadow-[0_0_40px_rgba(129,140,248,0.2)] hover:shadow-[0_0_60px_rgba(192,38,211,0.4)] transform hover:-translate-y-1 w-full sm:w-auto">
          <Icon name="lucide:camera" class="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
          {{ $t('home.join_as_photographer') }}
        </NuxtLink>
      </div>

      <!-- Dynamic Visual Showcase -->
      <div class="mt-24 relative rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl bg-slate-900/50 backdrop-blur-xl p-4 sm:p-6 animate-fade-in-up ring-1 ring-white/5" style="animation-delay: 500ms;">
        <div class="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none"></div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
          <!-- Mock Event Card 1 -->
          <div class="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-slate-800 shadow-lg cursor-pointer">
            <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=800" alt="Maratón de la Ciudad" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 text-left">
              <div class="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3 backdrop-blur-md">Deportes</span>
                <h3 class="text-white font-black text-xl leading-tight mb-1">Maratón de la Ciudad</h3>
                <p class="text-slate-400 text-sm font-medium">Ubicación Central • 420 Fotos</p>
              </div>
            </div>
          </div>
          <!-- Mock Event Card 2 (Featured center) -->
          <div class="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-slate-800 shadow-lg cursor-pointer md:-translate-y-6">
            <div class="absolute inset-0 bg-gradient-to-tr from-fuchsia-500/20 to-indigo-500/20 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-700"></div>
            <img src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=800" alt="Concierto Sunset" class="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 text-left z-20">
              <div class="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-500/30 mb-3 backdrop-blur-md">Música</span>
                <h3 class="text-white font-black text-xl leading-tight mb-1">Festival Sunset Vibrations</h3>
                <p class="text-slate-400 text-sm font-medium">Playa del Sol • 1.2k Fotos</p>
              </div>
            </div>
          </div>
          <!-- Mock Event Card 3 -->
          <div class="group relative aspect-[4/5] rounded-3xl overflow-hidden bg-slate-800 shadow-lg cursor-pointer">
            <img src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800" alt="Boda de Ensueño" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out" />
            <div class="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6 text-left">
              <div class="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 mb-3 backdrop-blur-md">Boda</span>
                <h3 class="text-white font-black text-xl leading-tight mb-1">Boda de Ensueño en el Valle</h3>
                <p class="text-slate-400 text-sm font-medium">Hacienda Santa Rosa • 850 Fotos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="relative z-10 border-y border-white/5 bg-slate-900/30 backdrop-blur-sm mt-12">
      <div class="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-8 divide-x divide-white/5">
          <div class="text-center px-4">
            <p class="text-5xl sm:text-6xl font-black bg-gradient-to-br from-indigo-400 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm">+15k</p>
            <p class="text-sm sm:text-base text-slate-400 font-semibold mt-3 uppercase tracking-wider">Fotos Subidas</p>
          </div>
          <div class="text-center px-4">
            <p class="text-5xl sm:text-6xl font-black bg-gradient-to-br from-fuchsia-400 to-fuchsia-600 bg-clip-text text-transparent drop-shadow-sm">+1.2k</p>
            <p class="text-sm sm:text-base text-slate-400 font-semibold mt-3 uppercase tracking-wider">Usuarios Felices</p>
          </div>
          <div class="text-center px-4">
            <p class="text-5xl sm:text-6xl font-black bg-gradient-to-br from-pink-400 to-pink-600 bg-clip-text text-transparent drop-shadow-sm">+150</p>
            <p class="text-sm sm:text-base text-slate-400 font-semibold mt-3 uppercase tracking-wider">Fotógrafos Pro</p>
          </div>
          <div class="text-center px-4">
            <p class="text-5xl sm:text-6xl font-black text-white drop-shadow-sm">100%</p>
            <p class="text-sm sm:text-base text-slate-400 font-semibold mt-3 uppercase tracking-wider">Pago Seguro</p>
          </div>
        </div>
      </div>
    </div>

    <!-- How it Works Interactive Section -->
    <div class="relative z-10 py-32">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-20">
          <h2 class="text-4xl font-black text-white sm:text-5xl tracking-tight mb-6">
            ¿Cómo funciona <span class="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-fuchsia-400">Moments</span>?
          </h2>
          <p class="text-xl text-slate-400 font-light">
            Selecciona tu rol para ver cómo puedes sacarle el máximo provecho a nuestra plataforma.
          </p>

          <!-- Interactive Tab Buttons -->
          <div class="mt-10 inline-flex p-1.5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-xl">
            <button 
              @click="activeTab = 'buyer'"
              :class="['px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-500 ease-out', activeTab === 'buyer' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 scale-105' : 'text-slate-400 hover:text-white hover:bg-white/5']"
            >
              <Icon name="lucide:user" class="w-5 h-5 mr-2 inline-block" />
              Soy Participante
            </button>
            <button 
              @click="activeTab = 'photographer'"
              :class="['px-8 py-3.5 rounded-xl text-sm font-bold transition-all duration-500 ease-out', activeTab === 'photographer' ? 'bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/25 scale-105' : 'text-slate-400 hover:text-white hover:bg-white/5']"
            >
              <Icon name="lucide:camera" class="w-5 h-5 mr-2 inline-block" />
              Soy Fotógrafo
            </button>
          </div>
        </div>

        <!-- Tab Content: Buyer -->
        <Transition name="fade-slide" mode="out-in">
          <div v-if="activeTab === 'buyer'" class="grid grid-cols-1 md:grid-cols-3 gap-8" key="buyer">
            <div class="bg-white/5 backdrop-blur-lg p-10 rounded-3xl border border-white/10 shadow-2xl relative group hover:border-indigo-500/50 hover:bg-white/10 transition-all duration-500 overflow-hidden">
              <div class="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors duration-500"></div>
              <div class="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-8 font-black text-2xl group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 shadow-lg">1</div>
              <h3 class="font-bold text-2xl text-white mb-4">Encuentra tu Evento</h3>
              <p class="text-slate-400 text-base leading-relaxed">Usa el buscador para localizar el evento al que asististe por nombre, fecha o ubicación de manera instantánea.</p>
            </div>
            <div class="bg-white/5 backdrop-blur-lg p-10 rounded-3xl border border-white/10 shadow-2xl relative group hover:border-fuchsia-500/50 hover:bg-white/10 transition-all duration-500 overflow-hidden mt-0 md:mt-12">
              <div class="absolute -right-10 -top-10 w-40 h-40 bg-fuchsia-500/10 rounded-full blur-2xl group-hover:bg-fuchsia-500/20 transition-colors duration-500"></div>
              <div class="w-16 h-16 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 mb-8 font-black text-2xl group-hover:scale-110 group-hover:bg-fuchsia-500 group-hover:text-white transition-all duration-500 shadow-lg">2</div>
              <h3 class="font-bold text-2xl text-white mb-4">Selecciona tus Fotos</h3>
              <p class="text-slate-400 text-base leading-relaxed">Visualiza las vistas previas con marcas de agua y añade a tu billetera digital las que más te gusten.</p>
            </div>
            <div class="bg-white/5 backdrop-blur-lg p-10 rounded-3xl border border-white/10 shadow-2xl relative group hover:border-pink-500/50 hover:bg-white/10 transition-all duration-500 overflow-hidden mt-0 md:mt-24">
              <div class="absolute -right-10 -top-10 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-colors duration-500"></div>
              <div class="w-16 h-16 rounded-2xl bg-pink-500/20 flex items-center justify-center text-pink-400 mb-8 font-black text-2xl group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-white transition-all duration-500 shadow-lg">3</div>
              <h3 class="font-bold text-2xl text-white mb-4">Descarga al Instante</h3>
              <p class="text-slate-400 text-base leading-relaxed">Realiza el pago digital seguro y descarga de inmediato los archivos originales en alta calidad.</p>
            </div>
          </div>

          <!-- Tab Content: Photographer -->
          <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-8" key="photographer">
            <div class="bg-white/5 backdrop-blur-lg p-10 rounded-3xl border border-white/10 shadow-2xl relative group hover:border-indigo-500/50 hover:bg-white/10 transition-all duration-500 overflow-hidden">
              <div class="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-colors duration-500"></div>
              <div class="w-16 h-16 rounded-2xl bg-indigo-500/20 flex items-center justify-center text-indigo-400 mb-8 font-black text-2xl group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all duration-500 shadow-lg">1</div>
              <h3 class="font-bold text-2xl text-white mb-4">Crea un Evento</h3>
              <p class="text-slate-400 text-base leading-relaxed">Registra los detalles del evento que vas a cubrir para que los participantes puedan buscarlo fácilmente.</p>
            </div>
            <div class="bg-white/5 backdrop-blur-lg p-10 rounded-3xl border border-white/10 shadow-2xl relative group hover:border-fuchsia-500/50 hover:bg-white/10 transition-all duration-500 overflow-hidden mt-0 md:mt-12">
              <div class="absolute -right-10 -top-10 w-40 h-40 bg-fuchsia-500/10 rounded-full blur-2xl group-hover:bg-fuchsia-500/20 transition-colors duration-500"></div>
              <div class="w-16 h-16 rounded-2xl bg-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 mb-8 font-black text-2xl group-hover:scale-110 group-hover:bg-fuchsia-500 group-hover:text-white transition-all duration-500 shadow-lg">2</div>
              <h3 class="font-bold text-2xl text-white mb-4">Sube las Fotos</h3>
              <p class="text-slate-400 text-base leading-relaxed">Sube tus fotos en alta calidad. Nuestro sistema creará automáticamente miniaturas con marcas de agua.</p>
            </div>
            <div class="bg-white/5 backdrop-blur-lg p-10 rounded-3xl border border-white/10 shadow-2xl relative group hover:border-pink-500/50 hover:bg-white/10 transition-all duration-500 overflow-hidden mt-0 md:mt-24">
              <div class="absolute -right-10 -top-10 w-40 h-40 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-colors duration-500"></div>
              <div class="w-16 h-16 rounded-2xl bg-pink-500/20 flex items-center justify-center text-pink-400 mb-8 font-black text-2xl group-hover:scale-110 group-hover:bg-pink-500 group-hover:text-white transition-all duration-500 shadow-lg">3</div>
              <h3 class="font-bold text-2xl text-white mb-4">Gana y Retira</h3>
              <p class="text-slate-400 text-base leading-relaxed">Define tus propios precios. Cuando los clientes compran, el saldo se añade de inmediato a tu monedero.</p>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Key Features Highlight -->
    <div class="relative z-10 py-24 bg-slate-900/50 border-y border-white/5 backdrop-blur-md">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center max-w-3xl mx-auto mb-20">
          <h2 class="text-4xl font-black text-white sm:text-5xl">
            Diseñado para una <span class="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400">Experiencia Increíble</span>
          </h2>
          <p class="mt-6 text-xl text-slate-400 font-light">
            Tecnología de punta pensada en la velocidad y la seguridad de tus transacciones.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Feature 1 -->
          <div class="flex flex-col items-start p-8 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-300 group">
            <div class="p-4 rounded-2xl bg-indigo-500/20 text-indigo-400 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Icon name="lucide:zap" class="w-8 h-8" />
            </div>
            <h4 class="font-bold text-white text-xl mb-3">Búsqueda Instantánea</h4>
            <p class="text-slate-400 text-sm leading-relaxed">Buscador global integrado que te permite encontrar eventos y fotógrafos en milisegundos.</p>
          </div>

          <!-- Feature 2 -->
          <div class="flex flex-col items-start p-8 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 hover:border-fuchsia-500/30 transition-all duration-300 group">
            <div class="p-4 rounded-2xl bg-fuchsia-500/20 text-fuchsia-400 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Icon name="lucide:wallet" class="w-8 h-8" />
            </div>
            <h4 class="font-bold text-white text-xl mb-3">Monedero Digital</h4>
            <p class="text-slate-400 text-sm leading-relaxed">Recarga saldo de manera segura utilizando Wompi y realiza compras fluidas con un solo clic.</p>
          </div>

          <!-- Feature 3 -->
          <div class="flex flex-col items-start p-8 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 hover:border-pink-500/30 transition-all duration-300 group">
            <div class="p-4 rounded-2xl bg-pink-500/20 text-pink-400 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Icon name="lucide:shield-check" class="w-8 h-8" />
            </div>
            <h4 class="font-bold text-white text-xl mb-3">Fotos Protegidas</h4>
            <p class="text-slate-400 text-sm leading-relaxed">Nuestras marcas de agua dinámicas protegen tu trabajo hasta que la transacción se complete.</p>
          </div>

          <!-- Feature 4 -->
          <div class="flex flex-col items-start p-8 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 hover:border-amber-500/30 transition-all duration-300 group">
            <div class="p-4 rounded-2xl bg-amber-500/20 text-amber-400 mb-6 group-hover:scale-110 transition-transform duration-300">
              <Icon name="lucide:download" class="w-8 h-8" />
            </div>
            <h4 class="font-bold text-white text-xl mb-3">Descarga Directa</h4>
            <p class="text-slate-400 text-sm leading-relaxed">Obtén la máxima resolución directamente del sensor del fotógrafo una vez realizado el pago.</p>
          </div>
        </div>
      </div>
    </div>

    <!-- CTA Banner -->
    <div class="relative z-10 max-w-6xl mx-auto px-4 py-32 sm:px-6 lg:px-8">
      <div class="relative rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(129,140,248,0.15)] p-12 sm:p-20 text-center bg-white/5 border border-white/10 backdrop-blur-xl">
        <!-- Glowing gradient backgrounds inside card -->
        <div class="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 via-fuchsia-500/10 to-pink-500/20 pointer-events-none"></div>
        <div class="absolute -top-32 -left-32 w-80 h-80 bg-fuchsia-500/30 rounded-full blur-[100px] pointer-events-none"></div>
        <div class="absolute -bottom-32 -right-32 w-80 h-80 bg-indigo-500/30 rounded-full blur-[100px] pointer-events-none"></div>

        <h3 class="text-4xl font-black text-white sm:text-5xl relative z-10 leading-tight mb-6">
          ¿Listo para capturar y revivir tus momentos?
        </h3>
        <p class="text-xl text-slate-300 max-w-2xl mx-auto relative z-10 font-light mb-12">
          Crea tu cuenta hoy mismo y comienza a explorar miles de fotos y eventos de alta calidad.
        </p>
        <div class="flex flex-col sm:flex-row justify-center items-center gap-6 relative z-10">
          <NuxtLink to="/register" class="inline-flex items-center justify-center px-10 py-4 font-bold rounded-full text-slate-950 bg-white hover:bg-slate-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:shadow-[0_0_50px_rgba(255,255,255,0.5)] active:scale-95 duration-200 w-full sm:w-auto text-lg">
            Comenzar Gratis
          </NuxtLink>
          <NuxtLink to="/marketplace" class="inline-flex items-center justify-center px-10 py-4 font-bold rounded-full text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all backdrop-blur-md active:scale-95 duration-200 w-full sm:w-auto text-lg">
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

useSeoMeta({
  title: 'Moments - Galería Digital y Marketplace de Fotografía de Eventos',
  ogTitle: 'Moments - Galería Digital y Marketplace de Fotografía de Eventos',
  description: 'Encuentra y descarga al instante tus fotos de maratones, conciertos, bodas y festivales. Fotografía profesional en alta resolución protegida de forma segura.',
  ogDescription: 'Encuentra y descarga al instante tus fotos de maratones, conciertos, bodas y festivales. Fotografía profesional en alta resolución protegida de forma segura.',
  ogImage: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=1200',
  twitterCard: 'summary_large_image',
  ogType: 'website',
  ogUrl: 'https://www.moments-gallery.com',
  keywords: 'fotografía de eventos, marketplace de fotos, fotos de maratones, fotos de conciertos, comprar fotos digitales, fotógrafos profesionales, galerías de eventos'
})

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
.animate-fade-in-up {
  animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
