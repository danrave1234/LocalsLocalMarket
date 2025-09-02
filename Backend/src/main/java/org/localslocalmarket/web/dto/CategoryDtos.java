package org.localslocalmarket.web.dto;

import java.time.Instant;
import java.util.List;

import org.localslocalmarket.model.Category;

import com.fasterxml.jackson.annotation.JsonInclude;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CategoryDtos {
    
    public record CreateCategoryRequest(
            @NotBlank String name,
            @NotBlank String displayName,
            String description,
            String icon,
            @NotNull String type,
            String parentCategory,
            String subcategoriesJson,
            Integer sortOrder
    ) {}
    
    public record UpdateCategoryRequest(
            String displayName,
            String description,
            String icon,
            String type,
            String parentCategory,
            String subcategoriesJson,
            Integer sortOrder,
            Boolean isActive
    ) {}
    
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record CategoryResponse(
            Long id,
            String name,
            String displayName,
            String description,
            String icon,
            String type,
            String parentCategory,
            Boolean isSystem,
            Boolean isActive,
            Integer sortOrder,
            String subcategoriesJson,
            String createdBy,
            Instant createdAt,
            Instant updatedAt
    ) {
        public static CategoryResponse fromCategory(Category category) {
            return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDisplayName(),
                category.getDescription(),
                category.getIcon(),
                category.getType(),
                category.getParentCategory(),
                category.getIsSystem(),
                category.getIsActive(),
                category.getSortOrder(),
                category.getSubcategoriesJson(),
                category.getCreatedBy(),
                category.getCreatedAt(),
                category.getUpdatedAt()
            );
        }
    }
    
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record CategoryTreeResponse(
            String mainCategory,
            String displayName,
            String icon,
            String description,
            List<String> subcategories
    ) {}
    
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public record CategoryListResponse(
            List<CategoryResponse> categories,
            List<CategoryTreeResponse> categoryTree
    ) {}
}
