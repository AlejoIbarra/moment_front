<template>
  <div class="min-h-screen bg-[#0a0a0f] text-white">

    <!-- Animated Background -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute -top-60 -right-60 w-[700px] h-[700px] bg-[#3ef4a1]/6 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-60 -left-60 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-[#3ef4a1]/3 rounded-full blur-3xl"></div>
    </div>

    <!-- Header -->
    <header class="relative z-10 border-b border-white/5 bg-black/30 backdrop-blur-xl">
      <div class="max-w-6xl mx-auto px-6 py-5 flex justify-between items-center">
        <NuxtLink to="/" class="text-2xl font-black tracking-tighter italic text-[#3ef4a1]">
          Moments
        </NuxtLink>
        <div class="flex items-center gap-3">
          <NuxtLink to="/login" class="text-sm font-semibold text-gray-400 hover:text-white transition-colors px-4 py-2 rounded-lg border border-white/10 hover:border-white/20">
            Iniciar Sesión
          </NuxtLink>
          <NuxtLink to="/register" class="text-sm font-bold text-black bg-[#3ef4a1] hover:bg-[#2dd68a] transition-colors px-4 py-2 rounded-lg">
            Registrarme
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Step 1: Landing de solicitud con todas las ventajas y formulario directo abajo -->
    <div v-if="step === 'landing'" class="relative z-10">

      <!-- Hero Section -->
      <div class="max-w-6xl mx-auto px-6 pt-16 pb-12 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#3ef4a1]/10 border border-[#3ef4a1]/20 text-[#3ef4a1] text-xs font-bold uppercase tracking-widest mb-8">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Portal Oficial de Fotógrafos Profesionales
        </div>

        <h1 class="text-4xl sm:text-6xl md:text-7xl font-black text-white mb-6 leading-tight">
          Monetiza tu<br />
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#3ef4a1] via-[#2dd68a] to-emerald-400">talento fotográfico</span>
        </h1>

        <p class="text-gray-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
          Sube tus fotos de eventos deportivos, bodas, fiestas y conciertos. Tus clientes encuentran y compran sus fotos en segundos gracias a nuestra tecnología de IA.
        </p>

        <!-- Value Badges -->
        <div class="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 max-w-3xl mx-auto mb-10">
          <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300">
            <span class="w-2 h-2 rounded-full bg-[#3ef4a1]"></span>
            Cobros en COP directo a tu cuenta
          </span>
          <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300">
            <span class="w-2 h-2 rounded-full bg-[#3ef4a1]"></span>
            Marca de agua inteligente anticopia
          </span>
          <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300">
            <span class="w-2 h-2 rounded-full bg-[#3ef4a1]"></span>
            Búsqueda facial y dorsales con IA
          </span>
          <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-gray-300">
            <span class="w-2 h-2 rounded-full bg-[#3ef4a1]"></span>
            100% Derechos de autor protegidos
          </span>
        </div>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <button 
            @click="scrollToForm"
            class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#3ef4a1] text-black font-extrabold text-base transition-all duration-300 hover:shadow-xl hover:shadow-[#3ef4a1]/30 hover:scale-[1.03] active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#3ef4a1]/15"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
            </svg>
            Quiero postularme ahora
          </button>
          <button
            @click="step = 'register'"
            class="w-full sm:w-auto px-8 py-4 rounded-2xl border border-white/15 bg-white/[0.02] text-white font-bold text-base transition-all duration-300 hover:border-[#3ef4a1]/50 hover:text-[#3ef4a1] hover:bg-white/[0.05] flex items-center justify-center gap-2 cursor-pointer"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
            </svg>
            Ya tengo código de acceso
          </button>
        </div>

        <!-- Advantages Section Header -->
        <div class="max-w-3xl mx-auto mb-10 text-center">
          <h2 class="text-3xl sm:text-4xl font-black text-white mb-3">
            Todas las ventajas de ser <span class="text-[#3ef4a1]">Fotógrafo Moments</span>
          </h2>
          <p class="text-gray-400 text-sm sm:text-base">
            Diseñamos cada herramienta para que tú solo te preocupes por disparar la cámara. Nosotros nos encargamos de la venta, la búsqueda y el cobro.
          </p>
        </div>

        <!-- 6 Benefits Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
          
          <!-- Benefit 1 -->
          <div class="p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-sm text-left hover:bg-white/[0.06] hover:border-[#3ef4a1]/30 transition-all duration-300 group">
            <div class="w-12 h-12 rounded-xl bg-[#3ef4a1]/10 border border-[#3ef4a1]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-[#3ef4a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
            </div>
            <h3 class="text-white font-extrabold text-lg mb-2 flex items-center gap-2">
              Ganancias Directas en COP
              <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-[#3ef4a1]/15 text-[#3ef4a1]">100% Tuyo</span>
            </h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              Tú decides el precio de venta por foto individual o paquetes de evento. Recibe transferencias seguras directo a tu cuenta bancaria en Colombia.
            </p>
          </div>

          <!-- Benefit 2 -->
          <div class="p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-sm text-left hover:bg-white/[0.06] hover:border-[#3ef4a1]/30 transition-all duration-300 group">
            <div class="w-12 h-12 rounded-xl bg-[#3ef4a1]/10 border border-[#3ef4a1]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-[#3ef4a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
              </svg>
            </div>
            <h3 class="text-white font-extrabold text-lg mb-2">Marca de Agua Inteligente</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              Tus fotos originales están 100% protegidas en servidores seguros. Las vistas previas públicas llevan marca de agua dinámica para impedir capturas sin pagar.
            </p>
          </div>

          <!-- Benefit 3 -->
          <div class="p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-sm text-left hover:bg-white/[0.06] hover:border-[#3ef4a1]/30 transition-all duration-300 group">
            <div class="w-12 h-12 rounded-xl bg-[#3ef4a1]/10 border border-[#3ef4a1]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-[#3ef4a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
              </svg>
            </div>
            <h3 class="text-white font-extrabold text-lg mb-2 flex items-center gap-2">
              Búsqueda con IA
              <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Fast Find</span>
            </h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              Los asistentes suben una selfie o ingresan su número de dorsal y encuentran todas sus fotos al instante. Sin revisar miles de fotos manualmente.
            </p>
          </div>

          <!-- Benefit 4 -->
          <div class="p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-sm text-left hover:bg-white/[0.06] hover:border-[#3ef4a1]/30 transition-all duration-300 group">
            <div class="w-12 h-12 rounded-xl bg-[#3ef4a1]/10 border border-[#3ef4a1]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-[#3ef4a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V4a2 2 0 10-2 2h2zm0 13l-4-4m4 4l4-4m-4 4V8"/>
              </svg>
            </div>
            <h3 class="text-white font-extrabold text-lg mb-2">Tarjetas de Regalo y Lotes</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              Emite tarjetas de regalo canjeables de 5 a 20 fotos para patrocinadores, marcas o invitados especiales. Vende más fotos por adelantado.
            </p>
          </div>

          <!-- Benefit 5 -->
          <div class="p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-sm text-left hover:bg-white/[0.06] hover:border-[#3ef4a1]/30 transition-all duration-300 group">
            <div class="w-12 h-12 rounded-xl bg-[#3ef4a1]/10 border border-[#3ef4a1]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-[#3ef4a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <h3 class="text-white font-extrabold text-lg mb-2">Studio Pro & Analíticas</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              Visualiza en tiempo real cuántas personas visitan tus eventos, fotos con más me gusta, tasa de conversión e ingresos acumulados en un panel premium.
            </p>
          </div>

          <!-- Benefit 6 -->
          <div class="p-6 rounded-2xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] backdrop-blur-sm text-left hover:bg-white/[0.06] hover:border-[#3ef4a1]/30 transition-all duration-300 group">
            <div class="w-12 h-12 rounded-xl bg-[#3ef4a1]/10 border border-[#3ef4a1]/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <svg class="w-6 h-6 text-[#3ef4a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <h3 class="text-white font-extrabold text-lg mb-2">100% Tus Derechos de Autor</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              Conservas siempre los derechos morales y patrimoniales de cada toma. Moments actúa como tu intermediario tecnológico y pasarela de cobro.
            </p>
          </div>

        </div>

        <!-- 3-Step Process -->
        <div class="max-w-4xl mx-auto mb-20 p-8 rounded-3xl border border-white/10 bg-white/[0.02]">
          <h3 class="text-2xl font-black text-white mb-8 text-center">¿Cómo unirte a Moments en 3 pasos?</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div class="flex flex-col gap-2">
              <div class="w-10 h-10 rounded-full bg-[#3ef4a1]/15 text-[#3ef4a1] font-black flex items-center justify-center text-base border border-[#3ef4a1]/30">
                1
              </div>
              <h4 class="font-bold text-white text-base">Completa el formulario</h4>
              <p class="text-gray-400 text-xs leading-relaxed">Llena tus datos de contacto y cuéntanos sobre tu estilo fotográfico en el formulario aquí abajo.</p>
            </div>
            <div class="flex flex-col gap-2">
              <div class="w-10 h-10 rounded-full bg-[#3ef4a1]/15 text-[#3ef4a1] font-black flex items-center justify-center text-base border border-[#3ef4a1]/30">
                2
              </div>
              <h4 class="font-bold text-white text-base">Recepción de código</h4>
              <p class="text-gray-400 text-xs leading-relaxed">Validamos tu portafolio y te enviamos tu código exclusivo de fotógrafo a tu correo en menos de 24h.</p>
            </div>
            <div class="flex flex-col gap-2">
              <div class="w-10 h-10 rounded-full bg-[#3ef4a1]/15 text-[#3ef4a1] font-black flex items-center justify-center text-base border border-[#3ef4a1]/30">
                3
              </div>
              <h4 class="font-bold text-white text-base">Publica y monetiza</h4>
              <p class="text-gray-400 text-xs leading-relaxed">Activa tu perfil con tu código, crea tus galerías protegidas y empieza a recibir ventas en tu cuenta.</p>
            </div>
          </div>
        </div>

      </div>

      <!-- DIRECT APPLICATION FORM EMBEDDED BELOW -->
      <div id="solicitud-form" class="relative z-10 max-w-3xl mx-auto px-6 pt-4 pb-20 scroll-mt-24">
        
        <div class="text-center mb-8">
          <div class="w-16 h-16 rounded-2xl bg-[#3ef4a1]/10 border border-[#3ef4a1]/20 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#3ef4a1]/10">
            <svg class="w-8 h-8 text-[#3ef4a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
            </svg>
          </div>
          <h2 class="text-3xl sm:text-4xl font-black text-white mb-3">Formulario de Solicitud</h2>
          <p class="text-gray-400 leading-relaxed text-sm sm:text-base max-w-lg mx-auto">
            Déjanos tus datos a continuación. Nuestro equipo revisará tu perfil y te contactará con tu código de acceso exclusivo.
          </p>
        </div>

        <div class="p-6 sm:p-10 rounded-3xl border border-white/10 bg-[#0c0c14]/90 backdrop-blur-xl shadow-2xl ring-1 ring-white/5">
          <form @submit.prevent="sendRequest" class="space-y-5">
            
            <!-- Nombre y Apellido -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Nombre *</label>
                <input 
                  v-model="requestForm.firstName"
                  type="text" 
                  placeholder="Tu nombre"
                  required
                  class="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3ef4a1]/60 focus:bg-white/[0.08] transition-all"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Apellido *</label>
                <input 
                  v-model="requestForm.lastName"
                  type="text" 
                  placeholder="Tu apellido"
                  required
                  class="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3ef4a1]/60 focus:bg-white/[0.08] transition-all"
                />
              </div>
            </div>

            <!-- Email y Ciudad -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Correo electrónico *</label>
                <input 
                  v-model="requestForm.email"
                  type="email" 
                  placeholder="tu@correo.com"
                  required
                  class="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3ef4a1]/60 focus:bg-white/[0.08] transition-all"
                />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Ciudad / Región *</label>
                <input 
                  v-model="requestForm.city"
                  type="text" 
                  placeholder="Ej: Bogotá, Medellín, Cali..."
                  required
                  class="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3ef4a1]/60 focus:bg-white/[0.08] transition-all"
                />
              </div>
            </div>

            <!-- Teléfono / WhatsApp -->
            <div>
              <label class="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Teléfono / WhatsApp *</label>
              <div class="flex gap-2.5">
                <select 
                  v-model="requestForm.countryCode"
                  class="w-28 bg-[#151520] border border-white/10 rounded-xl px-3 py-3.5 text-sm text-white focus:outline-none focus:border-[#3ef4a1]/60 text-center cursor-pointer"
                >
                  <option value="+57" class="bg-gray-900">🇨🇴 +57</option>
                  <option value="+52" class="bg-gray-900">🇲🇽 +52</option>
                  <option value="+1" class="bg-gray-900">🇺🇸 +1</option>
                  <option value="+34" class="bg-gray-900">🇪🇸 +34</option>
                  <option value="+54" class="bg-gray-900">🇦🇷 +54</option>
                  <option value="+56" class="bg-gray-900">🇨🇱 +56</option>
                  <option value="+51" class="bg-gray-900">🇵🇪 +51</option>
                </select>
                <input 
                  v-model="requestForm.phone"
                  type="tel" 
                  placeholder="300 000 0000"
                  required
                  class="flex-1 bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3ef4a1]/60 focus:bg-white/[0.08] transition-all"
                />
              </div>
            </div>

            <!-- Especialidad -->
            <div>
              <label class="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Tipo de fotografía que realizas *</label>
              <select 
                v-model="requestForm.photoType"
                required
                class="w-full bg-[#151520] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white focus:outline-none focus:border-[#3ef4a1]/60 transition-all cursor-pointer"
              >
                <option value="" class="bg-gray-900 text-gray-400">Selecciona una especialidad</option>
                <option value="deportes" class="bg-gray-900">⚽ Deportes, Carreras y Maratones</option>
                <option value="eventos" class="bg-gray-900">📸 Fiestas, Vida Nocturna y Eventos Sociales</option>
                <option value="bodas" class="bg-gray-900">💍 Bodas, Grados y Quinceañeras</option>
                <option value="conciertos" class="bg-gray-900">🎵 Festivales, Conciertos y Espectáculos</option>
                <option value="corporativo" class="bg-gray-900">🏢 Eventos Corporativos y Conferencias</option>
                <option value="otro" class="bg-gray-900">✨ Fotografía de Estudio y Otro</option>
              </select>
            </div>

            <!-- Portafolio / Redes -->
            <div>
              <label class="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Portafolio, Instagram o Web (Opcional)</label>
              <input 
                v-model="requestForm.portfolio"
                type="text" 
                placeholder="https://instagram.com/tu_usuario o tu web"
                class="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3ef4a1]/60 focus:bg-white/[0.08] transition-all"
              />
            </div>

            <!-- Experiencia / Mensaje -->
            <div>
              <label class="block text-xs font-bold text-gray-300 mb-2 uppercase tracking-wider">Cuéntanos sobre tu experiencia (Opcional)</label>
              <textarea 
                v-model="requestForm.message"
                placeholder="¿Cuánto tiempo llevas en la fotografía? ¿Qué tipo de eventos cubres con mayor frecuencia? ¿Qué equipo fotográfico utilizas?"
                rows="3"
                class="w-full bg-white/[0.05] border border-white/10 rounded-xl px-4 py-3.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#3ef4a1]/60 focus:bg-white/[0.08] transition-all resize-none"
              ></textarea>
            </div>

            <!-- Legal Acceptance -->
            <div class="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <input 
                v-model="requestForm.acceptedTerms"
                type="checkbox" 
                id="accept-terms-photographer"
                required
                class="mt-0.5 w-4 h-4 rounded border-white/20 accent-[#3ef4a1] cursor-pointer flex-shrink-0"
              />
              <label for="accept-terms-photographer" class="text-gray-400 text-xs leading-relaxed cursor-pointer">
                He leído y acepto los 
                <NuxtLink to="/terms-photographer" target="_blank" class="text-[#3ef4a1] font-semibold hover:underline">Términos y Condiciones para Fotógrafos</NuxtLink>, 
                la <NuxtLink to="/privacy" target="_blank" class="text-[#3ef4a1] font-semibold hover:underline">Política de Privacidad</NuxtLink> y confirmo que 
                <strong class="text-white">soy el titular de los derechos de autor</strong> de las fotografías que publique.
              </label>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit"
              :disabled="requestLoading || !requestForm.acceptedTerms"
              :class="[
                'w-full py-4 rounded-xl font-black text-base transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg',
                requestForm.acceptedTerms && !requestLoading
                  ? 'bg-[#3ef4a1] text-black hover:bg-[#2dd68a] hover:shadow-[#3ef4a1]/30 hover:scale-[1.01] active:scale-95'
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              ]"
            >
              <svg v-if="!requestLoading" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
              </svg>
              <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              {{ requestLoading ? 'Enviando postulación...' : 'Enviar Solicitud de Fotógrafo' }}
            </button>

            <p class="text-center text-gray-500 text-xs">
              ¿Dudas o requerimientos especiales? Escríbenos a 
              <a href="mailto:fotografos@moments.com.co" class="text-[#3ef4a1] hover:underline">fotografos@moments.com.co</a>
            </p>
          </form>
        </div>

      </div>

      <!-- Legal Notice Footer -->
      <div class="max-w-4xl mx-auto px-6 pb-20">
        <div class="p-6 rounded-2xl border border-amber-500/20 bg-amber-500/5 backdrop-blur-sm flex gap-4">
          <div class="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
            <svg class="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div>
            <p class="text-amber-400 font-bold mb-1">⚖️ Aviso Legal para Fotógrafos</p>
            <p class="text-gray-400 text-sm leading-relaxed">
              Al registrarte como fotógrafo en Moments declaras que eres el titular de los derechos de autor de las fotografías que publiques y que cuentas con el consentimiento de las personas retratadas, conforme a la <strong class="text-gray-200">Ley 23 de 1982</strong> y la <strong class="text-gray-200">Ley 1581 de 2012</strong>. Moments actúa únicamente como plataforma intermediaria y <strong class="text-white">NO asume ninguna responsabilidad</strong> por el contenido publicado. Antes de continuar, lee nuestros
              <NuxtLink to="/terms-photographer" class="text-[#3ef4a1] underline hover:text-[#2dd68a]">Términos para Fotógrafos</NuxtLink> y la
              <NuxtLink to="/privacy" class="text-[#3ef4a1] underline hover:text-[#2dd68a]">Política de Privacidad</NuxtLink>.
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Step 2b: Confirmación de solicitud enviada -->
    <div v-if="step === 'sent'" class="relative z-10 max-w-lg mx-auto px-6 pt-24 pb-24 text-center">
      <div class="w-20 h-20 rounded-2xl bg-[#3ef4a1]/15 border border-[#3ef4a1]/30 flex items-center justify-center mx-auto mb-6">
        <svg class="w-10 h-10 text-[#3ef4a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <h2 class="text-3xl font-black text-white mb-4">¡Solicitud enviada!</h2>
      <p class="text-gray-400 leading-relaxed mb-6">
        Hemos recibido tu solicitud. Revisaremos tu información y te enviaremos un correo a <strong class="text-white">{{ requestForm.email }}</strong> con tu código de acceso y los pasos para completar tu registro en un plazo de <strong class="text-white">24 a 48 horas hábiles</strong>.
      </p>
      <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5 mb-8 text-left">
        <p class="text-gray-300 text-sm font-bold mb-2">¿Qué sigue?</p>
        <ol class="text-gray-400 text-sm space-y-2">
          <li class="flex items-start gap-2"><span class="text-[#3ef4a1] font-bold flex-shrink-0">1.</span> Nuestro equipo revisa tu solicitud.</li>
          <li class="flex items-start gap-2"><span class="text-[#3ef4a1] font-bold flex-shrink-0">2.</span> Recibes un correo con tu código de acceso único.</li>
          <li class="flex items-start gap-2"><span class="text-[#3ef4a1] font-bold flex-shrink-0">3.</span> Regresas aquí y haces clic en "Ya tengo código de acceso".</li>
          <li class="flex items-start gap-2"><span class="text-[#3ef4a1] font-bold flex-shrink-0">4.</span> Completas tu registro y empiezas a vender tus fotos. 📸</li>
        </ol>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 justify-center">
        <button @click="step = 'register'" class="px-6 py-3 rounded-xl bg-[#3ef4a1] text-black font-bold text-sm hover:shadow-lg hover:shadow-[#3ef4a1]/25 transition-all">
          Ya tengo mi código → Registrarme
        </button>
        <NuxtLink to="/" class="px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white font-semibold text-sm transition-all text-center">
          Volver al inicio
        </NuxtLink>
      </div>
    </div>

    <!-- Step 3: Formulario de Registro de Fotógrafo -->
    <div v-if="step === 'register'" class="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-16">
      <div class="w-full max-w-[380px]">
        
        <!-- Back -->
        <button @click="step = 'landing'" class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 text-sm font-semibold">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
          </svg>
          Volver
        </button>

        <!-- Card -->
        <div class="bg-white/[0.03] border border-white/8 rounded-2xl p-8 backdrop-blur-sm">
          
          <!-- Header -->
          <div class="text-center mb-6">
            <div class="w-14 h-14 rounded-xl bg-[#3ef4a1]/10 border border-[#3ef4a1]/20 flex items-center justify-center mx-auto mb-3">
              <svg class="w-7 h-7 text-[#3ef4a1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            </div>
            <h2 class="text-xl font-black text-white">Registro de Fotógrafo</h2>
            <p class="text-gray-400 text-xs mt-1">Crea tu cuenta profesional en Moments</p>
          </div>

          <!-- OAuth Buttons -->
          <div class="flex flex-col gap-2 mb-5">
            <button type="button" @click="handleGoogleClick" class="w-full bg-white/8 border border-white/10 hover:bg-white/12 text-white rounded-xl h-10 flex items-center justify-center text-sm font-bold transition-all gap-2">
              <Icon name="logos:google-icon" class="w-4 h-4" />
              Continuar con Google
            </button>
          </div>

          <div class="flex items-center gap-3 mb-5">
            <div class="flex-1 h-[1px] bg-white/8"></div>
            <span class="text-[11px] font-bold text-gray-500 uppercase">o con email</span>
            <div class="flex-1 h-[1px] bg-white/8"></div>
          </div>

          <!-- Register Form -->
          <form v-if="!showPhotographerOAuth" @submit.prevent="handlePhotographerRegister" class="space-y-3">
            <div class="grid grid-cols-2 gap-3">
              <input 
                v-model="photographerForm.firstName"
                type="text" placeholder="Nombre"
                required
                class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#3ef4a1]/50 transition-all"
              />
              <input 
                v-model="photographerForm.lastName"
                type="text" placeholder="Apellido"
                required
                class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#3ef4a1]/50 transition-all"
              />
            </div>

            <input 
              v-model="photographerForm.email"
              type="email" placeholder="Correo electrónico"
              required
              class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#3ef4a1]/50 transition-all"
            />

            <input 
              v-model="photographerForm.username"
              type="text" placeholder="Nombre de usuario"
              required
              class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#3ef4a1]/50 transition-all"
            />

            <div class="flex gap-2">
              <select 
                v-model="photographerCountryCode"
                class="w-24 bg-white/5 border border-white/10 rounded-xl px-2 py-2.5 text-xs text-white focus:outline-none focus:border-[#3ef4a1]/50 appearance-none text-center cursor-pointer"
              >
                <option value="+57" class="bg-gray-900">🇨🇴 +57</option>
                <option value="+52" class="bg-gray-900">🇲🇽 +52</option>
                <option value="+1" class="bg-gray-900">🇺🇸 +1</option>
                <option value="+34" class="bg-gray-900">🇪🇸 +34</option>
              </select>
              <input 
                v-model="photographerPhone"
                type="tel" placeholder="Teléfono"
                required
                class="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#3ef4a1]/50 transition-all"
              />
            </div>

            <input 
              v-model="photographerForm.password"
              type="password" placeholder="Contraseña"
              required
              class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#3ef4a1]/50 transition-all"
            />

            <input 
              v-model="photographerConfirmPassword"
              type="password" placeholder="Confirmar contraseña"
              required
              class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#3ef4a1]/50 transition-all"
            />

            <p class="text-[10px] text-gray-500 text-center leading-relaxed">
              Al registrarte aceptas los <NuxtLink to="/terms-photographer" target="_blank" class="text-[#3ef4a1] hover:underline">Términos del Fotógrafo</NuxtLink> y la <NuxtLink to="/privacy" target="_blank" class="text-[#3ef4a1] hover:underline">Política de Privacidad</NuxtLink>. Eres el único responsable del contenido que publiques.
            </p>

            <button 
              type="submit"
              :disabled="registerLoading"
              class="w-full py-3 rounded-xl bg-[#3ef4a1] text-black font-bold text-sm hover:shadow-lg hover:shadow-[#3ef4a1]/25 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg v-if="registerLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              {{ registerLoading ? 'Registrando...' : 'Crear Cuenta de Fotógrafo' }}
            </button>
          </form>

          <!-- OAuth Complete for Photographer -->
          <form v-if="showPhotographerOAuth" @submit.prevent="submitPhotographerOAuth" class="space-y-3">
            <div class="text-center mb-3">
              <p class="text-sm text-white font-bold">Completa tu perfil de fotógrafo</p>
              <p class="text-[11px] text-gray-400 mt-1">Hola {{ photographerOAuthData.firstName }}, configura tu nombre de usuario y teléfono.</p>
            </div>
            <input 
              v-model="photographerOAuthForm.username"
              type="text" placeholder="Nombre de usuario"
              required
              class="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#3ef4a1]/50 transition-all"
            />
            <div class="flex gap-2">
              <select v-model="photographerOAuthForm.countryCode" class="w-24 bg-white/5 border border-white/10 rounded-xl px-2 py-2.5 text-xs text-white focus:outline-none focus:border-[#3ef4a1]/50 appearance-none text-center cursor-pointer">
                <option value="+57" class="bg-gray-900">🇨🇴 +57</option>
                <option value="+52" class="bg-gray-900">🇲🇽 +52</option>
                <option value="+1" class="bg-gray-900">🇺🇸 +1</option>
              </select>
              <input v-model="photographerOAuthForm.phone" type="tel" placeholder="Teléfono" required class="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#3ef4a1]/50 transition-all" />
            </div>
            <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <p class="text-amber-300 text-[10px] text-center leading-relaxed">
                Al confirmar, aceptas los <NuxtLink to="/terms-photographer" target="_blank" class="underline font-bold">Términos del Fotógrafo</NuxtLink> y reconoces ser el único responsable del contenido publicado.
              </p>
            </div>
            <button type="submit" :disabled="registerLoading" class="w-full py-3 rounded-xl bg-[#3ef4a1] text-black font-bold text-sm hover:shadow-lg transition-all disabled:opacity-60">
              {{ registerLoading ? 'Creando cuenta...' : 'Crear Cuenta de Fotógrafo' }}
            </button>
            <button type="button" @click="showPhotographerOAuth = false" class="text-[11px] text-gray-500 hover:text-gray-300 w-full text-center transition-colors">Cancelar</button>
          </form>

          <!-- Login Link -->
          <p class="text-center text-xs text-gray-500 mt-5">
            ¿Ya tienes cuenta? <NuxtLink to="/photographer-access" class="text-[#3ef4a1] font-bold hover:underline">Inicia sesión aquí</NuxtLink>
          </p>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { googleTokenLogin } from 'vue3-google-login'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ layout: false })

