package org.localslocalmarket.web;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;

@RestController
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public ResponseEntity<Map<String, Object>> handleError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        Object message = request.getAttribute(RequestDispatcher.ERROR_MESSAGE);
        Object path = request.getAttribute(RequestDispatcher.ERROR_REQUEST_URI);
        String method = request.getMethod();

        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("timestamp", LocalDateTime.now());
        errorResponse.put("path", path);
        errorResponse.put("method", method);

        if (status != null) {
            int statusCode = Integer.parseInt(status.toString());
            errorResponse.put("status", statusCode);

            switch (statusCode) {
                case 404:
                    errorResponse.put("error", "Not Found");
                    errorResponse.put("message", "The requested resource was not found");
                    errorResponse.put("code", "RESOURCE_NOT_FOUND");
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
                
                case 403:
                    errorResponse.put("error", "Forbidden");
                    errorResponse.put("message", "Access to this resource is forbidden");
                    errorResponse.put("code", "ACCESS_FORBIDDEN");
                    return ResponseEntity.status(HttpStatus.FORBIDDEN).body(errorResponse);
                
                case 401:
                    errorResponse.put("error", "Unauthorized");
                    errorResponse.put("message", "Authentication is required to access this resource");
                    errorResponse.put("code", "UNAUTHORIZED");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
                
                case 405:
                    errorResponse.put("error", "Method Not Allowed");
                    errorResponse.put("message", "The HTTP method is not supported for this resource");
                    errorResponse.put("code", "METHOD_NOT_ALLOWED");
                    return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(errorResponse);
                
                case 500:
                    errorResponse.put("error", "Internal Server Error");
                    errorResponse.put("message", "An internal server error occurred");
                    errorResponse.put("code", "INTERNAL_SERVER_ERROR");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
                
                default:
                    errorResponse.put("error", "Error");
                    errorResponse.put("message", message != null ? message.toString() : "An error occurred");
                    errorResponse.put("code", "GENERIC_ERROR");
                    return ResponseEntity.status(HttpStatus.valueOf(statusCode)).body(errorResponse);
            }
        }

        // Fallback for unknown errors
        errorResponse.put("status", 500);
        errorResponse.put("error", "Unknown Error");
        errorResponse.put("message", "An unknown error occurred");
        errorResponse.put("code", "UNKNOWN_ERROR");
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
