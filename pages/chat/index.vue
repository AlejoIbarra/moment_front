<template>
  <div class="h-[calc(100vh-60px)] bg-slate-100/70 flex flex-col overflow-hidden font-sans">
    <div class="max-w-[1680px] w-full mx-auto h-full flex flex-1 bg-white shadow-2xl overflow-hidden md:my-3 md:rounded-3xl md:border md:border-slate-200/90">
      
      <!-- ═══════════════════════════════════════════════════════ -->
      <!-- LEFT SIDEBAR: CONVERSATION LIST & SEARCH               -->
      <!-- ═══════════════════════════════════════════════════════ -->
      <div 
        :class="[
          'w-full md:w-[380px] lg:w-[420px] flex-shrink-0 flex flex-col border-r border-slate-100 bg-white transition-all',
          activeConversation ? 'hidden md:flex' : 'flex'
        ]"
      >
        <!-- Sidebar Header -->
        <div class="h-18 px-5 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-white">
          <div class="flex items-center gap-3.5">
            <div class="relative w-11 h-11 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xs flex-shrink-0">
              <img v-if="authStore.user?.profilePhotoUrl" :src="authStore.user.profilePhotoUrl" alt="Avatar" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-slate-700 font-black text-sm bg-gradient-to-tr from-emerald-50 to-teal-100">
                {{ authStore.user?.username?.charAt(0)?.toUpperCase() || 'U' }}
              </div>
              <span class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-extrabold text-slate-900 tracking-tight leading-tight">Mensajes</h3>
                <span v-if="chatStore.unreadCount > 0" class="px-2 py-0.5 bg-emerald-500 text-white text-[10px] font-black rounded-full shadow-xs">
                  {{ chatStore.unreadCount }}
                </span>
              </div>
              <p class="text-xs text-slate-400 font-medium">@{{ authStore.user?.username }}</p>
            </div>
          </div>

          <div class="flex items-center gap-1.5">
            <button 
              @click="focusSearch" 
              class="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Nuevo chat"
            >
              <Icon name="lucide:square-pen" class="w-4 h-4" />
            </button>
            <button 
              @click="chatStore.fetchConversations" 
              class="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Actualizar"
            >
              <Icon name="lucide:rotate-cw" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Sharing Event Alert Banner -->
        <div v-if="pendingSharedEventId" class="p-3.5 bg-emerald-50 border-b border-emerald-100/80 flex items-center justify-between gap-2 text-xs text-emerald-900 animate-fade-in">
          <div class="flex items-center gap-2.5 min-w-0">
            <div class="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
              <Icon name="lucide:share-2" class="w-3.5 h-3.5" />
            </div>
            <div class="min-w-0">
              <p class="font-bold truncate">Compartir evento</p>
              <p class="text-[11px] text-emerald-700 truncate">Elige un chat para enviar este evento</p>
            </div>
          </div>
          <button @click="pendingSharedEventId = null" class="text-emerald-500 hover:text-emerald-800 font-bold p-1 rounded-lg">
            ✕
          </button>
        </div>

        <!-- Search Input Bar -->
        <div class="p-3.5 border-b border-slate-100 bg-white flex-shrink-0">
          <div class="relative flex items-center bg-slate-100/80 rounded-2xl px-3.5 py-2 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/30 focus-within:border-emerald-500 border border-transparent transition-all">
            <Icon name="lucide:search" class="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              @input="onSearchInput"
              type="text"
              placeholder="Buscar por @usuario o iniciar chat..."
              class="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none font-medium"
            />
            <button v-if="searchQuery" @click="clearSearch" class="text-slate-400 hover:text-slate-600 p-0.5">
              <Icon name="lucide:x" class="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <!-- Search Results (when typing query to find new users) -->
        <div v-if="searchQuery.trim().length >= 2" class="flex-1 overflow-y-auto divide-y divide-slate-50 p-2">
          <div class="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Usuarios en Moments
          </div>

          <div v-if="chatStore.isSearching" class="p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <div class="w-5 h-5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Buscando usuarios...</span>
          </div>

          <div v-else-if="chatStore.searchResults.length === 0" class="p-8 text-center text-slate-400 text-xs">
            <Icon name="lucide:user-x" class="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
            <p>No se encontraron usuarios con "{{ searchQuery }}"</p>
          </div>

          <div
            v-else
            v-for="u in chatStore.searchResults"
            :key="u.id"
            @click="startChatWithUser(u.username)"
            class="p-3 flex items-center gap-3 rounded-2xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100"
          >
            <div class="w-11 h-11 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
              <img v-if="u.profilePhotoUrl" :src="u.profilePhotoUrl" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center font-bold text-slate-600 bg-slate-100">
                {{ u.username?.charAt(0)?.toUpperCase() }}
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="text-xs font-bold text-slate-900 truncate">@{{ u.username }}</span>
                <span v-if="u.role === 'PHOTOGRAPHER'" class="px-1.5 py-0.5 text-[9px] font-bold bg-indigo-50 text-indigo-700 rounded-md">PRO</span>
              </div>
              <p class="text-[11px] text-slate-400 truncate mt-0.5">{{ u.title || (u.firstName ? `${u.firstName} ${u.lastName || ''}` : 'Usuario de Moments') }}</p>
            </div>
            <button class="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-[11px] font-bold rounded-xl shadow-xs transition-all">
              Chatear
            </button>
          </div>
        </div>

        <!-- Conversations List -->
        <div v-else class="flex-1 overflow-y-auto p-2 space-y-1">
          <div v-if="chatStore.isLoadingConversations" class="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <div class="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Cargando conversaciones...</span>
          </div>

          <div v-else-if="chatStore.conversations.length === 0" class="py-16 px-6 text-center text-slate-400">
            <div class="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Icon name="lucide:message-circle" class="w-7 h-7" />
            </div>
            <h4 class="text-sm font-bold text-slate-800 mb-1">Bandeja vacía</h4>
            <p class="text-xs text-slate-400 mb-4 max-w-xs mx-auto leading-relaxed">
              Busca fotógrafos o amigos con la barra de arriba para iniciar una conversación y compartir fotos.
            </p>
            <button @click="focusSearch" class="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95">
              Nuevo Mensaje
            </button>
          </div>

          <div
            v-else
            v-for="conv in chatStore.conversations"
            :key="conv.id"
            @click="handleSelectConversation(conv)"
            :class="[
              'p-3 flex items-center gap-3.5 rounded-2xl cursor-pointer transition-all border',
              activeConversation?.id === conv.id 
                ? 'bg-slate-100/90 border-slate-200/80 shadow-xs' 
                : 'hover:bg-slate-50/90 border-transparent'
            ]"
          >
            <!-- Contact Avatar -->
            <div class="relative w-12 h-12 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
              <img v-if="conv.otherProfilePhoto" :src="conv.otherProfilePhoto" alt="Avatar" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-slate-700 font-bold text-sm bg-gradient-to-tr from-slate-100 to-slate-200">
                {{ conv.otherUsername?.charAt(0)?.toUpperCase() || '?' }}
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-baseline justify-between mb-0.5">
                <span class="text-xs font-bold text-slate-900 truncate">
                  {{ conv.otherDisplayName || conv.otherUsername }}
                </span>
                <span class="text-[10px] text-slate-400 font-medium flex-shrink-0 ml-2">
                  {{ formatMessageTime(conv.lastMessageTimestamp) }}
                </span>
              </div>

              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-1.5 text-xs text-slate-500 truncate">
                  <Icon v-if="conv.lastMessageType === 'EVENT'" name="lucide:calendar" class="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                  <Icon v-else-if="conv.lastMessageType === 'PHOTO'" name="lucide:image" class="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <Icon v-else-if="conv.lastMessageType === 'GIFT_CARD'" name="lucide:gift" class="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span class="truncate text-[11px] text-slate-500">{{ conv.lastMessageContent || 'Iniciar conversación' }}</span>
                </div>

                <!-- Unread Badge -->
                <span 
                  v-if="conv.unreadCount > 0" 
                  class="min-w-[18px] h-4.5 px-1.5 rounded-full bg-emerald-500 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0 shadow-xs ml-1.5 animate-pulse"
                >
                  {{ conv.unreadCount }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════ -->
      <!-- RIGHT PANEL: ACTIVE CHAT CONVERSATION                  -->
      <!-- ═══════════════════════════════════════════════════════ -->
      <div 
        :class="[
          'flex-1 flex flex-col bg-slate-50/40 relative overflow-hidden transition-all',
          activeConversation ? 'flex' : 'hidden md:flex'
        ]"
      >
        <!-- Active Chat Header -->
        <div v-if="activeConversation" class="h-18 px-5 bg-white border-b border-slate-100 flex items-center justify-between flex-shrink-0 z-10">
          <div class="flex items-center gap-3.5 min-w-0">
            <!-- Mobile Back Button -->
            <button 
              @click="activeConversation = null" 
              class="md:hidden p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
            >
              <Icon name="lucide:arrow-left" class="w-5 h-5" />
            </button>

            <!-- Contact Photo -->
            <div class="relative w-11 h-11 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0 shadow-xs">
              <img v-if="activeConversation.otherProfilePhoto" :src="activeConversation.otherProfilePhoto" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center font-bold text-slate-700 bg-slate-100 text-sm">
                {{ activeConversation.otherUsername?.charAt(0)?.toUpperCase() }}
              </div>
              <span class="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
            </div>

            <!-- Contact Info -->
            <div class="min-w-0">
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-extrabold text-slate-900 leading-tight truncate">
                  {{ activeConversation.otherDisplayName || activeConversation.otherUsername }}
                </h3>
                <span v-if="activeConversation.otherRole === 'PHOTOGRAPHER'" class="px-2 py-0.5 text-[9px] font-bold bg-indigo-50 text-indigo-700 rounded-md">
                  FOTÓGRAFO
                </span>
              </div>
              <p class="text-[11px] text-slate-400 truncate mt-0.5">@{{ activeConversation.otherUsername }} · En línea</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button 
              @click="showShareEventModal = true" 
              class="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 rounded-xl text-xs font-bold transition-all shadow-xs"
              title="Compartir evento"
            >
              <Icon name="lucide:calendar-plus" class="w-4 h-4 text-emerald-600" />
              <span class="hidden sm:inline">Compartir Evento</span>
            </button>
            <NuxtLink 
              :to="`/profile/${activeConversation.otherUsername}`" 
              class="p-2 text-slate-500 hover:text-slate-800 rounded-xl hover:bg-slate-100 transition-colors"
              title="Ver perfil"
            >
              <Icon name="lucide:user" class="w-5 h-5" />
            </NuxtLink>
          </div>
        </div>

        <!-- Messages Scroll Container -->
        <div 
          v-if="activeConversation" 
          ref="messagesContainerRef" 
          class="flex-1 overflow-y-auto p-4 md:p-6 space-y-3.5 bg-gradient-to-b from-slate-50/30 via-white to-slate-50/50 relative"
        >
          <div v-if="chatStore.isLoadingMessages" class="py-16 text-center text-slate-400">
            <div class="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <span class="text-xs">Cargando mensajes...</span>
          </div>

          <div v-else-if="chatStore.messages.length === 0" class="py-16 text-center text-slate-500">
            <div class="inline-block p-6 bg-white rounded-3xl shadow-sm border border-slate-100 max-w-sm mx-auto">
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                <Icon name="lucide:sparkles" class="w-6 h-6" />
              </div>
              <h4 class="text-sm font-bold text-slate-900 mb-1">¡Inicia la conversación!</h4>
              <p class="text-xs text-slate-400 leading-relaxed">
                Saluda a @{{ activeConversation.otherUsername }} o envíale un evento de Moments para coordinar fotos.
              </p>
            </div>
          </div>

          <!-- Message Bubbles -->
          <template v-else>
            <div 
              v-for="(msg, idx) in chatStore.messages" 
              :key="msg.id || idx"
              :class="[
                'flex flex-col',
                isMyMessage(msg) ? 'items-end' : 'items-start'
              ]"
            >
              <div 
                :class="[
                  'max-w-[88%] sm:max-w-[75%] md:max-w-[62%] rounded-2xl p-3.5 text-xs relative transition-all shadow-xs',
                  isMyMessage(msg) 
                    ? 'bg-slate-950 text-white rounded-br-xs' 
                    : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200/80 shadow-xs'
                ]"
              >
                <!-- RICH EVENT CARD ATTACHMENT -->
                <div 
                  v-if="msg.type === 'EVENT' && msg.parsedMeta" 
                  class="mb-2.5 p-3 bg-white text-slate-900 rounded-xl border border-slate-200/90 shadow-xs overflow-hidden"
                >
                  <!-- Event Cover Image -->
                  <div class="relative w-full h-36 rounded-lg overflow-hidden bg-slate-100 mb-2.5">
                    <img 
                      v-if="msg.parsedMeta.coverPhotoUrl" 
                      :src="msg.parsedMeta.coverPhotoUrl" 
                      alt="Event Cover" 
                      class="w-full h-full object-cover" 
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-slate-300">
                      <Icon name="lucide:image" class="w-10 h-10" />
                    </div>
                    <span class="absolute top-2 right-2 px-2.5 py-0.5 bg-black/70 backdrop-blur-md text-white text-[10px] font-bold rounded-full">
                      Evento
                    </span>
                  </div>

                  <!-- Event Info -->
                  <h4 class="font-extrabold text-slate-900 text-xs leading-snug mb-1">{{ msg.parsedMeta.title }}</h4>
                  <div class="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 mb-3">
                    <span class="flex items-center gap-1">
                      <Icon name="lucide:calendar" class="w-3 h-3 text-slate-400" />
                      {{ msg.parsedMeta.date }}
                    </span>
                    <span v-if="msg.parsedMeta.location" class="flex items-center gap-1">
                      <Icon name="lucide:map-pin" class="w-3 h-3 text-slate-400" />
                      {{ msg.parsedMeta.location }}
                    </span>
                  </div>

                  <!-- View Event CTA Button -->
                  <NuxtLink 
                    :to="`/marketplace/events/${msg.parsedMeta.eventId || msg.parsedMeta.uuid}`"
                    class="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs active:scale-95"
                  >
                    <span>Ver Galería del Evento</span>
                    <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" />
                  </NuxtLink>
                </div>

                <!-- RICH GIFT CARD ATTACHMENT -->
                <div 
                  v-if="msg.type === 'GIFT_CARD' && msg.parsedMeta" 
                  class="mb-2.5 p-4 bg-gradient-to-br from-slate-900 via-indigo-950 to-emerald-950 text-white rounded-2xl border border-emerald-500/30 shadow-md overflow-hidden relative"
                >
                  <div class="flex items-center justify-between gap-2 mb-3 relative z-10">
                    <div class="flex items-center gap-2">
                      <div class="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                        <Icon name="lucide:gift" class="w-4 h-4" />
                      </div>
                      <div>
                        <p class="text-[10px] font-black uppercase tracking-widest text-emerald-400">Tarjeta de Regalo</p>
                        <p class="text-xs font-bold text-gray-200">{{ msg.parsedMeta.photographerUsername ? '@' + msg.parsedMeta.photographerUsername : 'Fotógrafo' }}</p>
                      </div>
                    </div>
                    <span class="px-2.5 py-1 bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-xs font-black rounded-full">
                      {{ msg.parsedMeta.photosRemaining ?? msg.parsedMeta.photoCount ?? 5 }} Fotos
                    </span>
                  </div>

                  <div class="bg-black/40 backdrop-blur-md rounded-xl p-2.5 flex items-center justify-between border border-white/10 mb-2">
                    <span class="font-mono text-sm font-black tracking-widest text-white">{{ msg.parsedMeta.code }}</span>
                    <button @click="copyCode(msg.parsedMeta.code)" class="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                      <Icon name="lucide:copy" class="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </button>
                  </div>
                </div>

                <!-- Message text content -->
                <p v-if="msg.content" class="leading-relaxed whitespace-pre-wrap break-words font-medium">
                  {{ msg.content }}
                </p>

                <!-- Message footer: time & check status -->
                <div 
                  :class="[
                    'flex items-center justify-end gap-1.5 text-[10px] mt-1 select-none',
                    isMyMessage(msg) ? 'text-slate-400' : 'text-slate-400'
                  ]"
                >
                  <span>{{ formatMessageHour(msg.createdAt) }}</span>
                  <template v-if="isMyMessage(msg)">
                    <Icon v-if="msg.isRead" name="lucide:check-check" class="w-3.5 h-3.5 text-emerald-400" />
                    <Icon v-else name="lucide:check" class="w-3.5 h-3.5 text-slate-500" />
                  </template>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Message Input Bar -->
        <div v-if="activeConversation" class="h-20 px-5 bg-white border-t border-slate-100 flex items-center gap-3 flex-shrink-0 z-10">
          <!-- Attachment Button -->
          <div class="relative">
            <button 
              @click="showAttachmentMenu = !showAttachmentMenu"
              class="w-11 h-11 rounded-2xl flex items-center justify-center text-slate-500 hover:text-slate-900 bg-slate-100/80 hover:bg-slate-200/80 transition-all"
              title="Adjuntar"
            >
              <Icon name="lucide:plus" class="w-5 h-5 transition-transform duration-200" :class="{ 'rotate-45': showAttachmentMenu }" />
            </button>

            <!-- Attachment Menu Dropdown -->
            <div 
              v-if="showAttachmentMenu" 
              class="absolute bottom-14 left-0 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 w-60 z-30 animate-scale-up space-y-1"
            >
              <button 
                @click="openShareEventModal" 
                class="w-full px-3 py-2.5 rounded-xl flex items-center gap-3 hover:bg-emerald-50 text-emerald-800 text-xs font-bold transition-colors text-left"
              >
                <div class="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Icon name="lucide:calendar" class="w-4 h-4" />
                </div>
                <div>
                  <span class="block">Compartir Evento</span>
                  <span class="text-[10px] text-slate-400 font-normal">Envía un evento al chat</span>
                </div>
              </button>

              <button 
                @click="openShareGiftCardModal" 
                class="w-full px-3 py-2.5 rounded-xl flex items-center gap-3 hover:bg-indigo-50 text-indigo-800 text-xs font-bold transition-colors text-left"
              >
                <div class="w-8 h-8 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Icon name="lucide:gift" class="w-4 h-4" />
                </div>
                <div>
                  <span class="block">Tarjeta de Regalo</span>
                  <span class="text-[10px] text-slate-400 font-normal">Envía un bono de fotos</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Text Input -->
          <div class="flex-1 bg-slate-100/90 rounded-2xl border border-transparent focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all px-4 py-2.5">
            <input
              ref="messageInputRef"
              v-model="messageText"
              @keydown.enter.prevent="handleSend"
              type="text"
              placeholder="Escribe un mensaje..."
              class="w-full bg-transparent text-xs text-slate-900 placeholder-slate-400 outline-none font-medium"
              :disabled="chatStore.isSending"
            />
          </div>

          <!-- Send Button -->
          <button
            @click="handleSend"
            :disabled="!messageText.trim() || chatStore.isSending"
            class="w-11 h-11 rounded-2xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white flex items-center justify-center transition-all shadow-sm active:scale-95 flex-shrink-0"
            title="Enviar mensaje"
          >
            <Icon v-if="chatStore.isSending" name="lucide:loader-2" class="w-4 h-4 animate-spin" />
            <Icon v-else name="lucide:send" class="w-4 h-4" />
          </button>
        </div>

        <!-- Empty State (No conversation selected) -->
        <div v-else class="flex-1 hidden md:flex flex-col items-center justify-center p-8 text-center bg-slate-50/50">
          <div class="w-20 h-20 rounded-3xl bg-white shadow-sm flex items-center justify-center mb-5 text-emerald-600 border border-slate-100">
            <Icon name="lucide:message-circle" class="w-10 h-10" />
          </div>
          <h2 class="text-xl font-black text-slate-900 mb-2">Mensajería Moments</h2>
          <p class="text-xs text-slate-500 max-w-sm mb-6 leading-relaxed">
            Chatea en tiempo real con fotógrafos y amigos. Comparte álbumes interactivos y gestiona tus fotos con total privacidad.
          </p>
          <div class="flex items-center gap-2 text-xs text-slate-500 bg-white px-4 py-2.5 rounded-2xl border border-slate-200/80 shadow-xs">
            <Icon name="lucide:shield-check" class="w-4 h-4 text-emerald-600" />
            <span>Mensajes privados y encriptados en la nube</span>
          </div>
        </div>

      </div>
    </div>

    <!-- Modal to share event -->
    <ShareEventModal 
      v-model="showShareEventModal" 
      @select="handleEventSelected"
    />

    <!-- Modal to share gift card -->
    <ShareGiftCardModal 
      v-model="showShareGiftCardModal" 
      @select="handleGiftCardSelected"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useChatStore } from '~/stores/chat'
