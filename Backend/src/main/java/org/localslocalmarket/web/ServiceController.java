package org.localslocalmarket.web;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

import org.localslocalmarket.dto.ServicePageResponse;
import org.localslocalmarket.model.Service;
import org.localslocalmarket.model.ServiceStatus;
import org.localslocalmarket.model.Shop;
import org.localslocalmarket.repo.ShopRepository;
import org.localslocalmarket.security.AuthorizationService;
import org.localslocalmarket.service.ServiceService;
import org.localslocalmarket.web.dto.ServiceDtos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/services")
public class ServiceController {
    
    @Autowired
    private ServiceService serviceService;
    
    @Autowired
    private ShopRepository shops;
    
    @Autowired
    private AuthorizationService authorizationService;
    
    @GetMapping
    public ResponseEntity<List<Service>> getAllServices(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        
        List<Service> services;
        if (category != null && status != null) {
            ServiceStatus serviceStatus = ServiceStatus.valueOf(status.toUpperCase());
            services = serviceService.getServicesByCategoryAndStatus(category, serviceStatus);
        } else if (category != null) {
            services = serviceService.getServicesByCategory(category);
        } else if (status != null) {
            ServiceStatus serviceStatus = ServiceStatus.valueOf(status.toUpperCase());
            services = serviceService.getServicesByStatus(serviceStatus);
        } else {
            services = serviceService.getAllServices();
        }
        
        return ResponseEntity.ok(services);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Service> getServiceById(@PathVariable Long id) {
        Service service = serviceService.getServiceById(id);
        return ResponseEntity.ok(service);
    }
    
    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<Service>> getServicesByShop(
            @PathVariable Long shopId,
            @RequestParam(required = false) String status) {
        
        List<Service> services;
        if (status != null) {
            ServiceStatus serviceStatus = ServiceStatus.valueOf(status.toUpperCase());
            services = serviceService.getServicesByShopAndStatus(shopId, serviceStatus);
        } else {
            services = serviceService.getServicesByShop(shopId);
        }
        
        return ResponseEntity.ok(services);
    }
    
    @PostMapping
    public ResponseEntity<Service> createService(@RequestBody @Validated ServiceDtos.CreateServiceRequest req, 
                                             @RequestHeader("Authorization") String token) {
        try {
            // Get current user and verify authentication
            authorizationService.getCurrentUserOrThrow();
            
            // Verify shop exists and user has permission to manage it
            Shop shop = shops.findById(req.shopId()).orElseThrow();
            authorizationService.verifyCanManageShop(shop.getId());
            
            // Create service entity
            Service service = new Service();
            service.setShop(shop);
            service.setTitle(req.title());
            service.setDescription(req.description());
            service.setImageUrl(req.imageUrl());
            service.setPrice(req.price());
            service.setMainCategory(req.mainCategory());
            service.setSubcategory(req.subcategory());
            service.setCustomCategory(req.customCategory());
            service.setStatus(req.status() != null ? ServiceStatus.valueOf(req.status()) : ServiceStatus.AVAILABLE);
            service.setIsActive(req.isActive() != null ? req.isActive() : true);
            
            Service createdService = serviceService.createService(service);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdService);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Service> updateService(@PathVariable Long id, 
                                               @RequestBody @Validated ServiceDtos.UpdateServiceRequest req,
                                               @RequestHeader("Authorization") String token) {
        try {
            // Get current user and verify authentication
            authorizationService.getCurrentUserOrThrow();
            
            // Get existing service
            Service existingService = serviceService.getServiceById(id);
            if (existingService == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Verify shop ownership
            authorizationService.verifyCanManageShop(existingService.getShop().getId());
            
            // Update service fields
            if (req.title() != null) existingService.setTitle(req.title());
            if (req.description() != null) existingService.setDescription(req.description());
            if (req.imageUrl() != null) existingService.setImageUrl(req.imageUrl());
            if (req.price() != null) existingService.setPrice(req.price());
            if (req.mainCategory() != null) existingService.setMainCategory(req.mainCategory());
            if (req.subcategory() != null) existingService.setSubcategory(req.subcategory());
            if (req.customCategory() != null) existingService.setCustomCategory(req.customCategory());
            if (req.status() != null) existingService.setStatus(ServiceStatus.valueOf(req.status()));
            if (req.isActive() != null) existingService.setIsActive(req.isActive());
            
            Service updatedService = serviceService.updateService(id, existingService);
            return ResponseEntity.ok(updatedService);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @PatchMapping("/{id}/images")
    public ResponseEntity<?> updateImages(@PathVariable Long id,
                                        @RequestBody ServiceDtos.UpdateImagesRequest req,
                                        @RequestHeader("Authorization") String token) {
        try {
            // Get current user and verify authentication
            authorizationService.getCurrentUserOrThrow();
            
            // Get existing service
            Service existingService = serviceService.getServiceById(id);
            if (existingService == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Verify shop ownership
            authorizationService.verifyCanManageShop(existingService.getShop().getId());
            
            // Update image immediately (allow null to clear image)
            existingService.setImageUrl(req.imageUrl()); // This can be null to clear the image
            serviceService.updateService(id, existingService);
            
            return ResponseEntity.ok(Map.of("message", "Service image updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id,
                                         @RequestHeader("Authorization") String token) {
        // TODO: Validate shop ownership
        serviceService.deleteService(id);
        serviceService.clearAllServiceCaches(); // Clear caches when service is deleted
        return ResponseEntity.ok().build();
    }
    
    // ========== PAGINATED ENDPOINTS ==========
    
    /**
     * Get paginated services with optional filters
     */
    @GetMapping("/paginated")
    public ResponseEntity<ServicePageResponse> getServicesPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String subcategory,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) Long shopId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        
        // Validate pagination parameters
        if (page < 0) page = 0;
        if (size < 1) size = 20;
        if (size > 100) size = 100; // Limit max page size
        
        ServicePageResponse response;
        
        // Use advanced filtering if multiple filters are provided
        if (shopId != null || status != null || category != null || subcategory != null || search != null) {
            ServiceStatus serviceStatus = status != null ? ServiceStatus.valueOf(status.toUpperCase()) : null;
            response = serviceService.getServicesWithFiltersPaginated(
                shopId, serviceStatus, category, subcategory, search, page, size, sortBy, sortDir);
        }
        // Use price range filtering
        else if (minPrice != null || maxPrice != null) {
            BigDecimal min = minPrice != null ? minPrice : BigDecimal.ZERO;
            BigDecimal max = maxPrice != null ? maxPrice : new BigDecimal("999999.99");
            response = serviceService.getServicesByPriceRangePaginated(min, max, page, size, sortBy, sortDir);
        }
        // Use status filtering (only if no other filters)
        else if (status != null) {
            ServiceStatus serviceStatus = ServiceStatus.valueOf(status.toUpperCase());
            response = serviceService.getServicesByStatusPaginated(serviceStatus, page, size, sortBy, sortDir);
        }
        // Use category filtering (only if no other filters)
        else if (category != null) {
            response = serviceService.getServicesByCategoryPaginated(category, page, size, sortBy, sortDir);
        }
        // Default: get all services
        else {
            response = serviceService.getServicesPaginated(page, size, sortBy, sortDir);
        }
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get paginated services by shop
     */
    @GetMapping("/shop/{shopId}/paginated")
    public ResponseEntity<ServicePageResponse> getServicesByShopPaginated(
            @PathVariable Long shopId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        
        // Validate pagination parameters
        if (page < 0) page = 0;
        if (size < 1) size = 20;
        if (size > 100) size = 100;
        
        ServicePageResponse response;
        
        // Use price range filtering for shop services
        if (minPrice != null || maxPrice != null) {
            BigDecimal min = minPrice != null ? minPrice : BigDecimal.ZERO;
            BigDecimal max = maxPrice != null ? maxPrice : new BigDecimal("999999.99");
            response = serviceService.getServicesByShopAndPriceRangePaginated(shopId, min, max, page, size, sortBy, sortDir);
        }
        // Use status filtering for shop services
        else if (status != null) {
            ServiceStatus serviceStatus = ServiceStatus.valueOf(status.toUpperCase());
            response = serviceService.getServicesByShopAndStatusPaginated(shopId, serviceStatus, page, size, sortBy, sortDir);
        }
        // Default: get all shop services
        else {
            response = serviceService.getServicesByShopPaginated(shopId, page, size, sortBy, sortDir);
        }
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get paginated services by category
     */
    @GetMapping("/category/{category}/paginated")
    public ResponseEntity<ServicePageResponse> getServicesByCategoryPaginated(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice) {
        
        // Validate pagination parameters
        if (page < 0) page = 0;
        if (size < 1) size = 20;
        if (size > 100) size = 100;
        
        ServicePageResponse response;
        
        // Use price range filtering for category services
        if (minPrice != null || maxPrice != null) {
            BigDecimal min = minPrice != null ? minPrice : BigDecimal.ZERO;
            BigDecimal max = maxPrice != null ? maxPrice : new BigDecimal("999999.99");
            response = serviceService.getServicesByCategoryAndPriceRangePaginated(category, min, max, page, size, sortBy, sortDir);
        }
        // Use status filtering for category services
        else if (status != null) {
            ServiceStatus serviceStatus = ServiceStatus.valueOf(status.toUpperCase());
            response = serviceService.getServicesByCategoryAndStatusPaginated(category, serviceStatus, page, size, sortBy, sortDir);
        }
        // Default: get all category services
        else {
            response = serviceService.getServicesByCategoryPaginated(category, page, size, sortBy, sortDir);
        }
        
        return ResponseEntity.ok(response);
    }
    
    /**
     * Get paginated services with advanced search
     */
    @GetMapping("/search/paginated")
    public ResponseEntity<ServicePageResponse> searchServicesPaginated(
            @RequestParam(required = false) String q, // search term
            @RequestParam(required = false) Long shopId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String subcategory,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String sortDir) {
        
        // Validate pagination parameters
        if (page < 0) page = 0;
        if (size < 1) size = 20;
        if (size > 100) size = 100;
        
        ServiceStatus serviceStatus = status != null ? ServiceStatus.valueOf(status.toUpperCase()) : null;
        
        ServicePageResponse response = serviceService.getServicesWithFiltersPaginated(
            shopId, serviceStatus, category, subcategory, q, page, size, sortBy, sortDir);
        
        return ResponseEntity.ok(response);
    }
}
