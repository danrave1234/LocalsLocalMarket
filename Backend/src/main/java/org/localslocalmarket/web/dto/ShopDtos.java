package org.localslocalmarket.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ShopDtos {
    public record CreateShopRequest(
            @NotBlank String name,
            String description,
            @NotBlank String category,
            String addressLine,
            @NotNull Double lat,
            @NotNull Double lng,
            String logoPath,
            String coverPath,
            String phone,
            String website,
            String email,
            String facebook,
            String instagram,
            String twitter
    ){}

    // All fields optional for PATCH
    public record UpdateShopRequest(
            String name,
            String description,
            String category,
            String addressLine,
            Double lat,
            Double lng,
            String logoPath,
            String coverPath,
            String phone,
            String website,
            String email,
            String facebook,
            String instagram,
            String twitter
    ){}
}
