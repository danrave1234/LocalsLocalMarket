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

    public JwtAuthFilter(JwtService jwtService, UserRepository userRepository) {
        this.jwtService = jwtService;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String auth = request.getHeader(HttpHeaders.AUTHORIZATION);
        String requestPath = request.getRequestURI();
        String requestMethod = request.getMethod();
        
        System.out.println("=== JWT AUTH FILTER DEBUG ===");
        System.out.println("Request: " + requestMethod + " " + requestPath);
        System.out.println("Authorization header: " + (auth != null ? auth.substring(0, Math.min(auth.length(), 30)) + "..." : "NULL"));
        
        if (auth != null && auth.startsWith("Bearer ")) {
            String token = auth.substring(7);
            System.out.println("Token extracted: " + token.substring(0, Math.min(token.length(), 20)) + "...");
            try {
                String subject = jwtService.getSubject(token); // email
                System.out.println("Token subject (email): " + subject);
                if (subject != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    Optional<User> maybeUser = userRepository.findByEmail(subject);
                    System.out.println("User found: " + maybeUser.isPresent());
                    if (maybeUser.isPresent()) {
                        User user = maybeUser.get();
                        String role = user.getRole() == User.Role.ADMIN ? "ROLE_ADMIN" : "ROLE_SELLER";
                        System.out.println("User role: " + role);
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                user,
                                null,
                                List.of(new SimpleGrantedAuthority(role))
                        );
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                        System.out.println("Authentication set successfully");
                    }
                }
            } catch (Exception e) {
                System.out.println("JWT validation failed: " + e.getMessage());
                // Invalid token -> ignore; route protection will enforce auth where required
            }
        } else {
            System.out.println("No valid Authorization header found");
        }
        filterChain.doFilter(request, response);
    }
}
