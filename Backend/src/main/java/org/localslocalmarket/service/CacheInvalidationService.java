package org.localslocalmarket.service;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

/**
 * Smart cache invalidation service that handles cache clearing based on data changes
 */
@Service
public class CacheInvalidationService {

    @Autowired
    private CacheManager cacheManager;

    /**
     * Clear all caches (nuclear option)
     */
    public void clearAllCaches() {
        System.out.println("CacheInvalidationService: Clearing all caches");
        cacheManager.getCacheNames().forEach(cacheName -> {
            Cache cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                cache.clear();
                System.out.println("CacheInvalidationService: Cleared cache: " + cacheName);
            }
        });
    }

    /**
     * Clear shop-related caches
     */
    public void clearShopCaches() {
        System.out.println("CacheInvalidationService: Clearing shop caches");
        List<String> shopCaches = Arrays.asList(
            "shops_by_id",
            "shops_list", 
            "all_shops",
            "shops_paginated"
        );
        clearSpecificCaches(shopCaches);
    }

    /**
     * Clear category-related caches
     */
    public void clearCategoryCaches() {
        System.out.println("CacheInvalidationService: Clearing category caches");
        List<String> categoryCaches = Arrays.asList("categories");
        clearSpecificCaches(categoryCaches);
    }

    /**
     * Clear product-related caches
     */
    public void clearProductCaches() {
        System.out.println("CacheInvalidationService: Clearing product caches");
        List<String> productCaches = Arrays.asList(
            "products_by_id",
            "products_list",
            "products_by_shop",
            "products_by_category",
            "products_by_subcategory"
        );
        clearSpecificCaches(productCaches);
    }

    /**
     * Clear caches when shop data changes (affects shops, products, and landing page)
     */
    public void onShopDataChanged() {
        System.out.println("CacheInvalidationService: Shop data changed - clearing related caches");
        clearShopCaches();
        clearProductCaches(); // Products belong to shops
        // Note: Frontend will handle landing page cache clearing via events
    }

    /**
     * Clear caches when category data changes (affects categories and shops)
     */
    public void onCategoryDataChanged() {
        System.out.println("CacheInvalidationService: Category data changed - clearing related caches");
        clearCategoryCaches();
        clearShopCaches(); // Shops use categories
        // Note: Frontend will handle category cache clearing via events
    }

    /**
     * Clear caches when product data changes (affects products and potentially shops)
     */
    public void onProductDataChanged() {
        System.out.println("CacheInvalidationService: Product data changed - clearing related caches");
        clearProductCaches();
        // Note: Frontend will handle product cache clearing via events
    }

    /**
     * Clear caches when stock is updated (affects products)
     */
    public void onStockUpdated() {
        System.out.println("CacheInvalidationService: Stock updated - clearing product caches");
        clearProductCaches();
    }

    /**
     * Clear specific caches by name
     */
    private void clearSpecificCaches(List<String> cacheNames) {
        cacheNames.forEach(cacheName -> {
            Cache cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                cache.clear();
                System.out.println("CacheInvalidationService: Cleared cache: " + cacheName);
            } else {
                System.out.println("CacheInvalidationService: Cache not found: " + cacheName);
            }
        });
    }

    /**
     * Get cache statistics for monitoring
     */
    public void logCacheStats() {
        System.out.println("=== Cache Statistics ===");
        cacheManager.getCacheNames().forEach(cacheName -> {
            Cache cache = cacheManager.getCache(cacheName);
            if (cache != null) {
                System.out.println("Cache: " + cacheName + " - Native Cache: " + cache.getNativeCache().getClass().getSimpleName());
            }
        });
    }
}
