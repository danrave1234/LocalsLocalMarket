let leafletPromise = null
let markerClusterPromise = null

// Cache for loaded resources to prevent duplicate loading
const loadedResources = new Set()
const failedResources = new Set()

function loadLinkWithFallbacks(urls, resourceType = 'leaflet') {
  return new Promise((resolve, reject) => {
    const tryNext = (index) => {
      if (index >= urls.length) {
        const error = new Error(`Failed to load ${resourceType} CSS from all CDNs`)
        console.error(`[leafletLoader] All CDNs failed for ${resourceType} CSS`)
        reject(error)
        return
      }
      const href = urls[index]
      
      // Check if already loaded or failed
      if (loadedResources.has(href)) {
        resolve()
        return
      }
      if (failedResources.has(href)) {
        tryNext(index + 1)
        return
      }
      
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = href
      link.crossOrigin = 'anonymous'
      link.dataset[`${resourceType}Css`] = 'true'
      
      link.onload = () => {
        loadedResources.add(href)
        console.log(`[leafletLoader] Successfully loaded CSS: ${href}`)
        resolve()
      }
      
      link.onerror = () => {
        failedResources.add(href)
        console.warn(`[leafletLoader] CSS failed: ${href}. Trying next CDN...`)
        tryNext(index + 1)
      }
      
      // Add timeout for individual requests
      setTimeout(() => {
        if (!loadedResources.has(href) && !failedResources.has(href)) {
          failedResources.add(href)
          console.warn(`[leafletLoader] CSS timeout: ${href}`)
          tryNext(index + 1)
        }
      }, 5000)
      
      document.head.appendChild(link)
    }
    tryNext(0)
  })
}

