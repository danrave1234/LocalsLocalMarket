/**
 * Landing page cache utility for persistent caching of shop data
 * This helps reduce database usage by caching landing page data in localStorage
 */

class LandingPageCache {
  constructor() {
    this.cacheKey = 'landing_page_shops_cache'
    this.cacheExpiryKey = 'landing_page_shops_cache_expiry'
    this.cacheVersionKey = 'landing_page_shops_cache_version'
    this.currentVersion = '1.0.0' // Increment when cache structure changes
    this.cacheExpiry = 10 * 60 * 1000 // 10 minutes in milliseconds
    
    // Bind methods
    this.set = this.set.bind(this)
    this.get = this.get.bind(this)
    this.has = this.has.bind(this)
    this.clear = this.clear.bind(this)
    this.isExpired = this.isExpired.bind(this)
    this.getStats = this.getStats.bind(this)
  }

  /**
   * Store landing page data in localStorage
   * @param {Array} shopsData - Array of shop data
   * @param {number} page - Page number
   * @param {number} totalPages - Total pages available
   */
  set(shopsData, page = 0, totalPages = null) {
    try {
      const cacheData = {
        shops: shopsData,
        page: page,
        totalPages: totalPages,
        timestamp: Date.now(),
        version: this.currentVersion
      }
      
      localStorage.setItem(this.cacheKey, JSON.stringify(cacheData))
      localStorage.setItem(this.cacheExpiryKey, (Date.now() + this.cacheExpiry).toString())
      localStorage.setItem(this.cacheVersionKey, this.currentVersion)
      
      console.log(`LandingPageCache: Cached ${shopsData.length} shops for page ${page}`)
      return true
    } catch (error) {
      console.error('LandingPageCache: Failed to cache data:', error)
      return false
    }
  }

  /**
   * Get landing page data from localStorage
   * @returns {Object|null} Cached data or null if not found/expired
   */
  get() {
    try {
      // Check if cache exists
      const cacheData = localStorage.getItem(this.cacheKey)
      const expiryData = localStorage.getItem(this.cacheExpiryKey)
      const versionData = localStorage.getItem(this.cacheVersionKey)
      
      if (!cacheData || !expiryData || !versionData) {
        console.log('LandingPageCache: No cache data found')
        return null
      }

      // Check version compatibility
      if (versionData !== this.currentVersion) {
        console.log(`LandingPageCache: Version mismatch (${versionData} vs ${this.currentVersion}), clearing cache`)
        this.clear()
        return null
      }

      // Check if cache has expired
      const expiry = parseInt(expiryData)
      if (Date.now() > expiry) {
        console.log('LandingPageCache: Cache expired')
        this.clear()
        return null
      }

      const parsed = JSON.parse(cacheData)
      console.log(`LandingPageCache: Cache HIT! Retrieved ${parsed.shops.length} shops for page ${parsed.page}`)
      return parsed
    } catch (error) {
      console.error('LandingPageCache: Failed to retrieve cache:', error)
      this.clear()
      return null
    }
  }

  /**
   * Check if valid cache exists
   * @returns {boolean} True if valid cache exists
   */
  has() {
    const cacheData = this.get()
    return cacheData !== null
  }

  /**
   * Check if cache is expired
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
   * Clear all cached data
   */
  clear() {
    try {
      localStorage.removeItem(this.cacheKey)
      localStorage.removeItem(this.cacheExpiryKey)
      localStorage.removeItem(this.cacheVersionKey)
      console.log('LandingPageCache: Cache cleared')
    } catch (error) {
      console.error('LandingPageCache: Failed to clear cache:', error)
    }
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getStats() {
    try {
      const cacheData = localStorage.getItem(this.cacheKey)
      const expiryData = localStorage.getItem(this.cacheExpiryKey)
      
      if (!cacheData || !expiryData) {
        return { exists: false }
      }

      const parsed = JSON.parse(cacheData)
      const expiry = parseInt(expiryData)
      const timeLeft = Math.max(0, expiry - Date.now())
      
      return {
        exists: true,
        shopCount: parsed.shops.length,
        page: parsed.page,
        totalPages: parsed.totalPages,
        timestamp: parsed.timestamp,
        version: parsed.version,
        timeLeftMs: timeLeft,
        timeLeftMinutes: Math.round(timeLeft / (60 * 1000) * 10) / 10,
        isExpired: timeLeft <= 0
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
        console.log(`LandingPageCache: Extended cache expiry by ${additionalMs}ms`)
      }
    } catch (error) {
      console.error('LandingPageCache: Failed to extend expiry:', error)
    }
  }

  /**
   * Update cache with new shops (append mode)
   * @param {Array} newShops - New shops to append
   * @param {number} page - Current page
   */
  appendShops(newShops, page) {
    try {
      const existing = this.get()
      if (existing) {
        const updatedShops = [...existing.shops, ...newShops]
        this.set(updatedShops, page, existing.totalPages)
        console.log(`LandingPageCache: Appended ${newShops.length} shops, total: ${updatedShops.length}`)
      } else {
        this.set(newShops, page)
      }
    } catch (error) {
      console.error('LandingPageCache: Failed to append shops:', error)
    }
  }
}

// Create a singleton instance
const landingPageCache = new LandingPageCache()

export default landingPageCache
