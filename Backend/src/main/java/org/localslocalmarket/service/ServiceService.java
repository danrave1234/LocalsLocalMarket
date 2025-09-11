package org.localslocalmarket.service;

import java.math.BigDecimal;
import java.util.List;

import org.localslocalmarket.dto.ServicePageResponse;
import org.localslocalmarket.model.Service;
import org.localslocalmarket.model.ServiceStatus;
import org.localslocalmarket.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import org.localslocalmarket.web.dto.SuggestionDtos;

@org.springframework.stereotype.Service
public class ServiceService {
    
    @Autowired
    private ServiceRepository serviceRepository;
    
    @Autowired
    private SmartCacheService smartCacheService;
    
    @Autowired
    private CacheInvalidationService cacheInvalidationService;
    
    public List<Service> getServicesByShop(Long shopId) {
        return serviceRepository.findByShopIdAndIsActiveTrue(shopId);
    }
    
    public List<Service> getServicesByShopAndStatus(Long shopId, ServiceStatus status) {
        return serviceRepository.findByShopIdAndStatusAndIsActiveTrue(shopId, status);
    }
    
    public List<Service> getServicesByCategory(String category) {
        return serviceRepository.findByMainCategoryAndIsActiveTrue(category);
    }
    
    public List<Service> getServicesByCategoryAndStatus(String category, ServiceStatus status) {
        return serviceRepository.findByMainCategoryAndStatusAndIsActiveTrue(category, status);
    }
    
    public List<Service> getAllServices() {
        return serviceRepository.findAll();
    }
    
    public List<Service> getServicesByStatus(ServiceStatus status) {
        return serviceRepository.findByStatusAndIsActiveTrue(status, org.springframework.data.domain.Pageable.unpaged()).getContent();
    }
    
    public Service createService(Service service) {
        Service savedService = serviceRepository.save(service);
        cacheInvalidationService.onServiceDataChanged();
        return savedService;
    }
    
    public Service updateService(Long id, Service serviceDetails) {
        Service service = serviceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Service not found"));
        
        // Check if status or price changed for specific cache invalidation
        boolean statusChanged = !service.getStatus().equals(serviceDetails.getStatus());
        boolean priceChanged = !java.util.Objects.equals(service.getPrice(), serviceDetails.getPrice());
        
        service.setTitle(serviceDetails.getTitle());
        service.setDescription(serviceDetails.getDescription());
        service.setImageUrl(serviceDetails.getImageUrl());
        service.setPrice(serviceDetails.getPrice());
        service.setMainCategory(serviceDetails.getMainCategory());
        service.setSubcategory(serviceDetails.getSubcategory());
        service.setCustomCategory(serviceDetails.getCustomCategory());
        service.setStatus(serviceDetails.getStatus());
        service.setIsActive(serviceDetails.getIsActive());
        
        Service savedService = serviceRepository.save(service);
        
        // Smart cache invalidation based on what changed
        if (statusChanged) {
            cacheInvalidationService.onServiceStatusChanged();
        }
        if (priceChanged) {
            cacheInvalidationService.onServicePriceChanged();
        }
        if (!statusChanged && !priceChanged) {
            cacheInvalidationService.onServiceDataChanged();
        }
        
        return savedService;
    }
    
    public void deleteService(Long id) {
        Service service = serviceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Service not found"));
        service.setIsActive(false);
        serviceRepository.save(service);
        cacheInvalidationService.onServiceDataChanged();
    }
    
    public Service getServiceById(Long id) {
        return serviceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Service not found"));
    }
    
    // ========== PAGINATED METHODS WITH CACHING ==========
    
