/**
 * Helper utility to ensure the Wompi WidgetCheckout script is fully loaded and available.
 */
export async function getWompiWidget(): Promise<any> {
  if (typeof window === 'undefined') return null

  // If already loaded globally
  if ((window as any).WidgetCheckout) {
    return (window as any).WidgetCheckout
  }

  // Find or create script element
  return new Promise((resolve, reject) => {
    let script = document.querySelector('script[src="https://checkout.wompi.co/widget.js"]') as HTMLScriptElement

    if (!script) {
      script = document.createElement('script')
      script.src = 'https://checkout.wompi.co/widget.js'
      script.async = true
      document.head.appendChild(script)
    }

    const onScriptLoad = () => {
      if ((window as any).WidgetCheckout) {
        resolve((window as any).WidgetCheckout)
      } else {
        // Give 100ms grace period for constructor assignment
        setTimeout(() => {
          if ((window as any).WidgetCheckout) {
            resolve((window as any).WidgetCheckout)
          } else {
            reject(new Error('WidgetCheckout no está disponible en window.'))
          }
        }, 100)
      }
    }

    if ((window as any).WidgetCheckout) {
      return resolve((window as any).WidgetCheckout)
    }

    script.addEventListener('load', onScriptLoad, { once: true })
    script.addEventListener('error', (e) => {
      reject(new Error('Error al cargar https://checkout.wompi.co/widget.js. Verifica tu conexión.'))
    }, { once: true })

    // Timeout safety fallback (8 seconds)
    setTimeout(() => {
      if ((window as any).WidgetCheckout) {
        resolve((window as any).WidgetCheckout)
      } else {
        reject(new Error('Tiempo de espera agotado al conectar con Wompi.'))
      }
    }, 8000)
  })
}
