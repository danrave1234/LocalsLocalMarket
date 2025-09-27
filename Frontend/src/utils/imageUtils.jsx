// Image utility functions
import React from 'react'
import { API_BASE } from '../api/client.js'

// Enhanced cache management
const IMAGE_CACHE = new Map()
const FAILED_IMAGES = new Set()

// Generate a more intelligent cache-buster that updates when needed
const getCacheBuster = () => {
  if (typeof window === 'undefined') return '0'
  
  // Use a combination of session start time and current hour to balance caching vs freshness
  const sessionStart = window.__LLM_IMG_SESSION_TOKEN ||= String(Date.now())
  const currentHour = Math.floor(Date.now() / (1000 * 60 * 60)) // Changes every hour
  return `${sessionStart}_${currentHour}`
}

/**
 * Get the full URL for an image path with enhanced caching
 * - Accepts absolute URLs, /uploads/**, uploads/**, and bare filenames
 * - Normalizes to the backend origin (API_BASE without /api)
 * - Smart cache-busting for uploads while preserving cache for static assets
 * @param {string} path - The image path from the database
 * @param {Object} options - Options for URL generation
 * @param {boolean} options.forceRefresh - Force refresh the image (bypass cache)
 * @param {boolean} options.noCacheBuster - Skip cache buster (for static assets)
 * @returns {string} - The full URL to the image
 */
export function getImageUrl(path, options = {}) {
  if (!path) {
    return null
  }

  const raw = String(path).trim()
  const { forceRefresh = false, noCacheBuster = false } = options

  // Already absolute URL → return as is
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw
  }

  // Check if this image previously failed to load
  if (FAILED_IMAGES.has(raw) && !forceRefresh) {
    console.warn(`Image previously failed to load: ${raw}`)
    return getPlaceholderImage('error')
  }

  // Compute base URL safely (API_BASE may be undefined in some builds)
  const base = (typeof API_BASE === 'string' ? API_BASE : '').replace(/\/api$/, '')

  // Normalize leading slashes and common prefixes
  let normalized = raw.replace(/^\/+/, '') // drop leading slashes
  // If path already starts with uploads/, keep it; otherwise, if it starts with other folders, leave as is
  if (normalized.startsWith('uploads/')) {
    // ok
  } else if (normalized.startsWith('upload/')) {
    // rare typo fallback
    normalized = 'uploads/' + normalized.slice('upload/'.length)
  } else if (!normalized.startsWith('static/') && !normalized.startsWith('assets/') && !normalized.startsWith('images/')) {
    // Default to uploads folder when no known prefix
    normalized = `uploads/${normalized}`
  }

  // Build URL safely without breaking the scheme (avoid collapsing slashes in https://)
  let url = `${(base || '').replace(/\/$/, '')}/${normalized.replace(/^\/+/, '')}`

  // Add cache-buster for uploads (unless disabled or it's a static asset)
  const isUpload = url.includes('/uploads/')
  const isStatic = url.includes('/static/') || url.includes('/assets/') || url.includes('/images/')
  
  if (isUpload && !noCacheBuster) {
    const cacheBuster = forceRefresh ? Date.now() : getCacheBuster()
    url = `${url}${url.includes('?') ? '&' : '?'}v=${encodeURIComponent(cacheBuster)}`
  }

  return url
}

/**
 * Get a placeholder image URL
 * @param {string} type - The type of placeholder (e.g., 'shop', 'product', 'user')
 * @returns {string} - The placeholder image URL
 */
export function getPlaceholderImage(type = 'general') {
  return `https://via.placeholder.com/400x300/cccccc/666666?text=${encodeURIComponent(type.toUpperCase())}`
}

/**
 * Check if an image URL is valid
 * @param {string} url - The image URL to check
 * @returns {boolean} - True if the URL is valid
 */
export function isValidImageUrl(url) {
  if (!url) return false

  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Get image dimensions from URL (if available)
 * @param {string} url - The image URL
 * @returns {Promise<{width: number, height: number}>} - Image dimensions
 */
export function getImageDimensions(url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    img.src = url
  })
}

/**
 * Enhanced image loading with retry and fallback support
 * @param {string} src - The image source URL
 * @param {Object} options - Loading options
 * @param {number} options.maxRetries - Maximum retry attempts
 * @param {number} options.retryDelay - Delay between retries in ms
 * @param {string} options.fallbackSrc - Fallback image source
 * @returns {Promise<HTMLImageElement>} - Loaded image element
 */
