package org.localslocalmarket.repo;

import java.util.List;
import java.util.Optional;

import org.localslocalmarket.model.Shop;
import org.localslocalmarket.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ShopRepository extends JpaRepository<Shop, Long>, JpaSpecificationExecutor<Shop> {
    List<Shop> findByOwner(User owner);
    Optional<Shop> findByNameIgnoreCase(String name);
    
    /**
     * Find shops with pagination for sitemap generation
     * Ordered by ID for consistent pagination across sitemap pages
     */
    @Query(value = "SELECT * FROM shops ORDER BY id ASC LIMIT :limit OFFSET :offset", nativeQuery = true)
    List<Shop> findShopsPaginated(@Param("offset") int offset, @Param("limit") int limit);
}
