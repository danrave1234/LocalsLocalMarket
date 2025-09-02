# Security Implementation Guide

This document outlines the comprehensive security features implemented in the LocalsLocalMarket backend to ensure proper authentication, authorization, and data protection.

## Overview

The backend implements a multi-layered security approach that verifies all user permissions and validates all inputs, ensuring that the frontend cannot bypass security controls.

## Security Components

### 1. JWT Authentication & Authorization

**Enhanced JWT Service (`JwtService.java`)**
- **Token Validation**: Comprehensive token validation with issuer verification
- **Token Blacklisting**: Support for token revocation
- **Refresh Tokens**: Separate refresh token mechanism for better security
- **Expiration Handling**: Proper token expiration management
- **Claims Validation**: Validates token claims and issuer
- **Role Security**: Tokens do NOT contain role information to prevent manipulation

**JWT Auth Filter (`JwtAuthFilter.java`)**
- **Request Filtering**: Intercepts all requests to validate JWT tokens
- **User Verification**: Verifies user exists in database and is active
- **Audit Logging**: Logs authentication events and suspicious activities
- **IP Tracking**: Tracks client IP addresses for security monitoring
- **Role Verification**: Verifies token claims match database state
- **Manipulation Detection**: Detects and logs role manipulation attempts

### 2. Authorization Service (`AuthorizationService.java`)

**Centralized Permission Management**
- **Role-based Access Control**: Enforces user roles (ADMIN, SELLER)
- **Resource Ownership**: Verifies user ownership of resources
- **Shop Management**: Ensures only shop owners or admins can manage shops
- **Permission Verification**: Centralized methods for permission checking

**Key Methods:**
- `getCurrentUserOrThrow()`: Ensures user is authenticated
- `verifyCanManageShop()`: Verifies shop management permissions
- `isAdmin()`: Checks admin privileges
- `canAccessResource()`: Verifies resource access permissions

### 3. Input Validation Service (`InputValidationService.java`)

**Comprehensive Input Sanitization**
- **Email Validation**: Strict email format validation
- **Phone Validation**: Phone number format validation
- **URL Validation**: URL format and security validation
- **Text Sanitization**: XSS prevention and content filtering
- **Price Validation**: Numeric validation with bounds checking
- **File Path Validation**: Prevents path traversal attacks

**Security Features:**
- **XSS Prevention**: Removes script tags and dangerous content
- **Path Traversal Prevention**: Blocks directory traversal attempts
- **Length Limits**: Enforces maximum input lengths
- **Format Validation**: Ensures proper data formats

### 4. Audit Service (`AuditService.java`)

**Comprehensive Security Logging**
- **Security Events**: Logs all security-related activities
- **User Actions**: Tracks user operations on resources
- **Suspicious Activity**: Monitors for potential security threats
- **Rate Limiting**: Logs rate limit violations

**Event Types:**
- `LOGIN_SUCCESS/FAILURE`: Authentication events
- `PERMISSION_DENIED`: Access control violations
- `RATE_LIMIT_EXCEEDED`: Rate limiting violations
- `SUSPICIOUS_ACTIVITY`: Potential security threats
- `SHOP_CREATE/UPDATE/DELETE`: Resource management events

### 5. Rate Limiting (`RateLimitFilter.java`)

**Multi-level Rate Limiting**
- **IP-based Limiting**: Prevents abuse from specific IP addresses
- **User-based Limiting**: Limits per authenticated user
- **Endpoint-specific Limits**: Different limits for different endpoints
- **Admin Privileges**: Higher limits for admin users

**Rate Limits:**
- **Auth Endpoints**: 10 requests/minute (strict)
- **Upload Endpoints**: 20 requests/minute
- **Create Endpoints**: 30 requests/minute
- **Admin Users**: 200 requests/minute
- **Default**: 60 requests/minute

### 6. Security Configuration (`SecurityConfig.java`)

**Comprehensive Security Headers**
- **Frame Options**: Prevents clickjacking attacks
- **Content Type Options**: Prevents MIME type sniffing
- **HSTS**: Enforces HTTPS connections
- **Referrer Policy**: Controls referrer information

**Role-based Access Control:**
- **Public Endpoints**: `/api/auth/*`, `/api/health`, read-only endpoints
- **Authenticated Endpoints**: File uploads, user profile management
- **Seller/Admin Endpoints**: Shop and product management
- **Admin-only Endpoints**: User management, admin functions

### 7. Exception Handling (`SecurityExceptionHandler.java`)

**Centralized Error Handling**
- **Security Exceptions**: Handles security violations
- **Access Denied**: Manages permission violations
- **Authentication Failures**: Handles auth errors
- **Input Validation**: Manages validation errors

### 8. Role Manipulation Protection

**Comprehensive Role Security**
- **Token Role Removal**: JWT tokens no longer contain role information
- **Database Role Verification**: Every request verifies role against database
- **Role Mismatch Detection**: Alerts on token/database role discrepancies
- **Admin-Only Role Management**: Only legitimate admins can change roles
- **Self-Role Change Prevention**: Admins cannot change their own roles
- **Role Change Logging**: All role changes are audited and logged

**Protection Mechanisms:**
- **JWT Filter Verification**: Validates token claims against database state
- **Authorization Service**: Centralized role checking from database
- **Admin Endpoint Protection**: Role changes require admin authentication
- **Audit Trail**: Complete logging of all role-related activities

### 9. File Upload Security

