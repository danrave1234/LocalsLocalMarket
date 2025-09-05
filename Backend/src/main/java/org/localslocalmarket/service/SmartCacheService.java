package org.localslocalmarket.service;

import java.time.Duration;
import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

/**
 * Smart cache service with intelligent cache release mechanisms
 */
@Service
public class SmartCacheService {

    @Autowired
    private CacheManager cacheManager;

    private final ScheduledExecutorService scheduler = Executors.newScheduledThreadPool(2);
    private final ConcurrentHashMap<String, Instant> cacheAccessTimes = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Integer> cacheAccessCounts = new ConcurrentHashMap<>();

    @PostConstruct
    public void initialize() {
        // Start smart cache cleanup every 5 minutes
        scheduler.scheduleAtFixedRate(this::performSmartCacheCleanup, 5, 5, TimeUnit.MINUTES);
        
        // Start cache statistics collection every 10 minutes
        scheduler.scheduleAtFixedRate(this::collectCacheStatistics, 10, 10, TimeUnit.MINUTES);
    }

    @PreDestroy
    public void shutdown() {
        scheduler.shutdown();
        try {
            if (!scheduler.awaitTermination(30, TimeUnit.SECONDS)) {
                scheduler.shutdownNow();
            }
        } catch (InterruptedException e) {
            scheduler.shutdownNow();
            Thread.currentThread().interrupt();
        }
    }

    /**
     * Record cache access for smart eviction
     */
    public void recordCacheAccess(String cacheName, String key) {
        String fullKey = cacheName + ":" + key;
        cacheAccessTimes.put(fullKey, Instant.now());
        cacheAccessCounts.merge(fullKey, 1, Integer::sum);
    }

    /**
     * Smart cache cleanup based on access patterns
     */
    private void performSmartCacheCleanup() {
        try {
            Instant cutoffTime = Instant.now().minus(Duration.ofMinutes(30));
            
            cacheAccessTimes.entrySet().removeIf(entry -> {
                if (entry.getValue().isBefore(cutoffTime)) {
                    String[] parts = entry.getKey().split(":", 2);
                    if (parts.length == 2) {
                        String cacheName = parts[0];
                        String key = parts[1];
                        
                        Cache cache = cacheManager.getCache(cacheName);
                        if (cache != null) {
                            cache.evict(key);
                        }
                    }
                    cacheAccessCounts.remove(entry.getKey());
                    return true;
                }
                return false;
            });
            
            // Smart cache cleanup performed
        } catch (Exception e) {
            System.err.println("SmartCacheService: Error during cache cleanup: " + e.getMessage());
        }
    }

    /**
     * Collect cache statistics for monitoring
     */
    private void collectCacheStatistics() {
        try {
            // Cache statistics available
            
            // Log cache manager statistics
            cacheManager.getCacheNames().forEach(cacheName -> {
                Cache cache = cacheManager.getCache(cacheName);
                if (cache != null) {
                    // Cache: " + cacheName + " - Native: " + 
                    // cache.getNativeCache().getClass().getSimpleName()
                }
            });
        } catch (Exception e) {
            System.err.println("SmartCacheService: Error collecting statistics: " + e.getMessage());
        }
    }

    /**
     * Force evict least recently used entries from a specific cache
     */
    public void evictLeastRecentlyUsed(String cacheName, int maxEntries) {
        try {
            Cache cache = cacheManager.getCache(cacheName);
            if (cache == null) return;

            cacheAccessTimes.entrySet().stream()
                .filter(entry -> entry.getKey().startsWith(cacheName + ":"))
                .sorted((e1, e2) -> e1.getValue().compareTo(e2.getValue()))
                .limit(maxEntries)
                .forEach(entry -> {
                    String[] parts = entry.getKey().split(":", 2);
                    if (parts.length == 2) {
                        cache.evict(parts[1]);
                        cacheAccessTimes.remove(entry.getKey());
                        cacheAccessCounts.remove(entry.getKey());
                    }
                });
                
            // Evicted LRU entries from " + cacheName
        } catch (Exception e) {
            System.err.println("SmartCacheService: Error evicting LRU entries: " + e.getMessage());
        }
    }

    /**
     * Get cache hit ratio for monitoring
     */
    public double getCacheHitRatio(String cacheName) {
        // This would require cache statistics from the underlying cache implementation
        // For now, return a placeholder
        return 0.0;
    }

