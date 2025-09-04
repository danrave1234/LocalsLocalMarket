/**
 * Global shop cache utility to prevent duplicate API calls
 */

class ShopCache {
  constructor() {
    this.cache = new Map()
    this.cacheExpiry = 5 * 60 * 1000 // 5 minutes in milliseconds
    
    // Separate caches for ratings and reviews
    this.ratingsCache = new Map()
    this.reviewsCache = new Map()
    
    // Bind methods to ensure they're properly accessible
    this.set = this.set.bind(this)
    this.get = this.get.bind(this)
    this.has = this.has.bind(this)
    this.delete = this.delete.bind(this)
    this.clear = this.clear.bind(this)
    this.getStats = this.getStats.bind(this)
    this.cleanup = this.cleanup.bind(this)
    
    // Ratings and reviews methods
    this.setRatings = this.setRatings.bind(this)
    this.getRatings = this.getRatings.bind(this)
    this.setReviews = this.setReviews.bind(this)
    this.getReviews = this.getReviews.bind(this)
  }

  /**
   * Store shop data in cache
   * @param {number} shopId - The shop ID
   * @param {Object} shopData - The shop data to cache
   */
  set(shopId, shopData) {
    const cacheEntry = {
      data: shopData,
      timestamp: Date.now(),
      expiry: Date.now() + this.cacheExpiry
    }
    this.cache.set(shopId.toString(), cacheEntry)
    console.log(`ShopCache: Cached shop ${shopId}`)
  }

  /**
   * Get shop data from cache
   * @param {number} shopId - The shop ID
   * @returns {Object|null} The cached shop data or null if not found/expired
   */
  get(shopId) {
    const cacheEntry = this.cache.get(shopId.toString())
    
    if (!cacheEntry) {
      console.log(`ShopCache: No cache entry for shop ${shopId}`)
      return null
    }

    // Check if cache has expired
    if (Date.now() > cacheEntry.expiry) {
      console.log(`ShopCache: Cache expired for shop ${shopId}`)
      this.cache.delete(shopId.toString())
      return null
    }

    console.log(`ShopCache: Using cached data for shop ${shopId}`)
    return cacheEntry.data
  }

  /**
   * Store ratings data in cache
   * @param {number} shopId - The shop ID
   * @param {Object} ratingsData - The ratings data to cache
   */
  setRatings(shopId, ratingsData) {
    const cacheEntry = {
      data: ratingsData,
      timestamp: Date.now(),
      expiry: Date.now() + this.cacheExpiry
    }
    this.ratingsCache.set(shopId.toString(), cacheEntry)
    console.log(`ShopCache: Cached ratings for shop ${shopId}`)
  }

  /**
   * Get ratings data from cache
   * @param {number} shopId - The shop ID
   * @returns {Object|null} The cached ratings data or null if not found/expired
   */
  getRatings(shopId) {
    const cacheEntry = this.ratingsCache.get(shopId.toString())
    
    if (!cacheEntry) {
      console.log(`ShopCache: No cached ratings for shop ${shopId}`)
      return null
    }

    // Check if cache has expired
    if (Date.now() > cacheEntry.expiry) {
      console.log(`ShopCache: Ratings cache expired for shop ${shopId}`)
      this.ratingsCache.delete(shopId.toString())
      return null
    }

    console.log(`ShopCache: Using cached ratings for shop ${shopId}`)
    return cacheEntry.data
  }

  /**
   * Store reviews data in cache
   * @param {number} shopId - The shop ID
   * @param {Object} reviewsData - The reviews data to cache
   */
  setReviews(shopId, reviewsData) {
    const cacheEntry = {
      data: reviewsData,
      timestamp: Date.now(),
      expiry: Date.now() + this.cacheExpiry
    }
    this.reviewsCache.set(shopId.toString(), cacheEntry)
    console.log(`ShopCache: Cached reviews for shop ${shopId}`)
  }

  /**
   * Get reviews data from cache
   * @param {number} shopId - The shop ID
   * @returns {Object|null} The cached reviews data or null if not found/expired
   */
  getReviews(shopId) {
    const cacheEntry = this.reviewsCache.get(shopId.toString())
    
    if (!cacheEntry) {
      console.log(`ShopCache: No cached reviews for shop ${shopId}`)
      return null
    }

    // Check if cache has expired
    if (Date.now() > cacheEntry.expiry) {
      console.log(`ShopCache: Reviews cache expired for shop ${shopId}`)
      this.reviewsCache.delete(shopId.toString())
      return null
    }

    console.log(`ShopCache: Using cached reviews for shop ${shopId}`)
    return cacheEntry.data
  }

  /**
   * Check if shop data exists in cache and is valid
   * @param {number} shopId - The shop ID
   * @returns {boolean} True if valid cache exists
   */
  has(shopId) {
    const cacheEntry = this.cache.get(shopId.toString())
    
    if (!cacheEntry) {
      return false
    }

    // Check if cache has expired
    if (Date.now() > cacheEntry.expiry) {
      this.cache.delete(shopId.toString())
      return false
    }

    return true
  }

  /**
   * Remove a specific shop from cache
   * @param {number} shopId - The shop ID
   */
  delete(shopId) {
    this.cache.delete(shopId.toString())
    this.ratingsCache.delete(shopId.toString())
    this.reviewsCache.delete(shopId.toString())
  }

  /**
   * Clear all cached data
   */
  clear() {
    this.cache.clear()
    this.ratingsCache.clear()
    this.reviewsCache.clear()
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    const now = Date.now()
    let validEntries = 0
    let expiredEntries = 0

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        expiredEntries++
      } else {
        validEntries++
      }
    }

    return {
      total: this.cache.size,
      valid: validEntries,
      expired: expiredEntries,
      ratingsCacheSize: this.ratingsCache.size,
      reviewsCacheSize: this.reviewsCache.size
    }
  }

  /**
   * Clean up expired entries
   */
  cleanup() {
    const now = Date.now()
    let cleanedCount = 0

    // Clean shop cache
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiry) {
        this.cache.delete(key)
        cleanedCount++
      }
    }

    // Clean ratings cache
    for (const [key, entry] of this.ratingsCache.entries()) {
      if (now > entry.expiry) {
        this.ratingsCache.delete(key)
        cleanedCount++
      }
    }

    // Clean reviews cache
    for (const [key, entry] of this.reviewsCache.entries()) {
      if (now > entry.expiry) {
        this.reviewsCache.delete(key)
        cleanedCount++
      }
    }

    if (cleanedCount > 0) {
      console.log(`ShopCache: Cleaned up ${cleanedCount} expired entries`)
    }
  }
}

// Create a singleton instance
const shopCache = new ShopCache()

// Clean up expired entries every minute
setInterval(() => {
  shopCache.cleanup()
}, 60 * 1000)

export default shopCache
