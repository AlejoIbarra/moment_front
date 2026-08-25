<template>
  <div class="min-h-screen bg-gray-50/50 pb-20">
    <!-- Premium Header Background -->
    <div class="h-64 w-full bg-gradient-to-r from-indigo-900 via-purple-900 to-indigo-800 relative overflow-hidden">
      <!-- Decorative background elements -->
      <div class="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-50/50 to-transparent"></div>
    </div>

    <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
      <!-- Profile Card -->
      <div class="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl shadow-indigo-900/5 rounded-3xl p-6 sm:p-10 mb-10 flex flex-col md:flex-row items-center md:items-start gap-8 transition-all hover:shadow-indigo-900/10">
        
        <!-- Avatar -->
        <div class="relative group cursor-pointer shrink-0" @click="$refs.fileInput.click()">
          <div class="w-36 h-36 md:w-44 md:h-44 rounded-[2rem] bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 shadow-xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
            <div class="w-full h-full rounded-[1.8rem] bg-white p-1">
              <div class="w-full h-full rounded-[1.6rem] bg-gray-100 flex items-center justify-center overflow-hidden">
                <img v-if="authStore.user?.profilePhotoUrl" :src="authStore.user.profilePhotoUrl" alt="Profile" class="w-full h-full object-cover">
                <Icon v-else name="lucide:user" class="w-16 h-16 text-gray-300" />
              </div>
            </div>
          </div>
          <div class="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-[2rem] transition-all duration-300 backdrop-blur-sm">
            <div class="flex flex-col items-center">
              <Icon name="lucide:camera" class="w-8 h-8 mb-1" />
              <span class="text-xs font-bold uppercase tracking-wider">Cambiar Foto</span>
            </div>
          </div>
          <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="onFileSelected" />
        </div>

        <!-- Info -->
        <div class="flex-1 text-center md:text-left mt-2 md:mt-4">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">{{ authStore.user?.username || 'Customer' }}</h2>
              <div class="flex items-center justify-center md:justify-start gap-2 mt-2">
                <span v-if="authStore.user?.title" class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                  <Icon name="lucide:sparkles" class="w-3.5 h-3.5 mr-1" />
                  {{ authStore.user.title }}
                </span>
                <span v-else class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                  <Icon name="lucide:sparkles" class="w-3.5 h-3.5 mr-1" />
                  Collector
                </span>
                <span class="text-sm font-medium text-gray-400 border-l border-gray-300 pl-2">
                  {{ $t('dashboard.customer.member_since') }} {{ new Date().getFullYear() }}
                </span>
              </div>
            </div>
            
            <NuxtLink :to="`/profile/${authStore.user?.username}`" class="px-5 py-2.5 bg-gray-900 hover:bg-black text-white text-sm font-bold rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2">
              <Icon name="lucide:external-link" class="w-4 h-4" />
              Ver Mi Perfil Público
            </NuxtLink>
          </div>

          <p class="text-gray-600 text-sm md:text-base leading-relaxed max-w-2xl mx-auto md:mx-0 whitespace-pre-wrap">
            {{ authStore.user?.description || 'Descubriendo momentos increíbles a través de la lente.' }}
          </p>

          <div class="flex items-center justify-center md:justify-start gap-8 mt-6 pt-6 border-t border-gray-100">
            <div class="text-center md:text-left">
              <span class="block text-2xl font-black text-indigo-600">{{ purchases.length }}</span>
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">{{ $t('dashboard.customer.purchases') }}</span>
            </div>
            <div class="text-center md:text-left">
              <span class="block text-2xl font-black text-gray-900">Buyer</span>
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Tipo de Cuenta</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Modern Tabs -->
      <div class="flex flex-wrap justify-center gap-2 mb-10 p-1.5 bg-white rounded-2xl shadow-sm border border-gray-100 mx-auto w-fit">
        <button @click="currentTab = 'purchases'" :class="['flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300',
          currentTab === 'purchases' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50']">
          <Icon name="lucide:grid" class="w-4 h-4" />
          {{ $t('dashboard.customer.purchases') }}
        </button>
        <button @click="currentTab = 'hidden'" :class="['flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300',
          currentTab === 'hidden' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50']">
          <Icon name="lucide:eye-off" class="w-4 h-4" />
          Ocultas
        </button>
        <button @click="currentTab = 'settings'" :class="['flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300',
          currentTab === 'settings' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50']">
          <Icon name="lucide:settings" class="w-4 h-4" />
          Configuración
        </button>
        <button @click="currentTab = 'subscription'" :class="['flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl transition-all duration-300',
          currentTab === 'subscription' ? 'bg-indigo-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-50']">
          <Icon name="lucide:sparkles" class="w-4 h-4" />
          Suscripción
        </button>
      </div>

      <!-- Content Area -->
      <div class="relative">
        <!-- Purchases Tab -->
        <div v-if="currentTab === 'purchases'" class="animate-fade-in">
          <div v-if="pendingPurchases" class="flex justify-center py-32">
            <div class="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>

          <div v-else-if="purchases.length === 0" class="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div class="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center mb-6">
              <Icon name="lucide:camera" class="w-12 h-12 text-indigo-500" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">{{ $t('dashboard.customer.no_photos') }}</h3>
            <p class="text-gray-500 mb-8 max-w-md">{{ $t('dashboard.customer.no_photos_desc') }}</p>
            <NuxtLink to="/marketplace" class="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex items-center gap-2">
              Explorar el Marketplace <Icon name="lucide:arrow-right" class="w-4 h-4" />
            </NuxtLink>
          </div>

          <div v-else>
            <div class="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
              <h3 class="text-xl font-extrabold text-gray-900 px-2">Tus Compras</h3>
              <div class="flex flex-wrap gap-2 justify-center">
                <button v-if="!selectionMode" @click="selectionMode = true" class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm flex items-center gap-2 transition-all active:scale-95">
                  <Icon name="lucide:check-square" class="w-4 h-4" />
                  Modo Selección
                </button>
                <template v-else>
                  <button @click="cancelSelection" class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-all active:scale-95">
                    Cancelar
                  </button>
                  <button @click="hideSelectedPhotos" :disabled="selectedPhotos.length === 0" class="px-5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-bold text-sm transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
                    <Icon name="lucide:eye-off" class="w-4 h-4" />
                    Ocultar
                  </button>
                  <button @click="downloadSelectedPhotos" :disabled="isDownloadingAll || selectedPhotos.length === 0" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                    <Icon v-if="isDownloadingAll" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                    <Icon v-else name="lucide:download-cloud" class="w-4 h-4" />
                    {{ isDownloadingAll ? 'Descargando...' : `Descargar (${selectedPhotos.length})` }}
                  </button>
                </template>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <div v-for="purchase in visiblePurchases" :key="purchase.id"
                :class="[
                  'bg-white rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 shadow-sm hover:shadow-xl relative aspect-square',
                  selectionMode && selectedPhotos.includes(purchase.photoId) ? 'ring-4 ring-indigo-500 ring-offset-2' : 'border border-gray-100 hover:border-gray-200 hover:-translate-y-1'
                ]"
                @click="handlePurchaseClick(purchase)">
                
                <img :src="purchase.watermarkedUrl" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                
                <!-- Selection overlay -->
                <div v-if="selectionMode" class="absolute inset-0 bg-black/10 z-10 transition-colors" :class="{'bg-indigo-900/30 backdrop-blur-[2px]': selectedPhotos.includes(purchase.photoId)}">
                  <div class="absolute top-4 left-4">
                    <div :class="[
                      'w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 shadow-lg',
                      selectedPhotos.includes(purchase.photoId)
                        ? 'bg-indigo-600 border-indigo-600 text-white scale-110' 
                        : 'bg-white/80 backdrop-blur-sm border-white text-transparent'
                    ]">
                      <Icon name="lucide:check" class="w-5 h-5" />
                    </div>
                  </div>
                </div>

                <!-- Hover overlay -->
                <div v-if="!selectionMode" class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                  <h4 class="text-white font-bold text-lg leading-tight mb-1 truncate" :title="purchase.photoTitle">{{ purchase.photoTitle }}</h4>
                  <p class="text-gray-300 text-sm flex items-center gap-1.5 mb-4 uppercase tracking-wider font-semibold">
                    {{ new Date(purchase.createdAt).toLocaleDateString() }}
                  </p>
                  
                  <button @click.stop="downloadPhoto(purchase.photoId)" class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg">
                    <Icon name="lucide:download" class="w-4 h-4" />
                    Descargar Original
                  </button>
                </div>
                
                <!-- View Badge Top Left (if not in selection mode) -->
                <div v-if="!selectionMode" class="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover:translate-y-0">
                  <span class="bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-black text-gray-800 shadow-sm border border-white/50 flex items-center gap-1">
                    <Icon name="lucide:zoom-in" class="w-3 h-3 text-indigo-500" /> Ver
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Hidden Tab -->
        <div v-if="currentTab === 'hidden'" class="animate-fade-in">
          <div v-if="hiddenPurchases.length === 0" class="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <div class="w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center mb-6">
              <Icon name="lucide:eye-off" class="w-12 h-12 text-gray-400" />
            </div>
            <h3 class="text-2xl font-bold text-gray-900 mb-3">No hay fotos ocultas</h3>
            <p class="text-gray-500 mb-6 max-w-md">Las fotos que decidas ocultar de tu feed principal aparecerán aquí.</p>
          </div>

          <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div v-for="purchase in hiddenPurchases" :key="purchase.id" class="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm group opacity-80 hover:opacity-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl relative aspect-square" @click="activeLightboxImg = purchase.watermarkedUrl">
              <img :src="purchase.watermarkedUrl" class="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110">
              
              <!-- Hover overlay -->
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                <h4 class="text-white font-bold text-lg leading-tight mb-1 truncate" :title="purchase.photoTitle">{{ purchase.photoTitle }}</h4>
                <p class="text-gray-300 text-sm flex items-center gap-1.5 mb-4 uppercase tracking-wider font-semibold">
                  {{ new Date(purchase.createdAt).toLocaleDateString() }}
                </p>
                <button @click.stop="unhidePhoto(purchase.photoId)" class="w-full py-2.5 bg-white hover:bg-gray-50 text-gray-900 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-lg">
                  <Icon name="lucide:eye" class="w-4 h-4" />
                  Restaurar al Feed
                </button>
              </div>

              <!-- View Badge Top Left -->
              <div class="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover:translate-y-0">
                <span class="bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-xs font-black text-gray-800 shadow-sm border border-white/50 flex items-center gap-1">
                  <Icon name="lucide:zoom-in" class="w-3 h-3 text-indigo-500" /> Ver
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-if="currentTab === 'settings'" class="animate-fade-in">
          <div class="max-w-4xl mx-auto space-y-6">
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Username Config -->
              <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                <div class="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6">
                  <Icon name="lucide:at-sign" class="w-6 h-6 text-indigo-500" />
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Nombre de Usuario</h3>
                <p class="text-gray-500 text-sm mb-6">Esta será tu URL pública.</p>
                <div class="relative">
                  <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span class="text-gray-400 font-bold">@</span>
                  </div>
                  <input v-model="usernameText" type="text"
                    class="block w-full pl-10 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-gray-900"
                    placeholder="tuusuario" />
                </div>
                <button @click="updateUsername" :disabled="savingUsername || usernameText === authStore.user?.username"
                  class="mt-4 w-full py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                  <Icon v-if="savingUsername" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                  {{ savingUsername ? 'Guardando...' : (usernameSuccess ? '¡Guardado!' : 'Guardar Cambios') }}
                </button>
              </div>

              <!-- Title Config -->
              <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
                <div class="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                  <Icon name="lucide:tag" class="w-6 h-6 text-purple-500" />
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">Etiqueta Principal</h3>
                <p class="text-gray-500 text-sm mb-6">Destácate en tu perfil público.</p>
                <input v-model="titleText" type="text" maxlength="30"
                  class="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-purple-500/20 focus:border-purple-500 transition-all font-medium text-gray-900"
                  placeholder="Ej. Fotógrafo Amateur, Novia, Coleccionista" />
                <button @click="updateTitle" :disabled="savingTitle"
                  class="mt-4 w-full py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                  <Icon v-if="savingTitle" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                  {{ savingTitle ? 'Guardando...' : (titleSuccess ? '¡Guardado!' : 'Guardar Etiqueta') }}
                </button>
              </div>
            </div>

            <!-- Bio Config -->
            <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
              <div class="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-6">
                <Icon name="lucide:align-left" class="w-6 h-6 text-rose-500" />
              </div>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Biografía</h3>
              <p class="text-gray-500 text-sm mb-6">Cuéntanos sobre ti y tu pasión por la fotografía.</p>
              <textarea v-model="descriptionText" rows="4" maxlength="500"
                class="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-4 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-medium text-gray-900 resize-none"
                placeholder="Hola! Soy un amante de capturar momentos..."></textarea>
              <button @click="updateDescription" :disabled="savingDescription"
                class="mt-4 w-full py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl transition-all shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                <Icon v-if="savingDescription" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                {{ savingDescription ? 'Guardando...' : (descriptionSuccess ? '¡Guardado!' : 'Actualizar Biografía') }}
              </button>
            </div>

            <!-- Privacy Preference & Logout -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between gap-6">
                <div>
                  <div class="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center mb-6 shrink-0">
                    <Icon name="lucide:shield-check" class="w-6 h-6 text-sky-500" />
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 mb-1">Perfil Limpio</h3>
                  <p class="text-gray-500 text-sm mb-4">Muestra las fotos de tu perfil público sin marcas de agua.</p>
                </div>
                
                <button @click="toggleWatermarkPreference" :disabled="savingPreference"
                  :class="[
                    'relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-600/30',
                    showWatermarked ? 'bg-indigo-600' : 'bg-gray-200'
                  ]"
                >
                  <span
                    :class="[
                      'pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out',
                      showWatermarked ? 'translate-x-8' : 'translate-x-0'
                    ]"
                  />
                </button>
              </div>

              <!-- Logout Box -->
              <div class="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div class="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center mb-6">
                    <Icon name="lucide:log-out" class="w-6 h-6 text-rose-500" />
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 mb-2">Cerrar Sesión</h3>
                  <p class="text-gray-500 text-sm mb-6">Cierra tu sesión de forma segura.</p>
                </div>
                <button @click="showLogoutModal = true" class="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2">
                  <Icon name="lucide:log-out" class="w-4 h-4" />
                  Cerrar sesión
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- Subscription Tab -->
        <div v-if="currentTab === 'subscription'" class="max-w-3xl mx-auto animate-fade-in">
          <div v-if="checkingSubscription" class="flex justify-center py-32">
            <div class="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>

          <div v-else-if="activeSubscription?.active" class="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl text-center relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-indigo-50 via-white to-purple-50 opacity-50"></div>
            
            <div class="relative z-10">
              <div class="w-24 h-24 bg-gradient-to-tr from-emerald-400 to-teal-400 rounded-3xl flex items-center justify-center mx-auto mb-8 text-white shadow-xl shadow-emerald-500/20 rotate-3">
                <Icon name="lucide:crown" class="w-12 h-12" />
              </div>
              <h2 class="text-3xl font-black text-gray-900 mb-3 tracking-tight">Suscripción Premium Activa ✨</h2>
              <p class="text-gray-500 text-sm mb-10 max-w-md mx-auto">Gracias por ser parte de Moment Premium. Disfruta de tus beneficios exclusivos en cada evento.</p>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div class="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <span class="block text-xs font-bold uppercase tracking-wider text-indigo-500 mb-2">Fotos Gratis Restantes</span>
                  <span class="text-5xl font-black text-indigo-900">{{ activeSubscription.freePhotosRemaining }}</span>
                </div>
                <div class="p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <span class="block text-xs font-bold uppercase tracking-wider text-purple-500 mb-2">Próxima Renovación</span>
                  <span class="text-xl font-bold text-purple-900 mt-2 block">{{ activeSubscription.endDate }}</span>
                </div>
              </div>

              <div class="p-6 bg-gray-50 rounded-2xl text-left border border-gray-100 space-y-4">
                <p class="flex items-start gap-3 text-sm text-gray-700 font-medium">
                  <Icon name="lucide:check-circle-2" class="w-5 h-5 text-emerald-500 shrink-0" />
                  Tienes acceso exclusivo a paquetes especiales en todos los eventos.
                </p>
                <p class="flex items-start gap-3 text-sm text-gray-700 font-medium">
                  <Icon name="lucide:check-circle-2" class="w-5 h-5 text-emerald-500 shrink-0" />
                  Recibirás regalos y promociones directas de los fotógrafos.
                </p>
              </div>
            </div>
          </div>

          <div v-else class="bg-gray-900 rounded-3xl overflow-hidden shadow-2xl relative text-white">
            <div class="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-purple-900/50"></div>
            <div class="absolute -top-24 -right-24 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl"></div>
            <div class="absolute -bottom-24 -left-24 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"></div>
            
            <div class="relative z-10 p-8 md:p-12 text-center">
              <span class="inline-flex items-center px-3 py-1 bg-white/10 border border-white/20 text-white text-xs font-bold uppercase tracking-widest rounded-full mb-6 backdrop-blur-md">
                Recomendado
              </span>
              <h2 class="text-4xl md:text-5xl font-black mb-4 tracking-tight">Moment Premium</h2>
              <p class="text-gray-300 text-sm md:text-base max-w-lg mx-auto mb-10">Lleva tu pasión al siguiente nivel. Suscríbete hoy y obtén fotos de regalo exclusivas todos los meses.</p>
              
              <div class="text-5xl font-black mb-10 flex items-end justify-center gap-2">
                $30.000 <span class="text-xl font-medium text-gray-400 mb-1">/ mes</span>
              </div>

              <div class="max-w-md mx-auto text-left space-y-6 mb-12">
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                    <Icon name="lucide:image" class="w-5 h-5 text-indigo-300" />
                  </div>
                  <div>
                    <h4 class="font-bold text-white mb-1">10 Fotos de Regalo al Mes</h4>
                    <p class="text-sm text-gray-400">Canjea hasta 10 fotos originales sin costo en cualquier evento.</p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                    <Icon name="lucide:unlock" class="w-5 h-5 text-purple-300" />
                  </div>
                  <div>
                    <h4 class="font-bold text-white mb-1">Acceso a Paquetes Exclusivos</h4>
                    <p class="text-sm text-gray-400">Ofertas especiales que los fotógrafos habilitan solo para miembros Premium.</p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/10">
                    <Icon name="lucide:gift" class="w-5 h-5 text-emerald-300" />
                  </div>
                  <div>
                    <h4 class="font-bold text-white mb-1">Regalos y Promociones</h4>
                    <p class="text-sm text-gray-400">Recibe descuentos exclusivos y regalos directos frecuentemente.</p>
                  </div>
                </div>
              </div>

              <button @click="handleSubscribe" :disabled="isSubscribing" class="w-full max-w-sm py-4 bg-white hover:bg-gray-100 text-gray-900 font-black rounded-xl transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] active:scale-95 disabled:opacity-50 disabled:shadow-none text-lg">
                {{ isSubscribing ? 'Iniciando Pago...' : 'Suscribirse Ahora' }}
              </button>
              <p class="text-xs text-gray-400 mt-6 flex items-center justify-center gap-1.5 font-medium">
                <Icon name="lucide:lock" class="w-3.5 h-3.5" /> Pago seguro procesado por Wompi
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Lightbox Modal (Keep exactly as it was) -->
  <div v-if="activeLightboxImg" class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8 animate-fade-in" @click="activeLightboxImg = null">
    <button @click="activeLightboxImg = null" class="absolute top-6 right-6 p-2 bg-white/10 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-colors z-10">
      <Icon name="lucide:x" class="w-6 h-6" />
    </button>
    <div class="relative max-w-full max-h-full flex items-center justify-center p-4" @click.stop>
      <img :src="activeLightboxImg" class="max-w-full max-h-full object-contain rounded-xl shadow-2xl" />
    </div>
  </div>

  <!-- Logout Confirmation Modal (Meta Style) -->
  <div v-if="showLogoutModal" class="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in" @click="showLogoutModal = false">
    <div class="bg-white rounded-[2rem] w-full max-w-sm overflow-hidden shadow-2xl" @click.stop>
      <div class="p-8 text-center">
        <h3 class="text-xl font-black text-gray-900 mb-2 tracking-tight">¿Cerrar sesión?</h3>
        <p class="text-sm text-gray-500 font-medium">Tendrás que volver a ingresar tus credenciales para acceder a tus fotos.</p>
      </div>
      <div class="border-t border-gray-100 flex flex-col">
        <button @click="handleLogout" class="py-4 text-rose-600 font-bold hover:bg-gray-50 transition-colors active:bg-gray-100 border-b border-gray-100">
          Cerrar sesión
        </button>
        <button @click="showLogoutModal = false" class="py-4 text-gray-900 font-medium hover:bg-gray-50 transition-colors active:bg-gray-100">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useWalletStore } from '~/stores/wallet'

