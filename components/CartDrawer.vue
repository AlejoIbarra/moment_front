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
                <div>
                  <h2 class="text-lg font-bold text-gray-900" id="slide-over-title">Carrito de Compras 🛒</h2>
                  <div class="mt-1 flex items-center gap-2">
                    <span 
                      class="text-[11px] font-bold px-2 py-0.5 rounded-full"
                      :class="cartStore.totalPhotosCount > 20 ? 'bg-red-100 text-red-700' : cartStore.totalPhotosCount === 20 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-50 text-emerald-700'"
                    >
                      {{ cartStore.totalPhotosCount }}/20 fotos
                    </span>
                    <span v-if="cartStore.totalPhotosCount >= 20" class="text-[11px] text-amber-600 font-medium">Límite alcanzado</span>
                  </div>
                </div>
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

              <div class="space-y-2 border-t border-gray-100 pt-4 text-sm">
                <div class="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span class="font-medium">${{ cartStore.subtotal.toLocaleString('es-CO') }}</span>
                </div>

                <!-- Moments PRO Discount line -->
                <div v-if="authStore.isPro" class="flex justify-between items-center text-amber-600 font-semibold bg-amber-50/80 px-2.5 py-1.5 rounded-lg border border-amber-200/60">
                  <span class="flex items-center gap-1.5 text-xs">
                    <span class="bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded shadow-sm">👑 PRO</span>
                    Descuento PRO (15%)
                  </span>
                  <span class="text-xs font-bold">-${{ cartStore.proDiscount.toLocaleString('es-CO') }}</span>
                </div>

                <div class="flex justify-between text-base font-bold text-gray-900 pt-2 border-t border-gray-100">
                  <span>Total</span>
                  <span class="text-[#10b981]">${{ cartStore.total.toLocaleString('es-CO') }}</span>
                </div>
              </div>
              <p class="mt-1 text-[10px] text-gray-400">El cargo final e impuestos de plataforma se aplican al pagar.</p>
              
              <div v-if="cartStore.totalPhotosCount > 20" class="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold flex items-center gap-2">
                <Icon name="lucide:alert-triangle" class="w-4 h-4 shrink-0 text-red-500" />
                El límite máximo por compra es de 20 fotos (tienes {{ cartStore.totalPhotosCount }} fotos). Elimina algunas para poder pagar.
              </div>

              <div v-if="cartStore.total > 0 && cartStore.total < 10000" class="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-bold flex items-center gap-2">
                <Icon name="lucide:alert-circle" class="w-4 h-4 shrink-0" />
                El valor mínimo de compra es de $10.000 COP
              </div>

              <div class="mt-6">
                <button @click="handleCartCheckout" :disabled="cartStore.loading || cartStore.totalPhotosCount > 20 || (cartStore.total > 0 && cartStore.total < 10000)" class="flex w-full items-center justify-center rounded-xl bg-[#3ef4a1] px-6 py-3 text-sm font-bold text-slate-900 shadow-lg hover:bg-[#3ef4a1]/90 transition-colors disabled:opacity-50">
                  {{ cartStore.loading ? 'Procesando...' : `Pagar $${cartStore.total.toLocaleString('es-CO')} COP` }}
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
const { triggerSuccess } = usePurchaseSuccess()
const { $api } = useNuxtApp()

async function handleCartCheckout() {
  if (!authStore.isAuthenticated) {
    toast.warning('Inicia sesión', 'Debes iniciar sesión para comprar.')
    router.push('/login?redirect=' + window.location.pathname)
    return
  }

  if (cartStore.totalPhotosCount > 20) {
    toast.warning('Límite de fotos superado', 'El límite máximo por compra es de 20 fotos. Por favor elimina fotos del carrito.')
    return
  }

  try {
    const purchasedItems = [...cartStore.items]
    const data = await cartStore.checkout()

    if (data.fullyCovered) {
      cartStore.clearCart()
      cartStore.showCart = false
      
      const photos = purchasedItems.flatMap(item => {
        if (item.type === 'package') return item.photos || []
        return [item]
      })

      triggerSuccess({
        title: '¡Compra del Carrito Exitosa!',
        subtitle: `Has adquirido ${photos.length || purchasedItems.length} fotografías en máxima calidad.`,
        photos: photos,
        presignedUrls: data.presignedUrls || (data.presignedUrl ? [data.presignedUrl] : []),
        presignedUrl: data.presignedUrl,
        message: data.message
      })
      return
    }

    const WidgetCheckoutClass = await getWompiWidget()
    if (WidgetCheckoutClass) {
      const checkoutOptions = {
        publicKey: data.publicKey,
        currency: data.currency,
        amountInCents: data.amountInCents,
        reference: data.reference,
        redirectUrl: window.location.origin + '/payment/success',
        customerData: { email: data.customerEmail }
      }

      if (data.signature) checkoutOptions.signature = { integrity: data.signature }

      const checkout = new WidgetCheckoutClass(checkoutOptions)
      checkout.open(async (res) => {
        const transaction = res.transaction
        if (transaction && (transaction.status === 'APPROVED' || transaction.status === 'SUCCESS')) {
          try {
            await $api('/wompi/confirm-transaction', {
              method: 'POST',
              body: { reference: checkoutOptions.reference, wompiId: transaction.id, status: transaction.status }
            })
          } catch (confirmErr) {
            console.error('Error confirming transaction:', confirmErr)
          }
          cartStore.clearCart()
          cartStore.showCart = false
          router.push(`/payment/success?reference=${checkoutOptions.reference}&id=${transaction.id}`)
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
