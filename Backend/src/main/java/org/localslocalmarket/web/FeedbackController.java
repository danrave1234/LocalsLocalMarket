package org.localslocalmarket.web;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.localslocalmarket.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/feedback")
@CrossOrigin(origins = "*")
public class FeedbackController {

    private final EmailService emailService;

    public FeedbackController(EmailService emailService) {
        this.emailService = emailService;
    }

    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> sendFeedback(@RequestBody FeedbackRequest request) {
        try {
            // Validate request
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Name is required"));
            }
            
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Email is required"));
            }
            
            if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
                return ResponseEntity.badRequest().body(createErrorResponse("Message is required"));
            }

            // Log the feedback (you can check your application logs)
            System.out.println("=== NEW FEEDBACK RECEIVED ===");
            System.out.println("Name: " + request.getName());
            System.out.println("Email: " + request.getEmail());
            System.out.println("Subject: " + request.getSubject());
            System.out.println("Message: " + request.getMessage());
            System.out.println("Received at: " + LocalDateTime.now());
            System.out.println("=============================");

            // Send email notification
            try {
                emailService.sendFeedbackEmail(
                    request.getEmail(),
                    request.getName(),
                    request.getSubject(),
                    request.getMessage(),
                    request.getEmail()
                );
            } catch (Exception e) {
                System.err.println("Failed to send feedback email: " + e.getMessage());
                // Continue anyway - don't fail the request if email fails
            }

            // Return success response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Feedback received successfully! We'll get back to you soon.");
            response.put("timestamp", LocalDateTime.now());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            // Log the error
            System.err.println("Error processing feedback: " + e.getMessage());
            e.printStackTrace();
            
            return ResponseEntity.internalServerError().body(createErrorResponse("Failed to process feedback. Please try again later."));
        }
    }

    private Map<String, Object> createErrorResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", false);
        response.put("message", message);
        response.put("timestamp", LocalDateTime.now());
        return response;
    }

    // Inner class for request body
    public static class FeedbackRequest {
        private String name;
        private String email;
        private String subject;
        private String message;

        // Getters and setters
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getSubject() { return subject; }
        public void setSubject(String subject) { this.subject = subject; }

        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
