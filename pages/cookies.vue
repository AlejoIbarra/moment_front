<template>
  <div class="min-h-screen bg-[#fafafa] pb-20">
    <!-- Clean Standalone Header -->
    <header class="bg-white border-b border-[#dbdbdb] py-6 mb-12">
      <div class="max-w-3xl mx-auto px-4 flex justify-between items-center">
        <NuxtLink to="/" class="text-2xl font-black tracking-tighter italic bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600 bg-clip-text text-transparent">Moments</NuxtLink>
        <NuxtLink to="/login" class="text-sm font-bold text-gray-900 hover:text-indigo-600 transition-colors">Iniciar sesión</NuxtLink>
      </div>
    </header>

    <div class="max-w-3xl mx-auto px-4 space-y-8">
      <div class="text-center mb-12">
        <h1 class="text-3xl font-black text-gray-900 mb-4">Política de Cookies</h1>
        <p class="text-gray-500">Última actualización: 14 de Mayo, 2026</p>
      </div>

      <div class="bg-white border border-[#dbdbdb] rounded-2xl p-8 md:p-12 prose prose-indigo max-w-none shadow-sm">
        <section class="mb-10">
          <h2 class="text-xl font-bold text-gray-900 mb-4">1. ¿Qué son las Cookies?</h2>
          <p class="text-gray-600 leading-relaxed">
            Las cookies son pequeños archivos de texto que se almacenan en su navegador o dispositivo cuando visita nuestra plataforma. Nos ayudan a reconocerlo y a recordar sus preferencias.
          </p>
        </section>

        <section class="mb-10">
          <h2 class="text-xl font-bold text-gray-900 mb-4">2. ¿Cómo las utilizamos?</h2>
          <p class="text-gray-600 leading-relaxed">
            Utilizamos cookies para las siguientes finalidades:
          </p>
          <ul class="list-disc pl-5 text-gray-600 space-y-2 mt-2">
            <li><strong>Esenciales:</strong> Para que pueda iniciar sesión y mantener su sesión segura.</li>
            <li><strong>Preferencias:</strong> Para recordar su idioma o configuraciones personalizadas.</li>
            <li><strong>Análisis:</strong> Para entender cómo se utiliza la plataforma y poder mejorarla.</li>
          </ul>
        </section>

        <section class="mb-10">
          <h2 class="text-xl font-bold text-gray-900 mb-4">3. Cookies de Terceros</h2>
          <p class="text-gray-600 leading-relaxed">
            En algunos casos, utilizamos servicios de terceros (como procesadores de pagos) que pueden instalar sus propias cookies para el funcionamiento de sus servicios integrados en nuestra plataforma.
          </p>
        </section>

        <section class="mb-10">
          <h2 class="text-xl font-bold text-gray-900 mb-4">4. Control de Cookies</h2>
          <p class="text-gray-600 leading-relaxed">
            Usted puede controlar o eliminar las cookies a través de la configuración de su navegador. Tenga en cuenta que si desactiva las cookies esenciales, algunas funciones de la plataforma podrían no funcionar correctamente.
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
