<template>
  <div class="max-w-5xl mx-auto px-4 py-8">
    <div v-if="loadingEvent && !event" class="flex flex-col items-center justify-center py-20">
      <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin text-indigo-600 mb-4" />
      <p class="text-sm font-semibold text-gray-500">Cargando información del evento...</p>
    </div>
    
    <div v-else-if="!event" class="text-center py-20 text-gray-500 space-y-4">
      <div class="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
        <Icon name="lucide:alert-circle" class="w-8 h-8" />
      </div>
      <div>
        <h3 class="text-base font-bold text-gray-900">No se pudo cargar la información de este álbum</h3>
        <p class="text-xs text-gray-500 mt-1">El evento puede no existir, estar restringido o haber un problema de conexión temporal.</p>
      </div>
      <div class="flex items-center justify-center gap-3">
        <button @click="fetchEvent" class="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all cursor-pointer">
          Reintentar
        </button>
        <button @click="$router.push('/dashboard/photographer')" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold hover:bg-gray-200 transition-all cursor-pointer">
          Volver a mis eventos
        </button>
      </div>
    </div>

    <div v-else>
      <!-- Event Header -->
      <div class="mb-8 border-b border-gray-100 pb-8">
      <div class="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <div class="flex items-center gap-4">
          <button @click="$router.push('/dashboard/photographer')" class="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer">
            <Icon name="lucide:arrow-left" class="w-6 h-6 text-gray-800" />
          </button>
          <div class="flex items-center gap-3 flex-wrap">
            <h2 class="text-2xl font-bold text-gray-900" v-if="event">{{ event.title }}</h2>
            <span v-if="event?.isPrivate || event?.accessType === 'UNLISTED' || event?.accessType === 'RESTRICTED'" class="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1.5 shadow-xs">
              <Icon :name="event?.accessType === 'UNLISTED' ? 'lucide:link-2' : 'lucide:lock'" class="w-3.5 h-3.5" />
              {{ event?.accessType === 'UNLISTED' ? 'Álbum Oculto (Con enlace)' : 'Álbum Privado' }}
            </span>
            <span v-else class="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 flex items-center gap-1.5">
              <Icon name="lucide:globe" class="w-3.5 h-3.5" />
              Álbum Público
            </span>
            <span v-if="event?.hasPassword" class="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5 shadow-xs">
              <Icon name="lucide:key-round" class="w-3.5 h-3.5" />
              Con Contraseña
            </span>
            <span v-if="(event?.isPrivate || event?.accessType === 'UNLISTED' || event?.accessType === 'RESTRICTED') && event?.allowFreeDownloads" class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 shadow-xs">
              <Icon name="lucide:download-cloud" class="w-3.5 h-3.5" />
              Descarga Libre (Sin marca)
            </span>
            <span 
              v-if="(event?.isOwner || authStore.isAdmin) && (collaboratorsList.length || event?.allowedUploaders)" 
              class="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center gap-1.5 shadow-xs cursor-pointer hover:bg-indigo-100 transition-colors" 
              title="Click para gestionar personas con permiso de subida"
              @click="openCollaboratorsTab"
            >
              <Icon name="lucide:users" class="w-3.5 h-3.5" />
              Colaboradores: {{ collaboratorsList.length || event.allowedUploadersList?.length || 1 }}
            </span>
            <span v-if="event && !event.isOwner && event.canUpload" class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5 shadow-xs">
              <Icon name="lucide:user-check" class="w-3.5 h-3.5" />
              Colaborador (Permiso de subida)
            </span>
          </div>
        </div>

        <div class="flex items-center gap-2.5 flex-wrap">
          <button 
            type="button"
            @click="openInviteModal('client')" 
            class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl transition-all text-xs flex items-center gap-2 shadow-sm shadow-indigo-500/20 cursor-pointer"
          >
            <Icon name="lucide:share-2" class="w-4 h-4" />
            <span>Compartir con Clientes</span>
          </button>
          <NuxtLink 
            :to="`/marketplace/events/${event.id}`" 
            target="_blank" 
            class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all text-xs flex items-center gap-1.5 shadow-2xs"
          >
            <Icon name="lucide:external-link" class="w-4 h-4 text-gray-500" />
            <span>Ver en Galería</span>
          </NuxtLink>
          <button 
            v-if="event?.isOwner || authStore.isAdmin" 
            type="button"
            @click="openEditEventModal" 
            class="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold rounded-xl transition-all text-xs flex items-center gap-1.5 border border-indigo-100 cursor-pointer"
          >
            <Icon name="lucide:edit-3" class="w-4 h-4 text-indigo-600" />
            <span>Editar</span>
          </button>
          <button 
            v-if="event?.isOwner || authStore.isAdmin" 
            type="button"
            @click="openDeleteEventModal" 
            class="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl transition-all text-xs flex items-center gap-1.5 border border-red-100 cursor-pointer"
          >
            <Icon name="lucide:trash-2" class="w-4 h-4 text-red-500" />
            <span>Eliminar</span>
          </button>
        </div>
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
      </div>
    </div>

    <!-- TABS: Fotos | Paquetes | Colaboradores -->
    <!-- ═══════════════════════════════════════════ -->
    <div id="event-tabs-nav" class="flex border-b border-gray-200 mb-8">
      <button
        :class="['flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 -mb-px transition-colors cursor-pointer',
                  activeTab === 'photos' ? 'text-gray-900 border-gray-900' : 'text-gray-400 border-transparent hover:text-gray-600']"
        @click="activeTab = 'photos'"
      >
        <Icon name="lucide:image" class="w-4 h-4" />
        Fotos ({{ event?.photoCount || 0 }})
      </button>
      <button
        v-if="event?.isOwner || authStore.isAdmin"
        :class="['flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 -mb-px transition-colors cursor-pointer',
                  activeTab === 'packages' ? 'text-gray-900 border-gray-900' : 'text-gray-400 border-transparent hover:text-gray-600']"
        @click="activeTab = 'packages'"
      >
        <Icon name="lucide:package" class="w-4 h-4" />
        Paquetes
      </button>
      <button
        v-if="event?.isOwner || authStore.isAdmin || event?.canUpload"
        :class="['flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest border-b-2 -mb-px transition-colors cursor-pointer',
                  activeTab === 'collaborators' ? 'text-indigo-700 border-indigo-600' : 'text-gray-400 border-transparent hover:text-gray-600']"
        @click="activeTab = 'collaborators'"
      >
        <Icon name="lucide:users" class="w-4 h-4 text-indigo-600" />
        <span>Colaboradores</span>
        <span v-if="!authStore.isPro && !authStore.isAdmin" class="ml-1 px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-black uppercase flex items-center gap-0.5">
          <Icon name="lucide:crown" class="w-3 h-3 text-amber-600" /> PRO
        </span>
        <span v-else-if="collaboratorsList.length || event?.allowedUploadersList?.length" class="ml-1 px-1.5 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-black rounded-full">
          {{ collaboratorsList.length || event?.allowedUploadersList?.length || 0 }}
        </span>
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

          <!-- BANNER: Colaborador Autorizado (Para usuarios normales y fotógrafos invitados) -->
          <div v-if="!event?.isOwner && event?.canUpload" class="mb-6 p-4 sm:p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 shadow-2xs flex items-center gap-3.5">
            <div class="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <Icon name="lucide:user-check" class="w-5 h-5" />
            </div>
            <div>
              <h4 class="text-sm font-bold text-emerald-950">Colaborador Autorizado para este Álbum</h4>
              <p class="text-xs text-emerald-800/80 mt-0.5">
                El organizador (@{{ event?.photographerUsername }}) te ha otorgado permiso para subir fotos a este evento. Arrastra o selecciona tus fotos abajo para subirlas.
              </p>
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
              <p class="text-gray-400 text-xs">JPG, PNG, WEBP, Canon RAW (CR3 / CR2), DNG, RAW</p>
            </div>
            <input type="file" class="hidden" multiple accept="image/jpeg, image/png, image/webp, image/x-canon-cr3, image/cr3, .cr3, .CR3, .cr2, .CR2, .raw, .RAW, .dng, .DNG, .nef, .NEF, .arw, .ARW" ref="fileInput" @change="handleFileSelect">
          </div>

          <!-- Preview Grid (Thumbnails) -->
          <div v-if="selectedFiles.length > 0" class="mt-6">
            <div class="flex items-center justify-between mb-4 flex-wrap gap-2">
              <p class="text-sm font-bold text-gray-900">{{ selectedFiles.length }} fotos seleccionadas</p>
              <div class="flex items-center gap-2">
                <button @click="openBatchInStudio" class="px-3 py-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-xl border border-indigo-200/60 transition-colors flex items-center gap-1.5 shadow-sm">
                  <Icon name="lucide:sparkles" class="w-3.5 h-3.5 text-[#3ef4a1]" />
                  <span>Revelar Lote en Studio Pro</span>
                </button>
                <button @click="clearFiles" class="text-xs text-red-500 hover:text-red-600 font-semibold px-2 py-1">Limpiar todo</button>
              </div>
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
                     class="absolute inset-0 bg-red-900/70 backdrop-blur-[2px] flex flex-col items-center justify-center p-1 text-center text-white">
                  <Icon name="lucide:alert-circle" class="w-5 h-5 text-red-300 mb-0.5" />
                  <span class="text-[8px] font-bold text-red-200 uppercase tracking-wider mb-1">Falló</span>
                  <button
                    v-if="!isUploading"
                    @click.stop="retrySingleUpload(index)"
                    class="px-2 py-0.5 bg-white hover:bg-gray-100 text-red-800 rounded-md text-[8px] font-bold shadow transition-all active:scale-90 flex items-center gap-1"
                    title="Reintentar esta foto"
                  >
                    <Icon name="lucide:refresh-cw" class="w-2.5 h-2.5" />
                    Reintentar
                  </button>
                </div>

                <!-- Delete Button -->
                <button v-if="!uploadStatus[index] || uploadStatus[index] === 'error'"
                        @click.stop="removeFile(index)"
                        class="absolute top-1 right-1 w-6 h-6 bg-black/60 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 z-10">
                  <Icon name="lucide:x" class="w-3 h-3" />
                </button>

                <!-- Filename -->
                <div class="absolute bottom-0 left-0 right-0 bg-[#3ef4a1] p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p class="text-[9px] text-white font-medium truncate">{{ file.name }}</p>
                </div>
              </div>
            </div>

            <!-- Failed Uploads Alert Banner -->
            <div v-if="failedUploadsCount > 0 && !isUploading" class="mt-4 p-4 bg-red-50 border border-red-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0 text-red-600">
                  <Icon name="lucide:alert-triangle" class="w-5 h-5" />
                </div>
                <div>
                  <h4 class="text-sm font-bold text-red-900">
                    {{ failedUploadsCount }} foto{{ failedUploadsCount > 1 ? 's' : '' }} no se {{ failedUploadsCount > 1 ? 'pudieron' : 'pudo' }} cargar
                  </h4>
                  <p class="text-xs text-red-700 font-medium mt-0.5">
                    {{ lastUploadError || 'Las fotos siguen en memoria del navegador. Puedes reintentarlas con un solo clic.' }}
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2 w-full sm:w-auto">
                <button
                  @click="retryFailedUploads"
                  class="flex-1 sm:flex-initial px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs shadow-md shadow-red-200 flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <Icon name="lucide:refresh-cw" class="w-4 h-4" />
                  Reintentar fallidas ({{ failedUploadsCount }})
                </button>
                <button
                  @click="clearFailedFiles"
                  class="px-3 py-2 bg-white hover:bg-gray-100 text-gray-700 font-semibold rounded-xl text-xs border border-gray-200 transition-colors"
                >
                  Descartar
                </button>
              </div>
            </div>

            <!-- Uploading Progress Bar -->
            <div v-if="isUploading" class="w-full mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl shadow-sm">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-indigo-900 flex items-center gap-2">
                  <div class="animate-spin rounded-full h-4 w-4 border-2 border-indigo-600 border-t-transparent"></div>
                  {{ uploadProgressText || 'Subiendo fotos al servidor...' }}
                </span>
                <span class="text-xs font-bold text-indigo-600">
                  {{ completedUploadsCount }} / {{ selectedFiles.length }}
                </span>
              </div>
              <div class="w-full bg-indigo-200 rounded-full h-2 overflow-hidden">
                <div
                  class="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                  :style="{ width: `${selectedFiles.length ? (completedUploadsCount / selectedFiles.length) * 100 : 0}%` }"
                ></div>
              </div>
            </div>

            <!-- AI processing toggle -->
            <div v-if="!isUploading" class="mt-4 flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
              <input v-model="runAI" type="checkbox" id="run_ai_toggle" class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 cursor-pointer" />
              <label for="run_ai_toggle" class="text-xs font-bold text-gray-700 select-none cursor-pointer">
                Procesar con Inteligencia Artificial (Detección de rostros y dorsales)
              </label>
            </div>

            <!-- Upload Action Buttons -->
            <button
              v-if="!isUploading && failedUploadsCount > 0 && failedUploadsCount === selectedFiles.length"
              @click="retryFailedUploads"
              class="w-full mt-6 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Icon name="lucide:refresh-cw" class="w-5 h-5" />
              Reintentar subir {{ failedUploadsCount }} foto{{ failedUploadsCount > 1 ? 's' : '' }} fallida{{ failedUploadsCount > 1 ? 's' : '' }}
            </button>
            <button
              v-else-if="!isUploading"
              @click="uploadFiles"
              class="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
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

        <div v-if="photosStore.loading && displayedPhotos.length === 0" class="grid grid-cols-2 md:grid-cols-3 gap-4 py-8">
          <div v-for="i in 6" :key="i" class="aspect-square bg-gray-100 animate-pulse rounded-xl"></div>
        </div>

        <div v-else-if="displayedPhotos.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
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
            <!-- Failed Overlay -->
            <div v-else-if="photo.watermarkedR2Url === 'FAILED'" class="absolute inset-0 z-10 bg-gray-100 flex flex-col items-center justify-center text-red-400">
              <Icon name="lucide:image-off" class="w-8 h-8 mb-2" />
              <span class="text-[10px] font-bold uppercase tracking-widest">Error</span>
            </div>

            <img v-else :src="photo.watermarkedR2Url" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">

            <!-- Similarity Match Badge -->
            <div v-if="photo.similarity" class="absolute top-3 left-3 bg-[#3ef4a1] text-white px-2.5 py-1 rounded-full text-[10px] font-bold shadow-md z-10 flex items-center gap-1">
              <Icon name="lucide:sparkles" class="w-3 h-3 animate-pulse" />
              {{ (photo.similarity * 100).toFixed(1) }}% Match
            </div>

            <!-- Detected Bib Badge -->
            <div v-if="photo.bibNumbers && photo.bibNumbers.trim()" class="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full text-white text-[10px] font-bold z-10 flex items-center gap-1 border border-white/20">
              <Icon name="lucide:hash" class="w-3 h-3 text-amber-400" />
              Dorsal: {{ photo.bibNumbers.replace(/[\[\]"]/g, '') }}
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
                  <button @click.stop="openEditBibModal(photo)"
                          title="Editar Dorsales"
                          class="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-amber-500 hover:text-white transition-all">
                    <Icon name="lucide:hash" class="w-5 h-5" />
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
              <span class="text-4xl font-black leading-none text-[#3ef4a1]">{{ pkg.photoCount }}</span>
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
    <!-- ═══════════════════════════════════════════ -->
    <!-- TAB: COLABORADORES                          -->
    <!-- ═══════════════════════════════════════════ -->
    <div v-if="activeTab === 'collaborators'" class="space-y-6 animate-fade-in">
      <div class="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
        <!-- Tab Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100 shadow-sm">
              <Icon name="lucide:shield-check" class="w-6 h-6" />
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-xl font-bold text-gray-900">Seguridad & Modo Colaborativo</h3>
                <span v-if="!authStore.isPro && !authStore.isAdmin" class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase flex items-center gap-1 shadow-2xs">
                  <Icon name="lucide:crown" class="w-3 h-3 text-amber-700" /> PRO
                </span>
              </div>
              <p class="text-xs text-gray-500 mt-0.5">Configura si deseas permitir que otros fotógrafos o usuarios aporten fotos a este álbum.</p>
            </div>
          </div>
          <span 
            class="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border self-start sm:self-auto shadow-2xs transition-colors"
            :class="event?.allowCollaborators 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
              : 'bg-slate-100 text-slate-700 border-slate-200'"
          >
            <Icon :name="event?.allowCollaborators ? 'lucide:users-check' : 'lucide:lock'" class="w-3.5 h-3.5" />
            {{ event?.allowCollaborators ? `${collaboratorsList.length} Colaborador${collaboratorsList.length === 1 ? '' : 'es'}` : 'Solo el Propietario' }}
          </span>
        </div>

        <div v-if="event?.isOwner || authStore.isAdmin" class="py-6 space-y-6">
          <!-- 1. MASTER SECURITY SWITCH CARD -->
          <div 
            class="p-5 sm:p-6 rounded-3xl border transition-all"
            :class="event?.allowCollaborators 
              ? 'bg-gradient-to-r from-emerald-50/70 via-indigo-50/20 to-white border-emerald-200/90 shadow-xs' 
              : 'bg-slate-50/80 border-slate-200/90 shadow-2xs'"
          >
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-start gap-3.5">
                <div 
                  class="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-colors"
                  :class="event?.allowCollaborators ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-slate-200 text-slate-600'"
                >
                  <Icon :name="event?.allowCollaborators ? 'lucide:users' : 'lucide:shield'" class="w-6 h-6" />
                </div>
                <div class="space-y-1">
                  <div class="flex items-center gap-2 flex-wrap">
                    <h4 class="text-base font-bold text-gray-900">
                      ¿Permitir que otras personas suban fotos a este evento?
                    </h4>
                    <span 
                      v-if="event?.allowCollaborators" 
                      class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1"
                    >
                      <Icon name="lucide:check-circle-2" class="w-3 h-3 text-emerald-600" />
                      Modo Colaborativo Activado
                    </span>
                    <span 
                      v-else 
                      class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-200 text-slate-700 border border-slate-300 flex items-center gap-1"
                    >
                      <Icon name="lucide:lock" class="w-3 h-3 text-slate-500" />
                      Solo Yo (Por Defecto)
                    </span>
                  </div>
                  <p class="text-xs text-gray-600 leading-relaxed max-w-2xl">
                    Por defecto está <strong class="text-gray-900">desactivado</strong>: solo tú tienes permiso para cargar fotos. 
                    Si activas esta opción, podrás invitar fotógrafos o participantes para que aporten fotografías a este evento.
                  </p>
                </div>
              </div>

              <!-- Switch & PRO Gate button -->
              <div class="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span v-if="!authStore.isPro && !authStore.isAdmin" class="px-2.5 py-1 rounded-xl bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-black uppercase flex items-center gap-1 shadow-2xs">
                  <Icon name="lucide:crown" class="w-3.5 h-3.5 text-amber-600" /> Requiere PRO
                </span>
                <button 
                  type="button" 
                  @click="toggleCollaborativeMode"
                  :disabled="isSavingCollaborators"
                  :title="event?.allowCollaborators ? 'Desactivar modo colaborativo' : 'Activar modo colaborativo'"
                  :class="[
                    event?.allowCollaborators ? 'bg-emerald-600' : 'bg-gray-300', 
                    'relative inline-flex h-7 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none shadow-sm disabled:opacity-50'
                  ]"
                >
                  <span 
                    :class="[
                      event?.allowCollaborators ? 'translate-x-5' : 'translate-x-0', 
                      'pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out flex items-center justify-center'
                    ]"
                  >
                    <Icon v-if="isSavingCollaborators" name="lucide:loader-2" class="w-3.5 h-3.5 text-gray-400 animate-spin" />
                    <Icon v-else-if="event?.allowCollaborators" name="lucide:check" class="w-3.5 h-3.5 text-emerald-600" />
                    <Icon v-else name="lucide:lock" class="w-3.5 h-3.5 text-gray-400" />
                  </span>
                </button>
              </div>
            </div>
          </div>

          <!-- 2. STATE A: COLABORATIVO DESACTIVADO (ESTADO POR DEFECTO / PROTEGIDO) -->
          <div v-if="!event?.allowCollaborators" class="p-6 sm:p-8 bg-slate-50 border border-slate-200/80 rounded-3xl text-center space-y-4 animate-fade-in">
            <div class="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-slate-500 mx-auto flex items-center justify-center shadow-xs">
              <Icon name="lucide:shield-check" class="w-7 h-7 text-emerald-600" />
            </div>
            <div class="space-y-1.5 max-w-md mx-auto">
              <h5 class="text-base font-bold text-gray-900">Álbum Privado para el Fotógrafo</h5>
              <p class="text-xs text-gray-500 leading-relaxed">
                Por seguridad, ninguna otra persona puede subir fotografías a este evento. Si deseas compartir un enlace de subida o trabajar con otros fotógrafos, activa el interruptor de modo colaborativo.
              </p>
            </div>
            
            <!-- Upgrade to PRO Banner if not PRO -->
            <div v-if="!authStore.isPro && !authStore.isAdmin" class="max-w-lg mx-auto p-4 bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-yellow-500/10 border border-amber-300 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
              <div class="flex items-center gap-2.5">
                <Icon name="lucide:crown" class="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p class="text-xs font-bold text-amber-950">Exclusivo de Moments PRO ($5.000 COP / mes)</p>
                  <p class="text-[11px] text-amber-800">Crea álbumes colaborativos multi-fotógrafo y gestiona colaboradores.</p>
                </div>
              </div>
              <NuxtLink 
                to="/dashboard/photographer/subscription" 
                target="_blank"
                class="shrink-0 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
              >
                Activar PRO
              </NuxtLink>
            </div>

            <!-- Enable Button if PRO -->
            <div v-else class="pt-2">
              <button 
                type="button" 
                @click="toggleCollaborativeMode"
                :disabled="isSavingCollaborators"
                class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md shadow-indigo-500/20 transition-all inline-flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Icon name="lucide:user-plus" class="w-4 h-4" />
                <span>Habilitar Modo Colaborativo Ahora</span>
              </button>
            </div>
          </div>

          <!-- 3. STATE B: MODO COLABORATIVO ACTIVADO (HERRAMIENTAS DE INVITACIÓN) -->
          <div v-else class="space-y-6 animate-fade-in">
            <!-- Link Sharing Card -->
            <div class="p-5 sm:p-6 bg-gradient-to-br from-indigo-50/70 via-indigo-50/30 to-white border border-indigo-200/80 rounded-2xl shadow-2xs space-y-4">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2.5">
                  <div class="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <Icon name="lucide:link-2" class="w-4 h-4" />
                  </div>
                  <div>
                    <h4 class="text-sm font-bold text-gray-900">Enlace Directo para Subir Fotos</h4>
                    <p class="text-[11px] text-gray-500">Comparte este enlace con los fotógrafos o usuarios que deben subir fotos</p>
                  </div>
                </div>
                <span class="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Activo
                </span>
              </div>

              <div class="flex items-center gap-2">
                <div class="relative flex-1">
                  <input 
                    type="text" 
                    readonly 
                    :value="uploadInviteUrl" 
                    class="w-full pl-9 pr-3 py-2.5 text-xs bg-white border border-gray-200 rounded-xl text-gray-700 select-all outline-none font-mono"
                  />
                  <Icon name="lucide:link" class="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
                <button 
                  type="button" 
                  @click="copyUploadLink"
                  class="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Icon :name="copiedUploadLink ? 'lucide:check' : 'lucide:copy'" class="w-4 h-4" />
                  <span>{{ copiedUploadLink ? '¡Copiado!' : 'Copiar Enlace' }}</span>
                </button>
              </div>

              <!-- Action buttons for invite -->
              <div class="flex flex-wrap items-center gap-2.5 pt-1">
                <button 
                  type="button" 
                  @click="shareUploadWhatsApp"
                  class="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Icon name="lucide:message-circle" class="w-4 h-4" />
                  <span>Invitar Fotógrafo por WhatsApp</span>
                </button>

                <button 
                  type="button" 
                  @click="toggleAnyoneWithLink"
                  :class="isAnyoneWithLink ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'"
                  class="py-2.5 px-4 font-bold text-xs rounded-xl border transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Icon :name="isAnyoneWithLink ? 'lucide:check-square' : 'lucide:square'" class="w-4 h-4" />
                  <span>{{ isAnyoneWithLink ? 'Subida abierta para cualquiera con el link' : 'Permitir que cualquiera con el link suba' }}</span>
                </button>
              </div>
            </div>

            <!-- Add Collaborator by Email / Username Form -->
            <div class="bg-gradient-to-br from-gray-50 via-white to-gray-50/50 p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
              <div class="flex items-center justify-between">
                <h4 class="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <Icon name="lucide:user-plus" class="w-4 h-4 text-indigo-600" />
                  <span>Añadir Persona Autorizada a la Lista</span>
                </h4>
                <span class="text-[11px] text-gray-400">Ingresa @usuario o correo</span>
              </div>

              <div class="flex flex-col sm:flex-row items-stretch sm:items-end gap-3">
                <div class="flex-1">
                  <label class="text-xs font-bold text-gray-700 block mb-1.5">
                    Usuario o Correo Electrónico
                  </label>
                  <div class="relative">
                    <input 
                      v-model="newCollabIdentifier"
                      @keydown.enter.prevent="addCollaborator"
                      type="text" 
                      placeholder="ej: @fotografo o correo@ejemplo.com"
                      class="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400"
                    />
                    <Icon name="lucide:at-sign" class="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  </div>
                </div>

                <!-- Add button -->
                <button 
                  type="button" 
                  @click="addCollaborator"
                  :disabled="!newCollabIdentifier.trim()"
                  class="py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 active:scale-95 disabled:opacity-50 text-white font-bold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                >
                  <Icon name="lucide:plus" class="w-4 h-4" />
                  <span>Añadir a la Lista</span>
                </button>
              </div>
            </div>

            <!-- Collaborators List Section -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <h4 class="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Icon name="lucide:users" class="w-3.5 h-3.5 text-indigo-600" />
                  <span>Colaboradores Autorizados ({{ collaboratorsList.length }})</span>
                </h4>
                <span v-if="collaboratorsList.length > 0" class="text-xs text-gray-400 hidden sm:inline">
                  Puedes autorizar o revocar permisos individuales en cualquier momento
                </span>
              </div>

              <!-- Empty State -->
              <div v-if="collaboratorsList.length === 0" class="p-8 text-center bg-gray-50/70 border border-dashed border-gray-200 rounded-2xl space-y-2">
                <div class="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 mx-auto flex items-center justify-center">
                  <Icon name="lucide:user-x" class="w-6 h-6" />
                </div>
                <p class="text-sm font-bold text-gray-700">No hay colaboradores específicos aún</p>
                <p class="text-xs text-gray-400 max-w-md mx-auto">
                  Las personas que abran tu enlace de invitación o que agregues manualmente aparecerán aquí.
                </p>
              </div>

              <!-- Cards -->
              <div v-else class="space-y-2.5">
                <div 
                  v-for="(collab, idx) in collaboratorsList" 
                  :key="collab.identifier || idx"
                  class="bg-white border border-gray-200 rounded-2xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <!-- Left: Collab Info -->
                  <div class="flex items-center gap-3.5 min-w-[200px]">
                    <div class="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs overflow-hidden shrink-0">
                      <img v-if="collab.avatarUrl" :src="collab.avatarUrl" :alt="collab.name || collab.identifier" class="w-full h-full object-cover" />
                      <span v-else>{{ (collab.name || collab.username || collab.identifier || '?').charAt(0).toUpperCase() }}</span>
                    </div>
                    <div class="space-y-0.5">
                      <div class="flex items-center gap-1.5 flex-wrap">
                        <span class="text-sm font-bold text-gray-900">{{ collab.name || collab.username || collab.identifier }}</span>
                        <span v-if="collab.username" class="text-xs text-indigo-600 font-semibold">@{{ collab.username }}</span>
                      </div>
                      <p v-if="collab.email && collab.email !== collab.name" class="text-xs text-gray-400">{{ collab.email }}</p>
                    </div>
                  </div>

                  <!-- Right: Status & Actions -->
                  <div class="flex items-center gap-3 bg-gray-50/80 px-4 py-2 rounded-xl border border-gray-100 shrink-0 self-end sm:self-center">
                    <!-- Permiso de subir -->
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                        <Icon name="lucide:upload-cloud" class="w-4 h-4" :class="collab.canUpload ? 'text-indigo-600' : 'text-gray-400'" />
                        <span>Puede subir:</span>
                      </span>
                      <button 
                        type="button" 
                        @click="collab.canUpload = !collab.canUpload"
                        :class="collab.canUpload ? 'bg-indigo-600' : 'bg-gray-300'"
                        class="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none">
                        <span :class="collab.canUpload ? 'translate-x-4' : 'translate-x-0'" class="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                      </button>
                    </div>

                    <div class="h-4 w-px bg-gray-200 mx-1"></div>

                    <!-- Remove Collab Button -->
                    <button 
                      type="button"
                      @click="removeCollaborator(idx)"
                      class="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                      title="Eliminar colaborador de este evento"
                    >
                      <Icon name="lucide:trash-2" class="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Explain Box -->
            <div class="bg-gradient-to-r from-indigo-50/70 via-indigo-50/30 to-white p-4 sm:p-5 rounded-2xl border border-indigo-200/60 flex items-start gap-3">
              <Icon name="lucide:shield-check" class="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div class="text-xs text-indigo-950 space-y-1">
                <p class="font-bold">Control Total de Colaboración</p>
                <ul class="list-disc list-inside space-y-0.5 text-indigo-900/80">
                  <li><strong>Subida segura:</strong> Las personas autorizadas podrán subir fotos directamente a este álbum.</li>
                  <li><strong>Precio unificado:</strong> Las fotos se publicarán con el precio fijado para el evento.</li>
                  <li><strong>Revocación inmediata:</strong> Puedes apagar el modo colaborativo o revocar a cualquier usuario en cualquier momento.</li>
                </ul>
              </div>
            </div>

            <!-- Quick Upload from Collaborators Panel -->
            <div class="p-5 sm:p-6 bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-transparent border border-emerald-300/80 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div class="flex items-start gap-3.5">
                <div class="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-500/20">
                  <Icon name="lucide:upload-cloud" class="w-6 h-6" />
                </div>
                <div>
                  <h4 class="text-sm font-bold text-gray-900">¿Listo para subir fotos a este evento?</h4>
                  <p class="text-xs text-gray-600 mt-0.5 leading-relaxed">
                    Las fotos que subas quedarán asociadas a este álbum con el precio base establecido.
                  </p>
                </div>
              </div>
              <button 
                type="button" 
                @click="activeTab = 'photos'"
                class="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              >
                <Icon name="lucide:image-plus" class="w-4 h-4" />
                <span>Ir a Subir Fotos</span>
              </button>
            </div>

            <!-- Save Button -->
            <div class="flex items-center justify-between pt-6 border-t border-gray-100 flex-wrap gap-4">
              <div class="text-xs text-gray-400">
                Guarda los cambios para sincronizar la lista de colaboradores en el servidor.
              </div>
              <button 
                @click="saveCollaborators" 
                :disabled="isSavingCollaborators"
                class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-md shadow-indigo-500/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Icon v-if="isSavingCollaborators" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                <Icon v-else name="lucide:check" class="w-4 h-4" />
                <span>{{ isSavingCollaborators ? 'Guardando...' : 'Guardar Cambios de Colaboradores' }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- NON-OWNER COLLABORATOR VIEW -->
        <div v-else class="py-6 space-y-6">
          <div class="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-indigo-500/10 to-transparent border border-emerald-300 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div class="flex items-start gap-4">
              <div class="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-emerald-500/20">
                <Icon name="lucide:user-check" class="w-7 h-7" />
              </div>
              <div>
                <span class="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Colaborador Autorizado
                </span>
                <h4 class="text-lg font-bold text-gray-900 mt-1">¡Tienes permiso para subir fotos a este evento!</h4>
                <p class="text-xs text-gray-600 mt-0.5 max-w-xl leading-relaxed">
                  Has sido autorizado por el organizador (@{{ event?.photographerUsername }}). Puedes subir tus fotos directamente al álbum y se publicarán con los parámetros del evento.
                </p>
              </div>
            </div>

            <button
              type="button"
              @click="activeTab = 'photos'"
              class="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
            >
              <Icon name="lucide:upload-cloud" class="w-5 h-5" />
              <span>Subir Mis Fotos Ahora</span>
            </button>
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
                <label class="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Cantidad de Fotos (Máx. 20)</label>
                <input v-model.number="pkgForm.photoCount" type="number" min="1" max="20" required
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
            <div class="p-5 bg-[#3ef4a1] rounded-xl border border-dashed border-indigo-300 text-center">
              <div class="inline-block px-3 py-1 bg-[#3ef4a1] text-white text-[10px] font-bold uppercase tracking-widest rounded-full mb-2">
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
    <!-- MODAL: Editar Dorsal de Foto               -->
    <!-- ═══════════════════════════════════════════ -->
    <Transition name="fade">
      <div v-if="showBibModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" @click.self="showBibModal = false">
        <div class="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden p-6 animate-scale-up">
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                <Icon name="lucide:hash" class="w-4 h-4" />
              </div>
              <h3 class="text-base font-bold text-gray-900">Editar Dorsales</h3>
            </div>
            <button @click="showBibModal = false" class="text-gray-400 hover:text-gray-600">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>
          <p class="text-xs text-gray-500 mb-4">Ingresa los números de dorsal asignados a esta foto, separados por coma (ej. 15, 105).</p>
          <input v-model="editBibValue" type="text" placeholder="ej. 15, 105" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 outline-none mb-6" />
          <div class="flex justify-end gap-3">
            <button @click="showBibModal = false" class="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Cancelar</button>
            <button @click="savePhotoBibs" class="px-5 py-2.5 text-sm font-bold text-white bg-amber-500 hover:bg-amber-600 rounded-xl shadow-md transition-all">Guardar</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ═══════════════════════════════════════════ -->
    <!-- MODAL: Invitar & Compartir Evento           -->
    <!-- ═══════════════════════════════════════════ -->
    <EventInviteModal 
      v-model="showInviteModal" 
      :event="event"
      :initial-type="inviteInitialType"
      @open-granular-settings="openCollaboratorsTab"
    />

    <!-- ═══════════════════════════════════════════ -->
    <!-- MODAL: Gestionar Colaboradores Rápido       -->
    <!-- ═══════════════════════════════════════════ -->
    <Transition name="fade">
      <div v-if="showCollaboratorsModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="showCollaboratorsModal = false">
        <div class="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-scale-up border border-gray-100 p-6 space-y-5">
          <div class="flex items-center justify-between pb-3 border-b border-gray-100">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100">
                <Icon name="lucide:user-plus" class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-base font-bold text-gray-900">Gestionar Colaboradores</h3>
                <p class="text-xs text-gray-500">Permisos para subir fotos a este evento</p>
              </div>
            </div>
            <button @click="showCollaboratorsModal = false" class="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <div class="space-y-4">
            <p class="text-xs text-gray-600 leading-relaxed">
              Puedes autorizar o gestionar a los fotógrafos y usuarios que tienen permiso para subir fotos a este evento.
            </p>

            <div class="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-2xl flex items-center justify-between gap-3">
              <div class="flex items-center gap-2.5">
                <Icon name="lucide:shield-check" class="w-5 h-5 text-indigo-600 shrink-0" />
                <div>
                  <p class="text-xs font-bold text-indigo-950">{{ collaboratorsList.length }} Colaboradores Autorizados</p>
                  <p class="text-[11px] text-indigo-800">Accede a la pestaña de colaboradores para gestionar quién puede subir fotos.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button 
              type="button" 
              @click="showCollaboratorsModal = false"
              class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-all"
            >
              Cerrar
            </button>
            <button 
              type="button"
              @click="showCollaboratorsModal = false; openCollaboratorsTab()"
              class="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <Icon name="lucide:sliders" class="w-3.5 h-3.5" />
              <span>Abrir Gestor de Permisos</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ═══════════════════════════════════════════ -->
    <!-- MODAL: Editar Evento                       -->
    <!-- ═══════════════════════════════════════════ -->
    <Transition name="fade">
      <div v-if="showEditEventModal" class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm" @click.self="showEditEventModal = false">
        <div class="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-up border border-gray-100">
          
          <!-- MODAL HEADER (FIXED) -->
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Icon name="lucide:settings-2" class="w-5 h-5" />
              </div>
              <div>
                <h3 class="text-base sm:text-lg font-bold text-gray-900 leading-tight">Editar Detalles del Evento</h3>
                <p class="text-xs text-gray-500">Configura la información básica, visibilidad y accesos</p>
              </div>
            </div>
            <button @click="showEditEventModal = false" class="text-gray-400 hover:text-gray-600 p-1.5 rounded-xl hover:bg-gray-100 transition-colors">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <!-- FORM WITH SCROLLABLE CONTENT & STICKY FOOTER -->
          <form @submit.prevent="updateEvent" class="flex flex-col flex-1 min-h-0 overflow-hidden">
            
            <!-- SCROLLABLE BODY -->
            <div class="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              
              <!-- SECTION 1: DATOS BÁSICOS -->
              <div class="bg-gray-50/70 border border-gray-100 rounded-2xl p-4 sm:p-5 space-y-4">
                <div class="flex items-center gap-2 mb-1">
                  <Icon name="lucide:info" class="w-4 h-4 text-indigo-600" />
                  <span class="text-xs font-bold text-gray-800 uppercase tracking-wider">Información General</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- Title -->
                  <div class="sm:col-span-2">
                    <label class="text-xs font-bold text-gray-600 block mb-1">Título del Evento *</label>
                    <input 
                      v-model="editEventData.title" 
                      type="text" 
                      required 
                      placeholder="Ej: Boda de Alex & María" 
                      class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-all shadow-2xs" 
                    />
                  </div>

                  <!-- Date -->
                  <div>
                    <label class="text-xs font-bold text-gray-600 block mb-1">Fecha del Evento *</label>
                    <input 
                      v-model="editEventData.date" 
                      type="date" 
                      required 
                      class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-all shadow-2xs" 
                    />
                  </div>

                  <!-- Location -->
                  <div>
                    <label class="text-xs font-bold text-gray-600 block mb-1">Ubicación / Ciudad *</label>
                    <input 
                      v-model="editEventData.location" 
                      type="text" 
                      required 
                      placeholder="Ej: Medellín, Club Campestre" 
                      class="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm transition-all shadow-2xs" 
                    />
                  </div>

                  <!-- Description -->
                  <div class="sm:col-span-2">
                    <label class="text-xs font-bold text-gray-600 block mb-1">Descripción corta (opcional)</label>
                    <textarea 
                      v-model="editEventData.description" 
                      rows="2" 
                      placeholder="Describe detalles, recomendaciones o el estilo de las fotos..." 
                      class="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm resize-none transition-all shadow-2xs"
                    ></textarea>
                  </div>
                </div>
              </div>

              <!-- SECTION 2: PRIVACIDAD Y ACCESOS -->
              <div class="bg-gray-50/70 border border-gray-100 rounded-2xl p-4 sm:p-5 space-y-4">
                
                <!-- Visibility Header with Toggle -->
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-200/60">
                  <div>
                    <div class="flex items-center gap-2">
                      <span class="text-xs font-bold text-gray-900 uppercase tracking-wider">Visibilidad del Álbum</span>
                      <NuxtLink 
                        v-if="!authStore.isPro && !authStore.isAdmin" 
                        to="/dashboard/photographer/subscription" 
                        target="_blank"
                        title="Ver beneficios Moments PRO Fotógrafo"
                        class="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors">
                        <Icon name="lucide:crown" class="w-3 h-3 text-amber-500" /> PRO
                      </NuxtLink>
                    </div>
                    <p class="text-xs text-gray-500 mt-0.5">
                      {{ editEventData.isPrivate ? 'Privado: Oculto del feed público. Tú decides quién entra.' : 'Público: Aparece en el marketplace y en el buscador de eventos.' }}
                    </p>
                  </div>

                  <div class="inline-flex bg-gray-200/80 p-1 rounded-xl shrink-0 self-start sm:self-auto">
                    <button 
                      type="button" 
                      @click="editEventData.isPrivate = false; editEventData.accessType = 'PUBLIC'"
                      :class="[!editEventData.isPrivate ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900', 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer']">
                      <Icon name="lucide:globe" class="w-3.5 h-3.5" />
                      Público
                    </button>
                    <button 
                      type="button" 
                      @click="handleSelectPrivate"
                      :class="[editEventData.isPrivate ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-900', 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer']">
                      <Icon name="lucide:lock" class="w-3.5 h-3.5" />
                      <span>Privado</span>
                      <span v-if="!authStore.isPro && !authStore.isAdmin" class="text-[9px] font-black uppercase px-1 py-0.5 rounded bg-amber-200 text-amber-900 ml-0.5">PRO</span>
                    </button>
                  </div>
                </div>

                <!-- PRO Upsell Callout when user is not PRO -->
                <div v-if="!authStore.isPro && !authStore.isAdmin" class="p-3 bg-gradient-to-r from-amber-500/10 via-amber-400/10 to-yellow-500/10 border border-amber-300/80 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div class="flex items-start gap-2.5">
                    <div class="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                      <Icon name="lucide:crown" class="w-4 h-4 fill-white" />
                    </div>
                    <div>
                      <p class="text-xs font-bold text-amber-950">Álbumes Privados con Moments PRO</p>
                      <p class="text-[11px] text-amber-800 leading-tight">Acceso restringido por enlace, correos autorizados y descarga directa sin marcas por solo <strong class="font-bold text-amber-900">$5.000 COP / mes</strong>.</p>
                    </div>
                  </div>
                  <NuxtLink 
                    to="/dashboard/photographer/subscription" 
                    target="_blank"
                    class="shrink-0 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-white text-xs font-bold rounded-lg shadow-sm transition-all text-center">
                    <Icon name="lucide:sparkles" class="w-3.5 h-3.5 text-yellow-200" />
                    Activar PRO ($5.000 COP)
                  </NuxtLink>
                </div>

                <!-- OPTIONS FOR PRIVATE EVENT -->
                <div v-if="editEventData.isPrivate" class="space-y-4 pt-1">
                  
                  <!-- Sub-grid: Modo de fotos + Permisos de acceso -->
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <!-- Modo de Fotos -->
                    <div>
                      <label class="text-xs font-bold text-gray-700 block mb-1.5">Modo de descarga de fotos</label>
                      <div class="space-y-2">
                        <button 
                          type="button" 
                          @click="editEventData.allowFreeDownloads = false"
                          :class="[!editEventData.allowFreeDownloads ? 'border-indigo-600 bg-white text-indigo-900 ring-2 ring-indigo-500/20 shadow-xs' : 'border-gray-200 bg-white/70 text-gray-600 hover:bg-white', 'w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer']">
                          <Icon name="lucide:shopping-bag" class="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <div>
                            <p class="font-bold text-gray-900">Vender fotos</p>
                            <p class="text-[11px] text-gray-500 leading-tight mt-0.5">Con marca de agua. Los invitados deben comprarlas.</p>
                          </div>
                        </button>

                        <button 
                          type="button" 
                          @click="editEventData.allowFreeDownloads = true"
                          :class="[editEventData.allowFreeDownloads ? 'border-emerald-600 bg-white text-emerald-900 ring-2 ring-emerald-500/20 shadow-xs' : 'border-gray-200 bg-white/70 text-gray-600 hover:bg-white', 'w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer']">
                          <Icon name="lucide:download-cloud" class="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <p class="font-bold text-gray-900">Descarga libre (Gratis)</p>
                            <p class="text-[11px] text-gray-500 leading-tight mt-0.5">Sin marca de agua. Descarga directa en alta resolución.</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    <!-- Permisos de Acceso -->
                    <div>
                      <label class="text-xs font-bold text-gray-700 block mb-1.5">Nivel de privacidad</label>
                      <div class="space-y-2">
                        <button 
                          type="button" 
                          @click="editEventData.accessType = 'UNLISTED'"
                          :class="[editEventData.accessType === 'UNLISTED' ? 'border-indigo-600 bg-white text-indigo-900 ring-2 ring-indigo-500/20 shadow-xs' : 'border-gray-200 bg-white/70 text-gray-600 hover:bg-white', 'w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer']">
                          <Icon name="lucide:link-2" class="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <div>
                            <p class="font-bold text-gray-900">Cualquiera con el enlace</p>
                            <p class="text-[11px] text-gray-500 leading-tight mt-0.5">No se lista en el feed. Solo entra quien tenga el enlace.</p>
                          </div>
                        </button>

                        <button 
                          type="button" 
                          @click="editEventData.accessType = 'RESTRICTED'"
                          :class="[editEventData.accessType === 'RESTRICTED' ? 'border-indigo-600 bg-white text-indigo-900 ring-2 ring-indigo-500/20 shadow-xs' : 'border-gray-200 bg-white/70 text-gray-600 hover:bg-white', 'w-full p-3 rounded-xl border text-left text-xs transition-all flex items-start gap-2.5 cursor-pointer']">
                          <Icon name="lucide:user-check" class="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                          <div>
                            <p class="font-bold text-gray-900">Solo correos autorizados</p>
                            <p class="text-[11px] text-gray-500 leading-tight mt-0.5">Restringido únicamente a los correos de tu lista.</p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  <!-- If RESTRICTED: Allowed Emails (Interactive Chips Component) -->
                  <div v-if="editEventData.accessType === 'RESTRICTED'" class="bg-white p-4 rounded-xl border border-gray-200">
                    <EmailChipsInput 
                      v-model="editEventData.allowedEmails" 
                      label="Correos o usuarios autorizados"
                      placeholder="cliente@gmail.com, novios@boda.com, @carlos"
                    />
                  </div>

                  <!-- Password Protection Card -->
                  <div class="p-3.5 bg-white border border-gray-200 rounded-xl space-y-3">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2.5">
                        <div class="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                          <Icon name="lucide:key-round" class="w-4 h-4" />
                        </div>
                        <div>
                          <p class="text-xs font-bold text-gray-900">Proteger con Contraseña</p>
                          <p class="text-[11px] text-gray-500">Exige una clave para desbloquear y ver las fotos</p>
                        </div>
                      </div>
                      <button 
                        type="button" 
                        @click="editEventData.hasPassword = !editEventData.hasPassword; if (!editEventData.hasPassword) editEventData.accessPassword = ''"
                        :class="[editEventData.hasPassword ? 'bg-indigo-600' : 'bg-gray-200', 'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out']"
                      >
                        <span :class="[editEventData.hasPassword ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']" />
                      </button>
                    </div>

                    <div v-if="editEventData.hasPassword" class="pt-2 border-t border-gray-100">
                      <label class="text-xs font-bold text-gray-700 block mb-1">Contraseña o PIN del evento</label>
                      <input 
                        v-model="editEventData.accessPassword" 
                        type="text" 
                        placeholder="Ej: BodaAlex2026 o 4829" 
                        class="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none font-mono tracking-wider transition-all"
                      />
                      <p class="text-[11px] text-gray-400 mt-1">Cualquier visitante con el link deberá introducir esta clave para acceder a las fotos.</p>
                    </div>
                  </div>

                </div>
              </div>

              <!-- PERMISOS DE SUBIDA (Colaboradores - Fotógrafos y Usuarios) -->
              <div class="p-4 bg-gray-50/80 border border-gray-200/80 rounded-2xl space-y-3">
                <div class="flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                      <Icon name="lucide:user-plus" class="w-4 h-4" />
                    </div>
                    <div>
                      <p class="text-xs font-bold text-gray-900">¿Permitir colaboradores para subir fotos?</p>
                      <p class="text-[11px] text-gray-500">Por defecto desactivado (solo tú puedes subir fotos)</p>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <span v-if="!authStore.isPro && !authStore.isAdmin" class="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900">PRO</span>
                    <button 
                      type="button" 
                      @click="handleEditToggleCollaborators"
                      :class="[editEventData.allowCollaborators ? 'bg-indigo-600' : 'bg-gray-300', 'relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out']"
                    >
                      <span :class="[editEventData.allowCollaborators ? 'translate-x-5' : 'translate-x-0', 'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out']" />
                    </button>
                  </div>
                </div>

                <div v-if="editEventData.allowCollaborators" class="pt-2 border-t border-gray-100 space-y-2">
                  <p class="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                    <Icon name="lucide:check-circle" class="w-3.5 h-3.5" />
                    Modo colaborativo activado: puedes autorizar fotógrafos o usuarios específicos.
                  </p>
                  <EmailChipsInput 
                    v-model="editEventData.allowedUploaders" 
                    label="Fotógrafos o usuarios autorizados (opcional)"
                    placeholder="Escribe un correo o @usuario para darle permiso de subida..."
                  />
                </div>
                <div v-else class="text-[11px] text-gray-400 bg-white p-2.5 rounded-xl border border-gray-100">
                  🛡️ Protegido: Solo tú tienes permiso para subir fotos a este evento.
                </div>
              </div>

            </div>

            <!-- MODAL FOOTER (FIXED / STICKY AT BOTTOM) -->
            <div class="px-6 py-4 border-t border-gray-100 bg-gray-50/90 flex items-center justify-end gap-3 shrink-0">
              <button 
                type="button" 
                @click="showEditEventModal = false" 
                class="px-5 py-2.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-700 font-bold text-sm rounded-xl transition-all cursor-pointer">
                Cancelar
              </button>
              <button 
                type="submit" 
                class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-all active:scale-[0.98] cursor-pointer flex items-center gap-1.5">
                <Icon name="lucide:check" class="w-4 h-4" />
                Guardar Cambios
              </button>
            </div>

          </form>
        </div>
      </div>
    </Transition>

    <!-- ═══════════════════════════════════════════ -->
    <!-- MODAL: Confirmar Eliminación de Evento      -->
    <!-- ═══════════════════════════════════════════ -->
    <Transition name="fade">
      <div v-if="showDeleteEventModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" @click.self="showDeleteEventModal = false">
        <div class="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-scale-up border border-red-100">
          <div class="p-6 text-center">
            <!-- Warning Icon with soft glow -->
            <div class="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-red-50">
              <Icon name="lucide:alert-triangle" class="w-8 h-8" />
            </div>

            <h3 class="text-xl font-bold text-gray-900 mb-2">¿Estás seguro de eliminar este evento?</h3>
            <p class="text-sm text-gray-500 mb-4">
              Estás a punto de eliminar el evento <strong class="text-gray-900">"{{ event?.title }}"</strong>.
            </p>

            <!-- Warning Summary Box -->
            <div class="bg-red-50/80 border border-red-200/70 rounded-xl p-4 text-left text-xs text-red-800 space-y-2 mb-5">
              <div class="flex items-start gap-2">
                <Icon name="lucide:alert-circle" class="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>Se borrarán permanentemente <strong>{{ event?.photoCount || 0 }} fotos</strong> asociadas.</span>
              </div>
              <div class="flex items-start gap-2">
                <Icon name="lucide:alert-circle" class="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>Se eliminarán todos los paquetes de precios y enlaces de venta.</span>
              </div>
              <div class="flex items-start gap-2 font-semibold">
                <Icon name="lucide:shield-alert" class="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                <span>Esta acción es irreversible y no se puede recuperar.</span>
              </div>
            </div>

            <!-- Extra Verification Step -->
            <div class="text-left mb-5">
              <label class="block text-xs font-semibold text-gray-700 mb-1.5">
                Comprobación de seguridad: escribe <strong class="text-red-600 font-bold tracking-wider">ELIMINAR</strong> para confirmar:
              </label>
              <input
                v-model="deleteConfirmationInput"
                type="text"
                placeholder="Escribe ELIMINAR"
                autocomplete="off"
                class="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none text-sm font-medium transition-all"
                @keyup.enter="confirmDeleteEvent"
              />
            </div>

            <!-- Action buttons -->
            <div class="flex gap-3">
              <button
                type="button"
                @click="showDeleteEventModal = false"
                class="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all flex-1 text-sm"
                :disabled="isDeletingEvent"
              >
                Cancelar
              </button>
              <button
                type="button"
                @click="confirmDeleteEvent"
                :disabled="deleteConfirmationInput.trim().toUpperCase() !== 'ELIMINAR' || isDeletingEvent"
                class="px-5 py-2.5 bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white font-semibold rounded-xl shadow-lg shadow-red-500/20 transition-all flex items-center justify-center gap-2 flex-1 text-sm"
              >
                <Icon v-if="isDeletingEvent" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
                <span>{{ isDeletingEvent ? 'Eliminando...' : 'Sí, Eliminar' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>

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
        <p class="text-slate-400 text-xs mt-2">Analizando características y rasgos faciales para encontrar coincidencias en tus fotos...</p>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup>
import { useEventsStore } from '~/stores/events'
import { usePhotosStore } from '~/stores/photos'
import { usePackagesStore } from '~/stores/packages'
import EventInviteModal from '~/components/event/EventInviteModal.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const eventsStore = useEventsStore()
const photosStore = usePhotosStore()
const packagesStore = usePackagesStore()
const { $api } = useNuxtApp()
const { confirm } = useConfirm()
const toast = useToast()

const eventId = route.params.id
const event = ref(null)
const loadingEvent = ref(true)
const activeTab = ref('photos')

const showInviteModal = ref(false)
const inviteInitialType = ref('upload')

function openInviteModal(type = 'upload') {
  inviteInitialType.value = type
  showInviteModal.value = true
}

const showEditEventModal = ref(false)
const showDeleteEventModal = ref(false)
const showCollaboratorsModal = ref(false)
const quickAllowedUploaders = ref('')
const quickCollabInput = ref('')
const isSavingCollaborators = ref(false)

const collaboratorsList = ref([])
const displayedCollaborators = computed(() => {
    return collaboratorsList.value.filter(c => c.identifier !== 'ANYONE_WITH_LINK')
})
const isAnyoneWithLink = computed(() => {
    return Boolean(
        event.value?.allowedUploaders?.includes('ANYONE_WITH_LINK') ||
        collaboratorsList.value.some(c => c.identifier === 'ANYONE_WITH_LINK')
    )
})

const originUrl = computed(() => {
    if (process.client) return window.location.origin
    return 'https://www.moments-gallery.com'
})

const uploadInviteUrl = computed(() => {
    if (!event.value?.id) return ''
    const token = event.value.uuid || event.value.id
    return `${originUrl.value}/dashboard/photographer/events/${event.value.id}?tab=photos&invite=${token}`
})

const copiedUploadLink = ref(false)

async function enableCollaborativeModeQuietly() {
    if (!event.value) return
    try {
        const payload = {
            title: event.value.title,
            date: event.value.date,
            location: event.value.location,
            description: event.value.description,
            isPrivate: Boolean(event.value.isPrivate),
            accessType: event.value.accessType || (event.value.isPrivate ? 'UNLISTED' : 'PUBLIC'),
            allowFreeDownloads: Boolean(event.value.allowFreeDownloads),
            allowCollaborators: true,
            allowedEmails: event.value.allowedEmails || '',
            allowedUploaders: event.value.allowedUploaders || '',
            collaborators: collaboratorsList.value,
            accessPassword: event.value.accessPassword || ''
        }
        const updated = await eventsStore.updateEvent(event.value.id, payload)
        if (updated) {
            event.value = updated
            syncCollaboratorsFromEvent()
        }
    } catch (e) {
        console.warn('Could not auto-enable collaborative mode quietly:', e)
    }
}

async function copyUploadLink() {
    if (!uploadInviteUrl.value) return
    if (!event.value.allowCollaborators && (authStore.isPro || authStore.isAdmin)) {
        await enableCollaborativeModeQuietly()
    }
    try {
        await navigator.clipboard.writeText(uploadInviteUrl.value)
        copiedUploadLink.value = true
        toast.success('¡Enlace copiado!', 'Enlace directo para subir fotos copiado al portapapeles. El modo colaborativo está activo.')
        setTimeout(() => { copiedUploadLink.value = false }, 2500)
    } catch {
        toast.error('Error', 'No se pudo copiar el enlace')
    }
}

async function shareUploadWhatsApp() {
    if (!event.value) return
    if (!event.value.allowCollaborators && (authStore.isPro || authStore.isAdmin)) {
        await enableCollaborativeModeQuietly()
    }
    const text = `¡Hola! Te invito a subir tus fotos al álbum "${event.value.title}" en Moments:\n${uploadInviteUrl.value}`
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank')
}

async function toggleCollaborativeMode() {
    if (!event.value) return
    if (!authStore.isPro && !authStore.isAdmin) {
        try {
            await $api('/subscriptions/activate-trial', { method: 'POST' })
            authStore.updateUserData({ isPro: true })
        } catch (e) {
            console.warn('Could not activate trial:', e)
        }
    }

    const nextState = !event.value.allowCollaborators
    isSavingCollaborators.value = true
    try {
        const payload = {
            title: event.value.title,
            date: event.value.date,
            location: event.value.location,
            description: event.value.description,
            isPrivate: Boolean(event.value.isPrivate),
            accessType: event.value.accessType || (event.value.isPrivate ? 'UNLISTED' : 'PUBLIC'),
            allowFreeDownloads: Boolean(event.value.allowFreeDownloads),
            allowCollaborators: nextState,
            allowedEmails: event.value.allowedEmails || '',
            allowedUploaders: event.value.allowedUploaders || '',
            collaborators: collaboratorsList.value,
            accessPassword: event.value.accessPassword || ''
        }
        const updated = await eventsStore.updateEvent(event.value.id, payload)
        if (updated) {
            event.value = updated
            syncCollaboratorsFromEvent()
            toast.success(
                nextState 
                    ? '¡Modo colaborativo activado! Ya puedes invitar a otros a subir fotos.'
                    : 'Modo colaborativo desactivado. Por seguridad, solo tú puedes subir fotos.'
            )
        } else {
            toast.error('Error', eventsStore.error || 'No se pudo actualizar el modo colaborativo')
        }
    } catch (err) {
        toast.error('Error', err?.message || 'Error al actualizar el modo colaborativo')
    } finally {
        isSavingCollaborators.value = false
    }
}

async function handleEditToggleCollaborators() {
    if (!authStore.isPro && !authStore.isAdmin) {
        try {
            await $api('/subscriptions/activate-trial', { method: 'POST' })
            authStore.updateUserData({ isPro: true })
        } catch (e) {
            console.warn('Could not activate trial:', e)
        }
    }
    editEventData.value.allowCollaborators = !editEventData.value.allowCollaborators
}

async function toggleAnyoneWithLink() {
    if (!event.value) return
    if (!authStore.isPro && !authStore.isAdmin) {
        toast.error('Función Exclusiva Moments PRO', 'Necesitas una suscripción PRO para gestionar colaboradores.')
        return
    }
    const currentlyActive = isAnyoneWithLink.value
    let collabs = [...collaboratorsList.value]
    if (currentlyActive) {
        collabs = collabs.filter(c => c.identifier !== 'ANYONE_WITH_LINK')
    } else {
        if (!collabs.some(c => c.identifier === 'ANYONE_WITH_LINK')) {
            collabs.push({
                identifier: 'ANYONE_WITH_LINK',
                username: '',
                email: '',
                name: 'Cualquiera con el enlace',
                avatarUrl: '',
                canUpload: true
            })
        }
    }
    collaboratorsList.value = collabs
    await saveCollaborators()
    toast.success(
        !currentlyActive 
            ? 'Subida libre activada: cualquier persona con el enlace puede subir fotos' 
            : 'Subida libre desactivada: solo personas autorizadas pueden subir'
    )
}
const newCollabIdentifier = ref('')
const newCollabCanUpload = ref(true)
const deleteConfirmationInput = ref('')
const isDeletingEvent = ref(false)
const showBibModal = ref(false)
const editingPhoto = ref(null)
const editBibValue = ref('')
const editEventData = ref({
  title: '',
  date: '',
  location: '',
  description: '',
  isPrivate: false,
  allowFreeDownloads: false,
  allowCollaborators: false,
  allowedEmails: '',
  allowedUploaders: '',
  accessType: 'UNLISTED',
  hasPassword: false,
  accessPassword: ''
})

const defaultPrice = ref(5000)
const selectedFiles = ref([])
const filePreviews = ref([])
const uploadStatus = ref([])
const isUploading = ref(false)
const runAI = ref(true)

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
    loadingEvent.value = true
    try {
        let inviteToken = route.query.invite ? String(route.query.invite) : undefined
        if (inviteToken && process.client) {
            sessionStorage.setItem(`event_invite_${eventId}`, inviteToken)
        } else if (!inviteToken && process.client) {
            const stored = sessionStorage.getItem(`event_invite_${eventId}`)
            if (stored) inviteToken = stored
        }
        if (inviteToken && authStore.isAuthenticated) {
            const joined = await eventsStore.joinCollaborator(eventId, inviteToken)
            if (joined) {
                toast.success('¡Acceso concedido!', 'Te has unido exitosamente como colaborador para subir fotos.')
            }
        }
        await fetchEvent()
        if (event.value) {
            const isInviteMatch = Boolean(inviteToken && (
                inviteToken.toLowerCase() === event.value.uuid?.toLowerCase() || 
                inviteToken === String(event.value.id)
            ))
            const hasUploadAccess = event.value.isOwner || event.value.canUpload || authStore.isAdmin || isInviteMatch || authStore.isPhotographer
            if (!hasUploadAccess) {
                toast.error('Acceso no autorizado', 'El propietario de este evento no te ha otorgado permiso para subir fotos.')
                router.push('/')
                return
            }
            if (route.query.tab && ['photos', 'packages', 'collaborators'].includes(String(route.query.tab))) {
                if (route.query.tab === 'collaborators' && !event.value.isOwner && !authStore.isAdmin && !event.value.canUpload) {
                    activeTab.value = 'photos'
                } else if (route.query.tab === 'packages' && !event.value.isOwner && !authStore.isAdmin) {
                    activeTab.value = 'photos'
                } else {
                    activeTab.value = String(route.query.tab)
                }
            }
            await fetchPhotos()
            if (event.value.isOwner || authStore.isAdmin) {
                await packagesStore.fetchMyPackages()
                await packagesStore.fetchPackagesForEvent(event.value.id)
            }
        } else {
            router.push('/')
        }
    } catch (e) {
        console.error('Error cargando evento:', e)
        router.push('/')
    } finally {
        loadingEvent.value = false
    }
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

function syncCollaboratorsFromEvent() {
    if (!event.value) return
    if (Array.isArray(event.value.collaborators) && event.value.collaborators.length > 0) {
        collaboratorsList.value = event.value.collaborators.map((c) => ({
            identifier: c.identifier || c.username || c.email || '',
            username: c.username || '',
            email: c.email || '',
            name: c.name || '',
            avatarUrl: c.avatarUrl || '',
            canUpload: c.canUpload !== false
        }))
    } else if (event.value.allowedUploaders) {
        try {
            const parsed = JSON.parse(event.value.allowedUploaders)
            if (Array.isArray(parsed)) {
                collaboratorsList.value = parsed.map((c) => typeof c === 'string' ? {
                    identifier: c,
                    username: c.startsWith('@') ? c.substring(1) : '',
                    email: c.includes('@') && c.includes('.') ? c : '',
                    name: '',
                    avatarUrl: '',
                    canUpload: true
                } : {
                    identifier: c.identifier || c.username || c.email || '',
                    username: c.username || '',
                    email: c.email || '',
                    name: c.name || '',
                    avatarUrl: c.avatarUrl || '',
                    canUpload: c.canUpload !== false
                })
            } else {
                collaboratorsList.value = []
            }
        } catch {
            const list = event.value.allowedUploaders.split(',').map((s) => s.trim()).filter(Boolean)
            collaboratorsList.value = list.map((id) => ({
                identifier: id,
                username: id.startsWith('@') ? id.substring(1) : '',
                email: id.includes('@') && id.includes('.') ? id : '',
                name: '',
                avatarUrl: '',
                canUpload: true
            }))
        }
    } else {
        collaboratorsList.value = []
    }
}

function addCollaborator() {
    const raw = newCollabIdentifier.value.trim()
    if (!raw) return

    const exists = collaboratorsList.value.some(c => 
        c.identifier?.toLowerCase() === raw.toLowerCase() ||
        (c.username && ('@' + c.username.toLowerCase()) === raw.toLowerCase()) ||
        (c.email && c.email.toLowerCase() === raw.toLowerCase())
    )
    if (exists) {
        toast.warning('Este colaborador ya está en la lista')
        return
    }

    collaboratorsList.value.push({
        identifier: raw,
        username: raw.startsWith('@') ? raw.substring(1) : (raw.includes('@') ? '' : raw),
        email: raw.includes('@') && raw.includes('.') ? raw : '',
        name: '',
        avatarUrl: '',
        canUpload: newCollabCanUpload.value
    })

    newCollabIdentifier.value = ''
    newCollabCanUpload.value = true
}

function removeCollaborator(index) {
    collaboratorsList.value.splice(index, 1)
}

async function addQuickCollaborator() {
    const raw = quickCollabInput.value.trim()
    if (!raw) return
    if (!authStore.isPro && !authStore.isAdmin) {
        toast.error('Función Exclusiva Moments PRO', 'Necesitas una suscripción PRO para asignar colaboradores a este álbum.')
        return
    }
    const exists = collaboratorsList.value.some(c => 
        c.identifier?.toLowerCase() === raw.toLowerCase() ||
        (c.username && ('@' + c.username.toLowerCase()) === raw.toLowerCase()) ||
        (c.email && c.email.toLowerCase() === raw.toLowerCase())
    )
    if (exists) {
        toast.warning('Este usuario ya está autorizado en este evento')
        return
    }
    collaboratorsList.value.push({
        identifier: raw,
        username: raw.startsWith('@') ? raw.substring(1) : (raw.includes('@') ? '' : raw),
        email: raw.includes('@') && raw.includes('.') ? raw : '',
        name: '',
        avatarUrl: '',
        canUpload: true
    })
    quickCollabInput.value = ''
    await saveCollaborators()
}

async function removeAndSaveCollaborator(index) {
    collaboratorsList.value.splice(index, 1)
    await saveCollaborators()
}

function openCollaboratorsTab() {
    if (!authStore.isPro && !authStore.isAdmin) {
        confirm({
            title: 'Función Exclusiva Moments PRO 👑',
            message: 'La asignación de colaboradores con permisos avanzados para subir fotos a tus álbumes es una función exclusiva para miembros Moments PRO ($5.000 COP / mes).\n\n¿Deseas conocer los beneficios de Moments PRO y activarlo ahora?',
            confirmText: 'Ver Beneficios PRO',
            cancelText: 'Cerrar',
            icon: 'lucide:crown'
        }).then(wantToUpgrade => {
            if (wantToUpgrade) {
                window.open('/dashboard/photographer/subscription', '_blank')
            }
        })
        return
    }
    syncCollaboratorsFromEvent()
    activeTab.value = 'collaborators'
    nextTick(() => {
        const el = document.getElementById('event-tabs-nav')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    })
}

async function fetchEvent() {
    let inviteToken = route.query.invite ? String(route.query.invite) : undefined
    if (inviteToken && process.client) {
        sessionStorage.setItem(`event_invite_${eventId}`, inviteToken)
    } else if (!inviteToken && process.client) {
        const stored = sessionStorage.getItem(`event_invite_${eventId}`)
        if (stored) inviteToken = stored
    }
    event.value = await eventsStore.fetchEventById(eventId, undefined, inviteToken)
    if (event.value) {
        quickAllowedUploaders.value = event.value.allowedUploaders || ''
        syncCollaboratorsFromEvent()
    }
}

async function openCollaboratorsModal() {
    openCollaboratorsTab()
}

async function saveCollaborators() {
    if (!event.value) return
    if (!authStore.isPro && !authStore.isAdmin) {
        toast.error('Función Exclusiva Moments PRO', 'Necesitas una suscripción PRO para asignar colaboradores a este álbum.')
        return
    }
    isSavingCollaborators.value = true
    try {
        const serialized = JSON.stringify(collaboratorsList.value)
        const payload = {
            title: event.value.title,
            date: event.value.date,
            location: event.value.location,
            description: event.value.description,
            isPrivate: Boolean(event.value.isPrivate),
            accessType: event.value.accessType || (event.value.isPrivate ? 'UNLISTED' : 'PUBLIC'),
            allowFreeDownloads: Boolean(event.value.allowFreeDownloads),
            allowCollaborators: Boolean(event.value.allowCollaborators),
            allowedEmails: event.value.allowedEmails || '',
            allowedUploaders: serialized,
            collaborators: collaboratorsList.value,
            accessPassword: event.value.accessPassword || ''
        }
        const updated = await eventsStore.updateEvent(event.value.id, payload)
        if (updated) {
            event.value = updated
            syncCollaboratorsFromEvent()
            editEventData.value.allowedUploaders = updated.allowedUploaders || ''
            toast.success('Permisos y colaboradores guardados con éxito')
            showCollaboratorsModal.value = false
        } else {
            toast.error('Error', eventsStore.error || 'No se pudieron actualizar los colaboradores')
        }
    } catch (err) {
        console.error('Error saving collaborators', err)
        toast.error('Error', err?.message || 'Error al guardar los colaboradores')
    } finally {
        isSavingCollaborators.value = false
    }
}

async function fetchPhotos() {
    if (event.value) {
        await photosStore.fetchPhotosByEvent(event.value.id)
    }
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
    const rawExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.cr3', '.cr2', '.dng', '.raw', '.nef', '.arw']
    const validFiles = files.filter(f => {
        const isImageMime = f.type && f.type.startsWith('image/')
        const ext = f.name.includes('.') ? f.name.substring(f.name.lastIndexOf('.')).toLowerCase() : ''
        return isImageMime || rawExtensions.includes(ext)
    })
    selectedFiles.value = [...selectedFiles.value, ...validFiles]
    uploadStatus.value = new Array(selectedFiles.value.length).fill(null)

    // Generate thumbnail previews
    generatePreviews()
}

async function extractRawPreview(file) {
    try {
        // Read up to 16MB of the file (large enough for embedded previews across all major camera brands)
        const sliceSize = Math.min(file.size, 16 * 1024 * 1024)
        const buffer = await file.slice(0, sliceSize).arrayBuffer()
        const bytes = new Uint8Array(buffer)
        const dataView = new DataView(buffer)

        const isJpegStart = (idx) => {
            return idx + 2 < bytes.length && bytes[idx] === 0xFF && bytes[idx + 1] === 0xD8 && bytes[idx + 2] === 0xFF
        }

        // 1. Canon CR3 parser (ISO-BMFF Box container)
        for (let i = 0; i < bytes.length - 8; i++) {
            if (bytes[i] === 0x50 && bytes[i+1] === 0x52 && bytes[i+2] === 0x56 && bytes[i+3] === 0x57) { // 'PRVW'
                for (let j = i; j < Math.min(bytes.length - 3, i + 64); j++) {
                    if (isJpegStart(j)) {
                        let lastEoi = -1
                        for (let k = bytes.length - 2; k >= j + 1024; k--) {
                            if (bytes[k] === 0xFF && bytes[k + 1] === 0xD9) {
                                lastEoi = k + 2
                                break
                            }
                        }
                        if (lastEoi !== -1) {
                            const blob = new Blob([bytes.subarray(j, lastEoi)], { type: 'image/jpeg' })
                            return URL.createObjectURL(blob)
                        }
                    }
                }
            }
        }

        // 2. TIFF-Based RAWs (Canon CR2, Nikon NEF, Sony ARW, Adobe DNG, Pentax PEF, Olympus ORF)
        if (bytes.length >= 8) {
            const isLittle = bytes[0] === 0x49 && bytes[1] === 0x49
            const isBig = bytes[0] === 0x4D && bytes[1] === 0x4D
            if (isLittle || isBig) {
                const tiffMagic = dataView.getUint16(2, isLittle)
                if (tiffMagic === 42 || tiffMagic === 0x55) {
                    try {
                        const firstIfdOffset = dataView.getUint32(4, isLittle)
                        if (firstIfdOffset > 0 && firstIfdOffset < bytes.length - 2) {
                            let currIfd = firstIfdOffset
                            while (currIfd > 0 && currIfd < bytes.length - 2) {
                                const numEntries = dataView.getUint16(currIfd, isLittle)
                                let offsetFound = 0
                                let lengthFound = 0

                                for (let e = 0; e < numEntries; e++) {
                                    const entryOffset = currIfd + 2 + e * 12
                                    if (entryOffset + 12 > bytes.length) break

                                    const tag = dataView.getUint16(entryOffset, isLittle)
                                    if (tag === 0x0201 || tag === 0x0111) {
                                        offsetFound = dataView.getUint32(entryOffset + 8, isLittle)
                                    } else if (tag === 0x0202 || tag === 0x0117) {
                                        lengthFound = dataView.getUint32(entryOffset + 8, isLittle)
                                    }
                                }

                                if (offsetFound > 0 && lengthFound > 1024 && offsetFound + lengthFound <= bytes.length) {
                                    if (isJpegStart(offsetFound)) {
                                        const blob = new Blob([bytes.subarray(offsetFound, offsetFound + lengthFound)], { type: 'image/jpeg' })
                                        return URL.createObjectURL(blob)
                                    }
                                }

                                const nextIfdOffset = currIfd + 2 + numEntries * 12
                                if (nextIfdOffset + 4 <= bytes.length) {
                                    currIfd = dataView.getUint32(nextIfdOffset, isLittle)
                                } else {
                                    break
                                }
                            }
                        }
                    } catch (tiffErr) {
                        // Fallback to universal scanner
                    }
                }
            }
        }

        // 3. Universal scanner: Find all valid JPEG streams and pick the largest one
        const soiPositions = []
        for (let i = 0; i < bytes.length - 3; i++) {
            if (isJpegStart(i)) {
                soiPositions.push(i)
                i += 2
            }
        }

        let largestBlob = null
        let maxLen = 0

        for (let idx = 0; idx < soiPositions.length; idx++) {
            const startPos = soiPositions[idx]
            let eoi = -1
            const searchLimit = (idx + 1 < soiPositions.length) ? soiPositions[idx + 1] : bytes.length
            for (let k = searchLimit - 2; k >= startPos + 1024; k--) {
                if (bytes[k] === 0xFF && bytes[k + 1] === 0xD9) {
                    eoi = k + 2
                    break
                }
            }

            if (eoi !== -1) {
                const len = eoi - startPos
                if (len > maxLen) {
                    maxLen = len
                    largestBlob = bytes.subarray(startPos, eoi)
                }
            }
        }

        if (largestBlob && maxLen > 1024) {
            const blob = new Blob([largestBlob], { type: 'image/jpeg' })
            return URL.createObjectURL(blob)
        }
    } catch (e) {
        console.warn('Could not extract RAW preview in browser:', e)
    }
    return null
}

async function generatePreviews() {
    filePreviews.value = new Array(selectedFiles.value.length).fill(null)
    const rawExtensions = ['.cr3', '.cr2', '.dng', '.raw', '.nef', '.arw']
    
    for (let i = 0; i < selectedFiles.value.length; i++) {
        const file = selectedFiles.value[i]
        const ext = file.name.includes('.') ? file.name.substring(file.name.lastIndexOf('.')).toLowerCase() : ''
        
        if (rawExtensions.includes(ext)) {
            extractRawPreview(file).then(url => {
                if (url && i < filePreviews.value.length) {
                    filePreviews.value[i] = url
                }
            })
        } else {
            filePreviews.value[i] = URL.createObjectURL(file)
        }
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
    filePreviews.value.forEach(url => {
        if (url) URL.revokeObjectURL(url)
    })
    selectedFiles.value = []
    uploadStatus.value = []
    filePreviews.value = []
}

async function openBatchInStudio() {
    if (selectedFiles.value.length === 0) return
    const studio = useLightroomStudio()
    await studio.loadPhotosFromFiles(selectedFiles.value)
    router.push({ path: '/dashboard/photographer/studio', query: { eventId: String(event.value.id) } })
}

function clearFailedFiles() {
    lastUploadError.value = ''
    const newFiles = []
    const newStatus = []
    const newPreviews = []
    for (let i = 0; i < selectedFiles.value.length; i++) {
        if (uploadStatus.value[i] === 'error') {
            if (filePreviews.value[i]) URL.revokeObjectURL(filePreviews.value[i])
        } else {
            newFiles.push(selectedFiles.value[i])
            newStatus.push(uploadStatus.value[i])
            newPreviews.push(filePreviews.value[i])
        }
    }
    selectedFiles.value = newFiles
    uploadStatus.value = newStatus
    filePreviews.value = newPreviews
}

// ─── Upload Computed & State ─────────────────────────────────────
const uploadProgressText = ref('')
const lastUploadError = ref('')

const failedUploadsCount = computed(() => {
    return uploadStatus.value.filter(s => s === 'error').length
})

const completedUploadsCount = computed(() => {
    return uploadStatus.value.filter(s => s === 'done').length
})

// ─── Upload Actions ─────────────────────────────────────────────
async function uploadFiles() {
    if (selectedFiles.value.length === 0 || isUploading.value) return
    isUploading.value = true
    lastUploadError.value = ''

    let successCount = 0
    let failCount = 0

    // Reset error statuses to null before starting upload cycle
    for (let i = 0; i < selectedFiles.value.length; i++) {
        if (uploadStatus.value[i] === 'error') {
            uploadStatus.value[i] = null
        }
    }

    for (let i = 0; i < selectedFiles.value.length; i++) {
        if (uploadStatus.value[i] === 'done') {
            successCount++
            continue
        }

        const file = selectedFiles.value[i]
        uploadProgressText.value = `Subiendo ${i + 1} de ${selectedFiles.value.length}: ${file.name}`
        uploadStatus.value[i] = 'uploading'

        try {
            const result = await photosStore.uploadPhoto(event.value.id, file, defaultPrice.value, '', runAI.value)
            if (result) {
                uploadStatus.value[i] = 'done'
                successCount++
            } else {
                uploadStatus.value[i] = 'error'
                failCount++
                if (!lastUploadError.value) {
                    lastUploadError.value = 'No tienes permiso para subir fotos a este evento o el modo colaborativo está inactivo.'
                }
            }
        } catch (e) {
            console.error(e)
            uploadStatus.value[i] = 'error'
            failCount++
            lastUploadError.value = e?.message || 'Error al procesar la subida.'
        }
    }

    isUploading.value = false
    uploadProgressText.value = ''
    await fetchPhotos()
    await fetchEvent()

    if (failCount === 0 && successCount > 0) {
        toast.success('¡Subida completada!', `${successCount} foto${successCount > 1 ? 's' : ''} subida${successCount > 1 ? 's' : ''} exitosamente.`)
    } else if (failCount > 0) {
        if (successCount > 0) {
            toast.success('¡Subida completada!', `${successCount} foto${successCount > 1 ? 's' : ''} subida${successCount > 1 ? 's' : ''} exitosamente.`)
        }
        toast.error('Fotos con error', `${failCount} foto${failCount > 1 ? 's' : ''} no se ${failCount > 1 ? 'pudieron' : 'pudo'} subir. Haz clic en "Reintentar fallidas" para volver a enviarlas.`)
    }

    // Automatically remove 'done' files after 1.5s, keeping 'error' files intact in queue
    setTimeout(() => {
        const newFiles = []
        const newStatus = []
        const newPreviews = []
        for (let i = 0; i < selectedFiles.value.length; i++) {
            if (uploadStatus.value[i] === 'error') {
                newFiles.push(selectedFiles.value[i])
                newStatus.push(uploadStatus.value[i])
                newPreviews.push(filePreviews.value[i])
            } else if (uploadStatus.value[i] === 'done') {
                if (filePreviews.value[i]) {
                    URL.revokeObjectURL(filePreviews.value[i])
                }
            } else {
                newFiles.push(selectedFiles.value[i])
                newStatus.push(uploadStatus.value[i])
                newPreviews.push(filePreviews.value[i])
            }
        }
        selectedFiles.value = newFiles
        uploadStatus.value = newStatus
        filePreviews.value = newPreviews
    }, 1500)
}

async function retryFailedUploads() {
    await uploadFiles()
}

async function retrySingleUpload(index) {
    if (isUploading.value || !selectedFiles.value[index]) return
    
    const file = selectedFiles.value[index]
    uploadStatus.value[index] = 'uploading'
    isUploading.value = true

    try {
        const result = await photosStore.uploadPhoto(event.value.id, file, defaultPrice.value, '', runAI.value)
        if (result) {
            uploadStatus.value[index] = 'done'
            toast.success('¡Subida completada!', `1 foto subida exitosamente.`)
            await fetchPhotos()
            await fetchEvent()
            
            setTimeout(() => {
                const targetIdx = selectedFiles.value.indexOf(file)
                if (targetIdx > -1 && uploadStatus.value[targetIdx] === 'done') {
                    removeFile(targetIdx)
                }
            }, 1000)
        } else {
            uploadStatus.value[index] = 'error'
            lastUploadError.value = 'No se pudo subir la foto. Verifica los permisos del evento.'
            toast.error('Error', `No se pudo subir "${file.name}".`)
        }
    } catch (e) {
        console.error(e)
        uploadStatus.value[index] = 'error'
        lastUploadError.value = e?.message || 'Error de subida'
        toast.error('Error', e?.message || `Error de subida para "${file.name}".`)
    } finally {
        isUploading.value = false
    }
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
    if (photosStore.loading || !photosStore.hasMore || !event.value) return
    await photosStore.fetchPhotosByEvent(event.value.id, photosStore.currentPage + 1)
}
 
function copyShareLink() {
    if (!event.value) return
    const id = event.value.uuid || event.value.id
    const url = `${window.location.origin}/marketplace/events/${id}`
    navigator.clipboard.writeText(url)
    toast.success('Enlace copiado', 'Compártelo con tus clientes para que puedan ingresar.')
}

async function handleSelectPrivate() {
    if (!authStore.isPro && !authStore.isAdmin) {
        const wantToUpgrade = await confirm({
            title: 'Función Exclusiva Moments PRO 👑',
            message: 'Los álbumes privados (con acceso por enlace y correos autorizados) son exclusivos para miembros Moments PRO ($5.000 COP / mes).\n\n¿Deseas conocer los beneficios de Moments PRO?',
            confirmText: 'Ver Beneficios PRO',
            cancelText: 'Seguir en Público',
            icon: 'lucide:crown'
        })
        if (wantToUpgrade) {
            window.open('/dashboard/photographer/subscription', '_blank')
        }
        return
    }
    editEventData.value.isPrivate = true
}

function openEditEventModal() {
    if (event.value) {
        editEventData.value = {
            title: event.value.title,
            date: event.value.date,
            location: event.value.location,
            description: event.value.description || '',
            isPrivate: !!event.value.isPrivate,
            allowFreeDownloads: !!event.value.allowFreeDownloads,
            allowedEmails: event.value.allowedEmails || '',
            allowedUploaders: event.value.allowedUploaders || '',
            allowCollaborators: Boolean(event.value.allowCollaborators),
            accessType: event.value.accessType || (event.value.isPrivate ? 'UNLISTED' : 'PUBLIC'),
            hasPassword: !!event.value.hasPassword,
            accessPassword: event.value.accessPassword || ''
        }
        showEditEventModal.value = true
    }
}

async function updateEvent() {
    if (!editEventData.value.isPrivate) {
        editEventData.value.accessType = 'PUBLIC'
        editEventData.value.accessPassword = null
        editEventData.value.hasPassword = false
        editEventData.value.allowedEmails = ''
        editEventData.value.allowFreeDownloads = false
    }
    const isPrivate = editEventData.value.isPrivate
    const allowCollaborators = Boolean(editEventData.value.allowCollaborators)
    const hasCollaborators = Boolean(editEventData.value.allowedUploaders && editEventData.value.allowedUploaders.trim())
    if ((allowCollaborators || hasCollaborators) && !authStore.isPro && !authStore.isAdmin) {
        toast.error('Función Exclusiva Moments PRO', 'Necesitas una suscripción PRO para permitir que otras personas suban fotos a este evento.')
        return
    }
    if (isPrivate && !authStore.isPro && !authStore.isAdmin) {
        toast.error('Función Exclusiva Moments PRO', 'Necesitas una suscripción PRO para guardar este evento como privado.')
        return
    }
    editEventData.value.isPrivate = isPrivate
    try {
        const data = await eventsStore.updateEvent(event.value.id, editEventData.value)
        if (data) {
            event.value = data
            toast.success('Evento actualizado con éxito')
            showEditEventModal.value = false
        } else {
            toast.error('Error', eventsStore.error || 'No se pudo actualizar el evento')
        }
    } catch (e) {
        console.error(e)
        toast.error('Error', e?.message || 'No se pudo actualizar el evento')
    }
}

function openDeleteEventModal() {
    deleteConfirmationInput.value = ''
    showDeleteEventModal.value = true
}

async function confirmDeleteEvent() {
    if (deleteConfirmationInput.value.trim().toUpperCase() !== 'ELIMINAR' || isDeletingEvent.value) {
        return
    }
    isDeletingEvent.value = true
    try {
        const config = useRuntimeConfig()
        await $fetch(`${config.public.apiBase}/events/${event.value.id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${authStore.token}` }
        })
        showDeleteEventModal.value = false
        toast.success('Evento eliminado permanentemente')
        router.push('/dashboard/photographer')
    } catch (e) {
        console.error('Error al eliminar evento:', e)
        toast.error('Error', 'No se pudo eliminar el evento. Intenta de nuevo.')
    } finally {
        isDeletingEvent.value = false
    }
}

function isCover(photo) {
    if (!photo || !event.value?.coverPhotoUrl) return false
    const cover = (event.value.coverPhotoUrl || '').replace(/^["']|["']$/g, '').trim()
    const target = (photo.watermarkedR2Url || photo.url || '').replace(/^["']|["']$/g, '').trim()
    return cover.length > 0 && cover === target
}

async function setAsCover(photo) {
    if (!photo) return
    const photoUrl = (photo.watermarkedR2Url || photo.url || '').replace(/^["']|["']$/g, '').trim()
    if (!photoUrl) return

    try {
        const targetId = event.value?.id || event.value?.uuid || eventId
        await $api(`/events/${targetId}/cover-photo`, {
            method: 'PUT',
            body: { url: photoUrl }
        })
        if (event.value) {
            event.value.coverPhotoUrl = photoUrl
            if (Array.isArray(event.value.previewPhotos)) {
                event.value.previewPhotos = [
                    photoUrl,
                    ...event.value.previewPhotos.filter(u => (u || '').replace(/^["']|["']$/g, '').trim() !== photoUrl)
                ]
            }
        }
        toast.success('Portada actualizada', 'La foto seleccionada es ahora la portada del evento.')
    } catch (e) {
        console.error('Error al establecer portada con $api:', e)
        try {
            const config = useRuntimeConfig()
            const targetId = event.value?.id || event.value?.uuid || eventId
            await $fetch(`${config.public.apiBase}/events/${targetId}/cover-photo`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authStore.token}`,
                    'Content-Type': 'application/json'
                },
                body: { url: photoUrl }
            })
            if (event.value) {
                event.value.coverPhotoUrl = photoUrl
                if (Array.isArray(event.value.previewPhotos)) {
                    event.value.previewPhotos = [
                        photoUrl,
                        ...event.value.previewPhotos.filter(u => (u || '').replace(/^["']|["']$/g, '').trim() !== photoUrl)
                    ]
                }
            }
            toast.success('Portada actualizada', 'La foto seleccionada es ahora la portada del evento.')
        } catch (err) {
            console.error('Error en fallback de portada:', err)
            toast.error('Error', 'No se pudo establecer la foto de portada. Intenta nuevamente.')
        }
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
        if (pkgForm.value.photoCount > 20) {
            toast.error('Límite de fotos', 'Un paquete puede tener como máximo 20 fotos.')
            return
        }
        if (pkgForm.value.photoCount < 1) {
            toast.error('Cantidad inválida', 'El paquete debe tener al menos 1 foto.')
            return
        }

        const data = { ...pkgForm.value, eventId: event.value.id }
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
        await packagesStore.fetchPackagesForEvent(event.value.id)
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
        await packagesStore.fetchPackagesForEvent(event.value.id)
    }
}

function formatPrice(price) {
    if (!price && price !== 0) return '0'
    return Number(price).toLocaleString('es-CO')
}

function openEditBibModal(photo) {
    editingPhoto.value = photo
    editBibValue.value = photo.bibNumbers ? photo.bibNumbers.replace(/[\[\]"]/g, '') : ''
    showBibModal.value = true
}

async function savePhotoBibs() {
    if (!editingPhoto.value) return
    try {
        const updated = await $api(`/photos/${editingPhoto.value.id}/bibs`, {
            method: 'PUT',
            body: { bibNumbers: editBibValue.value }
        })
        editingPhoto.value.bibNumbers = updated.bibNumbers
        toast.success('Dorsales actualizados')
        showBibModal.value = false
    } catch (e) {
        console.error(e)
        toast.error('Error al actualizar dorsales')
    }
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
