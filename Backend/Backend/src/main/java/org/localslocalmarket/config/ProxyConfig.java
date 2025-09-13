package org.localslocalmarket.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.ForwardedHeaderFilter;

/**
 * Ensures the application correctly respects proxy headers (X-Forwarded-*)
 * when running behind a reverse proxy/CDN (e.g., Cloudflare, GCP load balancer).
 *
 * This prevents incorrect scheme/host detection that can lead to redirect loops
 * between http/https or www/non-www.
 */
@Configuration
public class ProxyConfig {

    @Bean
    public ForwardedHeaderFilter forwardedHeaderFilter() {
        // Spring will use X-Forwarded-* headers to determine original request info
        return new ForwardedHeaderFilter();
    }
}