import { useNotificationsStore } from '~/stores/notifications'
import ShareEventModal from '~/components/chat/ShareEventModal.vue'
import ShareGiftCardModal from '~/components/chat/ShareGiftCardModal.vue'

definePageMeta({
  layout: 'default'
})

const authStore = useAuthStore()
const chatStore = useChatStore()
const notifStore = useNotificationsStore()
const route = useRoute()
const router = useRouter()
const toast = useToast()

const activeConversation = computed({
  get: () => chatStore.activeConversation,
  set: (val) => { chatStore.activeConversation = val }
})

const searchQuery = ref('')
const searchInputRef = ref(null)
const messageInputRef = ref(null)
const messagesContainerRef = ref(null)
const messageText = ref('')
const showAttachmentMenu = ref(false)
const showShareEventModal = ref(false)
const showShareGiftCardModal = ref(false)
const pendingSharedEventId = ref(null)

let searchDebounce = null

function isMyMessage(msg) {
  return msg.senderUsername === authStore.user?.username
}

function onSearchInput() {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => {
    chatStore.searchUsers(searchQuery.value)
  }, 250)
}

function clearSearch() {
  searchQuery.value = ''
  chatStore.searchResults = []
}

function focusSearch() {
  searchInputRef.value?.focus()
}

async function handleSelectConversation(conv) {
  await chatStore.selectConversation(conv)
  if (pendingSharedEventId.value) {
    const evId = pendingSharedEventId.value
    pendingSharedEventId.value = null
    try {
      await chatStore.sendMessage('Te comparto este evento', 'EVENT', evId)
      toast.success('Evento compartido', 'El evento fue enviado en el chat.')
    } catch (e) {
      console.error('Error sharing pending event:', e)
    }
  }
}

