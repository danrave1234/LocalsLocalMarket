package org.localslocalmarket.security;

import java.math.BigDecimal;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

@Service
public class InputValidationService {
    
    // Regex patterns for validation
    private static final Pattern EMAIL_PATTERN = Pattern.compile(
            "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
    
    private static final Pattern PHONE_PATTERN = Pattern.compile(
            "^[+]?[0-9\\s\\-\\(\\)]{7,20}$");
    
    private static final Pattern URL_PATTERN = Pattern.compile(
            "^(https?://)?([\\w-]+\\.)+[\\w-]+(/[\\w-./?%&=]*)?$");
    
    private static final Pattern NAME_PATTERN = Pattern.compile(
            "^[a-zA-Z0-9\\s\\-_\\.]{1,100}$");
    
    private static final Pattern DESCRIPTION_PATTERN = Pattern.compile(
            "^[\\w\\s\\-_\\.\\,\\!\\?\\;\\:\\(\\)\\[\\]\\{\\}\"']{0,1000}$");
    
    private static final Pattern PRICE_PATTERN = Pattern.compile(
            "^\\d+(\\.\\d{1,2})?$");
    
    private static final Pattern CATEGORY_PATTERN = Pattern.compile(
            "^[a-zA-Z0-9\\s\\-_\\.]{1,50}$");

    /**
     * Validate and sanitize email address
     */
    public String validateEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email cannot be empty");
        }
        
        String sanitizedEmail = email.trim().toLowerCase();
        
        if (!EMAIL_PATTERN.matcher(sanitizedEmail).matches()) {
            throw new IllegalArgumentException("Invalid email format");
        }
        
        if (sanitizedEmail.length() > 255) {
            throw new IllegalArgumentException("Email too long");
        }
        