    /**
     * Get paginated services with caching
     */
    @Cacheable(value = "services_paginated", key = "#page + '_' + #size + '_' + (#sortBy != null ? #sortBy : 'id') + '_' + (#sortDir != null ? #sortDir : 'asc')")
    public ServicePageResponse getServicesPaginated(int page, int size, String sortBy, String sortDir) {
        smartCacheService.recordCacheAccess("services_paginated", page + "_" + size + "_" + sortBy + "_" + sortDir);
        
        Sort sort = createSort(sortBy, sortDir);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Service> servicePage = serviceRepository.findByIsActiveTrue(pageable);
        
        return convertToServicePageResponse(servicePage);
    }
    
    /**
     * Get paginated services by status with caching
     */
    @Cacheable(value = "services_by_status_paginated", key = "#status + '_' + #page + '_' + #size + '_' + (#sortBy != null ? #sortBy : 'id') + '_' + (#sortDir != null ? #sortDir : 'asc')")
    public ServicePageResponse getServicesByStatusPaginated(ServiceStatus status, int page, int size, String sortBy, String sortDir) {
        smartCacheService.recordCacheAccess("services_by_status_paginated", status + "_" + page + "_" + size + "_" + sortBy + "_" + sortDir);
        
        Sort sort = createSort(sortBy, sortDir);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Service> servicePage = serviceRepository.findByStatusAndIsActiveTrue(status, pageable);
        
        return convertToServicePageResponse(servicePage);
    }
    
    /**
     * Get paginated services by shop with caching
     */
    @Cacheable(value = "services_by_shop_paginated", key = "#shopId + '_' + #page + '_' + #size + '_' + (#sortBy != null ? #sortBy : 'id') + '_' + (#sortDir != null ? #sortDir : 'asc')")
    public ServicePageResponse getServicesByShopPaginated(Long shopId, int page, int size, String sortBy, String sortDir) {
        smartCacheService.recordCacheAccess("services_by_shop_paginated", shopId + "_" + page + "_" + size + "_" + sortBy + "_" + sortDir);
        
        Sort sort = createSort(sortBy, sortDir);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Service> servicePage = serviceRepository.findByShopIdAndIsActiveTrue(shopId, pageable);
        
        return convertToServicePageResponse(servicePage);
    }
    
    /**
     * Get paginated services by shop and status with caching
     */
    @Cacheable(value = "services_by_shop_status_paginated", key = "#shopId + '_' + #status + '_' + #page + '_' + #size + '_' + (#sortBy != null ? #sortBy : 'id') + '_' + (#sortDir != null ? #sortDir : 'asc')")
    public ServicePageResponse getServicesByShopAndStatusPaginated(Long shopId, ServiceStatus status, int page, int size, String sortBy, String sortDir) {
        smartCacheService.recordCacheAccess("services_by_shop_status_paginated", shopId + "_" + status + "_" + page + "_" + size + "_" + sortBy + "_" + sortDir);
        
        Sort sort = createSort(sortBy, sortDir);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Service> servicePage = serviceRepository.findByShopIdAndStatusAndIsActiveTrue(shopId, status, pageable);
        
        return convertToServicePageResponse(servicePage);
    }
    
    /**
     * Get paginated services by category with caching
     */
    @Cacheable(value = "services_by_category_paginated", key = "#category + '_' + #page + '_' + #size + '_' + (#sortBy != null ? #sortBy : 'id') + '_' + (#sortDir != null ? #sortDir : 'asc')")
    public ServicePageResponse getServicesByCategoryPaginated(String category, int page, int size, String sortBy, String sortDir) {
        smartCacheService.recordCacheAccess("services_by_category_paginated", category + "_" + page + "_" + size + "_" + sortBy + "_" + sortDir);
        
        Sort sort = createSort(sortBy, sortDir);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Service> servicePage = serviceRepository.findByMainCategoryAndIsActiveTrue(category, pageable);
        
        return convertToServicePageResponse(servicePage);
    }
    
