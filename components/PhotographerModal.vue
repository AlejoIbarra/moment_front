<template>
  <div class="fixed inset-0 z-[200] flex items-center justify-center p-4">
    <!-- Overlay -->
    <div 
      class="absolute inset-0 bg-black/80 backdrop-blur-sm modal-overlay opacity-0"
      @click="closeModal"
    ></div>

    <!-- Modal Content -->
    <div class="relative w-full max-w-2xl bg-[#0a0a0f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl modal-container opacity-0 scale-95 translate-y-8">
      <!-- Glow effects -->
      <div class="absolute -top-32 -right-32 w-80 h-80 bg-fuchsia-500/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div class="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-500/20 rounded-full blur-[100px] pointer-events-none"></div>

      <!-- Close button -->
      <button 
        @click="closeModal"
        class="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors z-20"
      >
        <Icon name="lucide:x" class="w-6 h-6" />
      </button>

      <div class="p-8 sm:p-12 relative z-10">
        <h2 class="text-3xl sm:text-4xl font-black text-white mb-2 modal-item opacity-0 translate-y-4">
          Únete como <span class="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-pink-400">Fotógrafo Pro</span>
        </h2>
        <p class="text-slate-400 font-light mb-8 modal-item opacity-0 translate-y-4">
          Lleva tu pasión al siguiente nivel y empieza a monetizar tus coberturas en los mejores eventos.
        </p>

        <!-- Benefits List -->
        <div class="space-y-6 mb-10">
          <div class="flex items-start gap-4 modal-item opacity-0 translate-y-4">
            <div class="p-3 rounded-2xl bg-indigo-500/20 text-indigo-400 shrink-0">
              <Icon name="lucide:wallet" class="w-6 h-6" />
            </div>
            <div>
              <h4 class="font-bold text-white text-lg">Monetización Directa</h4>
              <p class="text-slate-400 text-sm">Define tus propios precios y recibe pagos de forma segura y directa a tu monedero.</p>
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
        <div class="modal-item opacity-0 translate-y-4">
          <a 
            href="mailto:contacto@moments-gallery.com?subject=Solicitud%20para%20ser%20fotógrafo%20Pro"
            class="group w-full relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-xl text-white bg-gradient-to-r from-fuchsia-500 to-pink-500 hover:from-fuchsia-400 hover:to-pink-400 transition-all shadow-[0_0_30px_rgba(217,70,239,0.3)] hover:shadow-[0_0_50px_rgba(217,70,239,0.5)] transform hover:-translate-y-1"
          >
            <Icon name="lucide:send" class="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
            Enviar solicitud por correo
          </a>
          <p class="text-center text-xs text-slate-500 mt-4">
            Al hacer clic, se abrirá tu aplicación de correo predeterminada.
          </p>
        </div>
      </div>
    </div>
  </div>
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
