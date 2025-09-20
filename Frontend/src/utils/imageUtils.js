// Image utility functions
import { API_BASE } from '../api/client.js'

/**
 * Get the full URL for an image path
 * @param {string} path - The image path from the database
 * @returns {string} - The full URL to the image
 */
export function getImageUrl(path) {
  if (!path) {
    return null
  }
  
  // If it's already a full URL, return as is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path
  }
  
  // Get the base URL without the trailing /api suffix for uploads
  const baseUrl = API_BASE.replace(/\/api$/, '')
  
  // If it starts with a slash, it's a relative path
  if (path.startsWith('/')) {
    return `${baseUrl}${path}`
  }
  
  // Otherwise, assume it's a relative path and add the base
  return `${baseUrl}/uploads/${path}`
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

