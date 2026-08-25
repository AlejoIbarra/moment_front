<template>
  <div class="ig-container pt-4 px-4">
    <!-- Breadcrumbs / Back -->
    <div class="mb-6">
      <button @click="router.push('/marketplace')" class="flex items-center text-xs font-semibold text-gray-500 hover:text-[#262626] uppercase tracking-wider">
        <Icon name="lucide:chevron-left" class="h-4 w-4 mr-1" />
        Volver al Feed
      </button>
    </div>

    <div v-if="pending" class="flex justify-center py-20">
        <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin text-gray-400" />
    </div>
    
    <div v-else-if="!event" class="text-center py-20 text-gray-500">
        Evento no encontrado.
    </div>

    <div v-else class="space-y-10 pb-20">
      <!-- Event Header -->
      <div class="ig-card p-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 relative">
        <div class="flex items-center space-x-4">
          <div class="p-3 bg-indigo-50 rounded-full">
            <Icon name="lucide:calendar" class="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 class="text-xl md:text-2xl font-bold text-[#262626]">{{ event.title }}</h1>
            <p class="text-sm text-gray-500">{{ event.location }} • {{ event.date }}</p>
          </div>
        </div>
        
        <div class="flex space-x-2 w-full md:w-auto mt-4 md:mt-0">
            <button @click="shareEvent" class="ig-button w-full md:w-auto flex items-center justify-center space-x-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
                <Icon name="lucide:share-2" class="w-4 h-4" />
                <span>Compartir</span>
            </button>
        </div>
      </div>

      <!-- Description Section -->
      <div class="max-w-2xl">
          <h3 class="text-sm font-bold text-[#262626] uppercase tracking-wider mb-2">Acerca de este evento</h3>
          <p class="text-gray-600 leading-relaxed">{{ event.description || '¡Bienvenido a la galería! Explora los momentos capturados y compra tus favoritos en alta resolución.' }}</p>
      </div>

      <!-- Package Deals Section -->
      <div v-if="authStore.isCustomer && packages.length > 0 && photos.length >= 3">
        <div class="flex items-center gap-3 mb-6">
          <div class="p-2 bg-[#3ef4a1] rounded-lg">
            <Icon name="lucide:package" class="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 class="text-sm font-bold text-[#262626] uppercase tracking-[0.2em]">Paquetes</h3>
            <p class="text-xs text-gray-500">Ahorra más comprando en cantidad</p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div v-for="pkg in availablePackages" :key="pkg.id"
            :class="[
              'relative bg-white border rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:shadow-xl group overflow-hidden',
              selectedPackage?.id === pkg.id ? 'border-indigo-500 ring-2 ring-indigo-200 shadow-lg' : 'border-gray-200 hover:border-indigo-300'
            ]"
            @click="selectPackage(pkg)">
            
            <!-- Popular badge for middle package -->
            <div v-if="pkg.photoCount === 5" class="absolute -top-0.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#3ef4a1] text-white text-[9px] font-bold uppercase tracking-widest rounded-b-lg">
              Más Popular
            </div>

            <!-- Discount badge -->
            <div class="absolute top-3 right-3">
              <span class="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full">
                -{{ pkg.discountPercentage }}%
              </span>
            </div>

            <div class="text-center pt-2">
              <div class="text-3xl mb-2">
                {{ pkg.photoCount === 3 ? '📸' : pkg.photoCount === 5 ? '🎯' : '💎' }}
              </div>
              <h4 class="text-lg font-bold text-gray-900 mb-1">{{ pkg.name }}</h4>
              <p class="text-sm text-gray-500 mb-3">{{ pkg.photoCount }} fotos</p>
              
              <!-- Estimated price -->
              <div v-if="pkg.price && parseFloat(pkg.price) > 0" class="space-y-1">
                <p class="text-xl font-bold text-indigo-600">$ {{ parseFloat(pkg.price).toFixed(2) }}</p>
                <p class="text-[10px] text-green-600 font-semibold">Precio Fijo</p>
              </div>
              <div v-else-if="avgPhotoPrice > 0" class="space-y-1">
                <p class="text-xs text-gray-400 line-through">$ {{ (avgPhotoPrice * pkg.photoCount).toFixed(2) }}</p>
                <p class="text-xl font-bold text-indigo-600">$ {{ ((avgPhotoPrice * pkg.photoCount) * (1 - pkg.discountPercentage / 100)).toFixed(2) }}</p>
                <p class="text-[10px] text-green-600 font-semibold">Ahorras $ {{ ((avgPhotoPrice * pkg.photoCount) * (pkg.discountPercentage / 100)).toFixed(2) }}</p>
              </div>
            </div>

            <!-- Selected indicator -->
            <div v-if="selectedPackage?.id === pkg.id" class="mt-4 text-center">
              <span class="text-xs font-bold text-indigo-600 flex items-center justify-center gap-1">
                <Icon name="lucide:check-circle" class="w-4 h-4" />
                Seleccionado — Elige {{ pkg.photoCount }} fotos abajo
              </span>
            </div>
          </div>
        </div>

        <!-- Selection mode banner -->
        <div v-if="selectionMode" class="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center shrink-0">
              <Icon name="lucide:mouse-pointer-click" class="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p class="text-sm font-bold text-indigo-900">Selecciona {{ selectedPackage.photoCount }} fotos</p>
              <p class="text-xs text-indigo-600">{{ selectedPhotos.length }} / {{ selectedPackage.photoCount }} seleccionadas</p>
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-end">
            <button @click="cancelSelection" class="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
              Cancelar
            </button>
            <button 
              @click="purchasePackage"
              :disabled="selectedPhotos.length !== selectedPackage.photoCount || isPurchasingPackage"
              :class="[
                'px-6 py-2 rounded-xl font-bold text-sm transition-all shadow-md',
                selectedPhotos.length === selectedPackage.photoCount 
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              ]">
              {{ isPurchasingPackage ? 'Procesando...' : 'Comprar Paquete' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Gallery Grid -->
        <div class="flex items-center justify-between border-b border-[#dbdbdb] pb-4 mb-6">
            <h2 class="text-sm font-bold text-[#262626] uppercase tracking-[0.2em]">Galería ({{ isSearching ? displayedPhotos.length : photosStore.totalPhotos }})</h2>
            <div class="flex space-x-4 text-gray-400 items-center">
                <!-- View Cart Button -->
                <button v-if="authStore.isCustomer" @click="cartStore.showCart = true" class="relative px-3 py-1.5 bg-white border border-gray-200 hover:border-indigo-500 hover:text-indigo-600 text-gray-700 font-bold rounded-lg text-xs transition-all shadow-sm flex items-center justify-center gap-1.5 mr-2">
                  <Icon name="lucide:shopping-cart" class="w-3.5 h-3.5" />
                  Ver Carrito
                  <span v-if="cartStore.items.length > 0" class="absolute -top-2 -right-2 w-4 h-4 bg-indigo-600 text-[9px] font-extrabold text-white rounded-full flex items-center justify-center animate-pulse border-2 border-white">
                    {{ cartStore.items.length }}
                  </span>
                </button>
                <Icon name="lucide:grid" class="h-5 w-5 text-[#262626] hidden sm:block" />
                <Icon name="lucide:list" class="h-5 w-5 cursor-not-allowed opacity-30 hidden sm:block" />
            </div>
        </div>

        <!-- Search Widget (Bib number / Face search) - Temporarily Disabled -->
        <div v-if="false" class="bg-gray-50/70 border border-gray-100 rounded-2xl p-4 md:p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div class="flex-1 w-full flex flex-col md:flex-row gap-4">
            <!-- Search by bib number -->
            <div class="flex-1 relative">
              <input
                v-model="bibQuery"
                type="text"
                placeholder="Buscar por número de dorsal (ej. 1203)..."
                class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                @keyup.enter="searchByBib"
              />
              <Icon name="lucide:hash" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <button
                v-if="bibQuery"
                @click="clearSearch"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                Limpiar
              </button>
            </div>
            
            <button @click="searchByBib" class="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-100 flex items-center justify-center gap-2">
              <Icon name="lucide:search" class="w-4 h-4" />
              Buscar
            </button>
          </div>
          
          <div class="h-px md:h-10 w-full md:w-px bg-gray-200"></div>
          
          <!-- Search by Face Upload button -->
          <div class="flex-shrink-0 w-full md:w-auto">
            <button @click="triggerFaceSearch" class="w-full cursor-pointer group flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 hover:border-indigo-500 hover:text-indigo-600 rounded-xl text-sm font-bold text-gray-700 shadow-sm transition-all">
              <Icon name="lucide:scan-face" class="w-5 h-5 text-indigo-500 group-hover:scale-110 transition-transform" />
              Buscar por Rostro
            </button>
            <input
              ref="faceInput"
              type="file"
              accept="image/*"
              class="hidden"
              @change="handleFaceUpload"
            />
          </div>
        </div>

        <div v-if="isSearching" class="mb-6 flex justify-between items-center bg-indigo-50/55 border border-indigo-100 p-4 rounded-xl">
          <p class="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
            <Icon name="lucide:filter-x" class="w-4 h-4 text-indigo-500" />
            Resultados de búsqueda: {{ displayedPhotos.length }} fotos encontradas
          </p>
          <button @click="clearSearch" class="text-xs font-bold text-indigo-600 hover:underline">Mostrar todo</button>
        </div>

        <div v-if="pendingPhotos && photos.length === 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div v-for="i in 6" :key="i" class="aspect-square bg-gray-200 animate-pulse rounded-lg border border-gray-100"></div>
        </div>
        
        <div v-else-if="photos.length === 0" class="text-center py-20 bg-white border border-dashed border-gray-200 rounded-lg text-gray-400">
            Aún no se han subido fotos.
        </div>

        <!-- Gallery Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <div v-for="photo in displayedPhotos" :key="photo.id" 
            :class="[
              'group bg-white rounded-lg border overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer relative',
              selectionMode ? 'ring-2' : 'border-[#dbdbdb]',
              isPhotoSelected(photo.id) ? 'ring-indigo-500 border-indigo-500' : selectionMode ? 'ring-transparent border-[#dbdbdb]' : ''
            ]"
            @click="handlePhotoClick(photo)">

            <!-- Shopping Cart Icon for individual selection -->
            <div v-if="!selectionMode && authStore.isCustomer" class="absolute top-3 left-3 z-10">
              <button @click.stop="toggleCartItem(photo)" :class="[
                'w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md',
                isPhotoInCart(photo.id) 
                  ? 'bg-indigo-600 border-indigo-600 text-white' 
                  : 'bg-white/80 hover:bg-white border-white text-gray-700'
              ]">
                <Icon name="lucide:shopping-cart" class="w-4 h-4" />
              </button>
            </div>

            <!-- Selection checkbox overlay -->
            <div v-if="selectionMode" class="absolute top-3 left-3 z-10">
              <div v-if="isPhotoInCart(photo.id) && !isPhotoSelected(photo.id)" class="w-7 h-7 rounded-full border-2 border-emerald-500 bg-emerald-500 text-white flex items-center justify-center shadow-md">
                <Icon name="lucide:check-check" class="w-4 h-4" />
              </div>
              <div v-else :class="[
                'w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all shadow-md',
                isPhotoSelected(photo.id) 
                  ? 'bg-indigo-600 border-indigo-600 text-white' 
                  : 'bg-white/80 backdrop-blur-sm border-white text-transparent'
              ]">
                <Icon name="lucide:check" class="w-4 h-4" />
              </div>
            </div>

            <!-- Selection number badge -->
            <div v-if="selectionMode && isPhotoSelected(photo.id)" class="absolute top-3 right-3 z-10">
              <span class="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center shadow-md">
                {{ getSelectionIndex(photo.id) }}
              </span>
            </div>

            <!-- Photo Wrapper -->
            <div class="aspect-square bg-gray-50 relative overflow-hidden">
                <!-- Already in cart overlay -->
                <div v-if="selectionMode && isPhotoInCart(photo.id) && !isPhotoSelected(photo.id)" class="absolute inset-0 bg-emerald-500/20 z-10 pointer-events-none"></div>

                <!-- Similarity Match Badge -->
                <div v-if="photo.similarity" class="absolute top-3 left-3 bg-[#3ef4a1] text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md z-10 flex items-center gap-1">
                  <Icon name="lucide:sparkles" class="w-3 h-3 animate-pulse" />
                  {{ (photo.similarity * 100).toFixed(1) }}% Match
                </div>

                <!-- Detected Bib Badge -->
                <div v-if="photo.bibNumbers && photo.bibNumbers.trim()" class="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-bold shadow-md z-10 flex items-center gap-1 border border-white/20">
                  <Icon name="lucide:hash" class="w-3 h-3 text-amber-400" />
                  Dorsal: {{ photo.bibNumbers.replace(/[\[\]"]/g, '') }}
                </div>

                <img :src="photo.watermarkedR2Url" loading="lazy" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div class="absolute top-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-bold" :class="{ 'hidden': selectionMode && (isPhotoSelected(photo.id) || isPhotoInCart(photo.id)) }">$ {{ photo.price.toFixed(2) }}</div>
            </div>
          </div>
        </div>

        <!-- Infinite Scroll Sentinel for Photos -->
        <div ref="photosSentinel" class="w-full h-20 flex items-center justify-center mt-8">
            <div v-if="photosStore.loading && photos.length > 0" class="flex items-center text-gray-400">
                <Icon name="lucide:loader-2" class="h-6 w-6 animate-spin mr-2" />
                <span class="text-sm font-medium">Cargando más fotos...</span>
            </div>
        </div>
      </div>

      <!-- Lightbox & Comments Overlay (only when not in selection mode) -->
      <div v-if="selectedPhoto && !selectionMode" class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-8" @click.self="closeLightbox">
        <button @click="closeLightbox" class="absolute top-6 right-6 text-white/70 hover:text-white">
          <Icon name="lucide:x" class="h-8 w-8" />
        </button>

        <div class="bg-white w-full max-w-6xl h-full max-h-[85vh] rounded-xl overflow-hidden flex flex-col md:flex-row shadow-2xl" @click.stop>
          <!-- Left: Photo View -->
          <div class="flex-1 bg-black flex items-center justify-center relative group">
            <img :src="selectedPhoto.watermarkedR2Url" class="max-w-full max-h-full object-contain" />
            
            <div class="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-4 z-[99] pointer-events-auto">

                <button v-if="authStore.isCustomer" @click.stop="toggleCartItem(selectedPhoto)" :class="[
                  'px-6 py-2 rounded-full font-bold shadow-lg flex items-center space-x-2 transition-all',
                  isPhotoInCart(selectedPhoto.id)
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-white text-[#262626] hover:bg-gray-50'
                ]">
                    <Icon name="lucide:shopping-cart" class="h-5 w-5" />
                    <span>{{ isPhotoInCart(selectedPhoto.id) ? 'En el Carrito' : 'Añadir al Carrito' }}</span>
                </button>
            </div>
          </div>

          <!-- Right: Social & Comments -->
          <div class="w-full md:w-[400px] flex flex-col h-full bg-white border-l border-gray-100">
                        <!-- Photographer Info -->
                        <div class="p-4 border-b border-gray-100 flex items-center justify-between">
                            <div class="flex items-center gap-3">
                                <div class="w-8 h-8 rounded-full bg-indigo-50 border border-gray-100 flex items-center justify-center overflow-hidden">
                                     <img v-if="event.photographerProfilePhotoUrl" :src="event.photographerProfilePhotoUrl" alt="Photographer" class="w-full h-full object-cover">
                                     <span v-else class="text-xs font-bold text-indigo-600">{{ event.photographerUsername?.charAt(0).toUpperCase() }}</span>
                                </div>
                                <span class="text-sm font-bold text-gray-900">{{ event.photographerUsername }}</span>
                            </div>
                            <button class="text-xs font-bold text-indigo-600 hover:text-indigo-700">Seguir</button>
                        </div>

            <!-- Like Action -->
            <div class="p-4 border-b border-gray-50 flex items-center justify-between">
                <div class="flex items-center gap-4">
                    <button @click="handleTogglePhotoLike" class="transition-transform active:scale-90">
                        <Icon 
                          :name="selectedPhoto.isLiked ? 'lucide:heart' : 'lucide:heart'" 
                          :class="['w-7 h-7', selectedPhoto.isLiked ? 'text-red-500 fill-current' : 'text-gray-900']" 
                        />
                    </button>
                    <button @click="focusCommentInput" class="hover:text-gray-500">
                        <Icon name="lucide:message-circle" class="w-7 h-7" />
                    </button>
                    <button class="hover:text-gray-500">
                        <Icon name="lucide:send" class="w-7 h-7" />
                    </button>
                </div>
                <button class="hover:text-gray-500">
                    <Icon name="lucide:bookmark" class="w-7 h-7" />
                </button>
            </div>

            <div class="px-4 py-2 border-b border-gray-50">
                <p class="text-sm font-bold text-gray-900">{{ selectedPhoto.likesCount || 0 }} Me gusta</p>
                <p class="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{{ formatDate(selectedPhoto.createdAt) }}</p>
            </div>

            <!-- Comments Section Component -->
            <CommentSection 
                :comments="comments"
                :is-submitting="postingComment"
                :current-username="authStore.user?.username"
                @submit="postComment"
                @delete="deleteComment"
                @like="handleCommentLike"
            />
          </div>
        </div>
      </div>


    <!-- ── Payment Confirmation Modal ─────────────────── -->
    <PaymentModal
      v-model="showPaymentModal"
      :title="paymentModalTitle"
      :price="paymentModalPrice"
      :photo-url="paymentModalPhotoUrl"
      :photo-count="paymentModalPhotoCount"
      :has-subscription="paymentModalHasSub"
      :free-remaining="paymentModalFreeRemaining"
      :is-loading="paymentModalLoading"
      @cancel="showPaymentModal = false"
      @confirm="handlePaymentConfirm"
    />

    <!-- Face Scanner Animation Modal -->
    <div v-if="scanning" class="fixed inset-0 z-[120] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6">
      <div class="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
        <!-- Preview image -->
        <img v-if="selfiePreview" :src="selfiePreview" class="w-full h-full object-cover opacity-80" />
        
        <!-- Laser line -->
        <div class="absolute inset-x-0 h-1 bg-[#3ef4a1] shadow-lg shadow-indigo-500/50 animate-laser"></div>
        
        <!-- Grid overlay -->
        <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
      </div>
      
      <div class="mt-8 text-center max-w-sm">
        <h3 class="text-white font-extrabold text-lg flex items-center justify-center gap-2">
          <Icon name="lucide:loader-2" class="w-5 h-5 animate-spin text-indigo-400" />
          {{ scanStatus }}
        </h3>
        <p class="text-slate-400 text-xs mt-2">Analizando características y rasgos faciales para encontrar tus mejores momentos en el evento...</p>
      </div>
    </div>

    <!-- Face Search Selector Modal -->
    <div v-if="showFaceSearchSelector" class="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" @click.self="showFaceSearchSelector = false">
      <div class="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl relative">
        <button @click="showFaceSearchSelector = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <Icon name="lucide:x" class="w-6 h-6" />
        </button>
        <h3 class="text-lg font-bold text-gray-900 mb-2 text-center">Búsqueda por Rostro</h3>
        <p class="text-sm text-gray-500 mb-6 text-center">Selecciona cómo deseas capturar tu rostro para buscar tus fotos.</p>
        
        <div class="space-y-3">
          <button @click="startCamera" class="w-full flex items-center justify-center gap-3 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md">
            <Icon name="lucide:camera" class="w-5 h-5" />
            Tomar Foto con Cámara
          </button>
          
          <button @click="triggerFileUpload" class="w-full flex items-center justify-center gap-3 py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 font-bold rounded-xl transition-all">
            <Icon name="lucide:image" class="w-5 h-5 text-gray-500" />
            Subir desde Galería / Archivos
          </button>
        </div>
      </div>
    </div>

    <!-- Webcam Capture Modal -->
    <div v-if="showCameraModal" class="fixed inset-0 z-[110] bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-4">
      <div class="bg-slate-900 rounded-3xl overflow-hidden max-w-md w-full shadow-2xl relative border border-slate-800">
        <!-- Close Button -->
        <button @click="stopCamera" class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors">
          <Icon name="lucide:x" class="w-6 h-6" />
        </button>
        
        <!-- Video Stream Container -->
        <div class="relative aspect-square w-full bg-black flex items-center justify-center">
          <video ref="videoElement" autoplay playsinline class="w-full h-full object-cover scale-x-[-1]"></video>
          <!-- Selfie Target Outline -->
          <div class="absolute inset-8 border-2 border-dashed border-white/40 rounded-full pointer-events-none flex items-center justify-center">
            <div class="text-[10px] text-white/50 font-bold uppercase tracking-widest bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm">Ubica tu rostro aquí</div>
          </div>
        </div>

        <div class="p-6 text-center bg-slate-950">
          <h4 class="text-white font-bold mb-1">Cámara en Vivo</h4>
          <p class="text-slate-400 text-xs mb-6">Asegúrate de tener buena iluminación para mejores resultados.</p>
          
          <button @click="capturePhoto" class="w-16 h-16 rounded-full bg-white hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center mx-auto shadow-lg shadow-white/10 ring-4 ring-indigo-500/30">
            <div class="w-12 h-12 rounded-full border-4 border-slate-950 bg-white"></div>
          </button>
        </div>
        </div>
      </div>
    <!-- Floating Bottom Bar for Package/Photo Selection -->
    <div v-if="selectionMode" class="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] sm:w-[90%] max-w-2xl bg-white border border-gray-100 rounded-2xl shadow-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up">
      <div class="flex items-center gap-3 w-full sm:w-auto">
        <div class="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center shrink-0">
          <Icon name="lucide:mouse-pointer-click" class="w-5 h-5 text-indigo-600 animate-pulse" />
        </div>
        <div class="flex-1">
          <p class="text-xs font-bold text-gray-400 uppercase tracking-wider">Llevas {{ selectedPhotos.length }} de {{ selectedPackage.photoCount }}</p>
          <p class="text-sm font-bold text-gray-900 truncate">{{ selectedPackage.name }}</p>
        </div>
      </div>
      <div class="flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 w-full sm:w-auto">
        <button @click="cancelSelection" class="px-3 py-2 text-xs font-bold text-gray-500 hover:text-gray-700 transition-colors shrink-0">
          Cancelar
        </button>
        <button 
          @click="addPackageToCart"
          :disabled="selectedPhotos.length !== selectedPackage.photoCount"
          :class="[
            'px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5',
            selectedPhotos.length === selectedPackage.photoCount 
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          ]">
          <Icon name="lucide:shopping-cart" class="w-3.5 h-3.5" />
          Añadir al Carrito
        </button>
        <button 
          @click="purchasePackage"
          :disabled="selectedPhotos.length !== selectedPackage.photoCount || isPurchasingPackage"
          :class="[
            'px-4 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1',
            selectedPhotos.length === selectedPackage.photoCount 
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white active:scale-95' 
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          ]">
          Comprar Ahora
        </button>
      </div>
    </div>

    <!-- Guest Registration Prompt Modal -->
    <div v-if="showRegisterPrompt" class="fixed inset-0 z-[130] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div class="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative text-center animate-scale-up">
        <div class="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="lucide:user-plus" class="w-8 h-8 text-indigo-600" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">¡Bienvenido a Moments!</h3>
        <p class="text-gray-500 mb-8 text-sm">Regístrate gratis para comprar fotos en alta resolución, guardarlas en tu carrito y acceder a increíbles descuentos por paquetes.</p>
        
        <div class="space-y-3">
          <button @click="router.push('/register')" class="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all active:scale-95">
            Registrarse Gratis
          </button>
          
          <button @click="closeRegisterPrompt" class="w-full py-2 text-xs font-semibold text-gray-400 hover:text-gray-600 transition-colors mt-2">
            Seguir sin registrarse
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useEventsStore } from '~/stores/events'
import { usePhotosStore } from '~/stores/photos'
import { usePackagesStore } from '~/stores/packages'
import { useIntersectionObserver } from '@vueuse/core'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const walletStore = useWalletStore()
const eventsStore = useEventsStore()
const photosStore = usePhotosStore()
const packagesStore = usePackagesStore()
const cartStore = useCartStore()
const { confirm } = useConfirm()
const toast = useToast()
const swal = useSwal()

const eventId = route.params.id
const event = ref(null)
const isBuying = ref(null)

const config = useRuntimeConfig()

// Super SEO Metadata automatizado para cada evento
useSeoMeta({
  title: () => event.value ? `${event.value.title} | Galería Moments` : 'Cargando Evento... | Moments',
  ogTitle: () => event.value ? `${event.value.title} - Moments` : 'Galería de Fotos - Moments',
  ogUrl: () => eventId ? `https://www.moments-gallery.com/marketplace/events/${eventId}` : 'https://www.moments-gallery.com',
  description: () => event.value ? (event.value.description || `Explora y compra las fotos profesionales del evento ${event.value.title} en ${event.value.location}. Escanea tu dorsal o rostro para encontrarte fácilmente.`) : 'Explora y compra fotografías profesionales de eventos.',
  ogDescription: () => event.value ? (event.value.description || `Explora y compra las fotos profesionales del evento ${event.value.title} en ${event.value.location}. Escanea tu dorsal o rostro para encontrarte fácilmente.`) : 'Explora y compra fotografías profesionales de eventos.',
  ogImage: () => eventId ? `${config.public.apiBase}/events/${eventId}/og-image` : 'https://www.moments-gallery.com/og-image.png',
  twitterCard: 'summary_large_image',
  twitterTitle: () => event.value ? `${event.value.title} | Moments` : 'Galería de Fotos | Moments',
  twitterDescription: () => event.value ? `Encuentra tus mejores fotos en ${event.value.title} mediante búsqueda por dorsal y reconocimiento facial.` : 'Explora y compra fotos de eventos en Moments.',
  twitterImage: () => eventId ? `${config.public.apiBase}/events/${eventId}/og-image` : 'https://www.moments-gallery.com/og-image.png',
})

useHead({
  script: [
    { src: 'https://checkout.wompi.co/widget.js' },
    { src: 'https://checkout.wompi.co/widget.js' }
  ]
})

const photosSentinel = ref(null)

const selectedPhoto = ref(null)
const comments = ref([])
const loadingComments = ref(false)
const newComment = ref('')
const postingComment = ref(false)

// Photo Search by Bib number / Face Image
const bibQuery = ref('')
const isSearching = ref(false)
const searchResults = ref([])
const scanning = ref(false)
const scanStatus = ref('')
const selfiePreview = ref('')
const faceInput = ref(null)

// ── Payment Modal state ──────────────────────────────────
const showPaymentModal        = ref(false)
const paymentModalTitle       = ref('Comprar Foto')
const paymentModalPrice       = ref(0)
const paymentModalPhotoUrl    = ref(null)
const paymentModalPhotoCount  = ref(1)
const paymentModalHasSub      = ref(false)
const paymentModalFreeRemaining = ref(0)
const paymentModalLoading     = ref(false)
// Internal refs used by handlePaymentConfirm to know which action to run
const _pendingPhoto    = ref(null)
const _pendingPackage  = ref(null)

const showFaceSearchSelector = ref(false)
const showCameraModal = ref(false)
const videoStream = ref(null)
const videoElement = ref(null)

const showRegisterPrompt = ref(false)

function closeRegisterPrompt() {
    showRegisterPrompt.value = false
    localStorage.setItem('skip_register_prompt', 'true')
}

function triggerFaceSearch() {
  if (!authStore.isAuthenticated) {
    toast.error('Inicia sesión', 'Debes iniciar sesión para usar la búsqueda por rostro.')
    router.push('/login')
    return
  }
  showFaceSearchSelector.value = true
}

function triggerFileUpload() {
  showFaceSearchSelector.value = false
  faceInput.value.click()
}

async function startCamera() {
  showFaceSearchSelector.value = false
  showCameraModal.value = true
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
    videoStream.value = stream
    nextTick(() => {
      if (videoElement.value) {
        videoElement.value.srcObject = stream
      }
    })
  } catch (err) {
    console.error('Error accessing camera:', err)
    toast.error('Error de Cámara', 'No se pudo acceder a la cámara. Por favor selecciona subir una imagen.')
    showCameraModal.value = false
  }
}

