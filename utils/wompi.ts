/**
 * Helper utility to ensure the Wompi WidgetCheckout script is fully loaded and available.
 */
export async function getWompiWidget(): Promise<any> {
  if (typeof window === 'undefined') return null

  // If already loaded globally
  if ((window as any).WidgetCheckout) {
    return (window as any).WidgetCheckout
  }

  return new Promise((resolve, reject) => {
    if ((window as any).WidgetCheckout) {
      return resolve((window as any).WidgetCheckout)
    }

    let script = document.querySelector('script[src="https://checkout.wompi.co/widget.js"]') as HTMLScriptElement

    if (!script) {
      script = document.createElement('script')
      script.src = 'https://checkout.wompi.co/widget.js'
      script.async = true
      document.head.appendChild(script)
    }

    const checkInterval = setInterval(() => {
      if ((window as any).WidgetCheckout) {
        clearInterval(checkInterval)
        clearTimeout(timer)
        resolve((window as any).WidgetCheckout)
      }
    }, 150)

    const timer = setTimeout(() => {
      clearInterval(checkInterval)
      if ((window as any).WidgetCheckout) {
        resolve((window as any).WidgetCheckout)
      } else {
        if (script && script.parentNode) {
          script.parentNode.removeChild(script)
        }
        resolve(null)
      }
    }, 2000)

    script.addEventListener('load', () => {
      setTimeout(() => {
        if ((window as any).WidgetCheckout) {
          clearInterval(checkInterval)
          clearTimeout(timer)
          resolve((window as any).WidgetCheckout)
        }
      }, 50)
    }, { once: true })

    script.addEventListener('error', () => {
      clearInterval(checkInterval)
      clearTimeout(timer)
      if (script && script.parentNode) {
        script.parentNode.removeChild(script)
      }
      resolve(null)
    }, { once: true })
  })
}

export function buildWompiWebCheckoutUrl(data: {
  publicKey: string
  currency?: string
  amountInCents: number | string
  reference: string
  signature?: string
  redirectUrl?: string
  customerEmail?: string
}): string {
  const url = new URL('https://checkout.wompi.co/p/')
  url.searchParams.set('public-key', data.publicKey)
  url.searchParams.set('currency', data.currency || 'COP')
  url.searchParams.set('amount-in-cents', String(data.amountInCents))
  url.searchParams.set('reference', data.reference)
  if (data.signature) {
    url.searchParams.set('signature:integrity', data.signature)
  }
  if (data.redirectUrl) {
    url.searchParams.set('redirect-url', data.redirectUrl)
  }
  if (data.customerEmail) {
    url.searchParams.set('customer-data:email', data.customerEmail)
  }
  return url.toString()
}
