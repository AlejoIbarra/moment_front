export interface ViralStoryOptions {
  imageUrl?: string
  eventTitle?: string
  photographerUsername?: string
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function loadImageWithCors(url: string): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => resolve(null)
    img.src = url
  })
}

/**
 * Generates a 1080x1920 (9:16) viral Instagram Story / WhatsApp Status PNG card
 * using Moments' Obsidian Black + Electric Green (#3EF4A1) brand identity.
 */
export async function generateViralStoryBlob(options: ViralStoryOptions): Promise<Blob | null> {
  if (!process.client) return null

  const W = 1080
  const H = 1920
  const canvas = document.createElement('canvas')
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  // 1. Deep Obsidian background
  ctx.fillStyle = '#07070a'
  ctx.fillRect(0, 0, W, H)

  // 2. Subtle Electric Green (#3EF4A1) ambient radial glows
  const topGlow = ctx.createRadialGradient(W * 0.8, H * 0.12, 40, W * 0.8, H * 0.12, 620)
  topGlow.addColorStop(0, 'rgba(62, 244, 161, 0.24)')
  topGlow.addColorStop(1, 'rgba(7, 7, 10, 0)')
  ctx.fillStyle = topGlow
  ctx.fillRect(0, 0, W, H)

  const bottomGlow = ctx.createRadialGradient(W * 0.2, H * 0.88, 40, W * 0.2, H * 0.88, 560)
  bottomGlow.addColorStop(0, 'rgba(7, 182, 103, 0.20)')
  bottomGlow.addColorStop(1, 'rgba(7, 7, 10, 0)')
  ctx.fillStyle = bottomGlow
  ctx.fillRect(0, 0, W, H)

  // 3. Top Header: MOMENTS wordmark + Verified HD pill
  ctx.fillStyle = '#3ef4a1'
  ctx.font = 'italic 900 72px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText('Moments', 84, 165)

  // Pill badge on top-right
  drawRoundedRect(ctx, W - 340, 112, 256, 62, 31)
  ctx.fillStyle = 'rgba(62, 244, 161, 0.14)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(62, 244, 161, 0.45)'
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.fillStyle = '#3ef4a1'
  ctx.font = '800 24px "Plus Jakarta Sans", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('ORIGINAL HD ✓', W - 212, 152)

  // 4. Center Photo Frame
  const frameX = 76
  const frameY = 250
  const frameW = W - 152
  const frameH = 1140

  ctx.save()
  drawRoundedRect(ctx, frameX, frameY, frameW, frameH, 44)
  ctx.fillStyle = '#111116'
  ctx.fill()
  ctx.clip()

  const img = options.imageUrl ? await loadImageWithCors(options.imageUrl) : null
  if (img && img.naturalWidth > 0 && img.naturalHeight > 0) {
    // Cover-fit image cleanly inside the rounded frame
    const imgRatio = img.naturalWidth / img.naturalHeight
    const boxRatio = frameW / frameH
    let drawW = frameW
    let drawH = frameH
    let offsetX = frameX
    let offsetY = frameY

    if (imgRatio > boxRatio) {
      drawH = frameH
      drawW = frameH * imgRatio
      offsetX = frameX - (drawW - frameW) / 2
    } else {
      drawW = frameW
      drawH = frameW / imgRatio
      offsetY = frameY - (drawH - frameH) / 2
    }
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH)
  } else {
    // Stylized fallback graphic if image fails CORS
    ctx.fillStyle = '#18181b'
    ctx.fillRect(frameX, frameY, frameW, frameH)
    ctx.fillStyle = '#3ef4a1'
    ctx.font = '900 56px "Plus Jakarta Sans", sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('MI MOMENTO EN HD', W / 2, frameY + frameH / 2)
  }

  // Subtle bottom gradient inside frame for legibility
  const innerGrad = ctx.createLinearGradient(0, frameY + frameH - 280, 0, frameY + frameH)
  innerGrad.addColorStop(0, 'rgba(7, 7, 10, 0)')
  innerGrad.addColorStop(1, 'rgba(7, 7, 10, 0.82)')
  ctx.fillStyle = innerGrad
  ctx.fillRect(frameX, frameY + frameH - 280, frameW, 280)

  // Bottom-left caption inside frame
  const titleText = (options.eventTitle || 'Mi Momento en HD').slice(0, 38)
  ctx.fillStyle = '#ffffff'
  ctx.font = '800 44px "Plus Jakarta Sans", sans-serif'
  ctx.textAlign = 'left'
  ctx.fillText(titleText, frameX + 44, frameY + frameH - 96)

  if (options.photographerUsername) {
    ctx.fillStyle = '#3ef4a1'
    ctx.font = '700 30px "Plus Jakarta Sans", sans-serif'
    ctx.fillText(`📸 Foto por @${options.photographerUsername}`, frameX + 44, frameY + frameH - 46)
  }
  ctx.restore()

  // Crisp neon border around photo frame
  drawRoundedRect(ctx, frameX, frameY, frameW, frameH, 44)
  ctx.strokeStyle = 'rgba(62, 244, 161, 0.35)'
  ctx.lineWidth = 3
  ctx.stroke()

  // 5. Viral CTA Footer
  ctx.fillStyle = '#ffffff'
  ctx.font = '800 40px "Plus Jakarta Sans", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Encontré mis fotos en segundos con IA', W / 2, 1515)

  ctx.fillStyle = '#a1a1aa'
  ctx.font = '600 28px "Plus Jakarta Sans", sans-serif'
  ctx.fillText('Sube una selfie o busca tu dorsal en', W / 2, 1572)

  // Website Pill CTA
  drawRoundedRect(ctx, W / 2 - 330, 1620, 660, 96, 48)
  ctx.fillStyle = '#3ef4a1'
  ctx.fill()

  ctx.fillStyle = '#07070a'
  ctx.font = '900 34px "Plus Jakarta Sans", sans-serif'
  ctx.fillText('moments-gallery.com', W / 2, 1680)

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), 'image/png', 0.95)
  })
}

export async function shareOrDownloadViralStory(options: ViralStoryOptions): Promise<'shared' | 'downloaded' | 'error'> {
  try {
    const blob = await generateViralStoryBlob(options)
    if (!blob) return 'error'

    const file = new File([blob], 'Moments-Story.png', { type: 'image/png' })
    const shareText = options.photographerUsername
      ? `¡Encontré mis fotos en HD en Moments! 📸 @${options.photographerUsername} · https://www.moments-gallery.com`
      : '¡Encontré mis fotos en HD en Moments! https://www.moments-gallery.com'

    if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        title: 'Mi Momento en HD — Moments',
        text: shareText,
        files: [file]
      })
      return 'shared'
    }

    // Fallback: direct PNG download ready to post on Instagram Stories / WhatsApp Status
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'Moments-Story.png'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => URL.revokeObjectURL(url), 5000)
    return 'downloaded'
  } catch (err: any) {
    if (err?.name === 'AbortError') return 'shared'
    console.error('Error generating viral story card:', err)
    return 'error'
  }
}
