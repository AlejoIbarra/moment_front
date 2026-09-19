<template>
  <div class="min-h-screen bg-[#fafafa]">
    <!-- Navbar (Instagram 2024 Style) -->
    <nav
      class="fixed top-0 w-full bg-white border-b border-gray-200 z-50 h-[60px] flex items-center shadow-xs">
      <div class="max-w-5xl w-full mx-auto px-3 sm:px-4 flex justify-between items-center gap-2 sm:gap-8 relative">
        <!-- Logo -->
        <div class="flex-shrink-0 cursor-pointer group flex items-center gap-1.5 sm:gap-2" @click="router.push('/marketplace')">
          <img src="/logo.png" alt="Moments Logo" class="h-7 sm:h-8 w-auto object-contain group-hover:scale-105 transition-transform duration-300" />
          <h1
            class="text-xl sm:text-2xl font-black tracking-tighter italic group-hover:scale-105 transition-transform duration-300 text-[#3ef4a1]">
            Moments
          </h1>
        </div>

        <!-- Search (Desktop - Centralized & Pro Visual) -->
        <div class="hidden md:flex relative flex-1 max-w-md">
          <div class="relative w-full">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
              <Icon name="lucide:search" class="w-4 h-4 text-gray-400" />
            </div>
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              @input="handleSearch"
              @focus="isSearchFocused = true"
              @keydown.esc="closeSearch"
              @keydown.enter="handleEnterSearch"
              type="text"
              placeholder="Buscar partidos, torneos, fotógrafos, fotos..."
              class="w-full bg-gray-100/80 hover:bg-gray-100 focus:bg-white rounded-2xl py-2 pl-10 pr-16 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 border border-transparent focus:border-indigo-200 transition-all placeholder:text-gray-400 font-medium"
            />
            <div class="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <button
                v-if="searchQuery"
                @click="clearSearch"
                class="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-200/60 transition-colors"
                title="Limpiar"
              >
                <Icon name="lucide:x" class="w-3.5 h-3.5" />
              </button>
              <kbd v-else class="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold text-gray-400 bg-white border border-gray-200 rounded-md shadow-2xs">
                ⌘K
              </kbd>
            </div>
          </div>
        </div>

        <!-- Search Dropdown Overlay (Pro Visual Dropdown - Desktop & Mobile) -->
        <div
          v-if="isSearchFocused"
          v-click-outside="closeSearch"
          class="fixed md:absolute top-[115px] md:top-[calc(100%+8px)] inset-x-3 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 w-auto md:w-[540px] lg:w-[620px] bg-white/95 backdrop-blur-xl border border-gray-100 rounded-2xl shadow-2xl shadow-black/15 overflow-hidden z-50 animate-dropdown max-h-[75vh] md:max-h-[520px] flex flex-col"
        >
            <!-- Category Filter Tabs -->
            <div class="flex items-center gap-1.5 px-3 py-2.5 border-b border-gray-100 bg-gray-50/70 overflow-x-auto text-xs font-semibold">
              <button
                v-for="cat in searchCategories"
                :key="cat.id"
                @click="searchActiveTab = cat.id"
                :class="[
                  'px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 whitespace-nowrap',
                  searchActiveTab === cat.id
                    ? 'bg-black text-white shadow-sm shadow-black/10'
                    : 'text-gray-600 hover:bg-gray-200/60 hover:text-gray-900'
                ]"
              >
                <Icon :name="cat.icon" class="w-3.5 h-3.5" />
                <span>{{ cat.label }}</span>
                <span
                  v-if="cat.count > 0"
                  :class="[
                    'px-1.5 py-0.2 rounded-full text-[10px] font-bold',
                    searchActiveTab === cat.id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-700'
                  ]"
                >
                  {{ cat.count }}
                </span>
              </button>
            </div>

            <!-- Loading State -->
            <div v-if="isSearching" class="p-8 flex flex-col justify-center items-center text-gray-400 gap-2">
              <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin text-indigo-500" />
              <span class="text-xs font-medium text-gray-500">Buscando álbumes y fotos...</span>
            </div>

            <!-- Empty Search Initial Suggestions -->
            <div v-else-if="!searchQuery" class="p-4 space-y-3">
              <div class="text-[11px] font-bold uppercase tracking-wider text-gray-400 px-2 flex items-center gap-1.5">
                <Icon name="lucide:sparkles" class="w-3.5 h-3.5 text-[#3ef4a1]" />
                Búsquedas populares de partidos
              </div>
              <div class="flex flex-wrap gap-2 px-2">
                <button
                  v-for="sug in quickSuggestions"
                  :key="sug"
                  @click="applySuggestion(sug)"
                  class="px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 border border-transparent text-xs font-medium text-gray-700 transition-all flex items-center gap-1.5"
                >
                  <Icon name="lucide:search" class="w-3 h-3 text-gray-400" />
                  <span>{{ sug }}</span>
                </button>
              </div>
            </div>

            <!-- No Results State -->
            <div v-else-if="!hasResults" class="p-8 text-center text-gray-400">
              <div class="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2 text-gray-400">
                <Icon name="lucide:search-x" class="w-6 h-6" />
              </div>
              <p class="text-sm font-semibold text-gray-700">No encontramos resultados para "{{ searchQuery }}"</p>
              <p class="text-xs text-gray-400 mt-1">Prueba buscando por nombre del partido, torneo, fotógrafo o ciudad.</p>
            </div>

            <!-- Results List -->
            <div v-else class="max-h-[440px] overflow-y-auto python-scrollbar p-3 space-y-4">
              <!-- Events / Matches Section (Visual Collage Cards) -->
              <div v-if="(searchActiveTab === 'all' || searchActiveTab === 'events') && searchEvents.length > 0" class="space-y-2.5">
                <div class="px-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  <span class="flex items-center gap-1.5 text-gray-700 font-bold">
                    <Icon name="lucide:trophy" class="w-3.5 h-3.5 text-emerald-600" />
                    Partidos y Álbumes de Fotos ({{ searchEvents.length }})
                  </span>
                </div>
                <div class="space-y-3">
                  <EventVisualCard
                    v-for="e in searchEvents"
                    :key="'search-event-' + (e.uuid || e.id)"
                    :event="e"
                    :compact="true"
                    @click="goToEvent(e)"
                  />
                </div>
              </div>

              <!-- Photographers Section -->
              <div v-if="(searchActiveTab === 'all' || searchActiveTab === 'photographers') && searchPhotographers.length > 0" class="space-y-2">
                <div class="px-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  <span class="flex items-center gap-1.5 text-gray-700 font-bold">
                    <Icon name="lucide:camera" class="w-3.5 h-3.5 text-indigo-600" />
                    Fotógrafos ({{ searchPhotographers.length }})
                  </span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div
                    v-for="p in searchPhotographers"
                    :key="'photographer-' + p.id"
                    @click="goToPhotographer(p.username)"
                    class="flex items-center gap-3 p-2.5 bg-gray-50/70 hover:bg-indigo-50/60 border border-gray-100 rounded-xl cursor-pointer transition-all group"
                  >
                    <div class="w-10 h-10 rounded-full overflow-hidden border border-gray-200 flex-shrink-0 bg-indigo-50 flex items-center justify-center">
                      <img v-if="p.profilePhotoUrl" :src="p.profilePhotoUrl" alt="" class="w-full h-full object-cover">
                      <span v-else class="text-xs font-bold text-indigo-600">{{ p.username.charAt(0).toUpperCase() }}</span>
                    </div>
                    <div class="flex flex-col min-w-0 flex-1">
                      <span class="text-xs font-bold text-gray-800 group-hover:text-indigo-600 truncate">{{ p.username }}</span>
                      <span class="text-[10px] text-gray-400">{{ p.followerCount || 0 }} seguidores</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Users Section -->
              <div v-if="(searchActiveTab === 'all' || searchActiveTab === 'users') && searchUsers.length > 0" class="space-y-2">
                <div class="px-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider flex items-center justify-between">
                  <span class="flex items-center gap-1.5 text-gray-700 font-bold">
                    <Icon name="lucide:users" class="w-3.5 h-3.5 text-gray-600" />
                    Usuarios ({{ searchUsers.length }})
                  </span>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div
                    v-for="u in searchUsers"
                    :key="'user-' + u.id"
                    @click="goToUser(u.username)"
                    class="flex items-center gap-3 p-2.5 bg-gray-50/70 hover:bg-gray-100 border border-gray-100 rounded-xl cursor-pointer transition-all group"
                  >
                    <div class="w-10 h-10 rounded-full overflow-hidden border border-gray-200 flex-shrink-0 bg-gray-100 flex items-center justify-center">
                      <img v-if="u.profilePhotoUrl" :src="u.profilePhotoUrl" alt="" class="w-full h-full object-cover">
                      <span v-else class="text-xs font-bold text-gray-600">{{ u.username.charAt(0).toUpperCase() }}</span>
                    </div>
                    <div class="flex flex-col min-w-0 flex-1">
                      <span class="text-xs font-bold text-gray-800 group-hover:text-black truncate">{{ u.username }}</span>
                      <span class="text-[10px] text-gray-400 truncate">{{ u.firstName ? (u.firstName + ' ' + (u.lastName || '')) : 'Usuario' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Footer: View All in Explorer -->
            <div class="p-2.5 bg-gray-50 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
              <span class="text-[11px] text-gray-400 hidden sm:inline-flex items-center gap-1">
                <kbd class="px-1 py-0.5 text-[9px] bg-white border border-gray-200 rounded">ESC</kbd> para cerrar
              </span>
              <button
                @click="goToExplorerWithQuery"
                class="ml-auto font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
              >
                <span>Ver todos los resultados en el explorador</span>
                <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        <!-- Action Icons -->
        <div class="flex items-center gap-1.5 sm:gap-4 md:gap-5">
          <!-- Desktop Only: Home -->
          <button @click="router.push('/marketplace')" class="hidden md:flex p-2 hover:bg-gray-100 rounded-full transition-all group cursor-pointer"
            title="Inicio">
            <Icon name="lucide:home" class="w-6 h-6 text-gray-800 group-hover:scale-110 transition-transform" />
          </button>

          <!-- Desktop Only: Explore Photographers -->
          <button @click="router.push('/photographers')" class="hidden md:flex p-2 hover:bg-gray-100 rounded-full transition-all group cursor-pointer"
            title="Explorar Fotógrafos">
            <Icon name="lucide:search" class="w-6 h-6 text-gray-800 group-hover:scale-110 transition-transform" />
          </button>

          <!-- Mobile Only: Quick Search Trigger Button -->
          <button
            @click="toggleMobileSearch"
            class="md:hidden p-2 text-gray-700 hover:text-black hover:bg-gray-100 rounded-full transition-all active:scale-95 group focus:outline-none cursor-pointer"
            :class="{ 'bg-gray-100 text-black': isMobileSearchOpen }"
            title="Buscar"
            aria-label="Abrir buscador"
          >
            <Icon name="lucide:search" class="w-5 h-5 text-gray-800 group-hover:scale-110 transition-transform" />
          </button>

          <!-- Client-Only Auth & Roles Actions -->
          <ClientOnly>
            <!-- Photographers: Create Post/Event (Desktop Only, since on mobile it's in bottom bar) -->
            <button v-if="authStore.isPhotographer" @click="router.push('/dashboard/photographer')"
              class="hidden md:flex p-2 hover:bg-gray-100 rounded-full transition-all group cursor-pointer" title="Panel de Fotógrafo">
              <Icon name="lucide:plus-square" class="w-6 h-6 text-gray-800 group-hover:scale-110 transition-transform" />
            </button>

            <!-- Buyers: Cart -->
            <button v-if="authStore.isCustomer" @click="cartStore.showCart = true"
              :class="[
                'relative p-2 hover:bg-gray-100 rounded-full transition-all group cursor-pointer',
                cartStore.items.length > 0 ? 'flex' : 'hidden md:flex'
              ]"
              title="Carrito de compras"
            >
              <Icon name="lucide:shopping-cart" class="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 group-hover:scale-110 transition-transform" />
              <span v-if="cartStore.items.length > 0" class="absolute top-0 right-0 w-4 h-4 bg-[#3ef4a1] text-[9px] font-extrabold text-white rounded-full flex items-center justify-center animate-pulse">
                {{ cartStore.items.length }}
              </span>
            </button>

            <!-- Notifications Bell (IG / Facebook Style) -->
            <NotificationBell v-if="authStore.isAuthenticated" />

            <!-- Chat / Direct Messages -->
            <button
              v-if="authStore.isAuthenticated"
              @click="router.push('/chat')"
              class="relative p-2 hover:bg-gray-100 rounded-full transition-all group cursor-pointer text-gray-800"
              title="Mensajes directos"
            >
              <Icon name="lucide:message-circle" class="w-5 h-5 sm:w-6 sm:h-6 text-gray-800 group-hover:scale-110 group-hover:text-emerald-600 transition-all" />
              <span
                v-if="chatStore.unreadCount > 0"
                class="absolute top-0 right-0 min-w-[16px] h-4 px-1 bg-emerald-500 text-[9px] font-black text-white rounded-full flex items-center justify-center animate-pulse shadow-xs"
              >
                {{ chatStore.unreadCount }}
              </span>
            </button>

            <!-- Profile / Auth Interactive Menu (Instagram & Facebook Style) -->
            <div v-if="authStore.isAuthenticated" class="relative" v-click-outside="closeProfileMenu">
              <!-- Avatar Button Trigger -->
              <button
                @click="toggleProfileMenu"
                class="relative h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-gray-200 overflow-visible ring-2 transition-all p-0.5 cursor-pointer flex items-center justify-center focus:outline-none"
                :class="[
                  isProfileMenuOpen ? 'ring-emerald-500 shadow-md shadow-emerald-500/20' : (authStore.isPro ? 'ring-amber-400 shadow-xs shadow-amber-500/20' : 'ring-transparent hover:ring-gray-300')
                ]"
                title="Menú de perfil"
                aria-label="Abrir menú de usuario"
              >
                <div class="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    v-if="authStore.user?.profilePhotoUrl"
                    :src="authStore.user.profilePhotoUrl"
                    alt="Profile"
                    class="w-full h-full object-cover"
                  />
                  <span v-else-if="userInitial" class="font-black text-xs text-gray-700">
                    {{ userInitial }}
                  </span>
                  <Icon v-else name="lucide:user" class="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>

                <!-- Mini Crown Badge for PRO -->
                <span
                  v-if="authStore.isPro"
                  class="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-slate-950 shadow-xs border border-white"
                  title="Moments PRO"
                >
                  <Icon name="lucide:crown" class="w-2.5 h-2.5 fill-current" />
                </span>
              </button>

              <!-- Dropdown Menu Panel (Instagram / Facebook Style) -->
              <transition name="dropdown-fade">
                <div
                  v-if="isProfileMenuOpen"
                  class="fixed inset-x-3 top-[66px] sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2.5 w-auto sm:w-[320px] max-w-[calc(100vw-24px)] bg-white/95 backdrop-blur-xl border border-gray-100 rounded-3xl shadow-2xl shadow-black/15 z-50 overflow-hidden ring-1 ring-black/5"
                >
                  <!-- User Header Card -->
                  <div class="p-4 border-b border-gray-100/80 bg-gradient-to-br from-gray-50/80 via-white to-gray-50/40">
                    <div class="flex items-center gap-3">
                      <!-- Large Avatar -->
                      <div class="relative flex-shrink-0 w-12 h-12 rounded-full ring-2 p-0.5"
                        :class="authStore.isPro ? 'ring-amber-400 shadow-sm shadow-amber-400/30' : 'ring-gray-200'">
                        <div class="w-full h-full rounded-full bg-gray-100 overflow-hidden flex items-center justify-center">
                          <img
                            v-if="authStore.user?.profilePhotoUrl"
                            :src="authStore.user.profilePhotoUrl"
                            alt="Profile"
                            class="w-full h-full object-cover"
                          />
                          <span v-else-if="userInitial" class="font-extrabold text-base text-gray-700">
                            {{ userInitial }}
                          </span>
                          <Icon v-else name="lucide:user" class="w-6 h-6 text-gray-400" />
                        </div>
                        <span
                          v-if="authStore.isPro"
                          class="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-gradient-to-r from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-slate-950 border border-white"
                        >
                          <Icon name="lucide:crown" class="w-2.5 h-2.5 fill-current" />
                        </span>
                      </div>

                      <!-- Name & Username & Role -->
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center gap-1.5">
                          <h4 class="font-bold text-gray-900 text-sm truncate">
                            {{ userDisplayName }}
                          </h4>
                          <Icon v-if="authStore.isPhotographer || authStore.isPro" name="lucide:badge-check" class="w-4 h-4 text-sky-500 fill-sky-500 flex-shrink-0" />
                        </div>
                        <p class="text-xs text-gray-500 font-medium truncate">
                          @{{ authStore.user?.username || 'usuario' }}
                        </p>
                        <!-- Role Badge -->
                        <div class="mt-1 flex items-center gap-1.5 flex-wrap">
                          <span
                            v-if="authStore.isAdmin"
                            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200/60"
                          >
                            <Icon name="lucide:shield-check" class="w-3 h-3" />
                            Admin
                          </span>
                          <span
                            v-else-if="authStore.isPhotographer"
                            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60"
                          >
                            <Icon name="lucide:camera" class="w-3 h-3" />
                            Fotógrafo
                          </span>
                          <span
                            v-else
                            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                          >
                            <Icon name="lucide:user" class="w-3 h-3" />
                            Coleccionista
                          </span>

                          <span
                            v-if="authStore.isPro"
                            class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 shadow-2xs"
                          >
                            <Icon name="lucide:crown" class="w-2.5 h-2.5 fill-current" />
                            PRO
                          </span>
                        </div>
                      </div>

                      <!-- Close Button for Mobile -->
                      <button
                        @click="closeProfileMenu"
                        class="sm:hidden p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                        title="Cerrar menú"
                      >
                        <Icon name="lucide:x" class="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <!-- PRO Promotion Card (if customer and not Pro) -->
                  <div v-if="!authStore.isPro && authStore.isCustomer" class="px-3 pt-2.5 pb-1">
                    <button
                      @click="navigateFromMenu('/subscription')"
                      class="w-full p-2.5 rounded-2xl bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100 border border-amber-200/80 hover:border-amber-300 transition-all flex items-center gap-3 text-left group cursor-pointer"
                    >
                      <div class="w-8 h-8 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center text-slate-950 shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                        <Icon name="lucide:sparkles" class="w-4 h-4" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-black text-amber-950 flex items-center gap-1">
                          Hazte Moments PRO
                          <Icon name="lucide:arrow-right" class="w-3 h-3 text-amber-700 group-hover:translate-x-0.5 transition-transform" />
                        </p>
                        <p class="text-[10px] text-amber-800/80 font-medium truncate">
                          Fotos sin marcas de agua y descargas ilimitadas
                        </p>
                      </div>
                    </button>
                  </div>

                  <!-- Navigation List -->
                  <div class="p-2 space-y-0.5">
                    <!-- Mi Perfil Público -->
                    <button
                      @click="navigateToProfile"
                      class="w-full px-3 py-2 rounded-2xl flex items-center gap-3 text-left hover:bg-gray-100/80 transition-all group cursor-pointer text-gray-700 hover:text-gray-900"
                    >
                      <div class="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <Icon name="lucide:user" class="w-4 h-4" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                          Mi Perfil Público
                        </p>
                        <p class="text-[10px] text-gray-500 font-medium truncate">
                          Ver tu vitrina y fotos compartidas
                        </p>
                      </div>
                      <Icon name="lucide:chevron-right" class="w-4 h-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
                    </button>

                    <!-- Mi Panel / Dashboard -->
                    <button
                      @click="navigateToDashboard"
                      class="w-full px-3 py-2 rounded-2xl flex items-center gap-3 text-left hover:bg-gray-100/80 transition-all group cursor-pointer text-gray-700 hover:text-gray-900"
                    >
                      <div class="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
                        <Icon name="lucide:layout-dashboard" class="w-4 h-4" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                          Mi Panel de Control
                        </p>
                        <p class="text-[10px] text-gray-500 font-medium truncate">
                          {{ authStore.isPhotographer ? 'Gestiona tus eventos, fotos y ventas' : 'Tus fotos compradas y pedidos' }}
                        </p>
                      </div>
                      <Icon name="lucide:chevron-right" class="w-4 h-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
                    </button>

                    <!-- Mi Billetera -->
                    <button
                      @click="navigateFromMenu('/wallet')"
                      class="w-full px-3 py-2 rounded-2xl flex items-center gap-3 text-left hover:bg-gray-100/80 transition-all group cursor-pointer text-gray-700 hover:text-gray-900"
                    >
                      <div class="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                        <Icon name="lucide:wallet" class="w-4 h-4" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          Mi Billetera
                        </p>
                        <p class="text-[10px] text-gray-500 font-medium truncate">
                          Saldo, transferencias y movimientos
                        </p>
                      </div>
                      <Icon name="lucide:chevron-right" class="w-4 h-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
                    </button>

                    <!-- Configuración de Cuenta -->
                    <button
                      @click="navigateToSettings"
                      class="w-full px-3 py-2 rounded-2xl flex items-center gap-3 text-left hover:bg-gray-100/80 transition-all group cursor-pointer text-gray-700 hover:text-gray-900"
                    >
                      <div class="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                        <Icon name="lucide:settings" class="w-4 h-4" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-bold text-gray-900 group-hover:text-amber-600 transition-colors">
                          Configuración
                        </p>
                        <p class="text-[10px] text-gray-500 font-medium truncate">
                          Perfil limpio, marcas de agua y ajustes
                        </p>
                      </div>
                      <Icon name="lucide:chevron-right" class="w-4 h-4 text-gray-300 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all" />
                    </button>
                  </div>

                  <!-- Divider -->
                  <div class="border-t border-gray-100 my-1"></div>

                  <!-- Logout Button -->
                  <div class="p-2">
                    <button
                      @click="handleLogoutFromMenu"
                      class="w-full px-3 py-2.5 rounded-2xl flex items-center gap-3 text-left text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-all group cursor-pointer font-bold text-xs"
                    >
                      <div class="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:bg-rose-100 group-hover:scale-105 transition-all">
                        <Icon name="lucide:log-out" class="w-4 h-4" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <p class="text-xs font-bold text-rose-600 group-hover:text-rose-700">
                          Cerrar sesión
                        </p>
                        <p class="text-[10px] text-rose-400 font-medium">
                          Desconectar tu cuenta de Moments
                        </p>
                      </div>
                    </button>
                  </div>
                </div>
              </transition>
            </div>

            <!-- Log In (Guest) -->
            <button v-else @click="router.push('/login')"
              class="bg-black text-white px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-xl text-xs sm:text-sm font-bold hover:bg-gray-800 transition-all active:scale-95 shadow-md shadow-black/10 cursor-pointer flex items-center gap-1.5">
              <Icon name="lucide:log-in" class="w-4 h-4 sm:hidden" />
              <span>Log In</span>
            </button>

            <template #fallback>
              <div class="w-8 h-8 rounded-full bg-gray-100 animate-pulse"></div>
            </template>
          </ClientOnly>
        </div>
      </div>
    </nav>

    <!-- Mobile Search Bar Drawer (Slide Down) -->
    <transition name="slide-down">
      <div
        v-if="isMobileSearchOpen"
        class="md:hidden fixed top-[60px] left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-gray-200 px-4 py-2.5 z-40 shadow-md"
        v-click-outside="closeMobileSearch"
      >
        <div class="relative flex items-center gap-2">
          <div class="relative flex-1">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Icon name="lucide:search" class="w-4 h-4" />
            </div>
            <input
              ref="mobileSearchInputRef"
              v-model="searchQuery"
              @input="handleSearch"
              @focus="isSearchFocused = true"
              @keydown.enter="handleEnterSearch"
              type="text"
              placeholder="Buscar partidos, fotógrafos, fotos..."
              class="w-full bg-gray-100 focus:bg-white rounded-xl py-2 pl-9 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/30 border border-transparent font-medium transition-all"
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <Icon name="lucide:x" class="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            @click="closeMobileSearch"
            class="px-2.5 py-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    </transition>

    <!-- Main Content Rendering -->
    <main class="pt-[60px] min-h-[calc(100vh-60px)]">
      <div class="animate-slide-in">
        <slot />
      </div>
    </main>

    <!-- Mobile Bottom Navigation -->
    <div
      class="md:hidden fixed bottom-0 w-full bg-white border-t border-gray-200 h-16 flex items-center justify-around z-50 px-4 shadow-lg">
      <Icon name="lucide:home" @click="router.push('/marketplace')" class="w-6 h-6 text-gray-800 cursor-pointer" />
      <Icon name="lucide:search" @click="router.push('/photographers')" class="w-6 h-6 text-gray-400 cursor-pointer" />
      <Icon name="lucide:sparkles" @click="router.push('/subscription')" class="w-6 h-6 text-indigo-600 cursor-pointer" />
      <Icon name="lucide:plus-square" v-if="authStore.isPhotographer" @click="router.push('/dashboard/photographer')"
        class="w-6 h-6 text-gray-400 cursor-pointer" />
      <div v-if="authStore.isCustomer" class="relative cursor-pointer" @click="cartStore.showCart = true">
        <Icon name="lucide:shopping-cart" class="w-6 h-6 text-gray-400" />
        <span v-if="cartStore.items.length > 0" class="absolute -top-2 -right-2 w-4 h-4 bg-[#3ef4a1] text-[9px] font-extrabold text-white rounded-full flex items-center justify-center animate-pulse">
          {{ cartStore.items.length }}
        </span>
      </div>
      <div v-if="authStore.isAuthenticated" class="relative cursor-pointer" @click="router.push('/chat')" title="Mensajes">
        <Icon name="lucide:message-circle" class="w-6 h-6 text-gray-700 hover:text-emerald-600 transition-colors" />
        <span v-if="chatStore.unreadCount > 0" class="absolute -top-2 -right-2 min-w-[15px] h-3.5 px-0.5 bg-emerald-500 text-[8px] font-extrabold text-white rounded-full flex items-center justify-center animate-pulse">
          {{ chatStore.unreadCount }}
        </span>
      </div>
      <!-- User Profile in Bottom Nav -->
      <div @click="toggleProfileMenu"
        class="relative w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center cursor-pointer ring-2 transition-all p-0.5"
        :class="authStore.isPro ? 'ring-amber-400' : (isProfileMenuOpen ? 'ring-emerald-500' : 'ring-transparent hover:ring-gray-300')"
        title="Perfil">
        <div class="w-full h-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
          <img v-if="authStore.user?.profilePhotoUrl" :src="authStore.user.profilePhotoUrl" alt="Profile" class="w-full h-full object-cover" />
          <span v-else-if="userInitial" class="font-black text-xs text-gray-700">
            {{ userInitial }}
          </span>
          <Icon v-else name="lucide:user" class="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </div>

    <!-- Global Confirmation Modal -->
    <ConfirmModal :is-open="confirm.isOpen.value" :title="confirm.title.value" :message="confirm.message.value"
      :confirm-text="confirm.confirmText.value" :cancel-text="confirm.cancelText.value" :icon="confirm.icon.value"
      @confirm="confirm.onConfirm" @cancel="confirm.onCancel" />

    <!-- Cart Drawer Component -->
    <CartDrawer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'
import { useChatStore } from '~/stores/chat'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()
const chatStore = useChatStore()
const confirm = useConfirm()

// --- Menú Interactivo de Perfil y Búsqueda Móvil ---
const isProfileMenuOpen = ref(false)
const isMobileSearchOpen = ref(false)
const mobileSearchInputRef = ref(null)

const userDisplayName = computed(() => {
  if (authStore.user?.firstName || authStore.user?.lastName) {
    return `${authStore.user?.firstName || ''} ${authStore.user?.lastName || ''}`.trim()
  }
  return authStore.user?.username || 'Usuario'
})

const userInitial = computed(() => {
  if (authStore.user?.firstName) return authStore.user.firstName.charAt(0).toUpperCase()
  if (authStore.user?.username) return authStore.user.username.charAt(0).toUpperCase()
  return 'U'
})

function toggleProfileMenu() {
  isProfileMenuOpen.value = !isProfileMenuOpen.value
  if (isProfileMenuOpen.value) {
    isMobileSearchOpen.value = false
  }
}

function closeProfileMenu() {
  isProfileMenuOpen.value = false
}

function toggleMobileSearch() {
  isMobileSearchOpen.value = !isMobileSearchOpen.value
  if (isMobileSearchOpen.value) {
    isProfileMenuOpen.value = false
    isSearchFocused.value = true
    setTimeout(() => {
      mobileSearchInputRef.value?.focus()
    }, 80)
  } else {
    isSearchFocused.value = false
  }
}

function closeMobileSearch() {
  isMobileSearchOpen.value = false
  isSearchFocused.value = false
}

function navigateFromMenu(path) {
  closeProfileMenu()
  router.push(path)
}

function navigateToProfile() {
  closeProfileMenu()
  if (authStore.user?.username) {
    router.push(`/profile/${authStore.user.username}`)
  } else if (authStore.isPhotographer) {
    router.push('/dashboard/photographer')
  } else {
    router.push('/dashboard/customer')
  }
}

function navigateToDashboard() {
  closeProfileMenu()
  if (authStore.isAdmin) {
    router.push('/dashboard/admin')
  } else if (authStore.isPhotographer) {
    router.push('/dashboard/photographer')
  } else {
    router.push('/dashboard/customer')
  }
}

function navigateToSettings() {
  closeProfileMenu()
  const basePath = authStore.isPhotographer ? '/dashboard/photographer' : '/dashboard/customer'
  router.push({ path: basePath, query: { tab: 'settings' } })
}

function handleLogoutFromMenu() {
  closeProfileMenu()
  handleLogout()
}

// --- Búsqueda Global Visual Pro (Eventos, Fotógrafos, Usuarios) ---
const searchInputRef = ref(null)
const searchQuery = ref('')
const isSearching = ref(false)
const isSearchFocused = ref(false)
const searchActiveTab = ref('all')
const searchEvents = ref([])
const searchPhotographers = ref([])
const searchUsers = ref([])
let searchTimeout = null

const quickSuggestions = [
  '⚽ Fútbol',
  '🏆 Final',
  '🎾 Tenis',
  '🏀 Baloncesto',
  '🏃 Atletismo',
  '📸 Fotógrafos Pro'
]

const hasResults = computed(() => searchEvents.value.length > 0 || searchPhotographers.value.length > 0 || searchUsers.value.length > 0)

const searchCategories = computed(() => [
  {
    id: 'all',
    label: 'Todo',
    icon: 'lucide:sparkles',
    count: searchEvents.value.length + searchPhotographers.value.length + searchUsers.value.length
  },
  {
    id: 'events',
    label: 'Partidos / Álbumes',
    icon: 'lucide:trophy',
    count: searchEvents.value.length
  },
  {
    id: 'photographers',
    label: 'Fotógrafos',
    icon: 'lucide:camera',
    count: searchPhotographers.value.length
  },
  {
    id: 'users',
    label: 'Usuarios',
    icon: 'lucide:users',
    count: searchUsers.value.length
  }
])

function handleSearch() {
  clearTimeout(searchTimeout)
  const query = searchQuery.value.trim()
  if (!query) {
    searchEvents.value = []
    searchPhotographers.value = []
    searchUsers.value = []
    isSearching.value = false
    return
  }

  isSearching.value = true
  searchTimeout = setTimeout(async () => {
    try {
      const config = useRuntimeConfig()
      const [eventsRes, photographersRes, usersRes] = await Promise.all([
        $fetch(`${config.public.apiBase}/events?query=${encodeURIComponent(query)}&size=10`).catch(() => ({ content: [] })),
        $fetch(`${config.public.apiBase}/users/photographers?query=${encodeURIComponent(query)}`).catch(() => []),
        $fetch(`${config.public.apiBase}/users/search?query=${encodeURIComponent(query)}`).catch(() => [])
      ])

      // Parse eventos correctamente desde PaginatedResponse ({ content: [...] })
      const rawEvents = eventsRes?.content ? eventsRes.content : (Array.isArray(eventsRes) ? eventsRes : [])
      searchEvents.value = rawEvents

      // Fotógrafos
      const rawPhotographers = Array.isArray(photographersRes) ? photographersRes : []
      searchPhotographers.value = rawPhotographers

      // Usuarios
      const rawUsers = Array.isArray(usersRes) ? usersRes : []
      searchUsers.value = rawUsers
    } catch (e) {
      console.error("Error global search", e)
    } finally {
      isSearching.value = false
    }
  }, 220)
}

function applySuggestion(sug) {
  searchQuery.value = sug.replace(/^[^a-zA-Z0-9áéíóúÁÉÍÓÚ]+/, '').trim()
  handleSearch()
}

function handleEnterSearch() {
  if (searchEvents.value.length === 1 && searchActiveTab.value === 'events') {
    goToEvent(searchEvents.value[0])
    return
  }
  goToExplorerWithQuery()
}

function goToExplorerWithQuery() {
  const q = searchQuery.value.trim()
  closeSearch()
  router.push({
    path: '/photographers',
    query: q ? { q, tab: searchActiveTab.value === 'all' ? 'events' : searchActiveTab.value } : {}
  })
}

function clearSearch() {
  searchQuery.value = ''
  searchEvents.value = []
  searchPhotographers.value = []
  searchUsers.value = []
}

function closeSearch() {
  isSearchFocused.value = false
}

function goToEvent(event) {
  closeSearch()
  const identifier = event.uuid || event.id
  router.push(`/marketplace/events/${identifier}`)
}

function goToPhotographer(username) {
  closeSearch()
  router.push(`/photographers/${username}`)
}

function goToUser(username) {
  closeSearch()
  router.push(`/profile/${username}`)
}

function goToMyProfile() {
  if (authStore.isPhotographer) {
    router.push('/dashboard/photographer')
  } else if (authStore.isCustomer) {
    router.push('/dashboard/customer')
  } else if (authStore.isAuthenticated) {
    router.push('/dashboard/customer')
  } else {
    router.push('/login')
  }
}

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}

// Global hotkey listener (Cmd+K / Ctrl+K)
function handleGlobalKeydown(e) {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault()
    isSearchFocused.value = true
    setTimeout(() => {
      if (searchInputRef.value) {
        searchInputRef.value.focus()
      }
    }, 50)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalKeydown)
  if (authStore.isAuthenticated) {
    chatStore.fetchUnreadCount()
  }
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleGlobalKeydown)
})

useHead({
  script: [
    { src: 'https://checkout.wompi.co/widget.js' }
  ]
})

// Click outside directive implementation
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event)
      }
    }
    document.addEventListener('click', el._clickOutside)
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside)
  }
}
</script>

<style scoped>
.animate-slide-in {
  animation: slideIn 0.4s ease-out;
}

.animate-dropdown {
  animation: dropdownAnim 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.dropdown-fade-enter-from,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-8px) scale(0.98);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.2s ease-out;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes dropdownAnim {
  from {
    opacity: 0;
    transform: translate(-50%, -8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0) scale(1);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
