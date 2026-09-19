<template>
  <div class="max-w-4xl mx-auto px-4 py-8">
    <!-- Loading Screen -->
    <div v-if="loading" class="flex flex-col items-center justify-center py-24">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600 mb-3"></div>
      <span class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Cargando perfil...</span>
    </div>

    <!-- User Not Found -->
    <div v-else-if="!profile" class="text-center py-20 bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
      <div class="w-20 h-20 rounded-full border-2 border-gray-300 flex items-center justify-center mx-auto mb-4 bg-gray-50">
        <Icon name="lucide:user-x" class="w-10 h-10 text-gray-400" />
      </div>
      <h3 class="text-xl font-bold text-gray-900 mb-2">Usuario no encontrado</h3>
      <p class="text-gray-500 mb-6 text-sm">Este perfil no existe, ha cambiado de nombre o fue eliminado.</p>
      <NuxtLink to="/marketplace" class="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-black transition-colors">
        <Icon name="lucide:arrow-left" class="w-4 h-4" />
        Volver al Marketplace
      </NuxtLink>
    </div>

    <template v-else>
      <!-- Profile Header (Instagram Style) -->
      <div class="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10 border-b border-gray-200 pb-10">
        <!-- Avatar -->
        <div class="relative flex-shrink-0">
          <div
            class="w-32 h-32 md:w-40 md:h-40 rounded-full p-1 transition-transform hover:scale-105"
            :class="profile.isPro 
              ? 'bg-gradient-to-tr from-amber-400 via-fuchsia-500 to-[#3ef4a1] shadow-lg shadow-amber-500/25' 
              : (isPhotographer ? 'bg-[#3ef4a1] shadow-md shadow-emerald-500/20' : 'bg-gray-200')">
            <div class="w-full h-full rounded-full bg-white p-1">
              <div class="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-100">
                <img v-if="profile.profilePhotoUrl" :src="profile.profilePhotoUrl" alt="Profile"
                  class="w-full h-full object-cover">
                <span v-else class="text-4xl md:text-5xl font-black text-gray-700">
                  {{ profile.username ? profile.username.charAt(0).toUpperCase() : 'U' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Role Badge below Avatar -->
          <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md whitespace-nowrap flex items-center gap-1 z-10"
            :class="profile.isPro
              ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-black border border-amber-300'
              : (isPhotographer ? 'bg-[#3ef4a1] text-slate-900 font-extrabold' : 'bg-gray-800 text-white')">
            <Icon v-if="profile.isPro" name="lucide:crown" class="w-3 h-3 fill-current text-slate-950" />
            <span v-if="profile.isPro">Miembro PRO</span>
            <span v-else-if="isPhotographer">📷 Fotógrafo</span>
            <span v-else>✨ {{ profile.title || 'Coleccionista' }}</span>
          </div>
        </div>

        <!-- Profile Info & Actions -->
        <div class="flex-1 text-center md:text-left min-w-0">
          <div class="flex flex-col md:flex-row md:items-center gap-4 mb-5">
            <!-- Username & PRO icon -->
            <div class="flex items-center justify-center md:justify-start gap-2.5 flex-wrap">
              <h1 class="text-2xl md:text-3xl font-light text-gray-900 tracking-tight">{{ profile.username }}</h1>
              <span
                v-if="profile.isPro"
                class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-sm border border-amber-300 tracking-wide"
                title="Miembro Moments PRO Activo"
              >
                <Icon name="lucide:crown" class="w-3.5 h-3.5 fill-current text-slate-950" />
                PRO
              </span>
            </div>

            <!-- Action Buttons -->
            <div class="flex items-center justify-center md:justify-start gap-2 flex-wrap">
              <!-- If Own Profile -->
              <template v-if="isOwnProfile">
                <button
                  v-if="isPhotographer"
                  @click="router.push('/dashboard/photographer')"
                  class="px-4 py-1.5 bg-gray-900 hover:bg-black text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Icon name="lucide:layout-dashboard" class="w-4 h-4" />
                  Panel Fotógrafo
                </button>
                <button
                  @click="router.push(isPhotographer ? '/dashboard/photographer' : '/dashboard/customer')"
                  class="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-semibold rounded-xl transition-colors"
                >
                  Editar Perfil
                </button>
                <button
                  @click="router.push('/wallet')"
                  class="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <Icon name="lucide:wallet" class="w-4 h-4" />
                  Billetera
                </button>
              </template>

              <!-- If Admin Profile -->
              <template v-else-if="isAdminProfile">
                <span class="px-4 py-1.5 bg-slate-100 text-slate-600 text-xs font-bold rounded-xl flex items-center gap-1.5 border border-slate-200">
                  <Icon name="lucide:shield-check" class="w-4 h-4 text-indigo-600" />
                  Cuenta Oficial de Administración
                </span>
              </template>

              <!-- If Another User's Profile -->
              <template v-else>
                <!-- Follow / Unfollow Button -->
                <button
                  @click="toggleFollowProfile"
                  :disabled="followActionLoading"
                  :class="[
                    'px-5 py-1.5 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50 active:scale-95',
                    profile.isFollowing
                      ? 'bg-gray-100 hover:bg-red-50 text-gray-800 hover:text-red-600 border border-gray-200'
                      : 'bg-black hover:bg-gray-800 text-white'
                  ]"
                >
                  <Icon :name="profile.isFollowing ? 'lucide:user-check' : 'lucide:user-plus'" class="w-4 h-4" />
                  <span>{{ profile.isFollowing ? 'Siguiendo' : 'Seguir' }}</span>
                </button>

                <!-- Send Message (Direct Chat) Button -->
                <button
                  @click="openChatWithUser"
                  class="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs sm:text-sm font-semibold rounded-xl transition-all flex items-center gap-1.5 border border-gray-200 active:scale-95"
                  title="Enviar mensaje directo"
                >
                  <Icon name="lucide:message-circle" class="w-4 h-4 text-indigo-600" />
                  <span>Mensaje</span>
                </button>

                <!-- Share Profile Button -->
                <button
                  @click="copyProfileLink"
                  class="p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all border border-gray-200 active:scale-95"
                  title="Copiar enlace del perfil"
                >
                  <Icon name="lucide:share-2" class="w-4 h-4" />
                </button>
              </template>
            </div>
          </div>

          <!-- Stats Counter Row -->
          <div class="flex justify-center md:justify-start gap-6 sm:gap-8 mb-5 text-sm">
            <!-- Publications / Events count (if photographer or has events) -->
            <div v-if="isPhotographer || events.length > 0">
              <span class="text-gray-900">
                <strong class="font-bold text-gray-900 text-base">{{ events.length }}</strong>
                <span class="text-gray-500 ml-1">álbumes</span>
              </span>
            </div>
            <!-- Photos bought count (if customer) -->
            <div v-else>
              <span class="text-gray-900">
                <strong class="font-bold text-gray-900 text-base">{{ collection.length }}</strong>
                <span class="text-gray-500 ml-1">fotos</span>
              </span>
            </div>

            <!-- Followers (CLICKABLE -> Opens Modal) -->
            <button
              @click="openFollowModal('followers')"
              class="cursor-pointer group flex items-baseline gap-1 hover:opacity-80 transition-opacity"
            >
              <strong class="font-bold text-gray-900 text-base group-hover:underline">{{ profile.followerCount || 0 }}</strong>
              <span class="text-gray-500 group-hover:text-gray-700">seguidores</span>
            </button>

            <!-- Following (CLICKABLE -> Opens Modal) -->
            <button
              @click="openFollowModal('following')"
              class="cursor-pointer group flex items-baseline gap-1 hover:opacity-80 transition-opacity"
            >
              <strong class="font-bold text-gray-900 text-base group-hover:underline">{{ profile.followingCount || 0 }}</strong>
              <span class="text-gray-500 group-hover:text-gray-700">seguidos</span>
            </button>
          </div>

          <!-- Bio & Details -->
          <div class="text-sm space-y-1">
            <p v-if="profile.memberSince" class="font-semibold text-gray-900 text-xs">
              Miembro desde {{ profile.memberSince }}
            </p>
            <p class="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {{ profile.description || (isPhotographer
                ? 'Fotógrafo profesional capturando momentos inolvidables. 📸✨' 
                : 'Coleccionista de momentos únicos en Moments.') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs (Instagram Style) -->
      <div class="flex justify-center gap-8 sm:gap-14 border-t border-gray-200">
        <!-- Tab: Álbumes / Eventos (for Photographers or users with events) -->
        <button
          v-if="isPhotographer || events.length > 0"
          @click="currentTab = 'events'"
          :class="[
            'flex items-center gap-2 py-3.5 text-xs font-bold uppercase tracking-widest border-t-2 -mt-px transition-all',
            currentTab === 'events'
              ? 'text-gray-900 border-gray-900'
              : 'text-gray-400 border-transparent hover:text-gray-600'
          ]"
        >
          <Icon name="lucide:grid" class="w-3.5 h-3.5" />
          <span>Álbumes</span>
          <span v-if="events.length > 0" class="text-[10px] px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-600">
            {{ events.length }}
          </span>
        </button>

        <!-- Tab: Colección (Purchased Photos) -->
        <button
          @click="currentTab = 'collection'"
          :class="[
            'flex items-center gap-2 py-3.5 text-xs font-bold uppercase tracking-widest border-t-2 -mt-px transition-all',
            currentTab === 'collection'
              ? 'text-gray-900 border-gray-900'
              : 'text-gray-400 border-transparent hover:text-gray-600'
          ]"
        >
          <Icon name="lucide:image" class="w-3.5 h-3.5" />
          <span>{{ isPhotographer ? 'Fotos Compradas' : 'Colección' }}</span>
          <span v-if="collection.length > 0" class="text-[10px] px-1.5 py-0.2 rounded-full bg-gray-100 text-gray-600">
            {{ collection.length }}
          </span>
        </button>

        <!-- Tab: Guardados (Only on own profile) -->
        <button
          v-if="isOwnProfile"
          @click="currentTab = 'saved'"
          :class="[
            'flex items-center gap-2 py-3.5 text-xs font-bold uppercase tracking-widest border-t-2 -mt-px transition-all',
            currentTab === 'saved'
              ? 'text-gray-900 border-gray-900'
              : 'text-gray-400 border-transparent hover:text-gray-600'
          ]"
        >
          <Icon name="lucide:bookmark" class="w-3.5 h-3.5" />
          <span>Guardados</span>
        </button>
      </div>

      <!-- Content Area -->
      <div class="mt-6">

        <!-- ===== TAB 1: ÁLBUMES / EVENTOS GRID ===== -->
        <div v-if="currentTab === 'events'">
          <!-- Loading events -->
          <div v-if="loadingEvents" class="flex flex-col items-center justify-center py-20 text-gray-400">
            <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin mb-3 text-indigo-500" />
            <span class="text-xs font-semibold uppercase tracking-wider">Cargando álbumes...</span>
          </div>

          <!-- Empty Events State -->
          <div v-else-if="events.length === 0" class="flex flex-col items-center justify-center py-20 text-center bg-gray-50/50 rounded-2xl border border-gray-100 p-8">
            <div class="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 bg-white">
              <Icon name="lucide:camera" class="w-8 h-8 text-gray-400" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-1">Sin álbumes publicados</h3>
            <p class="text-gray-500 text-sm max-w-sm mb-6">
              {{ isOwnProfile ? 'Aún no has publicado álbumes. ¡Sube tu primer evento deportivo o sesión!' : 'Este fotógrafo aún no ha subido álbumes o fotos públicas.' }}
            </p>
            <button
              v-if="isOwnProfile"
              @click="router.push('/dashboard/photographer')"
              class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-indigo-100 flex items-center gap-2"
            >
              <Icon name="lucide:upload-cloud" class="w-4 h-4" />
              Subir Fotos / Crear Álbum
            </button>
          </div>

          <!-- Instagram-style 3-Column Events Grid -->
          <div v-else class="grid grid-cols-3 gap-1 sm:gap-4 md:gap-6">
            <div
              v-for="event in events"
              :key="'event-item-' + (event.uuid || event.id)"
              class="aspect-square bg-gray-100 cursor-pointer overflow-hidden group relative rounded-sm sm:rounded-xl border border-gray-200/50"
              @click="goToEvent(event)"
            >
              <!-- Event Cover Image -->
              <div class="absolute inset-0 bg-gray-900 flex items-center justify-center">
                <img
                  v-if="getEventCover(event)"
                  :src="getEventCover(event)"
                  :alt="event.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />
                <div v-else class="w-full h-full bg-slate-800 flex items-center justify-center text-gray-400">
                  <Icon name="lucide:camera" class="h-10 w-10 text-white/50 drop-shadow-sm" />
                </div>
              </div>

              <!-- Top-right Multi-photo Indicator Badge -->
              <div
                v-if="(event.photoCount || 0) > 1"
                class="absolute top-2 right-2 z-10 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/10"
              >
                <Icon name="lucide:copy" class="w-3 h-3" />
                <span>{{ event.photoCount }}</span>
              </div>

              <!-- Hover Stats Overlay -->
              <div class="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center space-x-6 text-white z-20">
                <div class="flex items-center space-x-1.5 font-bold text-sm sm:text-base">
                  <Icon name="lucide:heart" class="h-5 w-5 fill-current text-rose-400" />
                  <span>{{ event.likesCount || 0 }}</span>
                </div>
                <div class="flex items-center space-x-1.5 font-bold text-sm sm:text-base">
                  <Icon name="lucide:message-circle" class="h-5 w-5 fill-current text-white" />
                  <span>{{ event.commentsCount || 0 }}</span>
                </div>
              </div>

              <!-- Bottom Title & Photos Bar (Always visible) -->
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/85 via-black/50 to-transparent p-2 sm:p-3 z-10">
                <div class="flex justify-between items-center gap-2">
                  <span class="text-[11px] sm:text-xs font-bold text-white truncate drop-shadow-sm">
                    {{ event.title || 'Álbum sin título' }}
                  </span>
                  <span class="text-[10px] sm:text-[11px] font-semibold text-emerald-400 whitespace-nowrap drop-shadow-sm flex-shrink-0">
                    {{ event.photoCount || 0 }} fotos
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== TAB 2: COLECCIÓN DE FOTOS COMPRADAS ===== -->
        <div v-else-if="currentTab === 'collection'">
          <!-- Loading Collection -->
          <div v-if="loadingCollection" class="flex flex-col items-center justify-center py-20 text-gray-400">
            <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin mb-3 text-indigo-500" />
            <span class="text-xs font-semibold uppercase tracking-wider">Cargando colección...</span>
          </div>

          <!-- Empty Collection State -->
          <div v-else-if="collection.length === 0" class="flex flex-col items-center justify-center py-20 text-center bg-gray-50/50 rounded-2xl border border-gray-100 p-8">
            <div class="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 bg-white">
              <Icon name="lucide:image" class="w-8 h-8 text-gray-400" />
            </div>
            <h3 class="text-xl font-bold text-gray-900 mb-1">Sin fotos coleccionadas</h3>
            <p class="text-gray-500 text-sm max-w-sm mb-6">
              {{ isOwnProfile ? 'Aún no tienes fotos en tu colección. ¡Explora el marketplace y adquiere tus mejores momentos!' : 'Este usuario aún no tiene fotos en su colección.' }}
            </p>
            <NuxtLink v-if="isOwnProfile" to="/marketplace" class="px-5 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-semibold transition-all">
              Explorar Marketplace
            </NuxtLink>
          </div>

          <!-- Collection Photos Grid -->
          <div v-else class="grid grid-cols-3 gap-1 sm:gap-4 md:gap-6">
            <div
              v-for="photo in collection"
              :key="'photo-' + (photo.photoId || photo.id)"
              class="relative aspect-square overflow-hidden bg-gray-100 group cursor-pointer rounded-sm sm:rounded-xl border border-gray-200/50"
              @click="openPhotoDetail(photo)"
            >
              <img
                :src="photo.watermarkedUrl || photo.previewUrl || photo.url"
                alt="Foto de la colección"
                class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              
              <!-- Hover Overlay -->
              <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-3 p-2">
                <div class="flex items-center gap-1.5 text-white font-bold text-xs sm:text-sm truncate">
                  <Icon name="lucide:eye" class="w-4 h-4 flex-shrink-0" />
                  <span class="truncate">{{ photo.eventTitle || 'Ver foto' }}</span>
                </div>
              </div>

              <!-- Photographer Badge on Hover -->
              <div v-if="photo.photographerUsername" class="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <span class="bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-full text-[9px] font-bold text-white">
                  @{{ photo.photographerUsername }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- ===== TAB 3: GUARDADOS (SAVED) ===== -->
        <div v-else-if="currentTab === 'saved'" class="flex flex-col items-center justify-center py-20 text-center bg-gray-50/50 rounded-2xl border border-gray-100 p-8">
          <div class="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center mb-4 bg-white">
            <Icon name="lucide:bookmark" class="w-8 h-8 text-gray-400" />
          </div>
          <h3 class="text-xl font-bold text-gray-900 mb-1">Guardados</h3>
          <p class="text-gray-500 text-sm max-w-sm">Guarda fotos o eventos favoritos para revisarlos fácilmente en el futuro.</p>
        </div>
      </div>

      <!-- Photo Detail Modal (High-Res Gallery Viewer with Side Navigation) -->
      <div v-if="selectedPhoto" class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-8 select-none" @click.self="closePhotoDetail">
        
        <!-- Top bar: Photo counter & Close button -->
        <div class="absolute top-4 left-4 sm:top-6 sm:left-6 z-20 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/15 text-xs font-semibold text-white/90">
          <Icon name="lucide:image" class="w-3.5 h-3.5 text-[#3ef4a1]" />
          <span>{{ selectedPhotoIndex + 1 }} / {{ collection.length }}</span>
        </div>

        <button @click="closePhotoDetail" class="absolute top-4 right-4 sm:top-6 sm:right-6 text-white/70 hover:text-white z-20 bg-black/60 backdrop-blur-md p-2 rounded-full border border-white/15 transition-all hover:scale-110 active:scale-95" aria-label="Cerrar">
          <Icon name="lucide:x" class="h-6 w-6" />
        </button>

        <!-- Previous Button -->
        <button
          v-if="collection.length > 1"
          @click.stop="prevPhoto"
          class="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-2xl backdrop-blur-md group"
          aria-label="Foto anterior"
          title="Foto anterior (←)"
        >
          <Icon name="lucide:chevron-left" class="w-6 h-6 sm:w-8 sm:h-8 transition-transform group-hover:-translate-x-0.5" />
        </button>

        <!-- Next Button -->
        <button
          v-if="collection.length > 1"
          @click.stop="nextPhoto"
          class="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-14 sm:h-14 rounded-full bg-black/60 hover:bg-black/90 text-white/80 hover:text-white border border-white/20 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-2xl backdrop-blur-md group"
          aria-label="Foto siguiente"
          title="Foto siguiente (→)"
        >
          <Icon name="lucide:chevron-right" class="w-6 h-6 sm:w-8 sm:h-8 transition-transform group-hover:translate-x-0.5" />
        </button>

        <!-- Main Modal Card -->
        <div class="bg-white w-full max-w-4xl max-h-[85vh] rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative z-10" @click.stop>
          <!-- Photo -->
          <div class="flex-1 bg-black flex items-center justify-center min-h-[300px] max-h-[50vh] md:max-h-[85vh] p-2">
            <img :key="selectedPhoto.photoId" :src="selectedPhoto.watermarkedUrl || selectedPhoto.url" class="max-w-full max-h-full object-contain rounded transition-all duration-200" />
          </div>

          <!-- Details -->
          <div class="w-full md:w-[320px] p-6 flex flex-col justify-between bg-white border-l border-gray-100">
            <div>
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center border border-gray-100">
                  <span class="text-sm font-bold text-indigo-600">{{ selectedPhoto.photographerUsername?.charAt(0).toUpperCase() || 'F' }}</span>
                </div>
                <div class="truncate">
                  <p class="text-sm font-bold text-gray-900 truncate">@{{ selectedPhoto.photographerUsername }}</p>
                  <p class="text-xs text-gray-500 truncate">{{ selectedPhoto.eventTitle || 'Foto deportiva' }}</p>
                </div>
              </div>

              <div class="space-y-4">
                <div v-if="selectedPhoto.purchasedAt" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span class="text-xs text-gray-500 font-medium">Comprada</span>
                  <span class="text-sm font-bold text-gray-900">{{ formatDate(selectedPhoto.purchasedAt) }}</span>
                </div>
                <div v-if="selectedPhoto.price !== undefined" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span class="text-xs text-gray-500 font-medium">Precio</span>
                  <span class="text-sm font-bold text-emerald-600">${{ Number(selectedPhoto.price).toFixed(2) }}</span>
                </div>
              </div>
            </div>

            <div class="pt-6">
              <button
                v-if="isOwnProfile"
                @click="downloadPhoto(selectedPhoto.photoId)"
                class="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 text-sm"
              >
                <Icon name="lucide:download" class="w-5 h-5" />
                Descargar Original
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Followers / Following Modal -->
      <div v-if="showFollowListModal" class="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" @click.self="closeFollowListModal">
        <div class="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h3 class="text-lg font-bold text-gray-900 capitalize">{{ followModalType === 'followers' ? 'Seguidores' : 'Seguidos' }}</h3>
            <button @click="closeFollowListModal" class="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100">
              <Icon name="lucide:x" class="w-5 h-5" />
            </button>
          </div>

          <!-- Modal Body -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
            <div v-if="followListLoading" class="flex flex-col items-center justify-center py-10">
              <div class="animate-spin rounded-full h-7 w-7 border-b-2 border-indigo-600 mb-2"></div>
              <span class="text-xs text-gray-400">Cargando lista...</span>
            </div>

            <div v-else-if="followList.length === 0" class="text-center py-10 text-gray-400">
              <Icon :name="followModalType === 'followers' ? 'lucide:users' : 'lucide:user-plus'" class="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p class="text-sm">Sin {{ followModalType === 'followers' ? 'seguidores' : 'seguidos' }} aún.</p>
            </div>

            <div v-else class="space-y-3.5">
              <div v-for="u in followList" :key="u.id" class="flex items-center justify-between gap-3">
                <div class="flex items-center gap-3 cursor-pointer overflow-hidden flex-1 min-w-0" @click="goToUserProfile(u.username)">
                  <div class="w-10 h-10 rounded-full overflow-hidden border border-gray-100 bg-gray-50 flex items-center justify-center flex-shrink-0">
                    <img v-if="u.profilePhotoUrl" :src="u.profilePhotoUrl" class="w-full h-full object-cover" />
                    <Icon v-else name="lucide:user" class="text-gray-400 w-5 h-5" />
                  </div>
                  <div class="truncate">
                    <p class="text-sm font-bold text-gray-900 truncate hover:text-indigo-600 transition-colors">@{{ u.username }}</p>
                    <span class="text-[10px] font-bold text-indigo-600 uppercase tracking-wider block">
                      {{ u.role === 'PHOTOGRAPHER' ? 'Fotógrafo' : 'Coleccionista' }}
                    </span>
                  </div>
                </div>

                <!-- Follow / Unfollow user in modal -->
                <button
                  v-if="authStore.isAuthenticated && authStore.user?.username !== u.username && u.role === 'PHOTOGRAPHER' && u.role !== 'ADMIN' && (u.username || '').toLowerCase() !== 'admin' && (u.username || '').toLowerCase() !== 'superadmin'"
                  @click="toggleFollowUser(u)"
                  :class="[
                    'px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all flex-shrink-0 active:scale-95 shadow-sm',
                    u.isFollowing 
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200' 
                      : 'bg-black text-white hover:bg-gray-800'
                  ]"
                >
                  {{ u.isFollowing ? 'Dejar de seguir' : 'Seguir' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'

const props = defineProps({
  targetUsername: {
    type: String,
    default: ''
  }
})

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const config = useRuntimeConfig()
const toast = useToast()

// Resolve active username from prop or route parameter
const activeUsername = computed(() => {
  return props.targetUsername || route.params.username || ''
})

// State
const profile = ref(null)
const events = ref([])
const collection = ref([])
const loading = ref(true)
const loadingEvents = ref(false)
const loadingCollection = ref(false)
const currentTab = ref('events')
const selectedPhotoIndex = ref(-1)

const isPhotographer = computed(() => {
  if (!profile.value) return false
  return profile.value.role === 'PHOTOGRAPHER'
})

const isOwnProfile = computed(() => {
  if (!authStore.isAuthenticated || !authStore.user?.username) return false
  const currentParam = String(activeUsername.value || '').toLowerCase()
  return authStore.user.username.toLowerCase() === currentParam
})

const isAdminProfile = computed(() => {
  if (!profile.value) return false
  const name = String(profile.value.username || '').toLowerCase()
  return profile.value.role === 'ADMIN' || name === 'admin' || name === 'superadmin'
})

const selectedPhoto = computed(() => {
  if (selectedPhotoIndex.value >= 0 && selectedPhotoIndex.value < collection.value.length) {
    return collection.value[selectedPhotoIndex.value]
  }
  return null
})

// Followers / Following Modal State
const showFollowListModal = ref(false)
const followModalType = ref('followers')
const followList = ref([])
const followListLoading = ref(false)
const followActionLoading = ref(false)

// Lifecycle
onMounted(async () => {
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', handleKeyDown)
  }
  await loadFullProfile()
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyDown)
  }
  document.body.style.overflow = ''
})