    /**
     * Get paginated services by category and status with caching
     */
    @Cacheable(value = "services_by_category_status_paginated", key = "#category + '_' + #status + '_' + #page + '_' + #size + '_' + (#sortBy != null ? #sortBy : 'id') + '_' + (#sortDir != null ? #sortDir : 'asc')")
    public ServicePageResponse getServicesByCategoryAndStatusPaginated(String category, ServiceStatus status, int page, int size, String sortBy, String sortDir) {
        smartCacheService.recordCacheAccess("services_by_category_status_paginated", category + "_" + status + "_" + page + "_" + size + "_" + sortBy + "_" + sortDir);
        
        Sort sort = createSort(sortBy, sortDir);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Service> servicePage = serviceRepository.findByMainCategoryAndStatusAndIsActiveTrue(category, status, pageable);
        
        return convertToServicePageResponse(servicePage);
    }
    
    /**
     * Get paginated services with advanced filters and caching
     */
    @Cacheable(value = "services_filtered_paginated", key = "#shopId + '_' + #status + '_' + #mainCategory + '_' + #subcategory + '_' + #searchTerm + '_' + #page + '_' + #size + '_' + (#sortBy != null ? #sortBy : 'id') + '_' + (#sortDir != null ? #sortDir : 'asc')")
    public ServicePageResponse getServicesWithFiltersPaginated(Long shopId, ServiceStatus status, String mainCategory, 
                                                             String subcategory, String searchTerm, int page, int size, 
                                                             String sortBy, String sortDir) {
        String cacheKey = shopId + "_" + status + "_" + mainCategory + "_" + subcategory + "_" + searchTerm + "_" + page + "_" + size + "_" + sortBy + "_" + sortDir;
        smartCacheService.recordCacheAccess("services_filtered_paginated", cacheKey);
        
        Sort sort = createSort(sortBy, sortDir);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Service> servicePage = serviceRepository.findServicesWithFilters(shopId, status, mainCategory, subcategory, searchTerm, pageable);
        
        return convertToServicePageResponse(servicePage);
    }
    
    /**
     * Get paginated services by price range with caching
     */
    @Cacheable(value = "services_by_price_paginated", key = "#minPrice + '_' + #maxPrice + '_' + #page + '_' + #size + '_' + (#sortBy != null ? #sortBy : 'id') + '_' + (#sortDir != null ? #sortDir : 'asc')")
    public ServicePageResponse getServicesByPriceRangePaginated(BigDecimal minPrice, BigDecimal maxPrice, int page, int size, String sortBy, String sortDir) {
        smartCacheService.recordCacheAccess("services_by_price_paginated", minPrice + "_" + maxPrice + "_" + page + "_" + size + "_" + sortBy + "_" + sortDir);
        
        Sort sort = createSort(sortBy, sortDir);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Service> servicePage = serviceRepository.findByIsActiveTrueAndPriceBetween(minPrice, maxPrice, pageable);
        
        return convertToServicePageResponse(servicePage);
    }
    
    /**
     * Get paginated services by shop and price range with caching
     */
    @Cacheable(value = "services_by_shop_price_paginated", key = "#shopId + '_' + #minPrice + '_' + #maxPrice + '_' + #page + '_' + #size + '_' + (#sortBy != null ? #sortBy : 'id') + '_' + (#sortDir != null ? #sortDir : 'asc')")
    public ServicePageResponse getServicesByShopAndPriceRangePaginated(Long shopId, BigDecimal minPrice, BigDecimal maxPrice, int page, int size, String sortBy, String sortDir) {
        smartCacheService.recordCacheAccess("services_by_shop_price_paginated", shopId + "_" + minPrice + "_" + maxPrice + "_" + page + "_" + size + "_" + sortBy + "_" + sortDir);
        
        Sort sort = createSort(sortBy, sortDir);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Service> servicePage = serviceRepository.findByShopIdAndIsActiveTrueAndPriceBetween(shopId, minPrice, maxPrice, pageable);
        
        return convertToServicePageResponse(servicePage);
    }
    
