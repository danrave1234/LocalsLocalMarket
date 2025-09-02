package org.localslocalmarket.model;

import java.time.Instant;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
    @Index(name = "idx_shop_owner", columnList = "owner_id"),
    @Index(name = "idx_shop_category", columnList = "category"),
    @Index(name = "idx_shop_created_at", columnList = "createdAt")
})
public class Shop {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JsonIgnore
    private User owner;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String category;

    private String addressLine;

    @Column(nullable = false)
    private Double lat;

    @Column(nullable = false)
    private Double lng;

    private String logoPath;
    private String coverPath;
    private String phone;
    private String website;
    private String email;
    private String facebook;
    private String instagram;
    private String twitter;

    @Column(length = 4000)
    private String adsImagePathsJson; // JSON array of ad image paths

    @Column(nullable = false)
    private Boolean adsEnabled = false;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    public Shop() {}

    public Long getId() {
        return id;
    }

    public User getOwner() { 
        return owner; 
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public String getCategory() {
        return category;
    }

    public String getAddressLine() {
        return addressLine;
    }

    public Double getLat() {
        return lat;
    }

    public Double getLng() {
        return lng;
    }

    public String getLogoPath() {
        return logoPath;
    }

    public String getCoverPath() {
        return coverPath;
    }

    public String getPhone() {
        return phone;
    }

    public String getWebsite() {
        return website;
    }

    public String getEmail() {
        return email;
    }

    public String getFacebook() {
        return facebook;
    }

    public String getInstagram() {
        return instagram;
    }

    public String getTwitter() {
        return twitter;
    }

    public String getAdsImagePathsJson() { return adsImagePathsJson; }
    public Boolean getAdsEnabled() { return adsEnabled; }

    public Instant getCreatedAt() {
        return createdAt;
    }

    // Setters for controller usage
    public void setOwner(User owner) { this.owner = owner; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setCategory(String category) { this.category = category; }
    public void setAddressLine(String addressLine) { this.addressLine = addressLine; }
    public void setLat(Double lat) { this.lat = lat; }
    public void setLng(Double lng) { this.lng = lng; }
    public void setLogoPath(String logoPath) { this.logoPath = logoPath; }
    public void setCoverPath(String coverPath) { this.coverPath = coverPath; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setWebsite(String website) { this.website = website; }
    public void setEmail(String email) { this.email = email; }
    public void setFacebook(String facebook) { this.facebook = facebook; }
    public void setInstagram(String instagram) { this.instagram = instagram; }
    public void setTwitter(String twitter) { this.twitter = twitter; }
    public void setAdsImagePathsJson(String adsImagePathsJson) { this.adsImagePathsJson = adsImagePathsJson; }
    public void setAdsEnabled(Boolean adsEnabled) { this.adsEnabled = adsEnabled; }

    @PrePersist
    void prePersist(){
        if(createdAt==null){
            createdAt = Instant.now();
        }
        if(adsEnabled==null){
            adsEnabled = false;
        }
    }
}
