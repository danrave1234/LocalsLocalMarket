// Smart API base URL detection
function getApiBase() {
  // Use Vite environment variable (configured in vite.config.js)
  return import.meta.env.VITE_API_BASE
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


