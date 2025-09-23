package org.localslocalmarket.web;

import java.io.IOException;
import java.util.Map;

import org.localslocalmarket.security.AuditService;
import org.localslocalmarket.security.AuthorizationService;
import org.localslocalmarket.security.FileUploadSecurityService;
import org.localslocalmarket.service.CloudStorageService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/uploads")
public class UploadController {
    
    private final CloudStorageService cloudStorageService;
    private final FileUploadSecurityService fileUploadSecurityService;
    private final AuthorizationService authorizationService;
    private final AuditService auditService;

    public UploadController(CloudStorageService cloudStorageService,
                            FileUploadSecurityService fileUploadSecurityService,
                            AuthorizationService authorizationService,
                            AuditService auditService) {
        this.cloudStorageService = cloudStorageService;
        this.fileUploadSecurityService = fileUploadSecurityService;
        this.authorizationService = authorizationService;
        this.auditService = auditService;
    }

        @PostMapping(path = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> upload(@RequestPart("file") MultipartFile file,
                                   @RequestParam(value = "type", defaultValue = "general") String type) throws IOException {
        // Get current user for security logging
        String userId = authorizationService.getCurrentUserOrThrow().getId().toString();
        
        // Validate and secure the file upload
        FileUploadSecurityService.FileValidationResult validation = 
            fileUploadSecurityService.validateAndSecureFile(file, userId);
        
        if (!validation.isValid()) {
            auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                userId, "File upload rejected: " + validation.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", validation.getMessage()));
        }
        
        // Log successful validation
        auditService.logSecurityEvent(AuditService.AuditEventType.SHOP_CREATE, 
            userId, "File upload validated successfully: " + file.getOriginalFilename());
    
        try {
            // Always use Google Cloud Storage
            if (!cloudStorageService.isEnabled()) {
                auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                    userId, "Attempted file upload when GCS is disabled");
                return ResponseEntity.badRequest().body(Map.of("error", "Cloud storage is not available"));
            }
            
            // Determine folder based on type
            String folder = getFolderForType(type) + "/users/" + userId;
            String cloudUrl = cloudStorageService.uploadFile(file, folder);
            return ResponseEntity.ok(Map.of("path", cloudUrl));
        } catch (Exception e) {
            auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                userId, "File upload failed: " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to save image: " + e.getMessage()));
        }
    }

    @DeleteMapping("/image")
    public ResponseEntity<?> deleteImage(@RequestParam("url") String imageUrl) {
        try {
            // Get current user for security logging
            String userId = authorizationService.getCurrentUserOrThrow().getId().toString();
            
            // Validate that the URL is provided
            if (imageUrl == null || imageUrl.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Image URL is required"));
            }
            
            // Only handle GCS URLs - no local storage support
            if (!imageUrl.startsWith("https://storage.googleapis.com/")) {
                auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                    userId, "Attempted to delete non-GCS URL: " + imageUrl);
                return ResponseEntity.badRequest().body(Map.of("error", "Only Google Cloud Storage URLs are supported"));
            }
            
            // Ensure GCS is enabled
            if (!cloudStorageService.isEnabled()) {
                auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                    userId, "Attempted to delete GCS URL when GCS is disabled: " + imageUrl);
                return ResponseEntity.badRequest().body(Map.of("error", "Cloud storage is not enabled"));
            }
            
            // Enforce user-scoped path: must include /users/{userId}/
            if (!imageUrl.contains("/users/" + userId + "/")) {
                auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                    userId, "Attempt to delete file outside user scope: " + imageUrl);
                return ResponseEntity.status(403).body(Map.of("error", "Forbidden: cannot delete files you do not own"));
            }

            // Delete from cloud storage
            cloudStorageService.deleteFileByUrl(imageUrl);
            
            // Log successful deletion
            auditService.logSecurityEvent(AuditService.AuditEventType.SHOP_UPDATE, 
                userId, "Image deleted successfully from cloud storage: " + imageUrl);
            
            return ResponseEntity.ok(Map.of("message", "Image deleted successfully"));
        } catch (Exception e) {
            // Log the error
            String userId = authorizationService.getCurrentUserOrThrow().getId().toString();
            auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                userId, "Image deletion failed: " + imageUrl + " - " + e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", "Failed to delete image: " + e.getMessage()));
        }
    }

    /**
     * Determine the folder path based on the upload type
     */
    private String getFolderForType(String type) {
        switch (type.toLowerCase()) {
            case "shop":
            case "shops":
                return "shops";
            case "product":
            case "products":
                return "products";
            case "service":
            case "services":
                return "services";
            case "user":
            case "users":
            case "profile":
                return "users";
            case "category":
            case "categories":
                return "categories";
            case "banner":
            case "banners":
                return "banners";
            case "logo":
            case "logos":
                return "logos";
            case "cover":
            case "covers":
                return "covers";
            default:
                return "general";
        }
    }
}