function stopCamera() {
  if (videoStream.value) {
    videoStream.value.getTracks().forEach(track => track.stop())
    videoStream.value = null
  }
  showCameraModal.value = false
}

function capturePhoto() {
  const video = videoElement.value
  if (!video) return

  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

  canvas.toBlob((blob) => {
    if (blob) {
      const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' })
      stopCamera()
      processFaceSearch(file)
    }
  }, 'image/jpeg', 0.95)
}

async function searchByBib() {
  if (!bibQuery.value.trim()) {
    clearSearch()
    return
  }
  isSearching.value = true
  photosStore.loading = true
  try {
    const data = await $fetch(`${useRuntimeConfig().public.apiBase}/events/${event.value.id}/photos/search?bibNumber=${bibQuery.value.trim()}`, {
      headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}
    })
    searchResults.value = data
  } catch (e) {
    console.error(e)
    toast.error('Error', 'No se pudieron buscar fotos por número.')
    searchResults.value = []
  } finally {
    photosStore.loading = false
  }
}

function clearSearch() {
  bibQuery.value = ''
  isSearching.value = false
  searchResults.value = []
}

async function processFaceSearch(file) {
  if (!file) return

  // Preview
  selfiePreview.value = URL.createObjectURL(file)
  scanning.value = true
  scanStatus.value = 'Iniciando escáner facial...'

  const steps = [
    { status: 'Buscando rostro...', time: 1000 },
    { status: 'Extrayendo puntos característicos...', time: 2200 },
    { status: 'Comparando con fotos del evento...', time: 3500 },
    { status: '¡Búsqueda finalizada!', time: 4500 }
  ]

  for (const step of steps) {
    await new Promise(resolve => setTimeout(resolve, step.time - (steps[steps.indexOf(step)-1]?.time || 0)))
    scanStatus.value = step.status
  }

  // Now call backend API
  try {
    const formData = new FormData()
    formData.append('file', file)

    const data = await $fetch(`${useRuntimeConfig().public.apiBase}/events/${event.value.id}/photos/search-by-face`, {
      method: 'POST',
      body: formData,
      headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}
    })

    searchResults.value = data.map(item => ({
      ...item.photo,
      similarity: item.similarity
    }))
    isSearching.value = true
  } catch (e) {
    console.error(e)
    toast.error('Error', 'No se pudieron buscar fotos por rostro.')
    searchResults.value = []
    isSearching.value = false
  } finally {
    scanning.value = false
    selfiePreview.value = ''
  }
}

