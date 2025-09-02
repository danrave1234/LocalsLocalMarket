package org.localslocalmarket.model;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "product_ratings",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "product_id"}))
public class ProductRating {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private Integer stars;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public ProductRating() {}

    public Long getId() { return id; }
    public User getUser() { return user; }
    public Product getProduct() { return product; }
    public Integer getStars() { return stars; }
    public Instant getCreatedAt() { return createdAt; }

    public void setUser(User user) { this.user = user; }
    public void setProduct(Product product) { this.product = product; }
    public void setStars(Integer stars) { this.stars = stars; }

    @PrePersist
    void prePersist(){
        if(createdAt == null){
            createdAt = Instant.now();
        }
    }
}