useSeoMeta({
  title: 'Portal de Fotógrafos — Moments',
  description: 'Únete como fotógrafo profesional en Moments. Vende tus fotografías de eventos y conecta con miles de clientes. Solicita tu acceso hoy.'
})

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()
const swal = useSwal()
const config = useRuntimeConfig()

// Step control: 'landing' | 'sent' | 'register'
const step = ref('landing')

const scrollToForm = () => {
  if (step.value !== 'landing') {
    step.value = 'landing'
  }
  nextTick(() => {
    const el = document.getElementById('solicitud-form')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  })
}

// ──────── Request Form ────────
const requestLoading = ref(false)
const requestForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  city: '',
  countryCode: '+57',
  phone: '',
  photoType: '',
  portfolio: '',
  message: '',
  acceptedTerms: false
})

const sendRequest = async () => {
  if (!requestForm.acceptedTerms) {
    toast.error('Términos requeridos', 'Debes aceptar los Términos y Condiciones para continuar.')
    return
  }

  requestLoading.value = true
  try {
    const fullName = `${requestForm.firstName.trim()} ${requestForm.lastName.trim()}`.trim()
    const fullPhone = `${requestForm.countryCode} ${requestForm.phone.trim()}`.trim()

    const payload = {
      name: fullName,
      email: requestForm.email.trim(),
      phone: fullPhone,
      city: requestForm.city?.trim() || '',
      photoType: requestForm.photoType,
      portfolio: requestForm.portfolio?.trim() || '',
      message: requestForm.message?.trim() || ''
    }

    const { $api } = useNuxtApp()
    if ($api) {
      await $api('/contact/photographer', {
        method: 'POST',
        body: payload
      })
    } else {
      await $fetch(`${config.public.apiBase}/contact/photographer`, {
        method: 'POST',
        body: payload
      })
    }

    toast.success('¡Solicitud enviada!', 'Hemos recibido tu postulación. Te contactaremos en breve.')
    step.value = 'sent'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (err) {
    console.error('Error sending photographer application:', err)
    // Fallback: in case backend network fails, open mailto fallback
    try {
      const subject = encodeURIComponent(`Solicitud de Fotógrafo Moments — ${requestForm.firstName} ${requestForm.lastName}`)
      const body = encodeURIComponent(
        `Nombre: ${requestForm.firstName} ${requestForm.lastName}\n` +
        `Email: ${requestForm.email}\n` +
        `Ciudad: ${requestForm.city}\n` +
        `Teléfono: ${requestForm.countryCode}${requestForm.phone}\n` +
        `Especialidad: ${requestForm.photoType}\n` +
        `Portafolio: ${requestForm.portfolio || 'No indicado'}\n\n` +
        `Mensaje:\n${requestForm.message || 'No indicado'}`
      )
      window.location.href = `mailto:fotografos@moments.com.co?subject=${subject}&body=${body}`
      step.value = 'sent'
    } catch (e) {
      toast.error('Error al enviar', 'No pudimos procesar tu solicitud. Escríbenos a fotografos@moments.com.co')
    }
  } finally {
    requestLoading.value = false
  }
}

// ──────── Photographer Register Form ────────
const registerLoading = ref(false)
const photographerCountryCode = ref('+57')
const photographerPhone = ref('')
const photographerConfirmPassword = ref('')
const photographerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  role: 'PHOTOGRAPHER',
  phone: ''
})

