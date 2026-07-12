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
        <h1 class="text-3xl font-black text-gray-900 mb-4">Condiciones de Servicio</h1>
        <p class="text-gray-500">Última actualización: 14 de Mayo, 2026</p>
      </div>

      <div class="bg-white border border-[#dbdbdb] rounded-2xl p-8 md:p-12 prose prose-indigo max-w-none shadow-sm">
        <section class="mb-10">
          <h2 class="text-xl font-bold text-gray-900 mb-4">1. Aceptación de los Términos</h2>
          <p class="text-gray-600 leading-relaxed">
            Al acceder y utilizar Moments (en adelante, "la Plataforma"), usted acepta estar sujeto a estos Términos y Condiciones de Servicio. Si no está de acuerdo con alguna parte de estos términos, no podrá utilizar nuestros servicios.
          </p>
        </section>

        <section class="mb-10">
          <h2 class="text-xl font-bold text-gray-900 mb-4">2. Descripción del Servicio</h2>
          <p class="text-gray-600 leading-relaxed">
            Moments es una plataforma de gestión y venta de fotografías para eventos. Facilitamos la conexión entre fotógrafos y clientes para la visualización y compra de contenido digital.
          </p>
        </section>

        <section class="mb-10">
          <h2 class="text-xl font-bold text-gray-900 mb-4">3. Registro de Cuenta</h2>
          <p class="text-gray-600 leading-relaxed">
            Para utilizar ciertas funciones, debe registrarse y crear una cuenta. Usted es responsable de mantener la confidencialidad de su contraseña y de todas las actividades que ocurran bajo su cuenta.
          </p>
        </section>

        <section class="mb-10">
          <h2 class="text-xl font-bold text-gray-900 mb-4">4. Propiedad Intelectual</h2>
          <p class="text-gray-600 leading-relaxed">
            Los fotógrafos mantienen los derechos de autor de sus imágenes. Al comprar una fotografía, el cliente adquiere una licencia de uso personal, a menos que se especifique lo contrario. Queda prohibida la redistribución o venta no autorizada del contenido.
          </p>
        </section>

        <section class="mb-10">
          <h2 class="text-xl font-bold text-gray-900 mb-4">5. Pagos y Reembolsos</h2>
          <p class="text-gray-600 leading-relaxed">
            Todos los pagos se procesan a través de proveedores externos seguros. Debido a la naturaleza digital de los productos, las ventas son generalmente definitivas una vez que el contenido original ha sido descargado.
          </p>
        </section>

        <section class="mb-10">
          <h2 class="text-xl font-bold text-gray-900 mb-4">6. Limitación de Responsabilidad</h2>
          <p class="text-gray-600 leading-relaxed">
            Moments no se hace responsable de la calidad de las fotografías subidas por terceros ni de las disputas entre fotógrafos y clientes, aunque haremos todo lo posible por mediar y garantizar una buena experiencia.
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
