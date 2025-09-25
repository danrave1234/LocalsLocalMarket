package org.localslocalmarket.model;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;

@Entity
@Table(name = "users", indexes = {
        @Index(name = "idx_users_email", columnList = "email"),
        @Index(name = "idx_users_is_active", columnList = "is_active"),
        @Index(name = "idx_users_created_at", columnList = "createdAt")
})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private String name;

    @Column(name = "enabled", nullable = false)
    private Boolean enabled;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive;

    @Column(name = "email_verified", nullable = false)
    private Boolean emailVerified;

    @Column(name = "email_verified_at")
    private Instant emailVerifiedAt;

    public User() {}

    // Getters and setters
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public Role getRole() { return role; }
    public void setRole(Role role) {
        this.role = role;
    }

    public Boolean isEnabled() {
        return enabled != null ? enabled : false;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public Boolean isActive() {
        return isActive != null ? isActive : false;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Instant getCreatedAt() { return createdAt; }
    public Boolean isEmailVerified() { return emailVerified != null ? emailVerified : false; }
    public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }
    public Instant getEmailVerifiedAt() { return emailVerifiedAt; }
    public void setEmailVerifiedAt(Instant emailVerifiedAt) { this.emailVerifiedAt = emailVerifiedAt; }

    @PrePersist
    void prePersist(){
        if(createdAt==null){
            createdAt = Instant.now();
        }
        if(role==null){
            role = Role.SELLER;
        }
        // Set default values for enabled and isActive
        if(enabled == null) {
            enabled = true;
        }
        if(isActive == null) {
            isActive = true;
        }
        if (emailVerified == null) {
            emailVerified = false;
        }
    }

    public enum Role { SELLER, ADMIN }
}
