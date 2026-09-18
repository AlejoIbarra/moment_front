<template>
  <div class="h-[calc(100vh-64px)] bg-[#f0f2f5] flex flex-col overflow-hidden font-sans">
    <div class="max-w-[1600px] w-full mx-auto h-full flex flex-1 bg-white shadow-xl overflow-hidden md:my-2 md:rounded-2xl md:border md:border-gray-200">
      
      <!-- ═══════════════════════════════════════════════════════ -->
      <!-- LEFT SIDEBAR: CONVERSATION LIST & SEARCH               -->
      <!-- ═══════════════════════════════════════════════════════ -->
      <div 
        :class="[
          'w-full md:w-[380px] lg:w-[420px] flex-shrink-0 flex flex-col border-r border-gray-200 bg-white transition-all',
          activeConversation ? 'hidden md:flex' : 'flex'
        ]"
      >
        <!-- Sidebar Header -->
        <div class="h-16 px-4 bg-[#f0f2f5] border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
              <img v-if="authStore.user?.profilePhotoUrl" :src="authStore.user.profilePhotoUrl" alt="Avatar" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                {{ authStore.user?.username?.charAt(0)?.toUpperCase() || 'U' }}
              </div>
            </div>
            <div>
              <h3 class="text-sm font-bold text-gray-900 leading-tight">Chats</h3>
              <p class="text-[11px] text-gray-500">@{{ authStore.user?.username }}</p>
            </div>
          </div>

          <div class="flex items-center gap-1">
            <button 
              @click="focusSearch" 
              class="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200/80 transition-colors"
              title="Nuevo chat"
            >
              <Icon name="lucide:message-square-plus" class="w-5 h-5" />
            </button>
            <button 
              @click="chatStore.fetchConversations" 
              class="w-9 h-9 rounded-full flex items-center justify-center text-gray-600 hover:bg-gray-200/80 transition-colors"
              title="Actualizar"
            >
              <Icon name="lucide:rotate-cw" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Sharing Event Alert Banner -->
        <div v-if="pendingSharedEventId" class="p-3 bg-indigo-50 border-b border-indigo-100 flex items-center justify-between gap-2 text-xs text-indigo-800 animate-fade-in">
          <div class="flex items-center gap-2">
            <Icon name="lucide:share-2" class="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span class="font-medium">Selecciona un chat para compartir este evento</span>
          </div>
          <button @click="pendingSharedEventId = null" class="text-indigo-400 hover:text-indigo-600 font-bold p-1">
            ✕
          </button>
        </div>

        <!-- Search Input Bar -->
        <div class="p-3 bg-white border-b border-gray-100 flex-shrink-0">
          <div class="relative flex items-center bg-[#f0f2f5] rounded-xl px-3 py-1.5 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-500 transition-all border border-transparent focus-within:border-emerald-500">
            <Icon name="lucide:search" class="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
            <input
              ref="searchInputRef"
              v-model="searchQuery"
              @input="onSearchInput"
              type="text"
              placeholder="Buscar o empezar un nuevo chat..."
              class="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
            />
            <button v-if="searchQuery" @click="clearSearch" class="text-gray-400 hover:text-gray-600 p-0.5">
              <Icon name="lucide:x" class="w-4 h-4" />
            </button>
          </div>
        </div>

        <!-- Search Results (when typing query to find new users) -->
        <div v-if="searchQuery.trim().length >= 2" class="flex-1 overflow-y-auto divide-y divide-gray-50">
          <div class="px-4 py-2 bg-gray-50 text-xs font-bold text-gray-400 uppercase tracking-wider">
            Usuarios en Moments
          </div>

          <div v-if="chatStore.isSearching" class="p-6 text-center text-gray-400 text-xs">
            Buscando usuarios...
          </div>

          <div v-else-if="chatStore.searchResults.length === 0" class="p-6 text-center text-gray-400 text-xs">
            No se encontraron usuarios con "{{ searchQuery }}"
          </div>

          <div
            v-else
            v-for="u in chatStore.searchResults"
            :key="u.id"
            @click="startChatWithUser(u.username)"
            class="p-3.5 flex items-center gap-3 hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <div class="w-11 h-11 rounded-full overflow-hidden bg-indigo-50 border border-gray-200 flex-shrink-0">
              <img v-if="u.profilePhotoUrl" :src="u.profilePhotoUrl" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center font-bold text-indigo-600">
                {{ u.username?.charAt(0)?.toUpperCase() }}
              </div>
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-gray-900 truncate">@{{ u.username }}</span>
                <span v-if="u.role === 'PHOTOGRAPHER'" class="px-1.5 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-700 rounded-md">PRO</span>
              </div>
              <p class="text-xs text-gray-500 truncate mt-0.5">{{ u.title || 'Usuario de Moments' }}</p>
            </div>
            <button class="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm">
              Chatear
            </button>
          </div>
        </div>

        <!-- Conversations List -->
        <div v-else class="flex-1 overflow-y-auto divide-y divide-gray-100/60">
          <div v-if="chatStore.isLoadingConversations" class="py-16 text-center text-gray-400 text-sm flex flex-col items-center gap-2">
            <div class="w-7 h-7 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span>Cargando conversaciones...</span>
          </div>

          <div v-else-if="chatStore.conversations.length === 0" class="py-20 px-6 text-center text-gray-400">
            <div class="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Icon name="lucide:message-circle" class="w-8 h-8" />
            </div>
            <h4 class="text-base font-bold text-gray-800 mb-1">Aún no tienes mensajes</h4>
            <p class="text-xs text-gray-500 mb-4 max-w-xs mx-auto">
              Busca fotógrafos o amigos con la barra de arriba para iniciar una conversación y compartir eventos.
            </p>
            <button @click="focusSearch" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all active:scale-95">
              Iniciar un Chat
            </button>
          </div>

          <div
            v-else
            v-for="conv in chatStore.conversations"
            :key="conv.id"
            @click="handleSelectConversation(conv)"
            :class="[
              'p-3.5 flex items-center gap-3 cursor-pointer transition-colors border-l-4',
              activeConversation?.id === conv.id 
                ? 'bg-[#f0f2f5] border-emerald-600' 
                : 'hover:bg-gray-50/80 border-transparent'
            ]"
          >
            <!-- Contact Avatar -->
            <div class="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
              <img v-if="conv.otherProfilePhoto" :src="conv.otherProfilePhoto" alt="Avatar" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-600 font-bold text-base bg-emerald-50">
                {{ conv.otherUsername?.charAt(0)?.toUpperCase() || '?' }}
              </div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-baseline justify-between mb-1">
                <span class="text-sm font-bold text-gray-900 truncate">
                  {{ conv.otherDisplayName || conv.otherUsername }}
                </span>
                <span class="text-[11px] text-gray-400 font-medium flex-shrink-0 ml-2">
                  {{ formatMessageTime(conv.lastMessageTimestamp) }}
                </span>
              </div>

              <div class="flex items-center justify-between">
                <div class="flex items-center gap-1.5 text-xs text-gray-500 truncate">
                  <Icon v-if="conv.lastMessageType === 'EVENT'" name="lucide:calendar" class="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                  <Icon v-else-if="conv.lastMessageType === 'PHOTO'" name="lucide:image" class="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                  <span class="truncate">{{ conv.lastMessageContent || 'Nuevo chat' }}</span>
                </div>

                <!-- Unread Badge -->
                <span 
                  v-if="conv.unreadCount > 0" 
                  class="min-w-[20px] h-5 px-1.5 rounded-full bg-emerald-500 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 shadow-sm ml-2"
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
          'flex-1 flex flex-col bg-[#efeae2] relative overflow-hidden transition-all',
          activeConversation ? 'flex' : 'hidden md:flex'
        ]"
      >
        <!-- Active Chat Header -->
        <div v-if="activeConversation" class="h-16 px-4 bg-[#f0f2f5] border-b border-gray-200 flex items-center justify-between flex-shrink-0 z-10 shadow-sm">
          <div class="flex items-center gap-3">
            <!-- Mobile Back Button -->
            <button 
              @click="activeConversation = null" 
              class="md:hidden p-1.5 -ml-1 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-200/80 transition-colors"
            >
              <Icon name="lucide:arrow-left" class="w-5 h-5" />
            </button>

            <!-- Contact Photo -->
            <div class="w-10 h-10 rounded-full overflow-hidden bg-gray-200 border border-gray-300 flex-shrink-0">
              <img v-if="activeConversation.otherProfilePhoto" :src="activeConversation.otherProfilePhoto" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center font-bold text-gray-600 bg-emerald-50">
                {{ activeConversation.otherUsername?.charAt(0)?.toUpperCase() }}
              </div>
            </div>

            <!-- Contact Info -->
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-sm font-bold text-gray-900 leading-tight">
                  {{ activeConversation.otherDisplayName || activeConversation.otherUsername }}
                </h3>
                <span v-if="activeConversation.otherRole === 'PHOTOGRAPHER'" class="px-1.5 py-0.5 text-[9px] font-bold bg-amber-50 text-amber-700 rounded">
                  FOTÓGRAFO
                </span>
              </div>
              <p class="text-[11px] text-gray-500">@{{ activeConversation.otherUsername }} · En línea</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button 
              @click="showShareEventModal = true" 
              class="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition-all shadow-sm"
              title="Compartir evento"
            >
              <Icon name="lucide:calendar-plus" class="w-4 h-4 text-indigo-600" />
              <span class="hidden sm:inline">Compartir Evento</span>
            </button>
            <NuxtLink 
              :to="`/profile/${activeConversation.otherUsername}`" 
              class="p-2 text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-200/80 transition-colors"
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
          class="flex-1 overflow-y-auto p-4 md:p-6 space-y-3 bg-[#efeae2]/60 relative"
          style="background-image: radial-gradient(#d1d7db 1px, transparent 1px); background-size: 24px 24px;"
        >
          <div v-if="chatStore.isLoadingMessages" class="py-16 text-center text-gray-400">
            <div class="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <span class="text-xs">Cargando mensajes...</span>
          </div>

          <div v-else-if="chatStore.messages.length === 0" class="py-12 text-center text-gray-500">
            <div class="inline-block p-4 bg-white rounded-2xl shadow-sm border border-gray-100 max-w-sm mx-auto">
              <Icon name="lucide:sparkles" class="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <h4 class="text-sm font-bold text-gray-800 mb-1">¡Inicia la conversación!</h4>
              <p class="text-xs text-gray-400">
                Saluda a @{{ activeConversation.otherUsername }} o envíale un evento para coordinar fotos.
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
                  'max-w-[85%] sm:max-w-[70%] md:max-w-[60%] rounded-2xl p-3 text-sm relative shadow-sm transition-all',
                  isMyMessage(msg) 
                    ? 'bg-[#d9fdd3] text-gray-900 rounded-tr-none border border-emerald-200/50' 
                    : 'bg-white text-gray-900 rounded-tl-none border border-gray-100'
                ]"
              >
                <!-- RICH EVENT CARD ATTACHMENT -->
                <div 
                  v-if="msg.type === 'EVENT' && msg.parsedMeta" 
                  class="mb-2 p-3 bg-white rounded-xl border border-gray-200/80 shadow-sm overflow-hidden"
                >
                  <!-- Event Cover Image -->
                  <div class="relative w-full h-36 rounded-lg overflow-hidden bg-gray-100 mb-2.5">
                    <img 
                      v-if="msg.parsedMeta.coverPhotoUrl" 
                      :src="msg.parsedMeta.coverPhotoUrl" 
                      alt="Event Cover" 
                      class="w-full h-full object-cover" 
                    />
                    <div v-else class="w-full h-full flex items-center justify-center text-gray-300">
                      <Icon name="lucide:image" class="w-10 h-10" />
                    </div>
                    <span class="absolute top-2 right-2 px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold rounded-full">
                      Evento
                    </span>
                  </div>

                  <!-- Event Info -->
                  <h4 class="font-bold text-gray-900 text-sm leading-snug mb-1">{{ msg.parsedMeta.title }}</h4>
                  <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-3">
                    <span class="flex items-center gap-1">
                      <Icon name="lucide:calendar" class="w-3 h-3 text-gray-400" />
                      {{ msg.parsedMeta.date }}
                    </span>
                    <span v-if="msg.parsedMeta.location" class="flex items-center gap-1">
                      <Icon name="lucide:map-pin" class="w-3 h-3 text-gray-400" />
                      {{ msg.parsedMeta.location }}
                    </span>
                  </div>

                  <!-- View Event CTA Button -->
                  <NuxtLink 
                    :to="`/marketplace/events/${msg.parsedMeta.eventId}`"
                    class="w-full py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
                  >
                    <span>Ver Evento</span>
                    <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" />
                  </NuxtLink>
                </div>

                <!-- RICH GIFT CARD ATTACHMENT -->
                <div 
                  v-if="msg.type === 'GIFT_CARD' && msg.parsedMeta" 
                  class="mb-2 p-4 bg-gradient-to-br from-indigo-950 via-slate-900 to-emerald-950 text-white rounded-2xl border border-emerald-500/30 shadow-md overflow-hidden relative"
                >
                  <div class="absolute -right-6 -bottom-6 w-24 h-24 bg-emerald-500/10 rounded-full blur-xl pointer-events-none"></div>
                  
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
                      {{ msg.parsedMeta.photosRemaining ?? msg.parsedMeta.photoCount ?? 5 }} Fotos Gratis
                    </span>
                  </div>

                  <!-- Voucher code ticket -->
                  <div class="bg-black/40 border border-white/10 rounded-xl p-3 flex items-center justify-between mb-3 relative z-10 backdrop-blur-sm">
                    <div>
                      <p class="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Código de Canje</p>
                      <p class="font-mono font-black text-white text-base tracking-widest">{{ msg.parsedMeta.code }}</p>
                    </div>
                    <button
                      @click="copyCode(msg.parsedMeta.code)"
                      class="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 border border-white/10"
                      title="Copiar Código"
                    >
                      <Icon name="lucide:copy" class="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </button>
                  </div>

                  <!-- Actions -->
                  <div class="flex gap-2 relative z-10">
                    <NuxtLink 
                      :to="`/gift/${msg.parsedMeta.code}`"
                      class="flex-1 py-2 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 text-center"
                    >
                      <span>Redimir Fotos</span>
                      <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" />
                    </NuxtLink>
                  </div>
                </div>

                <!-- Text Content -->
                <p v-if="msg.content" class="whitespace-pre-wrap break-words leading-relaxed text-[13.5px]">
                  {{ msg.content }}
                </p>

                <!-- Time & Read Status -->
                <div class="flex items-center justify-end gap-1 mt-1 text-[10px] text-gray-400 select-none">
                  <span>{{ formatMessageHour(msg.createdAt) }}</span>
                  <template v-if="isMyMessage(msg)">
                    <Icon v-if="msg.isRead" name="lucide:check-check" class="w-3.5 h-3.5 text-emerald-600" />
                    <Icon v-else name="lucide:check" class="w-3.5 h-3.5 text-gray-400" />
                  </template>
                </div>
              </div>
            </div>
          </template>
        </div>

        <!-- Message Input Bar -->
        <div v-if="activeConversation" class="h-16 px-4 bg-[#f0f2f5] border-t border-gray-200 flex items-center gap-2.5 flex-shrink-0 z-10">
          <!-- Attachment Button -->
          <div class="relative">
            <button 
              @click="showAttachmentMenu = !showAttachmentMenu"
              class="w-10 h-10 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-200/80 transition-colors"
              title="Adjuntar"
            >
              <Icon name="lucide:paperclip" class="w-5 h-5" />
            </button>

            <!-- Attachment Menu Dropdown -->
            <div 
              v-if="showAttachmentMenu" 
              class="absolute bottom-12 left-0 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 w-56 z-30 animate-scale-up space-y-1"
            >
              <button 
                @click="openShareEventModal" 
                class="w-full px-3 py-2.5 rounded-xl flex items-center gap-3 hover:bg-indigo-50 text-indigo-700 text-xs font-bold transition-colors text-left"
              >
                <div class="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600">
                  <Icon name="lucide:calendar" class="w-4 h-4" />
                </div>
                <div>
                  <span class="block">Compartir Evento</span>
                  <span class="text-[10px] text-gray-400 font-normal">Envía un evento al chat</span>
                </div>
              </button>

              <button 
                @click="openShareGiftCardModal" 
                class="w-full px-3 py-2.5 rounded-xl flex items-center gap-3 hover:bg-emerald-50 text-emerald-700 text-xs font-bold transition-colors text-left"
              >
                <div class="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <Icon name="lucide:gift" class="w-4 h-4" />
                </div>
                <div>
                  <span class="block">Tarjeta de Regalo</span>
                  <span class="text-[10px] text-gray-400 font-normal">Envía un bono de fotos</span>
                </div>
              </button>
            </div>
          </div>

          <!-- Text Input -->
          <div class="flex-1 bg-white rounded-xl border border-gray-200 focus-within:border-emerald-500 focus-within:ring-1 focus-within:ring-emerald-500 transition-all px-4 py-2">
            <input
              ref="messageInputRef"
              v-model="messageText"
              @keydown.enter.prevent="handleSend"
              type="text"
              placeholder="Escribe un mensaje..."
              class="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
              :disabled="chatStore.isSending"
            />
          </div>

          <!-- Send Button -->
          <button
            @click="handleSend"
            :disabled="!messageText.trim() || chatStore.isSending"
            class="w-10 h-10 rounded-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 disabled:hover:bg-emerald-600 text-white flex items-center justify-center transition-all shadow-md active:scale-95 flex-shrink-0"
            title="Enviar"
          >
            <Icon name="lucide:send" class="w-4 h-4" />
          </button>
        </div>

        <!-- Empty State (No conversation selected) -->
        <div v-else class="flex-1 hidden md:flex flex-col items-center justify-center p-8 text-center bg-[#f0f2f5] border-b-8 border-emerald-500">
          <div class="w-24 h-24 rounded-3xl bg-white shadow-md flex items-center justify-center mb-6 text-emerald-600 border border-gray-100">
            <Icon name="lucide:message-circle" class="w-12 h-12" />
          </div>
          <h2 class="text-2xl font-black text-gray-800 mb-2">Moment Chat para la Web</h2>
          <p class="text-sm text-gray-500 max-w-md mb-6 leading-relaxed">
            Chatea en tiempo real con fotógrafos y clientes. Comparte eventos interactivos, coordina coberturas fotográficas y compra fotos fácilmente.
          </p>
          <div class="flex items-center gap-2 text-xs text-gray-400 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
            <Icon name="lucide:shield-check" class="w-4 h-4 text-emerald-600" />
            <span>Mensajes privados y en tiempo real garantizados</span>
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
  middleware: 'auth'
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
  if (authStore.isAuthenticated) {
    notifStore.startSync()
  }
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
