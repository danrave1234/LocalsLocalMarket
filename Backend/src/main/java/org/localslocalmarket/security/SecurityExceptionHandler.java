package org.localslocalmarket.security;

import java.time.Instant;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

@ControllerAdvice
public class SecurityExceptionHandler {

    private final AuditService auditService;

    public SecurityExceptionHandler(AuditService auditService) {
        this.auditService = auditService;
    }

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<Map<String, Object>> handleSecurityException(SecurityException ex, WebRequest request) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Security violation");
        response.put("message", ex.getMessage());
        response.put("timestamp", Instant.now());
        response.put("path", request.getDescription(false));
        
        // Log the security violation
        auditService.logSecurityEvent(AuditService.AuditEventType.PERMISSION_DENIED, 
                "unknown", "SecurityException: " + ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDeniedException(AccessDeniedException ex, WebRequest request) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Access denied");
        response.put("message", "You don't have permission to access this resource");
        response.put("timestamp", Instant.now());
        response.put("path", request.getDescription(false));
        
        // Log the access denied
        auditService.logSecurityEvent(AuditService.AuditEventType.PERMISSION_DENIED, 
                "unknown", "AccessDeniedException: " + ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<Map<String, Object>> handleAuthenticationException(AuthenticationException ex, WebRequest request) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Authentication failed");
        response.put("message", "Invalid credentials or token");
        response.put("timestamp", Instant.now());
        response.put("path", request.getDescription(false));
        
        // Log the authentication failure
        auditService.logSecurityEvent(AuditService.AuditEventType.LOGIN_FAILURE, 
                "unknown", "AuthenticationException: " + ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Invalid input");
        response.put("message", ex.getMessage());
        response.put("timestamp", Instant.now());
        response.put("path", request.getDescription(false));
        
        // Log suspicious input
        auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                "unknown", "IllegalArgumentException: " + ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex, WebRequest request) {
        Map<String, Object> response = new HashMap<>();
        response.put("error", "Internal server error");
        response.put("message", "An unexpected error occurred");
        response.put("timestamp", Instant.now());
        response.put("path", request.getDescription(false));
        
        // Log unexpected errors
        auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                "unknown", "UnexpectedException: " + ex.getMessage());
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