export function loadImageWithRetry(src, options = {}) {
  const { maxRetries = 3, retryDelay = 1000, fallbackSrc = null } = options
  
  return new Promise((resolve, reject) => {
    const img = new Image()
    let retryCount = 0
    
    const attemptLoad = (currentSrc) => {
      img.onload = () => {
        console.log(`Successfully loaded image: ${currentSrc}`)
        resolve(img)
      }
      
      img.onerror = () => {
        console.warn(`Failed to load image: ${currentSrc} (attempt ${retryCount + 1})`)
        
        if (retryCount < maxRetries) {
          retryCount++
          console.log(`Retrying image load in ${retryDelay}ms...`)
          setTimeout(() => attemptLoad(currentSrc), retryDelay)
        } else if (fallbackSrc && currentSrc !== fallbackSrc) {
          console.log(`Trying fallback image: ${fallbackSrc}`)
          attemptLoad(fallbackSrc)
        } else {
          FAILED_IMAGES.add(src)
          reject(new Error(`Failed to load image after ${maxRetries} retries: ${src}`))
        }
      }
      
      img.src = currentSrc
    }
    
    attemptLoad(src)
  })
}

/**
 * Preload an image with caching
 * @param {string} src - The image source URL
 * @returns {Promise<HTMLImageElement>} - Preloaded image
 */
export function preloadImage(src) {
  // Check cache first
  if (IMAGE_CACHE.has(src)) {
    return Promise.resolve(IMAGE_CACHE.get(src))
  }
  
  return loadImageWithRetry(src, { maxRetries: 2 })
    .then(img => {
      IMAGE_CACHE.set(src, img)
      return img
    })
    .catch(error => {
      console.warn(`Failed to preload image: ${src}`, error)
      throw error
    })
}

/**
 * Clear image cache
 * @param {string} src - Optional specific image to clear, or clear all if not provided
 */
export function clearImageCache(src = null) {
  if (src) {
    IMAGE_CACHE.delete(src)
    FAILED_IMAGES.delete(src)
  } else {
    IMAGE_CACHE.clear()
    FAILED_IMAGES.clear()
  }
}

/**
 * Get cache statistics
 * @returns {Object} - Cache statistics
 */
export function getImageCacheStats() {
  return {
    cached: IMAGE_CACHE.size,
    failed: FAILED_IMAGES.size,
    cacheKeys: Array.from(IMAGE_CACHE.keys()),
    failedKeys: Array.from(FAILED_IMAGES.keys())
  }
}

/**
 * Enhanced image component with loading states and error handling
 * @param {Object} props - Image props
 * @param {string} props.src - Image source
 * @param {string} props.alt - Alt text
 * @param {Object} props.style - Styles
 * @param {Function} props.onLoad - Load callback
 * @param {Function} props.onError - Error callback
 * @param {string} props.fallback - Fallback image
 * @param {boolean} props.retryOnError - Whether to retry on error
 * @returns {React.Element} - Image element with enhanced loading
 */
export function EnhancedImage({ 
  src, 
  alt, 
  style = {}, 
  onLoad = null, 
  onError = null, 
  fallback = null,
  retryOnError = true,
  ...props 
}) {
  const [imageSrc, setImageSrc] = React.useState(src)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(false)
  
  React.useEffect(() => {
    if (!src) {
      setLoading(false)
      setError(true)
      return
    }
    
    setLoading(true)
    setError(false)
    
    // Try to load the image with retry
    loadImageWithRetry(src, { 
      maxRetries: retryOnError ? 3 : 1,
      fallbackSrc: fallback 
    })
    .then(() => {
      setImageSrc(src)
      setLoading(false)
      setError(false)
      onLoad?.()
    })
    .catch(() => {
      setLoading(false)
      setError(true)
      onError?.()
    })
  }, [src, fallback, retryOnError, onLoad, onError])
  
  if (loading) {
    return (
      <div 
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          color: '#666'
        }}
        {...props}
      >
        Loading...
      </div>
    )
  }
  
  if (error) {
    return (
      <div 
        style={{
          ...style,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
          color: '#999',
          fontSize: '12px'
        }}
        {...props}
      >
        Image unavailable
      </div>
    )
  }
  
  return (
    <img 
      src={imageSrc}
      alt={alt}
      style={style}
      onLoad={onLoad}
      onError={onError}
      {...props}
    />
  )
}
