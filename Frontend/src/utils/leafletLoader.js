let leafletPromise = null
let markerClusterPromise = null

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
      if (!document.querySelector('link[data-leaflet-css]')) {
        await loadLinkWithFallbacks(cssCDNs)
      }
      if (typeof window.L === 'undefined' && !document.querySelector('script[data-leaflet-js]')) {
        await loadScriptWithFallbacks(jsCDNs)
      }
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
      if (!window.L.map) {
        throw new Error('Leaflet map function not available')
      }
      return window.L
    } catch (e) {
      console.error('[leafletLoader] Failed to load Leaflet:', e)
      leafletPromise = null
      throw e
    }
  })()

  return leafletPromise
}

export const loadMarkerCluster = async () => {
  if (markerClusterPromise) return markerClusterPromise

  const cssCDNs = [
    'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css',
    'https://cdn.jsdelivr.net/npm/leaflet.markercluster@1.5.3/dist/MarkerCluster.css',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.css'
  ]
  const cssDefaultCDNs = [
    'https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css',
    'https://cdn.jsdelivr.net/npm/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/MarkerCluster.Default.css'
  ]
  const jsCDNs = [
    'https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js',
    'https://cdn.jsdelivr.net/npm/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js',
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.3/leaflet.markercluster.js'
  ]

  markerClusterPromise = (async () => {
    try {
      // Ensure Leaflet is ready first
      await loadLeaflet()

      // Load CSS once (two stylesheets required)
      if (!document.querySelector('link[data-markercluster-css]')) {
        const mark = document.createElement('link')
        mark.rel = 'stylesheet'
        mark.href = cssCDNs[0]
        mark.dataset.markerclusterCss = 'true'
        document.head.appendChild(mark)
      }
      if (!document.querySelector('link[data-markercluster-default-css]')) {
        const markDefault = document.createElement('link')
        markDefault.rel = 'stylesheet'
        markDefault.href = cssDefaultCDNs[0]
        markDefault.dataset.markerclusterDefaultCss = 'true'
        document.head.appendChild(markDefault)
      }

      // Load JS with fallbacks
      if (typeof window.L !== 'undefined' && !window.L.markerClusterGroup && !document.querySelector('script[data-markercluster-js]')) {
        await new Promise((resolve, reject) => {
          const tryNext = (i) => {
            if (i >= jsCDNs.length) {
              reject(new Error('Failed to load MarkerCluster JS'))
              return
            }
            const script = document.createElement('script')
            script.src = jsCDNs[i]
            script.crossOrigin = 'anonymous'
            script.async = true
            script.defer = true
            script.dataset.markerclusterJs = 'true'
            script.onload = resolve
            script.onerror = () => tryNext(i + 1)
            document.head.appendChild(script)
          }
          tryNext(0)
        })
      }

      // Verify plugin loaded
      const start = Date.now()
      while (!window.L.markerClusterGroup) {
        if (Date.now() - start > 10000) {
          throw new Error('MarkerCluster did not initialize within timeout')
        }
        await new Promise(r => setTimeout(r, 100))
      }

      return window.L
    } catch (e) {
      console.error('[leafletLoader] Failed to load MarkerCluster:', e)
      markerClusterPromise = null
      throw e
    }
  })()

  return markerClusterPromise
}

export const isLeafletLoaded = () => typeof window.L !== 'undefined'
