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
        String email = auth.getName();
        if (auth.getPrincipal() instanceof org.localslocalmarket.model.User) {
            email = ((org.localslocalmarket.model.User) auth.getPrincipal()).getEmail();
        }
        
        return users.findByEmail(email)
                .map(user -> ResponseEntity.ok(new AuthDtos.UserProfileResponse(
                        user.getName(),
                        user.getEmail(),
                        user.getCreatedAt().toString()
                )))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody @Validated AuthDtos.UpdateProfileRequest req, Authentication auth) {
        String email = auth.getName();
        if (auth.getPrincipal() instanceof org.localslocalmarket.model.User) {
            email = ((org.localslocalmarket.model.User) auth.getPrincipal()).getEmail();
        }
        
        return users.findByEmail(email)
                .map(user -> {
                    user.setName(req.name());
                    users.save(user);
                    return ResponseEntity.ok(Map.of("message", "Profile updated successfully"));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody @Validated AuthDtos.ChangePasswordRequest req, Authentication auth) {
        String email = auth.getName();
        if (auth.getPrincipal() instanceof org.localslocalmarket.model.User) {
            email = ((org.localslocalmarket.model.User) auth.getPrincipal()).getEmail();
        }
        
        return users.findByEmail(email)
                .map(user -> {
                    // Verify current password
                    if (!passwordEncoder.matches(req.currentPassword(), user.getPasswordHash())) {
                        return ResponseEntity.badRequest().body(Map.of("error", "Current password is incorrect"));
                    }
                    
                    // Update password
                    user.setPasswordHash(passwordEncoder.encode(req.newPassword()));
                    users.save(user);
                    return ResponseEntity.ok(Map.of("message", "Password changed successfully"));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
