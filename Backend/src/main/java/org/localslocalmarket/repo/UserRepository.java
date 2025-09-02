package org.localslocalmarket.repo;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import org.localslocalmarket.model.User;
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
    
    // Find users by enabled status
    List<User> findByEnabled(boolean enabled);
    
    // Find users by active status
    List<User> findByIsActive(boolean isActive);
    
    // Find users by both enabled and active status
    List<User> findByEnabledAndIsActive(boolean enabled, boolean isActive);
    
    // Admin dashboard methods
    long countByCreatedAtAfter(Instant date);
}
