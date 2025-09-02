let leafletPromise = null

function loadLinkWithFallbacks(urls) {
  return new Promise((resolve, reject) => {
    const tryNext = (index) => {
      if (index >= urls.length) {
        reject(new Error('Failed to load Leaflet CSS from all CDNs'))
        return
      }
      const href = urls[index]
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      link.crossOrigin = 'anonymous'
      link.dataset.leafletCss = 'true'
      link.onload = resolve
      link.onerror = () => {
        console.warn(`[leafletLoader] CSS failed: ${href}. Trying next CDN...`)
        tryNext(index + 1)
      }
      document.head.appendChild(link)
    }
    tryNext(0)
  })
}

function loadScriptWithFallbacks(urls) {
  return new Promise((resolve, reject) => {
    const tryNext = (index) => {
      if (index >= urls.length) {
        reject(new Error('Failed to load Leaflet JS from all CDNs'))
        return
      }
      const src = urls[index]
      const script = document.createElement('script')
      script.src = src
      script.crossOrigin = 'anonymous'
      script.async = true
      script.defer = true
      script.dataset.leafletJs = 'true'
      script.onload = resolve
      script.onerror = () => {
        console.warn(`[leafletLoader] JS failed: ${src}. Trying next CDN...`)
        tryNext(index + 1)
      }
      document.head.appendChild(script)
    }
    tryNext(0)
  })
}

export const loadLeaflet = async () => {
  if (leafletPromise) return leafletPromise

  const cssCDNs = [
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css'
  ]
  const jsCDNs = [
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js'
  ]

  leafletPromise = (async () => {
    try {
      // Load CSS once
      if (!document.querySelector('link[data-leaflet-css]')) {
        await loadLinkWithFallbacks(cssCDNs)
      }

      // Load JS once
      if (typeof window.L === 'undefined' && !document.querySelector('script[data-leaflet-js]')) {
        await loadScriptWithFallbacks(jsCDNs)
      }

      // Wait until window.L is available (with timeout and retry)
      const start = Date.now()
      let retries = 0
      const maxRetries = 10
      
      while (typeof window.L === 'undefined' && retries < maxRetries) {
        if (Date.now() - start > 10000) {
          throw new Error('Leaflet did not initialize within timeout')
        }
        await new Promise(r => setTimeout(r, 100))
        retries++
      }
      
      if (typeof window.L === 'undefined') {
        throw new Error('Leaflet failed to initialize after multiple retries')
      }
      
      // Additional check to ensure Leaflet is fully loaded
      if (!window.L.map) {
        throw new Error('Leaflet map function not available')
      }
      
      return window.L
    } catch (e) {
      console.error('[leafletLoader] Failed to load Leaflet:', e)
      // Reset promise on error to allow retry
      leafletPromise = null
      throw e
    }
  })()

  return leafletPromise
}

export const isLeafletLoaded = () => typeof window.L !== 'undefined'
