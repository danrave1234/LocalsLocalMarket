import { api } from './client.js'

export async function fetchProducts(params = {}) {
  const p = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') p.set(k, v)
  })
  const qs = p.toString()
  return api.get(`/products${qs ? `?${qs}` : ''}`)
}

export async function fetchProductsByShopIdPaginated(shopId, page = 0, size = 12) {
  return api.get(`/products/by-shop/${shopId}?page=${page}&size=${size}`)
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

export async function updateProductImages(productId, imagePathsJson, token) {
  return api.patch(`/products/${productId}/images`, { imagePathsJson }, {
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

export async function updateProductStock(productId, stockCount, token) {
  return api.patch(`/products/${productId}`, { stockCount }, { headers: { 'Authorization': `Bearer ${token}` } })
}

export async function decrementProductStock(productId, amount = 1, token) {
  return api.post(`/products/${productId}/decrement-stock?amount=${amount}`, null, { headers: { 'Authorization': `Bearer ${token}` } })
}

export async function uploadImage(formData, token, type = 'general') {
  // Add type parameter to the URL
  const url = `/uploads/image?type=${encodeURIComponent(type)}`;
  return api.post(url, formData, { token })
}

export async function deleteImage(imageUrl, token) {
  const url = `/uploads/image?url=${encodeURIComponent(imageUrl)}`;
  return api.delete(url, { token })
}

export async function fetchProductsByShopId(shopId, token) {
  return api.get(`/products?shopId=${shopId}`, { headers: { 'Authorization': `Bearer ${token}` } })
}

// New category-based product functions
export async function fetchProductsByMainCategory(mainCategory, page = 0, size = 20) {
  return api.get(`/products/by-category/${encodeURIComponent(mainCategory)}?page=${page}&size=${size}`)
}

export async function fetchProductsByMainCategoryAndSubcategory(mainCategory, subcategory, page = 0, size = 20) {
  return api.get(`/products/by-category/${encodeURIComponent(mainCategory)}/${encodeURIComponent(subcategory)}?page=${page}&size=${size}`)
}

export async function fetchProductMainCategories() {
  return api.get('/products/categories/main')
}

export async function fetchProductSubcategories(mainCategory) {
  return api.get(`/products/categories/subcategories?mainCategory=${encodeURIComponent(mainCategory)}`)
}

// Helper function to format category data for API calls
export function formatCategoryData(categoryValue) {
  if (typeof categoryValue === 'string') {
    // Legacy format - just a string
    return { category: categoryValue }
  } else if (typeof categoryValue === 'object' && categoryValue !== null) {
    // New hierarchical format
    return {
      mainCategory: categoryValue.mainCategory || null,
      subcategory: categoryValue.subcategory || null,
      customCategory: categoryValue.customCategory || null
    }
  }
  return {}
}


