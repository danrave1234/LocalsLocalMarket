package org.localslocalmarket.security;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthFilter jwtAuthFilter;
    private final CorsConfigurationSource corsConfigurationSource;

    @Value("${app.orders.require-auth:false}")
    private boolean requireAuthToOrder;

    public SecurityConfig(JwtAuthFilter jwtAuthFilter, CorsConfigurationSource corsConfigurationSource) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.corsConfigurationSource = corsConfigurationSource;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable());
        http.cors(cors -> cors.configurationSource(corsConfigurationSource));
        http.sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        // Security headers (crawler-friendly)
        http.headers(headers -> headers
                .frameOptions(frameOptions -> frameOptions.deny())
                .contentTypeOptions(contentTypeOptions -> {})
                .addHeaderWriter((request, response) -> {
                    // Add comprehensive security headers
                    response.setHeader("X-Robots-Tag", "index, follow");
                    
                    // Cache policy:
                    // - /uploads/** → handled by StaticResourceConfig (no-cache + must-revalidate)
                    // - /api/**     → dynamic JSON; do NOT cache in browsers/proxies
                    // - others      → allow short-lived caching for static pages/assets
                    String uri = request.getRequestURI();
                    if (uri != null && uri.startsWith("/uploads/")) {
                        // Do not override Cache-Control for uploads; let static handler decide
                    } else if (uri != null && uri.startsWith("/api/")) {
                        response.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0, private");
                        response.setHeader("Pragma", "no-cache");
                    } else {
                        response.setHeader("Cache-Control", "public, max-age=3600");
                    }
                    
                    // Security headers
                    response.setHeader("X-Content-Type-Options", "nosniff");
                    response.setHeader("X-Frame-Options", "DENY");
                    response.setHeader("X-XSS-Protection", "1; mode=block");
                    response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
                    response.setHeader("Permissions-Policy", "geolocation=(), microphone=(), camera=()");
                    
                    // Content Security Policy (CSP) - Allow necessary resources
                    response.setHeader("Content-Security-Policy",
                        "default-src 'self'; " +
                        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://pagead2.googlesyndication.com https://fonts.googleapis.com https://accounts.google.com; " +
                        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                        "font-src 'self' https://fonts.gstatic.com; " +
                        "img-src 'self' data: blob: https: http:; " +
                        "connect-src 'self' https://www.google-analytics.com https://www.googleapis.com https://accounts.google.com; " +
                        "frame-src 'self' https://accounts.google.com; " +
                        "object-src 'none'; " +
                        "base-uri 'self'; " +
                        "form-action 'self'"
                    );

                    // Cross-origin policies (avoid isolation; allow images from other origins)
                    response.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
                    response.setHeader("Cross-Origin-Embedder-Policy", "unsafe-none");
                    response.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
                    
                    // Strict Transport Security (HSTS) - only for HTTPS
                    if (request.isSecure()) {
                        response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
                    }
                })
        );

        // Authorization rules
        http.authorizeHttpRequests(auth -> {
            if (requireAuthToOrder) {
                auth.requestMatchers("/api/orders/**").authenticated()
                    .anyRequest().permitAll();
            } else {
                auth.anyRequest().permitAll();
            }
        });

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
