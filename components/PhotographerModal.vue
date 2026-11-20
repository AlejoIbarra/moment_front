<template>
  <ClientOnly>
    <Teleport to="body">
      <div class="fixed inset-0 z-[200] flex items-center justify-center p-4">
    <!-- Overlay -->
    <div 
      class="absolute inset-0 bg-black/80 backdrop-blur-sm modal-overlay opacity-0"
      @click="closeModal"
    ></div>

    <!-- Modal Content -->
    <div class="relative w-full max-w-2xl bg-[#0a0a0f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl modal-container opacity-0 scale-95 translate-y-8">
      <!-- Glow effects -->
      <div class="absolute -top-32 -right-32 w-80 h-80 bg-[#3ef4a1]/15 rounded-full blur-[100px] pointer-events-none"></div>
      <div class="absolute -bottom-32 -left-32 w-80 h-80 bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none"></div>

      <!-- Close button -->
      <button 
        @click="closeModal"
        class="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors z-20"
      >
        <Icon name="lucide:x" class="w-6 h-6" />
      </button>

      <div class="p-8 sm:p-12 relative z-10">
        <h2 class="text-3xl sm:text-4xl font-black text-white mb-2 modal-item opacity-0 translate-y-4">
          Tu vitrina para <span class="text-[#3ef4a1]">jugarte tu talento</span>
        </h2>
        <p class="text-slate-300 font-light mb-8 modal-item opacity-0 translate-y-4">
          Moments es la vitrina donde expones tus mejores fotografías ante miles de asistentes, deportistas y organizadores que descubren tu estilo, te siguen y te contratan.
        </p>

        <!-- Benefits List -->
        <div class="space-y-6 mb-10">
          <div class="flex items-start gap-4 modal-item opacity-0 translate-y-4">
            <div class="p-3 rounded-2xl bg-[#3ef4a1]/15 text-[#3ef4a1] shrink-0">
              <Icon name="lucide:sparkles" class="w-6 h-6" />
            </div>
            <div>
              <h4 class="font-bold text-white text-lg">Vitrina de Talento &amp; Visibilidad Real</h4>
              <p class="text-slate-400 text-sm">Tu perfil y tus álbumes quedan expuestos en el Marketplace y directorio por ciudad para que el mundo vea la calidad de tu trabajo.</p>
            </div>
          </div>

          <div class="flex items-start gap-4 modal-item opacity-0 translate-y-4">
            <div class="p-3 rounded-2xl bg-emerald-500/20 text-[#3ef4a1] shrink-0">
              <Icon name="lucide:wallet" class="w-6 h-6" />
            </div>
            <div>
              <h4 class="font-bold text-white text-lg">Monetización Directa (hasta el 85% neto)</h4>
              <p class="text-slate-400 text-sm">Define tus propios precios, ofrece preventas o códigos de carrera y recibe pagos directos en tu billetera.</p>
            </div>
          </div>
          
          <div class="flex items-start gap-4 modal-item opacity-0 translate-y-4">
            <div class="p-3 rounded-2xl bg-fuchsia-500/20 text-fuchsia-400 shrink-0">
              <Icon name="lucide:shield-check" class="w-6 h-6" />
            </div>
            <div>
              <h4 class="font-bold text-white text-lg">Protección Total</h4>
              <p class="text-slate-400 text-sm">Tus fotos están protegidas con marcas de agua dinámicas hasta que se confirme la compra.</p>
            </div>
          </div>

          <div class="flex items-start gap-4 modal-item opacity-0 translate-y-4">
            <div class="p-3 rounded-2xl bg-pink-500/20 text-pink-400 shrink-0">
              <Icon name="lucide:image" class="w-6 h-6" />
            </div>
            <div>
              <h4 class="font-bold text-white text-lg">Alta Calidad</h4>
              <p class="text-slate-400 text-sm">Sube los archivos originales en máxima resolución; el sistema se encarga de crear las vistas previas.</p>
            </div>
          </div>
        </div>

        <!-- CTA Button -->
        <div class="modal-item opacity-0 translate-y-4 space-y-3">
          <a 
            href="https://wa.me/573245124346?text=Hola%20Moments,%20quiero%20postularme%20como%20fotógrafo%20Pro"
            target="_blank"
            rel="noopener noreferrer"
            class="group w-full relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl text-black bg-[#3ef4a1] hover:bg-[#07b667] transition-all shadow-[0_0_30px_rgba(62,244,161,0.3)] hover:shadow-[0_0_50px_rgba(62,244,161,0.5)] transform hover:-translate-y-1"
          >
            <Icon name="lucide:message-circle" class="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
            Escribir por WhatsApp (+57 324 512 4346)
          </a>
          <a 
            href="mailto:contacto@moments-gallery.com?subject=Solicitud%20para%20ser%20fotógrafo%20Pro"
            class="w-full inline-flex items-center justify-center px-6 py-3 text-sm font-semibold rounded-xl text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-all"
          >
            <Icon name="lucide:send" class="w-4 h-4 mr-2" />
            O enviar solicitud por correo
          </a>
        </div>
      </div>
    </div>
  </div>
  </Teleport>
</ClientOnly>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'

const emit = defineEmits(['close'])

let ctx

onMounted(() => {
  ctx = gsap.context(() => {
    const tl = gsap.timeline()
    
    // Animate overlay
    tl.to('.modal-overlay', {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
    
    // Animate modal container
    tl.to('.modal-container', {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.5,
      ease: 'back.out(1.2)'
    }, "-=0.1")
    
    // Stagger modal items
    tl.to('.modal-item', {
      opacity: 1,
      y: 0,
      duration: 0.5,
      stagger: 0.1,
      ease: 'power3.out'
    }, "-=0.2")
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})

const closeModal = () => {
  const tl = gsap.timeline({
    onComplete: () => {
      emit('close')
    }
  })
  
  tl.to('.modal-container', {
    opacity: 0,
    scale: 0.95,
    y: 20,
    duration: 0.3,
    ease: 'power2.in'
  })
  tl.to('.modal-overlay', {
    opacity: 0,
    duration: 0.2,
    ease: 'power2.in'
  }, "-=0.1")
}
</script>
