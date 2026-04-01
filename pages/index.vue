<template>
  <div class="px-4 py-16 max-w-7xl mx-auto sm:px-6 lg:px-8 text-center text-gray-900 mt-20">
      <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
        {{ $t('home.hero_title') }}
      </h1>
      <p class="mt-6 text-xl text-indigo-100 max-w-3xl">
        {{ $t('home.hero_subtitle') }}
      </p>
      <div class="mt-10 flex gap-4">
        <NuxtLink to="/marketplace" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50">
          {{ $t('home.explore') }}
        </NuxtLink>
        <NuxtLink to="/register" class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-500 bg-opacity-60 hover:bg-opacity-70">
          {{ $t('home.join_as_photographer') }}
        </NuxtLink>
      </div>
  </div>
</template>

<script setup>
</script>
