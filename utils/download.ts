/**
 * Utility for triggering robust browser file downloads.
 * 
 * Works cleanly with Cloudflare R2 / AWS S3 presigned URLs that specify
 * response-content-disposition=attachment. Avoids fetch/blob CORS restrictions
 * and browser popup blockers across Chrome, Safari, Firefox, and mobile browsers.
 */

export function triggerDirectDownload(url: string, filename?: string): boolean {
  if (!url || typeof window === 'undefined') return false

  try {
    const cleanUrl = url.trim().replace(/^"+|"+$/g, '')
    const link = document.createElement('a')
    link.href = cleanUrl
    if (filename) {
      link.setAttribute('download', filename)
    }
    // Safari quirk: programmatic .click() on elements with `display: none` can be ignored.
    // We use off-screen absolute positioning so Safari/WebKit renders and triggers it reliably.
    link.style.position = 'fixed'
    link.style.left = '-9999px'
    link.style.top = '-9999px'
    link.style.opacity = '0'
    link.style.pointerEvents = 'none'

    document.body.appendChild(link)
    link.click()

    setTimeout(() => {
      if (link.parentNode) {
        link.parentNode.removeChild(link)
      }
    }, 1500)
    return true
  } catch (err) {
    console.error('Direct download failed:', err)
    if (typeof window !== 'undefined') {
      window.location.assign(url)
    }
    return false
  }
}

export async function downloadMultiplePhotos(
  items: Array<{ url: string; filename?: string }>,
  delayMs = 600
): Promise<void> {
  if (!items || !items.length) return

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item && item.url) {
      triggerDirectDownload(item.url, item.filename)
    }
    if (i < items.length - 1) {
      await new Promise(resolve => setTimeout(resolve, delayMs))
    }
  }
}
