// Smart API base URL detection with Android-specific fixes
function getApiBase() {
  // Use Vite environment variable (configured in vite.config.js)
  let apiBase = import.meta.env.VITE_API_BASE
  
  // Detect if we're on Android
  const isAndroid = typeof window !== 'undefined' && 
    (window.navigator.userAgent.includes('Android') || 
     window.navigator.userAgent.includes('Mobile'))
  
  // For Android devices, implement fallback logic (dev only)
  if (import.meta.env.DEV && isAndroid && typeof window !== 'undefined') {
    const currentHost = window.location.hostname
    
    // If we're in production but the API domain is not accessible, try localhost
    if (apiBase && apiBase.includes('api.localslocalmarket.com')) {
      // Try to detect if we're running locally on Android (like in a development build)
      if (currentHost === 'localhost' || currentHost === '127.0.0.1' || currentHost.includes('192.168')) {
        apiBase = 'http://localhost:8080/api'
        console.log('🤖 Android detected - using localhost API for development')
      } else {
        // For production Android builds, try the production API
        console.log('🤖 Android detected - using production API')
      }
    }
    
    // Additional fallback: if we're on a local network, try to use the same host
    if (currentHost.includes('192.168') || currentHost.includes('10.') || currentHost.includes('172.')) {
      const protocol = window.location.protocol
      const port = window.location.port || (protocol === 'https:' ? '443' : '80')
      const fallbackApiBase = `${protocol}//${currentHost}:8080/api`
      console.log('🤖 Android on local network - fallback API:', fallbackApiBase)
      // Store fallback for potential use
      window.ANDROID_FALLBACK_API = fallbackApiBase
    }
  }
  
  // For mobile devices, ensure we're using the correct protocol
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    // If frontend is served over HTTPS, ensure API is also HTTPS
    if (apiBase && apiBase.startsWith('http://localhost')) {
      console.warn('⚠️ Frontend is served over HTTPS but API is HTTP. This may cause issues on mobile devices.')
    }
  }
  
  return apiBase
}

import { logger } from '../utils/logger.js'
export const API_BASE = getApiBase()

// Cross-browser timeout helper
const createTimeoutSignal = (ms) => {
  if (typeof AbortSignal !== 'undefined' && AbortSignal.timeout) {
    return AbortSignal.timeout(ms)
  }
  const controller = new AbortController()
  setTimeout(() => controller.abort(), ms)
  return controller.signal
}

// Log API configuration in development
if (import.meta.env.DEV) {
  logger.info('🔧 API Configuration:', {
    environment: 'Development',
    apiBase: API_BASE,
    viteApiBase: import.meta.env.VITE_API_BASE
  })
}

// Also log in production for debugging
if (!import.meta.env.DEV) {
  logger.info('🚀 Production API Configuration:', {
    environment: 'Production',
    apiBase: API_BASE,
    viteApiBase: import.meta.env.VITE_API_BASE,
    isDev: import.meta.env.DEV
  })
}


export async function apiRequest(path, { method = 'GET', body, token, headers } = {}) {
  const isFormData = body instanceof FormData;
  // Fallback to token from localStorage if not provided
  const effectiveToken = token ?? (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null)
  const requestHeaders = {
    ...(effectiveToken ? { Authorization: `Bearer ${effectiveToken}` } : {}),
    ...headers,
  };
  
  // Only set Content-Type for non-FormData requests
  if (!isFormData) {
    requestHeaders['Content-Type'] = 'application/json';
  }
  
  // Add mobile-specific headers for better compatibility
  requestHeaders['Accept'] = 'application/json, text/plain, */*';
  requestHeaders['Cache-Control'] = 'no-cache';
  
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: requestHeaders,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      credentials: 'include',
      signal: createTimeoutSignal(30000),
    })
    
    if (!res.ok) {
      let error
      try { 
        error = await res.json() 
      } catch { 
        error = { 
          message: res.statusText || 'Network request failed',
          status: res.status 
        } 
      }
      throw Object.assign(new Error(error.message || 'Request failed'), { status: res.status, data: error })
    }
    
    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) return res.json()
    return res.text()
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please check your internet connection')
    }
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error - please check your internet connection and try again')
    }
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Unable to connect to server. Please check your internet connection and try again.')
    }
    throw error
  }
}

// Retry mechanism for failed requests
async function apiRequestWithRetry(path, options, maxRetries = 2) {
  let lastError
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await apiRequest(path, options)
    } catch (error) {
      lastError = error
      if (attempt < maxRetries && (
        error.message.includes('Failed to fetch') || 
        error.message.includes('Network error') ||
        error.name === 'AbortError'
      )) {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
        continue
      }
      break
    }
  }
  throw lastError
}


export const api = {
  get: (p, opts) => apiRequestWithRetry(p, { ...opts, method: 'GET' }),
  post: (p, body, opts) => apiRequestWithRetry(p, { ...opts, method: 'POST', body }),
  patch: (p, body, opts) => apiRequestWithRetry(p, { ...opts, method: 'PATCH', body }),
  delete: (p, opts) => apiRequestWithRetry(p, { ...opts, method: 'DELETE' }),
  put: (p, body, opts) => apiRequestWithRetry(p, { ...opts, method: 'PUT', body }),
}