import { usePhotosStore } from '~/stores/photos'

const { $api } = useNuxtApp()
const router = useRouter()
const config = useRuntimeConfig()
const authStore = useAuthStore()
const walletStore = useWalletStore()
const photosStore = usePhotosStore()
const toast = useToast()

const currentTab = ref('purchases')
const settingsTab = ref('profile') // New state for Sidebar in Settings
const showLogoutModal = ref(false) // State for Logout modal

const topUpAmount = ref(5000)
const isToppingUp = ref(false)
const wompiData = ref(null)
const windowOrigin = ref('')
const isLocalhost = ref(false)
const purchases = ref([])
const pendingPurchases = ref(true)
const fileInput = ref(null)
const uploading = ref(false)
const isDownloadingAll = ref(false)
const selectionMode = ref(false)
const selectedPhotos = ref([])
const hiddenPhotoIds = ref([])

const visiblePurchases = computed(() => {
  return purchases.value.filter(p => !hiddenPhotoIds.value.includes(p.photoId))
})
const hiddenPurchases = computed(() => {
  return purchases.value.filter(p => hiddenPhotoIds.value.includes(p.photoId))
})

const usernameText = ref('')
const savingUsername = ref(false)
const usernameSuccess = ref(false)

const descriptionText = ref('')
const savingDescription = ref(false)
const descriptionSuccess = ref(false)

