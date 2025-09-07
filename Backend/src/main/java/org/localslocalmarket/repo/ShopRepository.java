package org.localslocalmarket.repo;

import java.util.List;
import java.util.Optional;

import org.localslocalmarket.model.Shop;
import org.localslocalmarket.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface ShopRepository extends JpaRepository<Shop, Long>, JpaSpecificationExecutor<Shop> {
    List<Shop> findByOwner(User owner);
    Optional<Shop> findByNameIgnoreCase(String name);
    
    /**
     * Find shops with pagination for sitemap generation
     * Ordered by ID for consistent pagination across sitemap pages
     */
    Page<Shop> findAllByOrderByIdAsc(Pageable pageable);
}
