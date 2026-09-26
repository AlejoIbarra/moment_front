<template>
  <div class="min-h-screen bg-[#0d0f15] text-gray-300 font-sans selection:bg-[#3ef4a1] selection:text-black">
    <!-- Header -->
    <header class="border-b border-white/10 bg-[#0d0f15]/80 backdrop-blur-xl sticky top-0 z-50">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <span class="text-2xl font-black tracking-tighter italic text-[#3ef4a1] group-hover:scale-105 transition-transform">Moments</span>
        </NuxtLink>
        <div class="flex items-center gap-4 text-xs font-bold">
          <NuxtLink to="/terms-user" class="text-gray-400 hover:text-white transition-colors">Términos</NuxtLink>
          <NuxtLink to="/privacy" class="text-gray-400 hover:text-white transition-colors">Privacidad</NuxtLink>
          <NuxtLink to="/cookies" class="text-gray-400 hover:text-white transition-colors">Cookies</NuxtLink>
          <NuxtLink to="/login" class="px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all">Iniciar sesión</NuxtLink>
        </div>
      </div>
    </header>

    <main class="max-w-4xl mx-auto px-4 sm:px-6 py-12 md:py-16">
      <!-- Title & Hero -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-4">
          <Icon name="lucide:shield-check" class="w-4 h-4" />
          Conforme a la Ley 1480 de 2011 (Estatuto del Consumidor de Colombia)
        </div>
        <h1 class="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          Política de Reembolsos y Retracto
        </h1>
        <p class="text-gray-400 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          Moments opera como una plataforma tecnológica que facilita la comercialización y descarga instantánea de contenido fotográfico digital. Conoce las condiciones legales aplicables a compras y descargas.
        </p>
        <p class="text-xs text-gray-500 mt-2">Última actualización: 25 de Septiembre de 2026</p>
      </div>

      <!-- Legal Notice Card -->
      <div class="p-6 md:p-8 rounded-2xl bg-amber-500/[0.04] border border-amber-500/20 mb-10">
        <div class="flex items-start gap-4">
          <div class="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Icon name="lucide:alert-triangle" class="w-5 h-5" />
          </div>
          <div class="flex-1 text-sm leading-relaxed">
            <h3 class="font-extrabold text-white text-base mb-2">Aviso Legal Importante sobre Bienes Digitales</h3>
            <p class="text-gray-300">
              De conformidad con el <strong>Artículo 47 (Parágrafo 1, Numerales 1 y 4) de la Ley 1480 de 2011</strong> de la República de Colombia, se exceptúan del derecho de retracto los contratos de suministro de bienes que, por su naturaleza, no puedan ser devueltos, y contratos de servicios cuya prestación haya comenzado con el acuerdo del consumidor. 
              Al adquirir y acceder a un archivo fotográfico digital de alta resolución sin marca de agua, <strong>el servicio se entiende prestado en su totalidad y el bien entregado irrevocablemente</strong>, imposibilitando su devolución física o cancelación post-descarga.
            </p>
          </div>
        </div>
      </div>

      <!-- Section Blocks -->
      <div class="space-y-8 text-sm">
        
        <!-- 1. Naturaleza del Contenido -->
        <section class="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
          <h2 class="text-xl font-black text-white flex items-center gap-3">
            <span class="w-7 h-7 rounded-lg bg-[#3ef4a1]/20 text-[#3ef4a1] flex items-center justify-center text-xs font-black">1</span>
            Naturaleza de los Bienes Adquiridos
          </h2>
          <p class="text-gray-300 leading-relaxed">
            Las fotografías y paquetes comercializados en Moments son <strong>archivos intangibles de transmisión digital inmediata</strong>. Los usuarios cuentan con la facultad de previsualizar las fotografías con marca de agua protectora antes de efectuar cualquier pago, garantizando su pleno consentimiento e inspección del encuadre, iluminación y contenido antes de perfeccionar la compra.
          </p>
        </section>

        <!-- 2. Reglas del Derecho de Retracto -->
        <section class="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
          <h2 class="text-xl font-black text-white flex items-center gap-3">
            <span class="w-7 h-7 rounded-lg bg-[#3ef4a1]/20 text-[#3ef4a1] flex items-center justify-center text-xs font-black">2</span>
            Derecho de Retracto (Ley 1480 de 2011, Art. 47)
          </h2>
          <p class="text-gray-300 leading-relaxed">
            El derecho de retracto permite la rescisión de compras efectuadas mediante comercio electrónico dentro del término de <strong>cinco (5) días hábiles</strong> siguientes a la transacción, <em>siempre y cuando concurran las siguientes condiciones de orden legal</em>:
          </p>
          <div class="grid md:grid-cols-2 gap-4 pt-2">
            <div class="p-5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 space-y-2">
              <p class="font-bold text-emerald-400 flex items-center gap-2">
                <Icon name="lucide:check-circle-2" class="w-4 h-4" />
                Casos en los que procede reembolso:
              </p>
              <ul class="text-xs text-gray-300 space-y-2 pl-2">
                <li>• <strong>Retracto oportuno sin descarga:</strong> La compra fue realizada dentro de los últimos 5 días hábiles y el usuario <strong>NO ha descargado ni abierto el archivo original en alta resolución</strong> (comprobado mediante auditoría de registros del servidor).</li>
                <li>• <strong>Defecto técnico insubsanable:</strong> El archivo suministrado se encuentra dañado o corrupto y el equipo técnico no puede proporcionar una copia íntegra en un plazo de 3 días hábiles.</li>
                <li>• <strong>Doble cobro comprobado:</strong> Error de la pasarela bancaria que haya generado cobros duplicados por una misma orden.</li>
              </ul>
            </div>

            <div class="p-5 rounded-xl bg-rose-500/5 border border-rose-500/20 space-y-2">
              <p class="font-bold text-rose-400 flex items-center gap-2">
                <Icon name="lucide:x-circle" class="w-4 h-4" />
                Casos en los que NO procede reembolso:
              </p>
              <ul class="text-xs text-gray-300 space-y-2 pl-2">
                <li>• <strong>Descarga ya realizada:</strong> Tan pronto el usuario hace clic en "Descargar" o accede al archivo en alta resolución sin marca de agua, opera la excepción legal del Art. 47 num. 1 y 4 del Estatuto del Consumidor.</li>
                <li>• <strong>Criterios subjetivos:</strong> Descontento personal respecto a la apariencia, postura o expresión del fotografiado, dado que las miniaturas fueron visualizadas antes de la compra.</li>
                <li>• <strong>Transcurso del término:</strong> Solicitudes presentadas después de cinco (5) días hábiles desde la fecha de compra.</li>
                <li>• <strong>Tarjetas de Regalo (Gift Cards):</strong> Códigos que ya hayan sido redimidos o lotes activados y entregados.</li>
              </ul>
            </div>
          </div>
        </section>

        <!-- 3. Paquetes y Saldo en Billetera -->
        <section class="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
          <h2 class="text-xl font-black text-white flex items-center gap-3">
            <span class="w-7 h-7 rounded-lg bg-[#3ef4a1]/20 text-[#3ef4a1] flex items-center justify-center text-xs font-black">3</span>
            Paquetes de Fotos y Saldo en Billetera
          </h2>
          <p class="text-gray-300 leading-relaxed">
            • <strong>Paquetes de Fotos:</strong> Si un usuario adquiere un paquete de fotos y descarga al menos una (1) foto del paquete, el paquete se considera iniciado y en uso, perdiéndose el derecho de retracto sobre la totalidad del mismo.<br />
            • <strong>Recargas de Billetera (Wallet):</strong> El saldo recargado voluntariamente podrá ser utilizado para compras en la plataforma. Las solicitudes de reversión de saldos no consumidos están sujetas a validación de identidad para prevención de fraudes y lavado de activos (SARLAFT/SAGRILAFT).
          </p>
        </section>

        <!-- 4. Procedimiento de Solicitud -->
        <section class="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4">
          <h2 class="text-xl font-black text-white flex items-center gap-3">
            <span class="w-7 h-7 rounded-lg bg-[#3ef4a1]/20 text-[#3ef4a1] flex items-center justify-center text-xs font-black">4</span>
            Procedimiento Formal para PQR y Reembolsos
          </h2>
          <p class="text-gray-300 leading-relaxed">
            Para presentar una solicitud formal de reembolso amparada en los casos permitidos:
          </p>
          <div class="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3">
            <ol class="space-y-2 text-xs md:text-sm text-gray-300 list-decimal list-inside">
              <li>Envía un correo electrónico a <strong class="text-[#3ef4a1]">reembolsos@moments-gallery.com</strong> o <strong class="text-white">soporte@moments-gallery.com</strong>.</li>
              <li>Indica en el asunto: <em>"Solicitud de Reembolso — [Referencia de Pago o Wompi ID]"</em>.</li>
              <li>Adjunta: Nombre completo, cédula de ciudadanía, comprobante de pago bancario y descripción clara del motivo.</li>
              <li>Moments responderá formalmente dentro de los <strong>quince (15) días hábiles</strong> siguientes a la radicación completa (Art. 58 Ley 1480 de 2011).</li>
              <li>En caso de ser aprobada, la devolución se tramitará mediante reversión a través de la pasarela de pagos Wompi hacia el mismo medio de origen en un plazo de 5 a 15 días hábiles, sujeto a los tiempos de la entidad bancaria del usuario.</li>
            </ol>
          </div>
        </section>

        <!-- 5. Autoridad de Protección al Consumidor -->
        <section class="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3">
          <h2 class="text-xl font-black text-white flex items-center gap-3">
            <span class="w-7 h-7 rounded-lg bg-[#3ef4a1]/20 text-[#3ef4a1] flex items-center justify-center text-xs font-black">5</span>
            Superintendencia de Industria y Comercio (SIC)
          </h2>
          <p class="text-gray-400 text-xs leading-relaxed">
            En cumplimiento del Estatuto del Consumidor, le informamos que la entidad competente para la vigilancia y protección de los derechos de los consumidores en Colombia es la <strong>Superintendencia de Industria y Comercio (SIC)</strong> (www.sic.gov.co, Carrera 13 No. 27 - 00, Bogotá D.C.).
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
          <NuxtLink to="/cookies" class="hover:text-white transition-colors">Política de Cookies</NuxtLink>
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
  title: 'Política de Reembolsos y Retracto — Moments',
  meta: [
    { name: 'description', content: 'Política de reembolsos y excepciones al derecho de retracto para contenido fotográfico digital conforme a la Ley 1480 de 2011 de Colombia.' }
  ]
})
</script>
