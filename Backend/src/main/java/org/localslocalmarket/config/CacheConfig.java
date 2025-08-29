package org.localslocalmarket.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.cache.support.NoOpCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;
import java.util.List;

@Configuration
@EnableCaching
public class CacheConfig {

    @Value("${llm.cache.enabled:true}")
    private boolean cacheEnabled;

    @Value("${llm.cache.ttl-seconds:600}")
    private long ttlSeconds;

    @Value("${llm.cache.max-size:1000}")
    private long maxSize;

    @Bean
    public CacheManager cacheManager() {
        if (!cacheEnabled) {
            return new NoOpCacheManager();
        }
        Caffeine<Object, Object> builder = Caffeine.newBuilder()
                .maximumSize(maxSize)
                .expireAfterWrite(Duration.ofSeconds(ttlSeconds));
        CaffeineCacheManager manager = new CaffeineCacheManager();
        manager.setCaffeine(builder);
        manager.setCacheNames(List.of(
                "shops_by_id",
                "shops_list",
                "products_by_id",
                "products_list",
                "categories"
        ));
        return manager;
    }
}