async function startChatWithUser(username) {
  clearSearch()
  const evId = pendingSharedEventId.value
  pendingSharedEventId.value = null
  await chatStore.startConversation(username, evId)
  focusMessageInput()
}

function openShareEventModal() {
  showAttachmentMenu.value = false
  showShareEventModal.value = true
}

function openShareGiftCardModal() {
  showAttachmentMenu.value = false
  showShareGiftCardModal.value = true
}

async function handleEventSelected(event) {
  if (!event || !activeConversation.value) return
  await chatStore.sendMessage(`Te comparto el evento "${event.title}"`, 'EVENT', event.id)
  scrollToBottom()
}

async function handleGiftCardSelected(card) {
  if (!card || !activeConversation.value) return
  const photos = card.photosRemaining ?? card.photoCount ?? 5
  await chatStore.sendMessage(`🎁 ¡Te envié una Tarjeta de Regalo por ${photos} fotos gratis!`, 'GIFT_CARD', card.id)
  scrollToBottom()
}

function copyCode(code) {
  if (typeof navigator !== 'undefined' && navigator.clipboard) {
    navigator.clipboard.writeText(code)
    toast.success('Código Copiado', `El código ${code} ha sido copiado al portapapeles.`)
  }
}

async function handleSend() {
  const text = messageText.value.trim()
  if (!text || chatStore.isSending) return
  messageText.value = ''
  try {
    await chatStore.sendMessage(text, 'TEXT')
    scrollToBottom()
    focusMessageInput()
  } catch (err) {
    messageText.value = text
    toast.error('Error al enviar', 'No se pudo enviar el mensaje. Inténtalo nuevamente.')
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainerRef.value) {
      messagesContainerRef.value.scrollTop = messagesContainerRef.value.scrollHeight
    }
  })
}

