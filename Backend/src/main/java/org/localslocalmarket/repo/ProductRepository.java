package org.localslocalmarket.repo;

import java.time.Instant;

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
    
    // New category-based queries
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.shop WHERE p.isActive = true AND p.mainCategory = :mainCategory")
    Page<Product> findAllActiveByMainCategory(@Param("mainCategory") String mainCategory, Pageable pageable);
    
    @Query("SELECT p FROM Product p LEFT JOIN FETCH p.shop WHERE p.isActive = true AND p.mainCategory = :mainCategory AND p.subcategory = :subcategory")
    Page<Product> findAllActiveByMainCategoryAndSubcategory(@Param("mainCategory") String mainCategory, @Param("subcategory") String subcategory, Pageable pageable);
    
    @Query("SELECT DISTINCT p.mainCategory FROM Product p WHERE p.isActive = true AND p.mainCategory IS NOT NULL")
    java.util.List<String> findAllDistinctMainCategories();
    
    @Query("SELECT DISTINCT p.subcategory FROM Product p WHERE p.isActive = true AND p.mainCategory = :mainCategory AND p.subcategory IS NOT NULL")
    java.util.List<String> findAllDistinctSubcategoriesByMainCategory(@Param("mainCategory") String mainCategory);
    
    // Admin dashboard methods
    long countByStockCountLessThanEqual(int stockCount);
    
    long countByStockCount(int stockCount);
    
    long countByCreatedAtAfter(Instant date);
    
    Page<Product> findByStockCountLessThanEqual(int stockCount, Pageable pageable);
    
    Page<Product> findByStockCount(int stockCount, Pageable pageable);
}
