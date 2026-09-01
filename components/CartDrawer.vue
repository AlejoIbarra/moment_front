<template>
  <!-- Cart Drawer -->
  <div v-if="cartStore.showCart" class="fixed inset-0 z-[200] overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
    <div class="absolute inset-0 overflow-hidden">
      <!-- Background backdrop -->
      <div @click="cartStore.showCart = false" class="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity animate-fade-in" aria-hidden="true"></div>

      <div class="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div class="pointer-events-auto w-screen max-w-md animate-slide-in">
          <div class="flex h-full flex-col bg-white shadow-xl">
            <div class="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
              <div class="flex items-start justify-between">
                <h2 class="text-lg font-bold text-gray-900" id="slide-over-title">Carrito de Compras 🛒</h2>
                <div class="ml-3 flex h-7 items-center">
                  <button @click="cartStore.showCart = false" type="button" class="relative -m-2 p-2 text-gray-400 hover:text-gray-500">
                    <span class="sr-only">Close panel</span>
                    <Icon name="lucide:x" class="h-6 w-6" />
                  </button>
                </div>
              </div>

              <div class="mt-8">
                <div class="flow-root">
                  <ul role="list" class="-my-6 divide-y divide-gray-200">
                    <li v-for="item in cartStore.items" :key="item.id" class="flex py-6">
                      <div class="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                        <img :src="item.type === 'package' ? (item.photos[0]?.watermarkedR2Url || item.photos[0]?.watermarkedUrl) : (item.watermarkedR2Url || item.watermarkedUrl)" alt="Item image" class="h-full w-full object-cover object-center" />
                      </div>

                      <div class="ml-4 flex flex-1 flex-col">
                        <div>
                          <div class="flex justify-between text-base font-semibold text-gray-900">
                            <h3 class="text-sm font-bold text-gray-900">
                              {{ item.type === 'package' ? `Paquete: ${item.package.name}` : `Foto #${item.id}` }}
                            </h3>
                            <p class="ml-4 text-sm font-bold text-[#3ef4a1]">${{ Number(item.price).toLocaleString('es-CO') }}</p>
                          </div>
                          <p class="mt-1 text-[11px] text-gray-500">Fotógrafo: {{ item.event?.photographer?.username || 'Asignado' }}</p>
                          <p class="mt-0.5 text-[11px] text-gray-500">
                            {{ item.type === 'package' ? `${item.photos.length} fotos seleccionadas` : `Evento: ${item.event?.title || 'Galería'}` }}
                          </p>
                        </div>
                        <div class="flex flex-1 items-end justify-between text-sm">
                          <button @click="cartStore.removeFromCart(item.id)" type="button" class="font-bold text-red-500 hover:text-red-700 text-xs flex items-center gap-1">
                            <Icon name="lucide:trash-2" class="w-3.5 h-3.5" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div v-if="cartStore.items.length === 0" class="text-center py-16 text-gray-400">
                    <Icon name="lucide:shopping-cart" class="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p class="text-sm font-medium">Tu carrito está vacío.</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="cartStore.items.length > 0" class="border-t border-gray-200 px-4 py-6 sm:px-6 bg-gray-50/50">
              <!-- Coupon input -->
              <div class="mb-4">
                <label class="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">Código de Regalo / Promocional</label>
                <div class="flex gap-2">
                  <input v-model="cartStore.giftCardCode" type="text" placeholder="Ej: GFT-XXXX" class="flex-1 min-w-0 rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-[#3ef4a1] focus:ring-[#3ef4a1] bg-white" />
                </div>
              </div>

              <div class="flex justify-between text-base font-semibold text-gray-900 border-t border-gray-100 pt-4">
                <p>Subtotal</p>
                <p>${{ cartStore.subtotal.toLocaleString('es-CO') }}</p>
              </div>
              <p class="mt-1 text-[10px] text-gray-400">El cargo final e impuestos de plataforma se aplican al pagar.</p>
              
              <div v-if="cartStore.subtotal > 0 && cartStore.subtotal < 10000" class="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-bold flex items-center gap-2">
                <Icon name="lucide:alert-circle" class="w-4 h-4 shrink-0" />
                El valor mínimo de compra es de $10.000 COP
              </div>

              <div class="mt-6">
                <button @click="handleCartCheckout" :disabled="cartStore.loading || (cartStore.subtotal > 0 && cartStore.subtotal < 10000)" class="flex w-full items-center justify-center rounded-xl bg-[#3ef4a1] px-6 py-3 text-sm font-bold text-slate-900 shadow-lg hover:bg-[#3ef4a1]/90 transition-colors disabled:opacity-50">
                  {{ cartStore.loading ? 'Procesando...' : 'Pagar Ahora' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()
const toast = useToast()

async function handleCartCheckout() {
  if (!authStore.isAuthenticated) {
    toast.warning('Inicia sesión', 'Debes iniciar sesión para comprar.')
    router.push('/login?redirect=' + window.location.pathname)
    return
  }

  try {
    const data = await cartStore.checkout()

    if (data.fullyCovered) {
      toast.success('Compra exitosa', 'Las fotos han sido adquiridas exitosamente.')
      cartStore.clearCart()
      cartStore.showCart = false
      router.push('/dashboard/customer')
      return
    }

    if (typeof window !== 'undefined' && window.WidgetCheckout) {
      const checkoutOptions = {
        publicKey: data.publicKey,
        currency: data.currency,
        amountInCents: data.amountInCents,
        reference: data.reference,
        redirectUrl: window.location.origin + '/payment/success',
        customerData: { email: data.customerEmail }
      }

      if (data.signature) checkoutOptions.signature = { integrity: data.signature }

      const checkout = new window.WidgetCheckout(checkoutOptions)
      checkout.open((res) => {
        const transaction = res.transaction
        if (transaction.status === 'APPROVED') {
          toast.success('Pago aprobado', 'Tus fotos se están activando.')
          cartStore.clearCart()
          cartStore.showCart = false
          router.push('/dashboard/customer')
        }
      })
    } else {
      toast.error('Error', 'La pasarela de pago no se pudo cargar. Intenta de nuevo.')
    }
  } catch (error) {
    toast.error('Error al pagar', error.response?._data?.error || error.message || 'No se pudo iniciar la transacción.')
  }
}
</script>

<style scoped>
.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
