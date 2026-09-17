<template>
  <div class="flex flex-col h-full bg-white">
    <!-- Comments List -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        <div v-if="comments.length === 0" class="text-center py-10">
            <Icon name="lucide:message-circle" class="w-8 h-8 text-gray-300 mx-auto mb-2 opacity-60" />
            <p class="text-sm text-gray-400">Aún no hay comentarios. ¡Sé el primero en opinar!</p>
        </div>
        <div v-for="comment in comments" :key="comment.id" class="flex gap-3 group">
            <div class="w-8 h-8 rounded-full bg-indigo-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img v-if="comment.authorProfilePhotoUrl" :src="comment.authorProfilePhotoUrl" class="w-full h-full object-cover" />
                <span v-else class="text-[10px] font-bold text-indigo-600 uppercase">{{ comment.authorUsername ? comment.authorUsername.charAt(0) : 'U' }}</span>
            </div>
            <div class="flex-1 min-w-0">
                <p class="text-sm break-words">
                    <span class="font-bold text-gray-900 mr-2">{{ comment.authorUsername }}</span>
                    <span class="text-gray-800">{{ comment.content }}</span>
                </p>
                <div class="flex items-center gap-3 mt-1">
                    <span class="text-[10px] text-gray-400 font-medium">{{ formatDate(comment.createdAt) }}</span>
                    <span v-if="comment.likesCount > 0" class="text-[10px] font-bold text-gray-500">{{ comment.likesCount }} me gusta</span>
                    <button v-if="canDelete(comment)" @click="$emit('delete', comment.id)" class="text-[10px] font-bold text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">Eliminar</button>
                </div>
            </div>
            <button @click="$emit('like', comment.id)" class="hover:scale-110 transition-transform p-1 self-start cursor-pointer" title="Me gusta">
                <Icon 
                    name="lucide:heart" 
                    :class="['w-3.5 h-3.5', comment.isLiked ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-gray-600']" 
                />
            </button>
        </div>
    </div>

    <!-- Input Area -->
    <div class="p-3 md:p-4 border-t border-gray-100 bg-white">
        <div v-if="authStore.isAuthenticated" class="flex items-center gap-2 bg-gray-50 rounded-2xl px-3 py-1.5 focus-within:ring-2 focus-within:ring-indigo-200 transition-all border border-gray-200/70">
            <Icon name="lucide:message-square" class="w-4 h-4 text-gray-400 shrink-0" />
            <input 
                ref="inputRef"
                v-model="newComment"
                type="text" 
                placeholder="Añade un comentario..." 
                class="flex-1 bg-transparent border-none focus:ring-0 text-sm py-1.5 text-gray-900 placeholder:text-gray-400 focus:outline-none min-w-0"
                @keyup.enter="submitComment"
                :disabled="isSubmitting"
            />
            <button 
                @click="submitComment"
                class="text-xs font-bold text-indigo-600 disabled:opacity-40 hover:text-indigo-700 transition-colors px-2.5 py-1 rounded-lg hover:bg-indigo-50 shrink-0 cursor-pointer"
                :disabled="!newComment.trim() || isSubmitting"
            >
                {{ isSubmitting ? 'Publicando...' : 'Publicar' }}
            </button>
        </div>
        <div v-else class="text-center py-2.5 px-3 bg-gray-50 rounded-xl border border-gray-100">
            <p class="text-xs text-gray-500 mb-1">Inicia sesión para dejar un comentario</p>
            <NuxtLink to="/login" class="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:underline">
                <Icon name="lucide:log-in" class="w-3.5 h-3.5" />
                Iniciar Sesión
            </NuxtLink>
        </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()

const props = defineProps({
    comments: { type: Array, default: () => [] },
    isSubmitting: { type: Boolean, default: false },
    currentUsername: { type: String, default: '' }
})

const emit = defineEmits(['submit', 'delete', 'like'])

const newComment = ref('')
const inputRef = ref(null)

function focusInput() {
    inputRef.value?.focus()
}

defineExpose({
    focusInput
})

function submitComment() {
    if (!newComment.value.trim() || props.isSubmitting) return
    const text = newComment.value.trim()
    emit('submit', text)
    newComment.value = ''
}

function formatDate(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000)
    
    if (diff < 60) return 'Justo ahora'
    if (diff < 3600) return `${Math.floor(diff / 60)}m`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`
    return `${Math.floor(diff / 86400)}d`
}

function canDelete(comment) {
    return props.currentUsername && props.currentUsername === comment.authorUsername
}
</script>