watch(() => activeUsername.value, async (newVal) => {
  if (newVal) {
    selectedPhotoIndex.value = -1
    closeFollowListModal()
    profile.value = null
    events.value = []
    collection.value = []
    await loadFullProfile()
  }
})

// Core Profile Loader
async function loadFullProfile() {
  const username = activeUsername.value
  if (!username) return

  loading.value = true
  try {
    const headers = authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}
    const data = await $fetch(`${config.public.apiBase}/users/profile/${encodeURIComponent(username)}`, {
      headers
    })
    profile.value = data

    // Set initial tab based on role
    if (data.role === 'PHOTOGRAPHER') {
      currentTab.value = 'events'
    } else {
      currentTab.value = 'collection'
    }

    // Fetch both events (albums) and purchased photos collection in parallel
    await Promise.allSettled([
      fetchEvents(),
      fetchCollection()
    ])

    // If events exist, ensure tab defaults to events
    if (events.value.length > 0 && currentTab.value !== 'events' && collection.value.length === 0) {
      currentTab.value = 'events'
    }
  } catch (e) {
    console.error('Error fetching profile:', e)
    profile.value = null
  } finally {
    loading.value = false
  }
}

// Fetch Photographer Events/Albums
async function fetchEvents() {
  if (!profile.value?.id) return
  loadingEvents.value = true
  try {
    const headers = authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}
    const data = await $fetch(`${config.public.apiBase}/events/photographer/${profile.value.id}`, {
      headers
    })
    events.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('Error fetching photographer events:', e)
    events.value = []
  } finally {
    loadingEvents.value = false
  }
}

