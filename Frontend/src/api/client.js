// Simplified API base URL detection
function getApiBase() {
  // Use Vite environment variable (configured in vite.config.js)
  const apiBase = import.meta.env.VITE_API_BASE
  
  // Simple fallback for development
  if (import.meta.env.DEV && (!apiBase || apiBase === '/api')) {
    return '/api'
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

// Minimal logging for debugging
if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_LOGS === 'true') {
  logger.info('🔧 API Configuration:', {
    environment: 'Development',
    apiBase: API_BASE
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
      signal: createTimeoutSignal(10000),
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

// Simplified retry mechanism for failed requests
async function apiRequestWithRetry(path, options, maxRetries = 1) {
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
        // Quick retry with minimal delay
        await new Promise(resolve => setTimeout(resolve, 500))
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


