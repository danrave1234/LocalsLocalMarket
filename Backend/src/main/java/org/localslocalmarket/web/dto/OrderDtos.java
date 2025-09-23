package org.localslocalmarket.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

public class OrderDtos {

    public static class CartItemDto {
        @NotNull
        private Long serviceId; // optional check server-side
        @NotBlank
        private String name;
        @NotNull
        @Min(1)
        private Integer quantity;
        @NotNull
        private BigDecimal unitPrice; // price at time of order (for email display)

        public Long getServiceId() { return serviceId; }
        public void setServiceId(Long serviceId) { this.serviceId = serviceId; }
        public String getName() { return name; }
        public void setName(String name) { this.name = name; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public BigDecimal getUnitPrice() { return unitPrice; }
        public void setUnitPrice(BigDecimal unitPrice) { this.unitPrice = unitPrice; }

        public BigDecimal getLineTotal(){
            if (unitPrice == null || quantity == null) return BigDecimal.ZERO;
            return unitPrice.multiply(BigDecimal.valueOf(quantity));
        }
    }

    public static class OrderRequestDto {
        @NotNull
        private Long shopId;
        @NotBlank
        @Email
        private String senderEmail;
        private String message; // optional
        @NotEmpty
        private List<CartItemDto> items;

        public Long getShopId() { return shopId; }
        public void setShopId(Long shopId) { this.shopId = shopId; }
        public String getSenderEmail() { return senderEmail; }
        public void setSenderEmail(String senderEmail) { this.senderEmail = senderEmail; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public List<CartItemDto> getItems() { return items; }
        public void setItems(List<CartItemDto> items) { this.items = items; }

        public BigDecimal getTotal(){
            return items == null ? BigDecimal.ZERO : items.stream()
                    .map(CartItemDto::getLineTotal)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
        }
    }

    public static class OrderResponseDto {
        private String status;
        private String message;

        public OrderResponseDto() {}
        public OrderResponseDto(String status, String message) {
            this.status = status;
            this.message = message;
        }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
