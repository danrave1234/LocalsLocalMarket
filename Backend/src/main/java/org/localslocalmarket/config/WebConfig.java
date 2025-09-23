package org.localslocalmarket.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    // Resource handler for /uploads/** is provided by StaticResourceConfig to avoid conflicts.

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // Allow GET access to uploaded images from any origin (safe for <img> tags)
        registry.addMapping("/uploads/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "HEAD", "OPTIONS")
                .maxAge(3600);
    }
}
