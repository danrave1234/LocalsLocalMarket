import { API_BASE } from './client.js'

export async function fetchShops({ q } = {}) {
    const params = new URLSearchParams()
    if (q) params.set('q', q)
    const qs = params.toString()
    
    const response = await fetch(`${API_BASE}/shops${qs ? `?${qs}` : ''}`)
    
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch shops')
    }
    return response.json()
}

export async function fetchShopById(id) {
    const response = await fetch(`${API_BASE}/shops/${id}`)
    
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch shop')
    }
    return response.json()
}

export async function createShopRequest(shopData, token) {
    const response = await fetch(`${API_BASE}/shops`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(shopData)
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to create shop')
    }
    return response.json()
}

export async function getUserShopsRequest(token) {
    const response = await fetch(`${API_BASE}/shops/my-shops`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch shops')
    }
    return response.json()
}

export async function getShopRequest(id) {
    const response = await fetch(`${API_BASE}/shops/${id}`)
    
    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to fetch shop')
    }
    return response.json()
}

export async function updateShopRequest(id, shopData, token) {
    const response = await fetch(`${API_BASE}/shops/${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(shopData)
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to update shop')
    }
    return response.json()
}

export async function deleteShopRequest(id, token) {
    const response = await fetch(`${API_BASE}/shops/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })

    if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to delete shop')
    }
    return response.json()
}


