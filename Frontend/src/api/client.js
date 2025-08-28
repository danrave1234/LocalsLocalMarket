// With Vite proxy, always use '/api' in dev
export const API_BASE = import.meta.env.VITE_API_BASE || '/api'

export async function apiRequest(path, { method = 'GET', body, token, headers } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': body instanceof FormData ? undefined : 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
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
}


