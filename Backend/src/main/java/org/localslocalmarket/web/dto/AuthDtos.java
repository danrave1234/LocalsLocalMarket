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
    public record UserProfileResponse(String name, String email, String createdAt) {}
}
