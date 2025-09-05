/**
 * Smart cache invalidation service for frontend
 * Handles cache clearing based on data changes and backend events
 */

class CacheInvalidationService {
  constructor() {
    this.listeners = new Map()
    this.cacheServices = new Map()
    
    // Bind methods
    this.registerCacheService = this.registerCacheService.bind(this)
    this.onDataChanged = this.onDataChanged.bind(this)
    this.onShopChanged = this.onShopChanged.bind(this)
    this.onCategoryChanged = this.onCategoryChanged.bind(this)
    this.onProductChanged = this.onProductChanged.bind(this)
    this.onStockUpdated = this.onStockUpdated.bind(this)
    this.clearAllCaches = this.clearAllCaches.bind(this)
    this.addListener = this.addListener.bind(this)
    this.removeListener = this.removeListener.bind(this)
  }

  /**
   * Register a cache service (e.g., shopCache, categoriesCache, etc.)
   * @param {string} name - Cache service name
   * @param {Object} cacheService - Cache service instance
   */
  registerCacheService(name, cacheService) {
    this.cacheServices.set(name, cacheService)
    console.log(`CacheInvalidationService: Registered cache service: ${name}`)
  }

  /**
   * Add a listener for cache invalidation events
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  addListener(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, [])
    }
    this.listeners.get(event).push(callback)
  }

  /**
   * Remove a listener
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  removeListener(event, callback) {
    if (this.listeners.has(event)) {
      const callbacks = this.listeners.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  /**
   * Emit an event to all listeners
   * @param {string} event - Event name
   * @param {Object} data - Event data
   */
  emit(event, data = {}) {
    if (this.listeners.has(event)) {
      this.listeners.get(event).forEach(callback => {
        try {
          callback(data)
        } catch (error) {
          console.error(`CacheInvalidationService: Error in listener for ${event}:`, error)
        }
      })
    }
  }

  /**
   * Handle general data changes
   * @param {string} dataType - Type of data that changed
   * @param {string} operation - Operation performed (create, update, delete)
   * @param {Object} data - Additional data
   */
  onDataChanged(dataType, operation, data = {}) {
    console.log(`CacheInvalidationService: Data changed - ${dataType}:${operation}`, data)
    
    switch (dataType) {
      case 'shop':
        this.onShopChanged(operation, data)
        break
      case 'category':
        this.onCategoryChanged(operation, data)
        break
      case 'product':
        this.onProductChanged(operation, data)
        break
      case 'stock':
        this.onStockUpdated(data)
        break
      default:
        console.warn(`CacheInvalidationService: Unknown data type: ${dataType}`)
    }
  }

  /**
   * Handle shop data changes
   * @param {string} operation - Operation performed
   * @param {Object} data - Shop data
   */
  onShopChanged(operation, data = {}) {
    console.log(`CacheInvalidationService: Shop ${operation} - clearing related caches`)
    
    // Clear shop-related caches
    if (this.cacheServices.has('shopCache')) {
      this.cacheServices.get('shopCache').clear()
    }
    
    if (this.cacheServices.has('landingPageCache')) {
      this.cacheServices.get('landingPageCache').clear()
    }
    
    // Emit event for components to handle
    this.emit('shopChanged', { operation, data })
    
    // If shop was deleted, also clear product caches
    if (operation === 'delete') {
      this.onProductChanged('delete', { shopId: data.id })
    }
  }

  /**
   * Handle category data changes
   * @param {string} operation - Operation performed
   * @param {Object} data - Category data
   */
  onCategoryChanged(operation, data = {}) {
    console.log(`CacheInvalidationService: Category ${operation} - clearing related caches`)
    
    // Clear category caches
    if (this.cacheServices.has('categoriesCache')) {
      this.cacheServices.get('categoriesCache').clear()
    }
    
    // Categories affect shops, so clear shop caches too
    if (this.cacheServices.has('shopCache')) {
      this.cacheServices.get('shopCache').clear()
    }
    
    if (this.cacheServices.has('landingPageCache')) {
      this.cacheServices.get('landingPageCache').clear()
    }
    
    // Emit event for components to handle
    this.emit('categoryChanged', { operation, data })
  }

  /**
   * Handle product data changes
   * @param {string} operation - Operation performed
   * @param {Object} data - Product data
   */
  onProductChanged(operation, data = {}) {
    console.log(`CacheInvalidationService: Product ${operation} - clearing related caches`)
    
    // Clear product-related caches
    if (this.cacheServices.has('productCache')) {
      this.cacheServices.get('productCache').clear()
    }
    
    // Products belong to shops, so clear shop caches if needed
    if (operation === 'create' || operation === 'delete') {
      if (this.cacheServices.has('shopCache')) {
        this.cacheServices.get('shopCache').clear()
      }
    }
    
    // Emit event for components to handle
    this.emit('productChanged', { operation, data })
  }

  /**
   * Handle stock updates
   * @param {Object} data - Stock update data
   */
  onStockUpdated(data = {}) {
    console.log('CacheInvalidationService: Stock updated - clearing product caches')
    
    // Clear product caches
    if (this.cacheServices.has('productCache')) {
      this.cacheServices.get('productCache').clear()
    }
    
    // Emit event for components to handle
    this.emit('stockUpdated', data)
  }

  /**
   * Clear all caches (nuclear option)
   */
  clearAllCaches() {
    console.log('CacheInvalidationService: Clearing all caches')
    
    this.cacheServices.forEach((cacheService, name) => {
      try {
        cacheService.clear()
        console.log(`CacheInvalidationService: Cleared ${name}`)
      } catch (error) {
        console.error(`CacheInvalidationService: Error clearing ${name}:`, error)
      }
    })
    
    // Emit event for components to handle
    this.emit('allCachesCleared')
  }

  /**
   * Get cache statistics
   * @returns {Object} Cache statistics
   */
  getCacheStats() {
    const stats = {}
    this.cacheServices.forEach((cacheService, name) => {
      try {
        if (typeof cacheService.getStats === 'function') {
          stats[name] = cacheService.getStats()
        } else {
          stats[name] = { exists: true, method: 'getStats not available' }
        }
      } catch (error) {
        stats[name] = { error: error.message }
      }
    })
    return stats
  }

  /**
   * Simulate backend cache invalidation event
   * This would typically be called when receiving events from the backend
   * @param {string} eventType - Type of backend event
   * @param {Object} data - Event data
   */
  onBackendEvent(eventType, data = {}) {
    console.log(`CacheInvalidationService: Backend event received - ${eventType}`, data)
    
    switch (eventType) {
      case 'SHOP_CREATED':
      case 'SHOP_UPDATED':
        this.onShopChanged(eventType.split('_')[1].toLowerCase(), data)
        break
      case 'SHOP_DELETED':
        this.onShopChanged('delete', data)
        break
      case 'CATEGORY_CREATED':
      case 'CATEGORY_UPDATED':
        this.onCategoryChanged(eventType.split('_')[1].toLowerCase(), data)
        break
      case 'CATEGORY_DELETED':
        this.onCategoryChanged('delete', data)
        break
      case 'PRODUCT_CREATED':
      case 'PRODUCT_UPDATED':
        this.onProductChanged(eventType.split('_')[1].toLowerCase(), data)
        break
      case 'PRODUCT_DELETED':
        this.onProductChanged('delete', data)
        break
      case 'STOCK_UPDATED':
        this.onStockUpdated(data)
        break
      default:
        console.warn(`CacheInvalidationService: Unknown backend event: ${eventType}`)
    }
  }
}

// Create a singleton instance
const cacheInvalidationService = new CacheInvalidationService()

export default cacheInvalidationService
