<template>
  <div class="min-h-screen bg-[#fafafa] py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-3xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-[#dbdbdb]">
      <h1 class="text-3xl font-bold text-gray-900 mb-6">Eliminación de Datos</h1>
      
      <div class="prose prose-blue max-w-none text-gray-600">
        <p class="mb-4">
          En <strong>Moments</strong> respetamos tu privacidad y el derecho a controlar tus datos personales. 
          Si has utilizado Facebook para iniciar sesión en nuestra plataforma y deseas que eliminemos 
          toda la información asociada a tu cuenta (incluyendo fotos, eventos y datos de perfil), 
          puedes hacerlo siguiendo estos pasos:
        </p>

        <h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">Opción 1: Solicitud por Correo Electrónico (Recomendado)</h3>
        <ol class="list-decimal pl-5 space-y-2 mb-6">
          <li>Envía un correo electrónico a <strong>contacto@moments-gallery.com</strong> desde la dirección de correo asociada a tu cuenta de Moments/Facebook.</li>
          <li>En el asunto escribe: <strong>"Solicitud de Eliminación de Datos"</strong>.</li>
          <li>En el cuerpo del mensaje, indícanos tu nombre de usuario y confirma que deseas eliminar tu cuenta permanentemente.</li>
          <li>Nuestro equipo procesará tu solicitud y eliminará todos tus datos de nuestros servidores en un plazo máximo de 7 días hábiles, enviándote una confirmación al finalizar.</li>
        </ol>

        <h3 class="text-xl font-semibold text-gray-900 mt-8 mb-4">Opción 2: Eliminar la conexión desde Facebook</h3>
        <p class="mb-4">También puedes eliminar la conexión entre Facebook y Moments directamente desde tu cuenta de Facebook:</p>
        <ol class="list-decimal pl-5 space-y-2 mb-6">
          <li>Ve a la <strong>Configuración y privacidad</strong> de tu cuenta de Facebook.</li>
          <li>Haz clic en <strong>Configuración</strong>.</li>
          <li>En el menú de la izquierda, busca y selecciona <strong>Aplicaciones y sitios web</strong>.</li>
          <li>Busca <strong>Moments</strong> en la lista de aplicaciones activas.</li>
          <li>Haz clic en <strong>Eliminar</strong> y sigue las instrucciones en pantalla.</li>
        </ol>
        <div class="bg-blue-50 border-l-4 border-blue-500 p-4 mt-4">
          <p class="text-sm text-blue-700">
            <strong>Nota importante:</strong> Eliminar la aplicación desde Facebook solo revoca nuestro acceso a tus datos futuros de Facebook. 
            Para eliminar los datos que ya tenemos almacenados en nuestros servidores, debes seguir la <strong>Opción 1</strong>.
          </p>
        </div>

        <div class="mt-12 pt-6 border-t border-gray-200">
          <p class="text-sm text-gray-500 text-center">
            Última actualización: 6 de Septiembre de 2026<br>
            Moments - Capturando tus mejores instantes
          </p>
        </div>
      </div>
      
      <div class="mt-8 text-center">
        <NuxtLink to="/" class="text-[#0095f6] hover:text-[#00376b] font-semibold">
          Volver al Inicio
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Eliminación de Datos - Moments',
  meta: [
    { name: 'description', content: 'Instrucciones para la eliminación de datos de usuarios en Moments.' }
  ]
})
</script>
