package org.localslocalmarket.web.dto;

import java.math.BigDecimal;

import org.localslocalmarket.model.Product;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ProductDtos {
    public record CreateProductRequest(
            @NotNull Long shopId,
            @NotBlank String title,
            String description,
            @NotNull @DecimalMin(value = "0.0", inclusive = false) BigDecimal price,
            Integer stockCount,
            String imagePathsJson,
            String category, // Legacy field for backward compatibility
            String mainCategory,
            String subcategory,
            String customCategory
    ){}

    // All fields optional for PATCH; isActive included for moderation
    public record UpdateProductRequest(
            String title,
            String description,
            BigDecimal price,
            Integer stockCount,
            String imagePathsJson,
            String category, // Legacy field for backward compatibility
            String mainCategory,
            String subcategory,
            String customCategory,
            Boolean isActive
    ){}
    
    public record ProductResponse(
            Long id,
            String title,
            String description,
            BigDecimal price,
            Integer stockCount,
            String imagePathsJson,
            String category, // Legacy field for backward compatibility
            String mainCategory,
            String subcategory,
            String customCategory,
            Boolean isActive,
            java.time.Instant createdAt,
            Long shopId,
            String shopName
    ){
        public static ProductResponse fromProduct(Product product) {
            // Safely handle lazy-loaded shop relationship
            Long shopId = null;
            String shopName = null;
            
            try {
                if (product.getShop() != null) {
                    shopId = product.getShop().getId();
                    shopName = product.getShop().getName();
                }
            } catch (org.hibernate.LazyInitializationException e) {
                // If shop is lazy-loaded and session is closed, just use null values
                shopId = null;
                shopName = null;
            }
            
            return new ProductResponse(
                product.getId(),
                product.getTitle(),
                product.getDescription(),
                product.getPrice(),
                product.getStockCount(),
                product.getImagePathsJson(),
                product.getCategory(),
                product.getMainCategory(),
                product.getSubcategory(),
                product.getCustomCategory(),
                product.getIsActive(),
                product.getCreatedAt(),
                shopId,
                shopName
            );
        }
    }
}