async function handleFaceUpload(evt) {
  const file = evt.target.files[0]
  if (!file) return
  processFaceSearch(file)
}

// Package selection state
const selectedPackage = ref(null)
const selectedPhotos = ref([])
const selectionMode = ref(false)
const isPurchasingPackage = ref(false)
const giftCardCode = ref('')
const isLocalhost = ref(typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))

const loadingEvent = ref(true)

onMounted(async () => {
    loadingEvent.value = true
    try {
        if (authStore.isAuthenticated) {
            await walletStore.fetchBalance()
        } else {
            const hasSkipped = localStorage.getItem('skip_register_prompt')
            if (!hasSkipped) {
                setTimeout(() => {
                    showRegisterPrompt.value = true
                }, 1500)
            }
        }
        await fetchEvent()
        if (event.value) {
            await photosStore.fetchPhotosByEvent(event.value.id, 0)
            await packagesStore.fetchPackagesForEvent(event.value.id)
        }
    } finally {
        loadingEvent.value = false
    }
})

useIntersectionObserver(
    photosSentinel,
    ([{ isIntersecting }]) => {
        if (isIntersecting && photosStore.hasMore && !photosStore.loading && event.value) {
            photosStore.fetchPhotosByEvent(event.value.id, photosStore.currentPage + 1)
        }
    },
    { threshold: 0.5 }
)

