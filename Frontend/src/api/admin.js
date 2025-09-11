import { api } from './client.js'

// Dashboard Statistics
export async function fetchDashboardStats() {
    return api.get('/admin/dashboard/stats')
}

// User Management
export async function fetchUsers(page = 0, size = 20, search = null) {
    const params = new URLSearchParams()
    params.set('page', page)
    params.set('size', size)
    if (search) params.set('search', search)
    
    return api.get(`/admin/users?${params.toString()}`)
}

export async function fetchUser(id) {
    return api.get(`/admin/users/${id}`)
}

export async function updateUserStatus(id, status) {
    return api.patch(`/admin/users/${id}/status`, { status })
}

// Shop Management
export async function fetchShops(page = 0, size = 20, status = null) {
    const params = new URLSearchParams()
    params.set('page', page)
    params.set('size', size)
    if (status) params.set('status', status)
    
    return api.get(`/admin/shops?${params.toString()}`)
}

export async function fetchShop(id) {
    return api.get(`/admin/shops/${id}`)
}

export async function approveShop(id) {
    return api.patch(`/admin/shops/${id}/approve`)
}

export async function rejectShop(id, reason) {
    return api.patch(`/admin/shops/${id}/reject`, { reason })
}

// Product Management
export async function fetchProducts(page = 0, size = 20, filter = null) {
    const params = new URLSearchParams()
    params.set('page', page)
    params.set('size', size)
    if (filter) params.set('filter', filter)
    
    return api.get(`/admin/products?${params.toString()}`)
}

export async function fetchProduct(id) {
    return api.get(`/admin/products/${id}`)
}

export async function updateProductStatus(id, isActive) {
    return api.patch(`/admin/products/${id}/status`, { isActive })
}

// Reports & Analytics
export async function fetchUserGrowthReport(days = 30) {
    return api.get(`/admin/reports/user-growth?days=${days}`)
}

export async function fetchSalesReport(days = 30) {
    return api.get(`/admin/reports/sales?days=${days}`)
}

export async function fetchPopularCategoriesReport() {
    return api.get('/admin/reports/popular-categories')
}

// System Management
export async function fetchSystemHealth() {
    return api.get('/admin/system/health')
}

export async function toggleMaintenanceMode(enabled) {
    return api.post('/admin/system/maintenance', { enabled })
}

export async function createBackup() {
    return api.post('/admin/system/backup')
}

// Activity Log
export async function fetchRecentActivity() {
    return api.get('/admin/activity/recent')
}

// Export functions for data download
export async function exportUsers(format = 'csv') {
    return api.get(`/admin/export/users?format=${format}`, {
        responseType: 'blob'
    })
}

export async function exportShops(format = 'csv') {
    return api.get(`/admin/export/shops?format=${format}`, {
        responseType: 'blob'
    })
}

export async function exportProducts(format = 'csv') {
    return api.get(`/admin/export/products?format=${format}`, {
        responseType: 'blob'
    })
}

export async function exportSalesReport(format = 'csv', days = 30) {
    return api.get(`/admin/export/sales?format=${format}&days=${days}`, {
        responseType: 'blob'
    })
}

// Admin action: warn shop owner via email
export async function warnShopOwner(slug, reason = '') {
    return api.post(`/shops/${slug}/warn`, { reason })
}