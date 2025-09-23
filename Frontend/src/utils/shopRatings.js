// Utility functions for managing authenticated shop ratings in localStorage

/**
 * Get the average rating for a shop from localStorage
 * @param {string} shopId - The shop ID
 * @param {string} userId - The authenticated user ID
 * @returns {object} - { averageRating: number, reviewCount: number, hasUserReviewed: boolean, canReview: boolean }
 */
export const getShopRating = (shopId, userId = null) => {
  try {
    // Check if user has given consent for functional cookies
    const consentData = localStorage.getItem('cookie_consent')
    if (!consentData) {
      return {
        averageRating: 0,
        reviewCount: 0,
        hasUserReviewed: false,
        // Allow opening the review modal even without consent; submission can still be blocked elsewhere if needed
        canReview: true
      }
    }

    const consent = JSON.parse(consentData)
    if (!consent.preferences.functional) {
      return {
        averageRating: 0,
        reviewCount: 0,
        hasUserReviewed: false,
        canReview: true
      }
    }

    const shopRatings = JSON.parse(localStorage.getItem('shop_ratings') || '{}')
    const userReviews = JSON.parse(localStorage.getItem('shop_reviews') || '{}')
    const userOrders = JSON.parse(localStorage.getItem('user_orders') || '{}')
    
    const shopData = shopRatings[shopId]
    const userReview = userId ? userReviews[`${shopId}_${userId}`] : null
    const userOrderHistory = userId ? userOrders[userId] : {}
    
    if (!shopData || shopData.count === 0) {
      return {
        averageRating: 0,
        reviewCount: 0,
        hasUserReviewed: !!userReview,
        // No order requirement; logged-in users can review
        canReview: !!userId
      }
    }
    
    const averageRating = shopData.totalRating / shopData.count
    
    return {
      averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal place
      reviewCount: shopData.count,
      hasUserReviewed: !!userReview,
      canReview: !!userId
    }
  } catch (error) {
    console.error('Error getting shop rating:', error)
    return {
      averageRating: 0,
      reviewCount: 0,
      hasUserReviewed: false
    }
  }
}

/**
 * Get user's review for a specific shop
 * @param {string} shopId - The shop ID
 * @param {string} userId - The authenticated user ID
 * @returns {object|null} - The user's review or null if not found
 */
export const getUserReview = (shopId, userId) => {
  if (!userId) return null
  
  try {
    const userReviews = JSON.parse(localStorage.getItem('shop_reviews') || '{}')
    return userReviews[`${shopId}_${userId}`] || null
  } catch (error) {
    console.error('Error getting user review:', error)
    return null
  }
}

/**
 * Get all reviews for a shop (for display purposes)
 * @param {string} shopId - The shop ID
 * @returns {array} - Array of reviews
 */
export const getAllReviewsForShop = (shopId) => {
  try {
    const userReviews = JSON.parse(localStorage.getItem('shop_reviews') || '{}')
    const shopRating = JSON.parse(localStorage.getItem('shop_ratings') || '{}')
    
    const reviews = []
    
    // Get all reviews for this shop
    Object.keys(userReviews).forEach(userShopId => {
      if (userShopId === shopId) {
        reviews.push({
          ...userReviews[userShopId],
          id: userShopId
        })
      }
    })
    
    return reviews.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  } catch (error) {
    console.error('Error getting all reviews for shop:', error)
    return []
  }
}

/**
 * Record a user order for a shop (called when order is placed)
 * @param {string} userId - The authenticated user ID
 * @param {string} shopId - The shop ID
 * @param {array} orderItems - Array of ordered items
 * @returns {boolean} - Success status
 */
export const recordUserOrder = (userId, shopId, orderItems) => {
  if (!userId || !shopId) return false
  
  try {
    const userOrders = JSON.parse(localStorage.getItem('user_orders') || '{}')
    
    if (!userOrders[userId]) {
      userOrders[userId] = {}
    }
    
    if (!userOrders[userId][shopId]) {
      userOrders[userId][shopId] = []
    }
    
    const orderRecord = {
      orderId: Date.now().toString(),
      shopId,
      items: orderItems,
      timestamp: new Date().toISOString(),
      status: 'completed'
    }
    
    userOrders[userId][shopId].push(orderRecord)
    localStorage.setItem('user_orders', JSON.stringify(userOrders))
    return true
  } catch (error) {
    console.error('Error recording user order:', error)
    return false
  }
}

