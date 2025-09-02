package org.localslocalmarket.repository;

import java.util.List;

import org.localslocalmarket.model.Service;
import org.localslocalmarket.model.ServiceStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ServiceRepository extends JpaRepository<Service, Long> {
    List<Service> findByShopIdAndIsActiveTrue(Long shopId);
    List<Service> findByShopIdAndStatusAndIsActiveTrue(Long shopId, ServiceStatus status);
    List<Service> findByMainCategoryAndIsActiveTrue(String mainCategory);
    List<Service> findByMainCategoryAndStatusAndIsActiveTrue(String mainCategory, ServiceStatus status);
    List<Service> findByShopIdAndMainCategoryAndIsActiveTrue(Long shopId, String mainCategory);
    List<Service> findByShopIdAndMainCategoryAndStatusAndIsActiveTrue(Long shopId, String mainCategory, ServiceStatus status);
    Page<Service> findByIsActiveTrue(Pageable pageable);
    Page<Service> findByStatusAndIsActiveTrue(ServiceStatus status, Pageable pageable);
    List<Service> findByTitleContainingIgnoreCaseAndIsActiveTrue(String title);
    List<Service> findByShopIdAndTitleContainingIgnoreCaseAndIsActiveTrue(Long shopId, String title);
}