const titleText = ref('')
const savingTitle = ref(false)
const titleSuccess = ref(false)

const showWatermarked = ref(true)
const savingPreference = ref(false)
const preferenceSuccess = ref(false)
const activeLightboxImg = ref(null)

const route = useRoute()

onMounted(async () => {
  windowOrigin.value = typeof window !== 'undefined' ? window.location.origin : ''
  isLocalhost.value = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  if (!authStore.isCustomer) {
    router.push('/')
    return
  }
  
  if (route.query.tab) {
    currentTab.value = route.query.tab
  }
  
  usernameText.value = authStore.user?.username || ''
  descriptionText.value = authStore.user?.description || ''
  titleText.value = authStore.user?.title || ''
  showWatermarked.value = authStore.user?.showWatermarkedInProfile === false
  
  if (authStore.user?.username) {
    try {
      const data = await $api('/users/settings/hidden-photos')
      if (data) hiddenPhotoIds.value = data
    } catch (e) {
      console.error('Error fetching hidden photos', e)
    }
  }
  
  await walletStore.fetchBalance()
  await fetchPurchases()
  await checkSubscription()
})



const activeSubscription = ref(null)
const checkingSubscription = ref(true)
const isSubscribing = ref(false)

async function updateUsername() {
  if (savingUsername.value || usernameText.value === authStore.user?.username) return
  savingUsername.value = true
  try {
    const res = await authStore.updateUsername(usernameText.value)
    if (res.success) {
      usernameSuccess.value = true
      setTimeout(() => { usernameSuccess.value = false }, 3000)
    } else {
      toast.error('Error', res.error || 'No se pudo actualizar el nombre de usuario.')
    }
  } catch (e) {
    console.error(e)
    toast.error('Error', 'Error al guardar el nombre de usuario')
  } finally {
    savingUsername.value = false
  }
}

