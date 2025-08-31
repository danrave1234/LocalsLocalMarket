package org.localslocalmarket.config;

import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CorsConfig {

    @Value("${llm.cors.allowed-origins:}")
    private String allowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Define allowed origins based on environment
        List<String> origins = getAllowedOrigins();
        configuration.setAllowedOriginPatterns(origins);
        
        // Allow all HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        
        // Allow all headers
        configuration.setAllowedHeaders(Arrays.asList("*"));
        
        // Allow credentials
        configuration.setAllowCredentials(true);
        
        // Allow preflight requests
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }

    private List<String> getAllowedOrigins() {
        // If environment variable is set, use it
        if (allowedOrigins != null && !allowedOrigins.trim().isEmpty()) {
            return Arrays.asList(allowedOrigins.split(","));
        }
        
        // Default origins for development and production
        return Arrays.asList(
            // Development
            "http://localhost:5173",  // Vite dev server
            "http://localhost:3000",  // Alternative dev port
            "http://127.0.0.1:5173",  // Alternative localhost
            "http://127.0.0.1:3000",  // Alternative localhost
            
            // Production domains
            "https://www.localslocalmarket.com",  // Main frontend domain
            "https://localslocalmarket.com",      // Frontend without www
            
            // Vercel domains (for development/preview)
            "https://*.vercel.app"    // All Vercel deployments
        );
    }
}
