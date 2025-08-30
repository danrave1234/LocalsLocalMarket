package org.localslocalmarket.repo;

import org.localslocalmarket.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long>, JpaSpecificationExecutor<Product> {
    
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.shop WHERE p.isActive = true")
    Page<Product> findAllActiveWithShop(Pageable pageable);
    
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.shop WHERE p.isActive = true AND p.shop.id = :shopId")
    Page<Product> findAllActiveByShopIdWithShop(@Param("shopId") Long shopId, Pageable pageable);
    
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.shop s LEFT JOIN FETCH s.owner WHERE p.id = :productId")
    java.util.Optional<Product> findByIdWithShopAndOwner(@Param("productId") Long productId);
}
