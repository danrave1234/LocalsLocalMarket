package org.localslocalmarket.service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class PasswordResetService {
    
    // In-memory storage for reset tokens (in production, use Redis or database)
    private final Map<String, TokenInfo> tokenStore = new ConcurrentHashMap<>();
    
    public static class TokenInfo {
        private final String email;
        private final LocalDateTime expiresAt;
        
        public TokenInfo(String email, LocalDateTime expiresAt) {
            this.email = email;
            this.expiresAt = expiresAt;
        }
        
        public String getEmail() { return email; }
        public LocalDateTime getExpiresAt() { return expiresAt; }
        public boolean isExpired() { return LocalDateTime.now().isAfter(expiresAt); }
    }
    
    public String generateResetToken(String email) {
        // Clean up expired tokens
        cleanupExpiredTokens();
        
        // Generate a new token
        String token = UUID.randomUUID().toString();
        
        // Store token with 24-hour expiration
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(24);
        tokenStore.put(token, new TokenInfo(email, expiresAt));
        
        return token;
    }
    
    public String validateAndGetEmail(String token) {
        TokenInfo tokenInfo = tokenStore.get(token);
        
        if (tokenInfo == null) {
            throw new IllegalArgumentException("Invalid reset token");
        }
        
        if (tokenInfo.isExpired()) {
            tokenStore.remove(token);
            throw new IllegalArgumentException("Reset token has expired");
        }
        
        return tokenInfo.getEmail();
    }
    
    public void invalidateToken(String token) {
        tokenStore.remove(token);
    }
    
    private void cleanupExpiredTokens() {
        tokenStore.entrySet().removeIf(entry -> entry.getValue().isExpired());
    }
}
