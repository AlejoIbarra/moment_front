<template>
  <div class="landing-monos-root min-h-screen bg-[#FAFAF8] text-[#121212] font-sans selection:bg-[#3ef4a1]/30 selection:text-black antialiased relative overflow-x-hidden">
    
    <!-- Custom Follower Cursor (Desktop) -->
    <div
      ref="cursorDotRef"
      class="fixed w-3 h-3 rounded-full bg-[#121212] pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 hidden lg:block"
      :class="{ 'opacity-0': !cursorVisible, 'scale-150 bg-[#07b667]': cursorHovered }"
    ></div>
    <div
      ref="cursorRingRef"
      class="fixed w-9 h-9 rounded-full border border-[#121212]/40 pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-150 ease-out hidden lg:block"
      :class="{ 'opacity-0': !cursorVisible, 'scale-150 border-[#07b667] bg-[#3ef4a1]/10': cursorHovered }"
    ></div>

    <!-- Sticky Header (Monosexpertos style) -->
    <header class="sticky top-0 z-50 bg-[#FAFAF8]/90 backdrop-blur-md border-b border-black/5 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 group cursor-pointer" @mouseenter="cursorHovered = true" @mouseleave="cursorHovered = false">
          <img src="/logo.png" alt="Moments Logo" class="h-9 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
          <span class="text-2xl sm:text-3xl font-black tracking-tighter italic text-[#121212] group-hover:text-[#07b667] transition-colors">
            Moments<span class="text-[#07b667]">.</span>
          </span>
        </NuxtLink>

        <!-- Nav Links -->
        <nav class="hidden md:flex items-center gap-8 text-sm font-semibold tracking-wide">
          <a href="#servicios" class="text-stone-700 hover:text-black transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-black hover:after:w-full after:transition-all">
            Servicios
          </a>
          <a href="#nuestro-trabajo" class="text-stone-700 hover:text-black transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-black hover:after:w-full after:transition-all">
            Nuestro trabajo
          </a>
          <a href="#metodologia" class="text-stone-700 hover:text-black transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-black hover:after:w-full after:transition-all">
            Metodología
          </a>
          <a href="#tecnologia" class="text-stone-700 hover:text-black transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-black hover:after:w-full after:transition-all">
            Física & IA
          </a>
          <NuxtLink to="/photographer-access" class="text-stone-700 hover:text-black transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-black hover:after:w-full after:transition-all">
            Para Fotógrafos
          </NuxtLink>
        </nav>

        <!-- Header Action CTA with Monosexpertos signature arrow button -->
        <div class="flex items-center gap-3">
          <NuxtLink
            to="/marketplace"
            class="group inline-flex items-center gap-3 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-black text-white text-xs sm:text-sm font-bold tracking-tight hover:bg-[#1f2421] active:scale-95 transition-all shadow-sm"
            @mouseenter="cursorHovered = true"
            @mouseleave="cursorHovered = false"
          >
            <span class="font-medium">Explorar fotos</span>
            <!-- Custom animated horizontal arrow SVG -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="14"
              viewBox="0 0 201 111"
              fill="none"
              class="w-5 h-3 text-white transition-transform duration-300 group-hover:translate-x-1.5"
            >
              <path d="M200.5 54.5C173.369 54.5 146 28 146 0" stroke="currentColor" stroke-width="14"></path>
              <path d="M146.5 110.5C146.5 83.3691 173 56 201 56" stroke="currentColor" stroke-width="14"></path>
              <path d="M0 55L200.131 55" stroke="currentColor" stroke-width="14"></path>
            </svg>
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- HERO SECTION (Monosexpertos aesthetic + Interactive Mascot with Eyes following mouse) -->
    <section class="relative pt-16 sm:pt-24 pb-20 overflow-hidden" @mousemove="handleMouseMove">
      
      <!-- Subtle background watermark grid / typography -->
      <div class="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-[0.03] flex items-center justify-center">
        <span class="text-[26vw] font-black uppercase tracking-tighter text-black leading-none">
          MOMENTS
        </span>
      </div>

      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <!-- Pill Tag -->
        <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/5 border border-black/10 text-stone-800 text-xs font-semibold uppercase tracking-wider mb-8">
          <span class="w-2 h-2 rounded-full bg-[#07b667] animate-pulse"></span>
          Plataforma Oficial de Fotografía de Eventos
        </div>

        <!-- Animated Headline (Monosexpertos marker highlight & editorial serif) -->
        <h1 class="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-[#121212] tracking-tight leading-[1.08] max-w-5xl mx-auto">
          <span>Una fotografía&nbsp;</span>
          <span class="relative inline-block px-1">
            <span class="relative z-10 font-serif italic font-normal text-[#121212]">increíble</span>
            <!-- Hand-drawn animated strikethrough / highlight marker -->
            <svg
              class="absolute left-0 top-[60%] -translate-y-1/2 w-full h-[18px] sm:h-[24px] text-[#3ef4a1]/70 -z-0 pointer-events-none overflow-visible"
              viewBox="0 0 200 24"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M 5,14 Q 50,4 100,12 T 195,8"
                stroke="currentColor"
                stroke-width="10"
                stroke-linecap="round"
                class="marker-path"
              />
            </svg>
          </span>
          <br class="hidden sm:inline" />
          <span>necesita una experiencia increíble</span>
        </h1>

        <!-- Subtitle -->
        <p class="mt-6 text-lg sm:text-2xl text-stone-600 max-w-3xl mx-auto font-normal leading-relaxed">
          Encuentra tus fotos al instante con reconocimiento facial por IA o geolocalización. Compras en 1 clic y descargas en máxima resolución.
        </p>

        <!-- CTA Action Buttons -->
        <div class="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <NuxtLink
            to="/marketplace"
            class="group inline-flex items-center justify-center gap-4 px-8 py-4 rounded-full bg-black text-white text-base font-bold hover:bg-[#1a1f1b] transition-all duration-300 shadow-lg hover:shadow-black/15 active:scale-95 w-full sm:w-auto"
            @mouseenter="cursorHovered = true"
            @mouseleave="cursorHovered = false"
          >
            <span>Buscar mis fotos</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="16"
              viewBox="0 0 201 111"
              fill="none"
              class="w-6 h-3 text-white transition-transform duration-300 group-hover:translate-x-2"
            >
              <path d="M200.5 54.5C173.369 54.5 146 28 146 0" stroke="currentColor" stroke-width="14"></path>
              <path d="M146.5 110.5C146.5 83.3691 173 56 201 56" stroke="currentColor" stroke-width="14"></path>
              <path d="M0 55L200.131 55" stroke="currentColor" stroke-width="14"></path>
            </svg>
          </NuxtLink>

          <NuxtLink
            to="/photographer-access"
            class="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-stone-200/80 hover:bg-stone-300/80 text-stone-900 text-base font-bold transition-all active:scale-95 w-full sm:w-auto"
            @mouseenter="cursorHovered = true"
            @mouseleave="cursorHovered = false"
          >
            <Icon name="lucide:camera" class="w-5 h-5 text-stone-700" />
            <span>Soy fotógrafo pro</span>
          </NuxtLink>
        </div>

        <!-- INTERACTIVE MASCOT WITH EYES FOLLOWING MOUSE (Pure Monosexpertos Mascot Animation) -->
        <div class="mt-14 relative flex flex-col items-center justify-center">
          <div
            ref="mascotContainerRef"
            class="relative transition-transform duration-200 ease-out cursor-pointer select-none"
            :style="mascotTiltStyle"
            @click="triggerCameraFlash"
            title="¡Haz clic para tomar una foto!"
          >
            <!-- Camera / Mascot Illustration -->
            <div class="relative w-[320px] sm:w-[420px] h-[220px] sm:h-[260px] bg-white rounded-[3rem] p-6 shadow-2xl border-4 border-black/10 flex flex-col items-center justify-between overflow-hidden">
              
              <!-- Subtle decorative camera body accents -->
              <div class="absolute top-0 left-0 right-0 h-4 bg-stone-900/10 border-b border-black/5"></div>
              <div class="absolute top-4 left-6 flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span class="text-[10px] font-bold text-stone-400 tracking-wider">REC • 4K</span>
              </div>
              <div class="absolute top-4 right-6 flex items-center gap-1">
                <span class="w-3 h-3 rounded-full bg-amber-400"></span>
                <span class="w-3 h-3 rounded-full bg-[#07b667]"></span>
              </div>

              <!-- Top viewfinder bar -->
              <div class="w-full flex justify-between items-center pt-3 px-2">
                <span class="font-mono text-xs font-bold text-stone-400">MOMENTS CAM 01</span>
                <span class="px-2 py-0.5 rounded-md bg-[#EFEEFF] text-[#5540D8] text-[10px] font-bold">
                  {{ isWinking ? '¡CLICK! 📸' : 'MIRANDO EL CURSOR' }}
                </span>
              </div>

              <!-- DUAL INTERACTIVE EYES (They follow mouse pointer!) -->
              <div class="flex items-center justify-center gap-6 sm:gap-10 my-auto">
                <!-- Left Eye -->
                <div
                  ref="leftEyeRef"
                  class="relative w-16 sm:w-20 h-20 sm:h-24 bg-stone-900 rounded-full flex items-center justify-center shadow-inner overflow-hidden border-2 border-stone-800"
                >
                  <div
                    class="relative w-7 sm:w-9 h-7 sm:h-9 rounded-full bg-[#3ef4a1] transition-transform duration-75 ease-out flex items-center justify-center shadow-lg"
                    :style="{ transform: `translate(${leftPupil.x}px, ${leftPupil.y}px) ${isWinking ? 'scaleY(0.1)' : ''}` }"
                  >
                    <!-- Pupil center -->
                    <div class="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-black"></div>
                    <!-- Specular catchlight -->
                    <div class="absolute top-1 right-1 w-2 h-2 rounded-full bg-white"></div>
                  </div>
                </div>

                <!-- Right Eye -->
                <div
                  ref="rightEyeRef"
                  class="relative w-16 sm:w-20 h-20 sm:h-24 bg-stone-900 rounded-full flex items-center justify-center shadow-inner overflow-hidden border-2 border-stone-800"
                >
                  <div
                    class="relative w-7 sm:w-9 h-7 sm:h-9 rounded-full bg-[#3ef4a1] transition-transform duration-75 ease-out flex items-center justify-center shadow-lg"
                    :style="{ transform: `translate(${rightPupil.x}px, ${rightPupil.y}px) ${isWinking ? 'scaleY(0.1)' : ''}` }"
                  >
                    <!-- Pupil center -->
                    <div class="w-4 sm:w-5 h-4 sm:h-5 rounded-full bg-black"></div>
                    <!-- Specular catchlight -->
                    <div class="absolute top-1 right-1 w-2 h-2 rounded-full bg-white"></div>
                  </div>
                </div>
              </div>

              <!-- Bottom Lens Bar / Smile -->
              <div class="w-full flex items-center justify-between pb-1 px-4 text-[11px] text-stone-500 font-medium">
                <span class="flex items-center gap-1">
                  <Icon name="lucide:sparkles" class="w-3.5 h-3.5 text-[#07b667]" />
                  Sensor IA Activo
                </span>
                <span class="hover:text-black transition-colors font-semibold">Toca para disparar el flash</span>
              </div>
            </div>

            <!-- Mascot Flash Glow Overlay -->
            <div
              v-if="flashActive"
              class="fixed inset-0 bg-white pointer-events-none z-[10000] animate-flash-fade"
            ></div>
          </div>

          <p class="mt-4 text-xs font-semibold text-stone-500 tracking-wide uppercase">
            Mueve tu mouse para interactuar • Los ojos te siguen 👀
          </p>
        </div>
      </div>
    </section>

    <!-- SLIDING INFINITE MARQUEE TICKER (Monosexpertos signature ticker) -->
    <section class="bg-black text-white py-4 overflow-hidden border-y border-stone-800 relative z-20">
      <div class="marquee-track flex whitespace-nowrap gap-12 font-bold tracking-tight text-sm sm:text-base">
        <div class="marquee-group flex items-center gap-12">
          <span>Tu evento puede verse <b>más pro</b> que nunca 📸</span>
          <span>•</span>
          <span>Búsqueda Facial Instantánea con IA 🤖</span>
          <span>•</span>
          <span>Descargas en Ultra Alta Resolución ⚡</span>
          <span>•</span>
          <span>Pagos 100% Seguros con Wompi 🛡️</span>
          <span>•</span>
          <span>Fotógrafos Profesionales Verificados ⭐</span>
          <span>•</span>
          <span>Cobros Directos en COP 💳</span>
          <span>•</span>
          <span>Cobertura en Todo Colombia 🇨🇴</span>
          <span>•</span>
        </div>
        <div class="marquee-group flex items-center gap-12" aria-hidden="true">
          <span>Tu evento puede verse <b>más pro</b> que nunca 📸</span>
          <span>•</span>
          <span>Búsqueda Facial Instantánea con IA 🤖</span>
          <span>•</span>
          <span>Descargas en Ultra Alta Resolución ⚡</span>
          <span>•</span>
          <span>Pagos 100% Seguros con Wompi 🛡️</span>
          <span>•</span>
          <span>Fotógrafos Profesionales Verificados ⭐</span>
          <span>•</span>
          <span>Cobros Directos en COP 💳</span>
          <span>•</span>
          <span>Cobertura en Todo Colombia 🇨🇴</span>
          <span>•</span>
        </div>
      </div>
    </section>

    <!-- SECTION 1: VALUE PILLARS & STATS (Diseño encantador, Trabajo colaborativo, etc.) -->
    <section id="servicios" class="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Section Tag -->
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="px-4 py-1.5 rounded-full bg-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider">
          Propuesta de Valor
        </span>
        <h2 class="mt-4 text-3xl sm:text-5xl font-black text-[#121212] tracking-tight">
          Diseñado para enamorar a fotógrafos y asistentes
        </h2>
        <p class="mt-4 text-base sm:text-xl text-stone-600 font-normal">
          Combinamos tecnología moderna, estética editorial y una velocidad vertiginosa para inmortalizar tus recuerdos.
        </p>
      </div>

      <!-- 4 Pillars Grid with pastel hover states like Monosexpertos -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <!-- Card 1: Lavender Pastel -->
        <div
          class="p-8 rounded-3xl bg-white border border-stone-200 hover:bg-[#EFEEFF] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
          @mouseenter="cursorHovered = true"
          @mouseleave="cursorHovered = false"
        >
          <div class="w-14 h-14 rounded-2xl bg-[#D7D5FF] flex items-center justify-center text-[#5540D8] text-2xl font-black mb-6 group-hover:scale-110 transition-transform">
            ✨
          </div>
          <h3 class="text-2xl font-black text-stone-900 mb-3">
            Diseño encantador
          </h3>
          <p class="text-stone-600 text-sm sm:text-base leading-relaxed">
            Galerías limpias, modernas y ligeras diseñadas para que revivir cada instante sea tan emocionante como el primer día.
          </p>
        </div>

        <!-- Card 2: Fresh Mint Pastel -->
        <div
          class="p-8 rounded-3xl bg-white border border-stone-200 hover:bg-[#F6FFE5] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
          @mouseenter="cursorHovered = true"
          @mouseleave="cursorHovered = false"
        >
          <div class="w-14 h-14 rounded-2xl bg-[#E5FFB7] flex items-center justify-center text-[#557F1C] text-2xl font-black mb-6 group-hover:scale-110 transition-transform">
            🤝
          </div>
          <h3 class="text-2xl font-black text-stone-900 mb-3">
            Trabajo colaborativo
          </h3>
          <p class="text-stone-600 text-sm sm:text-base leading-relaxed">
            Conectamos a fotógrafos de alto nivel con deportistas, familias y asistentes en un ecosistema transparente.
          </p>
        </div>

        <!-- Card 3: Butter Yellow Pastel -->
        <div
          class="p-8 rounded-3xl bg-white border border-stone-200 hover:bg-[#FFFEEE] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
          @mouseenter="cursorHovered = true"
          @mouseleave="cursorHovered = false"
        >
          <div class="w-14 h-14 rounded-2xl bg-[#FFF9BF] flex items-center justify-center text-[#997300] text-2xl font-black mb-6 group-hover:scale-110 transition-transform">
            🔒
          </div>
          <h3 class="text-2xl font-black text-stone-900 mb-3">
            Lealtad a tus fotos
          </h3>
          <p class="text-stone-600 text-sm sm:text-base leading-relaxed">
            Almacenamiento seguro en la nube con máxima fidelidad. Accede y vuelve a descargar tus fotos de por vida.
          </p>
        </div>

        <!-- Card 4: Coral Pastel -->
        <div
          class="p-8 rounded-3xl bg-white border border-stone-200 hover:bg-[#FFF1F0] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl group"
          @mouseenter="cursorHovered = true"
          @mouseleave="cursorHovered = false"
        >
          <div class="w-14 h-14 rounded-2xl bg-[#FFD4D0] flex items-center justify-center text-[#C43826] text-2xl font-black mb-6 group-hover:scale-110 transition-transform">
            ⚡
          </div>
          <h3 class="text-2xl font-black text-stone-900 mb-3">
            Rendimiento superior
          </h3>
          <p class="text-stone-600 text-sm sm:text-base leading-relaxed">
            Reconocimiento facial con IA en 2 segundos, pasarela de pago instantánea con Wompi y cero fricciones.
          </p>
        </div>
      </div>

      <!-- Live Counters Ribbon -->
      <div class="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-3xl bg-white border border-stone-200 shadow-sm text-center">
        <div>
          <p class="text-4xl sm:text-5xl font-black text-stone-900 tracking-tight">+15,000</p>
          <p class="text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-500 mt-1">Fotos Capturadas</p>
        </div>
        <div>
          <p class="text-4xl sm:text-5xl font-black text-stone-900 tracking-tight">+1,200</p>
          <p class="text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-500 mt-1">Usuarios Felices</p>
        </div>
        <div>
          <p class="text-4xl sm:text-5xl font-black text-stone-900 tracking-tight">+150</p>
          <p class="text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-500 mt-1">Fotógrafos Pro</p>
        </div>
        <div>
          <p class="text-4xl sm:text-5xl font-black text-[#07b667] tracking-tight">100%</p>
          <p class="text-xs sm:text-sm font-semibold uppercase tracking-wider text-stone-500 mt-1">Pagos Seguros Wompi</p>
        </div>
      </div>
    </section>

    <!-- SECTION 2: OUR WORK / REAL EVENT SHOWCASE ("Nuestro trabajo") -->
    <section id="nuestro-trabajo" class="py-24 bg-stone-100/70 border-y border-stone-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span class="px-4 py-1.5 rounded-full bg-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider">
              Eventos Recientes
            </span>
            <h2 class="mt-4 text-3xl sm:text-5xl font-black text-[#121212] tracking-tight">
              Acompañamos a inmortalizar momentos épicos
            </h2>
          </div>
          <NuxtLink
            to="/marketplace"
            class="group inline-flex items-center gap-3 text-stone-900 font-bold hover:text-[#07b667] transition-colors"
          >
            <span>Ver todos los eventos</span>
            <Icon name="lucide:arrow-right" class="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </NuxtLink>
        </div>

        <!-- Event Cards Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <!-- Event 1 -->
          <NuxtLink
            to="/marketplace"
            class="group rounded-3xl overflow-hidden bg-white border border-stone-200 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
            @mouseenter="cursorHovered = true"
            @mouseleave="cursorHovered = false"
          >
            <div class="aspect-[4/3] w-full overflow-hidden relative bg-stone-900">
              <img
                src="/img/Alacranes.jpg"
                alt="Sesión Alacranes"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <span class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-black/60 text-white backdrop-blur-md">
                Deportes
              </span>
            </div>
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-xl font-black text-stone-900 group-hover:text-[#07b667] transition-colors">
                  Sesión Alacranes
                </h3>
                <p class="text-sm text-stone-500 mt-1">Cancha Mercedario • 303 fotos disponibles</p>
              </div>
              <div class="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-600">
                <span>📸 Tu Lente Deportivo</span>
                <span class="text-[#07b667] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Ver galería <Icon name="lucide:arrow-up-right" class="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </NuxtLink>

          <!-- Event 2 -->
          <NuxtLink
            to="/marketplace"
            class="group rounded-3xl overflow-hidden bg-white border border-stone-200 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
            @mouseenter="cursorHovered = true"
            @mouseleave="cursorHovered = false"
          >
            <div class="aspect-[4/3] w-full overflow-hidden relative bg-stone-900">
              <img
                src="/img/Boca-nariño.jpeg"
                alt="Boca Sub 17 vs Atlético Cauca"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <span class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-[#07b667] text-black backdrop-blur-md">
                Fútbol Base
              </span>
            </div>
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-xl font-black text-stone-900 group-hover:text-[#07b667] transition-colors">
                  Boca Sub 17 vs Atlético Cauca
                </h3>
                <p class="text-sm text-stone-500 mt-1">Estadio Ciro López • 469 fotos disponibles</p>
              </div>
              <div class="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-600">
                <span>📸 FotoSport Popayán</span>
                <span class="text-[#07b667] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Ver galería <Icon name="lucide:arrow-up-right" class="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </NuxtLink>

          <!-- Event 3 -->
          <NuxtLink
            to="/marketplace"
            class="group rounded-3xl overflow-hidden bg-white border border-stone-200 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
            @mouseenter="cursorHovered = true"
            @mouseleave="cursorHovered = false"
          >
            <div class="aspect-[4/3] w-full overflow-hidden relative bg-stone-900">
              <img
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=1000"
                alt="Boda de Ensueño"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <span class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white backdrop-blur-md">
                Bodas
              </span>
            </div>
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-xl font-black text-stone-900 group-hover:text-[#07b667] transition-colors">
                  Boda de Ensueño en el Valle
                </h3>
                <p class="text-sm text-stone-500 mt-1">Hacienda Santa Rosa • 850 fotos disponibles</p>
              </div>
              <div class="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-600">
                <span>📸 Studio Memories</span>
                <span class="text-[#07b667] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Ver galería <Icon name="lucide:arrow-up-right" class="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </NuxtLink>

          <!-- Event 4 -->
          <NuxtLink
            to="/marketplace"
            class="group rounded-3xl overflow-hidden bg-white border border-stone-200 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
            @mouseenter="cursorHovered = true"
            @mouseleave="cursorHovered = false"
          >
            <div class="aspect-[4/3] w-full overflow-hidden relative bg-stone-900">
              <img
                src="https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&q=80&w=1000"
                alt="Gran Fondo Ciclismo"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <span class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-black backdrop-blur-md">
                Ciclismo
              </span>
            </div>
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-xl font-black text-stone-900 group-hover:text-[#07b667] transition-colors">
                  Gran Fondo de la Montaña
                </h3>
                <p class="text-sm text-stone-500 mt-1">Ruta del Café • 1,240 fotos por dorsal</p>
              </div>
              <div class="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-600">
                <span>📸 Pedal Cam Colombia</span>
                <span class="text-[#07b667] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Ver galería <Icon name="lucide:arrow-up-right" class="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </NuxtLink>

          <!-- Event 5 -->
          <NuxtLink
            to="/marketplace"
            class="group rounded-3xl overflow-hidden bg-white border border-stone-200 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
            @mouseenter="cursorHovered = true"
            @mouseleave="cursorHovered = false"
          >
            <div class="aspect-[4/3] w-full overflow-hidden relative bg-stone-900">
              <img
                src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&q=80&w=1000"
                alt="Sunset Music Fest"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <span class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-fuchsia-600 text-white backdrop-blur-md">
                Festivales
              </span>
            </div>
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-xl font-black text-stone-900 group-hover:text-[#07b667] transition-colors">
                  Sunset Music Fest
                </h3>
                <p class="text-sm text-stone-500 mt-1">Popayán • 980 fotos de fiesta y tarima</p>
              </div>
              <div class="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-600">
                <span>📸 Neon Beats Lente</span>
                <span class="text-[#07b667] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Ver galería <Icon name="lucide:arrow-up-right" class="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </NuxtLink>

          <!-- Event 6 -->
          <NuxtLink
            to="/marketplace"
            class="group rounded-3xl overflow-hidden bg-white border border-stone-200 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
            @mouseenter="cursorHovered = true"
            @mouseleave="cursorHovered = false"
          >
            <div class="aspect-[4/3] w-full overflow-hidden relative bg-stone-900">
              <img
                src="https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&q=80&w=1000"
                alt="Torneo Voleibol"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
              <span class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-sky-500 text-white backdrop-blur-md">
                Torneo
              </span>
            </div>
            <div class="p-6 flex-1 flex flex-col justify-between">
              <div>
                <h3 class="text-xl font-black text-stone-900 group-hover:text-[#07b667] transition-colors">
                  Torneo de Voleibol Regional
                </h3>
                <p class="text-sm text-stone-500 mt-1">Coliseo La Estancia • 520 fotos</p>
              </div>
              <div class="mt-4 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-stone-600">
                <span>📸 Acción Deportiva</span>
                <span class="text-[#07b667] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Ver galería <Icon name="lucide:arrow-up-right" class="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- SECTION 3: THE PHYSICS CANVAS WITH MATTER.JS (Monosexpertos Signature Feature) -->
    <section id="tecnologia" class="py-24 bg-white border-b border-stone-200 overflow-hidden relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="text-center max-w-3xl mx-auto mb-10">
          <span class="px-4 py-1.5 rounded-full bg-[#EFEEFF] text-[#5540D8] text-xs font-bold uppercase tracking-wider">
            Física Interactiva Matter.js
          </span>
          <h2 class="mt-4 text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
            Arrastra, lanza y experimenta nuestra tecnología
          </h2>
          <p class="mt-4 text-stone-600 text-base sm:text-lg">
            Haz clic en cualquier token, agítalo o lánzalo contra las paredes. Si estás en el celular, ¡mueve tu teléfono para activar el giroscopio!
          </p>
        </div>

        <!-- Controls Bar for Physics Sandbox -->
        <div class="flex flex-wrap items-center justify-center gap-3 mb-6">
          <button
            @click="spawnMorePills"
            class="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-black text-white text-xs sm:text-sm font-bold flex items-center gap-2 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <span>Lanzar más tokens</span>
            <span>🚀</span>
          </button>
          <button
            @click="shakePhysics"
            class="px-5 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-bold flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <span>Sacudir pantalla</span>
            <span>🎲</span>
          </button>
          <button
            @click="resetPhysics"
            class="px-5 py-2.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs sm:text-sm font-bold flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
          >
            <span>Reiniciar</span>
            <span>🔄</span>
          </button>
          <span class="hidden sm:inline text-xs font-semibold text-stone-400 ml-2">
            Tip: Arrastra con el mouse o dedo
          </span>
        </div>

        <!-- Canvas Container Box -->
        <div
          ref="physicsContainerRef"
          class="relative w-full h-[480px] sm:h-[540px] rounded-[2.5rem] bg-[#FAFAF8] border-2 border-dashed border-stone-300 overflow-hidden shadow-inner flex items-center justify-center"
        >
          <!-- Canvas will be created here by Matter.js -->
          <canvas ref="physicsCanvasRef" class="w-full h-full block cursor-grab active:cursor-grabbing"></canvas>
          
          <!-- Subtle watermark inside canvas -->
          <div class="absolute inset-0 pointer-events-none flex items-center justify-center opacity-5 select-none">
            <span class="text-7xl sm:text-9xl font-black uppercase text-black">MOMENTS</span>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 4: METHODOLOGY / HORIZONTAL SCROLL (Monosexpertos "Nuestra metodología") -->
    <section id="metodologia" class="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="text-center max-w-3xl mx-auto mb-16">
        <span class="px-4 py-1.5 rounded-full bg-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider">
          Metodología Paso a Paso
        </span>
        <h2 class="mt-4 text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
          Nuestra metodología en 3 fases simples
        </h2>
        <p class="mt-4 text-stone-600 text-base sm:text-lg">
          Tanto si buscas tus fotos como si eres el fotógrafo organizando el evento, este es el camino hacia la perfección.
        </p>
      </div>

      <!-- 3 Phase Cards with Monosexpertos interactive toggles & distinct pastel tones -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- FASE 1: Descubrimiento (Pastel Lavender) -->
        <div class="rounded-3xl bg-[#EFEEFF] p-8 sm:p-10 border border-[#D7D5FF] flex flex-col justify-between shadow-sm">
          <div>
            <div class="flex items-center justify-between mb-8">
              <span class="px-3.5 py-1 rounded-full bg-[#D7D5FF] text-[#5540D8] text-xs font-black uppercase tracking-wider">
                Fase 01
              </span>
              <span class="font-serif italic text-2xl font-bold text-[#5540D8]">Descubrimiento</span>
            </div>
            
            <h3 class="text-2xl sm:text-3xl font-black text-stone-900 mb-6">
              Localiza tu evento en segundos
            </h3>

            <!-- Interactive Accordion Items within Phase 1 -->
            <div class="space-y-3">
              <div
                class="rounded-2xl bg-white/70 p-4 cursor-pointer border border-white/60 transition-all"
                @click="toggleMethodology('fase1-1')"
              >
                <div class="flex items-center justify-between font-bold text-sm text-stone-900">
                  <span>1. Búsqueda por geolocalización</span>
                  <span class="text-lg">{{ activeMethodology === 'fase1-1' ? '−' : '+' }}</span>
                </div>
                <p v-if="activeMethodology === 'fase1-1'" class="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Filtra por ciudad, cancha o recinto para ver todos los torneos y celebraciones cubiertas en tu zona.
                </p>
              </div>

              <div
                class="rounded-2xl bg-white/70 p-4 cursor-pointer border border-white/60 transition-all"
                @click="toggleMethodology('fase1-2')"
              >
                <div class="flex items-center justify-between font-bold text-sm text-stone-900">
                  <span>2. Reconocimiento facial con IA</span>
                  <span class="text-lg">{{ activeMethodology === 'fase1-2' ? '−' : '+' }}</span>
                </div>
                <p v-if="activeMethodology === 'fase1-2'" class="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Sube una selfie y nuestro modelo de visión computacional aislará en segundos cada foto donde aparezcas.
                </p>
              </div>

              <div
                class="rounded-2xl bg-white/70 p-4 cursor-pointer border border-white/60 transition-all"
                @click="toggleMethodology('fase1-3')"
              >
                <div class="flex items-center justify-between font-bold text-sm text-stone-900">
                  <span>3. Filtro por número de dorsal</span>
                  <span class="text-lg">{{ activeMethodology === 'fase1-3' ? '−' : '+' }}</span>
                </div>
                <p v-if="activeMethodology === 'fase1-3'" class="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Para carreras, ciclismo y fútbol, digita tu número de camiseta y accede a tu set de fotos al instante.
                </p>
              </div>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-[#D7D5FF]/60 flex items-center justify-between text-xs font-bold text-[#5540D8]">
            <span>Cero pérdida de tiempo</span>
            <span>Algoritmos ultra rápidos →</span>
          </div>
        </div>

        <!-- FASE 2: Selección y Billetera (Pastel Mint) -->
        <div class="rounded-3xl bg-[#F6FFE5] p-8 sm:p-10 border border-[#E5FFB7] flex flex-col justify-between shadow-sm">
          <div>
            <div class="flex items-center justify-between mb-8">
              <span class="px-3.5 py-1 rounded-full bg-[#E5FFB7] text-[#557F1C] text-xs font-black uppercase tracking-wider">
                Fase 02
              </span>
              <span class="font-serif italic text-2xl font-bold text-[#557F1C]">Selección</span>
            </div>
            
            <h3 class="text-2xl sm:text-3xl font-black text-stone-900 mb-6">
              Elige tus favoritas protegidas
            </h3>

            <!-- Interactive Accordion Items within Phase 2 -->
            <div class="space-y-3">
              <div
                class="rounded-2xl bg-white/70 p-4 cursor-pointer border border-white/60 transition-all"
                @click="toggleMethodology('fase2-1')"
              >
                <div class="flex items-center justify-between font-bold text-sm text-stone-900">
                  <span>1. Previsualización nítida</span>
                  <span class="text-lg">{{ activeMethodology === 'fase2-1' ? '−' : '+' }}</span>
                </div>
                <p v-if="activeMethodology === 'fase2-1'" class="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Inspecciona gestos, nitidez y encuadres con marcas de agua dinámicas que respetan el trabajo del fotógrafo.
                </p>
              </div>

              <div
                class="rounded-2xl bg-white/70 p-4 cursor-pointer border border-white/60 transition-all"
                @click="toggleMethodology('fase2-2')"
              >
                <div class="flex items-center justify-between font-bold text-sm text-stone-900">
                  <span>2. Carrito y Billetera Digital</span>
                  <span class="text-lg">{{ activeMethodology === 'fase2-2' ? '−' : '+' }}</span>
                </div>
                <p v-if="activeMethodology === 'fase2-2'" class="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Agrega fotos individuales o álbumes completos. Usa tu saldo recargado para comprar con 1 solo toque.
                </p>
              </div>

              <div
                class="rounded-2xl bg-white/70 p-4 cursor-pointer border border-white/60 transition-all"
                @click="toggleMethodology('fase2-3')"
              >
                <div class="flex items-center justify-between font-bold text-sm text-stone-900">
                  <span>3. Membresía Moments PRO</span>
                  <span class="text-lg">{{ activeMethodology === 'fase2-3' ? '−' : '+' }}</span>
                </div>
                <p v-if="activeMethodology === 'fase2-3'" class="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Por solo $5.000 COP desbloquea búsqueda facial ilimitada con IA y descargas en máxima resolución.
                </p>
              </div>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-[#E5FFB7]/60 flex items-center justify-between text-xs font-bold text-[#557F1C]">
            <span>Protección anticopia</span>
            <span>Precios transparentes →</span>
          </div>
        </div>

        <!-- FASE 3: Descarga y Recuerdos (Pastel Butter) -->
        <div class="rounded-3xl bg-[#FFFEEE] p-8 sm:p-10 border border-[#FFF9BF] flex flex-col justify-between shadow-sm">
          <div>
            <div class="flex items-center justify-between mb-8">
              <span class="px-3.5 py-1 rounded-full bg-[#FFF9BF] text-[#997300] text-xs font-black uppercase tracking-wider">
                Fase 03
              </span>
              <span class="font-serif italic text-2xl font-bold text-[#997300]">Entrega</span>
            </div>
            
            <h3 class="text-2xl sm:text-3xl font-black text-stone-900 mb-6">
              Descarga en Ultra Calidad
            </h3>

            <!-- Interactive Accordion Items within Phase 3 -->
            <div class="space-y-3">
              <div
                class="rounded-2xl bg-white/70 p-4 cursor-pointer border border-white/60 transition-all"
                @click="toggleMethodology('fase3-1')"
              >
                <div class="flex items-center justify-between font-bold text-sm text-stone-900">
                  <span>1. Pasarela segura con Wompi</span>
                  <span class="text-lg">{{ activeMethodology === 'fase3-1' ? '−' : '+' }}</span>
                </div>
                <p v-if="activeMethodology === 'fase3-1'" class="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Paga con PSE, Nequi, Bancolombia o tarjetas de crédito con cifrado bancario de última generación.
                </p>
              </div>

              <div
                class="rounded-2xl bg-white/70 p-4 cursor-pointer border border-white/60 transition-all"
                @click="toggleMethodology('fase3-2')"
              >
                <div class="flex items-center justify-between font-bold text-sm text-stone-900">
                  <span>2. Archivos originales sin compresión</span>
                  <span class="text-lg">{{ activeMethodology === 'fase3-2' ? '−' : '+' }}</span>
                </div>
                <p v-if="activeMethodology === 'fase3-2'" class="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Descarga directamente el archivo en resolución nativa, sin compresión de redes sociales, ideal para imprimir o postear.
                </p>
              </div>

              <div
                class="rounded-2xl bg-white/70 p-4 cursor-pointer border border-white/60 transition-all"
                @click="toggleMethodology('fase3-3')"
              >
                <div class="flex items-center justify-between font-bold text-sm text-stone-900">
                  <span>3. Historial de compras permanente</span>
                  <span class="text-lg">{{ activeMethodology === 'fase3-3' ? '−' : '+' }}</span>
                </div>
                <p v-if="activeMethodology === 'fase3-3'" class="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed">
                  Tus fotos compradas quedan guardadas para siempre en tu cuenta para descargarlas cuando las necesites.
                </p>
              </div>
            </div>
          </div>

          <div class="mt-8 pt-6 border-t border-[#FFF9BF]/60 flex items-center justify-between text-xs font-bold text-[#997300]">
            <span>Garantía de satisfacción</span>
            <span>Entrega inmediata →</span>
          </div>
        </div>

      </div>
    </section>

    <!-- SECTION 5: MOMENTS PRO & PHOTOGRAPHER PORTAL CALLOUTS -->
    <section class="py-20 bg-stone-900 text-white relative overflow-hidden">
      
      <!-- Background glowing orb -->
      <div class="absolute -right-20 -top-20 w-96 h-96 bg-[#07b667]/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div class="absolute -left-20 -bottom-20 w-96 h-96 bg-purple-600/15 rounded-full blur-[100px] pointer-events-none"></div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          <!-- Box 1: Moments Pro Membership -->
          <div class="p-8 sm:p-12 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#07b667]/20 border border-[#07b667]/40 text-[#3ef4a1] text-xs font-bold uppercase tracking-wider mb-6">
                <Icon name="lucide:crown" class="w-4 h-4" />
                Membresía Moments PRO
              </div>
              <h3 class="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
                Vive la experiencia PRO por solo <span class="text-[#3ef4a1]">$5.000 COP</span>
              </h3>
              <p class="text-stone-300 text-base leading-relaxed mb-6">
                Acceso prioritario a búsqueda facial sin límites, descargas RAW de alta velocidad y respaldo permanente en la nube.
              </p>
              <ul class="space-y-3 text-sm text-stone-300 mb-8 font-medium">
                <li class="flex items-center gap-2">
                  <Icon name="lucide:check-circle" class="w-4 h-4 text-[#3ef4a1]" />
                  Acceso prioritario a eventos y descargas Ultra HD
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="lucide:check-circle" class="w-4 h-4 text-[#3ef4a1]" />
                  Reconocimiento facial con IA ilimitado
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="lucide:check-circle" class="w-4 h-4 text-[#3ef4a1]" />
                  Descarga instantánea sin marcas de agua
                </li>
              </ul>
            </div>
            <NuxtLink
              to="/marketplace"
              class="w-full sm:w-auto self-start px-8 py-4 rounded-full bg-[#3ef4a1] hover:bg-[#2dd68a] text-black font-extrabold text-sm tracking-tight transition-all active:scale-95 text-center"
              @mouseenter="cursorHovered = true"
              @mouseleave="cursorHovered = false"
            >
              Comenzar con Moments PRO
            </NuxtLink>
          </div>

          <!-- Box 2: Photographer Portal -->
          <div class="p-8 sm:p-12 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
            <div>
              <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-6">
                <Icon name="lucide:camera" class="w-4 h-4" />
                Portal Oficial de Fotógrafos
              </div>
              <h3 class="text-3xl sm:text-4xl font-black text-white leading-tight mb-4">
                Monetiza tu lente y vende tus fotos sin intermediarios
              </h3>
              <p class="text-stone-300 text-base leading-relaxed mb-6">
                Sube tus álbumes en segundos. Moments se encarga de las marcas de agua, la indexación facial y la pasarela de pago bancaria.
              </p>
              <ul class="space-y-3 text-sm text-stone-300 mb-8 font-medium">
                <li class="flex items-center gap-2">
                  <Icon name="lucide:check-circle" class="w-4 h-4 text-indigo-400" />
                  Cobros directos en pesos colombianos (COP)
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="lucide:check-circle" class="w-4 h-4 text-indigo-400" />
                  Protección 100% anticopia con marca inteligente
                </li>
                <li class="flex items-center gap-2">
                  <Icon name="lucide:check-circle" class="w-4 h-4 text-indigo-400" />
                  Panel con estadísticas de ventas en vivo
                </li>
              </ul>
            </div>
            <NuxtLink
              to="/photographer-access"
              class="w-full sm:w-auto self-start px-8 py-4 rounded-full bg-white hover:bg-stone-200 text-black font-extrabold text-sm tracking-tight transition-all active:scale-95 text-center"
              @mouseenter="cursorHovered = true"
              @mouseleave="cursorHovered = false"
            >
              Postularme como Fotógrafo Pro
            </NuxtLink>
          </div>

        </div>
      </div>
    </section>

    <!-- SECTION 6: FAQ ACCORDION -->
    <section class="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <span class="px-4 py-1.5 rounded-full bg-stone-200 text-stone-800 text-xs font-bold uppercase tracking-wider">
          Preguntas Frecuentes
        </span>
        <h2 class="mt-4 text-3xl sm:text-5xl font-black text-stone-900 tracking-tight">
          Todo lo que necesitas saber
        </h2>
      </div>

      <div class="space-y-4">
        <div
          v-for="(faq, idx) in faqs"
          :key="idx"
          class="rounded-3xl bg-white border border-stone-200 overflow-hidden transition-all duration-300"
        >
          <button
            @click="toggleFaq(idx)"
            class="w-full p-6 text-left flex items-center justify-between font-bold text-base sm:text-lg text-stone-900 hover:text-[#07b667] transition-colors"
          >
            <span>{{ faq.q }}</span>
            <span class="w-8 h-8 rounded-full bg-stone-100 flex items-center justify-center text-stone-600 text-base font-black shrink-0 ml-4">
              {{ activeFaq === idx ? '−' : '+' }}
            </span>
          </button>
          <div v-if="activeFaq === idx" class="px-6 pb-6 text-sm sm:text-base text-stone-600 leading-relaxed border-t border-stone-100 pt-4">
            {{ faq.a }}
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 7: CONTACT / "HABLEMOS" & FOOTER (Monosexpertos style) -->
    <footer class="bg-black text-white pt-24 pb-12 border-t border-stone-800 relative">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-16 border-b border-stone-800">
          
          <!-- Left: Big typography & direct message -->
          <div class="lg:col-span-6 space-y-6">
            <span class="px-3.5 py-1 rounded-full bg-white/10 text-stone-300 text-xs font-bold uppercase tracking-wider">
              Contáctanos
            </span>
            <h2 class="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
              ¿Tienes un evento o duda?<br />
              <span class="font-serif italic font-normal text-[#3ef4a1]">Hablemos.</span>
            </h2>
            <p class="text-stone-400 text-base max-w-md">
              Estamos aquí para ayudarte a cubrir tu evento deportivo, social o corporativo, o responder tus dudas sobre compras y descargas.
            </p>

            <div class="pt-4 flex flex-wrap gap-4">
              <a
                href="https://wa.me/573000000000?text=Hola,%20quisiera%20más%20información%20sobre%20Moments"
                target="_blank"
                rel="noopener"
                class="inline-flex items-center gap-3 px-6 py-3.5 rounded-full bg-[#07b667] text-black font-bold text-sm hover:bg-[#3ef4a1] transition-all active:scale-95"
              >
                <Icon name="lucide:message-circle" class="w-5 h-5" />
                <span>Escríbenos a WhatsApp</span>
              </a>
              <NuxtLink
                to="/marketplace"
                class="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all"
              >
                <span>Ver Galerías</span>
                <Icon name="lucide:arrow-right" class="w-4 h-4" />
              </NuxtLink>
            </div>
          </div>

          <!-- Right: Quick Links & Info -->
          <div class="lg:col-span-6 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h4 class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Explorar</h4>
              <ul class="space-y-2.5 text-sm text-stone-300">
                <li><NuxtLink to="/marketplace" class="hover:text-white transition-colors">Eventos</NuxtLink></li>
                <li><NuxtLink to="/photographer-access" class="hover:text-white transition-colors">Para Fotógrafos</NuxtLink></li>
                <li><NuxtLink to="/login" class="hover:text-white transition-colors">Iniciar Sesión</NuxtLink></li>
                <li><NuxtLink to="/register" class="hover:text-white transition-colors">Registrarme</NuxtLink></li>
              </ul>
            </div>

            <div>
              <h4 class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Legal</h4>
              <ul class="space-y-2.5 text-sm text-stone-300">
                <li><NuxtLink to="/terms-user" class="hover:text-white transition-colors">Términos de Usuario</NuxtLink></li>
                <li><NuxtLink to="/terms-photographer" class="hover:text-white transition-colors">Términos de Fotógrafo</NuxtLink></li>
                <li><NuxtLink to="/privacy" class="hover:text-white transition-colors">Privacidad</NuxtLink></li>
                <li><NuxtLink to="/refunds" class="hover:text-white transition-colors">Reembolsos</NuxtLink></li>
                <li><NuxtLink to="/data-deletion" class="hover:text-white transition-colors">Eliminación de Datos</NuxtLink></li>
              </ul>
            </div>

            <div>
              <h4 class="text-xs font-bold uppercase tracking-widest text-stone-400 mb-4">Seguridad</h4>
              <p class="text-xs text-stone-400 leading-relaxed mb-3">
                Pagos encriptados con Wompi Bancolombia. Marcas de agua protegidas y entrega digital instantánea.
              </p>
              <div class="flex items-center gap-2 text-stone-300 text-xs font-bold">
                <span class="w-2 h-2 rounded-full bg-[#07b667]"></span>
                <span>Servicio 100% Operativo</span>
              </div>
            </div>
          </div>

        </div>

        <!-- Giant Bottom Brand Text -->
        <div class="pt-12 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {{ new Date().getFullYear() }} Moments. Todos los derechos reservados. Hecho con ❤️ para eventos inolvidables.</p>
          <div class="flex items-center gap-6">
            <span class="hover:text-white transition-colors cursor-pointer" @click="scrollToTop">Volver arriba ↑</span>
          </div>
        </div>

      </div>
    </footer>

  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, computed } from 'vue'
import Matter from 'matter-js'

// Tell Nuxt to use full-screen layout without default Instagram navbar
definePageMeta({
  layout: false
})

// --- Custom Cursor State ---
const cursorDotRef = ref(null)
const cursorRingRef = ref(null)
const cursorVisible = ref(false)
const cursorHovered = ref(false)

// --- Interactive Eyes Mascot State ---
const mascotContainerRef = ref(null)
const leftEyeRef = ref(null)
const rightEyeRef = ref(null)
const leftPupil = reactive({ x: 0, y: 0 })
const rightPupil = reactive({ x: 0, y: 0 })
const isWinking = ref(false)
const flashActive = ref(false)
const mousePos = reactive({ x: 0, y: 0 })

const mascotTiltStyle = computed(() => {
  if (typeof window === 'undefined') return {}
  const centerX = window.innerWidth / 2
  const centerY = window.innerHeight / 2
  const tiltX = ((mousePos.y - centerY) / centerY) * -8
  const tiltY = ((mousePos.x - centerX) / centerX) * 8
  return {
    transform: `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg)`
  }
})

function handleMouseMove(e) {
  mousePos.x = e.clientX
  mousePos.y = e.clientY

  // Follower cursor
  if (cursorDotRef.value && cursorRingRef.value) {
    cursorVisible.value = true
    cursorDotRef.value.style.left = `${e.clientX}px`
    cursorDotRef.value.style.top = `${e.clientY}px`
    cursorRingRef.value.style.left = `${e.clientX}px`
    cursorRingRef.value.style.top = `${e.clientY}px`
  }

  // Calculate eye angles
  calculateEyeOffset(leftEyeRef.value, leftPupil, e.clientX, e.clientY)
  calculateEyeOffset(rightEyeRef.value, rightPupil, e.clientX, e.clientY)
}

function calculateEyeOffset(eyeEl, pupilTarget, clientX, clientY) {
  if (!eyeEl) return
  const rect = eyeEl.getBoundingClientRect()
  const eyeCenterX = rect.left + rect.width / 2
  const eyeCenterY = rect.top + rect.height / 2

  const dx = clientX - eyeCenterX
  const dy = clientY - eyeCenterY
  const angle = Math.atan2(dy, dx)
  const maxDistance = 14
  const distance = Math.min(maxDistance, Math.hypot(dx, dy) / 18)

  pupilTarget.x = Math.cos(angle) * distance
  pupilTarget.y = Math.sin(angle) * distance
}

function triggerCameraFlash() {
  flashActive.value = true
  isWinking.value = true
  setTimeout(() => {
    flashActive.value = false
  }, 200)
  setTimeout(() => {
    isWinking.value = false
  }, 800)
}

// --- Methodology Accordion State ---
const activeMethodology = ref('fase1-1')
function toggleMethodology(id) {
  activeMethodology.value = activeMethodology.value === id ? '' : id
}

// --- FAQ State ---
const activeFaq = ref(0)
function toggleFaq(idx) {
  activeFaq.value = activeFaq.value === idx ? -1 : idx
}

const faqs = [
  {
    q: '¿Cómo encuentro mis fotos si asistí a un evento masivo?',
    a: 'Moments cuenta con dos métodos ultra rápidos: 1) Puedes subir una selfie para que nuestra Inteligencia Artificial de reconocimiento facial encuentre automáticamente cada foto donde aparezcas. 2) O puedes filtrar por tu número de dorsal en eventos deportivos o por hora y lugar del evento.'
  },
  {
    q: '¿En qué calidad recibo las fotografías compradas?',
    a: 'Recibes el archivo original en ultra alta resolución (JPG o RAW según la entrega del fotógrafo), sin compresión destructiva y totalmente libre de marcas de agua. Es el archivo óptimo para impresiones en gran formato y publicaciones de alta calidad.'
  },
  {
    q: '¿Qué métodos de pago están disponibles en Colombia?',
    a: 'Aceptamos pagos 100% seguros integrados con Wompi (Bancolombia): PSE con cualquier banco colombiano, Nequi, tarjetas de crédito (Visa, Mastercard, American Express) y saldo prepago en tu billetera digital Moments.'
  },
  {
    q: '¿Cómo funciona la membresía Moments PRO ($5.000 COP)?',
    a: 'Moments PRO es una suscripción mensual que te otorga búsqueda facial por IA sin restricciones, descargas de máxima prioridad en la nube y acceso anticipado a galerías.'
  },
  {
    q: '¿Cómo puedo postularme como fotógrafo oficial?',
    a: 'Ingresa a nuestra sección "Para Fotógrafos" o visita /photographer-access. Tras un rápido formulario de verificación de identidad y portafolio, podrás crear tus eventos, subir fotos y empezar a recibir pagos en tu cuenta de banco.'
  }
]

// --- Matter.js Physics Engine Sandbox ---
const physicsContainerRef = ref(null)
const physicsCanvasRef = ref(null)
let engine = null
let render = null
let runner = null
let mouseConstraint = null
let pills = []

const pillData = [
  { text: 'Fotógrafos Pro', emoji: '📸', bg: '#EFEEFF', border: '#D7D5FF', textColor: '#5540D8', width: 160 },
  { text: 'Descarga Ultra HD', emoji: '⚡', bg: '#F6FFE5', border: '#E5FFB7', textColor: '#496F15', width: 175 },
  { text: 'Búsqueda Facial IA', emoji: '🤖', bg: '#FFFEEE', border: '#FFF9BF', textColor: '#806100', width: 180 },
  { text: 'Pagos Wompi', emoji: '🛡️', bg: '#EBF9F3', border: '#A6EAD0', textColor: '#066B40', width: 155 },
  { text: 'Torneos & Fútbol', emoji: '⚽', bg: '#FFF1F0', border: '#FFD4D0', textColor: '#B02514', width: 170 },
  { text: 'Bodas & Momentos', emoji: '💍', bg: '#FDF2F8', border: '#FBCFE8', textColor: '#9D174D', width: 175 },
  { text: 'Moments PRO ($5K)', emoji: '💎', bg: '#121212', border: '#3ef4a1', textColor: '#3ef4a1', width: 185 },
  { text: 'Anticopia Segura', emoji: '🔒', bg: '#F3F4F6', border: '#E5E7EB', textColor: '#1F2937', width: 160 },
  { text: 'Resolución 4K', emoji: '⭐', bg: '#FFFBEB', border: '#FDE68A', textColor: '#92400E', width: 150 },
  { text: 'Ciclismo de Ruta', emoji: '🚴', bg: '#ECFEFF', border: '#A5F3FC', textColor: '#0E7490', width: 165 },
  { text: 'Sin Comisiones Extra', emoji: '🏷️', bg: '#F5F3FF', border: '#DDD6FE', textColor: '#6D28D9', width: 190 },
  { text: 'Entrega en 1 Toque', emoji: '🚀', bg: '#F0FDF4', border: '#BBF7D0', textColor: '#166534', width: 170 }
]

function initPhysics() {
  if (typeof window === 'undefined' || !physicsContainerRef.value || !physicsCanvasRef.value) return

  const container = physicsContainerRef.value
  const canvas = physicsCanvasRef.value
  const width = container.clientWidth
  const height = container.clientHeight

  // Set physical pixel ratio for high DPI displays
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.width = width * dpr
  canvas.height = height * dpr
  canvas.style.width = `${width}px`
  canvas.style.height = `${height}px`

  // 1. Engine
  engine = Matter.Engine.create({
    gravity: { x: 0, y: 1, scale: 0.001 }
  })

  // 2. Render
  render = Matter.Render.create({
    canvas: canvas,
    engine: engine,
    options: {
      width: width,
      height: height,
      background: 'transparent',
      wireframes: false
    }
  })

  const ctx = render.context
  ctx.scale(dpr, dpr)

  // 3. Static Boundaries (Walls & Floor)
  const wallThickness = 60
  const floor = Matter.Bodies.rectangle(width / 2, height + wallThickness / 2 - 4, width * 2, wallThickness, {
    isStatic: true,
    render: { visible: false }
  })
  const leftWall = Matter.Bodies.rectangle(-wallThickness / 2 + 4, height / 2, wallThickness, height * 2, {
    isStatic: true,
    render: { visible: false }
  })
  const rightWall = Matter.Bodies.rectangle(width + wallThickness / 2 - 4, height / 2, wallThickness, height * 2, {
    isStatic: true,
    render: { visible: false }
  })

  Matter.World.add(engine.world, [floor, leftWall, rightWall])

  // 4. Create Pills
  pills = pillData.map((data, i) => {
    const pillW = data.width
    const pillH = 46
    const posX = Math.random() * (width - pillW - 40) + pillW / 2 + 20
    const posY = -60 - i * 65

    const body = Matter.Bodies.rectangle(posX, posY, pillW, pillH, {
      chamfer: { radius: 23 },
      restitution: 0.7,
      friction: 0.1,
      frictionAir: 0.015,
      angle: (Math.random() - 0.5) * 0.4,
      render: { visible: false } // we custom draw in afterRender
    })
    body.customData = { ...data, w: pillW, h: pillH }
    return body
  })

  Matter.World.add(engine.world, pills)

  // 5. Mouse Constraint
  const mouse = Matter.Mouse.create(canvas)
  mouse.pixelRatio = dpr
  mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false }
    }
  })
  Matter.World.add(engine.world, mouseConstraint)

  // Prevent scroll hijacking on canvas
  canvas.removeEventListener('mousewheel', mouse.mousewheel)
  canvas.removeEventListener('DOMMouseScroll', mouse.mousewheel)

  // 6. Custom Render in afterRender Event (Crisp rounded pills with text & emojis)
  Matter.Events.on(render, 'afterRender', () => {
    const allBodies = Matter.Composite.allBodies(engine.world)
    for (const body of allBodies) {
      if (!body.customData) continue

      const { position, angle, customData } = body
      const { w, h, bg, border, textColor, text, emoji } = customData

      ctx.save()
      ctx.translate(position.x, position.y)
      ctx.rotate(angle)

      // Draw rounded rectangle pill with fallback
      ctx.beginPath()
      const radius = h / 2
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(-w / 2, -h / 2, w, h, radius)
      } else {
        const rx = -w / 2
        const ry = -h / 2
        ctx.moveTo(rx + radius, ry)
        ctx.lineTo(rx + w - radius, ry)
        ctx.quadraticCurveTo(rx + w, ry, rx + w, ry + radius)
        ctx.lineTo(rx + w, ry + h - radius)
        ctx.quadraticCurveTo(rx + w, ry + h, rx + w - radius, ry + h)
        ctx.lineTo(rx + radius, ry + h)
        ctx.quadraticCurveTo(rx, ry + h, rx, ry + h - radius)
        ctx.lineTo(rx, ry + radius)
        ctx.quadraticCurveTo(rx, ry, rx + radius, ry)
      }
      ctx.fillStyle = bg
      ctx.fill()
      ctx.lineWidth = 2
      ctx.strokeStyle = border
      ctx.stroke()

      // Draw text and emoji inside pill
      ctx.font = '700 13px "Plus Jakarta Sans", sans-serif'
      ctx.fillStyle = textColor
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(`${emoji}  ${text}`, 0, 1)

      ctx.restore()
    }
  })

  // 7. Start Engine & Render
  Matter.Runner.run(engine)
  Matter.Render.run(render)

  // Gyroscope on mobile
  if (typeof window !== 'undefined' && window.DeviceOrientationEvent) {
    window.addEventListener('deviceorientation', handleGyro)
  }
}

function handleGyro(event) {
  if (!engine || event.gamma === null || event.beta === null) return
  const gx = event.gamma / 45
  const gy = event.beta / 45
  engine.world.gravity.x = Math.max(-1, Math.min(1, gx))
  engine.world.gravity.y = Math.max(-1, Math.min(1, gy))
}

function spawnMorePills() {
  if (!engine || !physicsContainerRef.value) return
  const width = physicsContainerRef.value.clientWidth

  const newPillSamples = [
    { text: 'Foto Instantánea', emoji: '📸', bg: '#EFEEFF', border: '#D7D5FF', textColor: '#5540D8', width: 170 },
    { text: 'IA Face Search', emoji: '⚡', bg: '#F6FFE5', border: '#E5FFB7', textColor: '#496F15', width: 160 },
    { text: 'Descarga 4K', emoji: '💎', bg: '#FFFEEE', border: '#FFF9BF', textColor: '#806100', width: 150 },
    { text: 'Wompi Pay', emoji: '🛡️', bg: '#EBF9F3', border: '#A6EAD0', textColor: '#066B40', width: 140 }
  ]

  const newBodies = newPillSamples.map((data, i) => {
    const pillW = data.width
    const pillH = 46
    const posX = Math.random() * (width - pillW - 40) + pillW / 2 + 20
    const posY = -40 - i * 60

    const body = Matter.Bodies.rectangle(posX, posY, pillW, pillH, {
      chamfer: { radius: 23 },
      restitution: 0.75,
      friction: 0.1,
      angle: (Math.random() - 0.5) * 0.5,
      render: { visible: false }
    })
    body.customData = { ...data, w: pillW, h: pillH }
    return body
  })

  Matter.World.add(engine.world, newBodies)
}

function shakePhysics() {
  if (!engine) return
  const allBodies = Matter.Composite.allBodies(engine.world)
  for (const body of allBodies) {
    if (body.isStatic) continue
    const forceX = (Math.random() - 0.5) * 0.08
    const forceY = -Math.random() * 0.12 - 0.05
    Matter.Body.applyForce(body, body.position, { x: forceX, y: forceY })
  }
}

function resetPhysics() {
  if (!engine || !physicsContainerRef.value) return
  const width = physicsContainerRef.value.clientWidth
  const allBodies = Matter.Composite.allBodies(engine.world)

  allBodies.forEach((body, i) => {
    if (body.isStatic || !body.customData) return
    Matter.Body.setPosition(body, {
      x: Math.random() * (width - 160) + 80,
      y: -50 - (i % 8) * 60
    })
    Matter.Body.setVelocity(body, { x: 0, y: 0 })
    Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.1)
  })
}

function scrollToTop() {
  if (typeof window !== 'undefined') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', handleMouseMove)
    // Small timeout to ensure DOM layout is complete before canvas measurement
    setTimeout(() => {
      initPhysics()
    }, 150)
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('deviceorientation', handleGyro)
  }
  if (engine) {
    Matter.World.clear(engine.world)
    Matter.Engine.clear(engine)
  }
  if (render) {
    Matter.Render.stop(render)
    if (render.canvas) render.canvas.remove()
  }
})
</script>

<style scoped>
/* Continuous Infinite Marquee */
.marquee-track {
  display: flex;
  width: max-content;
  animation: marquee 28s linear infinite;
}

.marquee-track:hover {
  animation-play-state: paused;
}

@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-50%);
  }
}

/* Animated Highlighter Marker Stroke */
.marker-path {
  stroke-dasharray: 240;
  stroke-dashoffset: 240;
  animation: drawMarker 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.4s;
}

@keyframes drawMarker {
  to {
    stroke-dashoffset: 0;
  }
}

/* Flash Screen Animation */
@keyframes flashFade {
  0% {
    opacity: 0.9;
  }
  100% {
    opacity: 0;
  }
}

.animate-flash-fade {
  animation: flashFade 0.25s ease-out forwards;
}

/* Smooth Canvas Grab Cursor */
canvas {
  touch-action: none;
}
</style>
