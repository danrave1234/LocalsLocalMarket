package org.localslocalmarket.service;

import org.localslocalmarket.model.Shop;
import org.localslocalmarket.web.dto.OrderDtos.OrderRequestDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.math.RoundingMode;
import java.util.stream.Collectors;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:}")
    private String configuredFrom;

    @Value("${spring.mail.username:}")
    private String mailUsername;

    @Value("${app.mail.reply-to-customer:true}")
    private boolean replyToCustomer;

    @Value("${app.feedback.to:}")
    private String feedbackTo;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    private String resolveFrom() {
        if (configuredFrom != null && !configuredFrom.isBlank()) return configuredFrom;
        if (mailUsername != null && !mailUsername.isBlank()) return mailUsername;
        return "no-reply@localhost"; // last-resort safe default
    }

    public void sendOrderEmail(@NonNull Shop shop, @NonNull OrderRequestDto order) {
        if (shop.getEmail() == null || shop.getEmail().isBlank()) {
            throw new IllegalStateException("Shop does not have an email configured");
        }

        String subject = "New Order from " + order.getSenderEmail() + " - " + shop.getName();
        String body = buildOrderBody(shop, order);

        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(shop.getEmail());
        msg.setSubject(subject);
        msg.setText(body);
        // Use a verified/allowed From address to avoid SMTP 553 relaying errors
        String from = resolveFrom();
        msg.setFrom(from);
        if (replyToCustomer && order.getSenderEmail() != null && !order.getSenderEmail().isBlank()) {
            try { msg.setReplyTo(order.getSenderEmail()); } catch (Exception ignored) {}
        }
        try {
            mailSender.send(msg);
            log.info("Order email sent to {} for shop {} (from={})", shop.getEmail(), shop.getId(), from);
        } catch (MailException ex) {
            log.error("Failed to send order email to {}: {}", shop.getEmail(), ex.getMessage(), ex);
            throw ex;
        }
    }

    public void sendWelcomeEmail(String email, String name) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(email);
        msg.setFrom(resolveFrom());
        msg.setSubject("Welcome to LocalsLocalMarket");
        msg.setText("Hi " + (name != null ? name : "there") + ",\n\n" +
                "Welcome to LocalsLocalMarket! We're excited to have you on board.\n\n" +
                "Best regards,\nLocalsLocalMarket Team");
        try {
            mailSender.send(msg);
        } catch (Exception e) {
            log.warn("Failed to send welcome email to {}: {}", email, e.getMessage());
        }
    }

    public void sendPasswordResetEmail(String email, String tokenOrLink, String name) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(email);
        msg.setFrom(resolveFrom());
        msg.setSubject("Password Reset Instructions");
        String resetLine = tokenOrLink;
        // Build a basic message; frontend/backoffice will construct link using token if needed
        msg.setText("Hi " + (name != null ? name : "there") + ",\n\n" +
                "We received a request to reset your password.\n" +
                "Use this token or link to reset your password: " + resetLine + "\n\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "Best regards,\nLocalsLocalMarket Team");
        try {
            mailSender.send(msg);
        } catch (Exception e) {
            log.warn("Failed to send password reset email to {}: {}", email, e.getMessage());
        }
    }

    public void sendFeedbackEmail(String fromEmail, String fromName, String subject, String message, String replyTo) {
        SimpleMailMessage msg = new SimpleMailMessage();
        // Send to site support email; if not configured, fallback to resolved From address
        String supportTo = (feedbackTo != null && !feedbackTo.isBlank()) ? feedbackTo : resolveFrom();
        msg.setTo(supportTo);
        msg.setFrom(resolveFrom());
        if (replyTo != null && !replyTo.isBlank()) {
            try { msg.setReplyTo(replyTo); } catch (Exception ignored) {}
        }
        msg.setSubject(subject != null && !subject.isBlank() ? subject : "New Feedback");
        StringBuilder body = new StringBuilder();
        body.append("Feedback received from ").append(fromName != null ? fromName : "Anonymous").append(" <")
                .append(fromEmail != null ? fromEmail : "no-email").append(">\n\n");
        body.append(message != null ? message : "(no message)").append("\n\n");
        if (replyTo != null && !replyTo.isBlank()) {
            body.append("Reply-To (user): ").append(replyTo).append("\n");
        }
        msg.setText(body.toString());
        try {
            mailSender.send(msg);
        } catch (Exception e) {
            log.warn("Failed to send feedback email notification: {}", e.getMessage());
        }
    }

    public void sendShopWarningEmail(String ownerEmail, String ownerName, String shopName, String reason) {
        SimpleMailMessage msg = new SimpleMailMessage();
        msg.setTo(ownerEmail);
        msg.setFrom(resolveFrom());
        msg.setSubject("Important: Notice Regarding Your Shop");
        msg.setText("Hello " + (ownerName != null ? ownerName : "Shop Owner") + ",\n\n" +
                "This is a notice regarding your shop '" + (shopName != null ? shopName : "your shop") + "'.\n" +
                (reason != null && !reason.isBlank() ? ("Reason: " + reason + "\n\n") : "") +
                "Please review and take appropriate action if needed.\n\n" +
                "Regards,\nLocalsLocalMarket Team");
        try {
            mailSender.send(msg);
        } catch (Exception e) {
            log.warn("Failed to send shop warning email to {}: {}", ownerEmail, e.getMessage());
        }
    }

    private String buildOrderBody(Shop shop, OrderRequestDto order) {
        String itemsText = order.getItems().stream().map(i ->
                "- " + i.getName() + " | Qty: " + i.getQuantity() + " | Unit: " + i.getUnitPrice().setScale(2, RoundingMode.HALF_UP) +
                " | Line: " + i.getLineTotal().setScale(2, RoundingMode.HALF_UP)
        ).collect(Collectors.joining("\n"));

        StringBuilder sb = new StringBuilder();
        sb.append("You have a new order on LocalsLocalMarket\n\n");
        sb.append("Shop: ").append(shop.getName()).append(" (ID: ").append(shop.getId()).append(")\n\n");
        sb.append("From (customer email): ").append(order.getSenderEmail()).append("\n");
        if (order.getMessage() != null && !order.getMessage().isBlank()) {
            sb.append("Message: ").append(order.getMessage()).append("\n");
        }
        sb.append("\nItems:\n").append(itemsText).append("\n\n");
        sb.append("Total: ").append(order.getTotal().setScale(2, RoundingMode.HALF_UP)).append("\n\n");
        sb.append("Note: This email is a notification. Stocks were not reduced automatically. Please contact the sender to confirm and arrange payment/delivery.\n");
        return sb.toString();
    }
}
