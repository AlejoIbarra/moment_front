<template>
  <div id="indice" class="min-h-screen bg-[#070709] text-white pt-10 pb-20 px-4">
    <div class="max-w-4xl mx-auto">
      <!-- Top Bar -->
      <div class="flex flex-wrap items-center justify-between gap-4 mb-8">
        <NuxtLink
          to="/"
          class="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-[#3ef4a1] transition-colors"
        >
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          Volver al inicio
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
      <header class="mb-8">
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#3ef4a1]/10 border border-[#3ef4a1]/25 text-[#3ef4a1] text-[11px] font-extrabold uppercase tracking-wider mb-4">
          <Icon name="lucide:shield-check" class="w-3.5 h-3.5" />
          Documentos Legales · {{ profile.flag }} {{ profile.name }}
        </span>
        <h1 class="text-3xl sm:text-5xl font-black tracking-tight mb-3">
          Documentos legales de Moments
        </h1>
        <p class="text-sm sm:text-base text-gray-400 leading-relaxed max-w-3xl mb-3">
          Aquí encuentras completos los documentos que rigen el uso de <strong class="text-white">Moments</strong> (<span class="text-[#3ef4a1]">www.moments-gallery.com</span>), adaptados a la normativa vigente en <strong class="text-white">{{ profile.name }}</strong>.
        </p>
        <p class="text-xs text-gray-500">
          Versión 2.0 · Actualización del 20 de noviembre de 2026: se incorporan el canal oficial de PQR con radicado y seguimiento, autorización biométrica por país y retiro preventivo inmediato de imágenes.
        </p>

        <!-- Quick Anchor Pills -->
        <nav class="flex flex-wrap gap-2 mt-6">
          <a href="#terminos" class="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-200 transition-colors">
            Términos y Condiciones ↓
          </a>
          <a href="#datos" class="px-3.5 py-2 rounded-xl bg-[#3ef4a1] text-black font-extrabold text-xs hover:bg-[#2dd68a] transition-colors">
            Política de Datos Personales ↓
          </a>
          <a href="#aviso" class="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-200 transition-colors">
            Aviso de Privacidad ↓
          </a>
          <a href="#imagen" class="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-gray-200 transition-colors">
            Autorización de Uso de Imagen ↓
          </a>
          <NuxtLink to="/pqr" class="px-3.5 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-[#3ef4a1]/30 text-xs font-extrabold text-[#3ef4a1] transition-colors">
            Canal PQR / Radicados
          </NuxtLink>
        </nav>
      </header>

      <!-- Quick Exercise Rights Banner -->
      <section class="p-5 sm:p-6 rounded-2xl bg-emerald-950/20 border border-[#3ef4a1]/25 mb-10 space-y-4">
        <div>
          <h2 class="text-sm font-extrabold text-white mb-1">¿Necesitas ejercer tus derechos sobre tus datos o solicitar retiro de una foto?</h2>
          <p class="text-xs text-gray-300 leading-relaxed">
            Escríbenos a <a href="mailto:contacto@moments-gallery.com" class="text-[#3ef4a1] underline font-semibold">contacto@moments-gallery.com</a> / <a href="mailto:alejandroibarrab0532@gmail.com" class="text-[#3ef4a1] underline font-semibold">alejandroibarrab0532@gmail.com</a> o radica tu solicitud en <NuxtLink to="/pqr" class="text-[#3ef4a1] underline font-semibold">/pqr</NuxtLink>.
            {{ profile.responseSla }} ({{ profile.dataLaw }}).
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-white/10 text-xs">
          <div>
            <p class="text-gray-400 uppercase font-bold tracking-wider text-[10px] mb-1">Normativa de Datos Aplicable</p>
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
            <p class="text-gray-400 uppercase font-bold tracking-wider text-[10px] mb-1">Canales Directos</p>
            <p class="text-gray-200">WhatsApp <a href="https://wa.me/573245124346" target="_blank" rel="noopener" class="text-[#3ef4a1] underline">+57 324 512 4346</a> · <NuxtLink to="/pqr" class="text-[#3ef4a1] underline">Formulario PQR</NuxtLink></p>
          </div>
        </div>
      </section>

      <div class="space-y-10">
        <!-- ══════════════════════════════════════════════════════ -->
        <!-- DOCUMENTO 1: TÉRMINOS Y CONDICIONES                    -->
        <!-- ══════════════════════════════════════════════════════ -->
        <section id="terminos" class="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-5">
          <div>
            <span class="text-[11px] font-extrabold uppercase tracking-wider text-[#3ef4a1]">Documento 01 · #terminos</span>
            <h2 class="text-2xl sm:text-3xl font-black mt-1">Términos y Condiciones de Moments — {{ profile.flag }} {{ profile.name }}</h2>
            <p class="text-xs text-gray-400 mt-1">Versión 2.0 — Vigente desde el 20 de noviembre de 2026</p>
          </div>

          <div class="space-y-4 text-sm text-gray-300 leading-relaxed">
            <div>
              <h3 class="text-base font-extrabold text-white mb-1">1. Identificación y objeto</h3>
              <p>
                <strong class="text-white">Moments</strong> (en adelante, la "Plataforma"), disponible en <span class="text-[#3ef4a1]">https://www.moments-gallery.com</span>, correo electrónico <a href="mailto:contacto@moments-gallery.com" class="text-[#3ef4a1] underline">contacto@moments-gallery.com</a> / <a href="mailto:alejandroibarrab0532@gmail.com" class="text-[#3ef4a1] underline">alejandroibarrab0532@gmail.com</a> y WhatsApp oficial <strong class="text-white">+57 324 512 4346</strong>, conecta a fotógrafos independientes y organizadores de eventos con asistentes y deportistas para localizar, mediante número de dorsal o reconocimiento facial voluntario, las fotografías de eventos en las que aparecen y adquirir licencias digitales de uso personal.
              </p>
            </div>

            <div>
              <h3 class="text-base font-extrabold text-white mb-1">2. Definiciones</h3>
              <ul class="list-disc pl-5 space-y-1.5">
                <li><strong class="text-white">Moments:</strong> plataforma tecnológica que aloja álbumes fotográficos, facilita la búsqueda por IA y procesa la entrega digital.</li>
                <li><strong class="text-white">Cliente:</strong> persona natural que explora, localiza y adquiere fotografías o pases de preventa para uso personal.</li>
                <li><strong class="text-white">Fotógrafo Independiente:</strong> profesional o creador que sube fotografías bajo su cuenta y fija sus precios, conservando la titularidad de sus obras.</li>
                <li><strong class="text-white">Colaborador / Organizador:</strong> fotógrafo invitado o entidad organizadora autorizada dentro de un álbum.</li>
                <li><strong class="text-white">Preventa y Código de Preventa (<code>PRE-XXXXXX</code>):</strong> compra anticipada de un paquete de fotografías de un evento antes de que estén cargadas o mientras se completan. Genera un código exclusivo para ese evento.</li>
                <li><strong class="text-white">Tarjeta / Pase de Cortesía y Código de Descuento:</strong> códigos digitales válidos para canjear fotos o aplicar descuentos según las condiciones informadas.</li>
              </ul>
            </div>

            <div>
              <h3 class="text-base font-extrabold text-white mb-1">3. Registro y cuentas</h3>
              <p>
                Los Clientes pueden explorar álbumes públicos y buscar sus fotos sin crear cuenta o iniciando sesión para guardar su carrito, billetera, historial de descargas y pases de preventa. Los Fotógrafos y Colaboradores acceden mediante cuentas verificadas y son responsables de la confidencialidad de sus credenciales y de la licitud de las imágenes que suben.
              </p>
            </div>

            <div>
              <h3 class="text-base font-extrabold text-white mb-1">4. Funcionamiento del servicio</h3>
              <p>
                El Cliente accede al álbum mediante enlace directo, código QR o buscador del Marketplace. Puede localizar sus fotos por <strong class="text-white">número de dorsal (OCR)</strong>, revisando la galería o mediante <strong class="text-white">búsqueda facial voluntaria (selfie)</strong> previa aceptación expresa e independiente. En los eventos en que el fotógrafo active el <strong class="text-white">Modo Galería Privada por Rostro</strong>, nadie podrá explorar el álbum general ni ver fotos de terceros: únicamente se mostrarán las fotografías en las que aparezca el rostro verificado (y si no aparece en ninguna, el evento permanecerá oculto). Las vistas previas muestran marca de agua; tras el pago se habilita la descarga digital en alta resolución sin marca de agua (no hay envío físico).
              </p>
            </div>

            <div>
              <h3 class="text-base font-extrabold text-white mb-1">5. Precios, pagos, preventa y conservación</h3>
              <ul class="list-disc pl-5 space-y-1.5">
                <li>Los precios se muestran antes de pagar en la moneda configurada para el evento (<strong class="text-white">COP, MXN, ARS, CLP, PEN o USD</strong>).</li>
                <li>Los pagos pueden realizarse mediante <strong class="text-white">Billetera Moments</strong> o la pasarela habilitada (<strong class="text-white">Mercado Pago</strong>). Moments no almacena números completos de tarjeta.</li>
                <li><strong class="text-white">Preventa:</strong> al comprar una preventa se genera el código <code>PRE-XXXXXX</code> utilizable únicamente en ese evento hasta agotar el cupo de fotos contratado. Si el evento se cancela o el fotógrafo no publica fotografías dentro de un plazo razonable, el Cliente puede solicitar la devolución íntegra escribiendo a <NuxtLink to="/pqr" class="text-[#3ef4a1] underline">/pqr</NuxtLink> o a nuestro correo de soporte.</li>
                <li>Las fotografías compradas quedan disponibles en la cuenta del Cliente mientras el evento permanezca activo; se recomienda descargar y respaldar los archivos inmediatamente después de la compra.</li>
              </ul>
            </div>

            <div>
              <h3 class="text-base font-extrabold text-white mb-1">6. Propiedad intelectual y licencia al Cliente</h3>
              <p>
                Los Fotógrafos conservan los derechos morales y patrimoniales sobre sus fotografías. Al comprar una fotografía en Moments, el Cliente recibe únicamente una <strong class="text-white">licencia personal, no exclusiva y no comercial</strong> (recuerdo familiar, impresión personal o publicación en redes sociales personales). Queda prohibido revender, explotar comercialmente, eliminar marcas de agua de fotos no compradas o utilizar imágenes de terceros con fines comerciales, políticos o de entrenamiento de IA.
              </p>
            </div>

            <div>
              <h3 class="text-base font-extrabold text-white mb-1">7. Retracto, reembolsos y reversión del pago</h3>
              <p>
                Conforme a <strong class="text-white">{{ profile.consumerLaw }}</strong>, las fotografías digitales personalizadas en las que aparece el Cliente y que se descargan de forma inmediata no admiten retracto una vez entregadas sin marca de agua, salvo falla técnica atribuible a la plataforma, fraude o cargo no autorizado. En <strong class="text-white">preventas no redimidas</strong>, el Cliente podrá solicitar retracto o devolución dentro de los 5 días hábiles siguientes al pago (o el plazo legal aplicable en {{ profile.name }}) mientras no haya utilizado el código.
              </p>
            </div>

            <div>
              <h3 class="text-base font-extrabold text-white mb-1">8. Alcance de responsabilidad y retiro de contenido</h3>
              <p>
                La búsqueda por selfie o dorsal es una herramienta de coincidencia asistida por IA y no garantiza detectar el 100% de las tomas (por ángulos, iluminación, gafas o movimiento). Cada Fotógrafo declara contar con las autorizaciones necesarias para publicar sus obras. Si apareces en una fotografía sin tu consentimiento o aparece un menor de edad, puedes usar el botón <strong class="text-white">"Retirar mi foto"</strong> dentro del álbum para ocultarla preventivamente al instante.
              </p>
            </div>

            <div class="pt-2">
              <a href="#indice" class="text-xs font-bold text-[#3ef4a1] hover:underline">↑ Volver al índice</a>
            </div>
          </div>
        </section>

        <!-- ══════════════════════════════════════════════════════ -->
        <!-- DOCUMENTO 2: POLÍTICA DE TRATAMIENTO DE DATOS          -->
        <!-- ══════════════════════════════════════════════════════ -->
        <section id="datos" class="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-5">
          <div>
            <span class="text-[11px] font-extrabold uppercase tracking-wider text-[#3ef4a1]">Documento 02 · #datos</span>
            <h2 class="text-2xl sm:text-3xl font-black mt-1">Política de Tratamiento de Datos Personales — {{ profile.flag }} {{ profile.name }}</h2>
            <p class="text-xs text-gray-400 mt-1">Versión 2.0 — Vigente desde el 20 de noviembre de 2026</p>
          </div>

          <div class="space-y-4 text-sm text-gray-300 leading-relaxed">
            <div>
              <h3 class="text-base font-extrabold text-white mb-1">1. Identificación del Responsable del Tratamiento</h3>
              <p>
                <strong class="text-white">Moments</strong> (<span class="text-[#3ef4a1]">https://www.moments-gallery.com</span>) actúa como responsable del tratamiento de los datos personales recolectados directamente en la Plataforma, bajo la normativa aplicable en <strong class="text-white">{{ profile.name }}</strong>: <strong class="text-white">{{ profile.dataLaw }}</strong>.
              </p>
              <ul class="list-disc pl-5 mt-2 space-y-1 text-xs text-gray-300">
                <li>Correo y canal PQR: <a href="mailto:contacto@moments-gallery.com" class="text-[#3ef4a1] underline">contacto@moments-gallery.com</a> / <a href="mailto:alejandroibarrab0532@gmail.com" class="text-[#3ef4a1] underline">alejandroibarrab0532@gmail.com</a></li>
                <li>WhatsApp oficial: +57 324 512 4346 · Radicación con seguimiento: <NuxtLink to="/pqr" class="text-[#3ef4a1] underline">moments-gallery.com/pqr</NuxtLink></li>
              </ul>
            </div>

            <div>
              <h3 class="text-base font-extrabold text-white mb-1">2. Finalidades del tratamiento</h3>
              <ul class="list-disc pl-5 space-y-1.5">
                <li><strong class="text-white">Clientes y asistentes:</strong> gestionar el acceso a álbumes, localizar fotografías por dorsal o selfie (previa autorización expresa), procesar pagos, billetera y descargas HD, validar códigos de preventa (<code>PRE-XXXXXX</code>) y tarjetas de regalo, y atender peticiones, quejas y reclamos con número de radicado.</li>
                <li><strong class="text-white">Fotógrafos y colaboradores:</strong> verificar identidad, administrar planes (Gratis, Básico, Premium), liquidar ganancias y comisiones, y cumplir obligaciones legales y tributarias.</li>
                <li><strong class="text-white">Seguridad y auditoría:</strong> prevenir fraudes, proteger obras contra descargas no autorizadas y conservar evidencia de consentimientos otorgados.</li>
              </ul>
            </div>

            <div>
              <h3 class="text-base font-extrabold text-white mb-1">3. Tratamiento de datos sensibles (biométricos)</h3>
              <ul class="list-disc pl-5 space-y-1.5">
                <li><strong class="text-white">Autorización explícita y separada:</strong> nunca ejecutamos búsqueda facial sin autorización previa, libre, expresa e informada mediante dos casillas independientes antes de abrir la cámara o subir una selfie.</li>
                <li><strong class="text-white">Finalidad única:</strong> comparar tu selfie exclusivamente contra las fotografías del evento seleccionado para mostrarte en cuáles apareces.</li>
                <li><strong class="text-white">Eliminación inmediata de la selfie:</strong> la selfie enviada se procesa en memoria y se elimina inmediatamente al terminar la búsqueda; no se almacena en nuestros servidores.</li>
                <li><strong class="text-white">Retención máxima de 1 año (365 días) en eventos:</strong> los vectores faciales (<code>face_encodings</code>) extraídos de las fotografías de un evento se eliminan automáticamente al cumplirse un (1) año desde la fecha del evento.</li>
                <li><strong class="text-white">Segregación por evento y no entrenamiento de IA:</strong> no realizamos búsquedas cruzadas entre eventos distintos y jamás utilizamos rostros ni selfies para entrenar sistemas de inteligencia artificial.</li>
              </ul>
            </div>

            <div>
              <h3 class="text-base font-extrabold text-white mb-1">4. Tratamiento de datos de menores de edad</h3>
              <p>
                {{ profile.minorsRule }} Además, Moments prohíbe usar fotografías de menores con fines publicitarios sin autorización expresa de su representante legal y ofrece retiro preventivo inmediato desde el botón <strong class="text-white">"Retirar mi foto"</strong> (causal prioritaria de menor sin autorización).
              </p>
            </div>

            <div>
              <h3 class="text-base font-extrabold text-white mb-1">5. Derechos de los Titulares y procedimiento PQR</h3>
              <p>
                En <strong class="text-white">{{ profile.name }}</strong> tienes derecho a: <strong class="text-white">{{ profile.rightsSummary }}</strong>.
                Puedes ejercerlos en <NuxtLink to="/pqr" class="text-[#3ef4a1] underline font-semibold">/pqr</NuxtLink> (donde obtienes un radicado con fecha y hora para consultar tu estado) o escribiendo a <a href="mailto:contacto@moments-gallery.com" class="text-[#3ef4a1] underline">contacto@moments-gallery.com</a>. {{ profile.responseSla }} Autoridad competente: <strong class="text-white">{{ profile.authority }}</strong>.
              </p>
            </div>

            <div>
              <h3 class="text-base font-extrabold text-white mb-1">6. Seguridad, proveedores y pasarelas de pago</h3>
              <p>
                Aplicamos cifrado HTTPS/TLS en tránsito, buckets privados con URLs firmadas para archivos originales en Cloudflare R2, segregación de registros biométricos por evento, y pasarelas certificadas (<strong class="text-white">Mercado Pago</strong>) que tratan directamente los datos de tarjetas conforme a sus propias políticas de privacidad. Conservamos los registros de autorización biométrica (fecha, hora, país, versión del texto, IP y User-Agent) como prueba de cumplimiento legal.
              </p>
            </div>

            <div>
              <h3 class="text-base font-extrabold text-white mb-1">7. Cookies y almacenamiento local</h3>
              <p>
                Moments utiliza almacenamiento técnico necesario para mantener tu sesión, tu carrito de compras, la confirmación de autorización biométrica durante la sesión del evento (12 horas) y la seguridad de la plataforma. Consulta más detalles en <NuxtLink to="/cookies" class="text-[#3ef4a1] underline">Política de Cookies</NuxtLink> y <NuxtLink to="/data-deletion" class="text-[#3ef4a1] underline">Eliminación de Datos</NuxtLink>.
              </p>
            </div>

            <div class="pt-2">
              <a href="#indice" class="text-xs font-bold text-[#3ef4a1] hover:underline">↑ Volver al índice</a>
            </div>
          </div>
        </section>

        <!-- ══════════════════════════════════════════════════════ -->
        <!-- DOCUMENTO 3: AVISO DE PRIVACIDAD                       -->
        <!-- ══════════════════════════════════════════════════════ -->
        <section id="aviso" class="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-4">
          <div>
            <span class="text-[11px] font-extrabold uppercase tracking-wider text-[#3ef4a1]">Documento 03 · #aviso</span>
            <h2 class="text-2xl sm:text-3xl font-black mt-1">Aviso de Privacidad — {{ profile.flag }} {{ profile.name }}</h2>
          </div>
          <div class="space-y-3 text-sm text-gray-300 leading-relaxed">
            <p>
              <strong class="text-white">Moments</strong> (<span class="text-[#3ef4a1]">www.moments-gallery.com</span>) es responsable del tratamiento de los datos personales que suministres conforme a <strong class="text-white">{{ profile.dataLaw }}</strong>.
            </p>
            <ul class="list-disc pl-5 space-y-1.5">
              <li><strong class="text-white">Finalidades:</strong> localizar tus fotografías en eventos (por dorsal o selfie voluntaria), procesar compras, preventas (<code>PRE-XXXXXX</code>) y descargas HD, y atender tus PQR con radicado.</li>
              <li><strong class="text-white">Datos sensibles:</strong> tu selfie es opcional y se borra apenas termina la búsqueda. Los datos faciales de las fotos del evento se eliminan al año (365 días) del evento y nunca se usan para entrenar IA.</li>
              <li><strong class="text-white">Menores:</strong> requiere autorización de padre, madre o acudiente.</li>
              <li><strong class="text-white">Tus derechos y contacto:</strong> {{ profile.rightsSummary }} Escríbenos a <a href="mailto:contacto@moments-gallery.com" class="text-[#3ef4a1] underline">contacto@moments-gallery.com</a> o radica en <NuxtLink to="/pqr" class="text-[#3ef4a1] underline">/pqr</NuxtLink>.</li>
            </ul>
            <div class="pt-2">
              <a href="#indice" class="text-xs font-bold text-[#3ef4a1] hover:underline">↑ Volver al índice</a>
            </div>
          </div>
        </section>

        <!-- ══════════════════════════════════════════════════════ -->
        <!-- DOCUMENTO 4: AUTORIZACIÓN DE USO DE IMAGEN Y BIOMETRÍA -->
        <!-- ══════════════════════════════════════════════════════ -->
        <section id="imagen" class="scroll-mt-24 p-6 sm:p-8 rounded-3xl bg-white/[0.03] border border-white/10 space-y-5">
          <div id="autorizacion">
            <span class="text-[11px] font-extrabold uppercase tracking-wider text-[#3ef4a1]">Documento 04 · #imagen</span>
            <h2 class="text-2xl sm:text-3xl font-black mt-1">Autorización de Uso de Imagen y Tratamiento de Datos Biométricos</h2>
            <p class="text-xs text-gray-400 mt-1">Versión vigente: {{ BIOMETRIC_CONSENT_VERSION }} · Aplicable en {{ profile.flag }} {{ profile.name }}</p>
          </div>

          <div class="space-y-4">
            <div v-for="sec in biometricSections" :key="sec.title" class="p-4 rounded-2xl bg-black/40 border border-white/5">
              <h3 class="text-xs font-extrabold uppercase tracking-wider text-[#3ef4a1] mb-1">{{ sec.title }}</h3>
              <p class="text-sm text-gray-300 leading-relaxed">{{ sec.body }}</p>
            </div>
            <div class="p-4 rounded-2xl bg-black/40 border border-white/5">
              <h3 class="text-xs font-extrabold uppercase tracking-wider text-[#3ef4a1] mb-1">Menores de edad en {{ profile.name }}</h3>
              <p class="text-sm text-gray-300 leading-relaxed">{{ profile.minorsRule }}</p>
            </div>
            <div class="p-4 rounded-2xl bg-black/40 border border-white/5">
              <h3 class="text-xs font-extrabold uppercase tracking-wider text-[#3ef4a1] mb-1">Usos que nunca están autorizados</h3>
              <p class="text-sm text-gray-300 leading-relaxed">
                Nunca autorizas el uso de tu imagen con fines políticos, electorales, difamatorios, publicitarios sin permiso separado, entrenamiento de modelos de IA ni creación de bases biométricas fuera del evento consultado. Si apareces con más personas, tu autorización no se extiende a ellas.
              </p>
            </div>
          </div>

          <div class="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
            <a href="#indice" class="font-bold text-[#3ef4a1] hover:underline">↑ Volver al índice</a>
            <div class="flex flex-wrap gap-3">
              <NuxtLink to="/terms-user" class="text-gray-400 hover:text-white underline">Términos Usuario</NuxtLink>
              <NuxtLink to="/terms-photographer" class="text-gray-400 hover:text-white underline">Términos Fotógrafo</NuxtLink>
              <NuxtLink to="/privacy" class="text-gray-400 hover:text-white underline">Política Extendida</NuxtLink>
              <NuxtLink to="/refunds" class="text-gray-400 hover:text-white underline">Reembolsos</NuxtLink>
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
  title: 'Documentos Legales, Política de Datos y Biometría | Moments',
  description: 'Términos y Condiciones, Política de Tratamiento de Datos Personales, Aviso de Privacidad y Autorización de Uso de Imagen de Moments adaptados por país.'
})
</script>