const handlePhotographerRegister = async () => {
  if (photographerForm.password !== photographerConfirmPassword.value) {
    toast.error('Contraseñas no coinciden', 'Las contraseñas ingresadas no coinciden.')
    return
  }
  photographerForm.phone = `${photographerCountryCode.value}${photographerPhone.value.trim()}`
  registerLoading.value = true
  try {
    const result = await authStore.register({ ...photographerForm })
    if (result.success) {
      toast.success('¡Cuenta creada!', 'Tu cuenta como fotógrafo ha sido creada. Inicia sesión para continuar.')
      router.push('/login')
    } else {
      toast.error('Error en el registro', result.error || 'El usuario o correo ya están en uso.')
    }
  } catch (err) {
    toast.error('Error inesperado', 'Por favor intenta de nuevo más tarde.')
  } finally {
    registerLoading.value = false
  }
}

// ──────── Photographer OAuth ────────
const showPhotographerOAuth = ref(false)
const photographerOAuthData = reactive({
  token: '',
  provider: '',
  firstName: ''
})
const photographerOAuthForm = reactive({
  username: '',
  countryCode: '+57',
  phone: ''
})

const handleGoogleClick = () => {
  registerLoading.value = true
  googleTokenLogin().then((response) => {
    handleGoogleRegister(response)
  }).catch((err) => {
    console.error('Google register error:', err)
    registerLoading.value = false
  })
}