    /**
     * Warm up frequently accessed caches
     */
    public void warmupFrequentlyAccessedCaches() {
        try {
            // This could preload common queries
            // Warming up frequently accessed caches
        } catch (Exception e) {
            System.err.println("SmartCacheService: Error warming up caches: " + e.getMessage());
        }
    }

    /**
     * Evict service-related caches based on access patterns
     */
    public void evictLeastRecentlyUsedServiceCaches(int maxEntries) {
        try {
            String[] serviceCacheNames = {
                "services_paginated",
                "services_by_status_paginated",
                "services_by_shop_paginated",
                "services_by_shop_status_paginated",
                "services_by_category_paginated",
                "services_by_category_status_paginated",
                "services_filtered_paginated",
                "services_by_price_paginated",
                "services_by_shop_price_paginated",
                "services_by_category_price_paginated"
            };

            for (String cacheName : serviceCacheNames) {
                evictLeastRecentlyUsed(cacheName, maxEntries);
            }
        } catch (Exception e) {
            System.err.println("SmartCacheService: Error evicting service caches: " + e.getMessage());
        }
    }

    /**
     * Evict service caches for a specific shop
     */
    public void evictShopServiceCaches(Long shopId) {
        try {
            String[] shopServiceCacheNames = {
                "services_by_shop_paginated",
                "services_by_shop_status_paginated",
                "services_by_shop_price_paginated"
            };

            for (String cacheName : shopServiceCacheNames) {
                Cache cache = cacheManager.getCache(cacheName);
                if (cache != null) {
                    // Evict all entries that contain the shop ID
                    cacheAccessTimes.entrySet().removeIf(entry -> {
                        if (entry.getKey().startsWith(cacheName + ":") && entry.getKey().contains(shopId.toString())) {
                            String[] parts = entry.getKey().split(":", 2);
                            if (parts.length == 2) {
                                cache.evict(parts[1]);
                            }
                            cacheAccessCounts.remove(entry.getKey());
                            return true;
                        }
                        return false;
                    });
                }
            }
        } catch (Exception e) {
            System.err.println("SmartCacheService: Error evicting shop service caches: " + e.getMessage());
        }
    }

    /**
     * Evict service caches for a specific category
     */
    public void evictCategoryServiceCaches(String category) {
        try {
            String[] categoryServiceCacheNames = {
                "services_by_category_paginated",
                "services_by_category_status_paginated",
                "services_by_category_price_paginated"
            };

            for (String cacheName : categoryServiceCacheNames) {
                Cache cache = cacheManager.getCache(cacheName);
                if (cache != null) {
                    // Evict all entries that contain the category
                    cacheAccessTimes.entrySet().removeIf(entry -> {
                        if (entry.getKey().startsWith(cacheName + ":") && entry.getKey().contains(category)) {
                            String[] parts = entry.getKey().split(":", 2);
                            if (parts.length == 2) {
                                cache.evict(parts[1]);
                            }
                            cacheAccessCounts.remove(entry.getKey());
                            return true;
                        }
                        return false;
                    });
                }
            }
        } catch (Exception e) {
            System.err.println("SmartCacheService: Error evicting category service caches: " + e.getMessage());
        }
    }

    /**
     * Get service cache statistics
     */
    public void logServiceCacheStats() {
        try {
            System.out.println("=== Service Cache Statistics ===");
            String[] serviceCacheNames = {
                "services_paginated",
                "services_by_status_paginated",
                "services_by_shop_paginated",
                "services_by_shop_status_paginated",
                "services_by_category_paginated",
                "services_by_category_status_paginated",
                "services_filtered_paginated",
                "services_by_price_paginated",
                "services_by_shop_price_paginated",
                "services_by_category_price_paginated"
            };

            for (String cacheName : serviceCacheNames) {
                Cache cache = cacheManager.getCache(cacheName);
                if (cache != null) {
                    long accessCount = cacheAccessTimes.entrySet().stream()
                        .filter(entry -> entry.getKey().startsWith(cacheName + ":"))
                        .count();
                    System.out.println("Service Cache: " + cacheName + " - Access Count: " + accessCount);
                }
            }
        } catch (Exception e) {
            System.err.println("SmartCacheService: Error logging service cache stats: " + e.getMessage());
        }
    }
}
