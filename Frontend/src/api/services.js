import { API_BASE } from './client.js'

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
  }
  return response.json()
}

// Helper function to get auth headers
const getAuthHeaders = (token) => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
})

// ========== SERVICE CRUD OPERATIONS ==========

/**
 * Fetch all services with pagination and filters
 */
export const fetchServices = async (params = {}) => {
  const {
    page = 0,
    size = 20,
    sortBy = 'id',
    sortDir = 'asc',
    status,
    category,
    subcategory,
    search,
    shopId,
    minPrice,
    maxPrice
  } = params

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDir
  })

  if (status) queryParams.append('status', status)
  if (category) queryParams.append('category', category)
  if (subcategory) queryParams.append('subcategory', subcategory)
  if (search) queryParams.append('search', search)
  if (shopId) queryParams.append('shopId', shopId)
  if (minPrice) queryParams.append('minPrice', minPrice)
  if (maxPrice) queryParams.append('maxPrice', maxPrice)

  const response = await fetch(`${API_BASE}/services/paginated?${queryParams}`)
  return handleResponse(response)
}

/**
 * Fetch services by shop ID with pagination
 */
export const fetchServicesByShopId = async (shopId, params = {}) => {
  const {
    page = 0,
    size = 20,
    sortBy = 'id',
    sortDir = 'asc',
    status,
    minPrice,
    maxPrice
  } = params

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDir
  })

  if (status) queryParams.append('status', status)
  if (minPrice) queryParams.append('minPrice', minPrice)
  if (maxPrice) queryParams.append('maxPrice', maxPrice)

  const response = await fetch(`${API_BASE}/services/shop/${shopId}/paginated?${queryParams}`)
  return handleResponse(response)
}

/**
 * Fetch services by category with pagination
 */
export const fetchServicesByCategory = async (category, params = {}) => {
  const {
    page = 0,
    size = 20,
    sortBy = 'id',
    sortDir = 'asc',
    status,
    minPrice,
    maxPrice
  } = params

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDir
  })

  if (status) queryParams.append('status', status)
  if (minPrice) queryParams.append('minPrice', minPrice)
  if (maxPrice) queryParams.append('maxPrice', maxPrice)

  const response = await fetch(`${API_BASE}/services/category/${encodeURIComponent(category)}/paginated?${queryParams}`)
  return handleResponse(response)
}

/**
 * Search services with advanced filters
 */
export const searchServices = async (params = {}) => {
  const {
    q,
    shopId,
    status,
    category,
    subcategory,
    minPrice,
    maxPrice,
    page = 0,
    size = 20,
    sortBy = 'id',
    sortDir = 'asc'
  } = params

  const queryParams = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
    sortBy,
    sortDir
  })

  if (q) queryParams.append('q', q)
  if (shopId) queryParams.append('shopId', shopId)
  if (status) queryParams.append('status', status)
  if (category) queryParams.append('category', category)
  if (subcategory) queryParams.append('subcategory', subcategory)
  if (minPrice) queryParams.append('minPrice', minPrice)
  if (maxPrice) queryParams.append('maxPrice', maxPrice)

  const response = await fetch(`${API_BASE}/services/search/paginated?${queryParams}`)
  return handleResponse(response)
}

/**
 * Fetch a single service by ID
 */
export const fetchServiceById = async (serviceId) => {
  const response = await fetch(`${API_BASE}/services/${serviceId}`)
  return handleResponse(response)
}

/**
 * Create a new service
 */
export const createService = async (serviceData, token) => {
  const response = await fetch(`${API_BASE}/services`, {
    method: 'POST',
    headers: getAuthHeaders(token),
    body: JSON.stringify(serviceData)
  })
  return handleResponse(response)
}

/**
 * Update an existing service
 */
export const updateService = async (serviceId, serviceData, token) => {
  const response = await fetch(`${API_BASE}/services/${serviceId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify(serviceData)
  })
  return handleResponse(response)
}

/**
 * Update service images immediately
 */
export const updateServiceImages = async (serviceId, imageUrl, token) => {
  const response = await fetch(`${API_BASE}/services/${serviceId}/images`, {
    method: 'PATCH',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ imageUrl })
  })
  return handleResponse(response)
}

/**
 * Delete a service (soft delete - sets isActive to false)
 */
export const deleteService = async (serviceId, token) => {
  const response = await fetch(`${API_BASE}/services/${serviceId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(token)
  })
  return handleResponse(response)
}

/**
 * Update service status
 */
