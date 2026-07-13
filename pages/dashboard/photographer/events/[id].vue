<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <!-- Event Header -->
    <div class="mb-8 border-b border-gray-100 pb-8">
      <div class="flex items-center gap-4 mb-6">
        <button @click="$router.push('/dashboard/photographer')" class="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Icon name="lucide:arrow-left" class="w-6 h-6 text-gray-800" />
        </button>
        <h2 class="text-2xl font-bold text-gray-900" v-if="event">{{ event.title }}</h2>
      </div>

      <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div class="flex flex-wrap gap-6 text-sm">
          <div class="flex items-center gap-2 text-gray-500">
            <Icon name="lucide:calendar" class="w-4 h-4" />
            <span class="font-medium text-gray-900">{{ event?.date }}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-500">
            <Icon name="lucide:map-pin" class="w-4 h-4" />
            <span class="font-medium text-gray-900">{{ event?.location }}</span>
          </div>
          <div class="flex items-center gap-2 text-gray-500">
            <Icon name="lucide:image" class="w-4 h-4" />
            <span class="font-medium text-gray-900">{{ event?.photoCount || 0 }} fotos</span>
          </div>
        </div>

        <div class="flex items-center gap-3">
           <button @click="openEditEventModal" class="px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold rounded-lg transition-all text-sm">
             Editar Evento
           </button>
           <button @click="deleteEvent" class="px-5 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-lg transition-all text-sm">
             Eliminar Evento
           </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- TABS: Fotos | Paquetes                     -->
    <!-- ═══════════════════════════════════════════ -->
    <div class="flex border-b border-gray-200 mb-8">
      <button
        v-for="tab in ['photos', 'packages']"
        :key="tab"
        :class="['flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 -mb-px transition-colors',
                  activeTab === tab ? 'text-gray-900 border-gray-900' : 'text-gray-400 border-transparent hover:text-gray-600']"
        @click="activeTab = tab"
      >
        <Icon :name="tab === 'photos' ? 'lucide:image' : 'lucide:package'" class="w-4 h-4" />
        {{ tab === 'photos' ? 'Fotos' : 'Paquetes' }}
      </button>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- TAB: FOTOS (Upload + Gallery)              -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="activeTab === 'photos'">
      <!-- Upload Section -->
      <div class="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm mb-10">
        <div class="p-6 md:p-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-bold text-gray-900">Subir Fotos</h3>
            <div class="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wider">Precio Base</span>
              <div class="flex items-center gap-1">
                <span class="text-sm font-bold text-gray-900">$</span>
                <input type="number" v-model="defaultPrice" step="100" min="0"
                       class="w-20 bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-900 p-0 text-right">
                <span class="text-xs text-gray-400">COP</span>
              </div>
            </div>
          </div>

          <!-- Dropzone -->
          <div
            class="group relative border-2 border-dashed border-gray-200 rounded-2xl p-10 text-center hover:border-indigo-400 hover:bg-indigo-50/50 transition-all cursor-pointer"
            @drop.prevent="handleDrop"
            @dragover.prevent
            @click="$refs.fileInput.click()"
          >
            <div class="flex flex-col items-center">
              <div class="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Icon name="lucide:cloud-upload" class="w-7 h-7 text-indigo-600" />
              </div>
              <p class="text-gray-900 font-bold mb-1">Arrastra y suelta tus fotos aquí</p>
              <p class="text-gray-400 text-xs">JPG o PNG en alta resolución</p>
            </div>
            <input type="file" class="hidden" multiple accept="image/jpeg, image/png" ref="fileInput" @change="handleFileSelect">
          </div>

          <!-- Preview Grid (Thumbnails) -->
          <div v-if="selectedFiles.length > 0" class="mt-6">
            <div class="flex items-center justify-between mb-4">
              <p class="text-sm font-bold text-gray-900">{{ selectedFiles.length }} fotos seleccionadas</p>
              <button @click="clearFiles" class="text-xs text-red-500 hover:text-red-600 font-semibold">Limpiar todo</button>
            </div>

            <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
              <div v-for="(file, index) in selectedFiles" :key="index"
                   class="relative group aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                <!-- Thumbnail Preview -->
                <img :src="filePreviews[index]" class="w-full h-full object-cover" v-if="filePreviews[index]" />
                <div v-else class="w-full h-full flex items-center justify-center">
                  <Icon name="lucide:image" class="w-6 h-6 text-gray-300" />
                </div>

                <!-- Status Overlay -->
                <div v-if="uploadStatus[index] === 'scanning'"
                     class="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-2 text-center">
                  <div class="animate-spin rounded-full h-5 w-5 border-2 border-indigo-400 border-t-transparent mb-1"></div>
                  <span class="text-[9px] text-white font-bold uppercase tracking-wider">Escaneando Dorsal...</span>
                </div>
                <div v-else-if="uploadStatus[index] === 'uploading'"
                     class="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div class="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                </div>
                <div v-else-if="uploadStatus[index] === 'done'"
                     class="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                  <Icon name="lucide:check-circle" class="w-8 h-8 text-green-600" />
                </div>
                <div v-else-if="uploadStatus[index] === 'error'"
                     class="absolute inset-0 bg-red-500/20 flex items-center justify-center">
                  <Icon name="lucide:x-circle" class="w-8 h-8 text-red-600" />
                </div>

                <!-- Delete Button -->
                <button v-if="!uploadStatus[index]"
                        @click.stop="removeFile(index)"
                        class="absolute top-1 right-1 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500">
                  <Icon name="lucide:x" class="w-3 h-3" />
                </button>

                <!-- Filename -->
                <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p class="text-[9px] text-white font-medium truncate">{{ file.name }}</p>
                </div>
              </div>
            </div>

            <button v-if="!isUploading" @click="uploadFiles"
                    class="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2">
              <Icon name="lucide:upload" class="w-5 h-5" />
              Subir {{ selectedFiles.length }} foto{{ selectedFiles.length > 1 ? 's' : '' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Gallery Grid -->
      <div>
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-900">Galería del Evento ({{ isSearching ? displayedPhotos.length : photosStore.totalPhotos }})</h3>
        </div>

        <!-- Search Widget (Bib number / Face search) -->
        <div class="bg-gray-50/70 border border-gray-100 rounded-2xl p-4 md:p-6 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
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

        <div v-if="displayedPhotos.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
          <Icon name="lucide:image-off" class="w-12 h-12 text-gray-200 mb-4" />
          <p class="text-gray-400 font-medium">No se encontraron fotos que coincidan con la búsqueda.</p>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-3 gap-1 md:gap-4">
          <div v-for="photo in displayedPhotos" :key="photo.id" class="group relative aspect-square bg-gray-100 overflow-hidden md:rounded-xl">
            <!-- Processing Overlay -->
            <div v-if="photo.watermarkedR2Url === 'PROCESSING'" class="absolute inset-0 z-10 bg-gray-100 flex flex-col items-center justify-center">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mb-2"></div>
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Procesando</span>
            </div>

            <img v-else :src="photo.watermarkedR2Url" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">

            <!-- Similarity Match Badge -->
            <div v-if="photo.similarity" class="absolute top-3 left-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md z-10 flex items-center gap-1">
              <Icon name="lucide:sparkles" class="w-3 h-3 animate-pulse" />
              {{ (photo.similarity * 100).toFixed(1) }}% Match
            </div>

            <!-- Hover Overlay -->
            <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div class="flex items-center gap-6 text-white">
                <div class="flex flex-col items-center">
                  <span class="text-xl font-bold">${{ formatPrice(photo.price) }}</span>
                  <span class="text-[10px] uppercase font-bold tracking-widest opacity-80">COP</span>
                </div>
                <div class="flex flex-col gap-2">
                  <button @click.stop="setAsCover(photo)"
                          :class="['w-10 h-10 rounded-full flex items-center justify-center transition-all',
                                   isCover(photo) ? 'bg-yellow-400 text-white' : 'bg-white/20 backdrop-blur-md hover:bg-yellow-400 hover:text-white']">
                    <Icon :name="isCover(photo) ? 'lucide:star' : 'lucide:image'" class="w-5 h-5" />
                  </button>
                  <button @click.stop="deletePhoto(photo.id)"
                          class="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                    <Icon name="lucide:trash-2" class="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <!-- Cover Badge -->
            <div v-if="isCover(photo)" class="absolute top-3 left-3 bg-yellow-400 text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg z-20">
              Portada
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div v-if="photosStore.hasMore && !isSearching" class="mt-8 flex justify-center">
          <button 
            @click="loadMorePhotos" 
            :disabled="photosStore.loading"
            class="px-6 py-3 bg-white border border-gray-200 hover:border-indigo-500 hover:text-indigo-600 rounded-xl text-sm font-bold text-gray-700 shadow-sm transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
          >
            <Icon v-if="photosStore.loading" name="lucide:loader-2" class="w-4 h-4 animate-spin text-indigo-500" />
            Cargar más fotos
          </button>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- TAB: PAQUETES                              -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="activeTab === 'packages'">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-xl font-bold text-gray-900">Paquetes para este Evento</h3>
        <button @click="showPackageModal = true" class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all flex items-center gap-2 shadow-md">
          <Icon name="lucide:plus" class="w-4 h-4" />
          Crear Paquete
        </button>
      </div>

      <!-- Packages Grid -->
      <div v-if="eventPackages.length === 0" class="flex flex-col items-center justify-center py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <div class="w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center mb-4">
          <Icon name="lucide:package" class="w-8 h-8 text-gray-400" />
        </div>
        <h4 class="text-lg font-bold text-gray-900 mb-2">Sin paquetes</h4>
        <p class="text-gray-500 text-sm mb-4 max-w-xs">Crea ofertas especiales para tus clientes. Ejemplo: 3 fotos por $10.000</p>
        <button @click="showPackageModal = true" class="text-indigo-600 font-bold text-sm hover:text-indigo-700">
          + Crear mi primer paquete
        </button>
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div v-for="pkg in eventPackages" :key="pkg.id"
             class="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all">
          <!-- Header with photo count -->
          <div class="p-5 pb-0 flex items-start justify-between">
            <div class="flex items-baseline gap-2">
              <span class="text-4xl font-black bg-gradient-to-br from-indigo-600 to-purple-600 bg-clip-text text-transparent leading-none">{{ pkg.photoCount }}</span>
              <span class="text-sm font-semibold text-gray-500">{{ pkg.photoCount === 1 ? 'foto' : 'fotos' }}</span>
            </div>
            <div class="flex gap-1">
              <button @click="editPackage(pkg)" class="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-700 transition-colors">
                <Icon name="lucide:pencil" class="w-4 h-4" />
              </button>
              <button @click="confirmDeletePackage(pkg)" class="w-8 h-8 rounded-full hover:bg-red-50 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                <Icon name="lucide:trash-2" class="w-4 h-4" />
              </button>
            </div>
          </div>
          <!-- Body -->
          <div class="p-5">
            <h4 class="text-base font-bold text-gray-900 mb-1">{{ pkg.name }}</h4>
            <p v-if="pkg.description" class="text-sm text-gray-500 mb-3">{{ pkg.description }}</p>
          </div>
          <!-- Price Footer -->
          <div class="px-5 py-4 border-t border-gray-100 bg-gray-50/50">
            <div class="flex items-baseline gap-1">
              <span class="text-2xl font-black text-gray-900">${{ formatPrice(pkg.price) }}</span>
              <span class="text-xs font-bold text-gray-400">COP</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════ -->
    <!-- MODAL: Crear / Editar Paquete              -->
    <!-- ═══════════════════════════════════════════ -->
    <Transition name="fade">
      <div v-if="showPackageModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900">{{ editingPkg ? 'Editar Paquete' : 'Añadir Paquete' }}</h3>
            <button @click="closePackageModal" class="text-gray-400 hover:text-gray-600 transition-colors">
              <Icon name="lucide:x" class="w-6 h-6" />
            </button>
          </div>

          <form @submit.prevent="savePackage" class="p-6 space-y-4">
            <div v-if="!editingPkg" class="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 mb-2">
              <label class="text-xs font-bold text-indigo-800 uppercase tracking-wider block mb-2">Importar Paquete Base (Opcional)</label>
              <select v-model="selectedBasePackageId" @change="onBasePackageSelect" class="w-full px-4 py-3 bg-white border border-indigo-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium">
                <option :value="null">-- Crear paquete nuevo desde cero --</option>
                <option v-for="bp in basePackages" :key="bp.id" :value="bp.id">
                  {{ bp.name }} ({{ bp.photoCount }} fotos) - ${{ formatPrice(bp.price) }}
                </option>
              </select>
              <p class="text-xs text-indigo-600/70 font-medium mt-2 leading-tight">Al importar un paquete base, puedes personalizarlo aplicando tu propio descuento o precio para este evento únicamente. No afectará el paquete original.</p>
            </div>
            <div>
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Nombre</label>
              <input v-model="pkgForm.name" type="text" required placeholder='Ej: "Pack Premium"'
                     class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Cantidad de Fotos</label>
                <input v-model.number="pkgForm.photoCount" type="number" min="1" required
                       class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
              </div>
              <div>
                <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Precio (COP)</label>
                <input v-model.number="pkgForm.price" type="number" min="0" step="100" required
                       class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none">
              </div>
            </div>

            <div>
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Descripción (opcional)</label>
              <textarea v-model="pkgForm.description" rows="2" placeholder="Describe la oferta..."
                        class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
            </div>

            <!-- Price comparison if discounted -->
            <div v-if="selectedBasePackage && pkgForm.price < selectedBasePackage.price" class="flex items-center gap-2 p-3 bg-green-50 text-green-700 rounded-xl text-sm font-bold border border-green-200">
               <Icon name="lucide:tags" class="w-4 h-4" />
               Aplicando descuento de ${{ formatPrice(selectedBasePackage.price - pkgForm.price) }}
            </div>

            <!-- Live Preview -->
            <div class="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-dashed border-indigo-300 text-center">
              <div class="inline-block px-3 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-2">
                {{ pkgForm.photoCount || 0 }} {{ (pkgForm.photoCount || 0) === 1 ? 'foto' : 'fotos' }}
              </div>
              <div class="text-base font-bold text-gray-900">{{ pkgForm.name || '...' }}</div>
              <div class="text-2xl font-black text-indigo-600 mt-1">${{ formatPrice(pkgForm.price) }} <span class="text-xs font-semibold text-gray-400">COP</span></div>
            </div>

            <div class="flex gap-3 pt-2">
              <button type="button" @click="closePackageModal"
                      class="flex-1 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors">
                Cancelar
              </button>
              <button type="submit"
                      class="flex-[2] py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg transition-all active:scale-95">
                {{ editingPkg ? 'Guardar Cambios' : 'Añadir al Evento' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- ═══════════════════════════════════════════ -->
    <!-- MODAL: Editar Evento                       -->
    <!-- ═══════════════════════════════════════════ -->
    <Transition name="fade">
      <div v-if="showEditEventModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showEditEventModal = false">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-up">
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900">Editar Detalles del Evento</h3>
            <button @click="showEditEventModal = false" class="text-gray-400 hover:text-gray-600 transition-colors">
              <Icon name="lucide:x" class="w-6 h-6" />
            </button>
          </div>
          <form @submit.prevent="updateEvent" class="p-6 space-y-4">
            <div>
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Título del Evento</label>
              <input v-model="editEventData.title" type="text" required placeholder="Ej: Boda de Alex & Maria" class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Fecha</label>
                <input v-model="editEventData.date" type="date" required class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Ubicación</label>
                <input v-model="editEventData.location" type="text" required placeholder="Ciudad o Lugar" class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
            <div>
              <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Descripción</label>
              <textarea v-model="editEventData.description" rows="3" placeholder="Describe el estilo..." class="w-full px-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none resize-none"></textarea>
            </div>
            <div class="pt-4 flex gap-3">
              <button type="button" @click="showEditEventModal = false" class="px-5 py-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-all flex-1">Cancelar</button>
              <button type="submit" class="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all active:scale-[0.98] flex-1">Guardar Cambios</button>
            </div>
          </form>
        </div>
      </div>
    </Transition>

    <!-- Face Scanner Animation Modal -->
    <div v-if="scanning" class="fixed inset-0 z-[120] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-6">
      <div class="relative w-64 h-64 md:w-80 md:h-80 rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
        <!-- Preview image -->
        <img v-if="selfiePreview" :src="selfiePreview" class="w-full h-full object-cover opacity-80" />
        
        <!-- Laser line -->
        <div class="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-lg shadow-indigo-500/50 animate-laser"></div>
        
        <!-- Grid overlay -->
        <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>
      </div>
      
      <div class="mt-8 text-center max-w-sm">
        <h3 class="text-white font-extrabold text-lg flex items-center justify-center gap-2">
          <Icon name="lucide:loader-2" class="w-5 h-5 animate-spin text-indigo-400" />
          {{ scanStatus }}
        </h3>
        <p class="text-slate-400 text-xs mt-2">Analizando características y rasgos faciales para encontrar coincidencias en tus fotos...</p>
      </div>
    </div>

  </div>
</template>

<script setup>
import { useEventsStore } from '~/stores/events'
import { usePhotosStore } from '~/stores/photos'
import { usePackagesStore } from '~/stores/packages'
import { createWorker } from 'tesseract.js'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const eventsStore = useEventsStore()
const photosStore = usePhotosStore()
const packagesStore = usePackagesStore()
const { confirm } = useConfirm()
const toast = useToast()

const eventId = route.params.id
const event = ref(null)
const activeTab = ref('photos')

const showEditEventModal = ref(false)
const editEventData = ref({
  title: '',
  date: '',
  location: '',
  description: ''
})

const defaultPrice = ref(5000)
const selectedFiles = ref([])
const filePreviews = ref([])
const uploadStatus = ref([])
const isUploading = ref(false)

const showPackageModal = ref(false)
const editingPkg = ref(null)
const selectedBasePackageId = ref(null)

// Photo Search by Bib number / Face Image
const bibQuery = ref('')
const isSearching = ref(false)
const searchResults = ref([])
const scanning = ref(false)
const scanStatus = ref('')
const selfiePreview = ref('')
const faceInput = ref(null)

function triggerFaceSearch() {
  if (!authStore.isAuthenticated) {
    toast.error('Inicia sesión', 'Debes iniciar sesión para usar la búsqueda por rostro.')
    router.push('/login')
    return
  }
  faceInput.value.click()
}

async function searchByBib() {
  if (!bibQuery.value.trim()) {
    clearSearch()
    return
  }
  isSearching.value = true
  photosStore.loading = true
  try {
    const data = await $fetch(`${useRuntimeConfig().public.apiBase}/events/${eventId}/photos/search?bibNumber=${bibQuery.value.trim()}`, {
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

async function handleFaceUpload(evt) {
  const file = evt.target.files[0]
  if (!file) return

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

  try {
    const formData = new FormData()
    formData.append('file', file)

    const data = await $fetch(`${useRuntimeConfig().public.apiBase}/events/${eventId}/photos/search-by-face`, {
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

const pkgForm = ref({
  name: '',
  photoCount: 1,
  price: 5000,
  description: ''
})

const selectedBasePackage = computed(() => {
  if (!selectedBasePackageId.value) return null
  return basePackages.value.find(p => p.id === selectedBasePackageId.value)
})

function onBasePackageSelect() {
  const bp = selectedBasePackage.value
  if (!bp) {
    // Reset if deselected
    pkgForm.value = { name: '', photoCount: 1, price: 5000, description: '' }
    return
  }
  // Copy fields
  pkgForm.value = {
    name: bp.name,
    photoCount: bp.photoCount,
    price: bp.price,
    description: bp.description || ''
  }
}

onMounted(async () => {
    if (!authStore.isPhotographer) {
        router.push('/')
        return
    }
    await fetchEvent()
    await fetchPhotos()
    await packagesStore.fetchMyPackages()
    await packagesStore.fetchPackagesForEvent(eventId)
})

const photos = computed(() => photosStore.eventPhotos)
const displayedPhotos = computed(() => {
  if (isSearching.value) {
    return searchResults.value
  }
  return photos.value
})
const eventPackages = computed(() => packagesStore.eventPackages)
const basePackages = computed(() => packagesStore.myPackages.filter(p => !p.eventTitle && !p.eventId))

async function fetchEvent() {
    event.value = await eventsStore.fetchEventById(eventId)
}

async function fetchPhotos() {
    await photosStore.fetchPhotosByEvent(eventId)
}

// ─── File Selection with Preview ────────────────────────────────
function handleFileSelect(e) {
    addFiles(Array.from(e.target.files))
}

function handleDrop(e) {
    if (e.dataTransfer.files) {
        addFiles(Array.from(e.dataTransfer.files))
    }
}

function addFiles(files) {
    const validFiles = files.filter(f => f.type.startsWith('image/'))
    selectedFiles.value = [...selectedFiles.value, ...validFiles]
    uploadStatus.value = new Array(selectedFiles.value.length).fill(null)

    // Generate thumbnail previews
    generatePreviews()
}

function generatePreviews() {
    filePreviews.value = []
    for (const file of selectedFiles.value) {
        const url = URL.createObjectURL(file)
        filePreviews.value.push(url)
    }
}

function removeFile(index) {
    // Revoke old preview URL
    if (filePreviews.value[index]) {
        URL.revokeObjectURL(filePreviews.value[index])
    }
    selectedFiles.value.splice(index, 1)
    uploadStatus.value.splice(index, 1)
    filePreviews.value.splice(index, 1)
}

function clearFiles() {
    filePreviews.value.forEach(url => URL.revokeObjectURL(url))
    selectedFiles.value = []
    uploadStatus.value = []
    filePreviews.value = []
}

// ─── Upload ─────────────────────────────────────────────────────
async function uploadFiles() {
    if (selectedFiles.value.length === 0) return
    isUploading.value = true

    for (let i = 0; i < selectedFiles.value.length; i++) {
        if (uploadStatus.value[i]) continue

        const file = selectedFiles.value[i]
        
        // 1. OCR Stage
        uploadStatus.value[i] = 'scanning'
        let detectedBibs = ''
        try {
            const worker = await createWorker('spa')
            await worker.setParameters({
                tessedit_char_whitelist: '0123456789, ',
            })
            const { data: { text } } = await worker.recognize(file)
            await worker.terminate()
            
            const numbers = text.match(/\b\d{1,4}\b/g) || []
            detectedBibs = [...new Set(numbers)].join(', ')
            console.log(`OCR detected bibs for ${file.name}:`, detectedBibs)
        } catch (ocrErr) {
            console.error('OCR error for ' + file.name, ocrErr)
        }

        // 2. Upload Stage
        uploadStatus.value[i] = 'uploading'

        try {
            const result = await photosStore.uploadPhoto(eventId, file, defaultPrice.value, detectedBibs)
            if (result) {
                uploadStatus.value[i] = 'done'
            } else {
                uploadStatus.value[i] = 'error'
            }
        } catch (e) {
            console.error(e)
            uploadStatus.value[i] = 'error'
        }
    }

    isUploading.value = false
    await fetchPhotos()
    await fetchEvent()

    // Cleanup successfully uploaded files after 1.5s
    setTimeout(() => {
        const newFiles = []
        const newStatus = []
        const newPreviews = []
        for (let i = 0; i < selectedFiles.value.length; i++) {
            if (uploadStatus.value[i] === 'error') {
                newFiles.push(selectedFiles.value[i])
                newStatus.push(uploadStatus.value[i])
                newPreviews.push(filePreviews.value[i])
            } else if (filePreviews.value[i]) {
                URL.revokeObjectURL(filePreviews.value[i])
            }
        }
        selectedFiles.value = newFiles
        uploadStatus.value = newStatus
        filePreviews.value = newPreviews
    }, 1500)
}

// ─── Photo Actions ──────────────────────────────────────────────
async function deletePhoto(photoId) {
    const ok = await confirm({
        title: '¿Eliminar foto?',
        message: 'Esta acción no se puede deshacer y la foto se borrará permanentemente.'
    })
    if (ok) {
        const success = await photosStore.deletePhoto(photoId)
        if (success) {
            await fetchPhotos()
            await fetchEvent()
            toast.success('Foto eliminada')
        } else {
            toast.error('Error', 'Error al eliminar la foto')
        }
    }
}

async function loadMorePhotos() {
    if (photosStore.loading || !photosStore.hasMore) return
    await photosStore.fetchPhotosByEvent(eventId, photosStore.currentPage + 1)
}
 
function openEditEventModal() {
    if (event.value) {
        editEventData.value = {
            title: event.value.title,
            date: event.value.date,
            location: event.value.location,
            description: event.value.description || ''
        }
        showEditEventModal.value = true
    }
}

async function updateEvent() {
    try {
        const data = await eventsStore.updateEvent(eventId, editEventData.value)
        if (data) {
            event.value = data
            toast.success('Evento actualizado')
            showEditEventModal.value = false
        } else {
            toast.error('Error', 'No se pudo actualizar el evento')
        }
    } catch (e) {
        console.error(e)
        toast.error('Error', 'No se pudo actualizar el evento')
    }
}

async function deleteEvent() {
    const ok = await confirm({
        title: '¿Eliminar evento?',
        message: 'Se eliminarán permanentemente todas las fotos y paquetes asociados a este evento.'
    })
    if (ok) {
        try {
            const config = useRuntimeConfig()
            await $fetch(`${config.public.apiBase}/events/${eventId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${authStore.token}` }
            })
            router.push('/dashboard/photographer')
            toast.success('Evento eliminado')
        } catch (e) {
            console.error(e)
            toast.error('Error', 'Error al eliminar el evento')
        }
    }
}

function isCover(photo) {
    return event.value?.coverPhotoUrl === photo.watermarkedR2Url
}

async function setAsCover(photo) {
    try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/events/${eventId}/cover-photo`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authStore.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(photo.watermarkedR2Url)
        })
        event.value.coverPhotoUrl = photo.watermarkedR2Url
        toast.success('Portada actualizada')
    } catch (e) {
        console.error(e)
        toast.error('Error', 'Error al establecer foto de portada')
    }
}

// ─── Package Methods ────────────────────────────────────────────
function editPackage(pkg) {
    editingPkg.value = pkg
    pkgForm.value = {
        name: pkg.name,
        photoCount: pkg.photoCount,
        price: pkg.price || 0,
        description: pkg.description || ''
    }
    showPackageModal.value = true
}

function closePackageModal() {
    showPackageModal.value = false
    editingPkg.value = null
    selectedBasePackageId.value = null
    pkgForm.value = { name: '', photoCount: 1, price: 5000, description: '' }
}

async function savePackage() {
    try {
        const data = { ...pkgForm.value, eventId: Number(eventId) }
        if (editingPkg.value) {
            const result = await packagesStore.updatePackage(editingPkg.value.id, data)
            if (!result) { toast.error('Error al actualizar'); return }
            toast.success('Paquete actualizado')
        } else {
            const result = await packagesStore.createPackage(data)
            if (!result) { toast.error('Error al crear paquete'); return }
            toast.success('Paquete creado')
        }
        closePackageModal()
        await packagesStore.fetchPackagesForEvent(eventId)
    } catch (e) {
        console.error(e)
    }
}

async function confirmDeletePackage(pkg) {
    const ok = await confirm({
        title: '¿Eliminar paquete?',
        message: `¿Estás seguro de que quieres eliminar el paquete "${pkg.name}"?`
    })
    if (ok) {
        await packagesStore.deletePackage(pkg.id)
        await packagesStore.fetchPackagesForEvent(eventId)
    }
}

function formatPrice(price) {
    if (!price && price !== 0) return '0'
    return Number(price).toLocaleString('es-CO')
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.animate-scale-up {
  animation: scaleUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

@keyframes scaleUp {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes laser {
  0% { top: 0%; }
  50% { top: 100%; }
  100% { top: 0%; }
}
.animate-laser {
  animation: laser 3s infinite linear;
}
</style>
