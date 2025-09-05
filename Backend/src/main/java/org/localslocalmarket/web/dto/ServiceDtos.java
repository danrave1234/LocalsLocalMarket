package org.localslocalmarket.web.dto;

import java.math.BigDecimal;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ServiceDtos {
    public record CreateServiceRequest(
            @NotNull Long shopId,
            @NotBlank String title,
            String description,
            String imageUrl,
            BigDecimal price,
            String mainCategory,
            String subcategory,
            String customCategory,
            String status,
            Boolean isActive
    ){}

    public record UpdateServiceRequest(
            String title,
            String description,
            String imageUrl,
            BigDecimal price,
            String mainCategory,
            String subcategory,
            String customCategory,
            String status,
            Boolean isActive
    ){}
    
    public record UpdateImagesRequest(
            String imageUrl
    ){}
    
    public record ServiceResponse(
            Long id,
            Long shopId,
            String title,
            String description,
            String imageUrl,
            BigDecimal price,
            String mainCategory,
            String subcategory,
            String customCategory,
            String status,
            Boolean isActive,
            String createdAt,
            String updatedAt
    ){}
}
