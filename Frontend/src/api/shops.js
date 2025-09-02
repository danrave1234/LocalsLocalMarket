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

export async function fetchShopById(id) {
    return api.get(`/shops/${id}`)
}

export async function createShopRequest(shopData, token) {
    return api.post('/shops', shopData, { token })
}

export async function getUserShopsRequest(token) {
    return api.get('/shops/my-shops', { token })
}

export async function getShopRequest(id) {
    return api.get(`/shops/${id}`)
}

export async function updateShopRequest(id, shopData, token) {
    return api.patch(`/shops/${id}`, shopData, { token })
}

export async function deleteShopRequest(id, token) {
    return api.delete(`/shops/${id}`, { token })
}

export async function fetchCategories() {
    return api.get('/shops/categories')
}


