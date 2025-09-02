package org.localslocalmarket.security;

import java.time.Instant;
import java.util.Date;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
    private final SecretKey key;
    private final long ttlMillis;
    private final long refreshTtlMillis;
    private final Set<String> blacklistedTokens = ConcurrentHashMap.newKeySet();

    public JwtService(@Value("${llm.jwt.secret}") String secret,
                      @Value("${llm.jwt.ttl-minutes}") long ttlMinutes,
                      @Value("${llm.jwt.refresh-ttl-minutes:10080}") long refreshTtlMinutes) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.ttlMillis = ttlMinutes * 60_000L;
        this.refreshTtlMillis = refreshTtlMinutes * 60_000L;
    }

    public String generate(String subject, Map<String, Object> claims){
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(subject)
                .addClaims(claims)
                .setIssuedAt(Date.from(now))
                .setExpiration(new Date(now.toEpochMilli() + ttlMillis))
                .setIssuer("localslocalmarket")
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String generateRefreshToken(String subject){
        Instant now = Instant.now();
        return Jwts.builder()
                .setSubject(subject)
                .setIssuedAt(Date.from(now))
                .setExpiration(new Date(now.toEpochMilli() + refreshTtlMillis))
                .setIssuer("localslocalmarket")
                .claim("type", "refresh")
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String getSubject(String token){
        if (blacklistedTokens.contains(token)) {
            throw new JwtException("Token has been blacklisted");
        }
        
        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
            
            // Validate issuer
            String issuer = claims.getIssuer();
            if (!"localslocalmarket".equals(issuer)) {
                throw new JwtException("Invalid token issuer");
            }
            
            return claims.getSubject();
        } catch (ExpiredJwtException e) {
            throw new JwtException("Token has expired");
        } catch (JwtException e) {
            throw new JwtException("Invalid token: " + e.getMessage());
        }
    }

    public Claims getClaims(String token) {
        if (blacklistedTokens.contains(token)) {
            throw new JwtException("Token has been blacklisted");
        }
        
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (ExpiredJwtException e) {
            throw new JwtException("Token has expired");
        } catch (JwtException e) {
            throw new JwtException("Invalid token: " + e.getMessage());
        }
    }

    public boolean isTokenExpired(String token) {
        try {
            Claims claims = getClaims(token);
            return claims.getExpiration().before(new Date());
        } catch (JwtException e) {
            return true;
        }
    }

    public boolean isRefreshToken(String token) {
        try {
            Claims claims = getClaims(token);
            return "refresh".equals(claims.get("type"));
        } catch (JwtException e) {
            return false;
        }
    }

    public void blacklistToken(String token) {
        blacklistedTokens.add(token);
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }

    public void cleanupExpiredBlacklistedTokens() {
        // This could be enhanced with a scheduled task to clean up expired tokens
        // For now, we'll keep it simple and let the set grow
        // In production, consider using Redis or a database for token blacklisting
    }
}
