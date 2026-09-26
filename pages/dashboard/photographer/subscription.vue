<script setup lang="ts">
navigateTo('/subscription', { replace: true })
</script>

<template>
  <div class="min-h-screen bg-slate-950 flex items-center justify-center text-white">
    <div class="flex items-center gap-3">
      <Icon name="lucide:loader-2" class="w-6 h-6 animate-spin text-[#3ef4a1]" />
      <span class="text-sm font-semibold">Cargando suscripción Moments PRO...</span>
    </div>
  </div>
</template>
