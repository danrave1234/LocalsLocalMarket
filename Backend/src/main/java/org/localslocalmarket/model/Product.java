package org.localslocalmarket.model;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
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

    @Column(length = 4000)
    private String imagePathsJson; // JSON array of relative paths

    private String category;

    @Column(nullable = false)
    private Boolean isActive = true;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public Product() {}

    public Long getId() {
        return id;
    }

    public Shop getShop() { return shop; }

    public void setShop(Shop shop) { this.shop = shop; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setPrice(java.math.BigDecimal price) { this.price = price; }
    public void setImagePathsJson(String imagePathsJson) { this.imagePathsJson = imagePathsJson; }
    public void setCategory(String category) { this.category = category; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    @PrePersist
    void prePersist(){
        if(createdAt==null){
            createdAt = Instant.now();
        }
        if(isActive==null){
            isActive = true;
        }
    }
}