    /**
     * Get paginated services by category and price range with caching
     */
    @Cacheable(value = "services_by_category_price_paginated", key = "#category + '_' + #minPrice + '_' + #maxPrice + '_' + #page + '_' + #size + '_' + (#sortBy != null ? #sortBy : 'id') + '_' + (#sortDir != null ? #sortDir : 'asc')")
    public ServicePageResponse getServicesByCategoryAndPriceRangePaginated(String category, BigDecimal minPrice, BigDecimal maxPrice, int page, int size, String sortBy, String sortDir) {
        smartCacheService.recordCacheAccess("services_by_category_price_paginated", category + "_" + minPrice + "_" + maxPrice + "_" + page + "_" + size + "_" + sortBy + "_" + sortDir);
        
        Sort sort = createSort(sortBy, sortDir);
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<Service> servicePage = serviceRepository.findByMainCategoryAndIsActiveTrueAndPriceBetween(category, minPrice, maxPrice, pageable);
        
        return convertToServicePageResponse(servicePage);
    }
    
    // ========== CACHE EVICTION METHODS ==========
    
    /**
     * Clear all service caches when service data changes
     */
    @CacheEvict(value = {"services_paginated", "services_by_status_paginated", "services_by_shop_paginated", 
                        "services_by_shop_status_paginated", "services_by_category_paginated", 
                        "services_by_category_status_paginated", "services_filtered_paginated",
                        "services_by_price_paginated", "services_by_shop_price_paginated", 
                        "services_by_category_price_paginated"}, allEntries = true)
    public void clearAllServiceCaches() {
        // Cache eviction handled by annotation
    }
    
    /**
     * Clear shop-specific service caches
     */
    @CacheEvict(value = {"services_by_shop_paginated", "services_by_shop_status_paginated", 
                        "services_by_shop_price_paginated"}, allEntries = true)
    public void clearShopServiceCaches() {
        // Cache eviction handled by annotation
    }
    
    /**
     * Clear category-specific service caches
     */
    @CacheEvict(value = {"services_by_category_paginated", "services_by_category_status_paginated", 
                        "services_by_category_price_paginated"}, allEntries = true)
    public void clearCategoryServiceCaches() {
        // Cache eviction handled by annotation
    }
    
    // ========== HELPER METHODS ==========
    
    /**
     * Create Sort object from sort parameters
     */
    private Sort createSort(String sortBy, String sortDir) {
        if (sortBy == null || sortBy.trim().isEmpty()) {
            sortBy = "id";
        }
        
        Sort.Direction direction = Sort.Direction.ASC;
        if (sortDir != null && sortDir.equalsIgnoreCase("desc")) {
            direction = Sort.Direction.DESC;
        }
        
        return Sort.by(direction, sortBy);
    }
    
    /**
     * Convert Page<Service> to ServicePageResponse
     */
    private ServicePageResponse convertToServicePageResponse(Page<Service> servicePage) {
        return new ServicePageResponse(
            servicePage.getContent(),
            servicePage.getNumber(),
            servicePage.getSize(),
            servicePage.getTotalElements(),
            servicePage.getTotalPages(),
            servicePage.isFirst(),
            servicePage.isLast(),
            servicePage.hasNext(),
            servicePage.hasPrevious(),
            servicePage.getNumberOfElements()
        );
    }

    /**
     * Suggestions (autocomplete) for services
     */
    public java.util.List<SuggestionDtos.SuggestionItem> suggestServices(String q, int limit){
        if(q == null || q.trim().isEmpty()){
            return java.util.Collections.emptyList();
        }
        if(limit < 1) limit = 5;
        if(limit > 20) limit = 20;
        Page<Service> page = serviceRepository.suggestServices(q.trim(), PageRequest.of(0, limit));
        return page.getContent().stream()
            .map(SuggestionDtos.SuggestionItem::fromService)
            .toList();
    }
}
