<template>
  <div class="min-h-screen bg-[#0d0f15] text-gray-300 font-sans selection:bg-[#3ef4a1] selection:text-black pb-20">
    <!-- Header -->
    <header class="border-b border-white/10 bg-[#0d0f15]/80 backdrop-blur-xl sticky top-0 z-50">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <span class="text-2xl font-black tracking-tighter italic text-[#3ef4a1] group-hover:scale-105 transition-transform">Moments</span>
        </NuxtLink>
        <div class="flex items-center gap-4 text-xs font-bold">
          <NuxtLink to="/terms-user" class="text-gray-400 hover:text-white transition-colors">Términos</NuxtLink>
          <NuxtLink to="/privacy" class="text-gray-400 hover:text-white transition-colors">Privacidad</NuxtLink>
          <NuxtLink to="/refunds" class="text-gray-400 hover:text-white transition-colors">Reembolsos</NuxtLink>
          <NuxtLink to="/login" class="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all">Iniciar sesión</NuxtLink>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16 space-y-10">
      <div class="text-center">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[#3ef4a1] text-xs font-bold mb-4">
          <Icon name="lucide:cookie" class="w-4 h-4" />
          Transparencia y Protección de Datos
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          Política de Cookies
        </h1>
        <p class="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Explicamos detalladamente qué cookies y tecnologías de almacenamiento local utilizamos en Moments, cuál es su propósito y cómo puedes gestionarlas o revocarlas en cualquier momento.
        </p>
        <p class="text-xs text-gray-500 mt-2">Última actualización: 25 de Septiembre de 2026</p>
      </div>

      <!-- Content Sections -->
      <div class="space-y-8 text-sm">
        <!-- 1. Que son las cookies -->
        <section class="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
          <h2 class="text-xl font-black text-white flex items-center gap-3">
            <span class="w-7 h-7 rounded-lg bg-[#3ef4a1]/20 text-[#3ef4a1] flex items-center justify-center text-xs font-black">1</span>
            ¿Qué son las Cookies y Tecnologías Similares?
          </h2>
          <p class="text-gray-300 leading-relaxed">
            Las cookies son pequeños archivos de texto que los sitios web almacenan en su navegador o dispositivo al navegar. Junto a las cookies, utilizamos tecnologías modernas como <strong>LocalStorage</strong> y <strong>SessionStorage</strong> de HTML5 para recordar información técnica que permite mantener su sesión activa de forma segura y preservar sus preferencias de visualización y accesibilidad.
          </p>
        </section>

        <!-- 2. Clasificación detallada -->
        <section class="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5 space-y-6">
          <h2 class="text-xl font-black text-white flex items-center gap-3">
            <span class="w-7 h-7 rounded-lg bg-[#3ef4a1]/20 text-[#3ef4a1] flex items-center justify-center text-xs font-black">2</span>
            Categorías de Cookies que Empleamos
          </h2>

          <div class="grid md:grid-cols-2 gap-4">
            <!-- Técnicas y Esenciales -->
            <div class="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
              <div class="flex items-center gap-2 text-white font-bold">
                <span class="w-2 h-2 rounded-full bg-emerald-400"></span>
                A. Esenciales / Estrictamente Necesarias
              </div>
              <p class="text-xs text-gray-400 leading-relaxed">
                Son indispensables para el funcionamiento técnico de la plataforma. Permiten la autenticación mediante token JWT, la navegación entre rutas protegidas y la protección contra ataques de falsificación de peticiones.
              </p>
              <div class="text-[11px] text-gray-500 font-mono bg-black/30 p-2.5 rounded-lg">
                Ejemplos: <code>auth_token</code>, <code>moments_session</code>, <code>cookie_consent</code>
              </div>
            </div>

            <!-- Preferencias y Accesibilidad -->
            <div class="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
              <div class="flex items-center gap-2 text-white font-bold">
                <span class="w-2 h-2 rounded-full bg-blue-400"></span>
                B. Preferencias y Accesibilidad
              </div>
              <p class="text-xs text-gray-400 leading-relaxed">
                Guardan sus selecciones personalizadas, como el modo de alto contraste, tamaño de tipografía adaptada, filtros preferidos de búsqueda y configuraciones de visualización en la galería.
              </p>
              <div class="text-[11px] text-gray-500 font-mono bg-black/30 p-2.5 rounded-lg">
                Ejemplos: <code>accessibility_prefs</code>, <code>gallery_view_mode</code>
              </div>
            </div>

            <!-- Pasarela de Pago Wompi -->
            <div class="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
              <div class="flex items-center gap-2 text-white font-bold">
                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                C. Procesamiento Seguro de Pagos (Wompi)
              </div>
              <p class="text-xs text-gray-400 leading-relaxed">
                Nuestro aliado de pagos Wompi (Bancolombia) instala identificadores técnicos para verificar la autenticidad de la transacción, prevenir fraude bancario y procesar pagos con tarjeta y PSE.
              </p>
              <div class="text-[11px] text-gray-500 font-mono bg-black/30 p-2.5 rounded-lg">
                Proveedor: Bancolombia / Wompi Colombia (Certificación PCI-DSS Nivel 1)
              </div>
            </div>

            <!-- Rendimiento y Analítica -->
            <div class="p-5 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
              <div class="flex items-center gap-2 text-white font-bold">
                <span class="w-2 h-2 rounded-full bg-purple-400"></span>
                D. Rendimiento y Métricas Anónimas
              </div>
              <p class="text-xs text-gray-400 leading-relaxed">
                Recopilan datos estadísticos agregados y totalmente anonimizados sobre errores del sistema, tiempos de carga de imágenes en Cloudflare R2 y volumen de visitas para optimizar el servicio.
              </p>
              <div class="text-[11px] text-gray-500 font-mono bg-black/30 p-2.5 rounded-lg">
                No recopilan información financiera ni nombres personales.
              </div>
            </div>
          </div>
        </section>

        <!-- 3. Base Legal y Consentimiento -->
        <section class="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
          <h2 class="text-xl font-black text-white flex items-center gap-3">
            <span class="w-7 h-7 rounded-lg bg-[#3ef4a1]/20 text-[#3ef4a1] flex items-center justify-center text-xs font-black">3</span>
            Base Legal del Consentimiento
          </h2>
          <p class="text-gray-300 leading-relaxed">
            De conformidad con la <strong>Ley Estatutaria 1581 de 2012</strong> y las directrices de la Superintendencia de Industria y Comercio (SIC), el uso de cookies no esenciales requiere su autorización previa, expresa e informada. Al registrarse en Moments o mediante nuestro panel flotante de cookies, usted ejerce libremente el control sobre qué categorías autoriza.
          </p>
        </section>

        <!-- 4. Cómo Desactivar o Eliminar Cookies -->
        <section class="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
          <h2 class="text-xl font-black text-white flex items-center gap-3">
            <span class="w-7 h-7 rounded-lg bg-[#3ef4a1]/20 text-[#3ef4a1] flex items-center justify-center text-xs font-black">4</span>
            ¿Cómo Controlar o Eliminar las Cookies?
          </h2>
          <p class="text-gray-300 leading-relaxed">
            Usted puede modificar la configuración de su navegador web para bloquear o eliminar cookies en cualquier momento:
          </p>
          <ul class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-gray-300 pt-2">
            <li class="p-3 bg-white/[0.03] rounded-xl border border-white/5 text-center">
              <strong class="text-white block mb-1">Google Chrome</strong>
              Configuración > Privacidad y seguridad > Cookies
            </li>
            <li class="p-3 bg-white/[0.03] rounded-xl border border-white/5 text-center">
              <strong class="text-white block mb-1">Mozilla Firefox</strong>
              Ajustes > Privacidad y seguridad > Cookies
            </li>
            <li class="p-3 bg-white/[0.03] rounded-xl border border-white/5 text-center">
              <strong class="text-white block mb-1">Apple Safari</strong>
              Preferencias > Privacidad > Bloquear cookies
            </li>
            <li class="p-3 bg-white/[0.03] rounded-xl border border-white/5 text-center">
              <strong class="text-white block mb-1">Microsoft Edge</strong>
              Configuración > Permisos del sitio > Cookies
            </li>
          </ul>
          <p class="text-xs text-amber-400/80 pt-2">
            * Nota: Bloquear las cookies técnicas esenciales impedirá el inicio de sesión y el proceso de compra segura en Moments.
          </p>
        </section>
      </div>

      <!-- Bottom Navigation -->
      <div class="mt-12 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
        <NuxtLink to="/" class="hover:text-white transition-colors flex items-center gap-1.5">
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          Volver al Inicio
        </NuxtLink>
        <div class="flex items-center gap-4">
          <NuxtLink to="/terms-user" class="hover:text-white transition-colors">Términos y Condiciones</NuxtLink>
          <NuxtLink to="/privacy" class="hover:text-white transition-colors">Política de Privacidad</NuxtLink>
          <NuxtLink to="/refunds" class="hover:text-white transition-colors">Política de Reembolsos</NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

useHead({
  title: 'Política de Cookies — Moments',
  meta: [
    { name: 'description', content: 'Política integral de cookies y almacenamiento de datos técnicos de la plataforma Moments conforme a la legislación colombiana.' }
  ]
})
</script>
