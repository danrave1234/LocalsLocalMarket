// Smart API base URL detection with Android-specific fixes
function getApiBase() {
  // Use Vite environment variable (configured in vite.config.js)
  let apiBase = import.meta.env.VITE_API_BASE
  
  // Detect if we're on Android
  const isAndroid = typeof window !== 'undefined' && 
    (window.navigator.userAgent.includes('Android') || 
     window.navigator.userAgent.includes('Mobile'))
  
  // For Android devices, implement fallback logic
  if (isAndroid && typeof window !== 'undefined') {
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

// Android-specific debugging
if (typeof window !== 'undefined') {
  const isAndroid = window.navigator.userAgent.includes('Android') || 
    window.navigator.userAgent.includes('Mobile')
  
  if (isAndroid) {
    console.log('🤖 Android Device Detected:', {
      userAgent: window.navigator.userAgent,
      apiBase: API_BASE,
      currentHost: window.location.hostname,
      protocol: window.location.protocol,
      isSecure: window.location.protocol === 'https:'
    })
  }
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
  
  // Detect Android for specific handling
  const isAndroid = typeof window !== 'undefined' && 
    (window.navigator.userAgent.includes('Android') || 
     window.navigator.userAgent.includes('Mobile'))
  
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method,
      headers: requestHeaders,
      body: isFormData ? body : body ? JSON.stringify(body) : undefined,
      credentials: 'include',
      // Add timeout for mobile networks - longer for Android
      signal: AbortSignal.timeout ? AbortSignal.timeout(isAndroid ? 45000 : 30000) : undefined,
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
    // Enhanced error handling for Android devices
    if (error.name === 'AbortError') {
      const message = isAndroid 
        ? 'Request timeout - Android devices may need a stronger internet connection. Please try again.'
        : 'Request timeout - please check your internet connection'
      throw new Error(message)
    }
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const message = isAndroid
        ? 'Network error on Android - please check your internet connection and ensure the app has network permissions'
        : 'Network error - please check your internet connection and try again'
      throw new Error(message)
    }
    if (error.message.includes('Failed to fetch')) {
      const message = isAndroid
        ? 'Unable to connect to server on Android. Please check your internet connection and try again.'
        : 'Unable to connect to server. Please check your internet connection and try again.'
      throw new Error(message)
    }
    throw error
  }
}

// Retry mechanism for Android devices
async function apiRequestWithRetry(path, options, maxRetries = 2) {
  const isAndroid = typeof window !== 'undefined' && 
    (window.navigator.userAgent.includes('Android') || 
     window.navigator.userAgent.includes('Mobile'))
  
  if (!isAndroid) {
    return apiRequest(path, options)
  }
  
  let lastError
  let useFallback = false
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // On the last attempt, try fallback API if available
      if (attempt === maxRetries && window.ANDROID_FALLBACK_API && !useFallback) {
        console.log('🤖 Android trying fallback API:', window.ANDROID_FALLBACK_API)
        useFallback = true
        // Temporarily override API_BASE for this request
        const originalApiBase = API_BASE
        const fallbackPath = `${window.ANDROID_FALLBACK_API}${path}`
        const fallbackOptions = { ...options, fallbackApi: window.ANDROID_FALLBACK_API }
        return await apiRequestWithFallback(fallbackPath, fallbackOptions)
      }
      
      return await apiRequest(path, options)
    } catch (error) {
      lastError = error
      if (attempt < maxRetries && (
        error.message.includes('Failed to fetch') || 
        error.message.includes('Network error') ||
        error.name === 'AbortError'
      )) {
        console.log(`🤖 Android retry attempt ${attempt + 1}/${maxRetries + 1} for ${path}`)
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)))
        continue
      }
      break
    }
  }
  throw lastError
}

// Helper function for fallback API requests
async function apiRequestWithFallback(fullUrl, options) {
  const { fallbackApi, ...requestOptions } = options
  const isFormData = requestOptions.body instanceof FormData;
  const requestHeaders = {
    ...(requestOptions.token ? { Authorization: `Bearer ${requestOptions.token}` } : {}),
    ...requestOptions.headers,
  };
  
  if (!isFormData) {
    requestHeaders['Content-Type'] = 'application/json';
  }
  
  requestHeaders['Accept'] = 'application/json, text/plain, */*';
  requestHeaders['Cache-Control'] = 'no-cache';
  
  const res = await fetch(fullUrl, {
    method: requestOptions.method || 'GET',
    headers: requestHeaders,
    body: isFormData ? requestOptions.body : requestOptions.body ? JSON.stringify(requestOptions.body) : undefined,
    credentials: 'include',
    signal: AbortSignal.timeout ? AbortSignal.timeout(45000) : undefined,
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
}

export const api = {
  get: (p, opts) => apiRequestWithRetry(p, { ...opts, method: 'GET' }),
  post: (p, body, opts) => apiRequestWithRetry(p, { ...opts, method: 'POST', body }),
  patch: (p, body, opts) => apiRequestWithRetry(p, { ...opts, method: 'PATCH', body }),
  delete: (p, opts) => apiRequestWithRetry(p, { ...opts, method: 'DELETE' }),
  put: (p, body, opts) => apiRequestWithRetry(p, { ...opts, method: 'PUT', body }),
}


