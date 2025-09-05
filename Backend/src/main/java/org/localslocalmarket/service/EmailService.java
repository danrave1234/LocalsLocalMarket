package org.localslocalmarket.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${llm.email.from}")
    private String fromEmail;

    @Value("${llm.email.from-name}")
    private String fromName;

    @Value("${llm.email.enabled}")
    private boolean emailEnabled;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String toEmail, String resetToken, String userName) {
        if (!emailEnabled) {
            // Log that email is disabled in development
            System.out.println("Email disabled - would send password reset to: " + toEmail);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Password Reset Request - LocalsLocalMarket");

            String htmlContent = createPasswordResetHtml(userName, resetToken);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send password reset email", e);
        }
    }

    public void sendWelcomeEmail(String toEmail, String userName) {
        if (!emailEnabled) {
            System.out.println("Email disabled - would send welcome email to: " + toEmail);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Welcome to LocalsLocalMarket!");

            String htmlContent = createWelcomeHtml(userName);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send welcome email", e);
        }
    }

    public void sendShopApprovalEmail(String toEmail, String userName, String shopName) {
        if (!emailEnabled) {
            System.out.println("Email disabled - would send shop approval email to: " + toEmail);
            return;
        }

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("Shop Approved - " + shopName);

            String htmlContent = createShopApprovalHtml(userName, shopName);
            helper.setText(htmlContent, true);

            mailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send shop approval email", e);
        }
    }

    public void sendFeedbackEmail(String fromEmail, String fromName, String subject, String message, String userEmail) {
        if (!emailEnabled) {
            System.out.println("Email disabled - would send feedback email from: " + fromEmail + " to: Danravekeh123@gmail.com");
            return;
        }

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            // Send to your email
            helper.setFrom("no-reply@localslocalmarket.com");
            helper.setTo("Danravekeh123@gmail.com");
            helper.setSubject("New Feedback: " + (subject != null && !subject.trim().isEmpty() ? subject : "No Subject"));

            String htmlContent = createFeedbackHtml(fromName, fromEmail, subject, message, userEmail);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
        } catch (MessagingException e) {
            throw new RuntimeException("Failed to send feedback email", e);
        }
    }

    private String createPasswordResetHtml(String userName, String resetToken) {
        return "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
                "<meta charset=\"UTF-8\">" +
                "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "<title>Password Reset</title>" +
                "<style>" +
                    "* { margin: 0; padding: 0; box-sizing: border-box; }" +
                    "body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f8fafc; }" +
                    ".container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1); }" +
                    ".header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; position: relative; }" +
                    ".header::before { content: ''; position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><defs><pattern id=\"grain\" width=\"100\" height=\"100\" patternUnits=\"userSpaceOnUse\"><circle cx=\"25\" cy=\"25\" r=\"1\" fill=\"rgba(255,255,255,0.1)\"/><circle cx=\"75\" cy=\"75\" r=\"1\" fill=\"rgba(255,255,255,0.1)\"/><circle cx=\"50\" cy=\"10\" r=\"0.5\" fill=\"rgba(255,255,255,0.1)\"/></pattern></defs><rect width=\"100\" height=\"100\" fill=\"url(%23grain)\"/></svg>'); opacity: 0.3; }" +
                    ".header h1 { color: white; font-size: 2.5rem; font-weight: 700; margin-bottom: 10px; position: relative; z-index: 1; }" +
                    ".header p { color: rgba(255, 255, 255, 0.9); font-size: 1.1rem; position: relative; z-index: 1; }" +
                    ".content { padding: 40px 30px; }" +
                    ".greeting { font-size: 1.3rem; font-weight: 600; color: #2d3748; margin-bottom: 20px; }" +
                    ".message { color: #4a5568; margin-bottom: 30px; font-size: 1rem; }" +
                    ".button-container { text-align: center; margin: 40px 0; }" +
                    ".button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 16px 32px; text-decoration: none; border-radius: 50px; font-weight: 600; font-size: 1.1rem; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3); transition: all 0.3s ease; }" +
                    ".button:hover { transform: translateY(-2px); box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4); }" +
                    ".warning { background: #fff5f5; border: 1px solid #fed7d7; border-radius: 12px; padding: 20px; margin: 30px 0; }" +
                    ".warning h3 { color: #c53030; font-size: 1.1rem; margin-bottom: 10px; }" +
                    ".warning p { color: #742a2a; font-size: 0.95rem; }" +
                    ".footer { background: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0; }" +
                    ".footer p { color: #718096; font-size: 0.9rem; }" +
                    ".logo { font-size: 1.2rem; font-weight: 700; color: #667eea; }" +
                    "@media (max-width: 600px) { .container { margin: 10px; border-radius: 12px; } .header { padding: 30px 20px; } .header h1 { font-size: 2rem; } .content { padding: 30px 20px; } }" +
                "</style>" +
            "</head>" +
            "<body>" +
                "<div class=\"container\">" +
                    "<div class=\"header\">" +
                        "<h1>🔐 Password Reset</h1>" +
                        "<p>Secure your account</p>" +
                    "</div>" +
                    "<div class=\"content\">" +
                        "<div class=\"greeting\">Hello " + userName + ",</div>" +
                        "<div class=\"message\">" +
                            "<p>We received a request to reset your password for your <strong>LocalsLocalMarket</strong> account.</p>" +
                            "<p>Click the button below to securely reset your password:</p>" +
                        "</div>" +
                                                 "<div class=\"button-container\">" +
                             "<a href=\"https://localslocalmarket.com/reset-password?token=" + resetToken + "\" class=\"button\">" +
                                 "🔄 Reset My Password" +
                             "</a>" +
                         "</div>" +
                        "<div class=\"warning\">" +
                            "<h3>⚠️ Security Notice</h3>" +
                            "<p>• If you didn't request this password reset, please ignore this email.</p>" +
                            "<p>• This link will expire in 24 hours for security reasons.</p>" +
                            "<p>• Never share this link with anyone.</p>" +
                        "</div>" +
                    "</div>" +
                    "<div class=\"footer\">" +
                        "<p>This email was sent from <span class=\"logo\">LocalsLocalMarket</span></p>" +
                        "<p>Please do not reply to this email</p>" +
                    "</div>" +
                "</div>" +
            "</body>" +
            "</html>";
    }

    private String createWelcomeHtml(String userName) {
        return "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
                "<meta charset=\"UTF-8\">" +
                "<title>Welcome to LocalsLocalMarket</title>" +
                "<style>" +
                    "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                    ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                    ".header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }" +
                    ".content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }" +
                    ".button { display: inline-block; background: #6366f1; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }" +
                    ".footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }" +
                "</style>" +
            "</head>" +
            "<body>" +
                "<div class=\"container\">" +
                    "<div class=\"header\">" +
                        "<h1>Welcome to LocalsLocalMarket!</h1>" +
                        "<p>Your local business marketplace</p>" +
                    "</div>" +
                    "<div class=\"content\">" +
                        "<h2>Hello " + userName + ",</h2>" +
                        "<p>Welcome to LocalsLocalMarket! We're excited to have you join our community of local businesses.</p>" +
                        "<p>With your account, you can:</p>" +
                        "<ul>" +
                            "<li>Create and manage your business profile</li>" +
                            "<li>Add products and services</li>" +
                            "<li>Connect with local customers</li>" +
                            "<li>Track your business performance</li>" +
                        "</ul>" +
                                                 "<a href=\"https://localslocalmarket.com/dashboard\" class=\"button\">Get Started</a>" +
                        "<p>If you have any questions, feel free to reach out to our support team.</p>" +
                    "</div>" +
                    "<div class=\"footer\">" +
                        "<p>Thank you for choosing LocalsLocalMarket!</p>" +
                    "</div>" +
                "</div>" +
            "</body>" +
            "</html>";
    }

    private String createShopApprovalHtml(String userName, String shopName) {
        return "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
                "<meta charset=\"UTF-8\">" +
                "<title>Shop Approved</title>" +
                "<style>" +
                    "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }" +
                    ".container { max-width: 600px; margin: 0 auto; padding: 20px; }" +
                    ".header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }" +
                    ".content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }" +
                    ".button { display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }" +
                    ".footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }" +
                "</style>" +
            "</head>" +
            "<body>" +
                "<div class=\"container\">" +
                    "<div class=\"header\">" +
                        "<h1>Shop Approved!</h1>" +
                        "<p>Your business is now live on LocalsLocalMarket</p>" +
                    "</div>" +
                    "<div class=\"content\">" +
                        "<h2>Congratulations " + userName + ",</h2>" +
                        "<p>Your shop <strong>" + shopName + "</strong> has been approved and is now live on LocalsLocalMarket!</p>" +
                        "<p>Customers can now discover your business and view your products and services.</p>" +
                                                 "<a href=\"https://localslocalmarket.com/dashboard\" class=\"button\">Manage Your Shop</a>" +
                        "<p>Start adding products and services to attract more customers to your business.</p>" +
                    "</div>" +
                    "<div class=\"footer\">" +
                        "<p>Thank you for being part of LocalsLocalMarket!</p>" +
                    "</div>" +
                "</div>" +
            "</body>" +
            "</html>";
    }

    private String createFeedbackHtml(String fromName, String fromEmail, String subject, String message, String userEmail) {
        return "<!DOCTYPE html>" +
            "<html>" +
            "<head>" +
                "<meta charset=\"UTF-8\">" +
                "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">" +
                "<title>New Feedback Received</title>" +
                "<style>" +
                    "body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; background: #f8fafc; margin: 0; padding: 20px; }" +
                    ".container { max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1); }" +
                    ".header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white; }" +
                    ".header h1 { margin: 0; font-size: 1.8rem; font-weight: 600; }" +
                    ".content { padding: 30px; }" +
                    ".feedback-item { margin-bottom: 20px; padding: 15px; background: #f8fafc; border-radius: 8px; border-left: 4px solid #667eea; }" +
                    ".feedback-label { font-weight: 600; color: #4a5568; margin-bottom: 5px; }" +
                    ".feedback-value { color: #2d3748; }" +
                    ".message-content { background: #f7fafc; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; margin-top: 10px; white-space: pre-wrap; }" +
                    ".footer { background: #f7fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0; color: #718096; font-size: 0.9rem; }" +
                "</style>" +
            "</head>" +
            "<body>" +
                "<div class=\"container\">" +
                    "<div class=\"header\">" +
                        "<h1>💬 New Feedback Received</h1>" +
                        "<p>LocalsLocalMarket Platform</p>" +
                    "</div>" +
                    "<div class=\"content\">" +
                        "<div class=\"feedback-item\">" +
                            "<div class=\"feedback-label\">From:</div>" +
                            "<div class=\"feedback-value\">" + fromName + " (" + fromEmail + ")</div>" +
                        "</div>" +
                        (subject != null && !subject.trim().isEmpty() ? 
                            "<div class=\"feedback-item\">" +
                                "<div class=\"feedback-label\">Subject:</div>" +
                                "<div class=\"feedback-value\">" + subject + "</div>" +
                            "</div>" : "") +
                        "<div class=\"feedback-item\">" +
                            "<div class=\"feedback-label\">Message:</div>" +
                            "<div class=\"message-content\">" + message + "</div>" +
                        "</div>" +
                    "</div>" +
                    "<div class=\"footer\">" +
                        "<p>This feedback was sent through the LocalsLocalMarket platform</p>" +
                        "<p>Reply directly to: " + fromEmail + "</p>" +
                    "</div>" +
                "</div>" +
            "</body>" +
            "</html>";
    }
}
