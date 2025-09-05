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
}