const photos = computed(() => photosStore.eventPhotos)
const displayedPhotos = computed(() => {
  if (isSearching.value) {
    return searchResults.value
  }
  return photos.value
})
const pending = computed(() => loadingEvent.value)
const pendingPhotos = computed(() => photosStore.loading)
const packages = computed(() => packagesStore.eventPackages)

// Only show packages where enough photos exist in the event
const availablePackages = computed(() => {
  return packages.value.filter(pkg => photos.value.length >= pkg.photoCount)
})

const avgPhotoPrice = computed(() => {
  if (photos.value.length === 0) return 0
  const total = photos.value.reduce((sum, p) => sum + p.price, 0)
  return total / photos.value.length
})

function selectPackage(pkg) {
  if (selectedPackage.value?.id === pkg.id) {
    cancelSelection()
    return
  }
  selectedPackage.value = pkg
  selectedPhotos.value = []
  selectionMode.value = true
}

function cancelSelection() {
  selectedPackage.value = null
  selectedPhotos.value = []
  selectionMode.value = false
}

function isPhotoSelected(photoId) {
  return selectedPhotos.value.includes(photoId)
}

function getSelectionIndex(photoId) {
  return selectedPhotos.value.indexOf(photoId) + 1
}

function handlePhotoClick(photo) {
  if (selectionMode.value) {
    togglePhotoSelection(photo.id)
  } else {
    openLightbox(photo)
  }
}

