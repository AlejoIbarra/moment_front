<template>
  <div class="min-h-screen bg-[#0a0a0f] text-white pb-24">

    <!-- Animated Background -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#3ef4a1] rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#3ef4a1] rounded-full blur-3xl"></div>
    </div>

    <!-- Header -->
    <header class="relative z-10 border-b border-white/5 bg-black/30 backdrop-blur-xl">
      <div class="max-w-4xl mx-auto px-6 py-5 flex justify-between items-center">
        <NuxtLink to="/" class="text-2xl font-black tracking-tighter italic text-[#3ef4a1]">
          Moments
        </NuxtLink>
        <div class="flex items-center gap-4">
          <span class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            Para Usuarios
          </span>
          <NuxtLink to="/register" class="text-sm font-semibold text-gray-400 hover:text-white transition-colors">
            ← Volver al Registro
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <div class="relative z-10 max-w-4xl mx-auto px-6 pt-14">

      <!-- Hero -->
      <div class="text-center mb-14">
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-6">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          Términos para Usuarios
        </div>
        <h1 class="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
          Términos y Condiciones<br />
          <span class=" text-[#3ef4a1]">para Usuarios</span>
        </h1>
        <p class="text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Bienvenido a Moments. Antes de crear tu cuenta, te explicamos claramente tus derechos, cómo funciona la plataforma y cómo protegemos tu información personal.
        </p>
        <p class="text-gray-500 text-sm mt-3">Última actualización: 4 de agosto de 2026 · Ley aplicable: Derecho Colombiano</p>
      </div>

      <!-- Info Box -->
      <div class="mb-10 p-6 rounded-2xl border border-indigo-500/20 bg-indigo-500/5 backdrop-blur-sm flex gap-4">
        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
          <svg class="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <p class="text-indigo-400 font-bold mb-1">¿Cómo funciona Moments?</p>
          <p class="text-gray-300 text-sm leading-relaxed">
            Moments es una plataforma que te permite <strong class="text-white">comprar y descargar fotografías</strong> capturadas por fotógrafos profesionales. También puedes reportar fotografías en las que aparezcas y no desees que estén publicadas. Tu privacidad y tus derechos son nuestra prioridad.
          </p>
        </div>
      </div>

      <!-- Terms Sections -->
      <div class="space-y-6">

        <!-- Section 1 -->
        <div class="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 backdrop-blur-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-[#3ef4a1] flex items-center justify-center text-white font-black text-sm">1</div>
            <div>
              <h2 class="text-lg font-bold text-white mb-3">Aceptación de Términos</h2>
              <p class="text-gray-400 leading-relaxed">
                Al crear una cuenta en Moments, aceptas quedar sujeto a los presentes Términos y Condiciones. Si no estás de acuerdo con alguna de sus disposiciones, te pedimos que no te registres ni uses la plataforma. Estos términos se rigen por las leyes de la <strong class="text-gray-200">República de Colombia</strong>, en particular la <strong class="text-gray-200">Ley 1480 de 2011</strong> (Estatuto del Consumidor) y la <strong class="text-gray-200">Ley 527 de 1999</strong> (Comercio Electrónico).
              </p>
            </div>
          </div>
        </div>

        <!-- Section 2 -->
        <div class="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 backdrop-blur-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-[#3ef4a1] flex items-center justify-center text-white font-black text-sm">2</div>
            <div>
              <h2 class="text-lg font-bold text-white mb-3">Qué es Moments y Qué No Es</h2>
              <p class="text-gray-400 leading-relaxed mb-3">
                Moments es un <strong class="text-gray-200">servicio digital de intermediación</strong>: somos el puente entre fotógrafos profesionales y compradores. No somos el autor ni propietario de las fotografías publicadas por los fotógrafos.
              </p>
              <div class="grid md:grid-cols-2 gap-4 mt-4">
                <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p class="text-emerald-400 font-bold text-sm mb-2">✓ Lo que SÍ hacemos</p>
                  <ul class="text-gray-400 text-sm space-y-1">
                    <li>• Hospedamos y mostramos fotografías de eventos</li>
                    <li>• Facilitamos el pago seguro</li>
                    <li>• Gestionamos reportes de contenido</li>
                    <li>• Protegemos tus datos personales</li>
                  </ul>
                </div>
                <div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <p class="text-rose-400 font-bold text-sm mb-2">✗ Lo que NO hacemos</p>
                  <ul class="text-gray-400 text-sm space-y-1">
                    <li>• No somos autores de las fotos</li>
                    <li>• No vendemos tus datos a terceros</li>
                    <li>• No garantizamos la identidad del fotógrafo</li>
                    <li>• No somos responsables del contenido de terceros</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3 - Report Rights -->
        <div class="group p-8 rounded-2xl border border-teal-500/20 bg-teal-500/[0.03] hover:bg-teal-500/[0.06] hover:border-teal-500/30 transition-all duration-300 backdrop-blur-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-[#3ef4a1] flex items-center justify-center text-white font-black text-sm">3</div>
            <div>
              <h2 class="text-lg font-bold text-white mb-3">Tu Derecho a Reportar Fotografías — Derecho al Olvido</h2>
              <p class="text-gray-400 leading-relaxed mb-4">
                Tienes el derecho fundamental de <strong class="text-gray-200">solicitar la revisión y eliminación</strong> de cualquier fotografía en la que aparezcas sin tu consentimiento. Este derecho está amparado por:
              </p>
              <ul class="space-y-2.5 text-gray-400 mb-5">
                <li class="flex items-start gap-2.5">
                  <span class="text-teal-400 font-bold flex-shrink-0 text-lg leading-5">→</span>
                  <span>El <strong class="text-gray-200">artículo 15 de la Constitución Política de Colombia</strong>: derecho a la intimidad y al habeas data.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="text-teal-400 font-bold flex-shrink-0 text-lg leading-5">→</span>
                  <span>La <strong class="text-gray-200">Ley 1581 de 2012</strong> (Protección de Datos Personales): derechos de acceso, rectificación y supresión de tus datos.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="text-teal-400 font-bold flex-shrink-0 text-lg leading-5">→</span>
                  <span>La <strong class="text-gray-200">Sentencia T-040/13 de la Corte Constitucional</strong>: reconoce el "derecho al olvido digital" en Colombia.</span>
                </li>
              </ul>
              <div class="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
                <p class="text-teal-300 text-sm font-semibold mb-2">¿Cómo funciona el proceso de reporte?</p>
                <ol class="text-gray-400 text-sm space-y-1">
                  <li>1. Haz clic en el botón <strong class="text-gray-200">"Reportar"</strong> que aparece en cualquier fotografía.</li>
                  <li>2. Indica el motivo de tu reporte (aparezco en la foto sin consentimiento, contenido sensible, etc.).</li>
                  <li>3. Nuestro equipo realizará un <strong class="text-gray-200">estudio de la solicitud</strong> en un plazo razonable.</li>
                  <li>4. Si tu solicitud es procedente, la fotografía será <strong class="text-gray-200">eliminada de la plataforma</strong>.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 4 - Purchases -->
        <div class="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 backdrop-blur-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-[#3ef4a1] flex items-center justify-center text-white font-black text-sm">4</div>
            <div>
              <h2 class="text-lg font-bold text-white mb-3">Compras y Licencias de Uso</h2>
              <p class="text-gray-400 leading-relaxed mb-3">
                Al comprar una fotografía en Moments, adquieres una <strong class="text-gray-200">licencia de uso personal no exclusiva</strong> sobre esa imagen. Esto significa que puedes:
              </p>
              <div class="grid md:grid-cols-2 gap-4">
                <div class="space-y-2 text-gray-400 text-sm">
                  <p class="text-violet-400 font-bold">Puedes:</p>
                  <p>✓ Descargar y guardar la foto en tus dispositivos</p>
                  <p>✓ Usarla para impresión personal</p>
                  <p>✓ Compartirla en redes sociales propias</p>
                </div>
                <div class="space-y-2 text-gray-400 text-sm">
                  <p class="text-rose-400 font-bold">No puedes:</p>
                  <p>✗ Revender o redistribuir la fotografía</p>
                  <p>✗ Usarla con fines comerciales sin autorización</p>
                  <p>✗ Eliminar marcas de agua o metadatos del autor</p>
                </div>
              </div>
              <p class="text-gray-500 text-sm mt-4">
                Los pagos son definitivos una vez descargado el contenido. Ante disputas de consumo, puedes acudir a la <strong class="text-gray-300">Superintendencia de Industria y Comercio (SIC)</strong>.
              </p>
            </div>
          </div>
        </div>

        <!-- Section 5 - Privacy -->
        <div class="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 backdrop-blur-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-[#3ef4a1] flex items-center justify-center text-white font-black text-sm">5</div>
            <div>
              <h2 class="text-lg font-bold text-white mb-3">Protección de tus Datos Personales</h2>
              <p class="text-gray-400 leading-relaxed mb-3">
                Moments trata tus datos personales conforme a la <strong class="text-gray-200">Ley 1581 de 2012</strong> y el Decreto 1377 de 2013. Tienes los siguientes derechos sobre tus datos:
              </p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div class="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                  <p class="text-blue-400 text-lg mb-1">👁</p>
                  <p class="text-gray-200 text-xs font-bold">Acceso</p>
                  <p class="text-gray-500 text-xs">Consultar tus datos</p>
                </div>
                <div class="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                  <p class="text-blue-400 text-lg mb-1">✏️</p>
                  <p class="text-gray-200 text-xs font-bold">Rectificación</p>
                  <p class="text-gray-500 text-xs">Corregir errores</p>
                </div>
                <div class="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                  <p class="text-blue-400 text-lg mb-1">🗑</p>
                  <p class="text-gray-200 text-xs font-bold">Supresión</p>
                  <p class="text-gray-500 text-xs">Eliminar tu info</p>
                </div>
                <div class="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                  <p class="text-blue-400 text-lg mb-1">🚫</p>
                  <p class="text-gray-200 text-xs font-bold">Revocación</p>
                  <p class="text-gray-500 text-xs">Retirar tu consent.</p>
                </div>
              </div>
              <p class="text-gray-500 text-sm mt-4">
                Para ejercer cualquiera de estos derechos, escríbenos a <strong class="text-gray-300">contacto@moments.com.co</strong>. Encontrarás información completa en nuestra <NuxtLink to="/privacy" class="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">Política de Privacidad</NuxtLink>.
              </p>
            </div>
          </div>
        </div>

        <!-- Section 6 - Account -->
        <div class="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 backdrop-blur-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-[#3ef4a1] flex items-center justify-center text-white font-black text-sm">6</div>
            <div>
              <h2 class="text-lg font-bold text-white mb-3">Responsabilidad de la Cuenta</h2>
              <p class="text-gray-400 leading-relaxed">
                Eres responsable de mantener la confidencialidad de tus credenciales de acceso y de todas las actividades realizadas desde tu cuenta. Moments no se hace responsable de usos no autorizados derivados de la negligencia del usuario en el resguardo de su contraseña. Ante cualquier sospecha de acceso no autorizado, <strong class="text-gray-200">notifícanos de inmediato</strong> a contacto@moments.com.co.
              </p>
            </div>
          </div>
        </div>

        <!-- Section 7 - Law -->
        <div class="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 backdrop-blur-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-[#3ef4a1] flex items-center justify-center text-white font-black text-sm">7</div>
            <div>
              <h2 class="text-lg font-bold text-white mb-3">Ley Aplicable y Resolución de Conflictos</h2>
              <p class="text-gray-400 leading-relaxed">
                Estos Términos se rigen por las leyes de la <strong class="text-gray-200">República de Colombia</strong>. Cualquier controversia se someterá a los <strong class="text-gray-200">jueces y tribunales de Bogotá D.C.</strong> Como consumidor, tienes derecho a reclamar ante la <strong class="text-gray-200">Superintendencia de Industria y Comercio (SIC)</strong> en ejercicio de los derechos que te confiere la <strong class="text-gray-200">Ley 1480 de 2011</strong>.
              </p>
            </div>
          </div>
        </div>

      </div>

      <!-- Accept Buttons -->
      <div class="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink
          to="/register"
          class="w-full sm:w-auto px-10 py-4 rounded-2xl bg-[#3ef4a1] hover:from-indigo-500 hover:to-teal-500 text-white font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/25 text-center active:scale-95"
        >
          He leído y acepto los Términos
        </NuxtLink>
        <NuxtLink
          to="/register"
          class="w-full sm:w-auto px-10 py-4 rounded-2xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 font-semibold text-sm transition-all duration-300 text-center"
        >
          Volver al Registro
        </NuxtLink>
      </div>

      <p class="text-center text-gray-600 text-xs mt-8 pb-4">
        Moments · Bogotá D.C., Colombia · contacto@moments.com.co<br/>
        Estos términos constituyen un contrato legalmente vinculante entre usted y Moments.
      </p>

    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

useSeoMeta({
  title: 'Términos y Condiciones para Usuarios — Moments',
  description: 'Términos y condiciones para usuarios de Moments. Conoce tus derechos como consumidor, cómo reportar fotos y cómo protegemos tu información conforme a la ley colombiana.'
})
</script>
