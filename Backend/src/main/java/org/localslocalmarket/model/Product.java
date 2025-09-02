package org.localslocalmarket.model;

import java.math.BigDecimal;
import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(indexes = {
    @Index(name = "idx_product_is_active", columnList = "isActive"),
    @Index(name = "idx_product_shop_active", columnList = "shop_id,isActive"),
    @Index(name = "idx_product_maincategory_active", columnList = "mainCategory,isActive"),
    @Index(name = "idx_product_main_sub_active", columnList = "mainCategory,subcategory,isActive"),
    @Index(name = "idx_product_price", columnList = "price"),
    @Index(name = "idx_product_title", columnList = "title"),
    @Index(name = "idx_product_created_at", columnList = "createdAt")
})
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Shop shop;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Column(nullable = false)
    private Integer stockCount = 0;

    @Column(length = 4000)
    private String imagePathsJson; // JSON array of relative paths

    // Legacy category field for backward compatibility
    private String category;
    
    // New hierarchical category fields
    private String mainCategory;
    private String subcategory;
    private String customCategory;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public Product() {}

    public Long getId() {
        return id;
    }

    public Shop getShop() { return shop; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public BigDecimal getPrice() { return price; }
    public Integer getStockCount() { return stockCount; }
    public String getImagePathsJson() { return imagePathsJson; }
    public String getCategory() { return category; }
    public String getMainCategory() { return mainCategory; }
    public String getSubcategory() { return subcategory; }
    public String getCustomCategory() { return customCategory; }
    public Boolean getIsActive() { return isActive; }
    public Instant getCreatedAt() { return createdAt; }

    public void setShop(Shop shop) { this.shop = shop; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setPrice(java.math.BigDecimal price) { this.price = price; }
    public void setStockCount(Integer stockCount) { this.stockCount = stockCount; }
    public void setImagePathsJson(String imagePathsJson) { this.imagePathsJson = imagePathsJson; }
    public void setCategory(String category) { this.category = category; }
    public void setMainCategory(String mainCategory) { this.mainCategory = mainCategory; }
    public void setSubcategory(String subcategory) { this.subcategory = subcategory; }
    public void setCustomCategory(String customCategory) { this.customCategory = customCategory; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    @PrePersist
    void prePersist(){
        if(createdAt==null){
            createdAt = Instant.now();
        }
        if(isActive==null){
            isActive = true;
        }
        if(stockCount==null){
            stockCount = 0;
        }
    }
}