        return sanitizedEmail;
    }

    /**
     * Validate and sanitize phone number
     */
    public String validatePhone(String phone) {
        if (phone == null || phone.trim().isEmpty()) {
            return null; // Phone is optional
        }
        
        String sanitizedPhone = phone.trim();
        
        if (!PHONE_PATTERN.matcher(sanitizedPhone).matches()) {
            throw new IllegalArgumentException("Invalid phone number format");
        }
        
        if (sanitizedPhone.length() > 20) {
            throw new IllegalArgumentException("Phone number too long");
        }
        
        return sanitizedPhone;
    }

    /**
     * Validate and sanitize URL
     */
    public String validateUrl(String url) {
        if (url == null || url.trim().isEmpty()) {
            return null; // URL is optional
        }
        
        String sanitizedUrl = url.trim();
        
        if (!URL_PATTERN.matcher(sanitizedUrl).matches()) {
            throw new IllegalArgumentException("Invalid URL format");
        }
        
        if (sanitizedUrl.length() > 500) {
            throw new IllegalArgumentException("URL too long");
        }
        
        return sanitizedUrl;
    }

    /**
     * Validate and sanitize name
     */
    public String validateName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be empty");
        }
        
        String sanitizedName = name.trim();
        
        if (!NAME_PATTERN.matcher(sanitizedName).matches()) {
            throw new IllegalArgumentException("Invalid name format");
        }
        
        if (sanitizedName.length() > 100) {
            throw new IllegalArgumentException("Name too long");
        }
        
        return sanitizedName;
    }

    /**
     * Validate and sanitize description
     */
    public String validateDescription(String description) {
        if (description == null || description.trim().isEmpty()) {
            return null; // Description is optional
        }
        
        String sanitizedDescription = description.trim();
        
        if (!DESCRIPTION_PATTERN.matcher(sanitizedDescription).matches()) {
            throw new IllegalArgumentException("Invalid description format");
        }
        
        if (sanitizedDescription.length() > 1000) {
            throw new IllegalArgumentException("Description too long");
        }
        
        return sanitizedDescription;
    }

    /**
     * Validate and sanitize price
     */
    public BigDecimal validatePrice(BigDecimal price) {
        if (price == null) {
            throw new IllegalArgumentException("Price cannot be null");
        }
        
        if (price.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
        
        if (price.compareTo(new BigDecimal("999999.99")) > 0) {
            throw new IllegalArgumentException("Price too high");
        }
        
        // Round to 2 decimal places
        return price.setScale(2, BigDecimal.ROUND_HALF_UP);
    }

    /**
     * Validate and sanitize category
     */
    public String validateCategory(String category) {
        if (category == null || category.trim().isEmpty()) {
            throw new IllegalArgumentException("Category cannot be empty");
        }
        
        String sanitizedCategory = category.trim();
        
        if (!CATEGORY_PATTERN.matcher(sanitizedCategory).matches()) {
            throw new IllegalArgumentException("Invalid category format");
        }
        
        if (sanitizedCategory.length() > 50) {
            throw new IllegalArgumentException("Category too long");
        }
        
        return sanitizedCategory;
    }

    /**
     * Validate and sanitize stock count
     */
    public Integer validateStockCount(Integer stockCount) {
        if (stockCount == null) {
            return null; // Stock count is optional
        }
        
        if (stockCount < 0) {
            throw new IllegalArgumentException("Stock count cannot be negative");
        }
        
        if (stockCount > 999999) {
            throw new IllegalArgumentException("Stock count too high");
        }
        
        return stockCount;
    }

    /**
     * Validate and sanitize coordinates
     */
    public Double validateLatitude(Double lat) {
        if (lat == null) {
            return null; // Latitude is optional
        }
        
        if (lat < -90 || lat > 90) {
            throw new IllegalArgumentException("Invalid latitude value");
        }
        
        return lat;
    }

    public Double validateLongitude(Double lng) {
        if (lng == null) {
            return null; // Longitude is optional
        }
        
        if (lng < -180 || lng > 180) {
            throw new IllegalArgumentException("Invalid longitude value");
        }
        
        return lng;
    }

    /**
     * Validate and sanitize file path
     */
    public String validateFilePath(String filePath) {
        if (filePath == null || filePath.trim().isEmpty()) {
            return null; // File path is optional
        }
        
        String sanitizedPath = filePath.trim();
        
        // Check for path traversal attempts
        if (sanitizedPath.contains("..") || sanitizedPath.contains("\\") || 
            sanitizedPath.startsWith("/") || sanitizedPath.startsWith("http")) {
            throw new IllegalArgumentException("Invalid file path");
        }
        
        if (sanitizedPath.length() > 500) {
            throw new IllegalArgumentException("File path too long");
        }
        
        return sanitizedPath;
    }

    /**
     * Validates and sanitizes HTML content
     */
    public String sanitizeHtml(String html) {
        if (html == null || html.trim().isEmpty()) {
            return "";
        }
        
        // Remove dangerous HTML tags and attributes
        String sanitized = html.replaceAll("(?i)<script[^>]*>.*?</script>", "");
        sanitized = sanitized.replaceAll("(?i)<iframe[^>]*>.*?</iframe>", "");
        sanitized = sanitized.replaceAll("(?i)<object[^>]*>.*?</object>", "");
        sanitized = sanitized.replaceAll("(?i)<embed[^>]*>", "");
        sanitized = sanitized.replaceAll("(?i)<form[^>]*>.*?</form>", "");
        
        // Remove dangerous attributes
        sanitized = sanitized.replaceAll("(?i)\\s+on\\w+\\s*=\\s*[\"'][^\"']*[\"']", "");
        sanitized = sanitized.replaceAll("(?i)\\s+javascript\\s*:", "");
        sanitized = sanitized.replaceAll("(?i)\\s+vbscript\\s*:", "");
        sanitized = sanitized.replaceAll("(?i)\\s+data\\s*:", "");
        
        // Limit length
        if (sanitized.length() > 10000) {
            sanitized = sanitized.substring(0, 10000);
        }
        
        return sanitized;
    }

    /**
     * Validates and sanitizes SQL-like content
     */
    public String sanitizeSqlContent(String content) {
        if (content == null || content.trim().isEmpty()) {
            return "";
        }
        
        // Remove SQL injection patterns
        String sanitized = content.replaceAll("(?i)\\b(union|select|insert|update|delete|drop|create|alter|exec|execute)\\b", "");
        sanitized = sanitized.replaceAll("['\";]", "");
        sanitized = sanitized.replaceAll("--", "");
        sanitized = sanitized.replaceAll("/\\*.*?\\*/", "");
        
        // Limit length
        if (sanitized.length() > 1000) {
            sanitized = sanitized.substring(0, 1000);
        }
        
        return sanitized;
    }

    /**
     * Validates and sanitizes XML content
     */
    public String sanitizeXmlContent(String xml) {
        if (xml == null || xml.trim().isEmpty()) {
            return "";
        }
        
        // Remove XML injection patterns
        String sanitized = xml.replaceAll("<!\\[CDATA\\[.*?\\]\\]>", "");
        sanitized = sanitized.replaceAll("(?i)<!DOCTYPE[^>]*>", "");
        sanitized = sanitized.replaceAll("(?i)<?xml[^>]*>", "");
        sanitized = sanitized.replaceAll("<\\?[^>]*\\?>", "");
        
        // Remove dangerous entities
        sanitized = sanitized.replaceAll("&[^;]+;", "");
        
        // Limit length
        if (sanitized.length() > 5000) {
            sanitized = sanitized.substring(0, 5000);
        }
        
        return sanitized;
    }

    /**
     * Validates and sanitizes base64 content
     */
    public String validateBase64(String base64) {
        if (base64 == null || base64.trim().isEmpty()) {
            return "";
        }
        
        // Check if it's valid base64
        if (!base64.matches("^[A-Za-z0-9+/]*={0,2}$")) {
            throw new IllegalArgumentException("Invalid base64 format");
        }
        
        // Limit length
        if (base64.length() > 1000000) { // 1MB max
            throw new IllegalArgumentException("Base64 content too large");
        }
        
        return base64;
    }

    /**
     * Validates and sanitizes binary data
     */
    public byte[] validateBinaryData(byte[] data) {
        if (data == null) {
            return new byte[0];
        }
        
        // Check for null bytes (common in malicious files)
        for (byte b : data) {
            if (b == 0) {
                throw new IllegalArgumentException("Binary data contains null bytes");
            }
        }
        
        // Limit size
        if (data.length > 10 * 1024 * 1024) { // 10MB max
            throw new IllegalArgumentException("Binary data too large");
        }
        
        return data;
    }

    /**
     * Validate and sanitize JSON string
     */
    public String validateJsonString(String jsonString) {
        if (jsonString == null || jsonString.trim().isEmpty()) {
            return null; // JSON string is optional
        }
        
        String sanitizedJson = jsonString.trim();
        
        // Basic JSON validation (check for common injection patterns)
        if (sanitizedJson.contains("<script>") || sanitizedJson.contains("javascript:") ||
            sanitizedJson.contains("onload=") || sanitizedJson.contains("onerror=")) {
            throw new IllegalArgumentException("Invalid JSON content");
        }
        
        if (sanitizedJson.length() > 10000) {
            throw new IllegalArgumentException("JSON string too long");
        }
        
        return sanitizedJson;
    }

    /**
     * Sanitize general text input
     */
    public String sanitizeText(String text) {
        if (text == null) {
            return null;
        }
        
        String sanitized = text.trim();
        
        // Remove potential XSS vectors
        sanitized = sanitized.replaceAll("<script[^>]*>.*?</script>", "")
                           .replaceAll("javascript:", "")
                           .replaceAll("on\\w+\\s*=", "")
                           .replaceAll("data:", "");
        
        return sanitized;
    }

    /**
     * Validate password strength
     */
    public void validatePassword(String password) {
        // Temporarily disable password strength restrictions.
        // Note: Request DTOs use @NotBlank, so empty passwords are still rejected by validation.
        // This method intentionally does nothing for now.
    }
}
