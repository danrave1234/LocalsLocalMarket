package org.localslocalmarket.repository;

import java.math.BigDecimal;
import java.util.List;

import org.localslocalmarket.model.Service;
import org.localslocalmarket.model.ServiceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    // Non-paginated methods (for backward compatibility)
    List<Service> findByShopIdAndIsActiveTrue(Long shopId);
    List<Service> findByShopIdAndStatusAndIsActiveTrue(Long shopId, ServiceStatus status);
    List<Service> findByMainCategoryAndIsActiveTrue(String mainCategory);
    List<Service> findByMainCategoryAndStatusAndIsActiveTrue(String mainCategory, ServiceStatus status);
    List<Service> findByShopIdAndMainCategoryAndIsActiveTrue(Long shopId, String mainCategory);
    List<Service> findByShopIdAndMainCategoryAndStatusAndIsActiveTrue(Long shopId, String mainCategory, ServiceStatus status);
    List<Service> findByTitleContainingIgnoreCaseAndIsActiveTrue(String title);
    List<Service> findByShopIdAndTitleContainingIgnoreCaseAndIsActiveTrue(Long shopId, String title);
    
    // Paginated methods
    Page<Service> findByIsActiveTrue(Pageable pageable);
    Page<Service> findByStatusAndIsActiveTrue(ServiceStatus status, Pageable pageable);
    Page<Service> findByShopIdAndIsActiveTrue(Long shopId, Pageable pageable);
    Page<Service> findByShopIdAndStatusAndIsActiveTrue(Long shopId, ServiceStatus status, Pageable pageable);
    Page<Service> findByMainCategoryAndIsActiveTrue(String mainCategory, Pageable pageable);
    Page<Service> findByMainCategoryAndStatusAndIsActiveTrue(String mainCategory, ServiceStatus status, Pageable pageable);
    Page<Service> findByShopIdAndMainCategoryAndIsActiveTrue(Long shopId, String mainCategory, Pageable pageable);
    Page<Service> findByShopIdAndMainCategoryAndStatusAndIsActiveTrue(Long shopId, String mainCategory, ServiceStatus status, Pageable pageable);
    Page<Service> findByTitleContainingIgnoreCaseAndIsActiveTrue(String title, Pageable pageable);
    Page<Service> findByShopIdAndTitleContainingIgnoreCaseAndIsActiveTrue(Long shopId, String title, Pageable pageable);
    
    // Suggestions (autocomplete)
    @Query("SELECT s FROM Service s WHERE s.isActive = true AND (" +
           "LOWER(s.title) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.description) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.mainCategory) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(s.subcategory) LIKE LOWER(CONCAT('%', :q, '%')))")
    Page<Service> suggestServices(@Param("q") String q, Pageable pageable);
    
    // Advanced search with multiple criteria
    @Query("SELECT s FROM Service s WHERE s.isActive = true " +
           "AND (:shopId IS NULL OR s.shop.id = :shopId) " +
           "AND (:status IS NULL OR s.status = :status) " +
           "AND (:mainCategory IS NULL OR s.mainCategory = :mainCategory) " +
           "AND (:subcategory IS NULL OR s.subcategory = :subcategory) " +
           "AND ( :searchTerm IS NULL OR (LOWER(s.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(s.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')) ) )")
    Page<Service> findServicesWithFilters(@Param("shopId") Long shopId,
                                        @Param("status") ServiceStatus status,
                                        @Param("mainCategory") String mainCategory,
                                        @Param("subcategory") String subcategory,
                                        @Param("searchTerm") String searchTerm,
                                        Pageable pageable);
    
    // Price range queries
    Page<Service> findByIsActiveTrueAndPriceBetween(BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    Page<Service> findByShopIdAndIsActiveTrueAndPriceBetween(Long shopId, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
    Page<Service> findByMainCategoryAndIsActiveTrueAndPriceBetween(String mainCategory, BigDecimal minPrice, BigDecimal maxPrice, Pageable pageable);
}
