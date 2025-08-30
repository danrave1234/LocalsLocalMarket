package org.localslocalmarket.web.dto;

import org.localslocalmarket.model.Shop;

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
            String twitter,
            String adsImagePathsJson,
            Boolean adsEnabled
    ){}
    
    public record ShopResponse(
            Long id,
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
            String twitter,
            String adsImagePathsJson,
            Boolean adsEnabled,
            java.time.Instant createdAt,
            Long ownerId
    ){
        public static ShopResponse fromShop(Shop shop) {
            return new ShopResponse(
                shop.getId(),
                shop.getName(),
                shop.getDescription(),
                shop.getCategory(),
                shop.getAddressLine(),
                shop.getLat(),
                shop.getLng(),
                shop.getLogoPath(),
                shop.getCoverPath(),
                shop.getPhone(),
                shop.getWebsite(),
                shop.getEmail(),
                shop.getFacebook(),
                shop.getInstagram(),
                shop.getTwitter(),
                shop.getAdsImagePathsJson(),
                shop.getAdsEnabled(),
                shop.getCreatedAt(),
                shop.getOwner() != null ? shop.getOwner().getId() : null
            );
        }
    }
}
