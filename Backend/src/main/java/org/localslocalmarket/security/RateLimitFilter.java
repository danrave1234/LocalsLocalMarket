package org.localslocalmarket.security;

import java.io.IOException;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.localslocalmarket.model.User;
import org.springframework.core.annotation.Order;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
@Order(1)
public class RateLimitFilter extends OncePerRequestFilter {

    private static final long WINDOW_MILLIS = 60_000; // 1 minute window
    private static final int DEFAULT_LIMIT = 60; // default 60 req/min
    private static final int UPLOAD_LIMIT = 20; // stricter for uploads
    private static final int CREATE_LIMIT = 30; // create endpoints
    private static final int AUTH_LIMIT = 10; // very strict for auth endpoints
    private static final int ADMIN_LIMIT = 200; // higher limit for admins

    private final Map<String, Deque<Long>> ipBuckets = new ConcurrentHashMap<>();
    private final Map<String, Deque<Long>> userBuckets = new ConcurrentHashMap<>();
    private final AuditService auditService;

    public RateLimitFilter(AuditService auditService) {
        this.auditService = auditService;
    }

    private boolean shouldLimit(HttpServletRequest request){
        if (!"POST".equalsIgnoreCase(request.getMethod())) return false;
        String uri = request.getRequestURI();
        // Limit auth, uploads, and create endpoints
        return uri.startsWith("/api/auth/") || uri.startsWith("/api/uploads/") ||
                uri.equals("/api/shops") || uri.equals("/api/products");
    }

    private int limitFor(String uri, boolean isAdmin){
        if (isAdmin) return ADMIN_LIMIT;
        if (uri.startsWith("/api/auth/")) return AUTH_LIMIT;
        if (uri.startsWith("/api/uploads/")) return UPLOAD_LIMIT;
        if (uri.equals("/api/shops") || uri.equals("/api/products")) return CREATE_LIMIT;
        return DEFAULT_LIMIT;
    }

    private String getCurrentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User) {
            return ((User) auth.getPrincipal()).getId().toString();
        }
        return null;
    }

    private boolean isAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof User) {
            return User.Role.ADMIN.equals(((User) auth.getPrincipal()).getRole());
        }
        return false;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        if(shouldLimit(request)){
            String ip = clientIp(request);
            String userId = getCurrentUserId();
            boolean isAdmin = isAdmin();
            String uri = request.getRequestURI();
            int limit = limitFor(uri, isAdmin);
            
            // Check IP-based rate limiting
            String ipKey = ip + "|" + uri;
            if (!checkRateLimit(ipBuckets, ipKey, limit, "IP: " + ip)) {
                auditService.logRateLimitExceeded(userId != null ? userId : "anonymous", uri, limit);
                response.setStatus(429);
                response.setContentType("application/json");
                response.getWriter().write("{\"error\":\"Too many requests from this IP\"}");
                return;
            }
            
            // Check user-based rate limiting (if authenticated)
            if (userId != null) {
                String userKey = userId + "|" + uri;
                if (!checkRateLimit(userBuckets, userKey, limit, "User: " + userId)) {
                    auditService.logRateLimitExceeded(userId, uri, limit);
                    response.setStatus(429);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Too many requests from this user\"}");
                    return;
                }
            }
        }
        filterChain.doFilter(request, response);
    }

    private boolean checkRateLimit(Map<String, Deque<Long>> buckets, String key, int limit, String identifier) {
        long now = Instant.now().toEpochMilli();
        long windowStart = now - WINDOW_MILLIS;
        Deque<Long> q = buckets.computeIfAbsent(key, k -> new ArrayDeque<>());
        
        synchronized (q){
            while(!q.isEmpty() && q.peekFirst() < windowStart){
                q.pollFirst();
            }
            
            if(q.size() >= limit){
                return false;
            }
            q.addLast(now);
        }
        return true;
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

    // Cleanup method to remove old entries (could be called periodically)
    public void cleanupOldEntries() {
        long cutoffTime = Instant.now().toEpochMilli() - WINDOW_MILLIS;
        
        ipBuckets.entrySet().removeIf(entry -> {
            Deque<Long> q = entry.getValue();
            synchronized (q) {
                q.removeIf(timestamp -> timestamp < cutoffTime);
                return q.isEmpty();
            }
        });
        
        userBuckets.entrySet().removeIf(entry -> {
            Deque<Long> q = entry.getValue();
            synchronized (q) {
                q.removeIf(timestamp -> timestamp < cutoffTime);
                return q.isEmpty();
            }
        });
    }
}
