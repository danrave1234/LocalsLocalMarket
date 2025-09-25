package org.localslocalmarket.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class AuthDtos {
    public record RegisterRequest(@Email @NotBlank String email,
                                  @NotBlank String password,
                                  @NotBlank String name) {}
    public record LoginRequest(@Email @NotBlank String email,
                               @NotBlank String password) {}
    public record AuthResponse(String token){ }
    public record UpdateProfileRequest(@NotBlank String name) {}
    public record ChangePasswordRequest(@NotBlank String currentPassword,
                                        @NotBlank String newPassword) {}
        public record ChangeRoleRequest(@Email @NotBlank String email,
                                    @NotBlank String newRole) {}
    public record ForgotPasswordRequest(@Email @NotBlank String email) {}
    public record ResetPasswordRequest(@NotBlank String token,
                                      @NotBlank String password) {}
    public record UserProfileResponse(String name, String email, String createdAt, String role) {}
    public record EmailVerificationStatus(boolean emailVerified, String emailVerifiedAt) {}

    // Google OAuth
    public record GoogleLoginRequest(@NotBlank String idToken) {}
}
