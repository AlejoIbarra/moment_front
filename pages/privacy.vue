<template>
  <div class="min-h-screen bg-[#0a0a0f] text-white pb-24">

    <!-- Animated Background -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute -top-60 -right-60 w-[700px] h-[700px] bg-[#3ef4a1]/8 rounded-full blur-3xl opacity-60"></div>
      <div class="absolute -bottom-60 -left-60 w-[600px] h-[600px] bg-indigo-500/8 rounded-full blur-3xl opacity-40"></div>
    </div>

    <!-- Header -->
    <header class="relative z-10 border-b border-white/5 bg-black/30 backdrop-blur-xl sticky top-0">
      <div class="max-w-4xl mx-auto px-6 py-5 flex justify-between items-center">
        <NuxtLink to="/" class="text-2xl font-black tracking-tighter italic text-[#3ef4a1]">
          Moments
        </NuxtLink>
        <div class="flex items-center gap-4">
          <span class="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <svg class="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
            Aviso Legal
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
        <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
          </svg>
          Política de Privacidad
        </div>
        <h1 class="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
          Tu Privacidad,<br />
          <span class="text-[#3ef4a1]">Nuestra Prioridad</span>
        </h1>
        <p class="text-gray-400 max-w-2xl mx-auto leading-relaxed">
          Esta Política describe cómo <strong class="text-white">Moments</strong> recopila, utiliza, almacena y protege tu información personal, de conformidad con la legislación colombiana y los estándares de privacidad de plataformas como Google y Meta (Facebook).
        </p>
        <p class="text-gray-500 text-sm mt-3">Última actualización: 6 de septiembre de 2026 · Ley aplicable: Derecho Colombiano · Versión 2.0</p>
      </div>

      <!-- Alert Legal Box -->
      <div class="mb-10 p-6 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm flex gap-4">
        <div class="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
          <svg class="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <div>
          <p class="text-emerald-400 font-bold mb-1">Responsable del Tratamiento de Datos</p>
          <p class="text-gray-300 text-sm leading-relaxed">
            <strong class="text-white">Moments SAS</strong> — NIT en trámite — Bogotá D.C., Colombia.<br/>
            Delegado de Protección de Datos (DPO): <strong class="text-white">privacidad@moments.com.co</strong><br/>
            Superintendencia de Industria y Comercio (SIC): <a href="https://www.sic.gov.co" target="_blank" class="text-emerald-400 underline hover:text-emerald-300">www.sic.gov.co</a>
          </p>
        </div>
      </div>

      <!-- Table of Contents -->
      <div class="mb-10 p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-sm">
        <p class="text-gray-300 font-bold mb-4 text-sm uppercase tracking-widest">Contenido</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <a href="#datos" class="text-gray-400 hover:text-[#3ef4a1] transition-colors flex items-center gap-2"><span class="text-[#3ef4a1]">01</span> Datos que Recopilamos</a>
          <a href="#oauth" class="text-gray-400 hover:text-[#3ef4a1] transition-colors flex items-center gap-2"><span class="text-[#3ef4a1]">02</span> Inicio de Sesión con Google y Facebook</a>
          <a href="#uso" class="text-gray-400 hover:text-[#3ef4a1] transition-colors flex items-center gap-2"><span class="text-[#3ef4a1]">03</span> Uso de la Información</a>
          <a href="#terceros" class="text-gray-400 hover:text-[#3ef4a1] transition-colors flex items-center gap-2"><span class="text-[#3ef4a1]">04</span> Compartir Datos con Terceros</a>
          <a href="#fotógrafos" class="text-gray-400 hover:text-[#3ef4a1] transition-colors flex items-center gap-2"><span class="text-[#3ef4a1]">05</span> Contenido de Fotógrafos — Exención de Responsabilidad</a>
          <a href="#reembolsos" class="text-gray-400 hover:text-[#3ef4a1] transition-colors flex items-center gap-2"><span class="text-[#3ef4a1]">06</span> Política de Reembolsos</a>
          <a href="#derechos" class="text-gray-400 hover:text-[#3ef4a1] transition-colors flex items-center gap-2"><span class="text-[#3ef4a1]">07</span> Tus Derechos como Titular</a>
          <a href="#seguridad" class="text-gray-400 hover:text-[#3ef4a1] transition-colors flex items-center gap-2"><span class="text-[#3ef4a1]">08</span> Seguridad de los Datos</a>
          <a href="#cookies" class="text-gray-400 hover:text-[#3ef4a1] transition-colors flex items-center gap-2"><span class="text-[#3ef4a1]">09</span> Cookies y Tecnologías de Seguimiento</a>
          <a href="#ley" class="text-gray-400 hover:text-[#3ef4a1] transition-colors flex items-center gap-2"><span class="text-[#3ef4a1]">10</span> Ley Aplicable y Contacto</a>
        </div>
      </div>

      <!-- Sections -->
      <div class="space-y-6">

        <!-- Section 1 — Datos -->
        <div id="datos" class="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 backdrop-blur-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-[#3ef4a1] flex items-center justify-center text-black font-black text-sm">01</div>
            <div class="flex-1">
              <h2 class="text-lg font-bold text-white mb-3">Datos que Recopilamos</h2>
              <p class="text-gray-400 leading-relaxed mb-4">
                Recopilamos la información estrictamente necesaria para prestarte el servicio, con fundamento en los artículos <strong class="text-gray-200">4 y 5 de la Ley 1581 de 2012</strong> (principios de finalidad y necesidad):
              </p>
              <div class="grid md:grid-cols-2 gap-4">
                <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <p class="text-[#3ef4a1] font-bold text-sm mb-3">Datos que tú nos das:</p>
                  <ul class="text-gray-400 text-sm space-y-1.5">
                    <li class="flex items-center gap-2"><span class="text-[#3ef4a1]">·</span> Nombre y apellido</li>
                    <li class="flex items-center gap-2"><span class="text-[#3ef4a1]">·</span> Correo electrónico</li>
                    <li class="flex items-center gap-2"><span class="text-[#3ef4a1]">·</span> Número de teléfono</li>
                    <li class="flex items-center gap-2"><span class="text-[#3ef4a1]">·</span> Nombre de usuario</li>
                    <li class="flex items-center gap-2"><span class="text-[#3ef4a1]">·</span> Contraseña (cifrada con bcrypt)</li>
                    <li class="flex items-center gap-2"><span class="text-[#3ef4a1]">·</span> Datos de pago (procesados por Stripe/PSE — no los almacenamos)</li>
                  </ul>
                </div>
                <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <p class="text-[#3ef4a1] font-bold text-sm mb-3">Datos que recopilamos automáticamente:</p>
                  <ul class="text-gray-400 text-sm space-y-1.5">
                    <li class="flex items-center gap-2"><span class="text-[#3ef4a1]">·</span> Dirección IP</li>
                    <li class="flex items-center gap-2"><span class="text-[#3ef4a1]">·</span> Tipo de dispositivo y navegador</li>
                    <li class="flex items-center gap-2"><span class="text-[#3ef4a1]">·</span> Historial de compras y descargas</li>
                    <li class="flex items-center gap-2"><span class="text-[#3ef4a1]">·</span> Fotografías publicadas (si eres fotógrafo)</li>
                    <li class="flex items-center gap-2"><span class="text-[#3ef4a1]">·</span> Cookies de sesión y preferencias</li>
                    <li class="flex items-center gap-2"><span class="text-[#3ef4a1]">·</span> Registros de actividad (logs de acceso)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 2 — OAuth Facebook/Google -->
        <div id="oauth" class="group p-8 rounded-2xl border border-blue-500/20 bg-blue-500/[0.03] hover:bg-blue-500/[0.06] hover:border-blue-500/30 transition-all duration-300 backdrop-blur-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-[#3ef4a1] flex items-center justify-center text-black font-black text-sm">02</div>
            <div class="flex-1">
              <h2 class="text-lg font-bold text-white mb-3">Inicio de Sesión con Google y Facebook (OAuth)</h2>
              <p class="text-gray-400 leading-relaxed mb-4">
                Moments ofrece la posibilidad de registrarte e iniciar sesión mediante tu cuenta de <strong class="text-white">Google</strong> o <strong class="text-white">Facebook (Meta)</strong>, utilizando el estándar OAuth 2.0. Al hacerlo, aceptas además las políticas de privacidad de dichas plataformas:
              </p>
              <div class="grid md:grid-cols-2 gap-4 mb-5">
                <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <div class="flex items-center gap-2 mb-3">
                    <svg class="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    <p class="text-white font-bold text-sm">Google OAuth</p>
                  </div>
                  <ul class="text-gray-400 text-sm space-y-1">
                    <li>• Obtenemos: nombre, email, foto de perfil y token de identificación.</li>
                    <li>• <strong class="text-gray-200">No obtenemos</strong> tu contraseña de Google.</li>
                    <li>• Rige también: <a href="https://policies.google.com/privacy" target="_blank" class="text-blue-400 hover:underline">Política de Privacidad de Google</a></li>
                  </ul>
                </div>
                <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <div class="flex items-center gap-2 mb-3">
                    <svg class="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    <p class="text-white font-bold text-sm">Facebook OAuth (Meta)</p>
                  </div>
                  <ul class="text-gray-400 text-sm space-y-1">
                    <li>• Obtenemos: nombre, email, foto de perfil y token de acceso.</li>
                    <li>• Permisos solicitados: <code class="text-xs bg-white/10 px-1 rounded">public_profile</code> y <code class="text-xs bg-white/10 px-1 rounded">email</code>.</li>
                    <li>• Rige también: <a href="https://www.facebook.com/privacy/policy/" target="_blank" class="text-blue-400 hover:underline">Política de Privacidad de Meta</a></li>
                  </ul>
                </div>
              </div>
              <div class="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <p class="text-blue-300 text-sm">
                  ⚡ La información obtenida vía OAuth se almacena únicamente para crear y gestionar tu cuenta en Moments. <strong class="text-white">No compartimos ni vendemos estos datos a terceros.</strong> Puedes revocar el acceso de Moments desde la configuración de seguridad de tu cuenta de Google o Facebook en cualquier momento.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 3 — Uso -->
        <div id="uso" class="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 backdrop-blur-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-[#3ef4a1] flex items-center justify-center text-black font-black text-sm">03</div>
            <div class="flex-1">
              <h2 class="text-lg font-bold text-white mb-3">Uso de la Información</h2>
              <p class="text-gray-400 leading-relaxed mb-4">
                Tus datos se utilizan exclusivamente para los siguientes fines, de conformidad con el principio de <strong class="text-gray-200">finalidad (Art. 4, Ley 1581/2012)</strong>:
              </p>
              <ul class="space-y-3 text-gray-400">
                <li class="flex items-start gap-3">
                  <span class="mt-1 w-5 h-5 flex-shrink-0 rounded-full bg-[#3ef4a1]/20 flex items-center justify-center text-[#3ef4a1] text-xs font-bold">✓</span>
                  <span><strong class="text-gray-200">Gestión de cuenta:</strong> Crear, autenticar y mantener tu perfil de usuario o fotógrafo.</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="mt-1 w-5 h-5 flex-shrink-0 rounded-full bg-[#3ef4a1]/20 flex items-center justify-center text-[#3ef4a1] text-xs font-bold">✓</span>
                  <span><strong class="text-gray-200">Procesamiento de pagos:</strong> Gestionar transacciones de compra/venta a través de nuestros procesadores de pago (Stripe, PSE). Moments NO almacena números de tarjeta ni datos bancarios.</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="mt-1 w-5 h-5 flex-shrink-0 rounded-full bg-[#3ef4a1]/20 flex items-center justify-center text-[#3ef4a1] text-xs font-bold">✓</span>
                  <span><strong class="text-gray-200">Seguridad y prevención de fraude:</strong> Detectar y prevenir accesos no autorizados, actividades fraudulentas o violaciones de nuestros términos.</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="mt-1 w-5 h-5 flex-shrink-0 rounded-full bg-[#3ef4a1]/20 flex items-center justify-center text-[#3ef4a1] text-xs font-bold">✓</span>
                  <span><strong class="text-gray-200">Comunicaciones de servicio:</strong> Enviarte confirmaciones de compra, notificaciones de seguridad (2FA) y actualizaciones importantes de la plataforma.</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="mt-1 w-5 h-5 flex-shrink-0 rounded-full bg-[#3ef4a1]/20 flex items-center justify-center text-[#3ef4a1] text-xs font-bold">✓</span>
                  <span><strong class="text-gray-200">Mejora del servicio:</strong> Analizar el uso de la plataforma de forma agregada y anonimizada para mejorar la experiencia.</span>
                </li>
                <li class="flex items-start gap-3">
                  <span class="mt-1 w-5 h-5 flex-shrink-0 rounded-full bg-[#3ef4a1]/20 flex items-center justify-center text-[#3ef4a1] text-xs font-bold">✓</span>
                  <span><strong class="text-gray-200">Cumplimiento legal:</strong> Atender requerimientos de autoridades competentes conforme a la ley colombiana.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Section 4 — Terceros -->
        <div id="terceros" class="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 backdrop-blur-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-[#3ef4a1] flex items-center justify-center text-black font-black text-sm">04</div>
            <div class="flex-1">
              <h2 class="text-lg font-bold text-white mb-3">Compartir Datos con Terceros</h2>
              <p class="text-gray-400 leading-relaxed mb-4">
                <strong class="text-white">No vendemos, alquilamos ni comercializamos tu información personal.</strong> Compartimos datos únicamente con los siguientes terceros encargados del tratamiento, bajo contratos de confidencialidad y conforme al <strong class="text-gray-200">Art. 12 de la Ley 1581 de 2012</strong>:
              </p>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div>
                    <p class="text-gray-200 text-sm font-bold">Stripe / PSE</p>
                    <p class="text-gray-500 text-xs">Procesamiento de pagos — no acceden a tus credenciales de Moments</p>
                  </div>
                  <span class="text-xs px-2 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">Necesario</span>
                </div>
                <div class="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div>
                    <p class="text-gray-200 text-sm font-bold">Google / Meta</p>
                    <p class="text-gray-500 text-xs">Autenticación OAuth (solo si decides usar ese método)</p>
                  </div>
                  <span class="text-xs px-2 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20">Opcional</span>
                </div>
                <div class="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div>
                    <p class="text-gray-200 text-sm font-bold">Autoridades Públicas</p>
                    <p class="text-gray-500 text-xs">Fiscalía, Policía, SIC — solo ante requerimiento legal formal</p>
                  </div>
                  <span class="text-xs px-2 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">Legal</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 5 — Fotógrafos / Exención -->
        <div id="fotógrafos" class="group p-8 rounded-2xl border border-red-500/25 bg-red-500/[0.03] hover:bg-red-500/[0.06] hover:border-red-500/35 transition-all duration-300 backdrop-blur-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-red-500/80 flex items-center justify-center text-white font-black text-sm">05</div>
            <div class="flex-1">
              <h2 class="text-lg font-bold text-white mb-3">Contenido de Fotógrafos — Exención de Responsabilidad de Moments</h2>
              <div class="p-5 rounded-xl bg-red-500/10 border border-red-500/20 mb-5">
                <p class="text-red-300 font-bold mb-2">⚖️ Aviso Legal Fundamental</p>
                <p class="text-gray-300 text-sm leading-relaxed">
                  Moments actúa exclusivamente como una <strong class="text-white">plataforma tecnológica de intermediación</strong> entre fotógrafos y compradores. No somos autores, editores, ni propietarios del contenido fotográfico publicado por terceros. En consecuencia, <strong class="text-white">Moments no asume ninguna responsabilidad</strong> civil, penal ni administrativa derivada del contenido publicado por los fotógrafos en la plataforma.
                </p>
              </div>
              <div class="space-y-3 text-gray-400 text-sm">
                <div class="flex items-start gap-3">
                  <span class="text-red-400 font-bold flex-shrink-0 mt-0.5">→</span>
                  <span><strong class="text-gray-200">Derechos de autor:</strong> El fotógrafo es el único titular de los derechos morales y patrimoniales sobre sus fotografías, conforme a la <strong class="text-gray-200">Ley 23 de 1982</strong> y la <strong class="text-gray-200">Decisión Andina 351 de 1993</strong>. Moments no reivindica propiedad alguna sobre el contenido.</span>
                </div>
                <div class="flex items-start gap-3">
                  <span class="text-red-400 font-bold flex-shrink-0 mt-0.5">→</span>
                  <span><strong class="text-gray-200">Consentimiento de personas retratadas:</strong> Es responsabilidad exclusiva del fotógrafo haber obtenido el consentimiento de las personas que aparecen en sus fotografías, conforme al <strong class="text-gray-200">Art. 15 de la Constitución Política</strong> y la <strong class="text-gray-200">Ley 1581 de 2012</strong>.</span>
                </div>
                <div class="flex items-start gap-3">
                  <span class="text-red-400 font-bold flex-shrink-0 mt-0.5">→</span>
                  <span><strong class="text-gray-200">Responsabilidad frente a demandas:</strong> Cualquier reclamación, demanda, acción legal o indemnización derivada del contenido fotográfico publicado será dirigida y asumida exclusivamente por el fotógrafo. Moments queda expresamente exonerado de toda responsabilidad al respecto, conforme al <strong class="text-gray-200">Art. 15 de la Ley 1480 de 2011</strong> y los Arts. <strong class="text-gray-200">56 y ss. de la Ley 527 de 1999</strong>.</span>
                </div>
                <div class="flex items-start gap-3">
                  <span class="text-red-400 font-bold flex-shrink-0 mt-0.5">→</span>
                  <span><strong class="text-gray-200">Derecho al olvido:</strong> Cualquier persona que aparezca en una fotografía publicada en Moments puede solicitar su eliminación conforme a la <strong class="text-gray-200">Sentencia T-040/13 de la Corte Constitucional</strong>. Moments procesará estas solicitudes de buena fe; el fotógrafo no podrá reclamar compensación a Moments por la eliminación de contenido que vulnere derechos de terceros.</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 6 — Reembolsos -->
        <div id="reembolsos" class="group p-8 rounded-2xl border border-amber-500/20 bg-amber-500/[0.03] hover:bg-amber-500/[0.06] hover:border-amber-500/30 transition-all duration-300 backdrop-blur-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-[#3ef4a1] flex items-center justify-center text-black font-black text-sm">06</div>
            <div class="flex-1">
              <h2 class="text-lg font-bold text-white mb-3">Política de Reembolsos</h2>
              <p class="text-gray-400 leading-relaxed mb-5">
                De conformidad con el <strong class="text-gray-200">artículo 47 de la Ley 1480 de 2011</strong> (Estatuto del Consumidor) y el <strong class="text-gray-200">artículo 51</strong> sobre el derecho de retracto en comercio electrónico, aplicamos la siguiente política:
              </p>

              <div class="grid md:grid-cols-2 gap-4 mb-5">
                <div class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p class="text-emerald-400 font-bold text-sm mb-3">✓ Procede el reembolso cuando:</p>
                  <ul class="text-gray-400 text-sm space-y-2">
                    <li class="flex items-start gap-2"><span class="text-emerald-400 mt-0.5 flex-shrink-0">·</span><span>La fotografía comprada presenta defectos técnicos graves (archivo corrupto, resolución incorrecta) reportados dentro de <strong class="text-gray-200">5 días hábiles</strong> desde la compra.</span></li>
                    <li class="flex items-start gap-2"><span class="text-emerald-400 mt-0.5 flex-shrink-0">·</span><span>Se realizó un cobro duplicado o erróneo por error del sistema.</span></li>
                    <li class="flex items-start gap-2"><span class="text-emerald-400 mt-0.5 flex-shrink-0">·</span><span>La fotografía fue eliminada de la plataforma por violación de derechos ANTES de que pudieras descargarla.</span></li>
                    <li class="flex items-start gap-2"><span class="text-emerald-400 mt-0.5 flex-shrink-0">·</span><span>Ejercicio del <strong class="text-gray-200">derecho de retracto</strong>: 5 días hábiles desde la compra, siempre que la foto <strong class="text-gray-200">NO haya sido descargada aún</strong>.</span></li>
                  </ul>
                </div>
                <div class="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <p class="text-rose-400 font-bold text-sm mb-3">✗ NO procede el reembolso cuando:</p>
                  <ul class="text-gray-400 text-sm space-y-2">
                    <li class="flex items-start gap-2"><span class="text-rose-400 mt-0.5 flex-shrink-0">·</span><span>La fotografía fue descargada exitosamente (el bien digital fue entregado).</span></li>
                    <li class="flex items-start gap-2"><span class="text-rose-400 mt-0.5 flex-shrink-0">·</span><span>Simplemente no te gustó la foto una vez vista (el contenido fue visible antes de comprar).</span></li>
                    <li class="flex items-start gap-2"><span class="text-rose-400 mt-0.5 flex-shrink-0">·</span><span>Han transcurrido más de 5 días hábiles desde la compra sin reporte.</span></li>
                    <li class="flex items-start gap-2"><span class="text-rose-400 mt-0.5 flex-shrink-0">·</span><span>El reporte de inconformidad es subjetivo y no corresponde a un defecto técnico verificable.</span></li>
                  </ul>
                </div>
              </div>

              <div class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <p class="text-amber-300 font-bold text-sm mb-2">📧 ¿Cómo solicitar un reembolso?</p>
                <ol class="text-gray-400 text-sm space-y-1">
                  <li>1. Envía un correo a <strong class="text-white">reembolsos@moments.com.co</strong> con asunto: <em>"Solicitud de Reembolso — [Número de Orden]"</em>.</li>
                  <li>2. Incluye: tu nombre de usuario, número de orden, motivo detallado y, si aplica, evidencia del defecto (captura de pantalla).</li>
                  <li>3. Nuestro equipo evaluará tu solicitud en un plazo máximo de <strong class="text-white">10 días hábiles</strong>.</li>
                  <li>4. Si procede, el reembolso se realizará por el mismo medio de pago original en un plazo adicional de 5 a 15 días hábiles, según tu entidad bancaria.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 7 — Derechos del Titular -->
        <div id="derechos" class="group p-8 rounded-2xl border border-teal-500/20 bg-teal-500/[0.03] hover:bg-teal-500/[0.06] hover:border-teal-500/30 transition-all duration-300 backdrop-blur-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-[#3ef4a1] flex items-center justify-center text-black font-black text-sm">07</div>
            <div class="flex-1">
              <h2 class="text-lg font-bold text-white mb-3">Tus Derechos como Titular de Datos</h2>
              <p class="text-gray-400 leading-relaxed mb-4">
                Conforme a los artículos <strong class="text-gray-200">8 y 9 de la Ley 1581 de 2012</strong>, tienes los siguientes derechos sobre tus datos personales, los cuales puedes ejercer en cualquier momento:
              </p>
              <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
                <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                  <p class="text-[#3ef4a1] text-2xl mb-2">👁</p>
                  <p class="text-gray-200 text-xs font-bold mb-1">Acceso</p>
                  <p class="text-gray-500 text-xs">Conocer qué datos tenemos sobre ti</p>
                </div>
                <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                  <p class="text-[#3ef4a1] text-2xl mb-2">✏️</p>
                  <p class="text-gray-200 text-xs font-bold mb-1">Rectificación</p>
                  <p class="text-gray-500 text-xs">Corregir datos incorrectos o desactualizados</p>
                </div>
                <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                  <p class="text-[#3ef4a1] text-2xl mb-2">🗑</p>
                  <p class="text-gray-200 text-xs font-bold mb-1">Supresión</p>
                  <p class="text-gray-500 text-xs">Eliminar tu información ("Derecho al Olvido")</p>
                </div>
                <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
                  <p class="text-[#3ef4a1] text-2xl mb-2">🚫</p>
                  <p class="text-gray-200 text-xs font-bold mb-1">Revocación</p>
                  <p class="text-gray-500 text-xs">Retirar tu consentimiento en cualquier momento</p>
                </div>
              </div>
              <div class="p-4 rounded-xl bg-teal-500/10 border border-teal-500/20">
                <p class="text-teal-300 text-sm font-semibold mb-1">¿Cómo ejercer tus derechos?</p>
                <p class="text-gray-400 text-sm">
                  Escríbenos a <strong class="text-white">privacidad@moments.com.co</strong> indicando tu nombre completo, documento de identidad, derecho que deseas ejercer y descripción de tu solicitud. Respondemos en un plazo máximo de <strong class="text-white">15 días hábiles</strong>. Si no obtienes respuesta satisfactoria, puedes presentar tu queja ante la <strong class="text-white">Superintendencia de Industria y Comercio (SIC)</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Section 8 — Seguridad -->
        <div id="seguridad" class="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 backdrop-blur-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-[#3ef4a1] flex items-center justify-center text-black font-black text-sm">08</div>
            <div class="flex-1">
              <h2 class="text-lg font-bold text-white mb-3">Seguridad de los Datos</h2>
              <p class="text-gray-400 leading-relaxed mb-4">
                Implementamos medidas técnicas y organizativas adecuadas conforme al <strong class="text-gray-200">principio de seguridad (Art. 4 lit. f, Ley 1581/2012)</strong>:
              </p>
              <div class="grid md:grid-cols-3 gap-3">
                <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <p class="text-[#3ef4a1] text-lg mb-2">🔐</p>
                  <p class="text-gray-200 text-sm font-bold">Cifrado</p>
                  <p class="text-gray-500 text-xs mt-1">Contraseñas con bcrypt, comunicaciones sobre HTTPS/TLS 1.3</p>
                </div>
                <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <p class="text-[#3ef4a1] text-lg mb-2">🛡</p>
                  <p class="text-gray-200 text-sm font-bold">Autenticación 2FA</p>
                  <p class="text-gray-500 text-xs mt-1">Verificación de dos factores disponible para todas las cuentas</p>
                </div>
                <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <p class="text-[#3ef4a1] text-lg mb-2">📋</p>
                  <p class="text-gray-200 text-sm font-bold">Control de Acceso</p>
                  <p class="text-gray-500 text-xs mt-1">Acceso a datos restringido por roles y monitoreo de actividad</p>
                </div>
              </div>
              <p class="text-gray-500 text-sm mt-4">
                En caso de una brecha de seguridad que afecte tus datos, serás notificado conforme a lo previsto en la normativa colombiana vigente, incluyendo la notificación a la SIC cuando sea pertinente.
              </p>
            </div>
          </div>
        </div>

        <!-- Section 9 — Cookies -->
        <div id="cookies" class="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 backdrop-blur-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-[#3ef4a1] flex items-center justify-center text-black font-black text-sm">09</div>
            <div class="flex-1">
              <h2 class="text-lg font-bold text-white mb-3">Cookies y Tecnologías de Seguimiento</h2>
              <p class="text-gray-400 leading-relaxed mb-4">
                Utilizamos cookies y tecnologías similares para garantizar el funcionamiento de la plataforma y mejorar tu experiencia:
              </p>
              <div class="space-y-3">
                <div class="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div>
                    <p class="text-gray-200 text-sm font-bold">Cookies de Sesión</p>
                    <p class="text-gray-500 text-xs">Mantienen tu sesión activa mientras navegas</p>
                  </div>
                  <span class="text-xs px-2 py-1 rounded-full bg-red-500/15 text-red-400 border border-red-500/20">Esencial</span>
                </div>
                <div class="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div>
                    <p class="text-gray-200 text-sm font-bold">Cookies de Preferencias</p>
                    <p class="text-gray-500 text-xs">Guardan tu idioma, moneda y configuraciones</p>
                  </div>
                  <span class="text-xs px-2 py-1 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">Funcional</span>
                </div>
                <div class="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5">
                  <div>
                    <p class="text-gray-200 text-sm font-bold">Analytics Anonimizados</p>
                    <p class="text-gray-500 text-xs">Entendemos cómo se usa la plataforma sin identificarte</p>
                  </div>
                  <span class="text-xs px-2 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20">Opcional</span>
                </div>
              </div>
              <p class="text-gray-500 text-sm mt-4">
                Puedes gestionar o eliminar las cookies desde la configuración de tu navegador. Desactivar cookies esenciales puede afectar el funcionamiento de la plataforma. Para más detalle, consulta nuestra <NuxtLink to="/cookies" class="text-[#3ef4a1] hover:underline">Política de Cookies</NuxtLink>.
              </p>
            </div>
          </div>
        </div>

        <!-- Section 10 — Ley y Contacto -->
        <div id="ley" class="group p-8 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-300 backdrop-blur-sm">
          <div class="flex items-start gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-xl bg-[#3ef4a1] flex items-center justify-center text-black font-black text-sm">10</div>
            <div class="flex-1">
              <h2 class="text-lg font-bold text-white mb-3">Ley Aplicable, Cambios y Contacto</h2>
              <div class="space-y-4 text-gray-400 text-sm leading-relaxed">
                <p>
                  Esta Política se rige por las leyes de la <strong class="text-gray-200">República de Colombia</strong>, en particular la <strong class="text-gray-200">Ley 1581 de 2012</strong>, el <strong class="text-gray-200">Decreto 1377 de 2013</strong>, la <strong class="text-gray-200">Ley 527 de 1999</strong> y la <strong class="text-gray-200">Ley 1480 de 2011</strong>. Cualquier controversia se someterá a los jueces y tribunales de <strong class="text-gray-200">Bogotá D.C.</strong>
                </p>
                <p>
                  <strong class="text-gray-200">Cambios a esta Política:</strong> Moments puede actualizar esta Política de Privacidad en cualquier momento. Te notificaremos por correo electrónico y mediante un aviso visible en la plataforma con al menos 15 días de anticipación antes de que los cambios entren en vigencia. El uso continuado de la plataforma tras la vigencia de los cambios implica tu aceptación.
                </p>
                <div class="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                  <p class="text-gray-200 font-bold mb-2">Canales de Contacto</p>
                  <div class="space-y-1 text-sm">
                    <p>📧 Privacidad y datos: <strong class="text-white">privacidad@moments.com.co</strong></p>
                    <p>💰 Reembolsos: <strong class="text-white">reembolsos@moments.com.co</strong></p>
                    <p>📬 General: <strong class="text-white">contacto@moments.com.co</strong></p>
                    <p>🏢 Dirección: Bogotá D.C., Colombia</p>
                    <p>⚖️ SIC (quejas): <a href="https://www.sic.gov.co" target="_blank" class="text-[#3ef4a1] hover:underline">www.sic.gov.co</a></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Accept Buttons -->
      <div class="mt-14 flex flex-col sm:flex-row items-center justify-center gap-4">
        <NuxtLink
          to="/register"
          class="w-full sm:w-auto px-10 py-4 rounded-2xl bg-[#3ef4a1] text-black font-bold text-sm transition-all duration-300 hover:shadow-lg hover:shadow-[#3ef4a1]/25 hover:scale-[1.02] text-center active:scale-95"
        >
          He leído y acepto la Política de Privacidad
        </NuxtLink>
        <NuxtLink
          to="/register"
          class="w-full sm:w-auto px-10 py-4 rounded-2xl border border-white/10 text-gray-400 hover:text-white hover:border-white/20 font-semibold text-sm transition-all duration-300 text-center"
        >
          Volver al Registro
        </NuxtLink>
      </div>

      <p class="text-center text-gray-600 text-xs mt-8 pb-4">
        Moments · Bogotá D.C., Colombia · privacidad@moments.com.co<br/>
        Esta Política constituye un acuerdo legalmente vinculante. Versión 2.0 — 6 de septiembre de 2026.
      </p>

    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

useSeoMeta({
  title: 'Política de Privacidad — Moments',
  description: 'Política de privacidad completa de Moments. Conoce cómo tratamos tus datos, tu política de reembolsos y la exención de responsabilidad sobre contenido de fotógrafos. Conforme a la ley colombiana.'
})
</script>
