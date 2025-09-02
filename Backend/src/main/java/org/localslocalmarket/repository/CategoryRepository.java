package org.localslocalmarket.repository;

import java.util.List;
import java.util.Optional;

import org.localslocalmarket.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    
    List<Category> findByIsActiveTrueOrderBySortOrderAsc();
    
    List<Category> findByTypeAndIsActiveTrueOrderBySortOrderAsc(String type);
    
    List<Category> findByParentCategoryAndIsActiveTrueOrderBySortOrderAsc(String parentCategory);
    
    Optional<Category> findByNameAndIsActiveTrue(String name);
    
    @Query("SELECT c FROM Category c WHERE c.isActive = true AND c.type = 'MAIN' ORDER BY c.sortOrder ASC")
    List<Category> findAllActiveMainCategories();
    
    @Query("SELECT c FROM Category c WHERE c.isActive = true AND c.type = 'SUB' AND c.parentCategory = ?1 ORDER BY c.sortOrder ASC")
    List<Category> findSubcategoriesByParent(String parentCategory);
    
    boolean existsByName(String name);
    
    @Query("SELECT c FROM Category c WHERE c.isActive = true AND (c.name LIKE %?1% OR c.displayName LIKE %?1%) ORDER BY c.sortOrder ASC")
    List<Category> searchCategories(String searchTerm);
}
