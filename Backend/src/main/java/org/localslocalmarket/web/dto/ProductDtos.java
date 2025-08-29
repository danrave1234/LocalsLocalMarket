package org.localslocalmarket.web.dto;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public class ProductDtos {
    public record CreateProductRequest(
            @NotNull Long shopId,
            @NotBlank String title,
            String description,
            @NotNull @DecimalMin(value = "0.0", inclusive = false) BigDecimal price,
            Integer stockCount,
            String imagePathsJson,
            String category
    ){}

    // All fields optional for PATCH; isActive included for moderation
    public record UpdateProductRequest(
            String title,
            String description,
            @DecimalMin(value = "0.0", inclusive = false) BigDecimal price,
            Integer stockCount,
            String imagePathsJson,
            String category,
            Boolean isActive
    ){}
}