async function checkSubscription() {
  checkingSubscription.value = true
  try {
    const data = await $api('/subscriptions/active')
    activeSubscription.value = data
  } catch (e) {
    console.error('Failed to fetch subscription', e)
  } finally {
    checkingSubscription.value = false
  }
}

async function handleSubscribe() {
  isSubscribing.value = true
  try {
    if (typeof window === 'undefined' || !window.WidgetCheckout) {
      toast.info('Cargando pasarela', 'La pasarela de pago aún se está cargando. Por favor, espera un momento y reintenta.')
      isSubscribing.value = false
      return
    }

    const data = await $api('/subscriptions/subscribe', { method: 'POST' })
    console.log('Wompi prepare subscription data:', data)

    const checkoutOptions = {
      publicKey: data.publicKey,
      currency: data.currency,
      amountInCents: data.amountInCents,
      reference: data.reference,
      redirectUrl: window.location.origin + '/payment/success',
      customerData: {
        email: data.customerEmail
      }
    }

    if (data.signature) {
      checkoutOptions.signature = { integrity: data.signature }
    }

    const checkout = new window.WidgetCheckout(checkoutOptions)
    checkout.open((result) => {
      const transaction = result.transaction
      if (transaction.status === 'APPROVED') {
        router.push('/payment/success')
      }
    })
  } catch (e) {
    console.error('Failed to subscribe', e)
    toast.error('Error de suscripción', e.response?._data?.error || 'No se pudo iniciar la suscripción.')
  } finally {
    isSubscribing.value = false
  }
}

