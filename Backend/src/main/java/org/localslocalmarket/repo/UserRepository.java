package org.localslocalmarket.repo;

import java.time.Instant;
import java.util.Optional;

import org.localslocalmarket.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    
    boolean existsByEmail(String email);
    
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.isActive = true")
    Optional<User> findByEmailAndIsActiveTrue(@Param("email") String email);
    
    @Query("SELECT u FROM User u WHERE u.email = :email AND u.enabled = true AND u.isActive = true")
    Optional<User> findByEmailAndEnabledTrueAndIsActiveTrue(@Param("email") String email);
    
    // Count users who are both enabled and active
    long countByEnabledTrueAndIsActiveTrue();
    
    // Pageable finders for admin listing and filtering
    Page<User> findAll(Pageable pageable);
    Page<User> findByEnabled(boolean enabled, Pageable pageable);
    Page<User> findByIsActive(boolean isActive, Pageable pageable);
    Page<User> findByEnabledAndIsActive(boolean enabled, boolean isActive, Pageable pageable);
    Page<User> findByEmailContainingIgnoreCaseOrNameContainingIgnoreCase(String email, String name, Pageable pageable);
    
    // Admin dashboard methods
    long countByCreatedAtAfter(Instant date);
}