function loadScriptWithFallbacks(urls, resourceType = 'leaflet') {
  return new Promise((resolve, reject) => {
    const tryNext = (index) => {
      if (index >= urls.length) {
        const error = new Error(`Failed to load ${resourceType} JS from all CDNs`)
        console.error(`[leafletLoader] All CDNs failed for ${resourceType} JS`)
        reject(error)
        return
      }
      const src = urls[index]
      
      // Check if already loaded or failed
      if (loadedResources.has(src)) {
        resolve()
        return
      }
      if (failedResources.has(src)) {
        tryNext(index + 1)
        return
      }
      
      const script = document.createElement('script')
      script.src = src
      script.crossOrigin = 'anonymous'
      script.async = true
      script.defer = true
      script.dataset[`${resourceType}Js`] = 'true'
      
      script.onload = () => {
        loadedResources.add(src)
        console.log(`[leafletLoader] Successfully loaded JS: ${src}`)
        resolve()
      }
      
      script.onerror = () => {
        failedResources.add(src)
        console.warn(`[leafletLoader] JS failed: ${src}. Trying next CDN...`)
        tryNext(index + 1)
      }
      
      // Add timeout for individual requests
      setTimeout(() => {
        if (!loadedResources.has(src) && !failedResources.has(src)) {
          failedResources.add(src)
          console.warn(`[leafletLoader] JS timeout: ${src}`)
          tryNext(index + 1)
        }
      }, 8000) // Longer timeout for JS files
      
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
      console.log('[leafletLoader] Starting Leaflet loading process...')
      
      // Load CSS with improved error handling
      if (!document.querySelector('link[data-leafletCss]')) {
        console.log('[leafletLoader] Loading Leaflet CSS...')
        await loadLinkWithFallbacks(cssCDNs, 'leaflet')
      } else {
        console.log('[leafletLoader] Leaflet CSS already loaded')
      }
      
      // Load JS with improved error handling
      if (typeof window.L === 'undefined' && !document.querySelector('script[data-leafletJs]')) {
        console.log('[leafletLoader] Loading Leaflet JS...')
        await loadScriptWithFallbacks(jsCDNs, 'leaflet')
      } else {
        console.log('[leafletLoader] Leaflet JS already loaded')
      }
      
      // Enhanced validation with better error messages
      const start = Date.now()
      let retries = 0
      const maxRetries = 20 // Increased retries
      const timeout = 15000 // Increased timeout
      
      while (typeof window.L === 'undefined' && retries < maxRetries) {
        if (Date.now() - start > timeout) {
          throw new Error(`Leaflet did not initialize within ${timeout}ms timeout`)
        }
        await new Promise(r => setTimeout(r, 150)) // Slightly longer delay
        retries++
        
        if (retries % 5 === 0) {
          console.log(`[leafletLoader] Waiting for Leaflet... (${retries}/${maxRetries})`)
        }
      }
      
      if (typeof window.L === 'undefined') {
        throw new Error(`Leaflet failed to initialize after ${retries} retries`)
      }
      
      // Enhanced validation
      const requiredMethods = ['map', 'tileLayer', 'marker', 'divIcon', 'latLng']
      const missingMethods = requiredMethods.filter(method => !window.L[method])
      
      if (missingMethods.length > 0) {
        throw new Error(`Leaflet missing required methods: ${missingMethods.join(', ')}`)
      }
      
      console.log('[leafletLoader] Leaflet loaded successfully')
      return window.L
    } catch (e) {
      console.error('[leafletLoader] Failed to load Leaflet:', e)
      // Clear failed resources to allow retry
      failedResources.clear()
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
      console.log('[leafletLoader] Starting MarkerCluster loading process...')
      
      // Ensure Leaflet is ready first
      await loadLeaflet()
      console.log('[leafletLoader] Leaflet ready, loading MarkerCluster...')

      // Load CSS with fallback mechanism
      if (!document.querySelector('link[data-markerclusterCss]')) {
        console.log('[leafletLoader] Loading MarkerCluster CSS...')
        await loadLinkWithFallbacks(cssCDNs, 'markercluster')
      } else {
        console.log('[leafletLoader] MarkerCluster CSS already loaded')
      }
      
      if (!document.querySelector('link[data-markerclusterDefaultCss]')) {
        console.log('[leafletLoader] Loading MarkerCluster Default CSS...')
        await loadLinkWithFallbacks(cssDefaultCDNs, 'markerclusterDefault')
      } else {
        console.log('[leafletLoader] MarkerCluster Default CSS already loaded')
      }

      // Load JS with improved fallback mechanism
      if (typeof window.L !== 'undefined' && !window.L.markerClusterGroup && !document.querySelector('script[data-markerclusterJs]')) {
        console.log('[leafletLoader] Loading MarkerCluster JS...')
        await loadScriptWithFallbacks(jsCDNs, 'markercluster')
      } else {
        console.log('[leafletLoader] MarkerCluster JS already loaded')
      }

      // Enhanced verification with better error handling
      const start = Date.now()
      let retries = 0
      const maxRetries = 25 // Increased retries for plugin
      const timeout = 20000 // Increased timeout for plugin
      
      while (!window.L.markerClusterGroup && retries < maxRetries) {
        if (Date.now() - start > timeout) {
          throw new Error(`MarkerCluster did not initialize within ${timeout}ms timeout`)
        }
        await new Promise(r => setTimeout(r, 200)) // Longer delay for plugin
        retries++
        
        if (retries % 5 === 0) {
          console.log(`[leafletLoader] Waiting for MarkerCluster... (${retries}/${maxRetries})`)
        }
      }

      if (!window.L.markerClusterGroup) {
        throw new Error(`MarkerCluster failed to initialize after ${retries} retries`)
      }
      
      // Enhanced validation for MarkerCluster
      if (typeof window.L.markerClusterGroup !== 'function') {
        throw new Error('MarkerCluster not properly loaded - markerClusterGroup is not a function')
      }
      
      console.log('[leafletLoader] MarkerCluster loaded successfully')
      return window.L
    } catch (e) {
      console.error('[leafletLoader] Failed to load MarkerCluster:', e)
      // Clear failed resources to allow retry
      failedResources.clear()
      markerClusterPromise = null
      throw e
    }
  })()

  return markerClusterPromise
}

export const isLeafletLoaded = () => typeof window.L !== 'undefined'

// Enhanced utility functions for better resource management
export const isMarkerClusterLoaded = () => {
  return typeof window.L !== 'undefined' && 
         typeof window.L.markerClusterGroup === 'function'
}

export const getLoadedResources = () => {
  return {
    loaded: Array.from(loadedResources),
    failed: Array.from(failedResources),
    leaflet: isLeafletLoaded(),
    markerCluster: isMarkerClusterLoaded()
  }
}

export const clearResourceCache = () => {
  loadedResources.clear()
  failedResources.clear()
  leafletPromise = null
  markerClusterPromise = null
  console.log('[leafletLoader] Resource cache cleared')
}

export const retryFailedResources = async () => {
  console.log('[leafletLoader] Retrying failed resources...')
  clearResourceCache()
  try {
    await loadLeaflet()
    await loadMarkerCluster()
    console.log('[leafletLoader] Failed resources retry successful')
    return true
  } catch (error) {
    console.error('[leafletLoader] Failed resources retry failed:', error)
    return false
  }
}

// Health check function
export const performHealthCheck = () => {
  const health = {
    leaflet: isLeafletLoaded(),
    markerCluster: isMarkerClusterLoaded(),
    resources: getLoadedResources(),
    timestamp: new Date().toISOString()
  }
  
  console.log('[leafletLoader] Health check:', health)
  return health
}