async function handleTopUp() {
  if (topUpAmount.value < 5000) {
    toast.error('Monto insuficiente', 'El monto mínimo es $5.000 COP')
    return
  }

  isToppingUp.value = true
  try {
    // Check if Wompi widget is loaded
    if (typeof window === 'undefined' || !window.WidgetCheckout) {
      toast.info('Cargando pasarela', 'La pasarela de pago aún se está cargando. Por favor, espera un momento y reintenta.')
      isToppingUp.value = false
      return
    }

    // Use the centralized wallet store logic
    const data = await walletStore.prepareWompiPayment(topUpAmount.value)
    console.log('Wompi Dashboard prepare data:', data)
    wompiData.value = data

    // 2. Open Wompi Widget
    const checkoutOptions = {
      publicKey: data.publicKey,
      currency: data.currency,
      amountInCents: data.amountInCents,
      reference: data.reference,
      redirectUrl: window.location.origin + '/payment/success',
      customerData: data.customerData
    }

    if (data.signature) {
      checkoutOptions.signature = { integrity: data.signature }
    }

    const checkout = new window.WidgetCheckout(checkoutOptions)

    checkout.open((result) => {
      const transaction = result.transaction
      if (transaction.status === 'APPROVED') {
        router.push('/payment/success')
      }
    })
  } catch (e) {
    console.error('Failed to prepare payment', e)
    toast.error('Error de pago', 'Payment initialization failed. Please try again.')
  } finally {
    isToppingUp.value = false
  }
}

