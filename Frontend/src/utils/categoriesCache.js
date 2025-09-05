/**
 * Enhanced categories cache utility with localStorage persistence
 * This helps reduce database usage by caching category data persistently
 */

class CategoriesCache {
  constructor() {
    this.cacheKey = 'categories_cache'
    this.cacheExpiryKey = 'categories_cache_expiry'
    this.cacheVersionKey = 'categories_cache_version'
    this.currentVersion = '1.0.0' // Increment when cache structure changes
    this.cacheExpiry = 60 * 60 * 1000 // 60 minutes in milliseconds (categories change rarely)
    
    // In-memory cache for faster access
    this.memoryCache = null
    this.lastFetch = 0
    this.isLoading = false
    this.loadingPromise = null
    
    // Bind methods to ensure they're properly accessible
    this.get = this.get.bind(this)
    this.set = this.set.bind(this)
    this.clear = this.clear.bind(this)
    this.isExpired = this.isExpired.bind(this)
    this.getStats = this.getStats.bind(this)
    this.setLoading = this.setLoading.bind(this)
    this.getLoadingState = this.getLoadingState.bind(this)
    this.getLoadingPromise = this.getLoadingPromise.bind(this)
  }

  /**
   * Check if cache has expired
   * @returns {boolean} True if cache is expired
   */
  isExpired() {
    try {
      const expiryData = localStorage.getItem(this.cacheExpiryKey)
      if (!expiryData) return true
      
      const expiry = parseInt(expiryData)
      return Date.now() > expiry
    } catch (error) {
      return true
    }
  }

  /**
   * Get categories from cache (localStorage + memory)
   * @returns {Array|null} The cached categories or null if not found/expired
   */
  get() {
    try {
      // Check memory cache first (fastest)
      if (this.memoryCache && !this.isExpired()) {
        // Using memory cache
        return this.memoryCache
      }

      // Check localStorage cache
      const cacheData = localStorage.getItem(this.cacheKey)
      const expiryData = localStorage.getItem(this.cacheExpiryKey)
      const versionData = localStorage.getItem(this.cacheVersionKey)
      
      if (!cacheData || !expiryData || !versionData) {
        // No cache data found
        return null
      }

      // Check version compatibility
      if (versionData !== this.currentVersion) {
        // Version mismatch, clearing cache
        this.clear()
        return null
      }

      // Check if cache has expired
      const expiry = parseInt(expiryData)
      if (Date.now() > expiry) {
        // Cache expired
        this.clear()
        return null
      }

      const parsed = JSON.parse(cacheData)
      this.memoryCache = parsed // Update memory cache
      this.lastFetch = Date.now()
      
      // Cache HIT! Retrieved categories from localStorage
      return parsed
    } catch (error) {
      console.error('CategoriesCache: Failed to retrieve cache:', error)
      this.clear()
      return null
    }
  }

  /**
   * Store categories in cache (localStorage + memory)
   * @param {Array} categories - The categories data to cache
   */
  set(categories) {
    try {
      // Update memory cache
      this.memoryCache = categories
      this.lastFetch = Date.now()
      
      // Store in localStorage
      localStorage.setItem(this.cacheKey, JSON.stringify(categories))
      localStorage.setItem(this.cacheExpiryKey, (Date.now() + this.cacheExpiry).toString())
      localStorage.setItem(this.cacheVersionKey, this.currentVersion)
      
      // Cached categories in localStorage and memory
    } catch (error) {
      console.error('CategoriesCache: Failed to cache data:', error)
      // Still update memory cache even if localStorage fails
      this.memoryCache = categories
      this.lastFetch = Date.now()
    }
  }

  /**
   * Clear cached categories (localStorage + memory)
   */
  clear() {
    try {
      localStorage.removeItem(this.cacheKey)
      localStorage.removeItem(this.cacheExpiryKey)
      localStorage.removeItem(this.cacheVersionKey)
    } catch (error) {
      console.error('CategoriesCache: Failed to clear localStorage:', error)
    }
    
    this.memoryCache = null
    this.lastFetch = 0
    // Cleared categories cache
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    try {
      const cacheData = localStorage.getItem(this.cacheKey)
      const expiryData = localStorage.getItem(this.cacheExpiryKey)
      const versionData = localStorage.getItem(this.cacheVersionKey)
      
      if (!cacheData || !expiryData || !versionData) {
        return { exists: false }
      }

      const parsed = JSON.parse(cacheData)
      const expiry = parseInt(expiryData)
      const timeLeft = Math.max(0, expiry - Date.now())
      
      return {
        exists: true,
        categoryCount: parsed.length,
        version: versionData,
        timeLeftMs: timeLeft,
        timeLeftMinutes: Math.round(timeLeft / (60 * 1000) * 10) / 10,
        isExpired: timeLeft <= 0,
        hasMemoryCache: this.memoryCache !== null,
        isLoading: this.isLoading,
        lastFetch: this.lastFetch
      }
    } catch (error) {
      return { exists: false, error: error.message }
    }
  }

  /**
   * Extend cache expiry by additional time
   * @param {number} additionalMs - Additional milliseconds to extend cache
   */
  extendExpiry(additionalMs = this.cacheExpiry) {
    try {
      const currentExpiry = localStorage.getItem(this.cacheExpiryKey)
      if (currentExpiry) {
        const newExpiry = parseInt(currentExpiry) + additionalMs
        localStorage.setItem(this.cacheExpiryKey, newExpiry.toString())
        // Extended cache expiry
      }
    } catch (error) {
      console.error('CategoriesCache: Failed to extend expiry:', error)
    }
  }

  /**
   * Force refresh cache (clear and mark for reload)
   */
  forceRefresh() {
    // Force refreshing cache
    this.clear()
    this.setLoading(false, null)
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
