<template>
  <div class="min-h-screen bg-[#0a0a0f] text-white flex flex-col justify-between selection:bg-[#3ef4a1] selection:text-black">
    <!-- Ambient Glow Background -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden z-0">
      <div class="absolute -top-40 -right-40 w-[600px] h-[600px] bg-[#3ef4a1]/5 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 -left-40 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-3xl"></div>
    </div>

    <!-- Reading Progress Bar -->
    <div class="fixed top-0 left-0 w-full h-1 z-50 bg-white/10">
      <div
        class="h-full bg-gradient-to-r from-[#3ef4a1] to-emerald-400 transition-all duration-150"
        :style="{ width: `${readingProgress}%` }"
      ></div>
    </div>

    <!-- Navigation Header -->
    <header class="relative z-10 border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-6">
          <NuxtLink to="/" class="flex items-center gap-2 group">
            <img src="/logo.png" alt="Moments Logo" class="h-8 w-auto group-hover:scale-105 transition-transform" />
            <span class="text-2xl font-black tracking-tighter italic text-[#3ef4a1]">Moments</span>
          </NuxtLink>
          <NuxtLink to="/blog" class="hidden sm:inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
            <Icon name="lucide:arrow-left" class="w-3.5 h-3.5" />
            <span>Volver al Blog</span>
          </NuxtLink>
        </div>

        <nav class="flex items-center gap-4">
          <button
            type="button"
            @click="copyArticleLink"
            class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-gray-300 transition-all cursor-pointer"
            title="Copiar enlace"
          >
            <Icon :name="copied ? 'lucide:check' : 'lucide:share-2'" class="w-3.5 h-3.5 text-emerald-400" />
            <span>{{ copied ? '¡Copiado!' : 'Compartir' }}</span>
          </button>
          <NuxtLink to="/photographer-access" class="text-xs sm:text-sm font-bold text-black bg-[#3ef4a1] hover:bg-[#2dd68a] transition-all px-3.5 py-2 rounded-xl shadow-lg shadow-[#3ef4a1]/15 active:scale-95">
            Comenzar a Vender
          </NuxtLink>
        </nav>
      </div>
    </header>

    <!-- Main Content Container -->
    <main v-if="article" class="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
      <!-- Breadcrumb navigation -->
      <nav aria-label="Breadcrumb" class="mb-6">
        <ol class="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
          <li><NuxtLink to="/" class="hover:text-emerald-400 transition-colors">Inicio</NuxtLink></li>
          <li><span>/</span></li>
          <li><NuxtLink to="/blog" class="hover:text-emerald-400 transition-colors">Blog</NuxtLink></li>
          <li><span>/</span></li>
          <li class="text-emerald-400 font-semibold">{{ article.category }}</li>
          <li><span>/</span></li>
          <li class="text-gray-300 truncate max-w-xs sm:max-w-md">{{ article.title }}</li>
        </ol>
      </nav>

      <!-- Article Header -->
      <header class="max-w-4xl mx-auto mb-10 text-center sm:text-left">
        <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-4">
          <span class="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold uppercase tracking-wider border border-emerald-500/20">
            {{ article.category }}
          </span>
          <span class="text-xs text-gray-400 flex items-center gap-1">
            <Icon name="lucide:clock" class="w-3.5 h-3.5 text-gray-500" />
            {{ article.readTime }}
          </span>
          <span class="text-xs text-gray-400 flex items-center gap-1">
            <Icon name="lucide:calendar" class="w-3.5 h-3.5 text-gray-500" />
            Actualizado: {{ article.lastModified }}
          </span>
        </div>

        <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
          {{ article.title }}
        </h1>
        <p class="text-base sm:text-xl text-gray-300 leading-relaxed mb-6 font-normal">
          {{ article.subtitle }}
        </p>

        <!-- Author Card & Share Actions -->
        <div class="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-white/10">
          <div class="flex items-center gap-3">
            <img :src="article.author.avatar" alt="Avatar" class="w-10 h-10 rounded-full bg-white/10 p-1 border border-white/10" />
            <div class="text-left">
              <p class="text-xs font-bold text-white">{{ article.author.name }}</p>
              <p class="text-[11px] text-gray-400">{{ article.author.role }}</p>
            </div>
          </div>

          <!-- Social Share Buttons -->
          <div class="flex items-center gap-2">
            <span class="text-xs text-gray-400 mr-1 hidden sm:inline">Compartir:</span>
            <a
              :href="whatsappShareUrl"
              target="_blank"
              rel="noopener"
              class="w-8 h-8 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 flex items-center justify-center transition-colors border border-emerald-500/20"
              title="Compartir por WhatsApp"
            >
              <Icon name="lucide:message-circle" class="w-4 h-4" />
            </a>
            <a
              :href="twitterShareUrl"
              target="_blank"
              rel="noopener"
              class="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-colors border border-white/10"
              title="Compartir en X / Twitter"
            >
              <Icon name="lucide:share" class="w-4 h-4" />
            </a>
            <button
              type="button"
              @click="copyArticleLink"
              class="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white flex items-center justify-center transition-colors border border-white/10 cursor-pointer"
              title="Copiar enlace"
            >
              <Icon :name="copied ? 'lucide:check' : 'lucide:link'" class="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <!-- Key Takeaways / Puntos Clave Box (Vital for GEO / AI Crawlers) -->
      <section v-if="article.takeaways && article.takeaways.length > 0" class="max-w-4xl mx-auto mb-10 p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 backdrop-blur-sm">
        <div class="flex items-center gap-2 text-emerald-400 text-sm font-bold uppercase tracking-wider mb-3">
          <Icon name="lucide:check-circle-2" class="w-4 h-4" />
          <span>Puntos Clave de Esta Guía</span>
        </div>
        <ul class="space-y-2 text-sm text-gray-200">
          <li v-for="(point, idx) in article.takeaways" :key="idx" class="flex items-start gap-2.5">
            <span class="text-[#3ef4a1] font-bold">✔</span>
            <span class="leading-relaxed">{{ point }}</span>
          </li>
        </ul>
      </section>

      <!-- Layout: Content + Sticky Sidebar -->
      <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
        <!-- Main Article Content (8 cols) -->
        <article class="lg:col-span-8">
          <div class="prose prose-invert max-w-none article-body text-gray-200" v-html="article.content"></div>

          <!-- Mid-Article Conversion Box -->
          <div class="my-12 p-8 rounded-3xl bg-gradient-to-br from-emerald-950/30 via-black to-[#0a0a0f] border border-emerald-500/40 text-center relative overflow-hidden shadow-2xl">
            <span class="text-xs uppercase font-extrabold tracking-widest text-[#3ef4a1] mb-2 block">
              Plataforma Oficial para Fotógrafos
            </span>
            <h3 class="text-2xl font-black text-white mb-3">
              ¿Listo para vender tus fotos de eventos en minutos?
            </h3>
            <p class="text-sm text-gray-300 max-w-xl mx-auto mb-6 leading-relaxed">
              Crea tu cuenta de fotógrafo, sube tus álbumes con reconocimiento facial por IA y recibe pagos directos con Mercado Pago en tu moneda local.
            </p>
            <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
              <NuxtLink
                to="/photographer-access"
                class="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#3ef4a1] text-black font-extrabold text-xs sm:text-sm hover:bg-[#2dd68a] transition-all hover:scale-105 shadow-lg shadow-[#3ef4a1]/20"
              >
                Crear Cuenta de Fotógrafo Gratis
              </NuxtLink>
              <NuxtLink
                to="/marketplace"
                class="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/10 text-white font-bold text-xs sm:text-sm hover:bg-white/20 transition-all border border-white/10"
              >
                Explorar Galerías
              </NuxtLink>
            </div>
          </div>

          <!-- Tags Cloud -->
          <div class="pt-6 border-t border-white/10 flex flex-wrap items-center gap-2">
            <span class="text-xs text-gray-400 font-semibold mr-1">Temas relacionados:</span>
            <span
              v-for="tag in article.keywords"
              :key="tag"
              class="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300 font-medium"
            >
              #{{ tag }}
            </span>
          </div>
        </article>

        <!-- Sticky Sidebar (4 cols) -->
        <aside class="lg:col-span-4 space-y-6">
          <!-- Table of Contents -->
          <div v-if="article.toc && article.toc.length > 0" class="p-6 rounded-2xl bg-white/[0.03] border border-white/10 sticky top-24">
            <h4 class="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-2">
              <Icon name="lucide:list" class="w-4 h-4 text-[#3ef4a1]" />
              <span>En este artículo</span>
            </h4>
            <nav class="space-y-2">
              <a
                v-for="item in article.toc"
                :key="item.id"
                :href="`#${item.id}`"
                class="block text-xs text-gray-400 hover:text-[#3ef4a1] transition-colors leading-relaxed py-1 border-l-2 border-transparent hover:border-[#3ef4a1] pl-3"
              >
                {{ item.title }}
              </a>
            </nav>

            <!-- Quick Pro CTA inside sidebar -->
            <div class="mt-8 pt-6 border-t border-white/10 text-center">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/10 text-[#3ef4a1] flex items-center justify-center mx-auto mb-3">
                <Icon name="lucide:camera" class="w-5 h-5" />
              </div>
              <p class="text-xs font-bold text-white mb-1">Moments Pro para Fotógrafos</p>
              <p class="text-[11px] text-gray-400 mb-4">Gana hasta el 90% neto de cada foto vendida.</p>
              <NuxtLink
                to="/photographer-access"
                class="block w-full py-2.5 rounded-xl bg-[#3ef4a1] text-black font-extrabold text-xs hover:bg-[#2dd68a] transition-colors"
              >
                Postularme Gratis
              </NuxtLink>
            </div>
          </div>
        </aside>
      </div>

      <!-- Related Articles Section -->
      <section v-if="relatedArticles.length > 0" class="max-w-6xl mx-auto mt-20 pt-12 border-t border-white/10">
        <div class="flex items-center justify-between mb-8">
          <div>
            <span class="text-xs text-emerald-400 uppercase font-bold tracking-wider">Continúa aprendiendo</span>
            <h3 class="text-2xl font-black text-white mt-1">Guías Relacionadas</h3>
          </div>
          <NuxtLink to="/blog" class="text-xs font-bold text-emerald-400 hover:underline flex items-center gap-1">
            <span>Ver todo el blog</span>
            <Icon name="lucide:arrow-right" class="w-3.5 h-3.5" />
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="rel in relatedArticles"
            :key="rel.slug"
            :to="`/blog/${rel.slug}`"
            class="p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition-all hover:-translate-y-1 group"
          >
            <span class="text-[10px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 mb-3 inline-block">
              {{ rel.category }}
            </span>
            <h4 class="text-sm font-bold text-white group-hover:text-[#3ef4a1] transition-colors mb-2 leading-snug">
              {{ rel.title }}
            </h4>
            <p class="text-xs text-gray-400 line-clamp-2 leading-relaxed">
              {{ rel.subtitle }}
            </p>
          </NuxtLink>
        </div>
      </section>
    </main>

    <!-- 404 Fallback -->
    <main v-else class="flex-1 max-w-xl mx-auto px-4 py-24 text-center">
      <Icon name="lucide:file-question" class="w-16 h-16 mx-auto mb-4 text-emerald-400 opacity-60" />
      <h1 class="text-2xl font-black text-white mb-2">Artículo no encontrado</h1>
      <p class="text-sm text-gray-400 mb-6">El artículo que estás buscando no existe o fue reubicado.</p>
      <NuxtLink to="/blog" class="px-6 py-3 rounded-xl bg-[#3ef4a1] text-black font-bold text-sm">
        Volver al Blog
      </NuxtLink>
    </main>

    <!-- Footer -->
    <footer class="relative z-10 border-t border-white/10 bg-black/60 py-8 text-xs text-gray-500 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p>© 2026 Moments App. Plataforma de Fotografía de Eventos en Latinoamérica.</p>
        <div class="flex items-center gap-4">
          <NuxtLink to="/blog" class="hover:text-white transition-colors">Blog</NuxtLink>
          <NuxtLink to="/photographer-access" class="hover:text-white transition-colors">Fotógrafos Pro</NuxtLink>
          <NuxtLink to="/privacy" class="hover:text-white transition-colors">Privacidad</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { getArticleBySlug, getRelatedArticles } from '~/data/blogArticles'

definePageMeta({ layout: false })

const route = useRoute()
const slug = computed(() => route.params.slug)
const article = computed(() => getArticleBySlug(slug.value))
const relatedArticles = computed(() => (article.value ? getRelatedArticles(article.value.slug, 3) : []))

const copied = ref(false)
const readingProgress = ref(0)

function handleScroll() {
  if (typeof window === 'undefined') return
  const docElement = document.documentElement
  const scrollTop = window.pageYOffset || docElement.scrollTop
  const scrollHeight = docElement.scrollHeight - docElement.clientHeight
  if (scrollHeight > 0) {
    readingProgress.value = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100))
  }
}

