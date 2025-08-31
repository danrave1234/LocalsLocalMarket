import { api } from './client.js'

export async function fetchProducts(params = {}) {
  const p = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') p.set(k, v)
  })
  const qs = p.toString()
  return api.get(`/products${qs ? `?${qs}` : ''}`)
}

export async function createProduct(productData, token) {
  return api.post('/products', productData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export async function updateProduct(productId, productData, token) {
  return api.patch(`/products/${productId}`, productData, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export async function deleteProduct(productId, token) {
  return api.delete(`/products/${productId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}

export async function getProductById(productId) {
  return api.get(`/products/${productId}`)
}


