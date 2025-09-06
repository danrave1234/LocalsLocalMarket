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
    // Android-specific debugging
    const isAndroid = typeof window !== 'undefined' && 
        (window.navigator.userAgent.includes('Android') || 
         window.navigator.userAgent.includes('Mobile'))
    
    if (isAndroid) {
        console.log('🤖 Android: Fetching shop by ID:', id)
        console.log('🤖 Android: API base URL:', import.meta.env.VITE_API_BASE)
    }
    
    try {
        // For Android devices, try with cache-busting parameter to avoid cache issues
        const url = isAndroid ? `/shops/${id}?t=${Date.now()}` : `/shops/${id}`
        const result = await api.get(url)
        
        if (isAndroid) {
            console.log('✅ Android: Successfully fetched shop data:', result)
        }
        
        return result
    } catch (error) {
        if (isAndroid) {
            console.error('❌ Android: Failed to fetch shop data:', error)
            console.error('❌ Android: Error details:', {
                message: error.message,
                status: error.status,
                data: error.data
            })
            
            // Try alternative approach for Android - direct fetch without retry mechanism
            console.log('🤖 Android: Trying direct fetch without retry mechanism...')
            try {
                const directResult = await fetchShopByIdDirect(id)
                console.log('✅ Android: Direct fetch successful:', directResult)
                return directResult
            } catch (directError) {
                console.error('❌ Android: Direct fetch also failed:', directError)
                throw error // Throw original error
            }
        }
        throw error
    }
}

// Direct fetch method for Android fallback
async function fetchShopByIdDirect(id) {
    const API_BASE = import.meta.env.VITE_API_BASE
    const url = `${API_BASE}/shops/${id}?t=${Date.now()}`
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Cache-Control': 'no-cache',
        },
        credentials: 'include',
    })
    
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
    
    return response.json()
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


