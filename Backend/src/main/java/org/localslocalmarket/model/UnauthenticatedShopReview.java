package org.localslocalmarket.model;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "unauthenticated_shop_reviews",
       uniqueConstraints = @UniqueConstraint(columnNames = {"shop_id", "device_id"}))
public class UnauthenticatedShopReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @Column(nullable = false)
    private Integer stars;

    @Column(columnDefinition = "TEXT")
    private String reviewText;

    @Column(nullable = false)
    private String reviewerName;

    @Column(nullable = false)
    private String deviceId;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public UnauthenticatedShopReview() {}

    public Long getId() { return id; }
    public Shop getShop() { return shop; }
    public Integer getStars() { return stars; }
    public String getReviewText() { return reviewText; }
    public String getReviewerName() { return reviewerName; }
    public String getDeviceId() { return deviceId; }
    public Instant getCreatedAt() { return createdAt; }

    public void setShop(Shop shop) { this.shop = shop; }
    public void setStars(Integer stars) { this.stars = stars; }
    public void setReviewText(String reviewText) { this.reviewText = reviewText; }
    public void setReviewerName(String reviewerName) { this.reviewerName = reviewerName; }
    public void setDeviceId(String deviceId) { this.deviceId = deviceId; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    @PrePersist
    void prePersist() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
