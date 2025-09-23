// Image utility functions
import { API_BASE } from '../api/client.js'

// Session-scoped cache-buster to avoid "cached but not showing" issues on some browsers
const IMG_SESSION_TOKEN = typeof window !== 'undefined'
  ? (window.__LLM_IMG_SESSION_TOKEN ||= String(Date.now()))
  : '0'

/**
 * Get the full URL for an image path
 * - Accepts absolute URLs, /uploads/**, uploads/**, and bare filenames
 * - Normalizes to the backend origin (API_BASE without /api)
 * - Appends a session cache-buster to uploads to force a fresh fetch after refresh
 * @param {string} path - The image path from the database
 * @returns {string} - The full URL to the image
 */
export function getImageUrl(path) {
  if (!path) {
    return null
  }

  const raw = String(path).trim()

  // Already absolute URL → return as is
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw
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
  const url = `${(base || '').replace(/\/$/, '')}/${normalized.replace(/^\/+/, '')}`

  // Append a session cache-buster only for uploads to defeat problematic stale caches after refresh
  const withBuster = url.includes('/uploads/')
    ? `${url}${url.includes('?') ? '&' : '?'}v=${encodeURIComponent(IMG_SESSION_TOKEN)}`
    : url

  return withBuster
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

