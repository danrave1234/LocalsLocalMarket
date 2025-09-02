package org.localslocalmarket.web;

import java.util.List;

import org.localslocalmarket.model.Service;
import org.localslocalmarket.model.ServiceStatus;
import org.localslocalmarket.service.ServiceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
    public ResponseEntity<Service> createService(@RequestBody Service service, 
                                             @RequestHeader("Authorization") String token) {
        // TODO: Validate shop ownership
        Service createdService = serviceService.createService(service);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdService);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Service> updateService(@PathVariable Long id, 
                                               @RequestBody Service serviceDetails,
                                               @RequestHeader("Authorization") String token) {
        // TODO: Validate shop ownership
        Service updatedService = serviceService.updateService(id, serviceDetails);
        return ResponseEntity.ok(updatedService);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id,
                                         @RequestHeader("Authorization") String token) {
        // TODO: Validate shop ownership
        serviceService.deleteService(id);
        return ResponseEntity.ok().build();
    }
}
