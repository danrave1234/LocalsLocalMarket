package org.localslocalmarket.security;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileUploadSecurityService {

    @Value("${llm.upload.max-file-size:10485760}") // 10MB default
    private long maxFileSize;

    @Value("${llm.upload.allowed-image-types:jpg,jpeg,png,gif,webp}")
    private String allowedImageTypes;

    @Value("${llm.upload.upload-directory:uploads}")
    private String uploadDirectory;

    @Value("${llm.upload.scan-for-viruses:true}")
    private boolean scanForViruses;

    // Dangerous file extensions that could contain executable code
    private static final Set<String> DANGEROUS_EXTENSIONS = new HashSet<>(Arrays.asList(
        "exe", "bat", "cmd", "com", "pif", "scr", "vbs", "js", "jar", "war", "ear",
        "php", "asp", "aspx", "jsp", "py", "pl", "sh", "ps1", "psm1", "psd1",
        "dll", "so", "dylib", "sys", "drv", "bin", "msi", "msu", "cab", "zip",
        "rar", "7z", "tar", "gz", "bz2", "xz", "iso", "img", "vhd", "vmdk"
    ));

    // Magic bytes for common image formats
    private static final byte[] JPEG_HEADER = {(byte) 0xFF, (byte) 0xD8, (byte) 0xFF};
    private static final byte[] PNG_HEADER = {(byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A};
    private static final byte[] GIF_HEADER_87A = {0x47, 0x49, 0x46, 0x38, 0x37, 0x61};
    private static final byte[] GIF_HEADER_89A = {0x47, 0x49, 0x46, 0x38, 0x39, 0x61};
    private static final byte[] WEBP_HEADER = {0x52, 0x49, 0x46, 0x46};

    // Patterns for detecting malicious content
    private static final Pattern SCRIPT_PATTERN = Pattern.compile(
        "<script[^>]*>.*?</script>|<iframe[^>]*>.*?</iframe>|<object[^>]*>.*?</object>",
        Pattern.CASE_INSENSITIVE | Pattern.DOTALL
    );

    private static final Pattern PHP_PATTERN = Pattern.compile(
        "<?php|<\\?|<%|<script[^>]*php",
        Pattern.CASE_INSENSITIVE
    );

    private static final Pattern EXECUTABLE_PATTERN = Pattern.compile(
        "\\b(eval|exec|system|shell_exec|passthru|popen|proc_open|pcntl_exec)\\s*\\(",
        Pattern.CASE_INSENSITIVE
    );

    private final AuditService auditService;

    public FileUploadSecurityService(AuditService auditService) {
        this.auditService = auditService;
    }

    /**
     * Validates and secures file upload
     */
    public FileValidationResult validateAndSecureFile(MultipartFile file, String userId) {
        try {
            // Check file size
            if (file.getSize() > maxFileSize) {
                auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                    userId, "File upload rejected: size too large - " + file.getSize() + " bytes");
                return new FileValidationResult(false, "File size exceeds maximum allowed size");
            }

            // Check if file is empty
            if (file.isEmpty()) {
                return new FileValidationResult(false, "File cannot be empty");
            }

            // Get file extension
            String originalFilename = file.getOriginalFilename();
            if (originalFilename == null || originalFilename.trim().isEmpty()) {
                return new FileValidationResult(false, "Invalid filename");
            }

            String extension = getFileExtension(originalFilename).toLowerCase();
            
            // Check for dangerous extensions
            if (DANGEROUS_EXTENSIONS.contains(extension)) {
                auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                    userId, "Dangerous file upload attempt: " + originalFilename);
                return new FileValidationResult(false, "File type not allowed for security reasons");
            }

            // Validate image files
            if (isImageFile(extension)) {
                FileValidationResult imageValidation = validateImageFile(file, userId);
                if (!imageValidation.isValid()) {
                    return imageValidation;
                }
            }

            // Scan for malicious content
            if (scanForViruses) {
                FileValidationResult virusScan = scanForMaliciousContent(file, userId);
                if (!virusScan.isValid()) {
                    return virusScan;
                }
            }

            // Generate secure filename
            String secureFilename = generateSecureFilename(originalFilename);
            
            return new FileValidationResult(true, "File validated successfully", secureFilename);

        } catch (Exception e) {
            auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                userId, "File validation error: " + e.getMessage());
            return new FileValidationResult(false, "File validation failed: " + e.getMessage());
        }
    }

    /**
     * Validates image files specifically
     */
    private FileValidationResult validateImageFile(MultipartFile file, String userId) {
        try {
            byte[] content = file.getBytes();
            
            // Check magic bytes
            if (!isValidImageMagicBytes(content)) {
                auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                    userId, "Invalid image file: magic bytes mismatch - " + file.getOriginalFilename());
                return new FileValidationResult(false, "Invalid image file format");
            }

            // Check for embedded scripts in images
            String contentString = new String(content);
            if (containsMaliciousContent(contentString)) {
                auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                    userId, "Malicious content detected in image: " + file.getOriginalFilename());
                return new FileValidationResult(false, "Image contains malicious content");
            }

            // Validate image dimensions (basic check)
            if (!validateImageDimensions(content)) {
                auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                    userId, "Invalid image dimensions: " + file.getOriginalFilename());
                return new FileValidationResult(false, "Image dimensions are invalid");
            }

            return new FileValidationResult(true, "Image validated successfully");

        } catch (IOException e) {
            auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                userId, "Image validation error: " + e.getMessage());
            return new FileValidationResult(false, "Image validation failed");
        }
    }

    /**
     * Scans file content for malicious patterns
     */
    private FileValidationResult scanForMaliciousContent(MultipartFile file, String userId) {
        try {
            String content = new String(file.getBytes());
            
            // Check for script tags
            if (SCRIPT_PATTERN.matcher(content).find()) {
                auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                    userId, "Script tags detected in file: " + file.getOriginalFilename());
                return new FileValidationResult(false, "File contains script tags");
            }

            // Check for PHP code
            if (PHP_PATTERN.matcher(content).find()) {
                auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                    userId, "PHP code detected in file: " + file.getOriginalFilename());
                return new FileValidationResult(false, "File contains PHP code");
            }

            // Check for executable functions
            if (EXECUTABLE_PATTERN.matcher(content).find()) {
                auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                    userId, "Executable functions detected in file: " + file.getOriginalFilename());
                return new FileValidationResult(false, "File contains executable functions");
            }

            // Check for null bytes (common in malicious files)
            if (content.contains("\0")) {
                auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                    userId, "Null bytes detected in file: " + file.getOriginalFilename());
                return new FileValidationResult(false, "File contains null bytes");
            }

            return new FileValidationResult(true, "File content validated successfully");

        } catch (IOException e) {
            auditService.logSecurityEvent(AuditService.AuditEventType.SUSPICIOUS_ACTIVITY, 
                userId, "Content scanning error: " + e.getMessage());
            return new FileValidationResult(false, "Content scanning failed");
        }
    }

    /**
     * Checks if file has valid image magic bytes
     */
    private boolean isValidImageMagicBytes(byte[] content) {
        if (content.length < 8) return false;

        // Check JPEG
        if (startsWith(content, JPEG_HEADER)) return true;
        
        // Check PNG
        if (startsWith(content, PNG_HEADER)) return true;
        
        // Check GIF
        if (startsWith(content, GIF_HEADER_87A) || startsWith(content, GIF_HEADER_89A)) return true;
        
        // Check WebP (basic check)
        if (startsWith(content, WEBP_HEADER)) return true;

        return false;
    }

    /**
     * Validates image dimensions (basic implementation)
     */
    private boolean validateImageDimensions(byte[] content) {
        // Basic validation - in production, use proper image processing library
        // This is a simplified check to prevent extremely large images
        return content.length > 100 && content.length < 50 * 1024 * 1024; // 50MB max
    }

    /**
     * Checks if content contains malicious patterns
     */
    private boolean containsMaliciousContent(String content) {
        return SCRIPT_PATTERN.matcher(content).find() ||
               PHP_PATTERN.matcher(content).find() ||
               EXECUTABLE_PATTERN.matcher(content).find() ||
               content.contains("\0");
    }

    /**
     * Generates a secure filename
     */
    private String generateSecureFilename(String originalFilename) {
        String extension = getFileExtension(originalFilename);
        String uuid = UUID.randomUUID().toString();
        return uuid + "." + extension;
    }

    /**
     * Gets file extension
     */
    private String getFileExtension(String filename) {
        int lastDot = filename.lastIndexOf('.');
        return lastDot > 0 ? filename.substring(lastDot + 1) : "";
    }

    /**
     * Checks if file is an image based on extension
     */
    private boolean isImageFile(String extension) {
        Set<String> imageExtensions = new HashSet<>(Arrays.asList(allowedImageTypes.split(",")));
        return imageExtensions.contains(extension.toLowerCase());
    }

    /**
     * Checks if byte array starts with specific bytes
     */
    private boolean startsWith(byte[] array, byte[] prefix) {
        if (array.length < prefix.length) return false;
        for (int i = 0; i < prefix.length; i++) {
            if (array[i] != prefix[i]) return false;
        }
        return true;
    }

    /**
     * Sanitizes filename for safe storage
     */
    public String sanitizeFilename(String filename) {
        if (filename == null) return "";
        
        // Remove path traversal attempts
        filename = filename.replaceAll("[\\.\\./\\\\]", "");
        
        // Remove special characters
        filename = filename.replaceAll("[^a-zA-Z0-9._-]", "");
        
        // Limit length
        if (filename.length() > 255) {
            filename = filename.substring(0, 255);
        }
        
        return filename;
    }

    /**
     * Creates secure upload directory
     */
    public Path createSecureUploadPath(String filename) throws IOException {
        Path uploadPath = Paths.get(uploadDirectory);
        
        // Create directory if it doesn't exist
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        
        // Set proper permissions (readable by web server, not executable)
        uploadPath.toFile().setReadable(true, false);
        uploadPath.toFile().setWritable(true, false);
        uploadPath.toFile().setExecutable(false, false);
        
        return uploadPath.resolve(filename);
    }

    /**
     * File validation result
     */
    public static class FileValidationResult {
        private final boolean valid;
        private final String message;
        private final String secureFilename;

        public FileValidationResult(boolean valid, String message) {
            this(valid, message, null);
        }

        public FileValidationResult(boolean valid, String message, String secureFilename) {
            this.valid = valid;
            this.message = message;
            this.secureFilename = secureFilename;
        }

        public boolean isValid() { return valid; }
        public String getMessage() { return message; }
        public String getSecureFilename() { return secureFilename; }
    }
}
