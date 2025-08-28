let leafletPromise = null

export const loadLeaflet = async () => {
  if (leafletPromise) {
    return leafletPromise
  }

  leafletPromise = new Promise(async (resolve, reject) => {
    try {
      // Load Leaflet CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        await new Promise((resolveCSS) => {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css'
          link.crossOrigin = ''
          link.onload = resolveCSS
          link.onerror = () => {
            // Fallback to unpkg if cdnjs fails
            const fallbackLink = document.createElement('link')
            fallbackLink.rel = 'stylesheet'
            fallbackLink.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
            fallbackLink.crossOrigin = ''
            fallbackLink.onload = resolveCSS
            fallbackLink.onerror = reject
            document.head.appendChild(fallbackLink)
          }
          document.head.appendChild(link)
        })
      }

      // Load Leaflet JS
      if (typeof window.L === 'undefined') {
        await new Promise((resolveJS, rejectJS) => {
          const script = document.createElement('script')
          script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'
          script.crossOrigin = ''
          script.onload = resolveJS
          script.onerror = () => {
            // Fallback to unpkg if cdnjs fails
            const fallbackScript = document.createElement('script')
            fallbackScript.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
            fallbackScript.crossOrigin = ''
            fallbackScript.onload = resolveJS
            fallbackScript.onerror = rejectJS
            document.head.appendChild(fallbackScript)
          }
          document.head.appendChild(script)
        })
      }

      // Wait for script to be fully loaded
      await new Promise(resolve => setTimeout(resolve, 200))
      
      resolve(window.L)
    } catch (error) {
      reject(error)
    }
  })

  return leafletPromise
}

export const isLeafletLoaded = () => {
  return typeof window.L !== 'undefined'
}
