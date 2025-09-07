package org.localslocalmarket.service;

import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

/**
 * Service for managing sitemap cache invalidation
 * Automatically clears sitemap cache when shops are created/updated/deleted
 */
@Service
public class SitemapService {

    /**
     * Clear sitemap cache when shops are modified
     * This ensures search engines get fresh sitemap data
     */
    @CacheEvict(value = "sitemap", allEntries = true)
    public void invalidateSitemapCache() {
        // Cache will be automatically cleared
        // Next sitemap request will generate fresh data
    }

    /**
     * Clear specific sitemap cache entries
     */
    @CacheEvict(value = "sitemap", key = "'sitemap_index'")
    public void invalidateSitemapIndex() {
        // Clear sitemap index cache
    }

    @CacheEvict(value = "sitemap", key = "'main_pages'")
    public void invalidateMainPagesSitemap() {
        // Clear main pages sitemap cache
    }

    @CacheEvict(value = "sitemap", key = "'shops_' + #page")
    public void invalidateShopSitemap(int page) {
        // Clear specific shop sitemap page cache
    }

    /**
     * Clear all shop sitemap caches
     * Call this when shops are added/removed to ensure all pages are refreshed
     */
    @CacheEvict(value = "sitemap", key = "'shops_' + #page", allEntries = true)
    public void invalidateAllShopSitemaps() {
        // Clear all shop sitemap page caches
    }
}