async function fetchPurchases() {
  pendingPurchases.value = true
  try {
    const data = await $api('/payment/my-purchases')
    purchases.value = data
  } catch (e) {
    console.error('No purchases found or endpoint error', e)
  } finally {
    pendingPurchases.value = false
  }
}

function handlePurchaseClick(purchase) {
  if (selectionMode.value) {
    const index = selectedPhotos.value.indexOf(purchase.photoId)
    if (index > -1) {
      selectedPhotos.value.splice(index, 1)
    } else {
      selectedPhotos.value.push(purchase.photoId)
    }
  } else {
    activeLightboxImg.value = purchase.watermarkedUrl
  }
}

function cancelSelection() {
  selectionMode.value = false
  selectedPhotos.value = []
}

async function hideSelectedPhotos() {
  for (const id of selectedPhotos.value) {
    if (!hiddenPhotoIds.value.includes(id)) {
      hiddenPhotoIds.value.push(id)
    }
  }
  
  try {
    await $fetch(`${config.public.apiBase}/users/settings/hidden-photos`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${authStore.token}`, 'Content-Type': 'application/json' },
      body: hiddenPhotoIds.value
    })
    toast.success('Fotos ocultadas', 'Las fotos seleccionadas se han movido a Fotos Ocultas.')
  } catch (e) {
    console.error(e)
    toast.error('Error', 'No se pudieron ocultar las fotos en el servidor.')
  }
  
  cancelSelection()
}

async function unhidePhoto(photoId) {
  const idx = hiddenPhotoIds.value.indexOf(photoId)
  if (idx > -1) {
    hiddenPhotoIds.value.splice(idx, 1)
    try {
      await $fetch(`${config.public.apiBase}/users/settings/hidden-photos`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${authStore.token}`, 'Content-Type': 'application/json' },
        body: hiddenPhotoIds.value
      })
      toast.success('Restaurada', 'La foto vuelve a estar en tu feed principal.')
    } catch (e) {
      console.error(e)
      toast.error('Error', 'No se pudo restaurar la foto en el servidor.')
      // rollback
      hiddenPhotoIds.value.push(photoId)
    }
  }
}

