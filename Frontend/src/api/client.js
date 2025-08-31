// Smart API base URL detection
function getApiBase() {
  // If environment variable is explicitly set, use it
  if (import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE
  }
  
  // Auto-detect environment
  if (import.meta.env.DEV) {
    // Development: use relative path for Vite proxy
    return '/api'
  } else {
    // Production: use absolute URL
    return 'https://api.localslocalmarket.com/api'
  }
}

export const API_BASE = getApiBase()

// Log API configuration in development
if (import.meta.env.DEV) {
  console.log('🔧 API Configuration:', {
    environment: import.meta.env.DEV ? 'Development' : 'Production',
    apiBase: API_BASE,
    viteProxy: import.meta.env.DEV ? 'Enabled (localhost:8080)' : 'Disabled'
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
  
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: requestHeaders,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
    credentials: 'include',
  })
  if (!res.ok) {
    let error
    try { error = await res.json() } catch { error = { message: res.statusText } }
    throw Object.assign(new Error(error.message || 'Request failed'), { status: res.status, data: error })
  }
  const contentType = res.headers.get('content-type') || ''
  if (contentType.includes('application/json')) return res.json()
  return res.text()
}

export const api = {
  get: (p, opts) => apiRequest(p, { ...opts, method: 'GET' }),
  post: (p, body, opts) => apiRequest(p, { ...opts, method: 'POST', body }),
  patch: (p, body, opts) => apiRequest(p, { ...opts, method: 'PATCH', body }),
  delete: (p, opts) => apiRequest(p, { ...opts, method: 'DELETE' }),
  put: (p, body, opts) => apiRequest(p, { ...opts, method: 'PUT', body }),
}