function focusMessageInput() {
  nextTick(() => {
    messageInputRef.value?.focus()
  })
}

function formatMessageTime(timestamp) {
  if (!timestamp) return ''
  try {
    const d = new Date(timestamp)
    const now = new Date()
    const diffDays = Math.floor((now.getTime() - d.getTime()) / (1000 * 60 * 60 * 24))
    if (diffDays === 0) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays === 1) {
      return 'Ayer'
    } else if (diffDays < 7) {
      return d.toLocaleDateString([], { weekday: 'short' })
    }
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  } catch (e) {
    return ''
  }
}

function formatMessageHour(timestamp) {
  if (!timestamp) return ''
  try {
    const d = new Date(timestamp)
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } catch (e) {
    return ''
  }
}

// Auto-scroll on new messages
watch(() => chatStore.messages.length, () => {
  scrollToBottom()
})

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push('/login?redirect=' + encodeURIComponent(route.fullPath))
    return
  }
  notifStore.startSync()
  await chatStore.fetchConversations()
  chatStore.startPolling()

  if (route.query.event) {
    pendingSharedEventId.value = String(route.query.event)
  }

  // If query params passed (e.g. /chat?user=camilo&event=123)
  if (route.query.user) {
    const username = String(route.query.user)
    const eventId = route.query.event ? String(route.query.event) : null
    pendingSharedEventId.value = null
    await chatStore.startConversation(username, eventId)
    scrollToBottom()
  } else if (pendingSharedEventId.value) {
    toast.info('Compartir evento', 'Selecciona a qué conversación o usuario deseas enviar el evento.')
  }
})

onUnmounted(() => {
  chatStore.stopPolling()
})
</script>

<style scoped>
.animate-scale-up {
  animation: scaleUp 0.16s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes scaleUp {
  from {
    opacity: 0;
    transform: scale(0.92);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
