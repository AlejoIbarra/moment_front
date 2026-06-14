<template>
  <div class="min-h-screen bg-[#fafafa] pb-20">
    <!-- Clean Standalone Header -->
    <header class="bg-white border-b border-[#dbdbdb] py-6 mb-12">
      <div class="max-w-3xl mx-auto px-4 flex justify-between items-center">
        <NuxtLink to="/" class="text-2xl font-black tracking-tighter italic bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent">Moment</NuxtLink>
        <NuxtLink to="/login" class="text-sm font-bold text-gray-900 hover:text-indigo-600 transition-colors">Iniciar sesión</NuxtLink>
      </div>
    </header>

    <div class="max-w-3xl mx-auto px-4 space-y-8">
      <div class="text-center mb-12">
        <h1 class="text-3xl font-black text-gray-900 mb-4">Política de Privacidad</h1>
        <p class="text-gray-500">Última actualización: 14 de Mayo, 2026</p>
      </div>

      <div class="bg-white border border-[#dbdbdb] rounded-2xl p-8 md:p-12 prose prose-indigo max-w-none shadow-sm">
        <section class="mb-10">
          <h2 class="text-xl font-bold text-gray-900 mb-4">1. Información que Recopilamos</h2>
          <p class="text-gray-600 leading-relaxed">
            Recopilamos información personal que usted nos proporciona voluntariamente al registrarse, como su nombre, dirección de correo electrónico, número de teléfono y datos de perfil. También recopilamos datos de uso y transacciones realizadas en la plataforma.
          </p>
        </section>

        <section class="mb-10">
          <h2 class="text-xl font-bold text-gray-900 mb-4">2. Uso de la Información</h2>
          <p class="text-gray-600 leading-relaxed">
            Utilizamos su información para:
          </p>
          <ul class="list-disc pl-5 text-gray-600 space-y-2 mt-2">
            <li>Proporcionar y gestionar su cuenta.</li>
            <li>Procesar sus transacciones y pagos.</li>
            <li>Enviar notificaciones importantes sobre su cuenta o servicios.</li>
            <li>Mejorar nuestra plataforma y experiencia de usuario.</li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-xl font-bold text-gray-900 mb-4">3. Compartir Información</h2>
          <p class="text-gray-600 leading-relaxed">
            No vendemos su información personal a terceros. Compartimos datos solo con proveedores de servicios esenciales (como procesadores de pagos) o cuando la ley lo requiera.
          </p>
        </section>

        <section class="mb-10">
          <h2 class="text-xl font-bold text-gray-900 mb-4">4. Seguridad de los Datos</h2>
          <p class="text-gray-600 leading-relaxed">
            Implementamos medidas de seguridad técnicas y organizativas para proteger su información contra el acceso no autorizado, la alteración o la destrucción.
          </p>
        </section>

        <section class="mb-10">
          <h2 class="text-xl font-bold text-gray-900 mb-4">5. Sus Derechos</h2>
          <p class="text-gray-600 leading-relaxed">
            Usted tiene derecho a acceder, rectificar o eliminar su información personal en cualquier momento a través de la configuración de su perfil o contactándonos directamente.
          </p>
        </section>

        <div class="mt-12 pt-8 border-t border-gray-100 flex justify-center">
            <NuxtLink to="/register" class="ig-btn-primary">Volver al Registro</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})
</script>
