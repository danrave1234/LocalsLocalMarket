package org.localslocalmarket.security;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class AuditService {
    
    private static final Logger logger = LoggerFactory.getLogger(AuditService.class);
    private static final Logger auditLogger = LoggerFactory.getLogger("AUDIT");
    
    // In-memory storage for recent audit events (in production, use a proper database)
    private final Map<String, Object> recentEvents = new ConcurrentHashMap<>();

    public enum AuditEventType {
        LOGIN_SUCCESS,
        LOGIN_FAILURE,
        LOGOUT,
        TOKEN_REFRESH,
        TOKEN_BLACKLIST,
        SHOP_CREATE,
        SHOP_UPDATE,
        SHOP_DELETE,
        PRODUCT_CREATE,
        PRODUCT_UPDATE,
        PRODUCT_DELETE,
        UNAUTHORIZED_ACCESS,
        PERMISSION_DENIED,
        RATE_LIMIT_EXCEEDED,
        SUSPICIOUS_ACTIVITY,
        // File upload security events
        FILE_UPLOAD_REJECTED,
        FILE_UPLOAD_VALIDATED,
        MALICIOUS_FILE_DETECTED,
        VIRUS_SCAN_FAILED,
        FILE_SIZE_EXCEEDED,
        DANGEROUS_FILE_TYPE
    }

    public void logSecurityEvent(AuditEventType eventType, String userId, String details) {
        String message = String.format("[SECURITY] %s | User: %s | Details: %s | Timestamp: %s",
                eventType.name(), userId, details, Instant.now());
        
        auditLogger.warn(message);
        logger.info("Security event logged: {}", eventType.name());
        
        // Store recent events for monitoring
        String key = eventType.name() + "_" + Instant.now().toEpochMilli();
        recentEvents.put(key, Map.of(
                "type", eventType.name(),
                "userId", userId,
                "details", details,
                "timestamp", Instant.now()
        ));
    }

    public void logUserAction(AuditEventType eventType, String userId, String action, String resource) {
        String message = String.format("[USER_ACTION] %s | User: %s | Action: %s | Resource: %s | Timestamp: %s",
                eventType.name(), userId, action, resource, Instant.now());
        
        auditLogger.info(message);
        
        // Store recent events for monitoring
        String key = eventType.name() + "_" + Instant.now().toEpochMilli();
        recentEvents.put(key, Map.of(
                "type", eventType.name(),
                "userId", userId,
                "action", action,
                "resource", resource,
                "timestamp", Instant.now()
        ));
    }

    public void logUnauthorizedAccess(String userId, String resource, String reason) {
        logSecurityEvent(AuditEventType.UNAUTHORIZED_ACCESS, userId, 
                String.format("Attempted access to %s: %s", resource, reason));
    }

    public void logPermissionDenied(String userId, String resource, String requiredPermission) {
        logSecurityEvent(AuditEventType.PERMISSION_DENIED, userId,
                String.format("Permission denied for %s, required: %s", resource, requiredPermission));
    }

    public void logRateLimitExceeded(String userId, String endpoint, int limit) {
        logSecurityEvent(AuditEventType.RATE_LIMIT_EXCEEDED, userId,
                String.format("Rate limit exceeded for %s (limit: %d)", endpoint, limit));
    }

    public void logSuspiciousActivity(String userId, String activity, String reason) {
        logSecurityEvent(AuditEventType.SUSPICIOUS_ACTIVITY, userId,
                String.format("Suspicious activity detected: %s - %s", activity, reason));
    }

    public void logLoginSuccess(String userId, String ipAddress) {
        logSecurityEvent(AuditEventType.LOGIN_SUCCESS, userId,
                String.format("Successful login from IP: %s", ipAddress));
    }

    public void logLoginFailure(String userId, String ipAddress, String reason) {
        logSecurityEvent(AuditEventType.LOGIN_FAILURE, userId,
                String.format("Failed login from IP: %s - %s", ipAddress, reason));
    }

    public void logTokenRefresh(String userId) {
        logSecurityEvent(AuditEventType.TOKEN_REFRESH, userId, "Token refreshed successfully");
    }

    public void logTokenBlacklist(String userId, String reason) {
        logSecurityEvent(AuditEventType.TOKEN_BLACKLIST, userId, 
                String.format("Token blacklisted: %s", reason));
    }

    public Map<String, Object> getRecentEvents() {
        return new ConcurrentHashMap<>(recentEvents);
    }

    public void cleanupOldEvents() {
        // Remove events older than 24 hours
        long cutoffTime = Instant.now().minusSeconds(24 * 60 * 60).toEpochMilli();
        recentEvents.entrySet().removeIf(entry -> {
            String key = entry.getKey();
            String[] parts = key.split("_");
            if (parts.length > 1) {
                try {
                    long eventTime = Long.parseLong(parts[parts.length - 1]);
                    return eventTime < cutoffTime;
                } catch (NumberFormatException e) {
                    return true; // Remove malformed keys
                }
            }
            return true;
        });
    }
}