**Comprehensive File Upload Protection**
- **File Type Validation**: Only allowed image types (jpg, jpeg, png, gif, webp)
- **Magic Byte Verification**: Validates file headers match declared type
- **Size Limits**: Configurable maximum file size (10MB default)
- **Dangerous Extension Blocking**: Blocks executable and script files
- **Malicious Content Scanning**: Detects embedded scripts and executable code
- **Virus Pattern Detection**: Scans for common malicious patterns
- **Secure Filename Generation**: UUID-based filenames prevent path traversal
- **Content Sanitization**: Removes dangerous HTML, SQL, and XML content

**Security Features:**
- **File Upload Security Service**: Centralized file validation and scanning
- **Enhanced Input Validation**: Comprehensive sanitization for all input types
- **Audit Logging**: Complete tracking of file upload attempts and rejections
- **Real-time Scanning**: Immediate validation before file storage
- **Path Traversal Prevention**: Secure file path handling
- **Null Byte Detection**: Prevents malicious file uploads with null bytes

**Protected Against:**
- **Malware Uploads**: Executable files, scripts, and viruses
- **Image-based Attacks**: Malicious images with embedded code
- **Path Traversal**: Directory traversal attempts
- **Content Injection**: Script tags, SQL injection, XSS in files
- **File Type Spoofing**: Files with wrong extensions
- **Oversized Files**: Denial of service through large uploads



**Response Format:**
```json
{
  "error": "Security violation",
  "message": "Detailed error message",
  "timestamp": "2024-01-01T00:00:00Z",
  "path": "/api/endpoint"
}
```

## Security Best Practices Implemented

### 1. Never Trust the Frontend
- **Backend Verification**: All permissions verified server-side
- **Input Validation**: All inputs validated and sanitized
- **Role Checking**: User roles verified on every request
- **Resource Ownership**: Ownership verified for all operations

### 2. Defense in Depth
- **Multiple Layers**: Authentication, authorization, validation, rate limiting
- **Audit Logging**: Comprehensive logging for monitoring
- **Error Handling**: Secure error responses
- **Input Sanitization**: Multiple validation layers

### 3. Principle of Least Privilege
- **Role-based Access**: Users only access what they need
- **Resource Isolation**: Users can only manage their own resources
- **Admin Privileges**: Admin access strictly controlled
- **Endpoint Protection**: Each endpoint properly secured

### 4. Secure by Default
- **Deny by Default**: All requests denied unless explicitly allowed
- **Secure Headers**: Security headers enabled by default
- **Input Validation**: All inputs validated by default
- **Audit Logging**: All security events logged by default

## Configuration

### Environment Variables

**JWT Configuration:**
```bash
LLM_JWT_SECRET=your-secure-secret-key
LLM_JWT_TTL_MINUTES=1440
LLM_JWT_REFRESH_TTL_MINUTES=10080
```

**Rate Limiting:**
```bash
LLM_RATE_LIMIT_ENABLED=true
LLM_RATE_LIMIT_AUTH=10
LLM_RATE_LIMIT_UPLOAD=20
LLM_RATE_LIMIT_CREATE=30
LLM_RATE_LIMIT_ADMIN=200
```

**Audit Logging:**
```bash
LLM_AUDIT_ENABLED=true
LLM_AUDIT_RETENTION_HOURS=24
LLM_LOG_AUDIT=WARN
```

**Input Validation:**
```bash
LLM_VALIDATION_ENABLED=true
LLM_VALIDATION_MAX_EMAIL=255
LLM_VALIDATION_MAX_NAME=100
LLM_VALIDATION_MAX_DESCRIPTION=1000
```

**File Upload Security:**
```bash
LLM_UPLOAD_MAX_FILE_SIZE=10485760
LLM_UPLOAD_ALLOWED_IMAGE_TYPES=jpg,jpeg,png,gif,webp
LLM_UPLOAD_UPLOAD_DIRECTORY=uploads
LLM_UPLOAD_SCAN_FOR_VIRUSES=true
```

## Monitoring and Maintenance

### 1. Audit Log Monitoring
- Monitor audit logs for suspicious activities
- Review permission denied events
- Track rate limit violations
- Monitor authentication failures

### 2. Security Headers
- Regularly review security header configurations
- Update CSP policies as needed
- Monitor HSTS compliance

### 3. Rate Limiting
- Monitor rate limit violations
- Adjust limits based on usage patterns
- Review IP-based blocking

### 4. Token Management
- Regularly rotate JWT secrets
- Monitor token blacklisting
- Review token expiration policies

## Security Checklist

- [x] JWT token validation and blacklisting
- [x] Role-based access control
- [x] Input validation and sanitization
- [x] Rate limiting (IP and user-based)
- [x] Comprehensive audit logging
- [x] Security headers implementation
- [x] Exception handling
- [x] Resource ownership verification
- [x] XSS prevention
- [x] Path traversal prevention
- [x] CSRF protection (disabled for API)
- [x] Secure error responses
- [x] **Role manipulation protection**
- [x] **Token role verification**
- [x] **Admin-only role management**
- [x] **Database role validation**
- [x] **File upload security**
- [x] **Virus scanning**
- [x] **Malicious content detection**
- [x] **Enhanced input sanitization**


## Future Enhancements

1. **Database-level Security**: Row-level security policies
2. **API Key Management**: For third-party integrations
3. **Advanced Rate Limiting**: Machine learning-based detection
4. **Real-time Monitoring**: Security event dashboard
5. **Automated Threat Detection**: AI-based security monitoring
6. **Encryption at Rest**: Database encryption
7. **Backup Security**: Encrypted backups
8. **Compliance**: GDPR, SOC2 compliance features

## Conclusion

The implemented security features provide comprehensive protection against common web application vulnerabilities while ensuring that the backend always verifies permissions and validates inputs, regardless of what the frontend sends. The multi-layered approach ensures that even if one security measure fails, others will continue to provide protection.
