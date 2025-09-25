import { api } from './client.js'

export async function fetchShops({ q, category } = {}) {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    if (category) params.set('category', category)
    const qs = params.toString()
    
    return api.get(`/shops${qs ? `?${qs}` : ''}`)
}

export async function fetchAllShops() {
    // Fetch all shops for client-side filtering
    return api.get('/shops/all')
}

// New function to fetch paginated shops with ratings included
export async function fetchPaginatedShopsWithRatings(page = 0, size = 20) {
    const params = new URLSearchParams()
    params.set('page', page)
    params.set('size', size)
    return api.get(`/shops/paginated-with-ratings?${params.toString()}`)
}

export async function fetchShopById(id) {
    try {
        return api.get(`/shops/${id}`)
    } catch (error) {
        throw error
    }
}

// Authenticated endpoints used by dashboard pages
export async function createShop(shopData, token) {
    return api.post('/shops', shopData, { token })
}

export async function getUserShopsApi(token) {
    return api.get('/shops/my-shops', { token })
}

export async function getShopRequest(id) {
    return api.get(`/shops/${id}`)
}

export async function updateShop(id, shopData, token) {
    return api.patch(`/shops/${id}`, shopData, { token })
}

export async function deleteShopRequest(id, token) {
    return api.delete(`/shops/${id}`, { token })
}

export async function fetchCategories() {
    return api.get('/shops/categories')
}

// Admin-only: update shop active status by slug
export async function updateShopStatusBySlug(slug, isActive) {
    return api.patch(`/shops/${slug}/status`, { isActive })
}

// Batch fetch shop meta for multiple IDs
export async function fetchShopsMeta(shopIds = []) {
    return api.post('/shops/meta', shopIds)
}

// Backward-compatible aliases for older import names used across pages
export {
    createShop as createShopRequest,
    getUserShopsApi as getUserShopsRequest,
    updateShop as updateShopRequest
}


