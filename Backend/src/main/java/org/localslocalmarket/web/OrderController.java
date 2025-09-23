package org.localslocalmarket.web;

import org.localslocalmarket.model.Shop;
import org.localslocalmarket.repo.ShopRepository;
import org.localslocalmarket.service.EmailService;
import org.localslocalmarket.web.dto.OrderDtos.OrderRequestDto;
import org.localslocalmarket.web.dto.OrderDtos.OrderResponseDto;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/orders")
@Validated
public class OrderController {

    private final ShopRepository shopRepository;
    private final EmailService emailService;

    @Value("${app.orders.require-auth:false}")
    private boolean requireAuthToOrder;

    public OrderController(ShopRepository shopRepository, EmailService emailService) {
        this.shopRepository = shopRepository;
        this.emailService = emailService;
    }

    @PostMapping
    public ResponseEntity<OrderResponseDto> placeOrder(@Valid @RequestBody OrderRequestDto request) {
        // Optional authentication gate based on configuration
        if (requireAuthToOrder && !isUserAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(new OrderResponseDto("error", "Authentication required to place orders"));
        }

        Shop shop = shopRepository.findById(request.getShopId())
                .orElse(null);
        if (shop == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(new OrderResponseDto("error", "Shop not found"));
        }
        if (shop.getEmail() == null || shop.getEmail().isBlank()) {
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY)
                    .body(new OrderResponseDto("error", "Shop does not have an email configured"));
        }

        emailService.sendOrderEmail(shop, request);
        return ResponseEntity.status(HttpStatus.ACCEPTED)
                .body(new OrderResponseDto("ok", "Order sent to shop via email"));
    }

    private boolean isUserAuthenticated() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated()) return false;
        return !(auth instanceof AnonymousAuthenticationToken);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<OrderResponseDto> handleError(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new OrderResponseDto("error", ex.getMessage()));
    }
}
