// Smart API base URL detection
function getApiBase() {
  // Use Vite environment variable (configured in vite.config.js)
  const apiBase = import.meta.env.VITE_API_BASE
  
  // For mobile devices, ensure we're using the correct protocol
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    // If frontend is served over HTTPS, ensure API is also HTTPS
    if (apiBase && apiBase.startsWith('http://localhost')) {
      console.warn('⚠️ Frontend is served over HTTPS but API is HTTP. This may cause issues on mobile devices.')
    }
  }
  
  return apiBase
}

export const API_BASE = getApiBase()

// Log API configuration in development
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:', {
    environment: 'Development',
    apiBase: API_BASE,
    viteApiBase: import.meta.env.VITE_API_BASE
  })
}

// Also log in production for debugging
if (!import.meta.env.DEV) {
  console.log('🚀 Production API Configuration:', {
    environment: 'Production',
    apiBase: API_BASE,
    viteApiBase: import.meta.env.VITE_API_BASE,
    isDev: import.meta.env.DEV
  })
}

export async function apiRequest(path, { method = 'GET', body, token, headers } = {}) {
  const isFormData = body instanceof FormData;
  const requestHeaders = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
      // Add timeout for mobile networks
      signal: AbortSignal.timeout ? AbortSignal.timeout(30000) : undefined, // 30 second timeout
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
    // Enhanced error handling for mobile devices
    if (error.name === 'AbortError') {
      throw new Error('Request timeout - please check your internet connection')
    }
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Network error - please check your internet connection and try again')
    }
    throw error
  }
}

export const api = {
  get: (p, opts) => apiRequest(p, { ...opts, method: 'GET' }),
  post: (p, body, opts) => apiRequest(p, { ...opts, method: 'POST', body }),
  patch: (p, body, opts) => apiRequest(p, { ...opts, method: 'PATCH', body }),
  delete: (p, opts) => apiRequest(p, { ...opts, method: 'DELETE' }),
  put: (p, body, opts) => apiRequest(p, { ...opts, method: 'PUT', body }),
}