function addPackageToCart() {
  if (!selectedPackage.value || selectedPhotos.value.length !== selectedPackage.value.photoCount) return

  const packagePhotos = photos.value.filter(p => selectedPhotos.value.includes(p.id))

  const pkg = selectedPackage.value
  let computedPrice = 0
  if (pkg.price && parseFloat(pkg.price) > 0) {
    computedPrice = parseFloat(pkg.price)
  } else if (avgPhotoPrice.value > 0) {
    computedPrice = (avgPhotoPrice.value * pkg.photoCount) * (1 - pkg.discountPercentage / 100)
  }

  const cartItemId = `package-${event.value.id}-${pkg.id}-${Date.now()}`

  const cartItem = {
    id: cartItemId,
    type: 'package',
    price: computedPrice,
    package: pkg,
    photos: packagePhotos,
    event: {
      id: event.value.id,
      title: event.value.title,
      photographer: {
        username: event.value.photographerUsername
      }
    }
  }

  cartStore.addToCart(cartItem)
  toast.success('Agregado', 'Paquete agregado al carrito.')
  cancelSelection()
}

function isPhotoInCart(photoId) {
  return cartStore.items.some(item => {
    if (item.id === photoId) return true;
    if (item.type === 'package' && item.photos) {
      return item.photos.some(p => p.id === photoId);
    }
    return false;
  })
}