export const updateServiceStatus = async (serviceId, status, token) => {
  const response = await fetch(`${API_BASE}/services/${serviceId}`, {
    method: 'PUT',
    headers: getAuthHeaders(token),
    body: JSON.stringify({ status })
  })
  return handleResponse(response)
}

// ========== LEGACY NON-PAGINATED METHODS (for backward compatibility) ==========

/**
 * Fetch all services (non-paginated)
 */
export const fetchAllServices = async (params = {}) => {
  const { status, category, shopId } = params
  const queryParams = new URLSearchParams()
  
  if (status) queryParams.append('status', status)
  if (category) queryParams.append('category', category)
  if (shopId) queryParams.append('shopId', shopId)

  const url = `${API_BASE}/services${queryParams.toString() ? `?${queryParams}` : ''}`
  const response = await fetch(url)
  return handleResponse(response)
}

/**
 * Fetch services by shop ID (non-paginated)
 */
export const fetchServicesByShopIdLegacy = async (shopId, status = null) => {
  const queryParams = new URLSearchParams()
  if (status) queryParams.append('status', status)
  
  const url = `${API_BASE}/services/shop/${shopId}${queryParams.toString() ? `?${queryParams}` : ''}`
  const response = await fetch(url)
  return handleResponse(response)
}

/**
 * Fetch services by category (non-paginated)
 */
export const fetchServicesByCategoryLegacy = async (category, status = null) => {
  const queryParams = new URLSearchParams()
  if (status) queryParams.append('status', status)
  
  const url = `${API_BASE}/services/category/${encodeURIComponent(category)}${queryParams.toString() ? `?${queryParams}` : ''}`
  const response = await fetch(url)
  return handleResponse(response)
}

// ========== UTILITY FUNCTIONS ==========

/**
 * Get service categories (reuse from existing categories API)
 */
export const getServiceCategories = async () => {
  // For now, we'll use the same categories as products
  // In the future, this could be a separate service categories endpoint
  const response = await fetch(`${API_BASE}/categories`)
  return handleResponse(response)
}

/**
 * Validate service data
 */
export const validateServiceData = (serviceData) => {
  const errors = []
  
  if (!serviceData.title || serviceData.title.trim().length === 0) {
    errors.push('Service title is required')
  }
  
  if (serviceData.title && serviceData.title.length > 255) {
    errors.push('Service title must be less than 255 characters')
  }
  
  if (serviceData.description && serviceData.description.length > 1000) {
    errors.push('Service description must be less than 1000 characters')
  }
  
  if (serviceData.price !== undefined && serviceData.price !== null && serviceData.price !== '') {
    const price = parseFloat(serviceData.price)
    if (isNaN(price) || price < 0) {
      errors.push('Service price must be a valid positive number')
    }
    if (price > 999999.99) {
      errors.push('Service price must be less than ₱999,999.99')
    }
  }
  
  if (serviceData.status && !['AVAILABLE', 'NOT_AVAILABLE'].includes(serviceData.status)) {
    errors.push('Service status must be either AVAILABLE or NOT_AVAILABLE')
  }
  
  return errors
}

/**
 * Format service data for API submission
 */
export const formatServiceData = (formData) => {
  // Ensure all fields are properly converted to the expected types
  const price = formData.price && formData.price !== '' ? parseFloat(formData.price) : null
  const isActive = formData.isActive !== undefined ? Boolean(formData.isActive) : true
  
  return {
    title: formData.title?.trim() || '',
    description: formData.description?.trim() || null,
    price: isNaN(price) ? null : price,
    mainCategory: formData.mainCategory && formData.mainCategory !== '' ? formData.mainCategory : null,
    subcategory: formData.subcategory && formData.subcategory !== '' ? formData.subcategory : null,
    customCategory: formData.customCategory && formData.customCategory !== '' ? formData.customCategory : null,
    status: formData.status || 'AVAILABLE',
    isActive: isActive,
    imageUrl: formData.imageUrl && formData.imageUrl !== '' ? formData.imageUrl : null
    // Note: Explicitly excluding stockCount and imagePathsJson which are product-specific fields
  }
}

export default {
  fetchServices,
  fetchServicesByShopId,
  fetchServicesByCategory,
  searchServices,
  fetchServiceById,
  createService,
  updateService,
  deleteService,
  updateServiceStatus,
  fetchAllServices,
  fetchServicesByShopIdLegacy,
  fetchServicesByCategoryLegacy,
  getServiceCategories,
  validateServiceData,
  formatServiceData
}
