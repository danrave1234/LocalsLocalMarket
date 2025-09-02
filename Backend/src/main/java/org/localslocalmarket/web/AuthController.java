package org.localslocalmarket.web;

import java.util.Map;

import org.localslocalmarket.model.User;
import org.localslocalmarket.repo.UserRepository;
import org.localslocalmarket.security.AuditService;
import org.localslocalmarket.security.AuthorizationService;
import org.localslocalmarket.security.InputValidationService;
import org.localslocalmarket.security.JwtService;
import org.localslocalmarket.service.EmailService;
import org.localslocalmarket.service.PasswordResetService;
import org.localslocalmarket.web.dto.AuthDtos;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final AuditService auditService;
    private final InputValidationService inputValidationService;
    private final AuthorizationService authorizationService;
    private final EmailService emailService;
    private final PasswordResetService passwordResetService;

    public AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwt, 
                         AuditService auditService, InputValidationService inputValidationService,
                         AuthorizationService authorizationService, EmailService emailService,
                         PasswordResetService passwordResetService) {
        this.users = users;
        this.encoder = encoder;
        this.jwt = jwt;
        this.auditService = auditService;
        this.inputValidationService = inputValidationService;
        this.authorizationService = authorizationService;
        this.emailService = emailService;
        this.passwordResetService = passwordResetService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Validated AuthDtos.RegisterRequest req){
        try {
            // Validate and sanitize input
            String validatedEmail = inputValidationService.validateEmail(req.email());
            inputValidationService.validatePassword(req.password());
            String validatedName = inputValidationService.validateName(req.name());
            
            if(users.existsByEmail(validatedEmail)){
                auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                        "unknown", "Registration attempt with existing email: " + validatedEmail);
                return ResponseEntity.badRequest().body(Map.of("error", "Email already registered"));
            }
            
            User u = new User();
            u.setEmail(validatedEmail.toLowerCase());
            u.setPasswordHash(encoder.encode(req.password()));
            u.setName(validatedName);
            u.setRole(User.Role.SELLER); // Always set to SELLER for new registrations
            u.setEnabled(true); // Explicitly set enabled to true
            u.setActive(true); // Explicitly set isActive to true
            
            users.save(u);
            
            // Send welcome email
            emailService.sendWelcomeEmail(u.getEmail(), u.getName());
            
            // Generate token WITH role information for proper validation
            String token = jwt.generate(u.getEmail(), Map.of(
                "uid", u.getId(),
                "role", u.getRole().name()
            ));
            
            // Log successful registration
            auditService.logSecurityEvent(AuditService.AuditEventType.LOGIN_SUCCESS, 
                    u.getId().toString(), "User registration successful");
            
            return ResponseEntity.ok(new AuthDtos.AuthResponse(token));
        } catch (IllegalArgumentException e) {
            auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                    "unknown", "Invalid registration input: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid input: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Validated AuthDtos.LoginRequest req){
        try {
            // Validate and sanitize input
            String validatedEmail = inputValidationService.validateEmail(req.email());
            
            return users.findByEmailAndEnabledTrueAndIsActiveTrue(validatedEmail.toLowerCase())
                    .filter(u -> encoder.matches(req.password(), u.getPasswordHash()))
                    .<ResponseEntity<?>>map(u -> {
                        // Generate token WITH role information for proper validation
                        String token = jwt.generate(u.getEmail(), Map.of(
                            "uid", u.getId(),
                            "role", u.getRole().name()
                        ));
                        
                        // Log successful login
                        auditService.logSecurityEvent(AuditService.AuditEventType.LOGIN_SUCCESS, 
                                u.getId().toString(), "User login successful");
                        
                        return ResponseEntity.ok(new AuthDtos.AuthResponse(token));
                    })
                    .orElseGet(() -> {
                        // Log failed login attempt
                        auditService.logSecurityEvent(AuditService.AuditEventType.LOGIN_FAILURE, 
                                "unknown", "Failed login attempt for email: " + validatedEmail);
                        return ResponseEntity.status(401).body(Map.of("error", "Invalid credentials"));
                    });
        } catch (IllegalArgumentException e) {
            auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                    "unknown", "Invalid login input: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid input: " + e.getMessage()));
        }
    }

    @PostMapping("/admin/change-role")
    public ResponseEntity<?> changeUserRole(@RequestBody AuthDtos.ChangeRoleRequest req) {
        try {
            // Verify current user is admin
            authorizationService.verifyAdmin();
            User adminUser = authorizationService.getCurrentUserOrThrow();
            
            // Validate input
            String validatedEmail = inputValidationService.validateEmail(req.email());
            
            // Find user to change role
            return users.findByEmail(validatedEmail.toLowerCase())
                    .map(user -> {
                        // Prevent admin from changing their own role
                        if (user.getId().equals(adminUser.getId())) {
                            auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                                    adminUser.getId().toString(), "Admin attempted to change their own role");
                            return ResponseEntity.badRequest().body(Map.of("error", "Cannot change your own role"));
                        }
                        
                        // Validate new role
                        User.Role newRole;
                        try {
                            newRole = User.Role.valueOf(req.newRole().toUpperCase());
                        } catch (IllegalArgumentException e) {
                            return ResponseEntity.badRequest().body(Map.of("error", "Invalid role"));
                        }
                        
                        // Log the role change
                        auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                                adminUser.getId().toString(), 
                                "Role change: " + user.getEmail() + " from " + user.getRole() + " to " + newRole);
                        
                        // Update role
                        user.setRole(newRole);
                        users.save(user);
                        
                        // Blacklist any existing tokens for this user to force re-authentication
                        // Note: In a production system, you'd want to implement token blacklisting per user
                        
                        return ResponseEntity.ok(Map.of("message", "Role updated successfully"));
                    })
                    .orElseGet(() -> ResponseEntity.notFound().build());
                    
        } catch (SecurityException e) {
            auditService.logSecurityEvent(AuditService.AuditEventType.PERMISSION_DENIED, 
                    "unknown", "Unauthorized role change attempt");
            return ResponseEntity.status(403).body(Map.of("error", "Admin privileges required"));
        } catch (IllegalArgumentException e) {
            auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                    "unknown", "Invalid role change input: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid input: " + e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody @Validated AuthDtos.ForgotPasswordRequest req) {
        try {
            // Validate and sanitize input
            String validatedEmail = inputValidationService.validateEmail(req.email());
            
            // First try to find user with strict criteria
            return users.findByEmailAndEnabledTrueAndIsActiveTrue(validatedEmail.toLowerCase())
                    .map(user -> {
                        // Generate a reset token using the service
                        String resetToken = passwordResetService.generateResetToken(user.getEmail());
                        
                        // Send password reset email
                        emailService.sendPasswordResetEmail(user.getEmail(), resetToken, user.getName());
                        
                        // Log the action
                        auditService.logSecurityEvent(AuditService.AuditEventType.LOGIN_SUCCESS, 
                                user.getId().toString(), "Password reset requested for email: " + validatedEmail);
                        
                        return ResponseEntity.ok(Map.of(
                            "message", "If an account with that email exists, a password reset link has been sent.",
                            "email", validatedEmail
                        ));
                    })
                    .orElseGet(() -> {
                        // If not found with strict criteria, try to find by email only
                        return users.findByEmail(validatedEmail.toLowerCase())
                                .map(user -> {
                                    // Check if user is active (enabled might be null for old users)
                                    if (user.isActive() != null && user.isActive()) {
                                        // Generate a reset token using the service
                                        String resetToken = passwordResetService.generateResetToken(user.getEmail());
                                        
                                        // Send password reset email
                                        emailService.sendPasswordResetEmail(user.getEmail(), resetToken, user.getName());
                                        
                                        // Log the action
                                        auditService.logSecurityEvent(AuditService.AuditEventType.LOGIN_SUCCESS, 
                                                user.getId().toString(), "Password reset requested for email: " + validatedEmail);
                                        
                                        return ResponseEntity.ok(Map.of(
                                            "message", "If an account with that email exists, a password reset link has been sent.",
                                            "email", validatedEmail
                                        ));
                                    } else {
                                        // User exists but is not active
                                        auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                                                user.getId().toString(), "Password reset attempt for inactive user: " + validatedEmail);
                                        
                                        return ResponseEntity.ok(Map.of(
                                            "message", "If an account with that email exists, a password reset link has been sent.",
                                            "email", validatedEmail
                                        ));
                                    }
                                })
                                .orElseGet(() -> {
                                    // User doesn't exist
                                    auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                                            "unknown", "Password reset attempt for non-existent email: " + validatedEmail);
                                    
                                    return ResponseEntity.ok(Map.of(
                                        "message", "If an account with that email exists, a password reset link has been sent.",
                                        "email", validatedEmail
                                    ));
                                });
                    });
        } catch (IllegalArgumentException e) {
            auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                    "unknown", "Invalid forgot password input: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid email format"));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody @Validated AuthDtos.ResetPasswordRequest req) {
        try {
            // Validate and sanitize input
            inputValidationService.validatePassword(req.password());
            
            // Validate the reset token and get the associated email
            String email = passwordResetService.validateAndGetEmail(req.token());
            
            // Find the user by email
            return users.findByEmail(email.toLowerCase())
                    .map(user -> {
                        // Update the user's password
                        user.setPasswordHash(encoder.encode(req.password()));
                        users.save(user);
                        
                        // Invalidate the used token
                        passwordResetService.invalidateToken(req.token());
                        
                        // Log successful password reset
                        auditService.logSecurityEvent(AuditService.AuditEventType.LOGIN_SUCCESS, 
                                user.getId().toString(), "Password reset completed successfully for email: " + email);
                        
                        return ResponseEntity.ok(Map.of(
                            "message", "Password reset successfully"
                        ));
                    })
                    .orElseGet(() -> {
                        // User not found (this shouldn't happen with a valid token)
                        auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                                "unknown", "Password reset attempted for non-existent user: " + email);
                        
                        return ResponseEntity.badRequest().body(Map.of("error", "Invalid reset token"));
                    });
                    
        } catch (IllegalArgumentException e) {
            // Token validation failed
            auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                    "unknown", "Invalid password reset token: " + e.getMessage());
            
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                    "unknown", "Password reset failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to reset password"));
        }
    }
}