function toggleCartItem(photo) {
  if (isPhotoInCart(photo.id)) {
    // Note: if it's in a package, this will attempt to remove the photo.id which doesn't exist individually, but we shouldn't show the toggle anyway.
    cartStore.removeFromCart(photo.id)
    toast.success('Eliminado', 'Foto eliminada del carrito.')
  } else {
    const item = {
      ...photo,
      event: {
        id: event.value.id,
        title: event.value.title,
        photographer: {
          username: event.value.photographerUsername
        }
      }
    }
    cartStore.addToCart(item)
    toast.success('Agregado', 'Foto agregada al carrito.')
  }
}

function togglePhotoSelection(photoId) {
  if (isPhotoInCart(photoId) && !selectedPhotos.value.includes(photoId)) {
    toast.info('Ya seleccionada', 'Esta foto ya está en tu carrito de compras (individual o en otro paquete).')
    return
  }
  const index = selectedPhotos.value.indexOf(photoId)
  if (index > -1) {
    selectedPhotos.value.splice(index, 1)
  } else if (selectedPhotos.value.length < selectedPackage.value.photoCount) {
    selectedPhotos.value.push(photoId)
  }
}

async function purchasePackage() {
  if (!selectedPackage.value || selectedPhotos.value.length !== selectedPackage.value.photoCount) return

  if (!authStore.isAuthenticated) {
    toast.warning('Inicia sesión', 'Debes iniciar sesión para comprar fotos.')
    router.push(`/login?redirect=${route.fullPath}`)
    return
  }
  if (!authStore.isCustomer) {
    toast.error('Acceso denegado', 'Solo las cuentas de clientes pueden comprar paquetes.')
    return
  }

  // Compute actual price: use fixed price if set, else calculate from avg photo price + discount
  const pkg = selectedPackage.value
  let computedPrice = 0
  if (pkg.price && parseFloat(pkg.price) > 0) {
    computedPrice = parseFloat(pkg.price)
  } else if (avgPhotoPrice.value > 0) {
    const base = avgPhotoPrice.value * pkg.photoCount
    computedPrice = base * (1 - pkg.discountPercentage / 100)
  }

  // Open the premium PaymentModal
  _pendingPhoto.value             = null
  _pendingPackage.value           = { pkg, photoIds: [...selectedPhotos.value] }
  paymentModalTitle.value         = `Comprar Paquete — ${pkg.name}`
  paymentModalPrice.value         = computedPrice
  paymentModalPhotoUrl.value      = null
  paymentModalPhotoCount.value    = pkg.photoCount
  paymentModalHasSub.value        = false
  paymentModalFreeRemaining.value = 0
  showPaymentModal.value          = true
}