const handleGoogleRegister = async (response) => {
  registerLoading.value = true
  try {
    const token = response?.credential || response?.access_token || response?.code
    if (token) {
      const res = await authStore.googleLogin(token)
      if (res?.requiresRegistration) {
        photographerOAuthData.token = token
        photographerOAuthData.provider = 'google'
        photographerOAuthData.firstName = res.firstName || 'Fotógrafo'
        showPhotographerOAuth.value = true
      } else {
        toast.success('¡Bienvenido!', 'Has iniciado sesión con Google.')
        router.push(authStore.isPhotographer ? '/dashboard/photographer' : '/marketplace')
      }
    } else {
      console.warn('Google response received without token:', response)
    }
  } catch (err) {
    const errorMsg = err.response?._data?.message || err.data?.message || 'Error al iniciar sesión con Google.'
    toast.error('Error', errorMsg)
  } finally {
    registerLoading.value = false
  }
}

const submitPhotographerOAuth = async () => {
  registerLoading.value = true
  try {
    const payload = {
      token: photographerOAuthData.token,
      provider: photographerOAuthData.provider,
      username: photographerOAuthForm.username,
      phone: `${photographerOAuthForm.countryCode}${photographerOAuthForm.phone}`,
      role: 'PHOTOGRAPHER'
    }
    await authStore.completeOAuthRegistration(payload)
    toast.success('¡Cuenta creada!', 'Tu cuenta como fotógrafo ha sido configurada.')
    router.push('/dashboard/photographer')
  } catch (err) {
    const errorMsg = err.response?._data?.message || 'Error al completar el registro.'
    toast.error('Error', errorMsg)
  } finally {
    registerLoading.value = false
  }
}
</script>
