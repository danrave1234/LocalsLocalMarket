import { api } from './client.js'

export async function fetchProducts(params = {}) {
  const p = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') p.set(k, v)
  })
  const qs = p.toString()
  return api.get(`/products${qs ? `?${qs}` : ''}`)
}


