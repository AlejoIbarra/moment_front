<template>
  <div class="min-h-screen bg-[#0a0a0f] text-white pb-24">

    <!-- Animated Background -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-purple-600/10 to-indigo-600/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-amber-500/8 to-red-600/5 rounded-full blur-3xl"></div>
    </div>

    <!-- Header -->
    <header class="relative z-10 border-b border-white/5 bg-black/30 backdrop-blur-xl">
      <div class="max-w-4xl mx-auto px-6 py-5 flex justify-between items-center">
        <NuxtLink to="/" class="text-2xl font-black tracking-tighter italic bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent">
          Moments
        </NuxtLink>
        <div class="flex items-center gap-4">
          <span class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            Solo para Fotógrafos
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
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-6">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          Términos para Fotógrafos
        </div>
        <h1 class="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
          Términos y Condiciones<br />
          <span class="bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent">para Fotógrafos</span>
        </h1>
        <p class="text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Antes de comenzar a subir tu trabajo en Moments, lee detenidamente estos términos. Son los derechos y responsabilidades que rigen tu actividad en nuestra plataforma.
        </p>
        <p class="text-gray-500 text-sm mt-3">Última actualización: 4 de agosto de 2026 · Ley aplicable: Derecho Colombiano</p>
      </div>

      <!-- Alert Box Critical -->
      <div class="mb-10 p-6 rounded-2xl border border-red-500/30 bg-red-500/5 backdrop-blur-sm flex gap-4">
        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg class="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
        </div>
        <div>
          <p class="text-red-400 font-bold mb-1">Aviso Legal Importante</p>
          <p class="text-gray-300 text-sm leading-relaxed">
            Moments <strong class="text-white">NO es responsable</strong> de las fotografías que tú, como fotógrafo, decidas subir a la plataforma. Al publicar contenido, declaras bajo tu propia responsabilidad que cuentas con todos los derechos y autorizaciones necesarias. La responsabilidad legal recae exclusivamente sobre ti.
          </p>
        </div>
      </div>

      <!-- Terms Sections -->
      <div class="space-y-6">

        <!-- Section 1 -->
        <div class="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 backdrop-blur-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm">1</div>
            <div>
              <h2 class="text-lg font-bold text-white mb-3">Naturaleza de la Plataforma — Solo Intermediación</h2>
              <p class="text-gray-400 leading-relaxed mb-3">
                Moments es una <strong class="text-gray-200">plataforma digital de intermediación</strong> que presta el servicio tecnológico de publicación, exhibición y venta de fotografías. Actuamos exclusivamente como un proveedor de infraestructura tecnológica entre fotógrafos y compradores.
              </p>
              <p class="text-gray-400 leading-relaxed">
                De conformidad con los artículos <strong class="text-gray-200">56 y siguientes de la Ley 527 de 1999</strong> (Comercio Electrónico en Colombia) y el artículo <strong class="text-gray-200">15 de la Ley 1480 de 2011</strong> (Estatuto del Consumidor), Moments no es el productor, editor ni responsable del contenido fotográfico publicado por terceros. La relación contractual de compra se establece directamente entre el fotógrafo y el comprador.
              </p>
            </div>
          </div>
        </div>

        <!-- Section 2 -->
        <div class="group p-8 rounded-2xl border border-red-500/20 bg-red-500/[0.03] hover:bg-red-500/[0.06] hover:border-red-500/30 transition-all duration-300 backdrop-blur-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white font-black text-sm">2</div>
            <div>
              <h2 class="text-lg font-bold text-white mb-3">Tu Responsabilidad sobre el Contenido Publicado</h2>
              <p class="text-gray-400 leading-relaxed mb-3">
                Al subir una fotografía a Moments, declaras y garantizas, bajo tu entera responsabilidad, que:
              </p>
              <ul class="space-y-2.5 text-gray-400">
                <li class="flex items-start gap-2.5">
                  <span class="mt-1.5 w-4 h-4 flex-shrink-0 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg class="w-2.5 h-2.5 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>
                  </span>
                  <span>Eres el <strong class="text-gray-200">autor o titular de los derechos</strong> de todas las fotografías que publiques, de conformidad con la <strong class="text-gray-200">Ley 23 de 1982</strong> (Derechos de Autor) y la <strong class="text-gray-200">Decisión Andina 351 de 1993</strong>.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="mt-1.5 w-4 h-4 flex-shrink-0 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg class="w-2.5 h-2.5 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>
                  </span>
                  <span>Has obtenido el <strong class="text-gray-200">consentimiento expreso, libre e informado</strong> de cada persona identificable que aparezca en tus fotografías, conforme al <strong class="text-gray-200">artículo 15 de la Constitución Política</strong> y la <strong class="text-gray-200">Ley 1581 de 2012</strong> (Protección de Datos Personales).</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="mt-1.5 w-4 h-4 flex-shrink-0 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg class="w-2.5 h-2.5 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>
                  </span>
                  <span>El contenido <strong class="text-gray-200">no viola</strong> derechos de imagen, privacidad, honra ni buen nombre de ninguna persona, protegidos por los artículos <strong class="text-gray-200">14 y 15 de la Constitución Política</strong>.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="mt-1.5 w-4 h-4 flex-shrink-0 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg class="w-2.5 h-2.5 text-red-400" fill="currentColor" viewBox="0 0 24 24"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>
                  </span>
                  <span>No publicarás contenido que constituya material de explotación sexual, acoso, discriminación o cualquier otra conducta tipificada en el <strong class="text-gray-200">Código Penal Colombiano (Ley 599 de 2000)</strong>.</span>
                </li>
              </ul>
              <div class="mt-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                <p class="text-red-300 text-sm font-semibold">
                  ⚖️ Si subes fotografías sin consentimiento de las personas retratadas, la responsabilidad legal, civil y penal recae EXCLUSIVAMENTE sobre ti. Moments no asume ninguna responsabilidad por dicho contenido.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3 -->
        <div class="group p-8 rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] hover:bg-amber-500/[0.06] hover:border-amber-500/30 transition-all duration-300 backdrop-blur-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-black text-sm">3</div>
            <div>
              <h2 class="text-lg font-bold text-white mb-3">Sistema de Reportes y Derecho al Olvido Digital</h2>
              <p class="text-gray-400 leading-relaxed mb-3">
                Moments cuenta con un <strong class="text-gray-200">mecanismo de reporte de contenido</strong> que permite a cualquier persona solicitar la revisión y eventual eliminación de fotografías en las que aparezca, en ejercicio de sus derechos fundamentales reconocidos por:
              </p>
              <ul class="space-y-2 text-gray-400 mb-4">
                <li class="flex items-start gap-2.5">
                  <span class="text-amber-400 font-bold flex-shrink-0">→</span>
                  <span>La <strong class="text-gray-200">Ley 1581 de 2012</strong> y el Decreto 1377 de 2013, que garantizan el derecho de supresión de datos personales.</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <span class="text-amber-400 font-bold flex-shrink-0">→</span>
                  <span>La <strong class="text-gray-200">Sentencia T-040/13 de la Corte Constitucional</strong>, que reconoce el "derecho al olvido digital" en el ordenamiento jurídico colombiano.</span>
                </li>
              </ul>
              <p class="text-gray-400 leading-relaxed">
                Tras recibir un reporte, Moments realizará un <strong class="text-gray-200">estudio interno</strong>. Si la solicitud es válida, la fotografía podrá ser eliminada de la plataforma, independientemente de si ya fue comprada. <strong class="text-gray-200">Como fotógrafo, aceptas este proceso y no podrás reclamar compensación a Moments</strong> por la eliminación de contenido que viola derechos de terceros.
              </p>
            </div>
          </div>
        </div>

        <!-- Section 4 -->
        <div class="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 backdrop-blur-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white font-black text-sm">4</div>
            <div>
              <h2 class="text-lg font-bold text-white mb-3">Propiedad Intelectual</h2>
              <p class="text-gray-400 leading-relaxed mb-3">
                Conservas todos los derechos morales y patrimoniales de autor sobre tus fotografías, conforme a la <strong class="text-gray-200">Ley 23 de 1982</strong>. Al publicar en Moments, nos otorgas una <strong class="text-gray-200">licencia no exclusiva, mundial y libre de regalías</strong> para exhibir, reproducir y distribuir tus fotografías únicamente dentro de la plataforma con fines de comercialización.
              </p>
              <p class="text-gray-400 leading-relaxed">
                Moments <strong class="text-gray-200">nunca reclamará propiedad</strong> sobre tu contenido ni lo comercializará fuera de la plataforma sin tu consentimiento previo y expreso.
              </p>
            </div>
          </div>
        </div>

        <!-- Section 5 -->
        <div class="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 backdrop-blur-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center text-white font-black text-sm">5</div>
            <div>
              <h2 class="text-lg font-bold text-white mb-3">Pagos, Comisiones y Facturación</h2>
              <p class="text-gray-400 leading-relaxed mb-3">
                Recibirás el valor de tus ventas menos la comisión de servicio de Moments, la cual será informada antes de publicar. Los pagos se procesarán en los ciclos establecidos en la plataforma.
              </p>
              <p class="text-gray-400 leading-relaxed">
                Para efectos tributarios, eres responsable de declarar tus ingresos ante la <strong class="text-gray-200">DIAN</strong> según la normativa fiscal colombiana vigente. Moments no asume responsabilidad por tus obligaciones tributarias.
              </p>
            </div>
          </div>
        </div>

        <!-- Section 6 -->
        <div class="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 backdrop-blur-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center text-white font-black text-sm">6</div>
            <div>
              <h2 class="text-lg font-bold text-white mb-3">Causales de Suspensión y Eliminación de Cuenta</h2>
              <p class="text-gray-400 leading-relaxed mb-3">
                Moments podrá suspender o eliminar tu cuenta sin previo aviso en los siguientes casos:
              </p>
              <ul class="space-y-2 text-gray-400">
                <li class="flex items-start gap-2.5"><span class="text-rose-400 font-bold flex-shrink-0">✗</span><span>Publicación reiterada de fotografías sin consentimiento de los retratados.</span></li>
                <li class="flex items-start gap-2.5"><span class="text-rose-400 font-bold flex-shrink-0">✗</span><span>Violación de derechos de autor de terceros.</span></li>
                <li class="flex items-start gap-2.5"><span class="text-rose-400 font-bold flex-shrink-0">✗</span><span>Publicación de contenido que constituya un ilícito penal en Colombia.</span></li>
                <li class="flex items-start gap-2.5"><span class="text-rose-400 font-bold flex-shrink-0">✗</span><span>Incumplimiento grave o reiterado de estos Términos y Condiciones.</span></li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Section 7 -->
        <div class="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 backdrop-blur-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-black text-sm">7</div>
            <div>
              <h2 class="text-lg font-bold text-white mb-3">Ley Aplicable y Resolución de Conflictos</h2>
              <p class="text-gray-400 leading-relaxed">
                Estos Términos se rigen por las leyes de la <strong class="text-gray-200">República de Colombia</strong>. Cualquier controversia se someterá a la jurisdicción de los <strong class="text-gray-200">jueces y tribunales de la ciudad de Bogotá D.C.</strong> Los conflictos relacionados con derechos del consumidor podrán atenderse ante la <strong class="text-gray-200">Superintendencia de Industria y Comercio (SIC)</strong>.
              </p>
            </div>
          </div>
        </div>

      </div>

      <!-- Buttons -->
      <div class="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink
          to="/register"
          class="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/25 text-center active:scale-95"
        >
          He leído y acepto los Términos como Fotógrafo
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
  title: 'Términos y Condiciones para Fotógrafos — Moments',
  description: 'Términos y condiciones específicos para fotógrafos en la plataforma Moments. Conoce tus responsabilidades conforme a la ley colombiana.'
})
</script>
