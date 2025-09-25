package org.localslocalmarket.service;

import java.math.RoundingMode;
import java.util.stream.Collectors;

import org.localslocalmarket.model.Shop;
import org.localslocalmarket.web.dto.OrderDtos.OrderRequestDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

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

    @Value("${llm.seo.site.url:https://www.localslocalmarket.com}")
    private String siteUrl;
    @Value("${llm.brand.logo-path:/LogoWithBG.svg}")
    private String brandLogoPath;

    public void sendEmailVerificationCode(String email, String code, String name) {
        try {
            MimeMessage mime = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mime, "UTF-8");
            helper.setTo(email);
            helper.setFrom(resolveFrom());
            helper.setSubject("Verify your email address");

            String displayName = (name != null && !name.isBlank()) ? name : "there";
            String safeCode = code == null ? "" : code;

            String logoSrc = (siteUrl != null ? siteUrl : "") + (brandLogoPath != null ? brandLogoPath : "/LogoWithBG.svg");
            String html = "" +
                "<table role='presentation' cellpadding='0' cellspacing='0' width='100%' style='background:#0b0b12;padding:24px;font-family:Inter,Segoe UI,Arial,sans-serif;color:#e5e7eb;'>" +
                "  <tr><td align='center'>" +
                "    <table role='presentation' cellpadding='0' cellspacing='0' width='100%' style='max-width:640px;background:linear-gradient(135deg,#0f1020,#121329);border:1px solid #2a2b45;border-radius:16px;overflow:hidden;'>" +
                "      <tr><td style='padding:28px 28px 0 28px;'>" +
                "        <table role='presentation' cellpadding='0' cellspacing='0' width='100%'><tr>" +
                "          <td style='vertical-align:middle'>" +
                "            <img src='" + logoSrc + "' alt='LocalsLocalMarket' width='120' height='auto' style='display:block;border:0;outline:none;text-decoration:none;max-width:120px;'>" +
                "          </td>" +
                "        </tr></table>" +
                "        <h1 style='margin:18px 0 8px 0;color:#e5e7eb;font-size:22px;'>Verify your email</h1>" +
                "        <p style='margin:0 0 16px 0;color:#9ca3af;font-size:14px;'>Hi " + displayName + ",</p>" +
                "        <p style='margin:0 0 16px 0;color:#cbd5e1;font-size:14px;'>Use the one-time code below to verify your email address for <a href='" + siteUrl + "' style='color:#a5b4fc;text-decoration:none;'>LocalsLocalMarket</a>.</p>" +
                "        <div style='margin:20px 0;padding:16px;border:1px solid #2a2b45;border-radius:12px;background:linear-gradient(135deg,rgba(99,102,241,0.08),rgba(139,92,246,0.08));text-align:center;'>" +
                "          <div style='font-size:28px;letter-spacing:6px;color:#ffffff;font-weight:700;'>" + safeCode + "</div>" +
                "          <div style='margin-top:8px;color:#9ca3af;font-size:12px;'>Code expires in 10 minutes</div>" +
                "        </div>" +
                "        <p style='margin:0 0 12px 0;color:#94a3b8;font-size:13px;'>If you didn’t request this, you can safely ignore this email.</p>" +
                "        <p style='margin:0 0 24px 0;color:#94a3b8;font-size:13px;'>Best regards,<br/>LocalsLocalMarket Team</p>" +
                "      </td></tr>" +
                "      <tr><td style='height:1px;background:linear-gradient(90deg,transparent,#4f46e5,transparent);'></td></tr>" +
                "      <tr><td style='padding:16px 28px 28px 28px;color:#6b7280;font-size:12px;'>" +
                "        <div>This email was sent to <span style='color:#a1a1aa;'>" + email + "</span>.</div>" +
                "      </td></tr>" +
                "    </table>" +
                "  </td></tr>" +
                "</table>";

            helper.setText(html, true);
            mailSender.send(mime);
        } catch (Exception e) {
            log.warn("Failed to send verification email to {}: {}", email, e.getMessage());
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
