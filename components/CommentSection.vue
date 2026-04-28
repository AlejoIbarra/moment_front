<template>
  <div class="flex flex-col h-full bg-white">
    <!-- Comments List -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
        <div v-if="comments.length === 0" class="text-center py-10">
            <p class="text-sm text-gray-400">Aún no hay comentarios. ¡Sé el primero en opinar!</p>
        </div>
        <div v-for="comment in comments" :key="comment.id" class="flex gap-3 group">
            <div class="w-8 h-8 rounded-full bg-indigo-50 border border-gray-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                <img v-if="comment.authorProfilePhotoUrl" :src="comment.authorProfilePhotoUrl" class="w-full h-full object-cover">
                <span v-else class="text-[10px] font-bold text-indigo-600 uppercase">{{ comment.authorUsername.charAt(0) }}</span>
            </div>
            <div class="flex-1">
                <p class="text-sm">
                    <span class="font-bold text-gray-900 mr-2">{{ comment.authorUsername }}</span>
                    <span class="text-gray-800">{{ comment.content }}</span>
                </p>
                <div class="flex items-center gap-3 mt-1">
                    <span class="text-[10px] text-gray-400 font-medium">{{ formatDate(comment.createdAt) }}</span>
                    <span v-if="comment.likesCount > 0" class="text-[10px] font-bold text-gray-500">{{ comment.likesCount }} me gusta</span>
                    <button class="text-[10px] font-bold text-gray-400 hover:text-gray-900">Responder</button>
                    <button v-if="canDelete(comment)" @click="$emit('delete', comment.id)" class="text-[10px] font-bold text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">Eliminar</button>
                </div>
            </div>
            <button @click="$emit('like', comment.id)" class="hover:scale-110 transition-transform">
                <Icon 
                    :name="comment.isLiked ? 'lucide:heart' : 'lucide:heart'" 
                    :class="['w-3 h-3', comment.isLiked ? 'text-red-500 fill-current' : 'text-gray-400']" 
                />
            </button>
        </div>
    </div>

    <!-- Input Area -->
    <div class="p-4 border-t border-gray-100">
        <div class="flex items-center gap-3 bg-gray-50 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
            <Icon name="lucide:smile" class="w-5 h-5 text-gray-400 cursor-pointer hover:text-gray-600" />
            <input 
                v-model="newComment"
                type="text" 
                placeholder="Añade un comentario..." 
                class="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2"
                @keyup.enter="submitComment"
                :disabled="isSubmitting"
            >
            <button 
                @click="submitComment"
                class="text-sm font-bold text-indigo-600 disabled:opacity-50 hover:text-indigo-700 transition-colors"
                :disabled="!newComment.trim() || isSubmitting"
            >
                Publicar
            </button>
        </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
    comments: { type: Array, default: () => [] },
    isSubmitting: { type: Boolean, default: false },
    currentUsername: { type: String, default: '' }
})

const emit = defineEmits(['submit', 'delete', 'like'])

const newComment = ref('')

function submitComment() {
    if (!newComment.value.trim() || props.isSubmitting) return
    emit('submit', newComment.value)
    newComment.value = ''
}

function formatDate(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    const now = new Date()
    const diff = Math.floor((now - date) / 1000)
    
    if (diff < 60) return 'Just now'
    if (diff < 3600) return `${Math.floor(diff / 60)}m`
    if (diff < 86400) return `${Math.floor(diff / 3600)}h`
    return `${Math.floor(diff / 86400)}d`
}

function canDelete(comment) {
    return props.currentUsername === comment.authorUsername
}
</script>
