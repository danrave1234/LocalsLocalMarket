package org.localslocalmarket.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Order(1)
public class RateLimitFilter extends OncePerRequestFilter {

    private static final long WINDOW_MILLIS = 60_000; // 1 minute window
    private static final int DEFAULT_LIMIT = 60; // default 60 req/min
    private static final int UPLOAD_LIMIT = 20; // stricter for uploads
    private static final int CREATE_LIMIT = 30; // create endpoints

    private final Map<String, Deque<Long>> buckets = new ConcurrentHashMap<>();

    private boolean shouldLimit(HttpServletRequest request){
        if (!"POST".equalsIgnoreCase(request.getMethod())) return false;
        String uri = request.getRequestURI();
        // Limit auth, uploads, and create endpoints
        return uri.startsWith("/api/auth/") || uri.startsWith("/api/uploads/") ||
                uri.equals("/api/shops") || uri.equals("/api/products");
    }

    private int limitFor(String uri){
        if (uri.startsWith("/api/uploads/")) return UPLOAD_LIMIT;
        if (uri.equals("/api/shops") || uri.equals("/api/products") || uri.startsWith("/api/auth/")) return CREATE_LIMIT;
        return DEFAULT_LIMIT;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if(shouldLimit(request)){
            String ip = clientIp(request);
            String key = ip + "|" + request.getRequestURI();
            long now = Instant.now().toEpochMilli();
            long windowStart = now - WINDOW_MILLIS;
            Deque<Long> q = buckets.computeIfAbsent(key, k -> new ArrayDeque<>());
            synchronized (q){
                while(!q.isEmpty() && q.peekFirst() < windowStart){
                    q.pollFirst();
                }
                int limit = limitFor(request.getRequestURI());
                if(q.size() >= limit){
                    response.setStatus(429);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Too many requests\"}");
                    return;
                }
                q.addLast(now);
            }
        }
        filterChain.doFilter(request, response);
    }

    private String clientIp(HttpServletRequest request){
        String xf = request.getHeader("X-Forwarded-For");
        if(xf != null && !xf.isBlank()){
            int comma = xf.indexOf(',');
            return (comma > 0 ? xf.substring(0, comma) : xf).trim();
        }
        String xr = request.getHeader("X-Real-IP");
        if(xr != null && !xr.isBlank()) return xr.trim();
        return request.getRemoteAddr();
    }
}