// Fetch Purchased Photos Collection
async function fetchCollection() {
  const username = activeUsername.value
  if (!username) return
  loadingCollection.value = true
  try {
    const headers = authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}
    const data = await $fetch(`${config.public.apiBase}/users/profile/${encodeURIComponent(username)}/collection`, {
      headers
    })
    collection.value = Array.isArray(data) ? data : []
  } catch (e) {
    console.error('Error fetching collection:', e)
    collection.value = []
  } finally {
    loadingCollection.value = false
  }
}

// Navigation & Actions
function getEventCover(event) {
  if (event.coverPhotoUrl) return event.coverPhotoUrl
  if (event.previewPhotos && event.previewPhotos.length > 0) return event.previewPhotos[0]
  return null
}

function goToEvent(event) {
  const identifier = event.uuid || event.id
  router.push(`/marketplace/events/${identifier}`)
}

function openChatWithUser() {
  if (!authStore.isAuthenticated) {
    toast.error('Inicia sesión', 'Debes iniciar sesión para enviar mensajes.')
    router.push('/login')
    return
  }
  if (!profile.value?.username) return
  router.push(`/chat?user=${encodeURIComponent(profile.value.username)}`)
}

function copyProfileLink() {
  if (typeof window !== 'undefined') {
    navigator.clipboard.writeText(window.location.href)
    toast.success('Enlace copiado', 'El enlace de este perfil se copió al portapapeles.')
  }
}

