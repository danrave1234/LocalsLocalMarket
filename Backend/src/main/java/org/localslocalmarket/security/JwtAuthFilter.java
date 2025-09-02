package org.localslocalmarket.security;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.localslocalmarket.model.User;
import org.localslocalmarket.repo.UserRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;
    private final AuditService auditService;

    public JwtAuthFilter(JwtService jwtService, UserRepository userRepository, AuditService auditService) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
        this.auditService = auditService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String auth = request.getHeader(HttpHeaders.AUTHORIZATION);
        
        if (auth != null && auth.startsWith("Bearer ")) {
            String token = auth.substring(7);
            try {
                // Validate token and get claims
                var claims = jwtService.getClaims(token);
                String subject = claims.getSubject();
                
                if (subject != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    Optional<User> maybeUser = userRepository.findByEmailAndEnabledTrueAndIsActiveTrue(subject);
                    if (maybeUser.isPresent()) {
                        User user = maybeUser.get();
                        
                        // Verify user is still active
                        if (user.getEmail() == null || user.getEmail().isEmpty()) {
                            auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                                    subject, "Invalid user state detected");
                            filterChain.doFilter(request, response);
                            return;
                        }
                        
                        // CRITICAL: Verify role in token matches role in database
                        String tokenRole = claims.get("role", String.class);
                        String dbRole = user.getRole().name();
                        
                        if (!dbRole.equals(tokenRole)) {
                            // Role mismatch detected - potential token manipulation
                            auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                                    subject, "Role mismatch detected: token=" + tokenRole + ", db=" + dbRole);
                            
                            // Log the security violation
                            auditService.logSecurityEvent(AuditService.AuditEventType.LOGIN_FAILURE, 
                                    subject, "Token role manipulation attempt detected from IP: " + getClientIp(request));
                            
                            // Don't set authentication - treat as invalid token
                            filterChain.doFilter(request, response);
                            return;
                        }
                        
                        // Verify user ID in token matches database
                        Long tokenUserId = claims.get("uid", Long.class);
                        if (tokenUserId == null || !tokenUserId.equals(user.getId())) {
                            auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                                    subject, "User ID mismatch detected: token=" + tokenUserId + ", db=" + user.getId());
                            filterChain.doFilter(request, response);
                            return;
                        }
                        
                        // All verifications passed - set authentication
                        String role = user.getRole() == User.Role.ADMIN ? "ROLE_ADMIN" : "ROLE_SELLER";
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                user,
                                null,
                                List.of(new SimpleGrantedAuthority(role))
                        );
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        
                        // Log successful authentication
                        auditService.logSecurityEvent(AuditService.AuditEventType.LOGIN_SUCCESS, 
                                subject, "Token-based authentication successful");
                    } else {
                        // User not found in database
                        auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                                subject, "Token valid but user not found in database");
                    }
                }
            } catch (Exception e) {
                // Log token validation failures
                String clientIp = getClientIp(request);
                auditService.logSecurityEvent(AuditService.AuditEventType.LOGIN_FAILURE, 
                        "unknown", "Token validation failed: " + e.getMessage() + " from IP: " + clientIp);
                
                // Don't set authentication - let route protection handle it
            }
        }
        
        filterChain.doFilter(request, response);
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isBlank()) {
            int comma = xf.indexOf(',');
            return (comma > 0 ? xf.substring(0, comma) : xf).trim();
        }
        String xr = request.getHeader("X-Real-IP");
        if (xr != null && !xr.isBlank()) return xr.trim();
        return request.getRemoteAddr();
    }
}
