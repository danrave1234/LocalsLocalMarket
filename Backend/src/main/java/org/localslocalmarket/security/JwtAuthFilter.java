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
        
        if (auth != null && auth.startsWith("Bearer ")) {
            String token = auth.substring(7);
            try {
                String subject = jwtService.getSubject(token); // email
                if (subject != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    Optional<User> maybeUser = userRepository.findByEmail(subject);
                    if (maybeUser.isPresent()) {
                        User user = maybeUser.get();
                        String role = user.getRole() == User.Role.ADMIN ? "ROLE_ADMIN" : "ROLE_SELLER";
                        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                                user,
                                null,
                                List.of(new SimpleGrantedAuthority(role))
                        );
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                }
            } catch (Exception e) {
                // Invalid token -> ignore; route protection will enforce auth where required
            }
        }
        filterChain.doFilter(request, response);
    }
}
