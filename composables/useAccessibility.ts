import { ref, watch, onMounted } from 'vue'

const highContrast = ref(false)
const largeText = ref(false)
const dyslexicFont = ref(false)
const reducedMotion = ref(false)
const highlightLinks = ref(false)
const isOpen = ref(false)

export function useAccessibility() {
  function applyClasses() {
    if (typeof document === 'undefined') return
    const root = document.documentElement

    root.classList.toggle('a11y-high-contrast', highContrast.value)
    root.classList.toggle('a11y-large-text', largeText.value)
    root.classList.toggle('a11y-dyslexic-font', dyslexicFont.value)
    root.classList.toggle('a11y-reduced-motion', reducedMotion.value)
    root.classList.toggle('a11y-highlight-links', highlightLinks.value)
  }

  function savePreferences() {
    if (typeof localStorage === 'undefined') return
    const prefs = {
      highContrast: highContrast.value,
      largeText: largeText.value,
      dyslexicFont: dyslexicFont.value,
      reducedMotion: reducedMotion.value,
      highlightLinks: highlightLinks.value
    }
    localStorage.setItem('moments_accessibility_prefs', JSON.stringify(prefs))
    applyClasses()
  }

  function loadPreferences() {
    if (typeof localStorage === 'undefined') return
    try {
      const saved = localStorage.getItem('moments_accessibility_prefs')
      if (saved) {
        const prefs = JSON.parse(saved)
        highContrast.value = !!prefs.highContrast
        largeText.value = !!prefs.largeText
        dyslexicFont.value = !!prefs.dyslexicFont
        reducedMotion.value = !!prefs.reducedMotion
        highlightLinks.value = !!prefs.highlightLinks
      }
    } catch (e) {
      console.error('Error loading a11y preferences', e)
    }
    applyClasses()
  }

  function resetPreferences() {
    highContrast.value = false
    largeText.value = false
    dyslexicFont.value = false
    reducedMotion.value = false
    highlightLinks.value = false
    savePreferences()
  }

  return {
    highContrast,
    largeText,
    dyslexicFont,
    reducedMotion,
    highlightLinks,
    isOpen,
    applyClasses,
    savePreferences,
    loadPreferences,
    resetPreferences
  }
}