// Follow / Unfollow Profile
async function toggleFollowProfile() {
  if (!authStore.isAuthenticated) {
    toast.error('Inicia sesión', 'Debes iniciar sesión para seguir usuarios.')
    router.push('/login')
    return
  }
  if (!profile.value || followActionLoading.value) return

  followActionLoading.value = true
  const previousState = profile.value.isFollowing
  const previousCount = profile.value.followerCount || 0
  
  // Optimistic update
  profile.value.isFollowing = !previousState
  profile.value.followerCount = previousState ? Math.max(0, previousCount - 1) : previousCount + 1

  try {
    const method = previousState ? 'DELETE' : 'POST'
    await $fetch(`${config.public.apiBase}/users/${profile.value.id}/follow`, {
      method,
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    toast.success(
      profile.value.isFollowing ? '¡Siguiendo!' : 'Dejaste de seguir',
      profile.value.isFollowing
        ? `Ahora sigues a @${profile.value.username}`
        : `Has dejado de seguir a @${profile.value.username}`
    )
  } catch (error) {
    profile.value.isFollowing = previousState
    profile.value.followerCount = previousCount
    console.error('Error toggling follow status:', error)
    toast.error('Error', 'No se pudo actualizar el estado de seguimiento.')
  } finally {
    followActionLoading.value = false
  }
}

// Followers / Following Modal Logic
async function openFollowModal(type) {
  followModalType.value = type
  showFollowListModal.value = true
  followListLoading.value = true
  try {
    const encodedUsername = encodeURIComponent(activeUsername.value)
    const data = await $fetch(`${config.public.apiBase}/users/profile/${encodedUsername}/${type}`, {
      headers: authStore.token ? { Authorization: `Bearer ${authStore.token}` } : {}
    })
    followList.value = Array.isArray(data) ? data : []
  } catch (error) {
    console.error('Error fetching follow list:', error)
    toast.error('Error', 'No se pudo cargar la lista.')
    followList.value = []
  } finally {
    followListLoading.value = false
  }
}

function closeFollowListModal() {
  showFollowListModal.value = false
  followList.value = []
}

function goToUserProfile(targetUsername) {
  closeFollowListModal()
  router.push(`/profile/${encodeURIComponent(targetUsername)}`)
}

async function toggleFollowUser(user) {
  if (!authStore.isAuthenticated) {
    toast.error('Inicia sesión', 'Debes iniciar sesión para seguir usuarios.')
    router.push('/login')
    return
  }
  try {
    const method = user.isFollowing ? 'DELETE' : 'POST'
    await $fetch(`${config.public.apiBase}/users/${user.id}/follow`, {
      method,
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    user.isFollowing = !user.isFollowing
    user.followerCount = (user.followerCount || 0) + (user.isFollowing ? 1 : -1)
    if (profile.value && profile.value.id === user.id) {
      profile.value.isFollowing = user.isFollowing
      profile.value.followerCount = user.followerCount
    }
  } catch (error) {
    console.error('Error toggling follow user:', error)
    toast.error('Error', 'No se pudo actualizar el seguimiento.')
  }
}

// Photo Viewer Modal
function openPhotoDetail(photo) {
  const idx = collection.value.findIndex(p => (p.photoId || p.id) === (photo.photoId || photo.id))
  selectedPhotoIndex.value = idx !== -1 ? idx : 0
  document.body.style.overflow = 'hidden'
}

function closePhotoDetail() {
  selectedPhotoIndex.value = -1
  document.body.style.overflow = ''
}

function prevPhoto() {
  if (collection.value.length <= 1) return
  if (selectedPhotoIndex.value > 0) {
    selectedPhotoIndex.value--
  } else {
    selectedPhotoIndex.value = collection.value.length - 1
  }
}

function nextPhoto() {
  if (collection.value.length <= 1) return
  if (selectedPhotoIndex.value < collection.value.length - 1) {
    selectedPhotoIndex.value++
  } else {
    selectedPhotoIndex.value = 0
  }
}

function handleKeyDown(e) {
  if (selectedPhotoIndex.value === -1) return
  if (e.key === 'ArrowLeft') {
    prevPhoto()
  } else if (e.key === 'ArrowRight') {
    nextPhoto()
  } else if (e.key === 'Escape') {
    closePhotoDetail()
  }
}

async function downloadPhoto(photoId) {
  try {
    const res = await $fetch(`${config.public.apiBase}/photos/${photoId}/download`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    const downloadUrl = res.presignedUrl || res
    
    if (downloadUrl && typeof downloadUrl === 'string') {
      const response = await fetch(downloadUrl)
      if (!response.ok) throw new Error('Network response was not ok')
      const blob = await response.blob()
      const objectUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = `moment-photo-${photoId}.jpg`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(objectUrl)
    } else {
      toast.error('Error', 'No se pudo obtener el enlace de descarga.')
    }
  } catch (e) {
    toast.error('Error', 'No se pudo descargar la foto.')
    console.error(e)
  }
}

import { formatColombiaDate } from '~/utils/date'

function formatDate(dateString) {
  return formatColombiaDate(dateString)
}
</script>
