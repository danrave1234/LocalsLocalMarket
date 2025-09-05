package org.localslocalmarket.config;

import java.time.Duration;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.cache.support.NoOpCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.github.benmanes.caffeine.cache.Caffeine;

@Configuration
@EnableCaching
public class CacheConfig {

    @Value("${llm.cache.enabled:true}")
    private boolean cacheEnabled;

    @Value("${llm.cache.ttl-seconds:600}")
    private long ttlSeconds;

    @Value("${llm.cache.max-size:1000}")
    private long maxSize;

    @Value("${llm.cache.categories.ttl-seconds:1800}")
    private long categoriesTtlSeconds;

    @Bean
    public CacheManager cacheManager() {
        if (!cacheEnabled) {
            return new NoOpCacheManager();
        }
        
        // Use default TTL for most caches, categories will use longer TTL via annotation
        Caffeine<Object, Object> builder = Caffeine.newBuilder()
                .maximumSize(maxSize)
                .expireAfterWrite(Duration.ofSeconds(ttlSeconds))
                .recordStats();
        
        CaffeineCacheManager manager = new CaffeineCacheManager();
        manager.setCaffeine(builder);
        manager.setCacheNames(List.of(
                "shops_by_id",
                "shops_list",
                "all_shops",
                "shops_paginated",
                "products_by_id",
                "products_list",
                "products_by_shop",
                "products_by_category",
                "products_by_subcategory",
                "categories"
        ));
        return manager;
    }
}