/**
 * Add a new review (authenticated users only)
 * @param {string} userId - The authenticated user ID
 * @param {string} shopId - The shop ID
 * @param {number} rating - Rating from 1-5
 * @param {string} comment - Optional comment
 * @param {string} shopName - Shop name for reference
 * @returns {boolean} - Success status
 */
export const addAuthenticatedReview = (userId, shopId, rating, comment = '', shopName = '') => {
  if (!userId || !shopId || !rating) return false
  
  try {
    // Check if user has ordered from this shop
    const userOrders = JSON.parse(localStorage.getItem('user_orders') || '{}')
    const userOrderHistory = userOrders[userId] || {}
    const hasOrderedFromShop = userOrderHistory[shopId] && userOrderHistory[shopId].length > 0
    
    if (!hasOrderedFromShop) {
      console.warn('User has not ordered from this shop, cannot review')
      return false
    }
    
    // Save the review
    const userReviews = JSON.parse(localStorage.getItem('shop_reviews') || '{}')
    const reviewKey = `${shopId}_${userId}`
    
    userReviews[reviewKey] = {
      userId,
      shopId,
      rating,
      comment,
      shopName,
      timestamp: new Date().toISOString()
    }
    
    localStorage.setItem('shop_reviews', JSON.stringify(userReviews))
    
    // Update shop ratings
    const shopRatings = JSON.parse(localStorage.getItem('shop_ratings') || '{}')
    const existingReview = shopRatings[`${shopId}_${userId}`]
    
    if (!existingReview) {
      // New review
      if (!shopRatings[shopId]) {
        shopRatings[shopId] = { totalRating: 0, count: 0 }
      }
      shopRatings[shopId].totalRating += rating
      shopRatings[shopId].count += 1
    } else {
      // Update existing review
      shopRatings[shopId].totalRating = shopRatings[shopId].totalRating - existingReview.rating + rating
    }
    
    // Store the individual review for update tracking
    shopRatings[`${shopId}_${userId}`] = { rating, timestamp: new Date().toISOString() }
    
    localStorage.setItem('shop_ratings', JSON.stringify(shopRatings))
    return true
  } catch (error) {
    console.error('Error adding authenticated review:', error)
    return false
  }
}

/**
 * Get user's order history for a specific shop
 * @param {string} userId - The authenticated user ID
 * @param {string} shopId - The shop ID
 * @returns {array} - Array of orders from this shop
 */
export const getUserOrdersFromShop = (userId, shopId) => {
  if (!userId || !shopId) return []
  
  try {
    const userOrders = JSON.parse(localStorage.getItem('user_orders') || '{}')
    return userOrders[userId]?.[shopId] || []
  } catch (error) {
    console.error('Error getting user orders from shop:', error)
    return []
  }
}

/**
 * Clear all ratings and reviews (for testing purposes)
 */
export const clearAllRatings = () => {
  try {
    localStorage.removeItem('shop_ratings')
    localStorage.removeItem('shop_reviews')
    localStorage.removeItem('user_orders')
    console.log('All shop ratings, reviews, and orders cleared')
  } catch (error) {
    console.error('Error clearing ratings:', error)
  }
}

/**
 * Get statistics about ratings across all shops
 * @returns {object} - Statistics about ratings
 */
export const getRatingStatistics = () => {
  try {
    const shopRatings = JSON.parse(localStorage.getItem('shop_ratings') || '{}')
    const userReviews = JSON.parse(localStorage.getItem('shop_reviews') || '{}')
    
    const totalShops = Object.keys(shopRatings).length
    const totalReviews = Object.values(shopRatings).reduce((sum, shop) => sum + shop.count, 0)
    const totalUsers = Object.keys(userReviews).length
    
    const allRatings = Object.values(shopRatings).map(shop => ({
      average: shop.totalRating / shop.count,
      count: shop.count
    }))
    
    const overallAverage = allRatings.length > 0 
      ? allRatings.reduce((sum, shop) => sum + shop.average, 0) / allRatings.length
      : 0
    
    return {
      totalShops,
      totalReviews,
      totalUsers,
      overallAverage: Math.round(overallAverage * 10) / 10
    }
  } catch (error) {
    console.error('Error getting rating statistics:', error)
    return {
      totalShops: 0,
      totalReviews: 0,
      totalUsers: 0,
      overallAverage: 0
    }
  }
}