onMounted(() => {
  if (typeof window !== 'undefined') {
    window.addEventListener('scroll', handleScroll, { passive: true })
  }
})

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('scroll', handleScroll)
  }
})

function copyArticleLink() {
  if (typeof window === 'undefined') return
  navigator.clipboard.writeText(window.location.href)
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2500)
}

const currentUrl = computed(() => {
  return `https://www.moments-gallery.com/blog/${slug.value}`
})

const whatsappShareUrl = computed(() => {
  if (!article.value) return '#'
  const text = encodeURIComponent(`Mira este artículo: "${article.value.title}" en Moments: ${currentUrl.value}`)
  return `https://wa.me/?text=${text}`
})

const twitterShareUrl = computed(() => {
  if (!article.value) return '#'
  const text = encodeURIComponent(`${article.value.title} vía @moments_app`)
  return `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(currentUrl.value)}`
})

if (article.value) {
  useSeoMeta({
    title: `${article.value.title} — Blog Moments`,
    description: article.value.metaDescription,
    keywords: article.value.keywords.join(', '),
    author: article.value.author.name,
    ogTitle: `${article.value.title} — Blog Moments`,
    ogDescription: article.value.metaDescription,
    ogUrl: currentUrl.value,
    ogType: 'article',
    ogImage: 'https://www.moments-gallery.com/logo.png',
    twitterCard: 'summary_large_image',
    twitterTitle: `${article.value.title} — Blog Moments`,
    twitterDescription: article.value.metaDescription,
    twitterImage: 'https://www.moments-gallery.com/logo.png'
  })

  useHead({
    link: [
      { rel: 'canonical', href: currentUrl.value }
    ],
    script: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BlogPosting',
          headline: article.value.title,
          description: article.value.metaDescription,
          datePublished: article.value.date,
          dateModified: article.value.lastModified,
          mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': currentUrl.value
          },
          author: {
            '@type': 'Person',
            name: article.value.author.name,
            jobTitle: article.value.author.role
          },
          publisher: {
            '@type': 'Organization',
            name: 'Moments App',
            logo: {
              '@type': 'ImageObject',
              url: 'https://www.moments-gallery.com/logo.png'
            }
          },
          keywords: article.value.keywords.join(', ')
        })
      },
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement: [
            {
              '@type': 'ListItem',
              position: 1,
              name: 'Inicio',
              item: 'https://www.moments-gallery.com'
            },
            {
              '@type': 'ListItem',
              position: 2,
              name: 'Blog',
              item: 'https://www.moments-gallery.com/blog'
            },
            {
              '@type': 'ListItem',
              position: 3,
              name: article.value.title,
              item: currentUrl.value
            }
          ]
        })
      }
    ]
  })
}
</script>