async function genuineDownload(downloadUrl, filename) {
  try {
    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error('Network response was not ok');
    const blob = await response.blob();
    const objectUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = objectUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(objectUrl);
    return true;
  } catch (e) {
    return false;
  }
}

async function downloadPhoto(photoId) {
  try {
    const res = await photosStore.getDownloadUrl(photoId)
    const downloadUrl = res?.presignedUrl || res
    
    if (downloadUrl && typeof downloadUrl === 'string') {
      try {
        const response = await fetch(downloadUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        const blob = await response.blob();
        const objectUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = `moment-photo-${photoId}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(objectUrl);
      } catch (e) {
        // Fallback for strict browsers or CORS errors: direct link without _blank
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `moment-photo-${photoId}.jpg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } else {
      toast.error('Error', 'No se pudo obtener el enlace de descarga.')
    }
  } catch (err) {
    console.error(err)
    toast.error('Error', 'Error al procesar la descarga.')
  }
}

function handleLogout() {
  authStore.logout()
}

async function downloadSelectedPhotos() {
  if (selectedPhotos.value.length === 0) return
  isDownloadingAll.value = true
  toast.info('Descargando...', 'Iniciando descarga múltiple. Por favor espera.')

  for (let i = 0; i < selectedPhotos.value.length; i++) {
    const photoId = selectedPhotos.value[i]
    try {
      const res = await photosStore.getDownloadUrl(photoId)
      const downloadUrl = res?.presignedUrl || res
      
      if (downloadUrl && typeof downloadUrl === 'string') {
        const success = await genuineDownload(downloadUrl, `moment-photo-${photoId}.jpg`)
        if (!success) {
          const a = document.createElement('a')
          a.href = downloadUrl
          a.download = `moment-photo-${photoId}.jpg`
          a.target = '_blank'
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
      }
    } catch (e) {
      console.error('Error al descargar foto', photoId, e)
    }
    
    await new Promise(resolve => setTimeout(resolve, 800))
  }
  
  isDownloadingAll.value = false
  toast.success('¡Listo!', 'Tus fotos han sido descargadas.')
  cancelSelection()
}

async function toggleWatermarkPreference() {
  if (savingPreference.value) return
  savingPreference.value = true
  // showWatermarked = true means show clean original (showWatermarkedInProfile = false in backend)
  const showOriginalOnProfile = !showWatermarked.value
  const backendValue = !showOriginalOnProfile // true if watermarked, false if original clean

  try {
    await $fetch(`${config.public.apiBase}/users/settings/watermark-profile`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: backendValue
    })
    showWatermarked.value = showOriginalOnProfile
    authStore.updateUserData({ showWatermarkedInProfile: backendValue })
    preferenceSuccess.value = true
    setTimeout(() => { preferenceSuccess.value = false }, 3000)
  } catch (err) {
    console.error(err)
    toast.error('Error', 'No se pudo guardar la preferencia.')
  } finally {
    savingPreference.value = false
  }
}

async function onFileSelected(event) {
  const file = event.target.files[0]
  if (!file) return

  uploading.value = true
  try {
    const { compressImage } = useImageActions()
    const optimizedFile = await compressImage(file)

    const formData = new FormData()
    formData.append('file', optimizedFile)

    // Upload to R2 via backend
    const res = await $fetch(`${config.public.apiBase}/photos/upload-public`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${authStore.token}` },
      body: formData
    })

    const photoUrl = res.url
    // Update user profile photo
    await $fetch(`${config.public.apiBase}/users/profile-photo`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'application/json'
      },
      body: photoUrl
    })

    authStore.user.profilePhotoUrl = photoUrl
    toast.success('¡Éxito!', 'Profile photo updated!')
  } catch (e) {
    console.error(e)
    toast.error('Error de subida', 'Upload failed.')
  } finally {
    uploading.value = false
  }
}

async function updateDescription() {
    if (savingDescription.value) return
    savingDescription.value = true
    try {
        await $fetch(`${config.public.apiBase}/users/description`, {
            method: 'PUT',
            headers: { 
                Authorization: `Bearer ${authStore.token}`,
                'Content-Type': 'text/plain' 
            },
            body: descriptionText.value
        })
        authStore.updateUserData({ description: descriptionText.value })
        descriptionSuccess.value = true
        setTimeout(() => { descriptionSuccess.value = false }, 3000)
    } catch (e) {
        console.error(e)
        toast.error('Error', 'Error al guardar la biografía')
    } finally {
        savingDescription.value = false
    }
}

async function updateTitle() {
    if (savingTitle.value) return
    savingTitle.value = true
    try {
        await $fetch(`${config.public.apiBase}/users/title`, {
            method: 'PUT',
            headers: { 
                Authorization: `Bearer ${authStore.token}`,
                'Content-Type': 'text/plain' 
            },
            body: titleText.value
        })
        authStore.updateUserData({ title: titleText.value })
        titleSuccess.value = true
        setTimeout(() => { titleSuccess.value = false }, 3000)
    } catch (e) {
        console.error(e)
        toast.error('Error', 'Error al guardar la etiqueta')
    } finally {
        savingTitle.value = false
    }
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in {
  animation: fade-in 0.4s ease-out forwards;
}
</style>
