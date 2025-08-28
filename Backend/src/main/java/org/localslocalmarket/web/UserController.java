package org.localslocalmarket.web;

import java.util.Map;

import org.localslocalmarket.repo.UserRepository;
import org.localslocalmarket.security.JwtService;
import org.localslocalmarket.web.dto.AuthDtos;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {
    private final UserRepository users;
    private final JwtService jwt;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository users, JwtService jwt, PasswordEncoder passwordEncoder) {
        this.users = users;
        this.jwt = jwt;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication auth) {
        System.out.println("=== GET PROFILE DEBUG ===");
        System.out.println("Authentication: " + (auth != null ? auth.getName() : "NULL"));
        System.out.println("Authentication principal: " + (auth != null ? auth.getPrincipal() : "NULL"));
        
        String email = auth.getName();
        if (auth.getPrincipal() instanceof org.localslocalmarket.model.User) {
            email = ((org.localslocalmarket.model.User) auth.getPrincipal()).getEmail();
        }
        System.out.println("Extracted email: " + email);
        
        return users.findByEmail(email)
                                        .map(user -> {
                                            System.out.println("User found for GET: " + user.getEmail());
                                            return ResponseEntity.ok(new AuthDtos.UserProfileResponse(
                                user.getName(),
                                user.getEmail(),
                                user.getCreatedAt().toString()
                        ));
                                        })
                .orElseGet(() -> {
                    System.out.println("User not found for GET");
                    return ResponseEntity.notFound().build();
                });
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody @Validated AuthDtos.UpdateProfileRequest req, Authentication auth) {
        System.out.println("=== PUT PROFILE DEBUG ===");
        System.out.println("Authentication: " + (auth != null ? auth.getName() : "NULL"));
        System.out.println("Authentication principal: " + (auth != null ? auth.getPrincipal() : "NULL"));
        System.out.println("Request body: " + req);
        
        String email = auth.getName();
        if (auth.getPrincipal() instanceof org.localslocalmarket.model.User) {
            email = ((org.localslocalmarket.model.User) auth.getPrincipal()).getEmail();
        }
        System.out.println("Extracted email: " + email);
        
        return users.findByEmail(email)
                                        .map(user -> {
                            System.out.println("User found for PUT: " + user.getEmail());
                            System.out.println("Updating name from '" + user.getName() + "' to '" + req.name() + "'");
                            
                            user.setName(req.name());
                            users.save(user);
                            System.out.println("Profile updated successfully");
                            return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
                        })
                .orElseGet(() -> {
                    System.out.println("User not found for PUT");
                    return ResponseEntity.notFound().build();
                });
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody @Validated AuthDtos.ChangePasswordRequest req, Authentication auth) {
        System.out.println("=== CHANGE PASSWORD DEBUG ===");
        System.out.println("Authentication: " + (auth != null ? auth.getName() : "NULL"));
        
        String email = auth.getName();
        if (auth.getPrincipal() instanceof org.localslocalmarket.model.User) {
            email = ((org.localslocalmarket.model.User) auth.getPrincipal()).getEmail();
        }
        System.out.println("Extracted email: " + email);
        
        return users.findByEmail(email)
                .map(user -> {
                    System.out.println("User found for password change: " + user.getEmail());
                    
                    // Verify current password
                    if (!passwordEncoder.matches(req.currentPassword(), user.getPasswordHash())) {
                        System.out.println("Current password verification failed");
                        return ResponseEntity.badRequest().body(Map.of("error", "Current password is incorrect"));
                    }
                    
                    // Update password
                    user.setPasswordHash(passwordEncoder.encode(req.newPassword()));
                    users.save(user);
                    System.out.println("Password changed successfully");
                    return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
                })
                .orElseGet(() -> {
                    System.out.println("User not found for password change");
                    return ResponseEntity.notFound().build();
                });
    }
}