<style>
/* Article HTML Styles */
.article-body h2 {
  font-size: 1.65rem;
  font-weight: 800;
  color: #ffffff;
  margin-top: 2.5rem;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
  scroll-margin-top: 5rem;
}

.article-body h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #3ef4a1;
  margin-top: 1.75rem;
  margin-bottom: 0.75rem;
}

.article-body p {
  font-size: 0.975rem;
  line-height: 1.8;
  color: #d1d5db;
  margin-bottom: 1.25rem;
}

.article-body ul, .article-body ol {
  margin-bottom: 1.5rem;
  padding-left: 1.25rem;
  color: #d1d5db;
}

.article-body ul {
  list-style-type: disc;
}

.article-body ol {
  list-style-type: decimal;
}

.article-body li {
  margin-bottom: 0.5rem;
  line-height: 1.7;
}

.article-body strong {
  color: #ffffff;
  font-weight: 700;
}

.article-body em {
  color: #a7f3d0;
  font-style: italic;
}

.article-body .callout-box {
  padding: 1.25rem 1.5rem;
  background-color: rgba(62, 244, 161, 0.06);
  border-left: 4px solid #3ef4a1;
  border-radius: 0.75rem;
  margin: 1.75rem 0;
  font-size: 0.95rem;
  line-height: 1.7;
}
</style>
