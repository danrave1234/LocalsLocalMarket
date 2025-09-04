/**
 * Global categories cache utility to prevent duplicate API calls
 */

class CategoriesCache {
  constructor() {
    this.cache = null
    this.cacheExpiry = 30 * 60 * 1000 // 30 minutes in milliseconds (categories change rarely)
    this.lastFetch = 0
    this.isLoading = false
    this.loadingPromise = null
    
    // Bind methods to ensure they're properly accessible
    this.get = this.get.bind(this)
    this.set = this.set.bind(this)
    this.clear = this.clear.bind(this)
    this.isExpired = this.isExpired.bind(this)
    this.getStats = this.getStats.bind(this)
  }

  /**
   * Check if cache has expired
   * @returns {boolean} True if cache is expired
   */
  isExpired() {
    return Date.now() > this.lastFetch + this.cacheExpiry
  }

  /**
   * Get categories from cache
   * @returns {Array|null} The cached categories or null if not found/expired
   */
  get() {
    if (!this.cache || this.isExpired()) {
      console.log('CategoriesCache: No valid cache, categories need to be fetched')
      return null
    }

    console.log('CategoriesCache: Using cached categories')
    return this.cache
  }

  /**
   * Store categories in cache
   * @param {Array} categories - The categories data to cache
   */
  set(categories) {
    this.cache = categories
    this.lastFetch = Date.now()
    console.log(`CategoriesCache: Cached ${categories.length} categories`)
  }

  /**
   * Clear cached categories
   */
  clear() {
    this.cache = null
    this.lastFetch = 0
    console.log('CategoriesCache: Cleared categories cache')
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    return {
      hasCache: this.cache !== null,
      isExpired: this.isExpired(),
      lastFetch: this.lastFetch,
      isLoading: this.isLoading,
      cacheAge: this.lastFetch ? Date.now() - this.lastFetch : 0
    }
  }

  /**
   * Set loading state to prevent duplicate fetches
   * @param {boolean} loading - Loading state
   * @param {Promise} promise - The loading promise
   */
  setLoading(loading, promise = null) {
    this.isLoading = loading
    this.loadingPromise = promise
  }

  /**
   * Check if categories are currently being loaded
   * @returns {boolean} True if loading
   */
  getLoadingState() {
    return this.isLoading
  }

  /**
   * Get the current loading promise (for deduplication)
   * @returns {Promise|null} The loading promise or null
   */
  getLoadingPromise() {
    return this.loadingPromise
  }
}

// Create a singleton instance
const categoriesCache = new CategoriesCache()

export default categoriesCache
