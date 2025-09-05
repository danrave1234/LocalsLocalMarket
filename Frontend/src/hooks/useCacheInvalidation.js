/**
 * React hook for cache invalidation
 * Provides easy access to cache invalidation functions in components
 */

import { useEffect, useCallback } from 'react'
import cacheInvalidationService from '../utils/cacheInvalidationService.js'

export const useCacheInvalidation = () => {
  // Register cache invalidation listeners
  useEffect(() => {
    const handleShopChanged = (data) => {
      console.log('Component: Shop changed, refreshing data...', data)
      // Components can listen to these events and refresh their data
    }

    const handleCategoryChanged = (data) => {
      console.log('Component: Category changed, refreshing data...', data)
      // Components can listen to these events and refresh their data
    }

    const handleProductChanged = (data) => {
      console.log('Component: Product changed, refreshing data...', data)
      // Components can listen to these events and refresh their data
    }

    const handleStockUpdated = (data) => {
      console.log('Component: Stock updated, refreshing data...', data)
      // Components can listen to these events and refresh their data
    }

    const handleAllCachesCleared = () => {
      console.log('Component: All caches cleared, refreshing data...')
      // Components can listen to this event and refresh their data
    }

    // Add listeners
    cacheInvalidationService.addListener('shopChanged', handleShopChanged)
    cacheInvalidationService.addListener('categoryChanged', handleCategoryChanged)
    cacheInvalidationService.addListener('productChanged', handleProductChanged)
    cacheInvalidationService.addListener('stockUpdated', handleStockUpdated)
    cacheInvalidationService.addListener('allCachesCleared', handleAllCachesCleared)

    // Cleanup listeners on unmount
    return () => {
      cacheInvalidationService.removeListener('shopChanged', handleShopChanged)
      cacheInvalidationService.removeListener('categoryChanged', handleCategoryChanged)
      cacheInvalidationService.removeListener('productChanged', handleProductChanged)
      cacheInvalidationService.removeListener('stockUpdated', handleStockUpdated)
      cacheInvalidationService.removeListener('allCachesCleared', handleAllCachesCleared)
    }
  }, [])

  // Return cache invalidation functions
  return {
    // Data change functions
    onShopChanged: useCallback((operation, data) => {
      cacheInvalidationService.onDataChanged('shop', operation, data)
    }, []),
    
    onCategoryChanged: useCallback((operation, data) => {
      cacheInvalidationService.onDataChanged('category', operation, data)
    }, []),
    
    onProductChanged: useCallback((operation, data) => {
      cacheInvalidationService.onDataChanged('product', operation, data)
    }, []),
    
    onStockUpdated: useCallback((data) => {
      cacheInvalidationService.onDataChanged('stock', 'update', data)
    }, []),
    
    // Utility functions
    clearAllCaches: useCallback(() => {
      cacheInvalidationService.clearAllCaches()
    }, []),
    
    getCacheStats: useCallback(() => {
      return cacheInvalidationService.getCacheStats()
    }, []),
    
    // Backend event simulation (for testing)
    onBackendEvent: useCallback((eventType, data) => {
      cacheInvalidationService.onBackendEvent(eventType, data)
    }, [])
  }
}

export default useCacheInvalidation
