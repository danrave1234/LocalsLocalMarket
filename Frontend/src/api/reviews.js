import { API_BASE } from './client.js'
import shopCache from '../utils/shopCache.js'

// Get shop rating summary (combines authenticated and unauthenticated ratings)
export const getShopRatingSummary = async (shopId) => {
  try {
    // Check cache first
    const cachedRatings = shopCache.getRatings(shopId)
    if (cachedRatings) {
      return cachedRatings
    }
    
    // Get authenticated ratings summary
    const authResponse = await fetch(`${API_BASE}/shops/${shopId}/ratings/summary`)
    const authSummary = authResponse.ok ? await authResponse.json() : { count: 0, average: 0 }
    
    // Get unauthenticated ratings summary
    const unauthResponse = await fetch(`${API_BASE}/public/shops/${shopId}/reviews/summary`)
    const unauthSummary = unauthResponse.ok ? await unauthResponse.json() : { count: 0, average: 0 }
    
    // Combine the ratings
    const totalCount = authSummary.count + unauthSummary.count
    let combinedAverage = 0
    
    if (totalCount > 0) {
      const authTotal = authSummary.count * authSummary.average
      const unauthTotal = unauthSummary.count * unauthSummary.average
      combinedAverage = (authTotal + unauthTotal) / totalCount
    }
    
    const combinedRatings = {
      count: totalCount,
      average: Math.round(combinedAverage * 10.0) / 10.0
    }
    
    // Cache the combined ratings
    shopCache.setRatings(shopId, combinedRatings)
    
    return combinedRatings
  } catch (error) {
    console.error('Error fetching shop rating summary:', error)
    // Return default values if both fail
    return { count: 0, average: 0 }
  }
}

// Submit authenticated shop rating
export const submitShopRating = async (shopId, stars, token) => {
  try {
    const response = await fetch(`${API_BASE}/shops/${shopId}/ratings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ stars })
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to submit rating')
    }
    
    return await response.json()
  } catch (error) {
    console.error('Error submitting shop rating:', error)
    throw error
  }
}

// Submit unauthenticated shop rating to backend
export const submitUnauthenticatedShopRating = async (shopId, stars, reviewData) => {
  try {
    const deviceId = getDeviceId()
    
    const response = await fetch(`${API_BASE}/public/shops/${shopId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        stars,
        reviewText: reviewData.reviewText || '',
        reviewerName: reviewData.reviewerName || 'Anonymous Customer',
        deviceId
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Failed to submit review')
    }
    
    // Store locally to prevent multiple submissions
    const reviewKey = `shop_review_${shopId}`
    const review = {
      shopId,
      stars,
      ...reviewData,
      timestamp: new Date().toISOString(),
      deviceId
    }
    localStorage.setItem(reviewKey, JSON.stringify(review))
    
    return await response.json()
  } catch (error) {
    console.error('Error submitting unauthenticated rating:', error)
    throw error
  }
}

// Check if user has already reviewed a shop
export const hasUserReviewedShop = (shopId) => {
  const reviewKey = `shop_review_${shopId}`
  return localStorage.getItem(reviewKey) !== null
}

// Get user's review for a shop (if any)
export const getUserShopReview = (shopId) => {
  const reviewKey = `shop_review_${shopId}`
  const review = localStorage.getItem(reviewKey)
  return review ? JSON.parse(review) : null
}

// Generate a simple device ID based on browser fingerprint
const getDeviceId = () => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.textBaseline = 'top'
  ctx.font = '14px Arial'
  ctx.fillText('Device fingerprint', 2, 2)
  
  const fingerprint = canvas.toDataURL()
  let hash = 0
  
  for (let i = 0; i < fingerprint.length; i++) {
    const char = fingerprint.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(36)
}

// Get all reviews for a shop (combines authenticated and unauthenticated)
export const getAllShopReviews = async (shopId) => {
  try {
    // Check cache first
    const cachedReviews = shopCache.getReviews(shopId)
    if (cachedReviews) {
      return cachedReviews
    }
    
    // Fetch unauthenticated reviews from backend
    const response = await fetch(`${API_BASE}/public/shops/${shopId}/reviews`)
    if (!response.ok) {
      throw new Error('Failed to fetch reviews')
    }
    
    const backendReviews = await response.json()
    
    // Also check for local review to show user's own review
    const localReview = getUserShopReview(shopId)
    
    // Combine backend reviews with local review if it exists
    const allReviews = [...backendReviews]
    if (localReview && !backendReviews.find(r => r.deviceId === localReview.deviceId)) {
      allReviews.unshift(localReview)
    }
    
    // Cache the reviews
    shopCache.setReviews(shopId, allReviews)
    
    return allReviews
  } catch (error) {
    console.error('Error fetching shop reviews:', error)
    // Fallback to local reviews only
    const localReview = getUserShopReview(shopId)
    return localReview ? [localReview] : []
  }
}
