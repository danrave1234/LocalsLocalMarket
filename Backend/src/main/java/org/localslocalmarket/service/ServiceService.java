package org.localslocalmarket.service;

import java.util.List;

import org.localslocalmarket.model.Service;
import org.localslocalmarket.model.ServiceStatus;
import org.localslocalmarket.repository.ServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;

@org.springframework.stereotype.Service
public class ServiceService {
    
    @Autowired
    private ServiceRepository serviceRepository;
    
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
        return serviceRepository.save(service);
    }
    
    public Service updateService(Long id, Service serviceDetails) {
        Service service = serviceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Service not found"));
        
        service.setTitle(serviceDetails.getTitle());
        service.setDescription(serviceDetails.getDescription());
        service.setPrice(serviceDetails.getPrice());
        service.setMainCategory(serviceDetails.getMainCategory());
        service.setSubcategory(serviceDetails.getSubcategory());
        service.setCustomCategory(serviceDetails.getCustomCategory());
        service.setStatus(serviceDetails.getStatus());
        service.setIsActive(serviceDetails.getIsActive());
        
        return serviceRepository.save(service);
    }
    
    public void deleteService(Long id) {
        Service service = serviceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Service not found"));
        service.setIsActive(false);
        serviceRepository.save(service);
    }
    
    public Service getServiceById(Long id) {
        return serviceRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Service not found"));
    }
}
