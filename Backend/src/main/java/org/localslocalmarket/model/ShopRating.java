package org.localslocalmarket.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "shop_ratings",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "shop_id"}))
public class ShopRating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "shop_id", nullable = false)
    private Shop shop;

    @Column(nullable = false)
    private Integer stars;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public ShopRating() {}

    public Long getId() { return id; }
    public User getUser() { return user; }
    public Shop getShop() { return shop; }
    public Integer getStars() { return stars; }
    public Instant getCreatedAt() { return createdAt; }

    public void setUser(User user) { this.user = user; }
    public void setShop(Shop shop) { this.shop = shop; }
    public void setStars(Integer stars) { this.stars = stars; }

    @PrePersist
    void prePersist(){
        if(createdAt == null){
            createdAt = Instant.now();
        }
    }
}