async function _executePurchasePackage(pendingPkg, payload) {
  isPurchasingPackage.value = true
  paymentModalLoading.value = true
  try {
    const result = await packagesStore.buyPackage(
      pendingPkg.pkg.id,
      event.value.id,
      pendingPkg.photoIds,
      payload.giftCardCode
    )

    showPaymentModal.value = false

    if (result.publicKey && result.reference) {
      if (typeof window === 'undefined' || !window.WidgetCheckout) {
        toast.error('Error', 'La pasarela de pago Wompi aún se está cargando. Espera un momento y reintenta.')
        isPurchasingPackage.value = false
        return
      }
      const checkoutOptions = {
        publicKey: result.publicKey,
        currency: result.currency,
        amountInCents: result.amountInCents,
        reference: result.reference,
        redirectUrl: window.location.origin + '/payment/success',
        customerData: { email: result.customerEmail }
      }
      if (result.signature) checkoutOptions.signature = { integrity: result.signature }
      const checkout = new window.WidgetCheckout(checkoutOptions)
      checkout.open((res) => {
        if (res.transaction?.status === 'APPROVED') router.push('/payment/success')
      })
      isPurchasingPackage.value = false
      cancelSelection()
      return
    }

    // Covered immediately by gift card
    swal.fire({
      title: '¡Compra de Paquete exitosa!',
      text: `🎉 ${result.message}\n¿Qué deseas hacer ahora?`,
      icon: 'success',
      showCancelButton: true,
      showDenyButton: true,
      confirmButtonText: 'Descargar Originales',
      denyButtonText: 'Ir a Mis Fotos',
      cancelButtonText: 'Seguir Navegando',
      confirmButtonColor: '#4f46e5',
      denyButtonColor: '#10b981',
      cancelButtonColor: '#6b7280'
    }).then((swalResult) => {
      if (swalResult.isConfirmed && result.presignedUrls) result.presignedUrls.forEach(url => window.open(url, '_blank'))
      else if (swalResult.isDenied) router.push('/dashboard/customer')
    })

    cancelSelection()
  } catch (e) {
    const errMsg = e.response?._data?.error || e.response?._data || 'La compra del paquete falló'
    swal.fire({ title: 'Error', text: errMsg, icon: 'error' })
  } finally {
    isPurchasingPackage.value = false
    paymentModalLoading.value = false
  }
}

// Unified handler called by PaymentModal @confirm event
async function handlePaymentConfirm(payload) {
  if (_pendingPhoto.value) {
    await _executeBuyPhoto(_pendingPhoto.value, payload)
  } else if (_pendingPackage.value) {
    await _executePurchasePackage(_pendingPackage.value, payload)
  }
}

async function fetchEvent() {
    event.value = await eventsStore.fetchEventById(eventId)
}

async function shareEvent() {
    const shareData = {
        title: event.value ? `${event.value.title} | Moments` : 'Galería de Fotos | Moments',
        text: '¡Mira este evento en Moments Gallery!',
        url: window.location.href,
    }
    
    if (navigator.share) {
        try {
            await navigator.share(shareData)
        } catch (err) {
            console.error('Error sharing:', err)
        }
    } else {
        try {
            await navigator.clipboard.writeText(shareData.url)
            toast.success('¡Enlace copiado!', 'El enlace del evento ha sido copiado al portapapeles.')
        } catch (err) {
            console.error('Failed to copy: ', err)
            toast.error('Error', 'No se pudo copiar el enlace.')
        }
    }
}

