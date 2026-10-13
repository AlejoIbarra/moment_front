<template>
  <div class="min-h-screen bg-[#0a0a0f] text-white flex flex-col justify-between selection:bg-[#3ef4a1] selection:text-black">
    <!-- Ambient Glow Background -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#3ef4a1]/5 rounded-full blur-3xl"></div>
      <div class="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 right-1/4 w-[600px] h-[600px] bg-[#3ef4a1]/4 rounded-full blur-3xl"></div>
    </div>

    <!-- Navigation Header -->
    <header class="relative z-10 border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <NuxtLink to="/" class="flex items-center gap-2 group">
            <img src="/logo.png" alt="Moments Logo" class="h-8 w-auto group-hover:scale-105 transition-transform" />
            <span class="text-2xl font-black tracking-tighter italic text-[#3ef4a1]">Moments</span>
          </NuxtLink>
          <span class="hidden sm:inline-block text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300 font-bold uppercase tracking-wider">
            Blog & Guías SEO
          </span>
        </div>

        <nav class="flex items-center gap-4">
          <NuxtLink to="/marketplace" class="text-xs sm:text-sm font-semibold text-gray-400 hover:text-white transition-colors">
            Explorar Eventos
          </NuxtLink>
          <NuxtLink to="/photographer-access" class="text-xs sm:text-sm font-bold text-black bg-[#3ef4a1] hover:bg-[#2dd68a] transition-all px-3.5 py-2 rounded-xl shadow-lg shadow-[#3ef4a1]/15 active:scale-95">
            Portal Fotógrafos
          </NuxtLink>
        </nav>
      </div>
    </header>

    <main class="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <!-- Breadcrumb -->
      <nav aria-label="Breadcrumb" class="mb-8">
        <ol class="flex items-center gap-2 text-xs text-gray-400">
          <li><NuxtLink to="/" class="hover:text-emerald-400 transition-colors">Inicio</NuxtLink></li>
          <li><span>/</span></li>
          <li class="text-white font-bold">Blog de Monetización</li>
        </ol>
      </nav>

      <!-- Hero Section -->
      <div class="text-center max-w-3xl mx-auto mb-14">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-4">
          <Icon name="lucide:sparkles" class="w-3.5 h-3.5" />
          Aprende a Vivir de la Fotografía
        </div>
        <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
          Dónde Vender Fotos & Cómo Ganar Dinero con Eventos
        </h1>
        <p class="text-base sm:text-lg text-gray-300 leading-relaxed">
          Guías oficiales, modelos de pricing y estrategias de monetización con inteligencia artificial para fotógrafos en Colombia y toda Latinoamérica.
        </p>

        <!-- Search Bar -->
        <div class="mt-8 max-w-xl mx-auto relative">
          <Icon name="lucide:search" class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por tema (dónde vender fotos, precios, IA, eventos)..."
            class="w-full pl-12 pr-10 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#3ef4a1] focus:border-transparent transition-all backdrop-blur-md shadow-inner"
          />
          <button
            v-if="searchQuery"
            @click="searchQuery = ''"
            type="button"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <Icon name="lucide:x" class="w-4 h-4" />
          </button>
        </div>

        <!-- Categories Filters -->
        <div class="flex flex-wrap items-center justify-center gap-2 mt-6">
          <button
            v-for="cat in categories"
            :key="cat"
            type="button"
            @click="selectedCategory = cat"
            :class="[
              'px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer',
              selectedCategory === cat
                ? 'bg-[#3ef4a1] text-black shadow-md shadow-[#3ef4a1]/20'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
            ]"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Featured Article (if matches filter) -->
      <div v-if="featuredArticle && (!searchQuery && selectedCategory === 'Todos')" class="mb-14">
        <NuxtLink
          :to="`/blog/${featuredArticle.slug}`"
          class="group block relative rounded-3xl overflow-hidden border border-emerald-500/30 bg-gradient-to-br from-emerald-950/20 via-black to-[#0a0a0f] p-8 sm:p-12 hover:border-[#3ef4a1] transition-all duration-300 shadow-2xl hover:shadow-[#3ef4a1]/10"
        >
          <div class="flex flex-wrap items-center gap-3 mb-4">
            <span class="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
              ⭐ Guía Definitiva 2026
            </span>
            <span class="text-xs text-gray-400 flex items-center gap-1">
              <Icon name="lucide:clock" class="w-3.5 h-3.5 text-gray-500" />
              {{ featuredArticle.readTime }}
            </span>
            <span class="text-xs text-gray-400">• {{ featuredArticle.date }}</span>
          </div>

          <h2 class="text-2xl sm:text-4xl font-black text-white group-hover:text-[#3ef4a1] transition-colors mb-4 leading-tight">
            {{ featuredArticle.title }}
          </h2>
          <p class="text-gray-300 text-sm sm:text-base leading-relaxed mb-6 max-w-3xl">
            {{ featuredArticle.subtitle }}
          </p>

          <div class="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-white/10">
            <div class="flex items-center gap-3">
              <img :src="featuredArticle.author.avatar" alt="Avatar" class="w-9 h-9 rounded-full bg-white/10 p-1 border border-white/10" />
              <div>
                <p class="text-xs font-bold text-white">{{ featuredArticle.author.name }}</p>
                <p class="text-[11px] text-gray-400">{{ featuredArticle.author.role }}</p>
              </div>
            </div>

            <div class="inline-flex items-center gap-2 text-sm font-bold text-[#3ef4a1] group-hover:translate-x-1 transition-transform">
              <span>Leer guía completa</span>
              <Icon name="lucide:arrow-right" class="w-4 h-4" />
            </div>
          </div>
        </NuxtLink>
      </div>

      <!-- Articles Grid -->
      <div v-if="filteredArticles.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        <article
          v-for="article in filteredArticles"
          :key="article.slug"
          class="flex flex-col justify-between rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/5 group"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-3">
              <span class="text-[11px] font-bold text-emerald-400 px-2.5 py-0.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                {{ article.category }}
              </span>
              <span class="text-[11px] text-gray-400 flex items-center gap-1">
                <Icon name="lucide:clock" class="w-3 h-3 text-gray-500" />
                {{ article.readTime }}
              </span>
            </div>

            <NuxtLink :to="`/blog/${article.slug}`">
              <h3 class="text-lg font-bold text-white group-hover:text-[#3ef4a1] transition-colors mb-2 leading-snug">
                {{ article.title }}
              </h3>
            </NuxtLink>

            <p class="text-xs text-gray-400 line-clamp-3 leading-relaxed mb-4">
              {{ article.subtitle }}
            </p>
          </div>

          <div class="pt-4 border-t border-white/5 flex items-center justify-between gap-3 text-xs">
            <span class="text-gray-500 font-medium">{{ article.date }}</span>
            <NuxtLink
              :to="`/blog/${article.slug}`"
              class="font-bold text-[#3ef4a1] hover:text-emerald-300 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
            >
              Leer más
              <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" />
            </NuxtLink>
          </div>
        </article>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16 text-gray-400">
        <Icon name="lucide:search-x" class="w-12 h-12 mx-auto mb-3 opacity-40 text-emerald-400" />
        <h3 class="text-lg font-bold text-white mb-1">No se encontraron artículos</h3>
        <p class="text-xs text-gray-400 max-w-sm mx-auto mb-4">
          Prueba buscando con otros términos como "monetización", "precios", "banco de fotos" o limpia el buscador.
        </p>
        <button
          type="button"
          @click="searchQuery = ''; selectedCategory = 'Todos'"
          class="px-4 py-2 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 transition-colors"
        >
          Ver todos los artículos
        </button>
      </div>

      <!-- Bottom High-Converting Banner -->
      <section class="rounded-3xl border border-white/10 bg-gradient-to-r from-emerald-950/40 via-black to-[#0a0a0f] p-8 sm:p-12 text-center relative overflow-hidden">
        <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-[#3ef4a1]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div class="max-w-2xl mx-auto relative z-10">
          <span class="px-3 py-1 rounded-full bg-[#3ef4a1]/10 border border-[#3ef4a1]/20 text-[#3ef4a1] text-xs font-bold uppercase tracking-wider mb-4 inline-block">
            Únete a la Red de Fotógrafos de Moments
          </span>
          <h2 class="text-2xl sm:text-4xl font-black text-white mb-4 leading-tight">
            Empieza a Vender Tus Fotos en Tiempo Real
          </h2>
          <p class="text-gray-300 text-sm sm:text-base leading-relaxed mb-8">
            Crea tu cuenta de fotógrafo gratis, sube tus álbumes con reconocimiento facial por IA y recibe pagos directos en moneda local vía Mercado Pago.
          </p>
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
            <NuxtLink
              to="/photographer-access"
              class="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#3ef4a1] text-black font-extrabold text-sm hover:bg-[#2dd68a] transition-all hover:scale-105 shadow-xl shadow-[#3ef4a1]/20"
            >
              Postularme como Fotógrafo Pro
            </NuxtLink>
            <NuxtLink
              to="/marketplace"
              class="w-full sm:w-auto px-8 py-4 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/20 transition-all border border-white/10"
            >
              Ver Galerías en Vivo
            </NuxtLink>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 border-t border-white/10 bg-black/60 py-8 text-xs text-gray-500">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 Moments App. Plataforma de Fotografía de Eventos en Latinoamérica.</p>
        <div class="flex items-center gap-4">
          <NuxtLink to="/terms-photographer" class="hover:text-white transition-colors">Términos Fotógrafos</NuxtLink>
          <NuxtLink to="/privacy" class="hover:text-white transition-colors">Privacidad</NuxtLink>
          <NuxtLink to="/" class="hover:text-white transition-colors">Inicio</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { blogArticles } from '~/data/blogArticles'

definePageMeta({ layout: false })

const searchQuery = ref('')
const selectedCategory = ref('Todos')

const categories = ['Todos', 'Monetización', 'Guías Prácticas', 'Tecnología & IA', 'Estrategias de Precios', 'Derechos & Seguridad']

const featuredArticle = computed(() => {
  return blogArticles.find(a => a.featured) || blogArticles[0]
})

const filteredArticles = computed(() => {
  return blogArticles.filter(article => {
    // If not searching, we can hide the featured one from the grid if on "Todos"
    if (!searchQuery.value && selectedCategory.value === 'Todos' && article.slug === featuredArticle.value?.slug) {
      return false
    }

    const matchesCategory = selectedCategory.value === 'Todos' || article.category === selectedCategory.value
    if (!matchesCategory) return false

    if (!searchQuery.value.trim()) return true
    const q = searchQuery.value.toLowerCase().trim()
    return (
      article.title.toLowerCase().includes(q) ||
      article.subtitle.toLowerCase().includes(q) ||
      article.metaDescription.toLowerCase().includes(q) ||
      article.keywords.some(k => k.toLowerCase().includes(q))
    )
  })
})

useSeoMeta({
  title: 'Dónde Vender Fotos y Cómo Ganar Dinero Siendo Fotógrafo — Blog Moments',
  description: 'Guías completas sobre dónde vender fotos por internet, cómo monetizar eventos con reconocimiento facial por IA y estrategias de precios para fotógrafos en Latinoamérica.',
  keywords: 'dónde vender fotos, cómo ganar dinero siendo fotógrafo, vender fotos latinoamérica, reconocimiento facial fotos eventos, fotografía deportiva monetización, mercado pago fotos',
  ogTitle: 'Dónde Vender Fotos y Cómo Ganar Dinero Siendo Fotógrafo — Blog Moments',
  ogDescription: 'Aprende a monetizar cada evento con IA y venta directa en moneda local. Consejos de precios, protección anticopia y casos reales.',
  ogUrl: 'https://www.moments-gallery.com/blog',
  ogType: 'website',
  ogImage: 'https://www.moments-gallery.com/logo.png',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Dónde Vender Fotos y Cómo Ganar Dinero Siendo Fotógrafo — Blog Moments',
  twitterDescription: 'Guías de monetización de eventos fotográficos con inteligencia artificial en Latinoamérica.',
  twitterImage: 'https://www.moments-gallery.com/logo.png'
})

useHead({
  link: [
    { rel: 'canonical', href: 'https://www.moments-gallery.com/blog' }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Blog de Fotografía y Monetización — Moments App',
        description: 'Guías completas sobre dónde vender fotos por internet y cómo monetizar eventos.',
        url: 'https://www.moments-gallery.com/blog',
        publisher: {
          '@type': 'Organization',
          name: 'Moments App',
          logo: {
            '@type': 'ImageObject',
            url: 'https://www.moments-gallery.com/logo.png'
          }
        },
        hasPart: blogArticles.map(a => ({
          '@type': 'BlogPosting',
          headline: a.title,
          description: a.metaDescription,
          url: `https://www.moments-gallery.com/blog/${a.slug}`,
          datePublished: a.date,
          dateModified: a.lastModified
        }))
      })
    }
  ]
})
</script>