async function buyPhoto(photo) {
    if (!authStore.isAuthenticated) {
        toast.warning('Inicia sesión', 'Debes iniciar sesión para comprar la foto.')
        router.push(`/login?redirect=${route.fullPath}`)
        return
    }
    if (!authStore.isCustomer) {
        toast.error('Acceso denegado', 'Solo las cuentas de clientes pueden comprar fotos.')
        return
    }

    let hasSub = false
    let freeRemaining = 0
    try {
        const sub = await $api('/subscriptions/active')
        if (sub && sub.active && sub.freePhotosRemaining > 0) {
            hasSub = true
            freeRemaining = sub.freePhotosRemaining
        }
    } catch (e) {
        console.error('No active subscription found', e)
    }

    // Open the premium PaymentModal
    _pendingPhoto.value           = photo
    _pendingPackage.value         = null
    paymentModalTitle.value       = 'Comprar Foto'
    paymentModalPrice.value       = parseFloat(photo.price)
    paymentModalPhotoUrl.value    = photo.watermarkedR2Url
    paymentModalPhotoCount.value  = 1
    paymentModalHasSub.value      = hasSub
    paymentModalFreeRemaining.value = freeRemaining
    showPaymentModal.value        = true
}

async function _executeBuyPhoto(photo, payload) {
    isBuying.value = photo.id
    paymentModalLoading.value = true
    try {
        const config = useRuntimeConfig()
        const res = await $fetch(`${config.public.apiBase}/payment/buy`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${authStore.token}` },
            body: {
                photoId: photo.id,
                useSubscription: payload.useSubscription,
                giftCardCode: payload.giftCardCode
            }
        })

        showPaymentModal.value = false

        if (res.publicKey && res.reference) {
            if (typeof window === 'undefined' || !window.WidgetCheckout) {
                toast.error('Error', 'La pasarela de pago Wompi aún se está cargando. Espera un momento y reintenta.')
                return
            }
            const checkoutOptions = {
                publicKey: res.publicKey,
                currency: res.currency,
                amountInCents: res.amountInCents,
                reference: res.reference,
                redirectUrl: window.location.origin + '/payment/success',
                customerData: { email: res.customerEmail }
            }
            if (res.signature) checkoutOptions.signature = { integrity: res.signature }
            const checkout = new window.WidgetCheckout(checkoutOptions)
            checkout.open((widgetRes) => {
                if (widgetRes.transaction?.status === 'APPROVED') router.push('/payment/success')
            })
            return
        }

        // Covered immediately by sub / gift card
        swal.fire({
            title: '¡Compra exitosa!',
            text: '¿Qué deseas hacer ahora?',
            icon: 'success',
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonText: 'Ver Foto Original',
            denyButtonText: 'Ir a Mis Fotos',
            cancelButtonText: 'Seguir Navegando',
            confirmButtonColor: '#4f46e5',
            denyButtonColor: '#10b981',
            cancelButtonColor: '#6b7280'
        }).then((result) => {
            if (result.isConfirmed && res.presignedUrl) window.open(res.presignedUrl, '_blank')
            else if (result.isDenied) router.push('/dashboard/customer')
        })
    } catch (e) {
        toast.error('Error', e.response?._data?.error || e.response?._data || 'La compra falló')
    } finally {
        isBuying.value = null
        paymentModalLoading.value = false
    }
}

async function openLightbox(photo) {
    selectedPhoto.value = photo
    document.body.style.overflow = 'hidden'
    await fetchComments()
}

function closeLightbox() {
    selectedPhoto.value = null
    document.body.style.overflow = ''
}

async function fetchComments() {
    if (!selectedPhoto.value) return
    loadingComments.value = true
    try {
        const config = useRuntimeConfig()
        const headers = authStore.isAuthenticated ? { Authorization: `Bearer ${authStore.token}` } : {}
        const data = await $fetch(`${config.public.apiBase}/comments/photo/${selectedPhoto.value.id}`, {
            headers
        })
        comments.value = data
    } catch (e) {
        console.error('Error fetching comments:', e)
    } finally {
        loadingComments.value = false
    }
}

async function postComment(content) {
    if (!content || postingComment.value) return
    postingComment.value = true
    try {
        const config = useRuntimeConfig()
        const data = await $fetch(`${config.public.apiBase}/comments/photo/${selectedPhoto.value.id}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authStore.token}`,
                'Content-Type': 'application/json'
            },
            body: { content }
        })
        comments.value.unshift(data)
    } catch (e) {
        toast.error('Error', 'Error al publicar comentario')
    } finally {
        postingComment.value = false
    }
}

async function deleteComment(commentId) {
    const ok = await confirm({
        title: '¿Eliminar comentario?',
        message: '¿Estás seguro de que quieres eliminar este comentario?'
    })
    if (ok) {
        try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/comments/${commentId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authStore.token}`
            }
        })
        comments.value = comments.value.filter(c => c.id !== commentId)
    } catch (e) {
        toast.error('Error', 'Error al eliminar comentario')
    }
  }
}

async function handleCommentLike(commentId) {
    if (!authStore.isAuthenticated) {
        router.push('/login')
        return
    }
    const res = await eventsStore.toggleCommentLike(commentId)
    if (res) {
        const comment = comments.value.find(c => c.id === commentId)
        if (comment) {
            comment.isLiked = res.isLiked
            comment.likesCount = res.likesCount
        }
    }
}

async function handleTogglePhotoLike() {
    if (!authStore.isAuthenticated) {
        router.push('/login')
        return
    }
    const res = await photosStore.toggleLike(selectedPhoto.value.id)
    if (res) {
        selectedPhoto.value.isLiked = res.liked
        selectedPhoto.value.likesCount = res.likesCount
    }
}

function focusCommentInput() {
    // This will depend on implementation of CommentSection, but for now just a placeholder
}

function formatDate(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
</script>

<style scoped>
@keyframes laser {
  0% { top: 0%; }
  50% { top: 100%; }
  100% { top: 0%; }
}
.animate-laser {
  animation: laser 3s infinite linear;
}
@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
</style>
